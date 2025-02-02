import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { JobTransformerService } from './service/jobs-transformer.service';

// Mock Data for Transformation Tests
const api1Response: any = {
  jobs: [
    {
      jobId: 'P1-151',
      title: 'Backend Engineer',
      details: {
        location: 'Seattle, WA',
        type: 'Contract',
        salaryRange: '$72k - $148k',
      },
      company: {
        name: 'BackEnd Solutions',
        industry: 'Technology',
      },
      skills: ['Python', 'Machine Learning', 'SQL'],
      postedDate: '2025-01-23T06:52:18.662Z',
    },
  ],
};

const api2Response: any = {
  data: {
    jobsList: {
      'job-337': {
        position: 'Backend Engineer',
        location: { city: 'Seattle', state: 'CA', remote: true },
        compensation: { min: 65000, max: 110000, currency: 'USD' },
        employer: { companyName: 'Creative Design Ltd' },
        requirements: {
          experience: 1,
          technologies: ['JavaScript', 'Node.js', 'React'],
        },
        datePosted: '2025-01-22',
      },
    },
  },
};

const mockHttpService = {
  get: jest.fn((url: string) => {
    if (url.includes('provider1')) {
      return of({ data: api1Response });
    } else if (url.includes('provider2')) {
      return of({ data: api2Response });
    }
    return of({ data: {} });
  }),
};

const mockLogger = {
  error: jest.fn(),
};

const mockPrismaService = {
  company: {
    upsert: jest.fn(),
  },
  job: {
    upsert: jest.fn(),
  },
  jobRequirement: {
    upsert: jest.fn(),
  },
};

describe('jobTransformerService - Data Transformation', () => {
  let jobTransformerService: JobTransformerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobTransformerService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: Logger, useValue: mockLogger },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    jobTransformerService = module.get<JobTransformerService>(
      JobTransformerService,
    );
  });

  describe('JobTransformerService - transformApi1Data', () => {
    it('should upsert company, job, and job requirements for API1 data', async () => {
      // Mock Prisma upsert methods
      mockPrismaService.company.upsert.mockResolvedValue({
        id: 1,
        name: 'BackEnd Solutions',
      });
      mockPrismaService.job.upsert.mockResolvedValue({
        id: 1,
        externalId: 'P1-151',
      });
      mockPrismaService.jobRequirement.upsert.mockResolvedValue({
        id: 1,
        jobId: 1,
      });

      await jobTransformerService.transformApi1Data(api1Response);

      expect(mockPrismaService.company.upsert).toHaveBeenCalledWith({
        where: { name: 'BackEnd Solutions' },
        update: { industry: 'Technology' },
        create: {
          name: 'BackEnd Solutions',
          industry: 'Technology',
        },
      });

      expect(mockPrismaService.job.upsert).toHaveBeenCalledWith({
        where: { externalId: 'P1-151' },
        update: expect.any(Object),
        create: expect.any(Object),
      });

      expect(mockPrismaService.jobRequirement.upsert).toHaveBeenCalledWith({
        where: { jobId: 1 },
        update: { skills: ['Python', 'Machine Learning', 'SQL'] },
        create: {
          jobId: 1,
          skills: ['Python', 'Machine Learning', 'SQL'],
        },
      });
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      mockPrismaService.company.upsert.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        jobTransformerService.transformApi1Data(api1Response),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('jobTransformerService - transformApi2Data', () => {
    it('should upsert company, job, and job requirements for API2 data', async () => {
      // Mock Prisma upsert methods
      mockPrismaService.company.upsert.mockResolvedValue({
        id: 1,
        name: 'Creative Design Ltd',
      });
      mockPrismaService.job.upsert.mockResolvedValue({
        id: 1,
        externalId: 'job-337',
      });
      mockPrismaService.jobRequirement.upsert.mockResolvedValue({
        id: 1,
        jobId: 1,
      });

      await jobTransformerService.transformApi2Data(api2Response);

      expect(mockPrismaService.company.upsert).toHaveBeenCalledWith({
        where: { name: 'Creative Design Ltd' },
        update: {},
        create: {
          name: 'Creative Design Ltd',
        },
      });

      expect(mockPrismaService.job.upsert).toHaveBeenCalledWith({
        where: { externalId: 'job-337' },
        update: expect.any(Object),
        create: expect.any(Object),
      });

      expect(mockPrismaService.jobRequirement.upsert).toHaveBeenCalledWith({
        where: { jobId: 1 },
        update: { skills: ['JavaScript', 'Node.js', 'React'] },
        create: {
          jobId: 1,
          skills: ['JavaScript', 'Node.js', 'React'],
        },
      });
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      mockPrismaService.company.upsert.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        jobTransformerService.transformApi2Data(api2Response),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
