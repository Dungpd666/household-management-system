import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ChangeHouseholdPasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}
