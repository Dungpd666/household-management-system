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

    // 2. Tạo đối tượng household với mật khẩu đã sinh
    const household = this.householdRepo.create({
      ...data,
      password: rawPassword, // Lưu mật khẩu (nên hash nếu muốn bảo mật cao hơn)
      isActive: true, // Mặc định kích hoạt luôn
    });

    // 3. Lưu vào DB
    const savedHousehold = await this.householdRepo.save(household);

    // 4. Trả về kết quả kèm mật khẩu gốc để hiển thị cho Admin
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
