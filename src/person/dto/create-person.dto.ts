import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  fullName: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsString()
  gender: string;

  @IsString()
  identificationNumber: string; // CMND/CCCD

  @IsOptional()
  @IsString()
  relationshipWithHouseholdHead?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  educationLevel?: string;

  @IsOptional()
  @IsString()
  migrationStatus?: string; // “Thường trú”, “Tạm trú”, v.v.

  @IsOptional()
  @IsBoolean()
  isDeceased?: boolean;

  @IsOptional()
  householdId?: number; // Liên kết đến Household
}
