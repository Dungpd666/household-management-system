import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password_hash: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;
  
  @Column()
  role: string; // "admin", "superadmin"

  @Column({ default: true })
  is_active: boolean;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
  
}