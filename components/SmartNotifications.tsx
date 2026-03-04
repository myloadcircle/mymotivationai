'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Zap,
  Clock,
  Target,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'reminder' | 'encouragement' | 'suggestion' | 'celebration' | 'warning';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: Date;
  metadata?: {
    goalId?: string;
    actionUrl?: string;
    triggerTime?: Date;
  };
}

interface SmartNotificationsProps {
  userId?: string;
  maxNotifications?: number;
  autoDismiss?: boolean;
  dismissTime?: number; // milliseconds
}

export default function SmartNotifications({
  userId,
  maxNotifications = 5,
  autoDismiss = true,
  dismissTime = 5000
}: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (autoDismiss && notifications.length > 0) {
      const timer = setTimeout(() => {
        dismissOldNotifications();
      }, dismissTime);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, autoDismiss, dismissTime]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, this would fetch from the API
      // For demo purposes, we'll use mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'reminder',
          title: 'Deadline Approaching',
          message: 'Your goal "Complete React Course" is due in 2 days',
          priority: 'high',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          metadata: {
            goalId: 'goal-123',
            actionUrl: '/goals/goal-123',
          },
        },
        {
          id: '2',
          type: 'suggestion',
          title: 'Personalized Suggestion',
          message: 'Based on your morning productivity, schedule important tasks before 11 AM',
          priority: 'medium',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        },
        {
          id: '3',
          type: 'celebration',
          title: 'Milestone Achieved!',
          message: 'You\'ve maintained a 7-day streak! Keep up the great work!',
          priority: 'low',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          id: '4',
          type: 'encouragement',
          title: 'Stay Motivated',
          message: 'You\'re making progress even when it doesn\'t feel like it. Every small step counts!',
          priority: 'medium',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        },
        {
          id: '5',
          type: 'warning',
          title: 'Low Completion Rate',
          message: 'Your goal completion rate has dropped to 45%. Consider adjusting your goals.',
          priority: 'high',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissOldNotifications = () => {
    setNotifications(prev => 
      prev.filter(notification => 
        notification.priority === 'high' || 
        Date.now() - notification.createdAt.getTime() < dismissTime
      )
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return <Clock className="h-5 w-5" />;
      case 'encouragement':
        return <MessageCircle className="h-5 w-5" />;
      case 'suggestion':
        return <Zap className="h-5 w-5" />;
      case 'celebration':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-100 text-blue-800';
      case 'encouragement':
        return 'bg-green-100 text-green-800';
      case 'suggestion':
        return 'bg-yellow-100 text-yellow-800';
      case 'celebration':
        return 'bg-purple-100 text-purple-800';
      case 'warning':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'low':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const displayedNotifications = showAll 
    ? notifications 
    : notifications.slice(0, maxNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Bell className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">No New Notifications</h3>
        <p className="text-gray-600 text-sm">
          You're all caught up! Check back later for personalized insights.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Smart Notifications</h2>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  {highPriorityCount} urgent
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  {unreadCount} unread
                </span>
                <span>{notifications.length} total</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                }}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={dismissAll}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Dismiss all
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-100">
        {displayedNotifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 transition-colors hover:bg-gray-50 ${
              notification.read ? 'opacity-75' : ''
            } ${getPriorityColor(notification.priority)}`}
          >
            <div className="flex items-start">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg ${getNotificationColor(notification.type)} flex items-center justify-center mr-3 flex-shrink-0`}>
                {getNotificationIcon(notification.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900 truncate">
                    {notification.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-3">
                  {notification.message}
                </p>
                
                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Mark as read
                    </button>
                  )}
                  
                  {notification.metadata?.actionUrl && (
                    <a
                      href={notification.metadata.actionUrl}
                      className="text-sm text-green-600 hover:text-green-800 font-medium"
                    >
                      View Goal →
                    </a>
                  )}
                  
                  {notification.type === 'suggestion' && (
                    <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                      Apply Suggestion
                    </button>
                  )}
                </div>
              </div>
              
              {/* Dismiss Button */}
              <button
                onClick={() => dismissNotification(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {notifications.length > maxNotifications && !showAll && (
        <div className="border-t border-gray-200 p-4 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Show all {notifications.length} notifications
          </button>
        </div>
      )}

      {showAll && notifications.length > maxNotifications && (
        <div className="border-t border-gray-200 p-4 text-center">
          <button
            onClick={() => setShowAll(false)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Show less
          </button>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Notifications are personalized based on your goal patterns
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

// Hook for managing notifications
export function useSmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const dismissNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    dismissNotification,
    clearAll,
  };
}