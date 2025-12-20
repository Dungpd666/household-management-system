import axiosClient from './axiosClient';

export interface RoleAssignment {
  userId: number;
  role: 'superadmin' | 'admin' | 'user';
}

const ENDPOINT = '/users';

export const roleApi = {
  assignRole: async (userId: number, role: string) => {
    const response = await axiosClient.put(`${ENDPOINT}/${userId}`, { role });
    return response.data;
  },

  getUserRoles: async () => {
    const response = await axiosClient.get(ENDPOINT);
    return response.data;
  },
};
