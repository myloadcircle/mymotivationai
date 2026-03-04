'use client';

import { useState } from 'react';
import PricingCard from '@/components/PricingCard';
import { Check, Shield, Zap, Users } from 'lucide-react';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanSelect = async (priceId: string) => {
    setIsLoading(true);
    // Loading state is handled by PricingCard component
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your motivation journey. All plans include our core features.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly <span className="ml-2 text-sm text-green-600">Save 35%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          <PricingCard
            plan="FREE"
            billingPeriod={billingPeriod}
            onSelect={handlePlanSelect}
            isLoading={isLoading}
          />
          <PricingCard
            plan="BASIC"
            billingPeriod={billingPeriod}
            onSelect={handlePlanSelect}
            isLoading={isLoading}
          />
          <PricingCard
            plan="PRO"
            billingPeriod={billingPeriod}
            onSelect={handlePlanSelect}
            isLoading={isLoading}
            isPopular={true}
          />
        </div>

        {/* Features Comparison */}
        <div className="mt-16 mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Compare all features
          </h2>
          <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Free</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Basic</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">Daily motivation quotes</td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">Basic goal tracking</td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">Mobile app access</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">Basic progress tracking</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">Advanced analytics</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center text-gray-400">Limited</td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">Custom motivation schedules</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">Team collaboration</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center">Up to 5 users</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">Custom goal templates</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Support</td>
                  <td className="px-6 py-4 text-center">Community</td>
                  <td className="px-6 py-4 text-center">Email</td>
                  <td className="px-6 py-4 text-center">Priority email</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <Shield className="mx-auto h-12 w-12 text-purple-600" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Secure payments</h3>
              <p className="mt-2 text-gray-600">
                All payments are processed securely through Stripe with 256-bit encryption.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <Zap className="mx-auto h-12 w-12 text-purple-600" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No setup fees</h3>
              <p className="mt-2 text-gray-600">
                Get started instantly with no hidden fees or long-term contracts.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <Users className="mx-auto h-12 w-12 text-purple-600" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Team-friendly</h3>
              <p className="mt-2 text-gray-600">
                Add team members easily and manage permissions from one dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Can I change plans later?</h3>
              <p className="mt-2 text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll only pay the prorated difference.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Is there a free trial?</h3>
              <p className="mt-2 text-gray-600">
                Yes! All paid plans include a 14-day free trial. No credit card required to start your trial.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">What payment methods do you accept?</h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) through Stripe. We also support Apple Pay and Google Pay.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Can I cancel anytime?</h3>
              <p className="mt-2 text-gray-600">
                Absolutely. You can cancel your subscription at any time from your account settings. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}