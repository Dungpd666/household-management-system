import {
  IsString,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsNumberString,
  IsEmail,
  Length,
} from 'class-validator';

export class CreatePersonDto {
  @IsString()
  fullName: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsString()
  gender: string;

  @IsNumberString()
  @Length(9, 12)
  identificationNumber: string; // CMND/CCCD

  @IsOptional()
  @IsString()
  relationshipWithHead?: string;

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
  @IsEmail()
  email?: string;

  @IsOptional()
  householdId?: number; // Liên kết đến Household
}
