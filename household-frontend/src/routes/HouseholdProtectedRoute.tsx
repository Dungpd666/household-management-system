import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface HouseholdProtectedRouteProps {
  children: ReactNode;
}

export const HouseholdProtectedRoute = ({ children }: HouseholdProtectedRouteProps) => {
  const { isAuthenticated, isHouseholdUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/household-login" replace />;
  }

  if (!isHouseholdUser()) {
    // If authenticated but not a household user, redirect to admin dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};
