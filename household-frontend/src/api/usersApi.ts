import axiosClient from './axiosClient';
import type { User } from '../types/users';

export const usersApi = {
  // Get all users
  getAll: (params?: Record<string, any>) => {
    return axiosClient.get('/users', { params });
  },

  // Get user by id
  getById: (id: string) => {
    return axiosClient.get(`/users/${id}`);
  },

  // Create user
  create: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    return axiosClient.post('/users', data);
  },

  // Update user
  update: (id: string, data: Partial<User>) => {
    return axiosClient.patch(`/users/${id}`, data);
  },

  // Delete user
  delete: (id: string) => {
    return axiosClient.delete(`/users/${id}`);
  },
};
