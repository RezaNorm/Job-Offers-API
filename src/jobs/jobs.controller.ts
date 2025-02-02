import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobFilterDto } from './dto/job-filter.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JobResponseDto } from './dto/job-response.dto';

@Controller('job-offers')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Get job offers', description: 'Retrieve job offers with optional filters' })
  @ApiResponse({ status: 200, description: 'List of job offers', type: JobResponseDto })
  async getJobOffers(@Query() filterDto: JobFilterDto) {
    return this.jobsService.getJobOffers(filterDto);
  }
}
