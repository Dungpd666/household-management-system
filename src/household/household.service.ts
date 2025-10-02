import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Household } from './household.entity';
import { Person } from '../person/person.entity';

@Injectable()
export class HouseholdService {
  constructor(
    @InjectRepository(Household)
    private householdRepo: Repository<Household>,

    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) {}
  async create(data: Partial<Household>) {
    const household = this.householdRepo.create(data);
    return this.householdRepo.save(household);
  }

  async findAll() {
    return this.householdRepo.find({ relations: ['members'] });
  }

  async findOne(id: number) {
    return this.householdRepo.findOne({
      where: { id },
      relations: ['members'],
    });
  }

  async update(id: number, data: Partial<Household>) {
    await this.householdRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.householdRepo.delete(id);
    return { deleted: true };
  }
}
