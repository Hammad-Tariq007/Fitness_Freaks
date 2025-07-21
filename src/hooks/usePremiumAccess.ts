
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';

export const usePremiumAccess = () => {
  const { hasProAccess, loading } = useSubscription();
  const { profile } = useAuth();
  
  // Admin users always have premium access
  const hasPremiumAccess = hasProAccess || profile?.role === 'admin';
  
  return {
    hasPremiumAccess,
    hasProAccess,
    isAdmin: profile?.role === 'admin',
    loading, // <-- Added this line
  };
};
