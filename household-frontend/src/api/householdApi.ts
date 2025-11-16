import axiosClient from './axiosClient';
import type { Household } from '../types/household';

export const householdApi = {
  // Get all households
  getAll: (params?: Record<string, any>) => {
    return axiosClient.get('/household', { params });
  },

  // Get household by id
  getById: (id: string) => {
    return axiosClient.get(`/household/${id}`);
  },

  // Create household
  create: (data: Omit<Household, 'id' | 'createdAt' | 'updatedAt'>) => {
    return axiosClient.post('/household', data);
  },

  // Update household
  update: (id: string, data: Partial<Household>) => {
    return axiosClient.patch(`/household/${id}`, data);
  },

  // Delete household
  delete: (id: string) => {
    return axiosClient.delete(`/household/${id}`);
  },
};
