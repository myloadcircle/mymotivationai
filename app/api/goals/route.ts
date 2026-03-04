import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkPlanAccess } from '@/components/FeatureGate';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const completed = searchParams.get('completed');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (completed !== null) {
      where.completed = completed === 'true';
    }

    if (category) {
      where.category = category;
    }

    // Get user to check plan limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get goals
    const goals = await prisma.goal.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Check if free user has reached goal limit
    if (user.subscriptionPlan === 'free') {
      const activeGoals = goals.filter(g => !g.completed).length;
      const maxGoals = 3; // Free plan limit
      
      return NextResponse.json({
        goals,
        limits: {
          maxGoals,
          activeGoals,
          remaining: Math.max(0, maxGoals - activeGoals),
          reachedLimit: activeGoals >= maxGoals,
        },
      });
    }

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, targetDate, category } = body;

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Get user to check plan limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check free plan limit
    if (user.subscriptionPlan === 'free') {
      const activeGoals = await prisma.goal.count({
        where: {
          userId: session.user.id,
          completed: false,
        },
      });

      const maxGoals = 3; // Free plan limit
      if (activeGoals >= maxGoals) {
        return NextResponse.json(
          { 
            error: 'Goal limit reached',
            message: `Free plan allows only ${maxGoals} active goals. Upgrade to Basic for unlimited goals.`,
            upgradeUrl: '/pricing'
          },
          { status: 403 }
        );
      }
    }

    // Create goal
    const goal = await prisma.goal.create({
      data: {
        userId: session.user.id,
        title: title.trim(),
        description: description?.trim(),
        targetDate: targetDate ? new Date(targetDate) : null,
        category: category?.trim(),
      },
    });

    // Track conversion event
    try {
      await fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'goal_created',
          userId: session.user.id,
          metadata: { goalId: goal.id, category },
        }),
      });
    } catch (analyticsError) {
      console.error('Failed to track goal creation:', analyticsError);
    }

    return NextResponse.json(
      { 
        message: 'Goal created successfully',
        goal 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}