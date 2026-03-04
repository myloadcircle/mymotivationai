'use client';

import { useState, useEffect } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Users, 
  Target, 
  Flame, 
  Star, 
  Crown,
  Medal,
  Zap,
  ChevronRight,
  CheckCircle,
  Clock,
  Gift
} from 'lucide-react';

interface AchievementCardProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
    category: string;
    rarity: string;
    unlockedAt?: Date;
  };
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'uncommon': return 'bg-green-100 text-green-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak': return <Flame className="h-4 w-4" />;
      case 'productivity': return <Target className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'learning': return <Star className="h-4 w-4" />;
      case 'health': return <Zap className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">{achievement.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                {achievement.rarity}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  {getCategoryIcon(achievement.category)}
                  <span className="ml-1 capitalize">{achievement.category}</span>
                </div>
                <div className="flex items-center text-sm text-yellow-600">
                  <Star className="h-3 w-3" />
                  <span className="ml-1">{achievement.points} pts</span>
                </div>
              </div>
              {achievement.unlockedAt && (
                <div className="text-xs text-gray-500">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
        {achievement.unlockedAt ? (
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
        ) : (
          <Clock className="h-5 w-5 text-gray-300 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

interface ChallengeCardProps {
  challenge: {
    challenge: {
      id: string;
      name: string;
      description: string;
      duration: number;
      endDate: Date;
      participationPoints: number;
      completionReward: number;
      participants: number;
    };
    progress: number;
    completed: boolean;
    rewardEarned: boolean;
  };
  onJoin: (challengeId: string) => void;
  onClaim: (challengeId: string) => void;
}

function ChallengeCard({ challenge, onJoin, onClaim }: ChallengeCardProps) {
  const daysLeft = Math.ceil((challenge.challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900">{challenge.challenge.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{challenge.challenge.description}</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          {challenge.challenge.participants.toLocaleString()}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(challenge.progress * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${challenge.progress * 100}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {daysLeft} days left
          </div>
          <div className="flex items-center text-sm text-yellow-600">
            <Gift className="h-4 w-4 mr-1" />
            {challenge.challenge.completionReward} pts
          </div>
        </div>

        <div className="flex space-x-2">
          {!challenge.completed && (
            <button
              onClick={() => onJoin(challenge.challenge.id)}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
            >
              Join
            </button>
          )}
          {challenge.completed && !challenge.rewardEarned && (
            <button
              onClick={() => onClaim(challenge.challenge.id)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-teal-700"
            >
              Claim Reward
            </button>
          )}
          {challenge.rewardEarned && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
              Reward Claimed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GamificationDashboard({ userId }: { userId: string }) {
  const {
    loading,
    error,
    userStats,
    achievements,
    leaderboard,
    challenges,
    refreshStats,
    checkAchievements,
    getLeaderboard,
    joinChallenge,
    claimReward,
    calculateProgressToNextLevel,
    getLevelTitle,
    clearError,
  } = useGamification(userId);

  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard' | 'challenges'>('overview');

  useEffect(() => {
    refreshStats();
    getLeaderboard();
  }, [refreshStats, getLeaderboard]);

  const handleJoinChallenge = async (challengeId: string) => {
    const success = await joinChallenge(challengeId);
    if (success) {
      // Refresh challenges
      refreshStats();
    }
  };

  const handleClaimReward = async (challengeId: string) => {
    const success = await claimReward(challengeId);
    if (success) {
      // Refresh stats and challenges
      refreshStats();
    }
  };

  const handleCheckAchievements = async () => {
    const newAchievements = await checkAchievements();
    if (newAchievements.length > 0) {
      alert(`🎉 Unlocked ${newAchievements.length} new achievements!`);
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <Trophy className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-red-800">Error Loading Gamification Data</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={clearError}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (loading && !userStats) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">Loading gamification data...</p>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="p-8 text-center">
        <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="font-medium text-gray-900 mb-2">No Gamification Data</h3>
        <p className="text-gray-600">Complete some goals to start earning achievements!</p>
      </div>
    );
  }

  const progress = calculateProgressToNextLevel();
  const levelTitle = getLevelTitle(userStats.level);

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gamification Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Track your achievements, compete on leaderboards, and join challenges
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={handleCheckAchievements}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
              >
                Check Achievements
              </button>
              <button
                onClick={refreshStats}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* User Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center">
                <Crown className="h-8 w-8 mr-4" />
                <div>
                  <p className="text-sm opacity-90">Level {userStats.level}</p>
                  <p className="text-2xl font-bold">{levelTitle}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress to Level {userStats.level + 1}</span>
                  <span>{progress.progress.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.totalPoints.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Achievements</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.achievementsUnlocked}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Flame className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.currentStreak} days</p>
                  <p className="text-xs text-gray-500">Longest: {userStats.longestStreak} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'achievements' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Achievements
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'leaderboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'challenges' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Challenges
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Achievements */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Achievements</h2>
                    <button className="text-blue-600 text-sm font-medium flex items-center">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {achievements.slice(0, 3).map(achievement => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                    {achievements.length === 0 && (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No achievements unlocked yet</p>
                        <p className="text-sm text-gray-500 mt-1">Complete goals to earn achievements!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Challenges */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Active Challenges</h2>
                  <div className="space-y-4">
                    {challenges.slice(0, 2).map((challenge) => (
                      <ChallengeCard
                        key={challenge.challenge.id}
                        challenge={challenge}
                        onJoin={handleJoinChallenge}
                        onClaim={handleClaimReward}
                      />
                    ))}
                    {challenges.length === 0 && (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No active challenges</p>
                        <p className="text-sm text-gray-500 mt-1">Check back soon for new challenges!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Leaderboard Preview */}
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Global Leaderboard</h2>
                    <button 
                      onClick={() => setActiveTab('leaderboard')}
                      className="text-blue-600 text-sm font-medium flex items-center"
                    >
                      View Full <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {leaderboard.slice(0, 5).map((entry, index) => (
                      <div key={entry.userId} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {index < 3 ? (
                              <Medal className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{entry.username}</div>
                            <div className="text-xs text-gray-500">Level {entry.level}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{entry.totalPoints.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{entry.achievementsUnlocked} achievements</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* User's Position */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-4">Your Position</h3>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-blue-700">#</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">You</div>
                          <div className="text-xs text-gray-500">Level {userStats.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{userStats.totalPoints.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{userStats.achievementsUnlocked} achievements</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">All Achievements</h2>
                <div className="text-sm text-gray-600">
                  {achievements.filter(a => a.unlockedAt).length} of {achievements.length} unlocked
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Global Leaderboard</h2>
                <p className="text-gray-600 mt-2">Top performers from around the world</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Achievements
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Streak
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaderboard.map(entry => (
                      <tr key={entry.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                            entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {entry.rank <= 3 ? (
                              <Medal className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-medium">{entry.rank}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                              {/* Avatar would go here */}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{entry.username}</div>
                              <div className="text-sm text-gray-500">{getLevelTitle(entry.level)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{entry.level}</div>
                          <div className="text-xs text-gray-500">{entry.progressToNextLevel}% to next</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{entry.totalPoints.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-yellow-500 mr-2" />
                            <span className="font-medium">{entry.achievementsUnlocked}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Flame className="h-4 w-4 text-red-500 mr-2" />
                            <span className="font-medium">{entry.currentStreak} days</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Active Challenges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {challenges.map(challenge => (
                    <ChallengeCard
                      key={challenge.challenge.id}
                      challenge={challenge}
                      onJoin={handleJoinChallenge}
                      onClaim={handleClaimReward}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
                <div className="flex items-center">
                  <Target className="h-12 w-12 mr-6" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Challenge Yourself!</h3>
                    <p className="opacity-90">
                      Join challenges to earn extra points, unlock exclusive achievements, 
                      and compete with other motivated users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
