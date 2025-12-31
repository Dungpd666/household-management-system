import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';

export class CreateContributionDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsOptional()
  dueDate: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  householdIds: number[];
}
