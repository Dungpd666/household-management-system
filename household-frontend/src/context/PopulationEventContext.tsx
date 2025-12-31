import { createContext, ReactNode, useState, useCallback } from 'react';
import { PopulationEvent, populationEventApi } from '../api/populationEventApi';

interface PopulationEventContextType {
  events: PopulationEvent[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (event: Omit<PopulationEvent, 'id'>) => Promise<void>;
  updateEvent: (id: number, event: Partial<PopulationEvent>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
}

export const PopulationEventContext = createContext<PopulationEventContextType | undefined>(undefined);

export const PopulationEventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<PopulationEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await populationEventApi.getAll();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (event: Omit<PopulationEvent, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = await populationEventApi.create(event);
      setEvents([...events, newEvent]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [events]);

  const updateEvent = useCallback(async (id: number, event: Partial<PopulationEvent>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await populationEventApi.update(id, event);
      setEvents(events.map(e => e.id === id ? updated : e));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [events]);

  const deleteEvent = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await populationEventApi.delete(id);
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [events]);

  return (
    <PopulationEventContext.Provider value={{
      events,
      loading,
      error,
      fetchEvents,
      createEvent,
      updateEvent,
      deleteEvent,
    }}>
      {children}
    </PopulationEventContext.Provider>
  );
};
