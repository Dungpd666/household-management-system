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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: string) => {
    try {
      const response = await usersApi.getById(id);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      return null;
    }
  }, []);

  const createUser = useCallback(async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await usersApi.create(data);
      setUsers((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create user');
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: Partial<User>) => {
    try {
      const response = await usersApi.update(id, data);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? response.data : user))
      );
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update user');
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await usersApi.delete(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete user');
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
