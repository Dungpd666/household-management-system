import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) {}

  async create(dto: CreatePersonDto) {
    const person = this.personRepo.create({
      ...dto,
      household: dto.householdId ? { id: dto.householdId } as any : undefined,
    });
    return this.personRepo.save(person);
  }

  async findAll() {
    return this.personRepo.find({ relations: ['household'] });
  }

  async findOne(id: number) {
    return this.personRepo.findOne({
      where: { id },
      relations: ['household'],
    });
  }

  async update(id: number, dto: UpdatePersonDto) {
    await this.personRepo.update(id, {
      ...dto,
      household: dto.householdId ? { id: dto.householdId } as any : undefined,
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.personRepo.delete(id);
    return { deleted: true };
  }
}
