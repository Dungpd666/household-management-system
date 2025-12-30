import { PartialType } from '@nestjs/swagger';
import { CreatePopulationEventDto } from './create-population-event.dto';

export class UpdatePopulationEventDto extends PartialType(
  CreatePopulationEventDto,
) {}

