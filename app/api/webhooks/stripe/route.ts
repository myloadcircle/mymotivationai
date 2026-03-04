import { NextRequest, NextResponse } from 'next/server';
import { stripe, verifyWebhookSignature } from '@/lib/stripe';

// Stripe webhook handler for subscription events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    // Verify webhook signature
    const event = verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log(`Stripe webhook received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 400 }
    );
  }
}

// Event handlers
async function handleCheckoutSessionCompleted(session: any) {
  console.log('Checkout session completed:', session.id);
  
  // Here you would:
  // 1. Create or update user in your database
  // 2. Grant access to premium features
  // 3. Send welcome email
  // 4. Update analytics
  
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const customerEmail = session.customer_email;
  
  console.log(`Customer ${customerId} (${customerEmail}) subscribed with subscription ${subscriptionId}`);
  
  // Example: Update user subscription in database
  // await updateUserSubscription(customerEmail, {
  //   stripeCustomerId: customerId,
  //   stripeSubscriptionId: subscriptionId,
  //   status: 'active',
  //   plan: session.metadata?.plan || 'basic',
  // });
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('Subscription created:', subscription.id);
  
  // Update subscription status in your database
  // await updateSubscriptionStatus(subscription.id, 'active');
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('Subscription updated:', subscription.id);
  
  const status = subscription.status;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;
  
  console.log(`Subscription ${subscription.id} status: ${status}, cancel at period end: ${cancelAtPeriodEnd}`);
  
  // Update subscription in your database
  // await updateSubscription(subscription.id, {
  //   status,
  //   cancelAtPeriodEnd,
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  // });
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('Subscription deleted:', subscription.id);
  
  // Update subscription status to canceled in your database
  // await updateSubscriptionStatus(subscription.id, 'canceled');
  
  // Optionally revoke access to premium features
  // await revokePremiumAccess(subscription.customer);
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  // Send payment confirmation email
  // await sendPaymentConfirmationEmail(invoice.customer_email, {
  //   amount: invoice.amount_paid,
  //   date: new Date(invoice.created * 1000),
  //   invoiceUrl: invoice.hosted_invoice_url,
  // });
}

async function handleInvoicePaymentFailed(invoice: any) {
  console.log('Invoice payment failed:', invoice.id);
  
  // Send payment failure notification
  // await sendPaymentFailureEmail(invoice.customer_email, {
  //   amount: invoice.amount_due,
  //   date: new Date(invoice.created * 1000),
  //   retryUrl: invoice.hosted_invoice_url,
  // });
}