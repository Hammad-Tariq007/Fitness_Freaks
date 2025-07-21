
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useAuth } from '@/contexts/AuthContext';

export const useFeatureAccess = () => {
  const { hasPremiumAccess, isAdmin } = usePremiumAccess();
  const { user } = useAuth();

  const canAccessFeature = (feature: string): boolean => {
    // Admin always has access
    if (isAdmin) return true;
    
    // Check if user has premium access
    if (hasPremiumAccess) return true;
    
    // Free features that everyone can access
    const freeFeatures = [
      'basic-workouts',
      'basic-nutrition',
      'blog',
      'bmi-calculator',
      'landing-page'
    ];
    
    return freeFeatures.includes(feature);
  };

  const getWorkoutLimit = (): number => {
    if (hasPremiumAccess || isAdmin) return Infinity;
    return 3; // Free users can view 3 workouts
  };

  const canSaveContent = (): boolean => {
    return hasPremiumAccess || isAdmin;
  };

  const canAccessCommunity = (): boolean => {
    return hasPremiumAccess || isAdmin;
  };

  const canAccessDashboard = (): boolean => {
    return hasPremiumAccess || isAdmin;
  };

  const canUseAIFeatures = (): boolean => {
    return hasPremiumAccess || isAdmin;
  };

  return {
    canAccessFeature,
    getWorkoutLimit,
    canSaveContent,
    canAccessCommunity,
    canAccessDashboard,
    canUseAIFeatures,
    hasPremiumAccess,
    isAdmin,
    isAuthenticated: !!user,
  };
};
