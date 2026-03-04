import { useState, useEffect, useCallback } from 'react';
import { 
  gamificationService, 
  type Achievement, 
  type UserStats, 
  type LeaderboardEntry, 
  type Challenge 
} from '@/lib/gamification';

interface UseGamificationReturn {
  // State
  loading: boolean;
  error: string | null;
  userStats: UserStats | null;
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  challenges: Array<{
    challenge: Challenge;
    progress: number;
    completed: boolean;
    rewardEarned: boolean;
  }>;
  
  // Actions
  refreshStats: () => Promise<void>;
  checkAchievements: () => Promise<Achievement[]>;
  getLeaderboard: (category?: 'global' | 'weekly' | 'monthly' | 'friends', limit?: number) => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<boolean>;
  claimReward: (challengeId: string) => Promise<boolean>;
  
  // Utilities
  calculateProgressToNextLevel: () => { current: number; next: number; progress: number };
  getLevelTitle: (level: number) => string;
  clearError: () => void;
}

export function useGamification(userId?: string): UseGamificationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [challenges, setChallenges] = useState<UseGamificationReturn['challenges']>([]);

  const clearError = useCallback(() => setError(null), []);

  const refreshStats = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    clearError();

    try {
      const stats = await gamificationService.getUserStats(userId);
      setUserStats(stats);
      
      // Also check for new achievements
      const newAchievements = await gamificationService.checkAndUnlockAchievements(userId);
      if (newAchievements.length > 0) {
        setAchievements(prev => [...prev, ...newAchievements]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user stats');
    } finally {
      setLoading(false);
    }
  }, [userId, clearError]);

  const checkAchievements = useCallback(async (): Promise<Achievement[]> => {
    if (!userId) return [];

    setLoading(true);
    clearError();

    try {
      const newAchievements = await gamificationService.checkAndUnlockAchievements(userId);
      if (newAchievements.length > 0) {
        setAchievements(prev => [...prev, ...newAchievements]);
      }
      return newAchievements;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check achievements');
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId, clearError]);

  const getLeaderboard = useCallback(async (
    category: 'global' | 'weekly' | 'monthly' | 'friends' = 'global',
    limit: number = 50
  ) => {
    setLoading(true);
    clearError();

    try {
      const leaderboardData = await gamificationService.getLeaderboard(category, limit);
      setLeaderboard(leaderboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const joinChallenge = useCallback(async (challengeId: string): Promise<boolean> => {
    if (!userId) return false;

    setLoading(true);
    clearError();

    try {
      // In production, this would call an API to join the challenge
      // For demo, we'll simulate success
      console.log(`User ${userId} joined challenge ${challengeId}`);
      
      // Refresh challenges to show updated participation
      await loadChallenges();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join challenge');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, clearError]);

  const claimReward = useCallback(async (challengeId: string): Promise<boolean> => {
    if (!userId) return false;

    setLoading(true);
    clearError();

    try {
      // In production, this would call an API to claim reward
      // For demo, we'll simulate success
      console.log(`User ${userId} claimed reward for challenge ${challengeId}`);
      
      // Award points
      await gamificationService.awardPoints(userId, 500, `Challenge ${challengeId} reward`);
      
      // Refresh stats to show updated points
      await refreshStats();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim reward');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, refreshStats, clearError]);

  const loadChallenges = useCallback(async () => {
    if (!userId) return;

    try {
      const challengeProgress = await gamificationService.getUserChallengeProgress(userId);
      setChallenges(challengeProgress);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    }
  }, [userId]);

  const calculateProgressToNextLevel = useCallback(() => {
    if (!userStats) return { current: 0, next: 0, progress: 0 };

    const currentLevel = userStats.level;
    const currentPoints = userStats.totalPoints;
    
    // Points needed for current level: 100 * level^2
    const pointsForCurrentLevel = 100 * Math.pow(currentLevel, 2);
    const pointsForNextLevel = 100 * Math.pow(currentLevel + 1, 2);
    
    const progress = ((currentPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
    
    return {
      current: pointsForCurrentLevel,
      next: pointsForNextLevel,
      progress: Math.min(Math.max(progress, 0), 100),
    };
  }, [userStats]);

  const getLevelTitle = useCallback((level: number): string => {
    const titles = [
      'Beginner', 'Novice', 'Apprentice', 'Journeyman', 'Adept',
      'Expert', 'Master', 'Grandmaster', 'Legend', 'Mythic'
    ];
    
    const index = Math.min(Math.floor(level / 10), titles.length - 1);
    return titles[index] || 'Unknown';
  }, []);

  // Load initial data
  useEffect(() => {
    if (userId) {
      refreshStats();
      getLeaderboard();
      loadChallenges();
    }
  }, [userId, refreshStats, getLeaderboard, loadChallenges]);

  return {
    // State
    loading,
    error,
    userStats,
    achievements,
    leaderboard,
    challenges,
    
    // Actions
    refreshStats,
    checkAchievements,
    getLeaderboard,
    joinChallenge,
    claimReward,
    
    // Utilities
    calculateProgressToNextLevel,
    getLevelTitle,
    clearError,
  };
}

// Hook for achievement notifications
export function useAchievementNotifications() {
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  const addAchievement = useCallback((achievement: Achievement) => {
    setNewAchievements(prev => [...prev, achievement]);
    setShowNotification(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  }, []);

  const dismissNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  const clearAchievements = useCallback(() => {
    setNewAchievements([]);
    setShowNotification(false);
  }, []);

  return {
    newAchievements,
    showNotification,
    addAchievement,
    dismissNotification,
    clearAchievements,
  };
}

// Hook for challenge participation
export function useChallengeTracker() {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);

  const trackGoalCompletion = useCallback(async (goalId: string, category?: string) => {
    // In production, this would update challenge progress
    console.log(`Tracked goal completion: ${goalId}, category: ${category}`);
  }, []);

  const trackStreakDay = useCallback(async (streakDays: number) => {
    // In production, this would update streak-based challenges
    console.log(`Tracked streak day: ${streakDays}`);
  }, []);

  const trackSocialShare = useCallback(async (platform: string) => {
    // In production, this would update social engagement challenges
    console.log(`Tracked social share on: ${platform}`);
  }, []);

  return {
    activeChallenges,
    completedChallenges,
    trackGoalCompletion,
    trackStreakDay,
    trackSocialShare,
  };
}