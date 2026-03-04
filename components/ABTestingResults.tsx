'use client';

import { useState, useEffect } from 'react';
import { useABTesting } from '@/hooks/useABTesting';
import { BarChart3, TrendingUp, Target, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface ABTestingResultsProps {
  showAllExperiments?: boolean;
  className?: string;
}

export default function ABTestingResults({ showAllExperiments = true, className = '' }: ABTestingResultsProps) {
  const { getResults, isLoading, error } = useABTesting();
  const [results, setResults] = useState<Record<string, any> | null>(null);
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await getResults();
      setResults(data as Record<string, any>);
      
      // Set first experiment as active
      if (data && typeof data === 'object') {
        const firstExperiment = Object.keys(data)[0];
        setActiveExperiment(firstExperiment);
      }
    } catch (err) {
      console.error('Failed to load A/B test results:', err);
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'high': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertCircle className="h-4 w-4" />;
      case 'low': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow p-6 ${className}`}>
        <div className="text-red-600 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load A/B test results: {error}</span>
        </div>
      </div>
    );
  }

  if (!results || Object.keys(results).length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow p-6 ${className}`}>
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No A/B Test Data Available</h3>
          <p className="text-gray-600">Start running A/B tests to see results here.</p>
        </div>
      </div>
    );
  }

  const experiments = Object.entries(results);
  const currentExperiment = activeExperiment ? results[activeExperiment] : null;

  return (
    <div className={`bg-white rounded-xl shadow ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              A/B Testing Results
            </h2>
            <p className="text-gray-600 mt-1">Real-time experiment performance and insights</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">
              {experiments.length} Active Experiments
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {showAllExperiments && experiments.length > 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Experiments</h3>
            <div className="flex flex-wrap gap-2">
              {experiments.map(([experimentId, experimentData]) => (
                <button
                  key={experimentId}
                  onClick={() => setActiveExperiment(experimentId)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    activeExperiment === experimentId
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm font-medium">{experimentData.experimentId.replace('_', ' ')}</div>
                  <div className="text-xs text-gray-500">
                    {experimentData.totalParticipants} participants
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentExperiment && (
          <div className="space-y-6">
            {/* Experiment Header */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 capitalize">
                    {currentExperiment.experimentId.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {currentExperiment.description || 'AI recommendation optimization experiment'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {(currentExperiment.overallCompletionRate * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Overall Completion Rate</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${getConfidenceColor(currentExperiment.confidenceLevel)}`}>
                    {getConfidenceIcon(currentExperiment.confidenceLevel)}
                    <span className="text-sm font-medium capitalize">{currentExperiment.confidenceLevel} confidence</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{currentExperiment.totalParticipants}</div>
                    <div className="text-sm text-gray-600">Total Participants</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentExperiment.winningVariant || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Winning Variant</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentExperiment.statisticalSignificance ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-600">Statistically Significant</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Variant Performance */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Variant Performance</h4>
              <div className="space-y-4">
                {Object.entries(currentExperiment.variantResults).map(([variantId, variantData]: [string, any]) => (
                  <div key={variantId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">Variant {variantId}</span>
                          {currentExperiment.winningVariant === variantId && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Winner
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {variantData.participants} participants • {variantData.completions} completions
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {(variantData.completionRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Completion Rate</div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${variantData.completionRate * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Deployment Recommendations
              </h4>
              {currentExperiment.statisticalSignificance && currentExperiment.confidenceLevel === 'high' ? (
                <p className="text-gray-700">
                  ✅ <strong>Deploy Variant {currentExperiment.winningVariant}:</strong> This variant shows statistically 
                  significant improvement with high confidence. You can safely deploy it to all users.
                </p>
              ) : currentExperiment.statisticalSignificance && currentExperiment.confidenceLevel === 'medium' ? (
                <p className="text-gray-700">
                  ⚠️ <strong>Consider deploying Variant {currentExperiment.winningVariant}:</strong> This variant shows 
                  improvement with medium confidence. Consider running the test longer or with more participants.
                </p>
              ) : (
                <p className="text-gray-700">
                  🔄 <strong>Continue testing:</strong> No statistically significant winner yet. Continue running the 
                  experiment with more participants to gather sufficient data.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Last updated: {currentExperiment ? new Date(currentExperiment.lastUpdated).toLocaleString() : 'N/A'}
          </div>
          <button
            onClick={loadResults}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Refresh Results
          </button>
        </div>
      </div>
    </div>
  );
}