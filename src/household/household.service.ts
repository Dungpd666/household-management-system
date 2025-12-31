import { Injectable, NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Household } from './household.entity';
import { Person } from '../person/person.entity';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { SetHouseholdPasswordDto } from './dto/set-household-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HouseholdService {
  constructor(
    @InjectRepository(Household)
    private householdRepo: Repository<Household>,

    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) {}

  // Hàm tiện ích để sinh mật khẩu ngẫu nhiên
  private generateRandomPassword(length: number = 6): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  async create(data: CreateHouseholdDto) {
    // 1. Sinh mật khẩu ngẫu nhiên
    const rawPassword = this.generateRandomPassword(6);

    // 2. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 3. Tạo đối tượng household với mật khẩu đã hash
    const household = this.householdRepo.create({
      ...data,
      password: hashedPassword,
      isActive: true,
    });

    // 4. Lưu vào DB
    const savedHousehold = await this.householdRepo.save(household);

    // 5. Trả về kết quả kèm mật khẩu gốc để hiển thị cho Admin
    return {
      ...savedHousehold,
      generatedPassword: rawPassword, // Trường này quan trọng để Admin cấp cho chủ hộ
    };
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

    // Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(setPasswordDto.password, 10);
    household.password = hashedPassword;
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

    const isPasswordValid = await bcrypt.compare(password, household.password);
    if (!isPasswordValid) {
      return null;
    }

    return household;
  }

  async changeHouseholdPassword(
    householdId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const household = await this.householdRepo.findOne({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    if (!household.password) {
      throw new NotFoundException('Household has no password set');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      household.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('Current password is incorrect');
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    household.password = hashedPassword;

    await this.householdRepo.save(household);
  }
}
