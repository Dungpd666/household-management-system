import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'username', unique: true })
  userName: string;

  @Column({ name: 'password_hash' })
  passWordHash: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'phone', unique: true })
  phone: string;

  @Column({ name: 'role' })
  role: string; // "admin", "superadmin"

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
