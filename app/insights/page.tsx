'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import AIInsights from '@/components/AIInsights';
import SmartNotifications from '@/components/SmartNotifications';
import ProgressChart from '@/components/ProgressChart';
import StreakTracker from '@/components/StreakTracker';
import ABTestingResults from '@/components/ABTestingResults';
import {
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  Bell,
  Zap,
  BarChart3,
  Sparkles,
  ArrowRight,
  Settings,
  Download,
  Share2,
  TestTube
} from 'lucide-react';

export default function InsightsDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'predictions' | 'notifications' | 'abtesting'>('overview');

  const mockChartData = [
    { month: 'Jan', completed: 3, total: 5 },
    { month: 'Feb', completed: 5, total: 7 },
    { month: 'Mar', completed: 4, total: 6 },
    { month: 'Apr', completed: 7, total: 8 },
    { month: 'May', completed: 6, total: 7 },
    { month: 'Jun', completed: 8, total: 10 },
  ];

  const stats = [
    { label: 'Goal Completion Rate', value: '75%', change: '+12%', icon: <Target className="h-5 w-5" />, color: 'bg-green-500' },
    { label: 'Motivation Score', value: '82/100', change: '+8', icon: <TrendingUp className="h-5 w-5" />, color: 'bg-blue-500' },
    { label: 'Active Streak', value: '7 days', change: '+2 days', icon: <Zap className="h-5 w-5" />, color: 'bg-orange-500' },
    { label: 'AI Suggestions', value: '12', change: '+3', icon: <Lightbulb className="h-5 w-5" />, color: 'bg-purple-500' },
  ];

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                AI-Powered Insights Dashboard
              </h1>
              <p className="text-gray-600">
                Personalized recommendations, predictions, and smart notifications based on your goal patterns
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label="Settings"
                title="Settings"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <button
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label="Download insights"
                title="Download insights"
              >
                <Download className="h-5 w-5 text-gray-600" />
              </button>
              <button
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label="Share dashboard"
                title="Share dashboard"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Brain className="h-5 w-5 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                activeTab === 'recommendations'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Lightbulb className="h-5 w-5 mr-2" />
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab('predictions')}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                activeTab === 'predictions'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Predictions
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button
              onClick={() => setActiveTab('abtesting')}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                activeTab === 'abtesting'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <TestTube className="h-5 w-5 mr-2" />
              A/B Testing
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Insights */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <>
                <AIInsights compact={false} showActions={true} />
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Progress Analytics
                      </h2>
                      <p className="text-gray-600">Monthly goal completion trends</p>
                    </div>
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      aria-label="Time period for analytics"
                      title="Select time period"
                    >
                      <option>Last 6 months</option>
                      <option>Last 12 months</option>
                      <option>Year to date</option>
                    </select>
                  </div>
                  <ProgressChart />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-100">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-green-600" />
                      Success Patterns
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                        You complete 85% of fitness goals
                      </li>
                      <li className="flex items-start text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                        Most productive on Tuesday mornings
                      </li>
                      <li className="flex items-start text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                        Goals with weekly milestones have 40% higher completion
                      </li>
                      <li className="flex items-start text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                        You respond well to celebration triggers
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-100">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-blue-600" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                        <div className="font-medium text-gray-900">Set a new goal based on AI suggestions</div>
                        <div className="text-sm text-gray-600">Personalized recommendation ready</div>
                      </button>
                      <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                        <div className="font-medium text-gray-900">Review upcoming deadlines</div>
                        <div className="text-sm text-gray-600">3 goals due this week</div>
                      </button>
                      <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                        <div className="font-medium text-gray-900">Adjust notification preferences</div>
                        <div className="text-sm text-gray-600">Optimize for your schedule</div>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Personalized Recommendations</h2>
                  <AIInsights compact={false} showActions={true} />
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border border-yellow-100">
                  <h3 className="font-bold text-gray-900 mb-4">💡 How Recommendations Work</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                          Goal completion history
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                          Time and day patterns
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                          Category preferences
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-2"></div>
                          Streak and consistency data
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">AI Algorithms</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2"></div>
                          Pattern recognition
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 mr-2"></div>
                          Predictive analytics
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 mr-2"></div>
                          Behavioral analysis
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-pink-500 rounded-full mt-1.5 mr-2"></div>
                          Success probability scoring
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'predictions' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Predictions</h2>
                  <div className="space-y-4">
                    {[
                      { goal: 'Complete React Course', confidence: 82, dueDate: '2024-03-15', status: 'on_track' },
                      { goal: 'Run 100km this month', confidence: 65, dueDate: '2024-03-31', status: 'at_risk' },
                      { goal: 'Read 12 books this year', confidence: 91, dueDate: '2024-12-31', status: 'ahead' },
                      { goal: 'Save $5,000', confidence: 45, dueDate: '2024-06-30', status: 'needs_attention' },
                    ].map((prediction, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-medium text-gray-900">{prediction.goal}</div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            prediction.confidence >= 80 ? 'bg-green-100 text-green-800' :
                            prediction.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {prediction.confidence}% confidence
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Due: {prediction.dueDate}</span>
                          <span className={`font-medium ${
                            prediction.status === 'on_track' ? 'text-green-600' :
                            prediction.status === 'ahead' ? 'text-blue-600' :
                            prediction.status === 'at_risk' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {prediction.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              prediction.confidence >= 80 ? 'bg-green-500' :
                              prediction.confidence >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${prediction.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <SmartNotifications maxNotifications={10} />
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Goal reminders', description: 'Get notified about upcoming deadlines', enabled: true },
                      { label: 'AI suggestions', description: 'Receive personalized recommendations', enabled: true },
                      { label: 'Streak updates', description: 'Daily motivation and streak tracking', enabled: true },
                      { label: 'Progress reports', description: 'Weekly summary of your achievements', enabled: false },
                      { label: 'Community activity', description: 'Updates from your motivation groups', enabled: false },
                    ].map((setting, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{setting.label}</div>
                          <div className="text-sm text-gray-600">{setting.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={setting.enabled}
                            aria-label={`Toggle ${setting.label}`}
                            title={setting.label}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <StreakTracker compact={false} />
            
            {/* A/B Testing Results */}
            <ABTestingResults showAllExperiments={false} />
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Insights Summary
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">Pattern Recognition</div>
                  <div className="text-xs text-blue-700">Identified 3 success patterns in your goal completion</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-900">Predictive Accuracy</div>
                  <div className="text-xs text-green-700">87% accurate on completion predictions</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-900">Recommendation Impact</div>
                  <div className="text-xs text-purple-700">Applied suggestions show 35% better results</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-4">🚀 Next Steps</h3>
              <div className="space-y-3">
                <Link
                  href="/goals/new"
                  className="flex items-center p-3 bg-white border border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Set New Goal</div>
                    <div className="text-sm text-gray-600">Based on AI suggestions</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                </Link>
                
                <Link
                  href="/dashboard"
                  className="flex items-center p-3 bg-white border border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">View Dashboard</div>
                    <div className="text-sm text-gray-600">Complete progress overview</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                </Link>
                
                <button className="w-full flex items-center p-3 bg-white border border-gray-300 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Generate Report</div>
                    <div className="text-sm text-gray-600">Download insights summary</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">📊 AI Confidence</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Goal Predictions</span>
                    <span>82%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Recommendation Accuracy</span>
                    <span>76%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Pattern Recognition</span>
                    <span>91%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            AI insights update in real-time based on your goal activity. 
            The more goals you track, the smarter the recommendations become.
          </p>
          <p className="mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
    </AuthenticatedLayout>
  );
}
