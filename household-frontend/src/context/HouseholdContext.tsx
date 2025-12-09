import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Household } from '../types/household';
import { householdApi } from '../api/householdApi';

interface HouseholdContextType {
  households: Household[];
  loading: boolean;
  error: string | null;
  fetchHouseholds: () => Promise<void>;
  fetchHouseholdById: (id: string) => Promise<Household | null>;
  createHousehold: (data: Omit<Household, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Household>;
  updateHousehold: (id: string, data: Partial<Household>) => Promise<Household>;
  deleteHousehold: (id: string) => Promise<void>;
}

export const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

interface HouseholdProviderProps {
  children: ReactNode;
}

export const HouseholdProvider = ({ children }: HouseholdProviderProps) => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHouseholds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await householdApi.getAll();
      setHouseholds(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch households');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHouseholdById = useCallback(async (id: string) => {
    try {
      const response = await householdApi.getById(id);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch household');
      return null;
    }
  }, []);

  const createHousehold = useCallback(async (data: Omit<Household, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await householdApi.create(data);
      setHouseholds((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create household');
    }
  }, []);

  const updateHousehold = useCallback(async (id: string, data: Partial<Household>) => {
    try {
      const response = await householdApi.update(id, data);
      const numericId = Number(id);
      setHouseholds((prev) =>
        prev.map((household) => (household.id === numericId ? response.data : household))
      );
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update household');
    }
  }, []);

  const deleteHousehold = useCallback(async (id: string) => {
    try {
      await householdApi.delete(id);
      const numericId = Number(id);
      setHouseholds((prev) => prev.filter((household) => household.id !== numericId));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete household');
    }
  }, []);

  return (
    <HouseholdContext.Provider
      value={{
        households,
        loading,
        error,
        fetchHouseholds,
        fetchHouseholdById,
        createHousehold,
        updateHousehold,
        deleteHousehold,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
};
