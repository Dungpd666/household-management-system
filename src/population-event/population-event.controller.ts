import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { PopulationEventService } from './population-event.service';
import { CreatePopulationEventDto } from './dto/create-population-event.dto';
import { UpdatePopulationEventDto } from './dto/update-population-event.dto';

@Controller('population-event')
export class PopulationEventController {
  constructor(
    private readonly populationEventService: PopulationEventService,
  ) {}

  private readonly logger = new Logger(PopulationEventController.name);

  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() dto: CreatePopulationEventDto) {
    return this.populationEventService.create(dto);
  }

  @Get()
  async findAll() {
    this.logger.log('findAll endpoint called');
    try {
      return await this.populationEventService.findAll();
    } catch (err) {
      this.logger.error('Failed to fetch population events', err?.stack || err);
      throw err;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.populationEventService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdatePopulationEventDto) {
    return this.populationEventService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.populationEventService.remove(id);
  }
}

