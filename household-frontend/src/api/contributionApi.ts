import axiosClient from './axiosClient';
import type { Contribution } from '../types/contribution';

export const contributionApi = {
  // Get all contributions
  getAll: (params?: Record<string, any>) => {
    return axiosClient.get('/contribution', { params });
  },

  // Get contribution by id
  getById: (id: string) => {
    return axiosClient.get(`/contribution/${id}`);
  },

  // Create contribution
  create: (data: Omit<Contribution, 'id' | 'createdAt' | 'updatedAt'>) => {
    return axiosClient.post('/contribution', data);
  },

  // Update contribution
  update: (id: string, data: Partial<Contribution>) => {
    return axiosClient.patch(`/contribution/${id}`, data);
  },

  // Delete contribution
  delete: (id: string) => {
    return axiosClient.delete(`/contribution/${id}`);
  },
};
