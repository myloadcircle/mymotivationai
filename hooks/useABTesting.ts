'use client';

import { useState, useEffect, useCallback } from 'react';

interface ABTestingAssignments {
  recommendation_presentation: string;
  recommendation_timing: string;
  recommendation_content: string;
}

interface ExperimentResults {
  experimentId: string;
  totalParticipants: number;
  overallCompletionRate: number;
  variantResults: Record<string, {
    participants: number;
    completions: number;
    totalMetric: number;
    completionRate: number;
  }>;
  winningVariant?: string;
  statisticalSignificance: boolean;
  confidenceLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

interface UseABTestingReturn {
  assignments: ABTestingAssignments | null;
  isLoading: boolean;
  error: string | null;
  assignUser: (userId: string) => Promise<void>;
  recordCompletion: (userId: string, successMetric?: number) => Promise<void>;
  getResults: (experimentId?: string) => Promise<ExperimentResults | Record<string, ExperimentResults>>;
}

export function useABTesting(): UseABTestingReturn {
  const [assignments, setAssignments] = useState<ABTestingAssignments | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ab-testing/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign user to A/B tests');
      }

      const data = await response.json();
      setAssignments(data.assignments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error assigning user to A/B tests:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAssignments = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ab-testing/assign?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Failed to get user A/B test assignments');
      }

      const data = await response.json();
      setAssignments(data.assignments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error getting user A/B test assignments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordCompletion = useCallback(async (userId: string, successMetric: number = 1) => {
    try {
      const response = await fetch('/api/ab-testing/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, successMetric }),
      });

      if (!response.ok) {
        throw new Error('Failed to record A/B test completion');
      }

      console.log('A/B test completion recorded successfully');
    } catch (err) {
      console.error('Error recording A/B test completion:', err);
    }
  }, []);

  const getResults = useCallback(async (experimentId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = experimentId 
        ? `/api/ab-testing/results?experimentId=${experimentId}`
        : '/api/ab-testing/results';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to get A/B test results');
      }

      const data = await response.json();
      return data.results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error getting A/B test results:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize with current user if available
  useEffect(() => {
    // In a real app, you would get the current user ID from auth context
    const currentUserId = localStorage.getItem('userId') || 'demo-user';
    
    if (currentUserId) {
      getAssignments(currentUserId);
    }
  }, [getAssignments]);

  return {
    assignments,
    isLoading,
    error,
    assignUser,
    recordCompletion,
    getResults,
  };
}

/**
 * Hook for getting the current user's A/B test variant for a specific experiment
 */
export function useABTestVariant(experimentId: keyof ABTestingAssignments): string | null {
  const { assignments } = useABTesting();
  
  if (!assignments) {
    return null;
  }

  return assignments[experimentId];
}

/**
 * Hook for recording A/B test interactions
 */
export function useABTestInteraction() {
  const { recordCompletion } = useABTesting();

  const recordInteraction = useCallback(async (
    userId: string,
    interactionType: 'click' | 'view' | 'conversion' | 'engagement',
    metadata?: Record<string, any>
  ) => {
    // Map interaction types to success metrics
    const successMetrics: Record<string, number> = {
      click: 1,
      view: 0.5,
      conversion: 2,
      engagement: 1.5,
    };

    const successMetric = successMetrics[interactionType] || 1;

    await recordCompletion(userId, successMetric);

    // Log the interaction for analytics
    console.log(`A/B test interaction recorded: ${interactionType}`, {
      userId,
      successMetric,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }, [recordCompletion]);

  return { recordInteraction };
}