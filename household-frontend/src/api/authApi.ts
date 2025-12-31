import axiosClient from './axiosClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface HouseholdLoginRequest {
  householdCode: string;
  password: string;
}

export interface AuthUser {
  userID: number;
  userRole: string;
  userName: string;
  userType: 'admin' | 'household';
}

export interface HouseholdAuthUser {
  userID: number;
  householdCode: string;
  userType: 'household';
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
}

export interface HouseholdLoginResponse {
  accessToken: string;
  householdID: number;
  householdCode: string;
  address: string;
}

export const authApi = {
  login: (data: LoginRequest) => {
    return axiosClient.post<LoginResponse>('/auth/login', data);
  },

  householdLogin: (data: HouseholdLoginRequest) => {
    return axiosClient.post<HouseholdLoginResponse>('/auth/household/login', data);
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
