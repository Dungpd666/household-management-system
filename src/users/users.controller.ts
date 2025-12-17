import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PersonService } from '../person/person.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PassportJwtGuard } from '../auth/guard/passport-jwt.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@UseGuards(PassportJwtGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly personService: PersonService,
  ) {}

  @Roles(RoleEnum.superadmin)
  @Get()
  async findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Roles(RoleEnum.superadmin)
  @Post()
  async CreateUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto, dto.role);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @Get('population')
  async Statistic() {
    const age = await this.personService.ageGroup();
    const job = await this.personService.jobGroup();
    const gender = await this.personService.jobGroup();
    return {
      Age: age,
      Job: job,
      Gender: gender,
    };
  }

  @Roles(RoleEnum.superadmin)
  @Get(':id')
  async findUserById(@Param('id') id: number) {
    return this.usersService.findUserById(id);
  }

  @Roles(RoleEnum.superadmin)
  @Put(':id')
  async UpdateUser(@Body() dto: CreateUserDto, @Param('id') id: number) {
    return this.usersService.updateUser(id, dto);
  }

  @Roles(RoleEnum.superadmin)
  @Delete(':id')
  async RemoveUser(@Param('id') id: number) {
    return this.usersService.removeUser(id);
  }
}
