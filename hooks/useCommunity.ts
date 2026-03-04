import { useState, useEffect, useCallback } from 'react';
import { 
  communityService, 
  type CommunityGroup, 
  type GroupPost, 
  type GroupMember,
  type CollaborationRequest 
} from '@/lib/community';

interface UseCommunityReturn {
  // State
  loading: boolean;
  error: string | null;
  recommendedGroups: CommunityGroup[];
  userGroups: CommunityGroup[];
  groupFeed: GroupPost[];
  pendingRequests: CollaborationRequest[];
  communityStats: {
    totalUsers: number;
    activeGroups: number;
    totalPosts: number;
    dailyEngagement: number;
    topCategories: Array<{ category: string; count: number }>;
  } | null;
  
  // Actions
  joinGroup: (groupId: string) => Promise<boolean>;
  leaveGroup: (groupId: string) => Promise<boolean>;
  createPost: (groupId: string, content: string, type?: GroupPost['type']) => Promise<GroupPost | null>;
  likePost: (postId: string) => Promise<boolean>;
  commentOnPost: (postId: string, comment: string) => Promise<boolean>;
  sharePost: (postId: string) => Promise<boolean>;
  sendCollaborationRequest: (toUserId: string, type: CollaborationRequest['type'], message?: string) => Promise<boolean>;
  respondToRequest: (requestId: string, response: 'accept' | 'reject') => Promise<boolean>;
  refreshFeed: () => Promise<void>;
  
  // Utilities
  clearError: () => void;
}

export function useCommunity(userId?: string): UseCommunityReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedGroups, setRecommendedGroups] = useState<CommunityGroup[]>([]);
  const [userGroups, setUserGroups] = useState<CommunityGroup[]>([]);
  const [groupFeed, setGroupFeed] = useState<GroupPost[]>([]);
  const [pendingRequests, setPendingRequests] = useState<CollaborationRequest[]>([]);
  const [communityStats, setCommunityStats] = useState<UseCommunityReturn['communityStats']>(null);

  const clearError = useCallback(() => setError(null), []);

  const loadCommunityData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    clearError();

    try {
      const [
        recommended,
        userGroupsData,
        feed,
        requests,
        stats
      ] = await Promise.all([
        communityService.getRecommendedGroups(userId),
        communityService.getUserGroups(userId),
        communityService.getGroupFeed(userId),
        communityService.getPendingRequests(userId),
        communityService.getCommunityStats(),
      ]);

      setRecommendedGroups(recommended);
      setUserGroups(userGroupsData);
      setGroupFeed(feed);
      setPendingRequests(requests);
      setCommunityStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load community data');
    } finally {
      setLoading(false);
    }
  }, [userId, clearError]);

  const joinGroup = useCallback(async (groupId: string): Promise<boolean> => {
    if (!userId) return false;

    setLoading(true);
    clearError();

    try {
      const success = await communityService.joinGroup(userId, groupId);
      if (success) {
        // Refresh groups and feed
        await loadCommunityData();
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join group');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, loadCommunityData, clearError]);

  const leaveGroup = useCallback(async (groupId: string): Promise<boolean> => {
    if (!userId) return false;

    setLoading(true);
    clearError();

    try {
      const success = await communityService.leaveGroup(userId, groupId);
      if (success) {
        // Refresh groups and feed
        await loadCommunityData();
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave group');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, loadCommunityData, clearError]);

  const createPost = useCallback(async (
    groupId: string,
    content: string,
    type: GroupPost['type'] = 'update'
  ): Promise<GroupPost | null> => {
    if (!userId) return null;

    setLoading(true);
    clearError();

    try {
      const post = await communityService.createPost(userId, groupId, content, type);
      if (post) {
        // Add to feed and refresh
        setGroupFeed(prev => [post, ...prev]);
        return post;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, clearError]);

  const likePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!userId) return false;

    setLoading(true);
    clearError();

    try {
      const success = await communityService.likePost(userId, postId);
      if (success) {
        // Update post in feed
        setGroupFeed(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes + 1 }
            : post
        ));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like post');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, clearError]);

  const commentOnPost = useCallback(async (postId: string, comment: string): Promise<boolean> => {
    if (!userId) return false;

    setLoading(true);
    clearError();

    try {
      const success = await communityService.commentOnPost(userId, postId, comment);
      if (success) {
        // Update post in feed
        setGroupFeed(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, comments: post.comments + 1 }
            : post
        ));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to comment on post');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, clearError]);

  const sharePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!userId) return false;

    setLoading(true);
    clearError();

    try {
      const success = await communityService.sharePost(userId, postId);
      if (success) {
        // Update post in feed
        setGroupFeed(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, shares: post.shares + 1 }
            : post
        ));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share post');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, clearError]);

  const sendCollaborationRequest = useCallback(async (
    toUserId: string,
    type: CollaborationRequest['type'],
    message?: string
  ): Promise<boolean> => {
    if (!userId) return false;

    setLoading(true);
    clearError();

    try {
      const success = await communityService.sendCollaborationRequest(userId, toUserId, type, message);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send collaboration request');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, clearError]);

  const respondToRequest = useCallback(async (
    requestId: string,
    response: 'accept' | 'reject'
  ): Promise<boolean> => {
    if (!userId) return false;

    setLoading(true);
    clearError();

    try {
      const success = await communityService.respondToRequest(requestId, response, userId);
      if (success) {
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to respond to request');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, clearError]);

  const refreshFeed = useCallback(async () => {
    await loadCommunityData();
  }, [loadCommunityData]);

  // Load initial data
  useEffect(() => {
    if (userId) {
      loadCommunityData();
    }
  }, [userId, loadCommunityData]);

  return {
    // State
    loading,
    error,
    recommendedGroups,
    userGroups,
    groupFeed,
    pendingRequests,
    communityStats,
    
    // Actions
    joinGroup,
    leaveGroup,
    createPost,
    likePost,
    commentOnPost,
    sharePost,
    sendCollaborationRequest,
    respondToRequest,
    refreshFeed,
    
    // Utilities
    clearError,
  };
}

// Hook for finding accountability partners
export function useAccountabilityPartners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findPartners = useCallback(async (
    userId: string,
    criteria?: {
      category?: string;
      goalType?: string;
      timezone?: string;
      experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      // In production, this would call the community service
      // For demo, we'll use mock data
      const mockPartners = [
        {
          userId: 'partner_1',
          name: 'GoalGetter',
          level: 15,
          sharedGoals: 3,
          completionRate: 85,
          streakDays: 21,
          compatibilityScore: 92,
          categories: ['Health & Fitness', 'Personal Development'],
        },
        {
          userId: 'partner_2',
          name: 'ConsistentChris',
          level: 12,
          sharedGoals: 2,
          completionRate: 78,
          streakDays: 45,
          compatibilityScore: 87,
          categories: ['Career & Business', 'Finance'],
        },
        {
          userId: 'partner_3',
          name: 'MotivatedMary',
          level: 18,
          sharedGoals: 4,
          completionRate: 91,
          streakDays: 14,
          compatibilityScore: 83,
          categories: ['Education & Learning', 'Personal Development'],
        },
      ];

      // Filter by criteria if provided
      let filteredPartners = mockPartners;
      if (criteria?.category) {
        filteredPartners = filteredPartners.filter(partner =>
          partner.categories.includes(criteria.category!)
        );
      }

      setPartners(filteredPartners);
      return filteredPartners;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find partners');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    partners,
    loading,
    error,
    findPartners,
    clearError,
  };
}