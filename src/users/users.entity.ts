import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  full_name: string;

  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'password_hash' })
  password_hash: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'phone', unique: true })
  phone: string;
  
  @Column({ name: 'role' })
  role: string; // "admin", "superadmin"

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
