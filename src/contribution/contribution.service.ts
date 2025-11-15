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
    const householdIds: number[] = createDto.householdIds || [];
    if (householdIds.length === 0) {
      throw new ForbiddenException('Must provide householdIds');
    }

    // Kiểm tra có household nào không tồn tại
    const households = await this.householdService.findByIds(householdIds);
    if (households.length !== householdIds.length) {
      throw new NotFoundException('One or more households not found');
    }
    const created: Contribution[] = [];
    for (const h of households) {
      const c = this.repo.create({
        type: createDto.type,
        amount: createDto.amount,
        dueDate: createDto.dueDate ? new Date(createDto.dueDate) : null,
        paid: false,
        householdId: h.id,
      });
      created.push(await this.repo.save(c));
      // Gửi thông báo, ghi vào log
    }
    return created;
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
}
