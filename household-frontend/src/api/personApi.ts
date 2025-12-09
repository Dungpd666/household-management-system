import axiosClient from './axiosClient';
import type { Person } from '../types/person';

export const personApi = {
  // Get all persons
  getAll: (params?: Record<string, any>) => {
    return axiosClient.get('/person', { params });
  },

  // Get person by id
  getById: (id: string) => {
    return axiosClient.get(`/person/${id}`);
  },

  // Create person
  create: (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    return axiosClient.post('/person', data);
  },

  // Update person (backend expects PUT)
  update: (id: string, data: Partial<Person>) => {
    return axiosClient.put(`/person/${id}`, data);
  },

  // Delete person
  delete: (id: string) => {
    return axiosClient.delete(`/person/${id}`);
  },
};
