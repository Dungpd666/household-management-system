import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';
import { PassportJwtGuard } from '../auth/guard/passport-jwt.guard';
import { Logger } from '@nestjs/common';

@UseGuards(PassportJwtGuard)
@Controller('contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}
  private readonly logger = new Logger(ContributionController.name);

  // Tạm thời chưa có xác thực và phân quyền
  // Tạo khoản đóng góp: admin/superadmin
  @Post()
  create(@Body() dto: CreateContributionDto) {
    return this.contributionService.create(dto);
  }

  // Lấy danh sách đóng góp với bộ lọc: admin/superadmin/user(riêng với user lọc chỉ lấy đóng góp của user)
  @Get()
  async getAll(
    @Query('householdId') householdId?: string,
    // Backward compatibility: older clients used `page` and backend treated it like a number.
    // The service actually expects `householdId` filter (optional).
    @Query('page') page?: string,
  ) {
    try {
      const parseOptionalInt = (v?: string) => {
        if (v == null || v === '') return undefined;
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
      };

      const householdIdNumber = parseOptionalInt(householdId) ?? parseOptionalInt(page);
      return await this.contributionService.findAll(householdIdNumber);
    } catch (err) {
      this.logger.error('Failed to fetch contributions', err as any);
      throw err;
    }
  }

  // Lấy dữ liệu thống kê: admin/superadmin
  @Get('stats')
  getStatistics() {
    return this.contributionService.getStatistics();
  }

  // Tìm đóng góp theo id: admin/superadmin/user(???)
  @Get(':id')
  findById(@Param('id') id: string) {
    const numericId = Number(id);
    return this.contributionService.findById(numericId);
  }

  // Cập nhật đóng góp: admin/superadmin
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContributionDto,
  ) {
    return this.contributionService.update(Number(id), dto);
  }

  // Xóa đóng góp: admin/superadmin
  @Post(':id/delete')
  remove(@Param('id') id: string) {
    return this.contributionService.remove(Number(id));
  }

  // Cập nhật là đã thanh toán: admin/superadmin
  @Put(':id/pay')
  markPaid(@Param('id') id: string, @Body() dto: MarkPaidDto) {
    return this.contributionService.markPaid(Number(id), dto);
  }
}

