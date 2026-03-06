import Link from 'next/link'
import { ArrowRight, Brain, Target, Users, BarChart, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Motivation Platform
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Transform Your
              <span className="block text-blue-600">Motivation with AI</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Get personalized AI-powered motivation exercises, track your progress, and achieve your goals with our intelligent self-improvement platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Motivated
            </h2>
            <p className="text-xl text-gray-600">
              Our platform combines cutting-edge AI with proven motivation techniques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Get personalized motivation strategies based on your behavior patterns and progress history.
              </p>
            </div>

            <div className="bg-green-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Goal Tracking</h3>
              <p className="text-gray-600">
                Set, track, and achieve your goals with intelligent reminders and progress analytics.
              </p>
            </div>

            <div className="bg-purple-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Support</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals, share progress, and get motivation from the community.
              </p>
            </div>

            <div className="bg-orange-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Progress Analytics</h3>
              <p className="text-gray-600">
                Visualize your journey with detailed analytics and performance metrics.
              </p>
            </div>

            <div className="bg-pink-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gamification</h3>
              <p className="text-gray-600">
                Earn badges, level up, and unlock achievements as you progress on your motivation journey.
              </p>
            </div>

            <div className="bg-indigo-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Predictive Analytics</h3>
              <p className="text-gray-600">
                Our AI predicts when you might lose motivation and provides proactive support.
              </p>
            </div>
          </div>
        </div>
      </div>

       {/* Mobile App Section */}
      <div className="py-24 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Now Available as Mobile App
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Take Your Motivation Anywhere
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Download our hybrid native app for Android and access your motivation tools offline, with native performance and seamless experience.
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Offline-First Design</h4>
                    <p className="text-gray-600">Track goals and progress even without internet connection</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Native Performance</h4>
                    <p className="text-gray-600">Fast, smooth experience with native Android features</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Automatic Sync</h4>
                    <p className="text-gray-600">Data syncs automatically when you're back online</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/download/motivationai-release.apk"
                  className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download Android APK
                </a>
                <a
                  href="/qr-codes"
                  className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-gray-900 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Scan QR Code
                </a>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Android 8.0+ required • 100% Free • No ads
              </p>
            </div>
            
            <div className="relative">
              <div className="relative mx-auto max-w-md">
                {/* Mock phone showing ACTUAL app interface */}
                <div className="relative bg-gray-900 rounded-[40px] p-6 shadow-2xl">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
                  <div className="bg-gray-800 rounded-[32px] overflow-hidden">
                    {/* Actual MotivationAI dashboard mockup */}
                    <div className="bg-gradient-to-b from-blue-50 to-white p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-blue-600 font-bold text-lg">myMotivationAI</div>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">AI</span>
                        </div>
                      </div>
                      
                      {/* Stats cards */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-blue-100">
                          <div className="text-xs text-gray-500 mb-1">Active Goals</div>
                          <div className="text-xl font-bold text-blue-600">3</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-blue-100">
                          <div className="text-xs text-gray-500 mb-1">Today's Progress</div>
                          <div className="text-xl font-bold text-green-600">75%</div>
                        </div>
                      </div>
                      
                      {/* Goal progress */}
                      <div className="bg-white rounded-xl p-3 shadow-sm border border-blue-100 mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium text-gray-900">Fitness Goal</div>
                          <div className="text-sm text-blue-600">65%</div>
                        </div>
                        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      
                      {/* Quick actions */}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-500 text-white text-sm font-medium py-2 rounded-lg">
                          + Goal
                        </button>
                        <button className="flex-1 bg-green-500 text-white text-sm font-medium py-2 rounded-lg">
                          Log Progress
                        </button>
                      </div>
                      
                      {/* Bottom nav */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-around">
                        <div className="text-center">
                          <div className="w-6 h-6 bg-blue-100 rounded-full mx-auto mb-1"></div>
                          <div className="text-xs text-blue-600 font-medium">Dashboard</div>
                        </div>
                        <div className="text-center">
                          <div className="w-6 h-6 bg-gray-100 rounded-full mx-auto mb-1"></div>
                          <div className="text-xs text-gray-500">Goals</div>
                        </div>
                        <div className="text-center">
                          <div className="w-6 h-6 bg-gray-100 rounded-full mx-auto mb-1"></div>
                          <div className="text-xs text-gray-500">Profile</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating QR code */}
                <div className="absolute -right-4 -top-4 bg-white p-4 rounded-2xl shadow-2xl">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg mb-2 flex items-center justify-center">
                      <div className="text-center">
                        <div className="grid grid-cols-3 gap-1 mb-1">
                          <div className="w-6 h-6 bg-black rounded-sm"></div>
                          <div className="w-6 h-6 bg-white border border-gray-300 rounded-sm"></div>
                          <div className="w-6 h-6 bg-black rounded-sm"></div>
                          <div className="w-6 h-6 bg-white border border-gray-300 rounded-sm"></div>
                          <div className="w-6 h-6 bg-black rounded-sm"></div>
                          <div className="w-6 h-6 bg-white border border-gray-300 rounded-sm"></div>
                          <div className="w-6 h-6 bg-black rounded-sm"></div>
                          <div className="w-6 h-6 bg-white border border-gray-300 rounded-sm"></div>
                          <div className="w-6 h-6 bg-black rounded-sm"></div>
                        </div>
                        <div className="text-xs text-gray-600 font-medium mt-1">Scan Me</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Scan to download</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Motivation?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join thousands of users who have achieved their goals with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
            >
              View Pricing Plans
            </Link>
            <a
              href="/download/motivationai-release.apk"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Download Mobile App
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">myMotivationAI</h3>
              <p className="text-gray-400">AI-powered motivation for everyone</p>
            </div>
            <div className="flex gap-8">
              <Link href="/demo-dashboard" className="text-gray-300 hover:text-white">
                Try Demo
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white">
                Pricing
              </Link>
              <Link href="/auth/signin" className="text-gray-300 hover:text-white">
                Sign In
              </Link>
              <Link href="/free" className="text-gray-300 hover:text-white">
                Free Tier
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} myMotivationAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}