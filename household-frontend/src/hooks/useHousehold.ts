import { useContext } from 'react';
import { HouseholdContext } from '../context/HouseholdContext';

export const useHousehold = () => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHousehold must be used within HouseholdProvider');
  }
  return context;
};
