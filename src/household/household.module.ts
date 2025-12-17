import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from './household.entity';
import { Person } from '../person/person.entity';
import { HouseholdService } from './household.service';
import { HouseholdController } from './household.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Household, Person])],
  controllers: [HouseholdController],
  providers: [HouseholdService],
  exports: [HouseholdService],
})
export class HouseholdModule {}
