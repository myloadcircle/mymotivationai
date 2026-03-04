import { NextRequest, NextResponse } from 'next/server';
import { getRecommendationABTests } from '@/lib/ab-testing';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const experimentId = searchParams.get('experimentId');

    const abTests = getRecommendationABTests();

    if (experimentId) {
      // Get specific experiment results
      const results = abTests.getExperimentResults(experimentId);

      if (!results) {
        return NextResponse.json(
          { error: `Experiment ${experimentId} not found` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        experimentId,
        results,
      });
    } else {
      // Get all experiment results
      const allResults = abTests.getAllResults();

      return NextResponse.json({
        success: true,
        results: allResults,
        totalExperiments: Object.keys(allResults).length,
      });
    }
  } catch (error) {
    console.error('Error getting A/B test results:', error);
    return NextResponse.json(
      { error: 'Failed to get A/B test results' },
      { status: 500 }
    );
  }
}