import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PopulationEventController } from './population-event.controller';
import { PopulationEventService } from './population-event.service';
import { PopulationEvent } from './population-event.entity';
import { Person } from '../person/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PopulationEvent, Person])],
  controllers: [PopulationEventController],
  providers: [PopulationEventService],
})
export class PopulationEventModule {}

