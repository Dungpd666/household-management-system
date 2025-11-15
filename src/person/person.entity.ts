import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Household } from '../household/household.entity';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn({name : 'id'})
  id: number;

  @Column({name : 'full_name'})
  fullName: string;

  @Column({name : 'date_of_birth'})
  dateOfBirth: Date;

  @Column({name : 'gender'})
  gender: string;

  @Column({name : 'identification_number', unique : true})
  identificationNumber: string; // CMND/CCCD

  @Column({ nullable: true, name: 'relationship_with_head' })
  relationshipWithHead: string;

  @Column({ nullable: true, name: 'occupation' })
  occupation: string;

  @Column({ nullable: true, name: 'education_level' })
  educationLevel: string;

  @Column({ nullable: true, name: 'migration_status' })
  migrationStatus: string; // "Thường trú", "Tạm trú", v.v.

  @Column({ nullable: true, name: 'is_deceased' })
  isDeceased: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;


  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Household, (household) => household.members)
  @JoinColumn({name : 'household_id'})
  household: Household;
}
