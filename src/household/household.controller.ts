import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { Household } from './household.entity';

@Controller('household')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Post()
  create(@Body() data: Partial<Household>) {
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
  update(@Param('id') id: number, @Body() data: Partial<Household>) {
    return this.householdService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.householdService.remove(id);
  }
}
