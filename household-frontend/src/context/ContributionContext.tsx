import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Contribution } from '../types/contribution';
import { contributionApi } from '../api/contributionApi';

interface ContributionContextType {
  contributions: Contribution[];
  loading: boolean;
  error: string | null;
  fetchContributions: () => Promise<void>;
  fetchContributionById: (id: string) => Promise<Contribution | null>;
  createContribution: (data: Omit<Contribution, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Contribution>;
  updateContribution: (id: string, data: Partial<Contribution>) => Promise<Contribution>;
  deleteContribution: (id: string) => Promise<void>;
}

export const ContributionContext = createContext<ContributionContextType | undefined>(undefined);

interface ContributionProviderProps {
  children: ReactNode;
}

export const ContributionProvider = ({ children }: ContributionProviderProps) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContributions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contributionApi.getAll();
      setContributions(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contributions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContributionById = useCallback(async (id: string) => {
    try {
      const response = await contributionApi.getById(id);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contribution');
      return null;
    }
  }, []);

  const createContribution = useCallback(async (data: Omit<Contribution, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await contributionApi.create(data);
      setContributions((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create contribution');
    }
  }, []);

  const updateContribution = useCallback(async (id: string, data: Partial<Contribution>) => {
    try {
      const response = await contributionApi.update(id, data);
      setContributions((prev) =>
        prev.map((contribution) => (contribution.id === id ? response.data : contribution))
      );
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update contribution');
    }
  }, []);

  const deleteContribution = useCallback(async (id: string) => {
    try {
      await contributionApi.delete(id);
      setContributions((prev) => prev.filter((contribution) => contribution.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete contribution');
    }
  }, []);

  return (
    <ContributionContext.Provider
      value={{
        contributions,
        loading,
        error,
        fetchContributions,
        fetchContributionById,
        createContribution,
        updateContribution,
        deleteContribution,
      }}
    >
      {children}
    </ContributionContext.Provider>
  );
};
