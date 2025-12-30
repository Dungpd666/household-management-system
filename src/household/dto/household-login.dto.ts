import { IsString, IsNotEmpty } from 'class-validator';

export class HouseholdLoginDto {
  @IsString()
  @IsNotEmpty()
  householdCode: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
