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
    // Normalize payload: convert date to ISO if string (date input), strip household wrapper
    const payload: any = { ...data };
    if (payload.dateOfBirth instanceof Date) {
      payload.dateOfBirth = payload.dateOfBirth.toISOString();
    }
    if (typeof payload.dateOfBirth === 'string' && /\d{4}-\d{2}-\d{2}$/.test(payload.dateOfBirth)) {
      // date-only from input -> ensure ISO
      payload.dateOfBirth = new Date(payload.dateOfBirth).toISOString();
    }
    if (payload.household && payload.household.id) {
      payload.householdId = payload.household.id;
      delete payload.household;
    }
    if (payload.householdId === '' || payload.householdId === null) {
      delete payload.householdId; // optional
    }
    try {
      const response = await personApi.create(payload);
      setPersons((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      // err may be normalized axios error object
      if (err && err.message) {
        throw new Error(err.message);
      }
      throw new Error('Failed to create person');
    }
  }, []);

  const updatePerson = useCallback(async (id: string, data: Partial<Person>) => {
    const payload: any = { ...data };
    if (payload.dateOfBirth instanceof Date) {
      payload.dateOfBirth = payload.dateOfBirth.toISOString();
    }
    if (typeof payload.dateOfBirth === 'string' && /\d{4}-\d{2}-\d{2}$/.test(payload.dateOfBirth)) {
      payload.dateOfBirth = new Date(payload.dateOfBirth).toISOString();
    }
    if (payload.household && payload.household.id) {
      payload.householdId = payload.household.id;
      delete payload.household;
    }
    if (payload.householdId === '' || payload.householdId === null) {
      delete payload.householdId;
    }
    try {
      const response = await personApi.update(id, payload);
      const numericId = Number(id);
      setPersons((prev) => prev.map((person) => (person.id === numericId ? response.data : person)));
      return response.data;
    } catch (err: any) {
      if (err && err.message) {
        throw new Error(err.message);
      }
      throw new Error('Failed to update person');
    }
  }, []);

  const deletePerson = useCallback(async (id: string) => {
    try {
      await personApi.delete(id);
      const numericId = Number(id);
      setPersons((prev) => prev.filter((person) => person.id !== numericId));
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
