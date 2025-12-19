import { Injectable, NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Household } from './household.entity';
import { Person } from '../person/person.entity';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { SetHouseholdPasswordDto } from './dto/set-household-password.dto';

@Injectable()
export class HouseholdService {
  constructor(
    @InjectRepository(Household)
    private householdRepo: Repository<Household>,

    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) {}
  async create(data: CreateHouseholdDto) {
    const household = this.householdRepo.create(data);
    return await this.householdRepo.save(household);
  }

  async findAll() {
    return this.householdRepo.find({ relations: ['members'] });
  }

  async findOne(id: number) {
    const household = await this.householdRepo.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!household) {
      throw new NotFoundException(`Household not found`);
    }
    return household;
  }

  async findByIds(ids: number[]) {
    const households = await this.householdRepo.find({
      where: { id: In(ids) },
      relations: ['members'],
    });
    if (households.length === 0) {
      throw new NotFoundException(`Households not found`);
    }
    return households;
  }

  async update(id: number, data: UpdateHouseholdDto) {
    await this.householdRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.householdRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Household not found`);
    }
    return { deleted: true, id };
  }

  async findByHouseholdCode(householdCode: string): Promise<Household | null> {
    return this.householdRepo.findOne({
      where: { householdCode },
    });
  }

  async setHouseholdPassword(
    householdId: number,
    setPasswordDto: SetHouseholdPasswordDto,
  ): Promise<void> {
    const household = await this.householdRepo.findOne({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    // Cập nhật mật khẩu (theo pattern hiện tại: không hash)
    household.password = setPasswordDto.password;
    household.isActive = true;

    await this.householdRepo.save(household);
  }

  async findOneWithRelations(id: number): Promise<Household> {
    const household = await this.householdRepo.findOne({
      where: { id },
      relations: ['members', 'contributions'],
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    return household;
  }

  async validateHouseholdCredentials(
    householdCode: string,
    password: string,
  ): Promise<Household | null> {
    const household = await this.findByHouseholdCode(householdCode);

    if (!household || !household.password) {
      return null;
    }

    if (!household.isActive) {
      return null;
    }

    if (household.password !== password) {
      return null;
    }

    return household;
  }
}
