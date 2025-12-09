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

  // Create contribution (expects: { type, amount, dueDate?, householdIds: number[] })
  create: (data: { type: string; amount: number; dueDate?: string; householdIds: number[] }) => {
    return axiosClient.post('/contribution', data);
  },

  // Update contribution (backend uses PUT)
  update: (id: string, data: Partial<Contribution>) => {
    return axiosClient.put(`/contribution/${id}`, data);
  },

  // Mark as paid
  markPaid: (id: string, data: { paidAt?: string }) => {
    return axiosClient.put(`/contribution/${id}/pay`, data);
  },

  // Delete contribution (not supported by backend currently)
  delete: (_id: string) => {
    throw new Error('Delete contribution is not supported');
  },
};
