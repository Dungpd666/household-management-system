import { useContext } from 'react';
import { ContributionContext } from '../context/ContributionContext';

export const useContribution = () => {
  const context = useContext(ContributionContext);
  if (!context) {
    throw new Error('useContribution must be used within ContributionProvider');
  }
  return context;
};
