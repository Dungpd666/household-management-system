import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Ip,
  Req,
} from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { RoleEnum } from 'src/roles/roles.enum';
import type { Request } from 'express';

@Controller('contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  // Tạm thời chưa có xác thực và phân quyền
  // Tạo khoản đóng góp: admin/superadmin
  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateContributionDto) {
    return this.contributionService.create(dto);
  }

  // Gọi cổng thanh toán VNPAY: admin/superadmin/user
  @Roles(RoleEnum.admin, RoleEnum.superadmin, RoleEnum.household)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/vnpay')
  createVnpayUrl(@Param('id', ParseIntPipe) id: number, @Ip() reqIp: string) {
    const clientIp = reqIp.includes('::ffff:')
      ? reqIp.split('::ffff:')[1]
      : reqIp;
    return this.contributionService.createVnpayUrl(id, String(clientIp));
  }

  // Lấy danh sách đóng góp với bộ lọc: admin/superadmin/user(riêng với user lọc chỉ lấy đóng góp của user)
  @Roles(RoleEnum.admin, RoleEnum.superadmin, RoleEnum.household)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async findAll(@Query('householdId') householdId?: string, @Req() req?: any) {
    const user = req?.user;
    // Nếu là user bình thường, chỉ được xem đóng góp của hộ gia đình mình
    if (user && user.userRole === RoleEnum.household) {
      const hid = Number(user.userID);
      return this.contributionService.findAll(hid);
    }
    // Ngược lại với admin/superadmin có thể lọc theo householdId hoặc không
    const hid = householdId ? Number(householdId) : undefined;
    return this.contributionService.findAll(hid);
  }

  // Xử lý trả về từ VNPAY
  @Get('vnpay-return')
  async handleVnpayReturn(@Query() query: Record<string, any>) {
    return this.contributionService.handleVnpayReturn(query);
  }

  // Xử lý IPN từ VNPAY (không cần authentication vì được gọi từ VNPAY server)
  @Get('vnpay-ipn')
  async handleVnpayIpn(@Query() query: Record<string, any>) {
    return this.contributionService.handleVnpayIpn(query);
  }

  // Lấy dữ liệu thống kê: admin/superadmin
  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('stats')
  getStatistics() {
    return this.contributionService.getStatistics();
  }

  // Tìm đóng góp theo id: admin/superadmin
  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.contributionService.findById(id);
  }

  // Cập nhật đóng góp: admin/superadmin
  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContributionDto,
  ) {
    return this.contributionService.update(id, dto);
  }

  // Xóa đóng góp: admin/superadmin
  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contributionService.remove(id);
  }

  // Cập nhật là đã thanh toán: admin/superadmin
  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id/pay')
  markPaid(@Param('id', ParseIntPipe) id: number, @Body() dto: MarkPaidDto) {
    return this.contributionService.markPaid(id, dto);
  }
}
