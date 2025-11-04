import { IsOptional, IsDateString } from 'class-validator';

export class MarkPaidDto {
  @IsOptional()
  @IsDateString()
  paidAt?: string;
}
