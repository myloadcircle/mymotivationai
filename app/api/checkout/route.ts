import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, customerEmail, mode = 'subscription', metadata = {} } = body;

    // Validate required fields
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get the base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    // Create checkout session
    const session = await createCheckoutSession({
      priceId,
      customerEmail,
      successUrl: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/payment/cancel`,
      mode,
      metadata,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error.message 
      },
      { status: 500 }
    );
  }
}