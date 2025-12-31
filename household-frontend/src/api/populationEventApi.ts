import axiosClient from './axiosClient';

export interface PopulationEvent {
  id?: number;
  type: string;
  description?: string;
  eventDate: string;
  personId: number;
  person?: {
    id: number;
    fullName: string;
  };
}

const ENDPOINT = '/population-event';

export const populationEventApi = {
  getAll: async () => {
    const response = await axiosClient.get(ENDPOINT);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosClient.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (data: Omit<PopulationEvent, 'id'>) => {
    const response = await axiosClient.post(ENDPOINT, data);
    return response.data;
  },

  update: async (id: number, data: Partial<PopulationEvent>) => {
    const response = await axiosClient.put(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosClient.delete(`${ENDPOINT}/${id}`);
    return response.data;
  },
};
