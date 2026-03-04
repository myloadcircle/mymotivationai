'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface FeatureGateProps {
  children: React.ReactNode;
  requiredPlan?: 'free' | 'basic' | 'pro';
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export default function FeatureGate({
  children,
  requiredPlan = 'free',
  fallback,
  showUpgradePrompt = true,
}: FeatureGateProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Please{' '}
          <Link href="/auth/signin" className="font-medium text-yellow-700 underline">
            sign in
          </Link>{' '}
          to access this feature.
        </p>
      </div>
    );
  }

  const userPlan = session.user.subscriptionPlan || 'free';
  const userStatus = session.user.subscriptionStatus || 'inactive';

  // Check if user has access
  const hasAccess = checkPlanAccess(userPlan, requiredPlan) && userStatus === 'active';

  if (hasAccess) {
    return <>{children}</>;
  }

  // Custom fallback
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  if (showUpgradePrompt) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              {requiredPlan === 'free' ? 'Feature Unavailable' : 'Upgrade Required'}
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              {requiredPlan === 'free' ? (
                <p>This feature requires an active subscription. Your current plan is: <span className="font-semibold">{userPlan.toUpperCase()}</span></p>
              ) : (
                <p>This feature is available on the <span className="font-semibold">{requiredPlan.toUpperCase()}</span> plan or higher. Your current plan is: <span className="font-semibold">{userPlan.toUpperCase()}</span></p>
              )}
            </div>
            <div className="mt-4">
              <Link
                href="/pricing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                {userPlan === 'free' ? 'View Plans' : 'Upgrade Plan'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Helper function to check plan access
export function checkPlanAccess(userPlan: string, requiredPlan: string): boolean {
  const planHierarchy = {
    'free': 0,
    'basic': 1,
    'pro': 2,
  };

  const userLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;
  const requiredLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 0;

  return userLevel >= requiredLevel;
}

// Hook version for programmatic access
export function useFeatureAccess(requiredPlan: string = 'free') {
  const { data: session, status } = useSession();

  if (status !== 'authenticated' || !session?.user) {
    return {
      hasAccess: false,
      isLoading: status === 'loading',
      userPlan: null,
      userStatus: null,
    };
  }

  const userPlan = session.user.subscriptionPlan || 'free';
  const userStatus = session.user.subscriptionStatus || 'inactive';

  const hasAccess = checkPlanAccess(userPlan, requiredPlan) && userStatus === 'active';

  return {
    hasAccess,
    isLoading: false,
    userPlan,
    userStatus,
  };
}

// Component for showing plan-specific badges
interface PlanBadgeProps {
  plan: 'free' | 'basic' | 'pro';
  size?: 'sm' | 'md' | 'lg';
}

export function PlanBadge({ plan, size = 'md' }: PlanBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const planColors = {
    free: 'bg-gray-100 text-gray-800',
    basic: 'bg-blue-100 text-blue-800',
    pro: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`${sizeClasses[size]} ${planColors[plan]} rounded-full font-medium`}>
      {plan.toUpperCase()}
    </span>
  );
}