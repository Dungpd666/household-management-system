import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class SetHouseholdPasswordDto {
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}