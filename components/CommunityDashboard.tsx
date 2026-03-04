'use client';

import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Users as UsersIcon, 
  TrendingUp, 
  Heart, 
  Share2, 
  MessageCircle,
  Plus,
  Search,
  Filter,
  Bell,
  Check,
  X,
  UserPlus,
  Award,
  Target,
  BarChart3,
  Globe,
  Lock,
  Calendar,
  Clock,
  ChevronRight,
  MoreVertical,
  ThumbsUp,
  Send,
  Image as ImageIcon,
  Hash,
  Eye,
  Bookmark,
  Flag,
} from 'lucide-react';
import { useCommunity, useAccountabilityPartners } from '@/hooks/useCommunity';
import { CommunityGroup, GroupPost, CollaborationRequest } from '@/lib/community';

interface CommunityDashboardProps {
  userId: string;
}

export default function CommunityDashboard({ userId }: CommunityDashboardProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'partners' | 'requests'>('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const {
    loading,
    error,
    recommendedGroups,
    userGroups,
    groupFeed,
    pendingRequests,
    communityStats,
    joinGroup,
    leaveGroup,
    createPost,
    likePost,
    commentOnPost,
    sharePost,
    sendCollaborationRequest,
    respondToRequest,
    refreshFeed,
    clearError,
  } = useCommunity(userId);

  const {
    partners,
    loading: partnersLoading,
    findPartners,
  } = useAccountabilityPartners();

  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !selectedGroup) return;

    const post = await createPost(selectedGroup, newPostContent, 'update');
    if (post) {
      setNewPostContent('');
      setShowNewPostModal(false);
      setSelectedGroup(null);
    }
  };

  // Handle liking a post
  const handleLikePost = async (postId: string) => {
    await likePost(postId);
  };

  // Handle commenting on a post
  const handleCommentOnPost = async (postId: string) => {
    const comment = commentInputs[postId];
    if (!comment?.trim()) return;

    await commentOnPost(postId, comment);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Handle sharing a post
  const handleSharePost = async (postId: string) => {
    await sharePost(postId);
  };

  // Handle joining a group
  const handleJoinGroup = async (groupId: string) => {
    await joinGroup(groupId);
  };

  // Handle leaving a group
  const handleLeaveGroup = async (groupId: string) => {
    await leaveGroup(groupId);
  };

  // Handle responding to collaboration request
  const handleRespondToRequest = async (requestId: string, accept: boolean) => {
    await respondToRequest(requestId, accept ? 'accept' : 'reject');
  };

  // Handle finding partners
  const handleFindPartners = async () => {
    await findPartners(userId, { category: 'Health & Fitness' });
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get post type icon
  const getPostTypeIcon = (type: GroupPost['type']) => {
    switch (type) {
      case 'achievement': return <Award className="w-4 h-4 text-yellow-500" />;
      case 'question': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'motivation': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'goal_share': return <Target className="w-4 h-4 text-purple-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get post type label
  const getPostTypeLabel = (type: GroupPost['type']) => {
    switch (type) {
      case 'achievement': return 'Achievement';
      case 'question': return 'Question';
      case 'motivation': return 'Motivation';
      case 'goal_share': return 'Goal Share';
      default: return 'Update';
    }
  };

  if (loading && !groupFeed.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading community data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <X className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading community</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={clearError}
              className="text-sm font-medium text-red-800 hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Community Hub</h2>
            <p className="text-gray-600 mt-1">Connect, collaborate, and grow with like-minded people</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNewPostModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </button>
            <button
              onClick={refreshFeed}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        {communityStats && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="ml-2 text-sm font-medium text-blue-900">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">{communityStats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <UsersIcon className="w-5 h-5 text-green-600" />
                <span className="ml-2 text-sm font-medium text-green-900">Active Groups</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">{communityStats.activeGroups}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span className="ml-2 text-sm font-medium text-purple-900">Total Posts</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-2">{communityStats.totalPosts.toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="ml-2 text-sm font-medium text-orange-900">Daily Engagement</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 mt-2">{communityStats.dailyEngagement.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 p-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'feed' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <MessageSquare className="w-4 h-4 mr-3" />
              Community Feed
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'groups' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <UsersIcon className="w-4 h-4 mr-3" />
              My Groups
              <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {userGroups.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'partners' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <UserPlus className="w-4 h-4 mr-3" />
              Find Partners
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${activeTab === 'requests' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Bell className="w-4 h-4 mr-3" />
              Collaboration Requests
              {pendingRequests.length > 0 && (
                <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </nav>

          {/* Recommended Groups */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommended Groups</h3>
            <div className="space-y-3">
              {recommendedGroups.slice(0, 3).map((group) => (
                <div key={group.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{group.name}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{group.description}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-gray-500">{group.memberCount.toLocaleString()} members</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{group.category}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className="mt-3 w-full text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    Join Group
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 p-6">
          {/* Feed Tab */}
          {activeTab === 'feed' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Community Feed</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-6">
                {groupFeed.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                    {/* Post Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {post.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">{post.user?.name}</h4>
                            <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                              Level {post.user?.level}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>{formatDate(post.createdAt)}</span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              {getPostTypeIcon(post.type)}
                              <span className="ml-1">{getPostTypeLabel(post.type)}</span>
                            </span>
                            <span className="mx-2">•</span>
                            <span className="text-blue-600">{post.group?.name}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="mt-4">
                      <p className="text-gray-800">{post.content}</p>
                    </div>

                    {/* Post Stats */}
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span>{post.likes} likes</span>
                      </div>
                      <div className="ml-4 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{post.comments} comments</span>
                      </div>
                      <div className="ml-4 flex items-center">
                        <Share2 className="w-4 h-4 mr-1" />
                        <span>{post.shares} shares</span>
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center space-x-4">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center text-gray-600 hover:text-blue-600"
                      >
                        <ThumbsUp className="w-5 h-5 mr-2" />
                        Like
                      </button>
                      <button
                        onClick={() => {
                          const comment = prompt('Enter your comment:');
                          if (comment) handleCommentOnPost(post.id);
                        }}
                        className="flex items-center text-gray-600 hover:text-green-600"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Comment
                      </button>
                      <button
                        onClick={() => handleSharePost(post.id)}
                        className="flex items-center text-gray-600 hover:text-purple-600"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-red-600 ml-auto">
                        <Bookmark className="w-5 h-5 mr-2" />
                        Save
                      </button>
                    </div>

                    {/* Comment Input */}
                    <div className="mt-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                          <span className="text-sm font-medium">Y</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          className="ml-3 flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCommentOnPost(post.id)}
                          className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">My Groups</h3>
                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userGroups.map((group) => (
                  <div key={group.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                            <UsersIcon className="w-6 h-6" />
                          </div>
                          <div className="ml-4">
                            <h4 className="font-semibold text-gray-900">{group.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{group.category}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-4 line-clamp-2">{group.description}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{group.memberCount.toLocaleString()} members</span>
                        <span className="mx-2">•</span>
                        {group.isPublic ? (
                          <span className="flex items-center text-green-600">
                            <Globe className="w-4 h-4 mr-1" />
                            Public
                          </span>
                        ) : (
                          <span className="flex items-center text-amber-600">
                            <Lock className="w-4 h-4 mr-1" />
                            Private
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleLeaveGroup(group.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Leave
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button className="w-full py-2 text-center text-blue-600 font-medium hover:bg-blue-50 rounded-lg">
                        View Group
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Groups Section */}
              {recommendedGroups.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommended for You</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedGroups.slice(0, 3).map((group) => (
                      <div key={group.id} className="border border-gray-200 rounded-xl p-5">
                        <h4 className="font-semibold text-gray-900">{group.name}</h4>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{group.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-gray-500">{group.memberCount.toLocaleString()} members</span>
                          <button
                            onClick={() => handleJoinGroup(group.id)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Join
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Find Accountability Partners</h3>
                <button
                  onClick={handleFindPartners}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Partners
                </button>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <UserPlus className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-blue-900">Why find an accountability partner?</h4>
                    <p className="text-blue-800 mt-2">
                      Studies show that having an accountability partner increases goal completion rates by 65%.
                      Find someone with similar goals to motivate each other, share progress, and celebrate wins together.
                    </p>
                  </div>
                </div>
              </div>

              {partnersLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Finding compatible partners...</p>
                  </div>
                </div>
              ) : partners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partners.map((partner) => (
                    <div key={partner.userId} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                      <div className="flex items-start">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {partner.name.charAt(0)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">{partner.name}</h4>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {partner.compatibilityScore}% match
                            </span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-600">
                            <Award className="w-4 h-4 mr-1" />
                            <span>Level {partner.level}</span>
                            <span className="mx-2">•</span>
                            <Target className="w-4 h-4 mr-1" />
                            <span>{partner.sharedGoals} shared goals</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Completion Rate</p>
                          <p className="text-lg font-semibold text-gray-900">{partner.completionRate}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Current Streak</p>
                          <p className="text-lg font-semibold text-gray-900">{partner.streakDays} days</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => sendCollaborationRequest(partner.userId, 'goal_buddy', `Hi ${partner.name}, I think we'd make great accountability partners!`)}
                          className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                        >
                          Send Partnership Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserPlus className="w-16 h-16 text-gray-300 mx-auto" />
                  <h4 className="mt-4 text-lg font-semibold text-gray-900">No partners found yet</h4>
                  <p className="text-gray-600 mt-2">Click "Find Partners" to discover compatible accountability partners.</p>
                </div>
              )}
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Collaboration Requests</h3>
                <span className="text-sm text-gray-500">{pendingRequests.length} pending</span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto" />
                  <h4 className="mt-4 text-lg font-semibold text-gray-900">No pending requests</h4>
                  <p className="text-gray-600 mt-2">You're all caught up! Check back later for new collaboration requests.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-xl p-5">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white">
                          <UserPlus className="w-6 h-6" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {request.type === 'goal_buddy' ? 'Goal Buddy Request' :
                                 request.type === 'accountability_partner' ? 'Accountability Partner Request' :
                                 request.type === 'mentorship' ? 'Mentorship Request' : 'Group Invite'}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                From User{request.fromUserId.slice(-3)}
                              </p>
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              {formatDate(request.createdAt)}
                            </span>
                          </div>
                          
                          {request.message && (
                            <div className="mt-3 bg-gray-50 rounded-lg p-4">
                              <p className="text-gray-800">{request.message}</p>
                            </div>
                          )}

                          <div className="mt-4 flex items-center space-x-3">
                            <button
                              onClick={() => handleRespondToRequest(request.id, true)}
                              className="flex-1 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleRespondToRequest(request.id, false)}
                              className="flex-1 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 flex items-center justify-center"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Decline
                            </button>
                            <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Post</h3>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Group
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {userGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className={`p-3 border rounded-lg text-left ${selectedGroup === group.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                    >
                      <div className="font-medium text-gray-900">{group.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{group.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to share?
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your achievement, ask a question, or motivate others..."
                  className="w-full h-48 border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Hash className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || !selectedGroup}
                    className={`px-4 py-2 font-medium rounded-lg ${!newPostContent.trim() || !selectedGroup ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
