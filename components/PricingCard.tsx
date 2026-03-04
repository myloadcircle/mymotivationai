'use client';

import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { formatPrice, PRODUCTS, PRICING } from '@/lib/stripe';

interface PricingCardProps {
  plan: 'FREE' | 'BASIC' | 'PRO';
  billingPeriod: 'monthly' | 'yearly';
  onSelect: (priceId: string) => void;
  isLoading?: boolean;
  isPopular?: boolean;
}

export default function PricingCard({
  plan,
  billingPeriod,
  onSelect,
  isLoading = false,
  isPopular = false,
}: PricingCardProps) {
  const product = PRODUCTS[plan];
  const price = PRICING[plan][billingPeriod];
  const monthlyEquivalent = billingPeriod === 'yearly' ? price / 12 : price;
  
  // These would come from environment variables in production
  const priceIds = {
    FREE: {
      monthly: 'free',
      yearly: 'free',
    },
    BASIC: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID || 'price_basic_monthly',
      yearly: process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID || 'price_basic_yearly',
    },
    PRO: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
      yearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
    },
  };

  const priceId = priceIds[plan][billingPeriod];

  const handleSubscribe = async () => {
    if (plan === 'FREE') {
      // For free plan, redirect to signup page
      window.location.href = '/auth/signup?plan=free';
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          mode: 'subscription',
          metadata: {
            plan,
            billingPeriod,
          },
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned:', data);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <div className={`relative rounded-2xl border-2 p-8 ${isPopular ? 'border-purple-500 bg-gradient-to-b from-purple-50 to-white' : 'border-gray-200 bg-white'}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4" />
            Most Popular
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
        <p className="mt-2 text-gray-600">{product.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-gray-900">
            {plan === 'FREE' ? 'Free' : formatPrice(price)}
          </span>
          {plan !== 'FREE' && (
            <span className="ml-2 text-gray-600">/{billingPeriod === 'yearly' ? 'year' : 'month'}</span>
          )}
        </div>
        {plan !== 'FREE' && billingPeriod === 'yearly' && (
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-green-600">Save 35%</span> • {formatPrice(monthlyEquivalent)}/month
          </p>
        )}
        {plan === 'FREE' && (
          <p className="mt-2 text-sm text-gray-600">No credit card required</p>
        )}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className={`w-full rounded-lg py-3 font-semibold transition-all ${
          plan === 'FREE' 
            ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300' 
            : isPopular 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' 
              : 'bg-gray-900 text-white hover:bg-gray-800'
        } disabled:opacity-50`}
      >
        {isLoading ? 'Processing...' : plan === 'FREE' ? 'Get Started Free' : 'Get Started'}
      </button>

      <ul className="mt-8 space-y-4">
        {product.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>


    </div>
  );
}