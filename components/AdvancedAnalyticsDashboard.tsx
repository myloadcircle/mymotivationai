'use client';

import { useState, useEffect, useCallback } from 'react';
import { aiInsightsService, type SentimentAnalysisResult, type CohortAnalysis } from '@/lib/ai/insights';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  PieChart, 
  Brain, 
  MessageSquare,
  Calendar,
  Target,
  Clock,
  Activity,
  Filter,
  Download,
  RefreshCw,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AnalyticsMetric {
  label: string;
  value: number | string;
  change: number; // percentage change
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

interface SentimentDistribution {
  positive: number;
  negative: number;
  neutral: number;
}

export default function AdvancedAnalyticsDashboard({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysisResult | null>(null);
  const [cohortAnalysis, setCohortAnalysis] = useState<CohortAnalysis | null>(null);
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [sentimentDistribution, setSentimentDistribution] = useState<SentimentDistribution>({
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  const loadAnalytics = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      // Load AI insights
      const insights = await aiInsightsService.getUserInsights(userId);
      
      // Load predictive model
      const predictiveModel = await aiInsightsService.generatePredictiveModel(userId);
      
      // Load cohort analysis
      const cohort = await aiInsightsService.analyzeCohort(userId);
      setCohortAnalysis(cohort);

      // Analyze sample sentiment (in production, this would analyze user's actual notes)
      const sampleText = "I'm feeling great about my progress this week! Completed 3 goals and feeling motivated to tackle more challenges.";
      const sentiment = await aiInsightsService.analyzeSentiment(sampleText);
      setSentimentAnalysis(sentiment);

      // Calculate metrics
      const calculatedMetrics: AnalyticsMetric[] = [
        {
          label: 'Goal Success Rate',
          value: `${insights.analysis.completionRate.toFixed(1)}%`,
          change: 5.2,
          trend: 'up',
          icon: <Target className="h-5 w-5" />,
          color: 'bg-green-100 text-green-800',
        },
        {
          label: 'Motivation Score',
          value: insights.motivationScore,
          change: 2.8,
          trend: 'up',
          icon: <Brain className="h-5 w-5" />,
          color: 'bg-blue-100 text-blue-800',
        },
        {
          label: 'Avg. Completion Time',
          value: insights.analysis.averageCompletionTime 
            ? `${Math.round(insights.analysis.averageCompletionTime / (1000 * 60 * 60 * 24))} days`
            : 'N/A',
          change: -3.1,
          trend: 'down',
          icon: <Clock className="h-5 w-5" />,
          color: 'bg-purple-100 text-purple-800',
        },
        {
          label: 'Success Probability',
          value: `${predictiveModel.goalSuccessProbability.toFixed(1)}%`,
          change: 1.5,
          trend: 'up',
          icon: <TrendingUp className="h-5 w-5" />,
          color: 'bg-yellow-100 text-yellow-800',
        },
      ];

      setMetrics(calculatedMetrics);

      // Generate time series data (mock for demo)
      const generateTimeSeries = (days: number): TimeSeriesData[] => {
        const data: TimeSeriesData[] = [];
        const now = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: 50 + Math.random() * 50, // Random values between 50-100
            category: i % 3 === 0 ? 'Health' : i % 3 === 1 ? 'Career' : 'Personal',
          });
        }
        
        return data;
      };

      const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
      setTimeSeriesData(generateTimeSeries(daysMap[timeRange]));

      // Calculate sentiment distribution (mock for demo)
      setSentimentDistribution({
        positive: 65,
        negative: 15,
        neutral: 20,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [userId, timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleExportData = () => {
    const csvContent = [
      ['Metric', 'Value', 'Change', 'Trend'],
      ...metrics.map(metric => [
        metric.label,
        metric.value,
        `${metric.change}%`,
        metric.trend,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="h-5 w-5 text-green-500" />;
      case 'negative': return <Frown className="h-5 w-5 text-red-500" />;
      case 'neutral': return <Meh className="h-5 w-5 text-gray-500" />;
      default: return <Meh className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50';
      case 'down': return 'text-red-600 bg-red-50';
      case 'stable': return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading && metrics.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">Loading advanced analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="font-medium text-red-800">Error Loading Analytics</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">
                AI-powered insights, sentiment analysis, and predictive modeling
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Select time range"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={loadAnalytics}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric.color}`}>
                    {metric.icon}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(metric.trend)}`}>
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {Math.abs(metric.change)}%
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Charts and Trends */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Performance Trends</h2>
                <div className="flex items-center text-sm text-gray-600">
                  <Activity className="h-4 w-4 mr-2" />
                  {timeRange} view
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Performance chart visualization</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {timeSeriesData.length} data points loaded
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Peak Performance</div>
                  <div className="text-lg font-bold text-gray-900">
                    {Math.max(...timeSeriesData.map(d => d.value)).toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Average</div>
                  <div className="text-lg font-bold text-gray-900">
                    {(timeSeriesData.reduce((sum, d) => sum + d.value, 0) / timeSeriesData.length).toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Trend</div>
                  <div className="text-lg font-bold text-green-600">+2.4% ↗</div>
                </div>
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Sentiment Analysis</h2>
                <div className="flex items-center text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI-powered analysis
                </div>
              </div>
              
              {sentimentAnalysis && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      sentimentAnalysis.sentiment === 'positive' ? 'bg-green-100' :
                      sentimentAnalysis.sentiment === 'negative' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      {getSentimentIcon(sentimentAnalysis.sentiment)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">{sentimentAnalysis.sentiment} Sentiment</h3>
                      <p className="text-sm text-gray-600">
                        Confidence: {(sentimentAnalysis.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Detected Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {sentimentAnalysis.keywords.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Emotions Detected</h4>
                    <div className="flex flex-wrap gap-2">
                      {sentimentAnalysis.emotions.map((emotion, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">AI Suggestions</h4>
                    <ul className="space-y-2">
                      {sentimentAnalysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Insights and Distribution */}
          <div className="space-y-6">
            {/* Sentiment Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sentiment Distribution</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <Smile className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">Positive</span>
                    </div>
                    <span className="text-sm font-medium">{sentimentDistribution.positive}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${sentimentDistribution.positive}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <Meh className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">Neutral</span>
                    </div>
                    <span className="text-sm font-medium">{sentimentDistribution.neutral}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-500 rounded-full"
                      style={{ width: `${sentimentDistribution.neutral}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <Frown className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm text-gray-700">Negative</span>
                    </div>
                    <span className="text-sm font-medium">{sentimentDistribution.negative}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${sentimentDistribution.negative}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Insight</h4>
                <p className="text-sm text-blue-700">
                  {sentimentDistribution.positive > 60 
                    ? 'Your positive sentiment indicates strong motivation and progress momentum.'
                    : sentimentDistribution.negative > 30
                    ? 'Consider focusing on smaller, more achievable goals to build confidence.'
                    : 'Your sentiment is balanced. Focus on maintaining consistency in your goal pursuit.'}
                </p>
              </div>
            </div>

            {/* Cohort Analysis */}
            {cohortAnalysis && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Cohort Analysis</h2>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {cohortAnalysis.size.toLocaleString()} users
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{cohortAnalysis.name}</h3>
                    <p className="text-sm text-gray-600">
                      Average completion rate: {cohortAnalysis.averageCompletionRate}%
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Common Patterns</h4>
                    <ul className="space-y-2">
                      {cohortAnalysis.commonPatterns.map((pattern, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Top Performers</h4>
                    <div className="space-y-2">
                      {cohortAnalysis.topPerformingUsers.slice(0, 3).map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="text-sm text-gray-700">User {user.userId.slice(-3)}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{user.completionRate}%</div>
                            <div className="text-xs text-gray-500">{user.streakDays} day streak</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {cohortAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Predictive Insights */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 mr-4" />
                <div>
                  <h3 className="text-lg font-bold">AI Predictive Insights</h3>
                  <p className="text-sm opacity-90">Powered by machine learning</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Goal success probability</span>
                  <span className="font-bold">82%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next achievement predicted</span>
                  <span className="font-bold">3 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Motivation trend</span>
                  <span className="font-bold">Increasing ↗</span>
                </div>
              </div>

              <button className="w-full mt-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                View Detailed Predictions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
