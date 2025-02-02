import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class JobFilterDto {
  @ApiPropertyOptional({
    description: 'page',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @ApiPropertyOptional({
    description: 'limit',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter by job title',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'city',
    example: 'Seattle',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'state',
    example: 'WA',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Minimum salary', example: 70000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minSalary?: number;

  @ApiPropertyOptional({ description: 'Minimum salary', example: 150000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxSalary?: number;

  @IsOptional()
  @Type(() => Boolean)
  remote?: boolean;
}
