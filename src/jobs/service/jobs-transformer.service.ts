import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JobApi1Response } from '../interface/jobApi1Response.interface';
import { JobApi2Response } from '../interface/jobApi2Response.interface';

@Injectable()
export class JobTransformerService {
  private readonly logger = new Logger(JobTransformerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async transformApi1Data(data: JobApi1Response): Promise<void> {
    try {
      for (const job of data.jobs) {
        const [city, state] = job.details.location
          .split(',')
          .map((s) => s.trim());
        const [minSalary, maxSalary] = job.details.salaryRange
          .replace(/\$|k/g, '')
          .split(' - ')
          .map((s) => parseInt(s) * 1000);

        const company = await this.prisma.company.upsert({
          where: { name: job.company.name },
          update: { industry: job.company.industry },
          create: { name: job.company.name, industry: job.company.industry },
        });

        const createdJob = await this.prisma.job.upsert({
          where: { externalId: job.jobId },
          update: {
            title: job.title,
            type: job.details.type,
            city,
            state,
            minSalary,
            maxSalary,
          },
          create: {
            externalId: job.jobId,
            title: job.title,
            type: job.details.type,
            city,
            state,
            minSalary,
            maxSalary,
            datePosted: new Date(job.postedDate),
            companyId: company.id,
          },
        });

        for (const skill of job.skills) {
          const requirement = await this.prisma.jobRequirement.upsert({
            where: { skill },
            update: {},
            create: { skill },
          });

          await this.prisma.jobRequirementOnJob.create({
            data: {
              requirementId: requirement.id,
              jobId: createdJob.id,
            },
          });
        }
      }
    } catch (error) {
      this.logger.error(`transformApi1Data failed: ${error}`);
      throw new InternalServerErrorException(`Data transformation failed`);
    }
  }

  async transformApi2Data(data: JobApi2Response): Promise<void> {
    try {
      for (const key in data.data.jobsList) {
        const job = data.data.jobsList[key];

        const company = await this.prisma.company.upsert({
          where: { name: job.employer.companyName },
          update: { website: job.employer.website },
          create: {
            name: job.employer.companyName,
            website: job.employer.website,
          },
        });

        const createdJob = await this.prisma.job.upsert({
          where: { externalId: key },
          update: {
            title: job.position,
            city: job.location.city,
            minSalary: job.compensation.min,
          },
          create: {
            externalId: key,
            title: job.position,
            city: job.location.city,
            state: job.location.state,
            minSalary: job.compensation.min,
            maxSalary: job.compensation.max,
            datePosted: new Date(job.datePosted),
            companyId: company.id,
          },
        });

        for (const skill of job.requirements.technologies) {
          const requirement = await this.prisma.jobRequirement.upsert({
            where: { skill },
            update: {},
            create: { skill },
          });

          await this.prisma.jobRequirementOnJob.create({
            data: {
              requirementId: requirement.id,
              jobId: createdJob.id,
            },
          });
        }
      }
    } catch (error) {
      this.logger.error(`transformApi2Data failed: ${error}`);
      throw new InternalServerErrorException(`Data transformation failed`);
    }
  }
}
