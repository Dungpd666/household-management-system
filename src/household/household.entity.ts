import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Person } from '../person/person.entity';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Person, (person) => person.household)
  members: Person[];
}
