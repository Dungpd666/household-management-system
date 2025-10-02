import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Person } from '../person/person.entity';

@Entity()
export class Household {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  householdCode: string; // Mã hộ khẩu

  @Column()
  address: string;

  @Column()
  ward: string; // Phường/xã

  @Column()
  district: string;

  @Column()
  city: string;

  @OneToMany(() => Person, (person) => person.household)
  members: Person[];
}
