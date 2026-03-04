'use client';

import Link from 'next/link';
import { Check, Sparkles, Target, TrendingUp, Users } from 'lucide-react';

export default function FreeTierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 mb-6">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">No credit card required</span>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
          Start Your <span className="text-blue-600">Motivation Journey</span> for Free
        </h1>
        
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Join thousands of users who are achieving their goals with our free plan. 
          Get daily motivation, track basic goals, and build better habits—all at no cost.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup?plan=free"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Free
            <Sparkles className="ml-2 h-5 w-5" />
          </Link>
          
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Compare All Plans
          </Link>
        </div>
        
        <p className="mt-4 text-sm text-gray-500">
          No credit card required • Cancel anytime • 100% free forever
        </p>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Get with Free Plan
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Goal Tracking</h3>
            <p className="text-gray-600">Set and track up to 3 personal goals with progress monitoring.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Motivation Quotes</h3>
            <p className="text-gray-600">Receive curated motivational quotes every day to keep you inspired.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic Progress Insights</h3>
            <p className="text-gray-600">Visualize your progress with simple charts and completion rates.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Access</h3>
            <p className="text-gray-600">Join our community forum for tips, support, and motivation.</p>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Perfect for Getting Started
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Free Plan Includes:</h3>
              <ul className="space-y-3">
                {[
                  'Up to 3 active goals',
                  'Daily motivation quotes',
                  'Basic progress tracking',
                  'Community forum access',
                  'Email reminders',
                  'Mobile-responsive web app',
                  'Data export (CSV)',
                  '7-day activity history',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready for More?</h3>
              <p className="text-gray-600 mb-6">
                Upgrade anytime to unlock unlimited goals, advanced analytics, AI-powered insights, 
                and premium features.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Unlimited Goals</span>
                  <span className="text-sm font-medium text-blue-600">Basic+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Advanced Analytics</span>
                  <span className="text-sm font-medium text-blue-600">Basic+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">AI-Powered Insights</span>
                  <span className="text-sm font-medium text-purple-600">Pro Only</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Team Collaboration</span>
                  <span className="text-sm font-medium text-purple-600">Pro Only</span>
                </div>
              </div>
              
              <Link
                href="/pricing"
                className="mt-6 inline-block w-full text-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium"
              >
                Compare All Features
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Loved by Free Users
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              quote: "The free plan helped me build a daily meditation habit. After 30 days, I upgraded to Basic!",
              author: "Sarah M.",
              role: "Free → Basic User",
            },
            {
              quote: "Perfect for students. The daily quotes keep me motivated during exam season.",
              author: "James L.",
              role: "Student User",
            },
            {
              quote: "Started with free, now on Pro. The gradual upgrade path made perfect sense.",
              author: "David K.",
              role: "Pro User",
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of motivated individuals achieving their goals every day.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?plan=free"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-transparent border-2 border-white rounded-xl hover:bg-white/10 transition-colors"
            >
              See Paid Plans
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-blue-200">
            No credit card • No commitment • Start in 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
}