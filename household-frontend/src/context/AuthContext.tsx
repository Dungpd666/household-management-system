import { createContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  authApi,
  type LoginRequest,
  type HouseholdLoginRequest,
  type LoginResponse,
  type HouseholdLoginResponse,
  type AuthUser,
  type HouseholdAuthUser
} from '../api/authApi';

interface AuthContextType {
  isAuthenticated: boolean;
  user: (AuthUser | HouseholdAuthUser) | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  householdLogin: (credentials: HouseholdLoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isHouseholdUser: () => boolean;
  isAdminUser: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [user, setUser] = useState<(AuthUser | HouseholdAuthUser) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Khôi phục thông tin user từ localStorage khi reload trang
  useEffect(() => {
    const stored = localStorage.getItem('authUser');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as (AuthUser | HouseholdAuthUser);
        setUser(parsed);
      } catch {
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      const data: LoginResponse = response.data;

      localStorage.setItem('token', data.accessToken);
      const authUser: AuthUser = {
        userID: data.userID,
        userRole: data.userRole,
        userName: data.userName,
        userType: 'admin',
      };
      localStorage.setItem('authUser', JSON.stringify(authUser));

      setIsAuthenticated(true);
      setUser(authUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const householdLogin = useCallback(async (credentials: HouseholdLoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.householdLogin(credentials);
      const data: HouseholdLoginResponse = response.data;

      localStorage.setItem('token', data.accessToken);
      const householdUser: HouseholdAuthUser = {
        userID: data.householdID,
        householdCode: data.householdCode,
        userType: 'household',
      };
      localStorage.setItem('authUser', JSON.stringify(householdUser));

      setIsAuthenticated(true);
      setUser(householdUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Household login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isHouseholdUser = useCallback(() => {
    return user?.userType === 'household';
  }, [user]);

  const isAdminUser = useCallback(() => {
    return user?.userType === 'admin';
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        householdLogin,
        logout,
        clearError,
        isHouseholdUser,
        isAdminUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
