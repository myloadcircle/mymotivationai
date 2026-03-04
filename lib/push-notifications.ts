// Push Notification Utility for myMotivationAI
// Provides browser push notification capabilities for re-engagement

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private permission: NotificationPermission = 'default';
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {
    this.initialize();
  }

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  private async initialize(): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Push notifications not supported in this browser');
      return;
    }

    this.permission = Notification.permission;

    // Register service worker for push notifications
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered for push notifications');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
      
      // Track permission request
      this.trackPermissionRequest(this.permission);
    }

    return this.permission;
  }

  async sendNotification(options: PushNotificationOptions): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return;
    }

    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    // Create notification options - using type assertion for service worker compatibility
    const notificationOptions: any = {
      body: options.body,
      icon: options.icon || '/icons/icon-192x192.png',
      badge: options.badge || '/icons/icon-72x72.png',
      tag: options.tag,
      data: options.data,
      requireInteraction: options.requireInteraction || false,
    };

    // Add actions if provided (for service worker notifications)
    if (options.actions && options.actions.length > 0) {
      notificationOptions.actions = options.actions;
    }

    // Try to use service worker for persistent notifications
    if (this.serviceWorkerRegistration) {
      try {
        await this.serviceWorkerRegistration.showNotification(
          options.title,
          notificationOptions
        );
        this.trackNotificationSent('service_worker', options);
      } catch (error) {
        console.warn('Service worker notification failed, falling back to direct:', error);
        this.sendDirectNotification(options.title, notificationOptions);
      }
    } else {
      this.sendDirectNotification(options.title, notificationOptions);
    }
  }

  private sendDirectNotification(title: string, options: NotificationOptions): void {
    const notification = new Notification(title, options);
    
    notification.onclick = () => {
      window.focus();
      notification.close();
      
      // Handle notification click
      if (options.data?.url) {
        window.location.href = options.data.url;
      }
      
      this.trackNotificationClick('direct');
    };

    this.trackNotificationSent('direct', { title, ...options });
  }

  async scheduleNotification(
    options: PushNotificationOptions,
    triggerTime: Date
  ): Promise<void> {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('Scheduled notifications not supported');
      return;
    }

    // For scheduled notifications, we need to use the service worker
    if (!this.serviceWorkerRegistration) {
      console.warn('Service worker not available for scheduled notifications');
      return;
    }

    const delay = triggerTime.getTime() - Date.now();
    
    if (delay <= 0) {
      // Send immediately if time has passed
      await this.sendNotification(options);
      return;
    }

    // Store notification in IndexedDB for scheduling
    await this.storeScheduledNotification(options, triggerTime);
    
    // In a production app, you would set up background sync or alarms
    // For now, we'll use setTimeout (not ideal for background)
    setTimeout(async () => {
      await this.sendNotification(options);
      await this.removeScheduledNotification(options.tag);
    }, delay);

    this.trackNotificationScheduled(options, triggerTime);
  }

  // Smart notification templates
  getNotificationTemplates() {
    return {
      goalReminder: (goalTitle: string, daysLeft: number) => ({
        title: 'Goal Reminder 🎯',
        body: `Don't forget about "${goalTitle}"! ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left to complete it.`,
        tag: `goal-reminder-${goalTitle}`,
        data: { type: 'goal_reminder', goalTitle },
        requireInteraction: false,
      }),
      
      streakEncouragement: (streakDays: number) => ({
        title: 'Streak Alert! 🔥',
        body: `You're on a ${streakDays}-day streak! Keep up the amazing work.`,
        tag: `streak-${streakDays}`,
        data: { type: 'streak_encouragement', streakDays },
        requireInteraction: false,
      }),
      
      achievementUnlocked: (achievementName: string) => ({
        title: 'Achievement Unlocked! ⭐',
        body: `Congratulations! You've unlocked the "${achievementName}" achievement.`,
        tag: `achievement-${achievementName}`,
        data: { type: 'achievement', achievementName },
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'View Achievement',
          },
        ],
      }),
      
      dailyMotivation: (quote: string, author?: string) => ({
        title: 'Daily Motivation 💭',
        body: author ? `"${quote}" - ${author}` : `"${quote}"`,
        tag: 'daily-motivation',
        data: { type: 'daily_motivation', quote, author },
        requireInteraction: false,
      }),
      
      progressUpdate: (progressPercent: number, goalTitle: string) => ({
        title: 'Progress Update 📈',
        body: `You're ${progressPercent}% complete with "${goalTitle}"!`,
        tag: `progress-${goalTitle}`,
        data: { type: 'progress_update', goalTitle, progressPercent },
        requireInteraction: false,
      }),
    };
  }

  // Analytics tracking
  private trackPermissionRequest(permission: NotificationPermission): void {
    const eventData = {
      event: 'push_permission_request',
      permission,
      timestamp: new Date().toISOString(),
    };

    this.sendAnalyticsEvent(eventData);
  }

  private trackNotificationSent(method: string, options: any): void {
    const eventData = {
      event: 'push_notification_sent',
      method,
      notification_type: options.data?.type || 'custom',
      title: options.title,
      timestamp: new Date().toISOString(),
    };

    this.sendAnalyticsEvent(eventData);
  }

  private trackNotificationScheduled(options: any, triggerTime: Date): void {
    const eventData = {
      event: 'push_notification_scheduled',
      notification_type: options.data?.type || 'custom',
      trigger_time: triggerTime.toISOString(),
      timestamp: new Date().toISOString(),
    };

    this.sendAnalyticsEvent(eventData);
  }

  private trackNotificationClick(method: string): void {
    const eventData = {
      event: 'push_notification_click',
      method,
      timestamp: new Date().toISOString(),
    };

    this.sendAnalyticsEvent(eventData);
  }

  private async sendAnalyticsEvent(eventData: any): Promise<void> {
    try {
      await fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'push_notification_event',
          eventData,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Storage for scheduled notifications (simplified)
  private async storeScheduledNotification(
    options: PushNotificationOptions,
    triggerTime: Date
  ): Promise<void> {
    try {
      const notifications = JSON.parse(
        localStorage.getItem('scheduled_notifications') || '[]'
      );
      
      notifications.push({
        ...options,
        triggerTime: triggerTime.toISOString(),
        createdAt: new Date().toISOString(),
      });
      
      localStorage.setItem('scheduled_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to store scheduled notification:', error);
    }
  }

  private async removeScheduledNotification(tag?: string): Promise<void> {
    try {
      if (!tag) return;
      
      const notifications = JSON.parse(
        localStorage.getItem('scheduled_notifications') || '[]'
      );
      
      const filtered = notifications.filter((n: any) => n.tag !== tag);
      localStorage.setItem('scheduled_notifications', JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove scheduled notification:', error);
    }
  }

  // Utility methods
  isSupported(): boolean {
    return 'Notification' in window;
  }

  hasPermission(): boolean {
    return this.permission === 'granted';
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  async getScheduledNotifications(): Promise<any[]> {
    try {
      return JSON.parse(localStorage.getItem('scheduled_notifications') || '[]');
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }
}

// Export singleton instance
export const pushNotificationService = PushNotificationService.getInstance();

// React hook for push notifications
export function usePushNotifications() {
  const service = pushNotificationService;

  const requestPermission = async () => {
    return await service.requestPermission();
  };

  const sendNotification = async (options: PushNotificationOptions) => {
    return await service.sendNotification(options);
  };

  const scheduleNotification = async (options: PushNotificationOptions, triggerTime: Date) => {
    return await service.scheduleNotification(options, triggerTime);
  };

  const getTemplates = () => {
    return service.getNotificationTemplates();
  };

  const isSupported = service.isSupported();
  const hasPermission = service.hasPermission();
  const permissionStatus = service.getPermissionStatus();

  return {
    requestPermission,
    sendNotification,
    scheduleNotification,
    getTemplates,
    isSupported,
    hasPermission,
    permissionStatus,
  };
}

export default pushNotificationService;