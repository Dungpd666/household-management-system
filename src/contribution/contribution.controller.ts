import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';
import { PassportJwtGuard } from '../auth/guard/passport-jwt.guard';

@UseGuards(PassportJwtGuard)
@Controller('contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  // Tạm thời chưa có xác thực và phân quyền
  // Tạo khoản đóng góp: admin/superadmin
  @Post()
  create(@Body() dto: CreateContributionDto) {
    return this.contributionService.create(dto);
  }

  // Lấy danh sách đóng góp với bộ lọc: admin/superadmin/user(riêng với user lọc chỉ lấy đóng góp của user)
  @Get()
  async findAll(@Query('householdId') householdId?: string) {
    const hid = householdId ? Number(householdId) : undefined;
    return this.contributionService.findAll(hid);
  }

  // Lấy dữ liệu thống kê: admin/superadmin
  @Get('stats')
  getStatistics() {
    return this.contributionService.getStatistics();
  }

  // Tìm đóng góp theo id: admin/superadmin/user(???)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.contributionService.findById(id);
  }

  // Cập nhật đóng góp: admin/superadmin
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContributionDto,
  ) {
    return this.contributionService.update(id, dto);
  }

  // Xóa đóng góp: admin/superadmin
  @Post(':id/delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contributionService.remove(id);
  }

  // Cập nhật là đã thanh toán: admin/superadmin
  @Put(':id/pay')
  markPaid(@Param('id', ParseIntPipe) id: number, @Body() dto: MarkPaidDto) {
    return this.contributionService.markPaid(id, dto);
  }
}

