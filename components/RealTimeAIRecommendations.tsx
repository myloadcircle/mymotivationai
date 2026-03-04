'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Brain, 
  Zap, 
  Clock, 
  TrendingUp, 
  Target, 
  Lightbulb,
  RefreshCw,
  CheckCircle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Bookmark,
  ExternalLink,
  Sparkles,
  Rocket,
  Award,
  Users,
  Calendar,
  Bell,
  Settings,
  Filter,
  Search,
  ChevronRight,
  Star,
  Heart,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react';
import { aiInsightsService, type PersonalizedRecommendation } from '@/lib/ai/insights';

interface RealTimeAIRecommendationsProps {
  userId: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  maxRecommendations?: number;
}

interface UserFeedback {
  recommendationId: string;
  helpful: boolean;
  feedbackText?: string;
  timestamp: Date;
}

export default function RealTimeAIRecommendations({ 
  userId, 
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
  maxRecommendations = 5 
}: RealTimeAIRecommendationsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [minConfidence, setMinConfidence] = useState(0.7);

  const recommendationTypes = [
    { id: 'all', label: 'All Types', icon: <Brain className="w-4 h-4" /> },
    { id: 'goal_suggestion', label: 'Goal Suggestions', icon: <Target className="w-4 h-4" /> },
    { id: 'habit_adjustment', label: 'Habit Adjustments', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'timing_optimization', label: 'Timing Optimization', icon: <Clock className="w-4 h-4" /> },
    { id: 'category_expansion', label: 'Category Expansion', icon: <Lightbulb className="w-4 h-4" /> },
  ];

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user context (in production, this would fetch real data)
      const mockContext = {
        currentGoals: [
          { id: '1', title: 'Complete React Course', category: 'Learning', completed: false },
          { id: '2', title: 'Exercise 5x per week', category: 'Health', completed: false },
          { id: '3', title: 'Read 12 books this year', category: 'Personal Development', completed: false },
        ],
        recentActivity: [
          { id: 'a1', type: 'goal_completed', description: 'Completed morning meditation', createdAt: new Date(Date.now() - 86400000) },
          { id: 'a2', type: 'goal_updated', description: 'Updated fitness goal progress', createdAt: new Date(Date.now() - 172800000) },
          { id: 'a3', type: 'goal_created', description: 'Started new learning goal', createdAt: new Date(Date.now() - 259200000) },
        ],
        userPreferences: {
          notificationFrequency: 'daily',
          preferredCategories: ['Health', 'Learning', 'Personal Development'],
          timezone: 'UTC',
        },
      };

      // Generate real-time recommendations
      const realTimeRecs = await aiInsightsService.generateRealTimeRecommendations(userId, mockContext);
      
      // Apply filters
      let filteredRecs = realTimeRecs;
      if (filterType !== 'all') {
        filteredRecs = filteredRecs.filter(rec => rec.type === filterType);
      }
      filteredRecs = filteredRecs.filter(rec => rec.confidence >= minConfidence);
      
      // Limit to max recommendations
      filteredRecs = filteredRecs.slice(0, maxRecommendations);
      
      setRecommendations(filteredRecs);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }, [userId, filterType, minConfidence, maxRecommendations]);

  const handleFeedback = (recommendationId: string, helpful: boolean) => {
    const feedback: UserFeedback = {
      recommendationId,
      helpful,
      timestamp: new Date(),
    };
    
    setUserFeedback(prev => [...prev, feedback]);
    
    // In production, this would send feedback to the server
    console.log(`User feedback: ${helpful ? 'Helpful' : 'Not helpful'} for recommendation ${recommendationId}`);
    
    // If feedback is negative, consider refreshing recommendations
    if (!helpful) {
      setTimeout(() => {
        loadRecommendations();
      }, 2000);
    }
  };

  const handleApplyRecommendation = (recommendation: PersonalizedRecommendation) => {
    // In production, this would trigger an action (create goal, update habit, etc.)
    console.log(`Applying recommendation: ${recommendation.title}`);
    
    // Show success message
    alert(`Applied recommendation: ${recommendation.title}`);
  };

  const getTypeIcon = (type: PersonalizedRecommendation['type']) => {
    switch (type) {
      case 'goal_suggestion': return <Target className="w-5 h-5 text-blue-500" />;
      case 'habit_adjustment': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'timing_optimization': return <Clock className="w-5 h-5 text-purple-500" />;
      case 'category_expansion': return <Lightbulb className="w-5 h-5 text-amber-500" />;
      default: return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: PersonalizedRecommendation['type']) => {
    switch (type) {
      case 'goal_suggestion': return 'Goal Suggestion';
      case 'habit_adjustment': return 'Habit Adjustment';
      case 'timing_optimization': return 'Timing Optimization';
      case 'category_expansion': return 'Category Expansion';
      default: return 'Recommendation';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  // Auto-refresh effect
  useEffect(() => {
    loadRecommendations();
    
    if (autoRefresh) {
      const intervalId = setInterval(loadRecommendations, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [loadRecommendations, autoRefresh, refreshInterval]);

  if (loading && recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your patterns for real-time recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-red-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading recommendations</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={loadRecommendations}
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
            <div className="flex items-center">
              <Brain className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Real-Time AI Recommendations</h2>
            </div>
            <p className="text-gray-600 mt-1">
              Personalized suggestions based on your current activity and patterns
              {lastUpdated && (
                <span className="text-sm text-gray-500 ml-2">
                  • Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={loadRecommendations}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Refresh recommendations"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {recommendationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFilterType(type.id)}
                      className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${filterType === type.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <span className="mr-2">{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Confidence: {(minConfidence * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Any</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Type Filter Quick Select */}
        <div className="mt-4 flex items-center space-x-2 overflow-x-auto pb-2">
          {recommendationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`flex-shrink-0 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${filterType === type.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6">
        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No recommendations found</h3>
            <p className="text-gray-600 mt-2">
              Try adjusting your filters or check back later for new suggestions.
            </p>
            <button
              onClick={() => {
                setFilterType('all');
                setMinConfidence(0.5);
                loadRecommendations();
              }}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((recommendation, index) => {
              const userFeedbackForRec = userFeedback.find(fb => fb.recommendationId === recommendation.title);
              
              return (
                <div key={index} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {getTypeIcon(recommendation.type)}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
                          <span className={`ml-3 text-xs font-medium px-2 py-1 rounded-full ${getConfidenceColor(recommendation.confidence)}`}>
                            {(recommendation.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2">{recommendation.description}</p>
                        
                        {recommendation.actionSteps && recommendation.actionSteps.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Action Steps:</h4>
                            <ul className="space-y-2">
                              {recommendation.actionSteps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start text-sm text-gray-700">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {recommendation.expectedImpact && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                              <Zap className="w-4 h-4 text-blue-500 mr-2" />
                              <span className="text-sm font-medium text-blue-900">Expected Impact:</span>
                            </div>
                            <p className="text-sm text-blue-800 mt-1">{recommendation.expectedImpact}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {getTypeLabel(recommendation.type)}
                      </span>
                      {userFeedbackForRec && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${userFeedbackForRec.helpful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {userFeedbackForRec.helpful ? 'Helpful' : 'Not helpful'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleApplyRecommendation(recommendation)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Apply Recommendation
                      </button>
                      
                      <button
                        onClick={() => handleFeedback(recommendation.title, true)}
                        className={`inline-flex items-center px-3 py-2 border ${userFeedbackForRec?.helpful === true ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} font-medium rounded-lg`}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Helpful
                      </button>
                      
                      <button
                        onClick={() => handleFeedback(recommendation.title, false)}
                        className={`inline-flex items-center px-3 py-2 border ${userFeedbackForRec?.helpful === false ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} font-medium rounded-lg`}
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Not Helpful
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Stats & Info */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Brain className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">AI Model</p>
                  <p className="text-sm text-gray-600">Real-time pattern analysis</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Refresh Rate</p>
                  <p className="text-sm text-gray-600">Every 30 seconds</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Accuracy</p>
                  <p className="text-sm text-gray-600">Improving with feedback</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Recommendations are generated in real-time based on your activity patterns, goal progress, and historical data.
              The AI model continuously learns from your feedback to provide more accurate suggestions.
            </p>
            <button
              onClick={loadRecommendations}
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh recommendations now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}