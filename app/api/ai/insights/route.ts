import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { aiInsightsService } from '@/lib/ai/insights';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const insights = await aiInsightsService.getUserInsights(session.user.id);

    return NextResponse.json({
      success: true,
      insights,
    });
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
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
    const { action } = body;

    switch (action) {
      case 'generate_recommendations':
        const recommendations = await aiInsightsService.generateRecommendations(session.user.id);
        return NextResponse.json({
          success: true,
          recommendations,
        });

      case 'get_notifications':
        const notifications = await aiInsightsService.generateSmartNotifications(session.user.id);
        return NextResponse.json({
          success: true,
          notifications,
        });

      case 'analyze_goal':
        const { goalId } = body;
        if (!goalId) {
          return NextResponse.json(
            { error: 'Goal ID is required' },
            { status: 400 }
          );
        }
        const prediction = await aiInsightsService.predictGoalProgress(goalId);
        return NextResponse.json({
          success: true,
          prediction,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing AI request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}