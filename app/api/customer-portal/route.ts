import { NextRequest, NextResponse } from 'next/server';
import { createCustomerPortalSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId } = body;

    // Validate required fields
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get the base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    // Create customer portal session
    const session = await createCustomerPortalSession(
      customerId,
      `${baseUrl}/account`
    );

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Customer portal API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create customer portal session',
        details: error.message 
      },
      { status: 500 }
    );
  }
}