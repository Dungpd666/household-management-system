import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AuthUser } from '../api/authApi';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'superadmin' | 'admin' | 'user';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isHouseholdUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If household user tries to access admin routes, redirect to household dashboard
  if (isHouseholdUser()) {
    return <Navigate to="/household/dashboard" replace />;
  }

  if (requiredRole) {
    const roleHierarchy = { superadmin: 3, admin: 2, user: 1 };
    const adminUser = user as AuthUser;
    const userRoleLevel = roleHierarchy[adminUser?.userRole as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};
