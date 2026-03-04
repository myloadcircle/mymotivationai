import Stripe from 'stripe';

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the version that matches TypeScript types
  appInfo: {
    name: 'myMotivationAI',
    version: '1.0.0',
  },
});

// Product and pricing configuration
export const PRODUCTS = {
  FREE: {
    name: 'Free Plan',
    description: 'Perfect for getting started',
    features: [
      'Daily motivation quotes',
      'Basic goal tracking',
    ],
  },
  BASIC: {
    name: 'Basic Plan',
    description: 'Essential motivation features for individuals',
    features: [
      'Everything in Free',
      'Limited analytics',
      'Email support',
      'Mobile app access',
      'Basic progress tracking',
    ],
  },
  PRO: {
    name: 'Pro Plan',
    description: 'Advanced features for serious users',
    features: [
      'Everything in Basic',
      'Advanced analytics & insights',
      'Custom motivation schedules',
      'Priority email support',
      'Team collaboration (up to 5 users)',
      'Custom goal templates',
      'Detailed progress reports',
    ],
  },
};

// Pricing tiers (in cents/pence)
export const PRICING = {
  FREE: {
    monthly: 0,
    yearly: 0,
  },
  BASIC: {
    monthly: 999, // $9.99/month
    yearly: 7794, // $77.94/year (save 35% from $9.99*12 = $119.88)
  },
  PRO: {
    monthly: 2499, // $24.99/month
    yearly: 19494, // $194.94/year (save 35% from $24.99*12 = $299.88)
  },
};

// Helper function to format price for display
export function formatPrice(amount: number, currency: string = 'usd'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  });
  
  return formatter.format(amount / 100);
}

// Helper function to create checkout session
export async function createCheckoutSession({
  priceId,
  customerEmail,
  successUrl,
  cancelUrl,
  mode = 'subscription',
  metadata = {},
}: {
  priceId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  mode?: 'subscription' | 'payment';
  metadata?: Record<string, string>;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Helper function to create customer portal session
export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
}

// Helper function to verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}

// Helper function to get subscription status
export function getSubscriptionStatus(subscription: Stripe.Subscription): {
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused';
  isActive: boolean;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
} {
  const status = subscription.status;
  const isActive = ['active', 'trialing', 'paused'].includes(status);
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  return {
    status,
    isActive,
    currentPeriodEnd,
    cancelAtPeriodEnd,
  };
}