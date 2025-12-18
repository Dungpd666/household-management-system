import axiosClient from './axiosClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  userID: number;
  userRole: string;
  userName: string;
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
}

export const authApi = {
  login: (data: LoginRequest) => {
    return axiosClient.post<LoginResponse>('/auth/login', data);
  },

  // (Tùy chọn) Lấy thông tin user từ token - hiện chỉ dùng cho superadmin
  getInfo: () => {
    return axiosClient.get<AuthUser>('/auth/info');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
  },
};
