import axiosClient from './axiosClient';
import type { Household } from '../types/household';

export const householdApi = {
  // Get all households (admin only)
  getAll: (params?: Record<string, any>) => {
    return axiosClient.get('/household', { params });
  },

  // Get household by id (admin only)
  getById: (id: string) => {
    return axiosClient.get(`/household/${id}`);
  },

  // Create household (admin only)
  create: (data: Omit<Household, 'id' | 'createdAt' | 'updatedAt'>) => {
    return axiosClient.post('/household', data);
  },

  // Update household (admin only)
  update: (id: string, data: Partial<Household>) => {
    return axiosClient.put(`/household/${id}`, data);
  },

  // Delete household (admin only)
  delete: (id: string) => {
    return axiosClient.delete(`/household/${id}`);
  },

  // Get my household info (household user)
  getMyHousehold: () => {
    return axiosClient.get('/household/me');
  },

  // Get my household members (household user)
  getMyMembers: () => {
    return axiosClient.get('/household/me/members');
  },

  // Get my household contributions (household user)
  getMyContributions: () => {
    return axiosClient.get('/household/me/contributions');
  },

  // Change password (household user)
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return axiosClient.put('/household/me/change-password', data);
  },
};
