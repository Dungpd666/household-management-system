import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Person } from '../person/person.entity';
import { Contribution } from '../contribution/contribution.entity';

@Entity('households')
export class Household {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'household_code' })
  householdCode: string; // Mã hộ khẩu

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'ward' })
  ward: string; // Phường/xã

  @Column({ name: 'district' })
  district: string;

  @Column({ name: 'city' })
  city: string;

  @Column({ name: 'household_type' })
  householdType: string;

  @Column({ name: 'password', type: 'varchar', nullable: true })
  password?: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Person, (person) => person.household)
  members: Person[];

  @OneToMany(() => Contribution, (contribution) => contribution.household)
  contributions: Contribution[];
}
