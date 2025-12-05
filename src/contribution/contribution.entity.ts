import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Person } from '../person/person.entity';
import { Household } from '../household/household.entity';

@Entity()
export class Contribution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // e.g., “Phí vệ sinh”, “Hỗ trợ hộ nghèo”

  @Column('int')
  amount: number; // In VND

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Person, (person) => person.id)
  person: Person;

  @ManyToOne(() => Household, (h) => h.contributions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })
  household: Household;

}
