import { createContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi, type LoginRequest, type LoginResponse, type AuthUser } from '../api/authApi';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Khôi phục thông tin user từ localStorage khi reload trang
  useEffect(() => {
    const stored = localStorage.getItem('authUser');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthUser;
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

  const logout = useCallback(() => {
    authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
