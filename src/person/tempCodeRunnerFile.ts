import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from '../household/household.entity';
import { Person } from './person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Household, Person])],
  controllers: [PersonController],
  providers: [PersonService],

})
export class PersonModule {}
