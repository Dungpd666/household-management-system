import { useContext } from 'react';
import { PopulationEventContext } from '../context/PopulationEventContext';

export const usePopulationEvent = () => {
  const context = useContext(PopulationEventContext);
  if (!context) {
    throw new Error('usePopulationEvent must be used within PopulationEventProvider');
  }
  return context;
};
