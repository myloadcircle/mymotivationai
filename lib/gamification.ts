/**
 * Gamification System for MotivationAI
 * 
 * This module provides achievement tracking, points system, leaderboards,
 * and engagement mechanics to increase user motivation and retention.
 */

import { prisma } from '@/lib/prisma';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'learning' | 'health' | 'finance' | 'productivity' | 'social' | 'streak' | 'milestone';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: 'goal_completion' | 'streak_days' | 'category_mastery' | 'social_shares' | 'community_engagement';
    threshold: number;
    metadata?: Record<string, any>;
  };
  unlockedAt?: Date;
}

export interface UserStats {
  userId: string;
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  achievementsUnlocked: number;
  totalGoalsCompleted: number;
  socialShares: number;
  communityPosts: number;
  lastActive: Date;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  totalPoints: number;
  level: number;
  achievementsUnlocked: number;
  currentStreak: number;
  rank: number;
  progressToNextLevel: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  startDate: Date;
  endDate: Date;
  participationPoints: number;
  completionReward: number;
  requirements: {
    type: 'goal_completion' | 'streak_maintenance' | 'category_exploration' | 'social_engagement';
    target: number;
  };
  participants: number;
  isActive: boolean;
}

class GamificationService {
  private achievements: Achievement[] = [
    {
      id: 'first_goal',
      name: 'First Step',
      description: 'Complete your first goal',
      icon: '🎯',
      points: 100,
      category: 'milestone',
      rarity: 'common',
      requirements: {
        type: 'goal_completion',
        threshold: 1,
      },
    },
    {
      id: 'streak_7',
      name: 'Weekly Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      points: 250,
      category: 'streak',
      rarity: 'uncommon',
      requirements: {
        type: 'streak_days',
        threshold: 7,
      },
    },
    {
      id: 'streak_30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: '🌟',
      points: 1000,
      category: 'streak',
      rarity: 'rare',
      requirements: {
        type: 'streak_days',
        threshold: 30,
      },
    },
    {
      id: 'goal_master',
      name: 'Goal Master',
      description: 'Complete 50 goals',
      icon: '🏆',
      points: 500,
      category: 'productivity',
      rarity: 'rare',
      requirements: {
        type: 'goal_completion',
        threshold: 50,
      },
    },
    {
      id: 'category_explorer',
      name: 'Category Explorer',
      description: 'Complete goals in 5 different categories',
      icon: '🧭',
      points: 300,
      category: 'learning',
      rarity: 'uncommon',
      requirements: {
        type: 'category_mastery',
        threshold: 5,
      },
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Share 10 achievements',
      icon: '🦋',
      points: 200,
      category: 'social',
      rarity: 'uncommon',
      requirements: {
        type: 'social_shares',
        threshold: 10,
      },
    },
    {
      id: 'community_leader',
      name: 'Community Leader',
      description: 'Post 5 times in community',
      icon: '👑',
      points: 400,
      category: 'social',
      rarity: 'rare',
      requirements: {
        type: 'community_engagement',
        threshold: 5,
      },
    },
    {
      id: 'health_champion',
      name: 'Health Champion',
      description: 'Complete 20 health & fitness goals',
      icon: '💪',
      points: 600,
      category: 'health',
      rarity: 'epic',
      requirements: {
        type: 'category_mastery',
        threshold: 20,
        metadata: { category: 'Health & Fitness' },
      },
    },
    {
      id: 'learning_guru',
      name: 'Learning Guru',
      description: 'Complete 15 education goals',
      icon: '📚',
      points: 550,
      category: 'learning',
      rarity: 'epic',
      requirements: {
        type: 'category_mastery',
        threshold: 15,
        metadata: { category: 'Education & Learning' },
      },
    },
    {
      id: 'streak_100',
      name: 'Century Streak',
      description: 'Maintain a 100-day streak',
      icon: '💯',
      points: 5000,
      category: 'streak',
      rarity: 'legendary',
      requirements: {
        type: 'streak_days',
        threshold: 100,
      },
    },
  ];

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<UserStats> {
    const goals = await prisma.goal.findMany({
      where: { userId },
    });

    const completedGoals = goals.filter(g => g.completed);
    const totalGoalsCompleted = completedGoals.length;

    // Calculate streak (simplified - in production would track daily activity)
    const currentStreak = this.calculateCurrentStreak(goals);
    const longestStreak = this.calculateLongestStreak(goals);

    // Get user's unlocked achievements
    const unlockedAchievements = await this.getUnlockedAchievements(userId);
    const achievementsUnlocked = unlockedAchievements.length;

    // Calculate total points
    const totalPoints = unlockedAchievements.reduce((sum, achievement) => sum + achievement.points, 0);

    // Calculate level based on points
    const level = this.calculateLevel(totalPoints);

    // Mock social stats (in production would query actual data)
    const socialShares = Math.floor(Math.random() * 20);
    const communityPosts = Math.floor(Math.random() * 10);

    return {
      userId,
      totalPoints,
      level,
      currentStreak,
      longestStreak,
      achievementsUnlocked,
      totalGoalsCompleted,
      socialShares,
      communityPosts,
      lastActive: new Date(),
    };
  }

  /**
   * Check and unlock achievements for a user
   */
  async checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
    const userStats = await this.getUserStats(userId);
    const alreadyUnlocked = await this.getUnlockedAchievements(userId);
    const unlockedAchievementIds = new Set(alreadyUnlocked.map(a => a.id));

    const newlyUnlocked: Achievement[] = [];

    for (const achievement of this.achievements) {
      if (unlockedAchievementIds.has(achievement.id)) {
        continue;
      }

      const isUnlocked = await this.checkAchievementRequirements(userId, achievement, userStats);
      if (isUnlocked) {
        // In production, this would save to database
        // For demo, we'll just mark it as unlocked
        const unlockedAchievement = {
          ...achievement,
          unlockedAt: new Date(),
        };
        newlyUnlocked.push(unlockedAchievement);
        unlockedAchievementIds.add(achievement.id);

        // Trigger notification
        await this.triggerAchievementNotification(userId, achievement);
      }
    }

    return newlyUnlocked;
  }

  /**
   * Get leaderboard for a specific category
   */
  async getLeaderboard(
    category: 'global' | 'weekly' | 'monthly' | 'friends' = 'global',
    limit: number = 50
  ): Promise<LeaderboardEntry[]> {
    // In production, this would query a database
    // For demo, we'll generate mock leaderboard data
    
    const mockUsers = Array.from({ length: limit }, (_, i) => ({
      userId: `user_${i + 1}`,
      username: `User${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
      totalPoints: 1000 + Math.floor(Math.random() * 5000),
      level: 1 + Math.floor(Math.random() * 20),
      achievementsUnlocked: 5 + Math.floor(Math.random() * 15),
      currentStreak: Math.floor(Math.random() * 30),
    }));

    // Sort by points and add ranks
    return mockUsers
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
        progressToNextLevel: Math.floor(Math.random() * 100),
      }));
  }

  /**
   * Get active challenges
   */
  async getActiveChallenges(): Promise<Challenge[]> {
    const now = new Date();
    
    return [
      {
        id: 'weekly_goals',
        name: 'Weekly Goal Crusher',
        description: 'Complete 5 goals this week',
        duration: 7,
        startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        participationPoints: 100,
        completionReward: 500,
        requirements: {
          type: 'goal_completion',
          target: 5,
        },
        participants: 1245,
        isActive: true,
      },
      {
        id: 'streak_challenge',
        name: '30-Day Streak Challenge',
        description: 'Maintain a streak for 30 days',
        duration: 30,
        startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        endDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        participationPoints: 200,
        completionReward: 1500,
        requirements: {
          type: 'streak_maintenance',
          target: 30,
        },
        participants: 892,
        isActive: true,
      },
      {
        id: 'category_explorer',
        name: 'Category Explorer',
        description: 'Complete goals in 3 different categories',
        duration: 14,
        startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        endDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
        participationPoints: 150,
        completionReward: 750,
        requirements: {
          type: 'category_exploration',
          target: 3,
        },
        participants: 567,
        isActive: true,
      },
    ];
  }

  /**
   * Get user's progress in active challenges
   */
  async getUserChallengeProgress(userId: string): Promise<
    Array<{
      challenge: Challenge;
      progress: number;
      completed: boolean;
      rewardEarned: boolean;
    }>
  > {
    const challenges = await this.getActiveChallenges();
    const userStats = await this.getUserStats(userId);
    const userGoals = await prisma.goal.findMany({
      where: { userId },
    });

    return challenges.map(challenge => {
      let progress = 0;
      let completed = false;

      switch (challenge.requirements.type) {
        case 'goal_completion':
          // Count goals completed during challenge period
          const goalsDuringChallenge = userGoals.filter(goal => 
            goal.completed && 
            goal.updatedAt &&
            goal.updatedAt >= challenge.startDate &&
            goal.updatedAt <= challenge.endDate
          );
          progress = Math.min(goalsDuringChallenge.length / challenge.requirements.target, 1);
          completed = goalsDuringChallenge.length >= challenge.requirements.target;
          break;

        case 'streak_maintenance':
          progress = Math.min(userStats.currentStreak / challenge.requirements.target, 1);
          completed = userStats.currentStreak >= challenge.requirements.target;
          break;

        case 'category_exploration':
          // Count unique categories of completed goals during challenge
          const categories = new Set(
            userGoals
              .filter(goal => 
                goal.completed && 
                goal.category &&
                goal.updatedAt &&
                goal.updatedAt >= challenge.startDate &&
                goal.updatedAt <= challenge.endDate
              )
              .map(goal => goal.category!)
          );
          progress = Math.min(categories.size / challenge.requirements.target, 1);
          completed = categories.size >= challenge.requirements.target;
          break;

        case 'social_engagement':
          // Mock social engagement
          progress = Math.min(userStats.socialShares / challenge.requirements.target, 1);
          completed = userStats.socialShares >= challenge.requirements.target;
          break;
      }

      return {
        challenge,
        progress,
        completed,
        rewardEarned: completed && Math.random() > 0.5, // Mock: 50% chance reward already earned
      };
    });
  }

  /**
   * Award points to user
   */
  async awardPoints(userId: string, points: number, reason: string): Promise<void> {
    console.log(`Awarded ${points} points to user ${userId} for: ${reason}`);
    // In production, this would update user's points in database
    // and potentially trigger level-ups or achievement checks
  }

  /**
   * Get user's unlocked achievements
   */
  private async getUnlockedAchievements(userId: string): Promise<Achievement[]> {
    // In production, this would query database
    // For demo, we'll return a random subset of achievements
    const unlockedCount = Math.floor(Math.random() * 5);
    return this.achievements
      .sort(() => Math.random() - 0.5)
      .slice(0, unlockedCount)
      .map(achievement => ({
        ...achievement,
        unlockedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
      }));
  }

  /**
   * Check if user meets achievement requirements
   */
  private async checkAchievementRequirements(
    userId: string,
    achievement: Achievement,
    userStats: UserStats
  ): Promise<boolean> {
    const { type, threshold, metadata } = achievement.requirements;

    switch (type) {
      case 'goal_completion':
        return userStats.totalGoalsCompleted >= threshold;

      case 'streak_days':
        return userStats.currentStreak >= threshold;

      case 'category_mastery':
        if (metadata?.category) {
          // Check specific category
          const categoryGoals = await prisma.goal.findMany({
            where: { 
              userId,
              category: metadata.category,
              completed: true,
            },
          });
          return categoryGoals.length >= threshold;
        } else {
          // Check unique categories
          const goals = await prisma.goal.findMany({
            where: { userId, completed: true },
            select: { category: true },
          });
          const uniqueCategories = new Set(goals.map(g => g.category).filter(Boolean));
          return uniqueCategories.size >= threshold;
        }

      case 'social_shares':
        return userStats.socialShares >= threshold;

      case 'community_engagement':
        return userStats.communityPosts >= threshold;

      default:
        return false;
    }
  }

  /**
   * Trigger achievement notification
   */
  private async triggerAchievementNotification(userId: string, achievement: Achievement): Promise<void> {
    console.log(`🎉 Achievement unlocked for user ${userId}: ${achievement.name}`);
    
    // In production, this would:
    // 1. Send push notification
    // 2. Add to user's notification feed
    // 3. Trigger celebration animation in UI
    // 4. Update leaderboards
  }

  /**
   * Calculate current streak based on goal completion patterns
   */
  private calculateCurrentStreak(goals: any[]): number {
    // Simplified implementation
    // In production, this would track daily activity
    const completedGoals = goals.filter(g => g.completed);
    if (completedGoals.length === 0) return 0;

    // Sort by completion date
    const sortedGoals = completedGoals
      .filter(g => g.updatedAt)
      .sort((a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime());

    if (sortedGoals.length === 0) return 0;

    // Check if last completion was today or yesterday
    const lastCompletion = sortedGoals[0].updatedAt!;
    const now = new Date();
    const daysSinceLastCompletion = Math.floor(
      (now.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceLastCompletion <= 1 ? Math.min(sortedGoals.length, 30) : 0;
  }

  /**
   * Calculate longest streak
   */
  private calculateLongestStreak(goals: any[]): number {
    // Simplified - return current streak or random value
    const currentStreak = this.calculateCurrentStreak(goals);
    return Math.max(currentStreak, Math.floor(Math.random() * 15));
  }

  /**
   * Calculate user level based on points
   */
  private calculateLevel(points: number): number {
    // Level formula: level = floor(sqrt(points / 100))
    return Math.floor(Math.sqrt(points / 100));
  }
}

// Singleton instance
export const gamificationService = new GamificationService();
