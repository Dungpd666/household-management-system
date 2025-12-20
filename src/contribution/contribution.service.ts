import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { Contribution } from './contribution.entity';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';
import { HouseholdService } from 'src/household/household.service';

@Injectable()
export class ContributionService {
  private readonly logger = new Logger(ContributionService.name);

  constructor(
    @InjectRepository(Contribution)
    private readonly repo: Repository<Contribution>,
    private readonly householdService: HouseholdService,
  ) {}

  async create(createDto: CreateContributionDto) {
    const householdId = createDto.householdId;
    if (!householdId) {
      throw new ForbiddenException('Must provide householdId');
    }

    // Đảm bảo hộ gia đình tồn tại
    const household = await this.householdService.findOne(householdId);

    const contribution = this.repo.create({
      type: createDto.type,
      amount: createDto.amount,
      dueDate: createDto.dueDate ? new Date(createDto.dueDate) : null,
      paid: false,
      householdId: household.id,
    });

    return this.repo.save(contribution);
  }

  // Lấy danh sách đóng góp với bộ lọc theo hộ gia đình
  async findAll(householdId: number | undefined) {
    const qb = this.repo.createQueryBuilder('c');
    if (householdId) {
      qb.andWhere('c.household_id = :householdId', { householdId });
    }
    const items = await qb.orderBy('c.due_date', 'ASC').getMany();
    return items;
  }

  // Lấy đóng góp theo ID
  async findById(id: number) {
    const c = await this.repo
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .getOne();
    if (!c) {
      throw new NotFoundException('Contribution not found');
    }
    return c;
  }

  // Cập nhật đóng góp
  async update(id: number, updateDto: UpdateContributionDto) {
    const c = await this.findById(id);
    if (!c) throw new NotFoundException('Contribution not found');
    Object.assign(c, updateDto);
    // Tự cập nhật ngày thanh toán
    c.paidAt = updateDto.paid
      ? updateDto.paidAt
        ? new Date(updateDto.paidAt)
        : new Date()
      : null;
    return await this.repo.save(c);
  }

  // Cập nhật là đã thanh toán
  async markPaid(id: number, dto: MarkPaidDto) {
    const c = await this.findById(id);
    if (!c) throw new NotFoundException('Contribution not found');

    c.paid = true;
    c.paidAt = dto.paidAt ? new Date(dto.paidAt) : new Date();
    const saved = await this.repo.save(c);
    // Gửi thông báo, ghi vào log
    return saved;
  }

  // Lấy thông tin để phân tích
  async getStatistics() {
    const total = await this.repo.count();
    const paid = await this.repo.count({ where: { paid: true } });
    const unpaid = await this.repo.count({ where: { paid: false } });
    const totalAmountRaw = await this.repo
      .createQueryBuilder('c')
      .select('SUM(c.amount)', 'sum')
      .getRawOne<{ sum: string | null }>();
    return {
      total,
      paid,
      unpaid,
      totalAmount: Number(totalAmountRaw?.sum ?? 0),
    };
  }

  // Xóa khoản đóng góp
  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Contribution not found');
    }
    return { deleted: true, id };
  }
}
