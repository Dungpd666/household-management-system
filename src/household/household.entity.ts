import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Person } from '../person/person.entity';

@Entity('households')
export class Household {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column()
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

  @Column({ name: 'household_type' })
  householdType: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
  @OneToMany(() => Person, (person) => person.household)
  members: Person[];
}
