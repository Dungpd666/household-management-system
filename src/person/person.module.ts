import { Module, forwardRef } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from '../household/household.entity';
import { Person } from './person.entity';
import { HouseholdModule } from '../household/household.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Household, Person]),
    forwardRef(() => HouseholdModule),
  ],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}