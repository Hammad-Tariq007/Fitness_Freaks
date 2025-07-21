import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  id: string;
  plan: 'free' | 'pro';
  is_active: boolean;
  started_at?: string;
  expires_at?: string;
  provider?: string;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  hasProAccess: boolean;
  checkSubscription: () => Promise<void>;
  createCheckoutSession: (priceId: string, plan: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setSubscription({
        id: user.id,
        plan: data.plan,
        is_active: data.is_active,
        expires_at: data.expires_at,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Fallback to free plan
      setSubscription({
        id: user.id,
        plan: 'free',
        is_active: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (priceId: string, plan: string) => {
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId, plan },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    window.open(data.url, '_blank');
  };

  const openCustomerPortal = async () => {
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    window.location.href = data.url;
  };

  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  const hasProAccess = subscription?.plan === 'pro' && subscription?.is_active;

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        hasProAccess,
        checkSubscription,
        createCheckoutSession,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
