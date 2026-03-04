'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing';
  subscriptionPlan?: 'BASIC' | 'PRO' | 'ENTERPRISE';
  subscriptionBillingPeriod?: 'monthly' | 'yearly';
  subscriptionCurrentPeriodEnd?: Date;
  subscriptionCancelAtPeriodEnd?: boolean;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateSubscription: (subscriptionData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // In a real app, you would verify the session with your backend
      const storedUser = localStorage.getItem('mymotivationai_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Refresh subscription status from backend
        await refreshSubscriptionStatus(parsedUser);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscriptionStatus = async (userData: User) => {
    if (!userData.stripeSubscriptionId) return;

    try {
      const response = await fetch(`/api/subscriptions/${userData.stripeSubscriptionId}`);
      if (response.ok) {
        const subscription = await response.json();
        
        const updatedUser = {
          ...userData,
          subscriptionStatus: subscription.status,
          subscriptionPlan: subscription.metadata?.plan || userData.subscriptionPlan,
          subscriptionBillingPeriod: subscription.metadata?.billingPeriod || userData.subscriptionBillingPeriod,
          subscriptionCurrentPeriodEnd: subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000)
            : userData.subscriptionCurrentPeriodEnd,
          subscriptionCancelAtPeriodEnd: subscription.cancel_at_period_end,
        };

        setUser(updatedUser);
        localStorage.setItem('mymotivationai_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would authenticate with your backend
      // For demo purposes, we'll create a mock user
      const mockUser: User = {
        id: 'user_123',
        email,
        name: email.split('@')[0],
        stripeCustomerId: 'cus_mock_' + Date.now(),
        stripeSubscriptionId: 'sub_mock_' + Date.now(),
        subscriptionStatus: 'active',
        subscriptionPlan: 'PRO',
        subscriptionBillingPeriod: 'monthly',
        subscriptionCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subscriptionCancelAtPeriodEnd: false,
      };

      setUser(mockUser);
      localStorage.setItem('mymotivationai_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mymotivationai_user');
  };

  const updateSubscription = (subscriptionData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...subscriptionData };
    setUser(updatedUser);
    localStorage.setItem('mymotivationai_user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    if (!user) return;
    await refreshSubscriptionStatus(user);
  };

  const isAuthenticated = !!user;
  const isSubscribed = user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trialing';

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isSubscribed,
        login,
        logout,
        updateSubscription,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}