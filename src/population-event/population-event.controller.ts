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
  UseGuards,
} from '@nestjs/common';
import { PopulationEventService } from './population-event.service';
import { CreatePopulationEventDto } from './dto/create-population-event.dto';
import { UpdatePopulationEventDto } from './dto/update-population-event.dto';
import { PassportJwtGuard } from '../auth/guard/passport-jwt.guard';

@UseGuards(PassportJwtGuard)
@Controller('population-event')
export class PopulationEventController {
  constructor(
    private readonly populationEventService: PopulationEventService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() dto: CreatePopulationEventDto) {
    return this.populationEventService.create(dto);
  }

  @Get()
  findAll() {
    return this.populationEventService.findAll();
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

