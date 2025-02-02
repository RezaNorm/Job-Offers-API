import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { JobApi1Response } from './interface/jobApi1Response.interface';
import { PrismaService } from '../prisma/prisma.service';
import { JobApi2Response } from './interface/jobApi2Response.interface';
import { Cron } from '@nestjs/schedule';
import { JobFilterDto } from './dto/job-filter.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JobApiService } from './service/jobs-api.service';
import { JobTransformerService } from './service/jobs-transformer.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jobApiService: JobApiService,
    private readonly jobTransformerService: JobTransformerService,
  ) {}

  async getJobOffers(filterDto: JobFilterDto) {
    const {
      title,
      city,
      state,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
    } = filterDto;

    try {
      if (minSalary && maxSalary && minSalary > maxSalary) {
        throw new BadRequestException(
          'minSalary cannot be greater than maxSalary',
        );
      }

      const whereCondition: any = {
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
        city: city ? { contains: city, mode: 'insensitive' } : undefined,
        state: state ? { contains: state, mode: 'insensitive' } : undefined,
        minSalary: minSalary ? { gte: minSalary } : undefined,
        maxSalary: maxSalary ? { lte: maxSalary } : undefined,
      };

      const jobs = await this.prisma.job.findMany({
        where: whereCondition,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { datePosted: 'desc' },
      });

      const total = await this.prisma.job.count({ where: whereCondition });

      // If no jobs found, return a 404 error
      if (!jobs.length) {
        throw new NotFoundException(
          'No job offers found matching your criteria',
        );
      }

      return { total, page, limit, jobs };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Prisma errors
        throw new InternalServerErrorException(
          'Database error: ' + error.message,
        );
      }
      throw new HttpException(`${error}`, error?.status);
    }
  }

  @Cron(process.env.CRON_EXPRESSION || '*/1 * * * *')
  async handleCron() {
    this.logger.log('Starting scheduled job data fetch...');

    await Promise.all([this.fetchAndProcessApi1(), this.fetchAndProcessApi2()]);

    this.logger.log('Scheduled job data fetch completed.');
  }

  private async fetchAndProcessApi1(): Promise<void> {
    const data = await this.jobApiService.fetchApi1Jobs();
    await this.jobTransformerService.transformApi1Data(data);
    this.logger.log('Successfully processed API1 job data.');
  }

  private async fetchAndProcessApi2(): Promise<void> {
    const data = await this.jobApiService.fetchApi2Jobs();
    await this.jobTransformerService.transformApi2Data(data);
    this.logger.log('Successfully processed API2 job data.');
  }
}
