import axiosClient from './axiosClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authApi = {
  // Login
  login: (data: LoginRequest) => {
    return axiosClient.post('/auth/login', data);
  },

  // Register
  register: (data: LoginRequest & { name: string }) => {
    return axiosClient.post('/auth/register', data);
  },

  // Get current user
  getMe: () => {
    return axiosClient.get('/auth/me');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },
};
