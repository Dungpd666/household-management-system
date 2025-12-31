import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Contribution } from '../types/contribution';
import contributionApi from '../api/contributionApi';

interface ContributionContextType {
  contributions: Contribution[];
  loading: boolean;
  error: string | null;
  fetchContributions: () => Promise<void>;
  fetchContributionById: (id: string) => Promise<Contribution | null>;
  createContribution: (data:
    | { type: string; amount: number; dueDate?: string; householdId: number }
    | { type: string; amount: number; dueDate?: string; householdIds: number[] }
  ) => Promise<void>;
  updateContribution: (id: string, data: Partial<Contribution>) => Promise<Contribution>;
  markPaid: (id: string, data?: { paidAt?: string }) => Promise<Contribution>;
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
    } catch (err: any) {
      const message = err?.message || 'Failed to fetch contributions';
      if (err?.status === 404) {
        setContributions([]);
        setError(null);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContributionById = useCallback(async (id: string) => {
    try {
      const response = await contributionApi.getById(id);
      return response.data;
    } catch (err: any) {
      const message = err?.message || 'Failed to fetch contribution';
      setError(message);
      return null;
    }
  }, []);

  const createContribution = useCallback(async (
    data:
      | { type: string; amount: number; dueDate?: string; householdId: number }
      | { type: string; amount: number; dueDate?: string; householdIds: number[] },
  ) => {
    try {
      // Bulk create for "All" selection in UI
      if ('householdIds' in data) {
        const ids = (data.householdIds ?? []).filter((id) => Number.isFinite(id) && id > 0);
        if (ids.length === 0) throw new Error('Thiếu householdId');

        const created = await Promise.all(
          ids.map((householdId) =>
            contributionApi.create({
              type: data.type,
              amount: data.amount,
              dueDate: data.dueDate,
              householdId,
            }),
          ),
        );

        setContributions((prev) => [...prev, ...created.map((r) => r.data)]);
        return;
      }

      const response = await contributionApi.create(data);
      setContributions((prev) => [...prev, response.data]);
    } catch (err: any) {
      const message = err?.message || 'Failed to create contribution';
      throw new Error(message);
    }
  }, []);

  const updateContribution = useCallback(async (id: string, data: Partial<Contribution>) => {
    try {
      const response = await contributionApi.update(id, data);
      const numericId = Number(id);
      setContributions((prev) => prev.map((c) => (c.id === numericId ? response.data : c)));
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update contribution');
    }
  }, []);

  const markPaid = useCallback(async (id: string, data?: { paidAt?: string }) => {
    try {
      const response = await contributionApi.markPaid(id, data || {});
      const numericId = Number(id);
      setContributions((prev) => prev.map((c) => (c.id === numericId ? response.data : c)));
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to mark contribution paid');
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
        markPaid,
      }}
    >
      {children}
    </ContributionContext.Provider>
  );
};
