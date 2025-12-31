import { Injectable, NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Household } from './household.entity';
import { Person } from '../person/person.entity';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { SetHouseholdPasswordDto } from './dto/set-household-password.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HouseholdService {
  constructor(
    @InjectRepository(Household)
    private householdRepo: Repository<Household>,

    @InjectRepository(Person)
    private personRepo: Repository<Person>,

    private emailService: EmailService,
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
    // Tạo household mà không có password
    // Password sẽ được tạo khi thêm chủ hộ (person với relationshipWithHead = "Chủ hộ")
    const household = this.householdRepo.create({
      householdCode: data.householdCode,
      address: data.address,
      ward: data.ward,
      district: data.district,
      city: data.city,
      householdType: data.householdType,
      password: null, // Chưa có password
      isActive: false, // Chưa active vì chưa có chủ hộ
    });

    const savedHousehold = await this.householdRepo.save(household);

    return savedHousehold;
  }

  // Hàm mới: Generate password và gửi email cho chủ hộ
  async generatePasswordAndNotify(
    householdId: number,
    ownerEmail: string,
  ): Promise<string> {
    const household = await this.householdRepo.findOne({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    // 1. Sinh mật khẩu ngẫu nhiên
    const rawPassword = this.generateRandomPassword(6);

    // 2. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 3. Cập nhật household
    household.password = hashedPassword;
    household.isActive = true;
    await this.householdRepo.save(household);

    // 4. Gửi email
    try {
      await this.emailService.sendHouseholdCredentials(
        ownerEmail,
        household.householdCode,
        rawPassword,
      );
    } catch (error) {
      console.error('Failed to send email:', error);
      // Không throw error để không block
    }

    return rawPassword;
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
