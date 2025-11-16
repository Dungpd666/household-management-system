export interface User {
  id?: number;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  password_hash?: string;
  role: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
