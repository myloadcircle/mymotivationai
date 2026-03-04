'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Clock, 
  Calendar,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingDown,
  PieChart,
  LineChart,
  Activity,
  Target as TargetIcon,
  Shield,
  Lightbulb,
  Users,
  Award,
  Rocket,
  Sparkles,
  ChevronRight,
  Download,
  Share2,
  RefreshCw,
  Settings,
  Filter,
  Search,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Bell,
  MessageSquare,
  Heart,
  Star,
  ThumbsUp,
  TrendingUp as TrendingUpIcon,
} from 'lucide-react';
import { aiInsightsService, type PredictiveModel, type SentimentAnalysisResult } from '@/lib/ai/insights';

interface PredictiveModelingDashboardProps {
  userId: string;
}

interface PredictionMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  description: string;
}

interface TimeSeriesPrediction {
  date: string;
  predictedValue: number;
  lowerBound: number;
  upperBound: number;
  actualValue?: number;
}

export default function PredictiveModelingDashboard({ userId }: PredictiveModelingDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictiveModel, setPredictiveModel] = useState<PredictiveModel | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesPrediction[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [showConfidenceIntervals, setShowConfidenceIntervals] = useState(true);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysisResult | null>(null);

  const predictionMetrics: PredictionMetric[] = [
    {
      id: 'success_probability',
      name: 'Goal Success Probability',
      value: predictiveModel?.goalSuccessProbability || 75,
      unit: '%',
      trend: predictiveModel?.motivationTrend === 'increasing' ? 'up' : predictiveModel?.motivationTrend === 'decreasing' ? 'down' : 'stable',
      confidence: 0.85,
      description: 'Likelihood of completing current goals based on historical patterns',
    },
    {
      id: 'motivation_score',
      name: 'Motivation Score',
      value: 82,
      unit: '/100',
      trend: 'up',
      confidence: 0.78,
      description: 'Current motivation level based on activity and engagement',
    },
    {
      id: 'streak_prediction',
      name: 'Predicted Streak',
      value: 14,
      unit: 'days',
      trend: 'stable',
      confidence: 0.72,
      description: 'Expected continuation of current activity streak',
    },
    {
      id: 'completion_rate',
      name: 'Completion Rate',
      value: 78,
      unit: '%',
      trend: 'up',
      confidence: 0.91,
      description: 'Historical goal completion percentage',
    },
  ];

  const riskFactors = predictiveModel?.riskFactors || [
    {
      factor: 'Goal Overload',
      severity: 'medium' as const,
      description: 'Multiple active goals may reduce focus',
    },
    {
      factor: 'Time Constraints',
      severity: 'low' as const,
      description: 'Limited time availability detected',
    },
  ];

  const opportunityAreas = predictiveModel?.opportunityAreas || [
    {
      area: 'Morning Productivity',
      potentialImpact: 85,
      confidence: 0.9,
    },
    {
      area: 'Health & Fitness Goals',
      potentialImpact: 75,
      confidence: 0.8,
    },
  ];

  useEffect(() => {
    loadPredictiveData();
  }, [userId]);

  const loadPredictiveData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load predictive model
      const model = await aiInsightsService.generatePredictiveModel(userId);
      setPredictiveModel(model);

      // Generate time series data
      const timeSeries = generateTimeSeriesData();
      setTimeSeriesData(timeSeries);

      // Analyze sample sentiment
      const sampleText = "I'm making good progress on my fitness goals and feeling motivated to continue!";
      const sentiment = await aiInsightsService.analyzeSentiment(sampleText);
      setSentimentAnalysis(sentiment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load predictive data');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSeriesData = (): TimeSeriesPrediction[] => {
    const data: TimeSeriesPrediction[] = [];
    const baseValue = 70;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (29 - i));
      
      const trend = 0.5 + (i / 30) * 0.3; // Increasing trend
      const noise = (Math.random() - 0.5) * 10;
      const predictedValue = baseValue + (trend * 20) + noise;
      const confidenceWidth = 5 + Math.random() * 10;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        predictedValue,
        lowerBound: predictedValue - confidenceWidth,
        upperBound: predictedValue + confidenceWidth,
        actualValue: i < 15 ? predictedValue + (Math.random() - 0.5) * 8 : undefined,
      });
    }

    return data;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading predictive models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading predictive data</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={loadPredictiveData}
          className="mt-3 text-sm font-medium text-red-800 hover:text-red-900"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Predictive Modeling Dashboard</h2>
            <p className="text-gray-600 mt-1">AI-powered predictions and confidence intervals for your goal success</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowConfidenceIntervals(!showConfidenceIntervals)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              {showConfidenceIntervals ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Confidence
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show Confidence
                </>
              )}
            </button>
            <button
              onClick={loadPredictiveData}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Timeframe:</span>
          {(['week', 'month', 'quarter'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 text-sm font-medium rounded-full ${selectedTimeframe === timeframe ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Prediction Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {predictionMetrics.map((metric) => (
            <div key={metric.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {metric.id === 'success_probability' && <Target className="w-5 h-5 text-blue-600" />}
                    {metric.id === 'motivation_score' && <Zap className="w-5 h-5 text-blue-600" />}
                    {metric.id === 'streak_prediction' && <Calendar className="w-5 h-5 text-blue-600" />}
                    {metric.id === 'completion_rate' && <CheckCircle className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
                    <div className="flex items-center mt-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`ml-1 text-xs font-medium px-2 py-0.5 rounded-full ${getConfidenceColor(metric.confidence)}`}>
                        {(metric.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metric.value.toFixed(metric.id === 'success_probability' || metric.id === 'completion_rate' ? 0 : 1)}{metric.unit}
              </div>
              <p className="text-sm text-gray-600">{metric.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Time Series Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Success Probability Forecast</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Confidence Intervals</span>
                  <div className={`relative inline-block w-10 h-6 rounded-full ${showConfidenceIntervals ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <button
                      onClick={() => setShowConfidenceIntervals(!showConfidenceIntervals)}
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${showConfidenceIntervals ? 'transform translate-x-4' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {/* Simplified Chart Visualization */}
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end">
                  {/* Confidence intervals */}
                  {showConfidenceIntervals && timeSeriesData.map((point, index) => (
                    <div
                      key={index}
                      className="absolute bottom-0 w-2 bg-blue-100 opacity-50"
                      style={{
                        left: `${(index / (timeSeriesData.length - 1)) * 100}%`,
                        height: `${(point.upperBound - point.lowerBound) / 100 * 100}%`,
                        transform: 'translateX(-50%)',
                      }}
                    />
                  ))}
                  
                  {/* Predicted values */}
                  {timeSeriesData.map((point, index) => (
                    <div
                      key={index}
                      className="absolute bottom-0 w-3 bg-blue-600 rounded-t"
                      style={{
                        left: `${(index / (timeSeriesData.length - 1)) * 100}%`,
                        height: `${point.predictedValue}%`,
                        transform: 'translateX(-50%)',
                      }}
                    />
                  ))}
                  
                  {/* Actual values */}
                  {timeSeriesData.map((point, index) => point.actualValue && (
                    <div
                      key={`actual-${index}`}
                      className="absolute bottom-0 w-3 bg-green-500 rounded-t"
                      style={{
                        left: `${(index / (timeSeriesData.length - 1)) * 100}%`,
                        height: `${point.actualValue}%`,
                        transform: 'translateX(-50%)',
                      }}
                    />
                  ))}
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2">
                  {timeSeriesData.filter((_, i) => i % 5 === 0).map((point, index) => (
                    <span key={index}>{point.date}</span>
                  ))}
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Predicted</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Actual</span>
                </div>
                {showConfidenceIntervals && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Confidence Interval</span>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Factors & Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Risk Factors */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Risk Factors</h3>
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <div className="space-y-3">
                  {riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 mr-3 ${risk.severity === 'high' ? 'bg-red-500' : risk.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{risk.factor}</h4>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityColor(risk.severity)}`}>
                            {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunity Areas */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Opportunity Areas</h3>
                  <Lightbulb className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-3">
                  {opportunityAreas.map((opportunity, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2 mr-3 bg-green-500"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{opportunity.area}</h4>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                            {opportunity.potentialImpact}% impact
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${opportunity.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{(opportunity.confidence * 100).toFixed(0)}% confidence</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sentiment Analysis & Actions */}
          <div>
            {/* Sentiment Analysis */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
                <MessageSquare className="w-5 h-5 text-purple-500" />
              </div>
              
              {sentimentAnalysis && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${sentimentAnalysis.sentiment === 'positive' ? 'bg-green-100' : sentimentAnalysis.sentiment === 'negative' ? 'bg-red-100' : 'bg-gray-100'}`}>
                        {sentimentAnalysis.sentiment === 'positive' && <ThumbsUp className="w-5 h-5 text-green-600" />}
                        {sentimentAnalysis.sentiment === 'negative' && <XCircle className="w-5 h-5 text-red-600" />}
                        {sentimentAnalysis.sentiment === 'neutral' && <Activity className="w-5 h-5 text-gray-600" />}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900 capitalize">{sentimentAnalysis.sentiment} Sentiment</h4>
                        <p className="text-sm text-gray-600">{(sentimentAnalysis.confidence * 100).toFixed(0)}% confidence</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 italic">"{sentimentAnalysis.text}"</p>
                  </div>
                  
                  {sentimentAnalysis.emotions.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Detected Emotions:</p>
                      <div className="flex flex-wrap gap-2">
                        {sentimentAnalysis.emotions.map((emotion, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {sentimentAnalysis.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">AI Suggestions:</p>
                      <ul className="space-y-2">
                        {sentimentAnalysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <Sparkles className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recommended Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
                <Rocket className="w-5 h-5 text-orange-500" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <TargetIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Focus on Top 3 Goals</h4>
                    <p className="text-sm text-gray-600 mt-1">Prioritize completion of your most important goals this week.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Schedule Morning Sessions</h4>
                    <p className="text-sm text-gray-600 mt-1">You're most productive before 11 AM. Block time for goal work.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Join Accountability Group</h4>
                    <p className="text-sm text-gray-600 mt-1">Connect with others working on similar goals for mutual support.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Celebrate Small Wins</h4>
                    <p className="text-sm text-gray-600 mt-1">Acknowledge progress daily to maintain motivation.</p>
                  </div>
                </div>
              </div>
              
              <button className="mt-6 w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Personalized Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}