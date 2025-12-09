import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/users';
import { usersApi } from '../api/usersApi';

interface UsersContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  createUser: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}

export const UsersContext = createContext<UsersContextType | undefined>(undefined);

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider = ({ children }: UsersProviderProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getAll();
      setUsers(response.data);
    } catch (err: any) {
      const message = err?.message || 'Failed to fetch users';
      // If backend returns 404/No users or 500 for empty, treat as empty list
      if (err?.status === 404 || err?.status === 500) {
        setUsers([]);
        setError(null);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: string) => {
    try {
      const response = await usersApi.getById(id);
      return response.data;
    } catch (err: any) {
      const message = err?.message || 'Failed to fetch user';
      setError(message);
      return null;
    }
  }, []);

  const createUser = useCallback(async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await usersApi.create(data);
      setUsers((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to create user');
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: Partial<User>) => {
    try {
      const response = await usersApi.update(id, data);
      const numericId = Number(id);
      setUsers((prev) => prev.map((user) => (user.id === numericId ? response.data : user)));
      return response.data;
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to update user');
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await usersApi.delete(id);
      const numericId = Number(id);
      setUsers((prev) => prev.filter((user) => user.id !== numericId));
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to delete user');
    }
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users,
        loading,
        error,
        fetchUsers,
        fetchUserById,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
