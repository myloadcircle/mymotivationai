'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [goals, setGoals] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockGoals = [
        { id: '1', title: 'Complete React course', completed: false, targetDate: '2024-12-31' },
        { id: '2', title: 'Exercise 3 times per week', completed: true, targetDate: '2024-11-30' },
        { id: '3', title: 'Read 12 books this year', completed: false, targetDate: '2024-12-31' },
      ];

      const mockQuotes = [
        { id: '1', quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
        { id: '2', quote: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
      ];

      setGoals(mockGoals);
      setQuotes(mockQuotes);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const subscriptionPlan = user.subscriptionPlan || 'free';
  const subscriptionStatus = user.subscriptionStatus || 'inactive';

  const getPlanBadgeColor = () => {
    switch (subscriptionPlan) {
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = () => {
    switch (subscriptionStatus) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-yellow-100 text-yellow-800';
      case 'past_due': return 'bg-orange-100 text-orange-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-600">Welcome back, {user.name || user.email}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor()}`}>
                    {subscriptionPlan.toUpperCase()} PLAN
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor()}`}>
                    {subscriptionStatus.toUpperCase()}
                  </span>
                </div>
                {subscriptionPlan === 'free' && (
                  <Link 
                    href="/pricing" 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Upgrade for more features →
                  </Link>
                )}
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Goals</h3>
                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
                <p className="text-sm text-gray-500">Total goals set</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Completed</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {goals.filter(g => g.completed).length}
                </p>
                <p className="text-sm text-gray-500">Goals achieved</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Quotes</h3>
                <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
                <p className="text-sm text-gray-500">Saved motivation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Your Goals</h2>
                  <Link
                    href="/dashboard/goals/new"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    + New Goal
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {goals.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No goals yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Start by creating your first goal to track your progress.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/dashboard/goals/new"
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                      >
                        Create your first goal
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {goals.map((goal) => (
                      <div key={goal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={goal.completed}
                            readOnly
                            aria-label={`Mark ${goal.title} as ${goal.completed ? 'incomplete' : 'complete'}`}
                            className="h-5 w-5 text-blue-600 rounded"
                          />
                          <div className="ml-4">
                            <h4 className="text-lg font-medium text-gray-900">{goal.title}</h4>
                            {goal.description && (
                              <p className="text-sm text-gray-500">{goal.description}</p>
                            )}
                            {goal.targetDate && (
                              <p className="text-xs text-gray-400 mt-1">
                                Target: {new Date(goal.targetDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            aria-label={`Edit ${goal.title}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-600"
                            aria-label={`Delete ${goal.title}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-gray-900">{user.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subscription</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor()}`}>
                      {subscriptionPlan.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor()}`}>
                      {subscriptionStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    href="/dashboard/profile"
                    className="w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-center block"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Daily Quote */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Daily Motivation</h3>
              <blockquote className="italic">
                "The only way to do great work is to love what you do."
              </blockquote>
              <p className="mt-2 text-right text-blue-100">— Steve Jobs</p>
              <div className="mt-4 flex justify-between">
                <button className="text-sm hover:text-blue-200">
                  Save Quote
                </button>
                <button className="text-sm hover:text-blue-200">
                  Next Quote →
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/pricing"
                  className="block px-4 py-3 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 text-center"
                >
                  {subscriptionPlan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                </Link>
                <Link
                  href="/dashboard/goals"
                  className="block px-4 py-3 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 text-center"
                >
                  View All Goals
                </Link>
                <Link
                  href="/dashboard/quotes"
                  className="block px-4 py-3 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 text-center"
                >
                  Browse Quotes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}