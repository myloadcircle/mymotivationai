import { NextRequest, NextResponse } from 'next/server';
import { getRecommendationABTests } from '@/lib/ab-testing';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const abTests = getRecommendationABTests();

    // Assign user to all recommendation experiments
    const presentationVariant = abTests.getRecommendationPresentation(userId);
    const timingVariant = abTests.getRecommendationTiming(userId);
    const contentVariant = abTests.getRecommendationContent(userId);

    return NextResponse.json({
      success: true,
      assignments: {
        recommendation_presentation: presentationVariant,
        recommendation_timing: timingVariant,
        recommendation_content: contentVariant,
      },
      message: 'User assigned to A/B test variants',
    });
  } catch (error) {
    console.error('Error assigning user to A/B tests:', error);
    return NextResponse.json(
      { error: 'Failed to assign user to A/B tests' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const abTests = getRecommendationABTests();

    // Get user's current assignments
    const presentationVariant = abTests.getRecommendationPresentation(userId);
    const timingVariant = abTests.getRecommendationTiming(userId);
    const contentVariant = abTests.getRecommendationContent(userId);

    return NextResponse.json({
      success: true,
      assignments: {
        recommendation_presentation: presentationVariant,
        recommendation_timing: timingVariant,
        recommendation_content: contentVariant,
      },
    });
  } catch (error) {
    console.error('Error getting user A/B test assignments:', error);
    return NextResponse.json(
      { error: 'Failed to get user A/B test assignments' },
      { status: 500 }
    );
  }
}