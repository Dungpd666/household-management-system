import { useContext } from 'react';
import { PersonContext } from '../context/PersonContext';

export const usePerson = () => {
  const context = useContext(PersonContext);
  if (!context) {
    throw new Error('usePerson must be used within PersonProvider');
  }
  return context;
};
