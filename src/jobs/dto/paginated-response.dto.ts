import { ApiProperty } from '@nestjs/swagger';
import { JobResponseDto } from './job-response.dto';

export class PaginatedJobResponseDto {
  @ApiProperty({ example: 9, description: 'Total number of job offers available' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ type: [JobResponseDto], description: 'List of job offers' })
  jobs: JobResponseDto[];
}
