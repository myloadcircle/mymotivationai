'use client';

import { useState, useEffect } from 'react';
import { Flame, Trophy, Calendar, TrendingUp, Zap, Target } from 'lucide-react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  streakHistory: Array<{
    date: string;
    activity: string;
    metadata?: any;
  }>;
  weeklyStats: {
    daysActive: number;
    goalsCompleted: number;
    quotesSaved: number;
  };
}

interface StreakTrackerProps {
  userId?: string;
  showDetails?: boolean;
  compact?: boolean;
}

export default function StreakTracker({ userId, showDetails = true, compact = false }: StreakTrackerProps) {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStreakData();
  }, [userId]);

  const fetchStreakData = async () => {
    try {
      // In a real app, this would fetch from an API endpoint
      // For now, we'll use mock data
      const mockData: StreakData = {
        currentStreak: 7,
        longestStreak: 14,
        lastActivityDate: new Date().toISOString(),
        streakHistory: [
          { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), activity: 'goal_completed', metadata: { goalId: '1', title: 'Morning Run' } },
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), activity: 'quote_saved', metadata: { quoteId: '1' } },
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), activity: 'goal_completed', metadata: { goalId: '2', title: 'Read 30 pages' } },
          { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), activity: 'login', metadata: {} },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), activity: 'goal_completed', metadata: { goalId: '3', title: 'Meditate 10min' } },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), activity: 'quote_saved', metadata: { quoteId: '2' } },
          { date: new Date().toISOString(), activity: 'goal_completed', metadata: { goalId: '4', title: 'Workout' } },
        ],
        weeklyStats: {
          daysActive: 7,
          goalsCompleted: 4,
          quotesSaved: 2,
        },
      };
      
      setStreakData(mockData);
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Start your streak today!';
    if (streak === 1) return 'First day! Keep going!';
    if (streak < 3) return 'Building momentum!';
    if (streak < 7) return 'Great consistency!';
    if (streak < 14) return 'Amazing dedication!';
    if (streak < 30) return 'Unstoppable!';
    return 'Legendary streak!';
  };

  const getStreakLevel = (streak: number) => {
    if (streak === 0) return 'beginner';
    if (streak < 3) return 'novice';
    if (streak < 7) return 'intermediate';
    if (streak < 14) return 'advanced';
    if (streak < 30) return 'expert';
    return 'master';
  };

  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-500 bg-gray-100';
    if (streak < 3) return 'text-orange-500 bg-orange-50';
    if (streak < 7) return 'text-yellow-500 bg-yellow-50';
    if (streak < 14) return 'text-green-500 bg-green-50';
    if (streak < 30) return 'text-blue-500 bg-blue-50';
    return 'text-purple-500 bg-purple-50';
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'goal_completed':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'quote_saved':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'login':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return <Flame className="h-4 w-4 text-orange-500" />;
    }
  };

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case 'goal_completed':
        return 'Goal Completed';
      case 'quote_saved':
        return 'Quote Saved';
      case 'login':
        return 'Daily Login';
      default:
        return 'Activity';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (!streakData) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-xl">
        <p className="text-gray-500">No streak data available</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <Flame className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{streakData.currentStreak} days</div>
              <div className="text-sm text-gray-600">Current streak</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Best: {streakData.longestStreak} days</div>
            <div className="text-xs text-gray-400">{getStreakMessage(streakData.currentStreak)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Flame className="h-6 w-6 mr-2" />
              Streak Tracker
            </h2>
            <p className="text-orange-100 mt-1">Build consistency, achieve greatness</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{streakData.currentStreak}</div>
            <div className="text-orange-100">days in a row</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{streakData.currentStreak}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <Flame className="h-4 w-4 mr-1" />
              Current Streak
            </div>
            <div className={`mt-2 text-xs px-2 py-1 rounded-full ${getStreakColor(streakData.currentStreak)}`}>
              {getStreakLevel(streakData.currentStreak).toUpperCase()}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{streakData.longestStreak}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <Trophy className="h-4 w-4 mr-1" />
              Longest Streak
            </div>
            <div className="mt-2 text-xs text-gray-500">Personal best</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{streakData.weeklyStats.daysActive}/7</div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-1" />
              This Week
            </div>
            <div className="mt-2 text-xs text-gray-500">Active days</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{streakData.weeklyStats.goalsCompleted}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <Target className="h-4 w-4 mr-1" />
              Goals Done
            </div>
            <div className="mt-2 text-xs text-gray-500">This week</div>
          </div>
        </div>

        {/* Weekly Calendar */}
        {showDetails && (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Weekly Activity</h3>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const dayOffset = 6 - index;
                  const targetDate = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000);
                  const targetDateStr = targetDate.toISOString().split('T')[0];
                  const hasActivity = streakData.streakHistory.some(activity => 
                    activity.date.startsWith(targetDateStr)
                  );
                  
                  return (
                    <div key={day} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{day}</div>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
                        hasActivity 
                          ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {hasActivity ? '✓' : targetDate.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {streakData.streakHistory.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                      {getActivityIcon(activity.activity)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {getActivityLabel(activity.activity)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.metadata?.title || ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips & Motivation */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-2">💡 Streak Tips</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Complete at least one goal or save a quote daily to maintain your streak</li>
                <li>• Streaks reset after 24 hours of inactivity</li>
                <li>• Set daily reminders to help build consistency</li>
                <li>• Celebrate milestone streaks (3, 7, 14, 30 days)</li>
              </ul>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Current streak: {streakData.currentStreak} days</span>
                <span>Next milestone: {Math.ceil(streakData.currentStreak / 7) * 7} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (streakData.currentStreak % 7) / 7 * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Week {Math.floor(streakData.currentStreak / 7) + 1}</span>
                <span>{7 - (streakData.currentStreak % 7)} days to next week</span>
              </div>
            </div>
          </>
        )}

        {/* Call to Action */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              // In a real app, this would trigger an activity
              fetchStreakData();
            }}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
          >
            🔥 Log Today's Activity
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Complete a goal or save a quote to extend your streak
          </p>
        </div>
      </div>
    </div>
  );
}

// Hook for tracking streaks
export function useStreakTracking() {
  const [streak, setStreak] = useState(0);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);

  const trackActivity = async (activityType: string, metadata?: any) => {
    try {
      // In a real app, this would call an API endpoint
      const response = await fetch('/api/streak/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityType, metadata }),
      });

      if (response.ok) {
        const data = await response.json();
        setStreak(data.currentStreak);
        setLastActivity(new Date(data.lastActivityDate));
        return data;
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  const checkStreakStatus = () => {
    if (!lastActivity) return 'inactive';
    
    const now = new Date();
    const last = new Date(lastActivity);
    const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
    
    if (diffHours > 48) return 'broken';
    if (diffHours > 24) return 'at_risk';
    return 'active';
  };

  return {
    streak,
    lastActivity,
    trackActivity,
    checkStreakStatus,
    streakStatus: checkStreakStatus(),
  };
}