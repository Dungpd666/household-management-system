import { PartialType } from '@nestjs/swagger';
import { CreateHouseholdDto } from './create-household.dto';

export class UpdateHouseholdDto extends PartialType(CreateHouseholdDto) {}
