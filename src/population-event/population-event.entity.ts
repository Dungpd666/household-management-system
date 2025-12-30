import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Person } from '../person/person.entity';
import { User } from 'src/users/users.entity';

@Entity('population_events')
export class PopulationEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'event_date', type: 'date' })
  eventDate: string;

  @ManyToOne(() => Person, (person) => person.populationEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'handled_by' })
  handledBy: User;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
