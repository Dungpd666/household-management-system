import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Household } from '../household/household.entity';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ name: 'gender' })
  gender: string;

  @Column({ name: 'identification_number', unique: true })
  identificationNumber: string; // CMND/CCCD

  @Column({ type: 'varchar', nullable: true, name: 'relationship_with_head' })
  relationshipWithHead: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'occupation' })
  occupation: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'education_level' })
  educationLevel: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'migration_status' })
  migrationStatus: string | null; // "Thường trú", "Tạm trú", v.v.

  @Column({ type: 'varchar', nullable: true, name: 'is_deceased' })
  isDeceased: boolean | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Household, (household) => household.members)
  @JoinColumn({ name: 'household_id' })
  household: Household;
}
