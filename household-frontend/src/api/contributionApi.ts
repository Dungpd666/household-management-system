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

  // Create contribution (backend expects householdIds: number[])
  create: (
    data:
      | { type: string; amount: number; dueDate?: string; householdId: number }
      | { type: string; amount: number; dueDate?: string; householdIds: number[] },
  ) => {
    const payload =
      'householdIds' in data
        ? { ...data, householdIds: data.householdIds }
        : { ...data, householdIds: [data.householdId] };

    // ensure we don't send householdId to backend DTO
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { householdId, ...rest } = payload as any;
    return axiosClient.post('/contribution', rest);
  },

  // Update contribution (backend uses PUT)
  update: (id: string, data: Partial<Contribution>) => {
    return axiosClient.put(`/contribution/${id}`, data);
  },

  // Mark as paid
  markPaid: (id: string, data: { paidAt?: string }) => {
    return axiosClient.put(`/contribution/${id}/pay`, data);
  },

  // Delete contribution
  delete: (id: string) => {
    return axiosClient.post(`/contribution/${id}/delete`);
  },

  // Create VNPay payment URL for single contribution
  createVnpayUrl: (id: number) => {
    return axiosClient.post(`/contribution/${id}/vnpay`);
  },

  // Create VNPay payment URL for multiple contributions
  createVnpayUrlMultiple: (contributionIds: number[]) => {
    return axiosClient.post('/contribution/vnpay-multiple', { contributionIds });
  },
};

export default contributionApi;
