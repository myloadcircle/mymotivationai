import { NextRequest, NextResponse } from 'next/server';
import { getRecommendationABTests } from '@/lib/ab-testing';

export async function POST(request: NextRequest) {
  try {
    const { userId, successMetric = 1 } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const abTests = getRecommendationABTests();

    // Record completion for all recommendation experiments
    abTests.recordRecommendationInteraction(userId, successMetric);

    return NextResponse.json({
      success: true,
      message: 'A/B test completion recorded successfully',
      userId,
      successMetric,
    });
  } catch (error) {
    console.error('Error recording A/B test completion:', error);
    return NextResponse.json(
      { error: 'Failed to record A/B test completion' },
      { status: 500 }
    );
  }
}