import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) { }

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
    const person = await this.personRepo.findOne({
      where: { id },
      relations: ['household'],    // khi lấy thì lấy thêm cả household kh thì nos sẽ là undefined
    });

    if(!person) {
      throw new NotFoundException('Person with ID =  ' + id + ' not found ' );
    }

    return person ;
  }

  async update(id: number, dto: UpdatePersonDto) {
    const person = await this.findOne(id); 
    await this.personRepo.update(id, {
      ...dto,
      household: dto.householdId ? { id: dto.householdId } as any : undefined,
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const person = await this.findOne(id);  // trả ra lỗi nếu xóa kh đúng id 
    await this.personRepo.remove(person);
    return { deleted: true };
  }
}
