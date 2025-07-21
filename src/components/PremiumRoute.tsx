
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { PremiumGate } from '@/components/PremiumGate';

interface PremiumRouteProps {
  feature: string;
  description?: string;
  redirectTo?: string;
  children?: React.ReactNode;
}

export const PremiumRoute: React.FC<PremiumRouteProps> = ({
  feature,
  description,
  redirectTo = '/pricing',
  children,
}) => {
  const { user, loading } = useAuth();
  const { hasPremiumAccess, isAdmin } = usePremiumAccess();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Allow access if user has premium access or is admin
  if (hasPremiumAccess || isAdmin) {
    // Render children if provided, otherwise render Outlet for nested routes
    return children ? <>{children}</> : <Outlet />;
  }

  // Show premium gate for non-premium users
  return (
    <PremiumGate
      feature={feature}
      description={description}
    />
  );
};
