import { IsString } from 'class-validator';

export class CreateHouseholdDto {
  @IsString()
  householdCode: string;

  @IsString()
  address: string;

  @IsString()
  ward: string;

  @IsString()
  district: string;

  @IsString()
  city: string;

  @IsString()
  householdType: string;
}
