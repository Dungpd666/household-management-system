import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Person } from '../person/person.entity';
import { User } from 'src/users/users.entity';
import { PopulationEventType } from './dto/create-population-event.dto';

@Entity('population_events')
export class PopulationEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: PopulationEventType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'event_date', type: 'date', default: () => 'CURRENT_DATE' })
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
