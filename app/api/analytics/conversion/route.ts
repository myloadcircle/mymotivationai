import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();

    // Validate required fields
    if (!event.eventType) {
      return NextResponse.json(
        { error: 'eventType is required' },
        { status: 400 }
      );
    }

    // Store conversion event in database
    const conversionEvent = await prisma.analyticsEvent.create({
      data: {
        userId: event.userId || null,
        eventType: `conversion:${event.eventType}`,
        eventData: event,
        userAgent: event.userAgent || request.headers.get('user-agent') || null,
        ipAddress: request.headers.get('x-forwarded-for') || null,
        path: event.url || null,
      },
    });

    // Update user's conversion tracking if userId is provided
    if (event.userId) {
      await updateUserConversionStats(event.userId, event.eventType, event);
    }

    // Log for debugging
    console.log(`📊 Conversion event stored: ${event.eventType} for user ${event.userId || 'anonymous'}`);

    return NextResponse.json(
      { success: true, id: conversionEvent.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing conversion event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateUserConversionStats(
  userId: string,
  eventType: string,
  event: any
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return;

    // Update based on event type
    switch (eventType) {
      case 'free_signup':
        await prisma.user.update({
          where: { id: userId },
          data: {
            conversionData: {
              signupDate: new Date(),
              lastConversionEvent: eventType,
              freeSignup: true,
            },
          },
        });
        break;

      case 'paid_signup':
      case 'free_to_basic_upgrade':
      case 'free_to_pro_upgrade':
      case 'basic_to_pro_upgrade':
        await prisma.user.update({
          where: { id: userId },
          data: {
            conversionData: {
              lastConversionEvent: eventType,
              lastUpgradeDate: new Date(),
              upgradeCount: (user.conversionData as any)?.upgradeCount || 0 + 1,
            },
          },
        });
        break;

      case 'checkout_completed':
        await prisma.user.update({
          where: { id: userId },
          data: {
            conversionData: {
              lastConversionEvent: eventType,
              lastPaymentDate: new Date(),
              totalRevenue: ((user.conversionData as any)?.totalRevenue || 0) + (event.amount || 0),
            },
          },
        });
        break;
    }
  } catch (error) {
    console.error('Error updating user conversion stats:', error);
  }
}

// GET endpoint to retrieve conversion metrics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const end = endDate ? new Date(endDate) : new Date();

    // Get conversion events
    const conversionEvents = await prisma.analyticsEvent.findMany({
      where: {
        eventType: {
          startsWith: 'conversion:',
        },
        timestamp: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Calculate metrics
    const freeSignups = conversionEvents.filter(e => 
      e.eventType === 'conversion:free_signup'
    ).length;

    const paidConversions = conversionEvents.filter(e => 
      e.eventType.includes('conversion:free_to_') || 
      e.eventType === 'conversion:paid_signup'
    ).length;

    const checkoutStarts = conversionEvents.filter(e => 
      e.eventType === 'conversion:checkout_started'
    ).length;

    const checkoutCompletions = conversionEvents.filter(e => 
      e.eventType === 'conversion:checkout_completed'
    ).length;

    const conversionRate = checkoutStarts > 0 
      ? (checkoutCompletions / checkoutStarts) * 100 
      : 0;

    // Get user counts by plan
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const freeUsers = users.filter(u => u.subscriptionPlan === 'free').length;
    const basicUsers = users.filter(u => u.subscriptionPlan === 'basic').length;
    const proUsers = users.filter(u => u.subscriptionPlan === 'pro').length;

    // Calculate MRR (Monthly Recurring Revenue)
    // This is a simplified calculation - in production, you'd use actual subscription data
    const basicMRR = basicUsers * 9; // $9/month per basic user
    const proMRR = proUsers * 29; // $29/month per pro user
    const totalMRR = basicMRR + proMRR;

    const metrics = {
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      events: {
        total: conversionEvents.length,
        freeSignups,
        paidConversions,
        checkoutStarts,
        checkoutCompletions,
      },
      conversion: {
        rate: Math.round(conversionRate * 100) / 100,
        checkoutCompletionRate: Math.round(conversionRate * 100) / 100,
      },
      users: {
        total: users.length,
        free: freeUsers,
        basic: basicUsers,
        pro: proUsers,
      },
      revenue: {
        mrr: totalMRR,
        basicMRR,
        proMRR,
      },
      timeline: conversionEvents.map(event => ({
        id: event.id,
        type: event.eventType.replace('conversion:', ''),
        userId: event.userId,
        timestamp: event.timestamp,
        data: event.eventData,
      })),
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching conversion metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}