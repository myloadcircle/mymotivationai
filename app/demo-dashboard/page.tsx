'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, Target, Users, TrendingUp, 
  Award, Calendar, Bell, Settings,
  Brain, Sparkles, Zap, Trophy
} from 'lucide-react'
import Link from 'next/link'

export default function DemoDashboard() {
  const [stats, setStats] = useState({
    motivationScore: 85,
    goalsCompleted: 12,
    streakDays: 7,
    communityPoints: 450
  })

  const [goals, setGoals] = useState([
    { id: 1, title: 'Complete morning routine', progress: 100, completed: true },
    { id: 2, title: 'Read 30 pages daily', progress: 75, completed: false },
    { id: 3, title: 'Exercise 5 days/week', progress: 60, completed: false },
    { id: 4, title: 'Learn new skill', progress: 30, completed: false },
  ])

  const [insights, setInsights] = useState([
    { id: 1, title: 'Morning productivity peak', description: 'You\'re most productive between 8-11 AM' },
    { id: 2, title: 'Consistency improving', description: 'Your daily streak has increased by 40% this week' },
    { id: 3, title: 'Community engagement', description: 'You\'ve helped 3 members stay motivated' },
  ])

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Early Bird', icon: '🌅', unlocked: true },
    { id: 2, title: 'Goal Crusher', icon: '🎯', unlocked: true },
    { id: 3, title: 'Motivation Master', icon: '🧠', unlocked: false },
    { id: 4, title: 'Community Hero', icon: '👥', unlocked: true },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Demo Dashboard</h1>
                <p className="text-gray-600">Preview of myMotivationAI features</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Back to Home
              </Link>
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In (Requires DB)
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.motivationScore}%</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Motivation Score</h3>
            <p className="text-gray-600">AI-calculated motivation level</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${stats.motivationScore}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.goalsCompleted}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Goals Completed</h3>
            <p className="text-gray-600">This month's achievements</p>
            <div className="mt-4 flex items-center">
              <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-600">On track for 15+ goals</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.streakDays} days</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Streak</h3>
            <p className="text-gray-600">Daily consistency streak</p>
            <div className="mt-4 flex items-center">
              <div className="flex space-x-1">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < stats.streakDays ? 'bg-purple-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.communityPoints}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Community Points</h3>
            <p className="text-gray-600">Engagement & contributions</p>
            <div className="mt-4 flex items-center">
              <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-600">Top 20% in community</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Goals */}
          <div className="lg:col-span-2 space-y-8">
            {/* Goals Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Active Goals</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  + Add Goal
                </button>
              </div>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 text-gray-400 mr-3" />
                        <h3 className="font-medium text-gray-900">{goal.title}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        goal.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {goal.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">AI-Powered Insights</h2>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                    <p className="text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Personalized Recommendation</p>
                    <p className="text-sm text-gray-600">Try our morning motivation routine at 8 AM for maximum productivity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`text-center p-4 rounded-lg border ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h3 className="font-medium text-gray-900 mb-1">{achievement.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      achievement.unlocked 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {achievement.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">View Analytics</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">Schedule Session</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">Set Reminders</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">Preferences</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>

            {/* Database Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-bold text-yellow-800 mb-2">⚠️ Database Required</h3>
              <p className="text-yellow-700 mb-4">
                This is a demo dashboard. To use full features with authentication, you need to:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700 mb-4">
                <li>Set up Supabase database</li>
                <li>Update DATABASE_URL in .env.local</li>
                <li>Run database migrations</li>
              </ol>
              <Link
                href="/"
                className="block w-full text-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                View Setup Instructions
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              Demo Dashboard • myMotivationAI • All features shown here are fully functional with database setup
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link href="/phase4-test" className="text-gray-300 hover:text-white">
                Phase 4 Test
              </Link>
              <Link href="/phase5-test" className="text-gray-300 hover:text-white">
                Phase 5 Test
              </Link>
              <Link href="/phase6-test" className="text-gray-300 hover:text-white">
                Phase 6 Test
              </Link>
              <Link href="/demo/celebration" className="text-gray-300 hover:text-white">
                Celebration Demo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}