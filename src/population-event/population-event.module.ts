import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PopulationEventController } from './population-event.controller';
import { PopulationEventService } from './population-event.service';
import { PopulationEvent } from './population-event.entity';
import { Person } from '../person/person.entity';
import { Household } from '../household/household.entity';
import { User } from '../users/users.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PopulationEvent, Person, Household, User]),
  ],
  controllers: [PopulationEventController],
  providers: [PopulationEventService, UsersService],
})
export class PopulationEventModule {}
