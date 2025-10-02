import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Household } from '../household/household.entity';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  gender: string;

  @Column()
  identificationNumber: string; // CMND/CCCD

  @Column({ nullable: true })
  relationshipWithHouseholdHead: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  educationLevel: string;

  @Column({ nullable: true })
  migrationStatus: string; // "Thường trú", "Tạm trú", v.v.

  @Column({ nullable: true })
  isDeceased: boolean;

  @ManyToOne(() => Household, (household) => household.members)
  household: Household;
}
