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


  async ageGroup(){
    const Population = await this.personRepo.find({
      select: ['dateOfBirth'],
      relations: ['household'],
    });
    const groups = {
      '0-17': 0,
      '18-35': 0,
      '36-60': 0,
      '60+': 0,
    };
    Population.forEach(element => {
      const today = new Date();
      const age = today.getFullYear() - element.dateOfBirth.getFullYear();
      if (age < 18) groups['0-17']++;
      else if (age <= 35) groups['18-35']++;
      else if (age <= 60) groups['36-60']++;
      else groups['60+']++;
    });
    return groups;
  }

  async jobGroup(){
    const Jobs = await this.personRepo.find({
      select: ['occupation'],
      relations: ['household'],
    });
    const group = {};
    Jobs.forEach(job => {
      const job_name : string = job.occupation;
      if (group[job_name] ==  null) { group[job_name] = 1; }
      else {
        group[job_name] += 1;
      }
    })
    return group;
  }

  async genderGroup(){
    const Gender =  await this.personRepo.find({
      select : ['gender'],
      relations : ['household']
    })
    const group = {
      'male' : 0,
      'female' : 0
    }
    Gender.forEach(sex => {
      if (sex.gender ===  "male"){
        group["male"] += 1;
      }
      else {
        group["female"] += 1;
      }
    })
    return group;
  }
}
