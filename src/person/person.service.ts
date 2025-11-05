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
  async findByID(IDNum: string) {
    const person = await this.personRepo
        .createQueryBuilder('person')
        .where('person.identification_number = :IDNum', { IDNum })
        .getOne();
    if (!person) {
        throw new NotFoundException(`No person found with ID number`);
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

