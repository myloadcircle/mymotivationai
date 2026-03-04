import { trackEvent } from './analytics';

export interface ConversionEvent {
  eventType: ConversionEventType;
  userId?: string;
  plan?: string;
  fromPlan?: string;
  toPlan?: string;
  amount?: number;
  billingPeriod?: 'monthly' | 'yearly';
  metadata?: Record<string, any>;
}

export type ConversionEventType =
  | 'free_signup'
  | 'paid_signup'
  | 'free_to_basic_upgrade'
  | 'free_to_pro_upgrade'
  | 'basic_to_pro_upgrade'
  | 'downgrade_to_free'
  | 'trial_started'
  | 'trial_converted'
  | 'trial_expired'
  | 'churn'
  | 'reactivation'
  | 'upgrade_viewed'
  | 'upgrade_clicked'
  | 'pricing_page_viewed'
  | 'checkout_started'
  | 'checkout_completed'
  | 'checkout_failed';

export class ConversionAnalytics {
  /**
   * Track a conversion event
   */
  static async track(event: ConversionEvent): Promise<void> {
    try {
      // Add timestamp and session info
      // Generate IDs for tracking
      const generateId = (): string => {
        return 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
      };
      
      const sessionId = typeof window !== 'undefined' 
        ? sessionStorage.getItem('analytics_session_id') || generateId()
        : generateId();
      
      const pageViewId = generateId();

      const fullEvent = {
        ...event,
        timestamp: new Date().toISOString(),
        sessionId,
        pageViewId,
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof window !== 'undefined' ? document.referrer : '',
      };

      // Send to analytics endpoint
      await fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullEvent),
      });

      console.log(`📊 Conversion event tracked: ${event.eventType}`);
    } catch (error) {
      console.error('Failed to track conversion event:', error);
    }
  }

  /**
   * Track free user signup
   */
  static trackFreeSignup(userId: string, email: string): void {
    this.track({
      eventType: 'free_signup',
      userId,
      plan: 'free',
      metadata: { email },
    });
  }

  /**
   * Track paid subscription signup
   */
  static trackPaidSignup(
    userId: string,
    plan: string,
    billingPeriod: 'monthly' | 'yearly',
    amount: number
  ): void {
    this.track({
      eventType: 'paid_signup',
      userId,
      plan,
      billingPeriod,
      amount,
    });
  }

  /**
   * Track upgrade from free to paid plan
   */
  static trackUpgrade(
    userId: string,
    fromPlan: string,
    toPlan: string,
    billingPeriod: 'monthly' | 'yearly',
    amount: number
  ): void {
    const eventType = fromPlan === 'free' 
      ? `free_to_${toPlan.toLowerCase()}_upgrade`
      : `${fromPlan.toLowerCase()}_to_${toPlan.toLowerCase()}_upgrade`;

    this.track({
      eventType: eventType as ConversionEventType,
      userId,
      fromPlan,
      toPlan,
      billingPeriod,
      amount,
    });
  }

  /**
   * Track pricing page view
   */
  static trackPricingPageView(userId?: string): void {
    this.track({
      eventType: 'pricing_page_viewed',
      userId,
    });
  }

  /**
   * Track upgrade button click
   */
  static trackUpgradeClick(userId: string, targetPlan: string): void {
    this.track({
      eventType: 'upgrade_clicked',
      userId,
      toPlan: targetPlan,
    });
  }

  /**
   * Track checkout start
   */
  static trackCheckoutStart(userId: string, plan: string, priceId: string): void {
    this.track({
      eventType: 'checkout_started',
      userId,
      plan,
      metadata: { priceId },
    });
  }

  /**
   * Track checkout completion
   */
  static trackCheckoutComplete(
    userId: string,
    plan: string,
    billingPeriod: 'monthly' | 'yearly',
    amount: number,
    stripeSessionId: string
  ): void {
    this.track({
      eventType: 'checkout_completed',
      userId,
      plan,
      billingPeriod,
      amount,
      metadata: { stripeSessionId },
    });
  }

  /**
   * Track churn (subscription cancellation)
   */
  static trackChurn(userId: string, plan: string, reason?: string): void {
    this.track({
      eventType: 'churn',
      userId,
      plan,
      metadata: { reason },
    });
  }

  /**
   * Calculate conversion metrics (mock implementation)
   */
  static async getConversionMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<ConversionMetrics> {
    // In production, this would query a database
    return {
      freeSignups: 0,
      paidConversions: 0,
      conversionRate: 0,
      averageTimeToConvert: 0,
      revenue: 0,
      mrr: 0,
      churnRate: 0,
      plans: {
        free: { count: 0, active: 0 },
        basic: { count: 0, active: 0, mrr: 0 },
        pro: { count: 0, active: 0, mrr: 0 },
      },
    };
  }
}

export interface ConversionMetrics {
  freeSignups: number;
  paidConversions: number;
  conversionRate: number;
  averageTimeToConvert: number; // in days
  revenue: number;
  mrr: number; // Monthly Recurring Revenue
  churnRate: number;
  plans: {
    free: { count: number; active: number };
    basic: { count: number; active: number; mrr: number };
    pro: { count: number; active: number; mrr: number };
  };
}

// Helper function to track conversion events from anywhere
export const trackConversion = ConversionAnalytics.track.bind(ConversionAnalytics);

// Export individual tracking functions
export const trackFreeSignup = ConversionAnalytics.trackFreeSignup.bind(ConversionAnalytics);
export const trackPaidSignup = ConversionAnalytics.trackPaidSignup.bind(ConversionAnalytics);
export const trackUpgrade = ConversionAnalytics.trackUpgrade.bind(ConversionAnalytics);
export const trackPricingPageView = ConversionAnalytics.trackPricingPageView.bind(ConversionAnalytics);
export const trackUpgradeClick = ConversionAnalytics.trackUpgradeClick.bind(ConversionAnalytics);
export const trackCheckoutStart = ConversionAnalytics.trackCheckoutStart.bind(ConversionAnalytics);
export const trackCheckoutComplete = ConversionAnalytics.trackCheckoutComplete.bind(ConversionAnalytics);
export const trackChurn = ConversionAnalytics.trackChurn.bind(ConversionAnalytics);