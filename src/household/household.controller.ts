import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { HouseholdService } from './household.service';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';

@Controller('household')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Post()
  create(@Body() data: CreateHouseholdDto) {
    return this.householdService.create(data);
  }

  @Get()
  findAll() {
    return this.householdService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.householdService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: UpdateHouseholdDto) {
    return this.householdService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.householdService.remove(id);
  }
}
