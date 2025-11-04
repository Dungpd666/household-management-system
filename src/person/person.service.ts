import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PaginationDto } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from './utils/constants';


@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) { }

  async create(dto: CreatePersonDto) {

    const { householdId, ...rest } = dto;

    const person = this.personRepo.create({
      ...rest,
      household: householdId ? { id: householdId } : undefined,
    });

    return this.personRepo.save(person);
  }

  async findAll(paginationDto: PaginationDto) {
    
    return this.personRepo.find({
      relations: ['household'],
      skip: paginationDto.skip  ,
      take:  paginationDto.limit ?? DEFAULT_PAGE_SIZE
    });
  }

  async findOne(id: number) {
    const person = await this.personRepo.findOne({
      where: { id },
      relations: ['household'],    // khi lấy thì lấy thêm cả household kh thì nos sẽ là undefined
    });

    if (!person) {
      throw new NotFoundException('Person with ID =  ' + id + ' not found ');
    }

    return person;
  }


  async update(id: number, dto: UpdatePersonDto) {
    const { householdId, ...rest } = dto;

    const updatePayload: any = { ...rest };

    if (householdId) {
      updatePayload.household = { id: householdId };
    }

    await this.personRepo.update(id, updatePayload);

    return this.findOne(id);

  }

  async remove(id: number) {
    const person = await this.findOne(id);
    await this.personRepo.remove(person);
    return { deleted: true };
  }

  async findOneByIdentificationNumber(identificationNumber: string) {


    const person = await this.personRepo.findOne({
      where: { identificationNumber: identificationNumber },
      relations: ['household'],
    });

    if (!person) {
      throw new NotFoundException(
        `Person with identification number ${identificationNumber} not found`,
      );
    }

    return person;
  }
}
