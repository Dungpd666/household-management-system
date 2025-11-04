import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsOptional } from 'class-validator';

export class PaginationDto {

    @IsNumber()
    @Type(() => Number)
    @IsPositive()
    @IsOptional()
    skip: number

    @IsNumber()
    @Type(() => Number)
    @IsPositive()
    @IsOptional()
    limit: number
}



