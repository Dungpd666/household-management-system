import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HouseholdService } from './household.service';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { SetHouseholdPasswordDto } from './dto/set-household-password.dto';
import { ChangeHouseholdPasswordDto } from './dto/change-household-password.dto';
import { HouseholdAuthGuard } from '../auth/guard/household-auth.guard';

@Controller('household')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() data: CreateHouseholdDto) {
    return this.householdService.create(data);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.householdService.findAll();
  }

  @UseGuards(AuthGuard, HouseholdAuthGuard)
  @Get('me')
  getMyHousehold(@Request() req) {
    return this.householdService.findOneWithRelations(req.user.userID);
  }

  @UseGuards(AuthGuard, HouseholdAuthGuard)
  @Get('me/members')
  async getMyMembers(@Request() req) {
    const household = await this.householdService.findOneWithRelations(
      req.user.userID,
    );
    return household.members;
  }

  @UseGuards(AuthGuard, HouseholdAuthGuard)
  @Get('me/contributions')
  async getMyContributions(@Request() req) {
    const household = await this.householdService.findOneWithRelations(
      req.user.userID,
    );
    return household.contributions;
  }

  @UseGuards(AuthGuard, HouseholdAuthGuard)
  @Put('me/change-password')
  async changeMyPassword(
    @Request() req,
    @Body() changePasswordDto: ChangeHouseholdPasswordDto,
  ) {
    await this.householdService.changeHouseholdPassword(
      req.user.userID,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return { message: 'Password changed successfully' };
  }

  // Parameterized routes come AFTER specific routes
  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.householdService.findOne(id);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() data: UpdateHouseholdDto) {
    return this.householdService.update(id, data);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.householdService.remove(id);
  }

  // @Roles(RoleEnum.admin, RoleEnum.superadmin)
  // @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/set-password')
  setHouseholdPassword(
    @Param('id') id: string,
    @Body() setPasswordDto: SetHouseholdPasswordDto,
  ) {
    return this.householdService.setHouseholdPassword(+id, setPasswordDto);
  }
}
