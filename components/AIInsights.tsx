'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Clock, 
  Zap,
  BarChart3,
  Sparkles,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AIInsight {
  type: 'analysis' | 'recommendation' | 'prediction' | 'notification';
  title: string;
  description: string;
  confidence?: number;
  priority?: 'low' | 'medium' | 'high';
  actionSteps?: string[];
  expectedImpact?: string;
}

interface AIInsightsProps {
  userId?: string;
  compact?: boolean;
  showActions?: boolean;
}

export default function AIInsights({ userId, compact = false, showActions = true }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, [userId]);

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // In a real app, this would fetch from the API
      // For demo purposes, we'll use mock data
      const mockInsights: AIInsight[] = [
        {
          type: 'analysis',
          title: 'Goal Completion Analysis',
          description: 'You complete 75% of your goals, which is above average. Your strongest category is Health & Fitness.',
          confidence: 0.85,
        },
        {
          type: 'recommendation',
          title: 'Personalized Goal Suggestion',
          description: 'Based on your success with fitness goals, try setting a 30-day running challenge.',
          confidence: 0.78,
          actionSteps: [
            'Set a target distance (e.g., 50km in 30 days)',
            'Track daily runs in the app',
            'Join the running community for motivation',
          ],
          expectedImpact: 'Improve cardiovascular health and build consistency',
        },
        {
          type: 'prediction',
          title: 'Progress Prediction',
          description: 'Your current goal "Read 12 books this year" has an 82% chance of completion by December.',
          confidence: 0.82,
          priority: 'medium',
        },
        {
          type: 'notification',
          title: 'Smart Reminder',
          description: 'You\'re most productive in the mornings. Schedule important goal work before 11 AM.',
          priority: 'high',
        },
        {
          type: 'recommendation',
          title: 'Habit Optimization',
          description: 'Consider breaking large goals into weekly milestones for better tracking.',
          confidence: 0.91,
          actionSteps: [
            'Review current long-term goals',
            'Break them into weekly checkpoints',
            'Set Sunday review sessions',
          ],
          expectedImpact: '40% improvement in long-term goal completion',
        },
      ];

      setInsights(mockInsights);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setError('Failed to load insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'analysis':
        return <BarChart3 className="h-5 w-5" />;
      case 'recommendation':
        return <Lightbulb className="h-5 w-5" />;
      case 'prediction':
        return <TrendingUp className="h-5 w-5" />;
      case 'notification':
        return <Zap className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'analysis':
        return 'bg-blue-100 text-blue-800';
      case 'recommendation':
        return 'bg-yellow-100 text-yellow-800';
      case 'prediction':
        return 'bg-green-100 text-green-800';
      case 'notification':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-100 text-gray-800';
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">AI Insights</h3>
            <p className="text-sm text-gray-600">{insights.length} personalized recommendations</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {insights.slice(0, 2).map((insight, index) => (
            <div key={index} className="flex items-start p-2 bg-white/50 rounded-lg">
              <div className={`w-6 h-6 rounded-full ${getInsightColor(insight.type)} flex items-center justify-center mr-2 flex-shrink-0`}>
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{insight.title}</div>
                <div className="text-xs text-gray-600 truncate">{insight.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
              <p className="text-blue-100">Personalized recommendations based on your goals</p>
            </div>
          </div>
          <button
            onClick={fetchInsights}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <Sparkles className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{insights.length}</div>
            <div className="text-sm text-gray-600">Total Insights</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {insights.filter(i => i.type === 'recommendation').length}
            </div>
            <div className="text-sm text-gray-600">Recommendations</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {insights.filter(i => i.confidence && i.confidence > 0.8).length}
            </div>
            <div className="text-sm text-gray-600">High Confidence</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">87%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start">
                <div className={`w-10 h-10 rounded-xl ${getInsightColor(insight.type)} flex items-center justify-center mr-4 flex-shrink-0`}>
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{insight.title}</h3>
                    <div className="flex items-center space-x-2">
                      {insight.confidence !== undefined && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                      )}
                      {insight.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                          {insight.priority} priority
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{insight.description}</p>
                  
                  {insight.actionSteps && insight.actionSteps.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        Action Steps
                      </h4>
                      <ul className="space-y-1">
                        {insight.actionSteps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {insight.expectedImpact && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-900 mb-1 flex items-center">
                        <Zap className="h-4 w-4 mr-1" />
                        Expected Impact
                      </h4>
                      <p className="text-sm text-blue-700">{insight.expectedImpact}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {showActions && (
                <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Dismiss
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Suggestion
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Explanation */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            How AI Generates Insights
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Our AI analyzes your goal patterns, completion rates, timing, and categories to provide personalized recommendations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Pattern Analysis</div>
                <div className="text-gray-600">Identifies success patterns</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Progress Prediction</div>
                <div className="text-gray-600">Forecasts goal completion</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                <Lightbulb className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Smart Suggestions</div>
                <div className="text-gray-600">Personalized recommendations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchInsights}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
          >
            🔄 Refresh Insights
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Insights update automatically as you complete more goals
          </p>
        </div>
      </div>
    </div>
  );
}