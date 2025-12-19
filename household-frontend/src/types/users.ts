export interface User {
  id?: number;
  fullName: string;
  userName: string;
  email: string;
  phone: string;
  passWordHash?: string;
  role: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
