import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PopulationEvent } from './population-event.entity';
import { CreatePopulationEventDto } from './dto/create-population-event.dto';
import { UpdatePopulationEventDto } from './dto/update-population-event.dto';
import { Person } from '../person/person.entity';

@Injectable()
export class PopulationEventService {
  private readonly logger = new Logger(PopulationEventService.name);

  constructor(
    @InjectRepository(PopulationEvent)
    private populationEventRepo: Repository<PopulationEvent>,
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) {}

  async create(dto: CreatePopulationEventDto) {
    const { personId, ...rest } = dto;
    // Check if personId exists
    const personExists = await this.personRepo.findOne({
      where: { id: personId },
    });
    if (!personExists) {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    const populationEvent = this.populationEventRepo.create({
      ...rest,
      person: { id: personId },
    });

    return this.populationEventRepo.save(populationEvent);
  }

  async findAll() {
    try {
      return await this.populationEventRepo.find({
        relations: ['person', 'handledBy'],
      });
    } catch (err) {
      this.logger.error('Error in PopulationEventService.findAll', err?.stack || err);
      throw err;
    }
  }

  async findOne(id: number) {
    const populationEvent = await this.populationEventRepo.findOne({
      where: { id },
      relations: ['person', 'handledBy'],
    });

    if (!populationEvent) {
      throw new NotFoundException(`Population Event with ID ${id} not found`);
    }

    return populationEvent;
  }

  async update(id: number, dto: UpdatePopulationEventDto) {
    const { personId, ...rest } = dto;

    const updatePayload: any = { ...rest };

    if (personId) {
      updatePayload.person = { id: personId };
    }

    await this.populationEventRepo.update(id, updatePayload);

    return this.findOne(id);
  }

  async remove(id: number) {
    const populationEvent = await this.findOne(id);
    await this.populationEventRepo.remove(populationEvent);
    return { deleted: true };
  }
}

