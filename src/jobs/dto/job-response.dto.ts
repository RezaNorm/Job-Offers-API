import { ApiProperty } from '@nestjs/swagger';

export class JobResponseDto {
  @ApiProperty({ example: '150ca7ef-854e-46b6-a885-07149c34ea12' })
  id: string;

  @ApiProperty({ example: 'job-672' })
  externalId: string;

  @ApiProperty({ example: 'Data Scientist' })
  title: string;

  @ApiProperty({ example: 'Contract', nullable: true })
  type: string | null;

  @ApiProperty({ example: 'San Francisco' })
  city: string;

  @ApiProperty({ example: 'TX' })
  state: string;

  @ApiProperty({ example: false })
  remote: boolean;

  @ApiProperty({ example: 53000 })
  minSalary: number;

  @ApiProperty({ example: 102000 })
  maxSalary: number;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: '2025-02-01T00:00:00.000Z' })
  datePosted: string;

  @ApiProperty({ example: '872a2ca0-52ab-47c0-b6be-98d20aaa5a1c' })
  companyId: string;
}
