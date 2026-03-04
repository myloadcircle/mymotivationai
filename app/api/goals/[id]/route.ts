import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Required for static export (hybrid app) - API routes use Supabase directly
export async function generateStaticParams() {
  return [];
}

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const goal = await prisma.goal.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ goal });
  } catch (error) {
    console.error('Error fetching goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, targetDate, category, completed } = body;

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (title !== undefined) {
      updateData.title = title.trim();
    }
    
    if (description !== undefined) {
      updateData.description = description?.trim();
    }
    
    if (targetDate !== undefined) {
      updateData.targetDate = targetDate ? new Date(targetDate) : null;
    }
    
    if (category !== undefined) {
      updateData.category = category?.trim();
    }
    
    if (completed !== undefined) {
      updateData.completed = completed;
      
      // Track completion event
      if (completed && !existingGoal.completed) {
        try {
          await fetch('/api/analytics/conversion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventType: 'goal_completed',
              userId: session.user.id,
              metadata: { goalId: params.id, title: existingGoal.title },
            }),
          });
          
          // Track celebration event
          await fetch('/api/analytics/conversion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventType: 'celebration_triggered',
              userId: session.user.id,
              metadata: { 
                goalId: params.id, 
                title: existingGoal.title,
                celebrationType: 'goal_completed',
                timestamp: new Date().toISOString()
              },
            }),
          });
          
          // Update user's completed goals count
          await prisma.user.update({
            where: { id: session.user.id },
            data: {
              completedGoals: {
                increment: 1,
              },
            },
          });
        } catch (analyticsError) {
          console.error('Failed to track goal completion:', analyticsError);
        }
      }
    }

    // Update goal
    const goal = await prisma.goal.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Goal updated successfully',
      goal,
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Delete goal
    await prisma.goal.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}