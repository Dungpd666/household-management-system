import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { PopulationEventService } from './population-event.service';
import { CreatePopulationEventDto } from './dto/create-population-event.dto';
import { UpdatePopulationEventDto } from './dto/update-population-event.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/roles/roles.guard';
import { PassportJwtGuard } from 'src/auth/guard/passport-jwt.guard';
import { User } from 'src/users/users.entity';

@Roles(RoleEnum.admin, RoleEnum.superadmin)
@UseGuards(PassportJwtGuard, RolesGuard)
@Controller('population-event')
export class PopulationEventController {
  constructor(
    private readonly populationEventService: PopulationEventService,
  ) {}

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @Post()
  create(@Body() dto: CreatePopulationEventDto, @Request() req) {
    const reqUser: User = req.user;
    return this.populationEventService.create(dto, reqUser);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @Get()
  findAll() {
    return this.populationEventService.findAll();
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.populationEventService.findOne(id);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdatePopulationEventDto) {
    return this.populationEventService.update(id, dto);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.populationEventService.remove(id);
  }
}
