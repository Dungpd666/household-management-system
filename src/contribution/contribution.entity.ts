import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Household } from 'src/household/household.entity';

@Entity('contributions')
export class Contribution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type' })
  type: string; // e.g., “Phí vệ sinh”, “Hỗ trợ hộ nghèo”

  @Column({ name: 'amount' })
  amount: number; // In VND

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date | null;

  @Column({ name: 'paid', nullable: false })
  paid: boolean;

  @Column({ name: 'paid_at', type: 'date', nullable: true })
  paidAt: Date | null;

  @ManyToOne(() => Household, (h) => h.contributions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'household_id' })
  household: Household;

  @Column({ name: 'household_id' })
  householdId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
