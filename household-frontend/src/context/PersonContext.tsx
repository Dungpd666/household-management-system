import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Person } from '../types/person';
import { personApi } from '../api/personApi';

interface PersonContextType {
  persons: Person[];
  loading: boolean;
  error: string | null;
  fetchPersons: () => Promise<void>;
  fetchPersonById: (id: string) => Promise<Person | null>;
  createPerson: (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Person>;
  updatePerson: (id: string, data: Partial<Person>) => Promise<Person>;
  deletePerson: (id: string) => Promise<void>;
}

export const PersonContext = createContext<PersonContextType | undefined>(undefined);

interface PersonProviderProps {
  children: ReactNode;
}

export const PersonProvider = ({ children }: PersonProviderProps) => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPersons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await personApi.getAll();
      setPersons(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch persons');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPersonById = useCallback(async (id: string) => {
    try {
      const response = await personApi.getById(id);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch person');
      return null;
    }
  }, []);

  const createPerson = useCallback(async (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await personApi.create(data);
      setPersons((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create person');
    }
  }, []);

  const updatePerson = useCallback(async (id: string, data: Partial<Person>) => {
    try {
      const response = await personApi.update(id, data);
      setPersons((prev) =>
        prev.map((person) => (person.id === id ? response.data : person))
      );
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update person');
    }
  }, []);

  const deletePerson = useCallback(async (id: string) => {
    try {
      await personApi.delete(id);
      setPersons((prev) => prev.filter((person) => person.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete person');
    }
  }, []);

  return (
    <PersonContext.Provider
      value={{
        persons,
        loading,
        error,
        fetchPersons,
        fetchPersonById,
        createPerson,
        updatePerson,
        deletePerson,
      }}
    >
      {children}
    </PersonContext.Provider>
  );
};
