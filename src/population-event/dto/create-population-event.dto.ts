import {
  IsNumber,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PopulationEventType {
  BIRTH = 'birth', // Khai sinh, bao gồm cả nhập khẩu
  DEATH = 'death', // Khai tử
  CHANGE_HOUSEHOLD = 'change_household', // Chuyển hộ khẩu
  ABSENCE = 'absence', // Tạm vắng
  RETURN = 'return', // Trở về
}

export class CreatePopulationEventDto {
  @IsEnum(PopulationEventType)
  @IsNotEmpty()
  type: PopulationEventType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  eventDate: string;

  @IsNumber()
  @IsNotEmpty()
  personId: number;

  // Các trường dành cho chuyển hộ khẩu
  @IsNumber()
  @IsOptional()
  targetHouseholdId: number;

  @IsString()
  @IsOptional()
  targetRelationshipWithHead: string;
}
