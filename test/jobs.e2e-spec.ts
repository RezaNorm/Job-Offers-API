import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JobFilterDto } from '../src/jobs/dto/job-filter.dto';

describe('JobOffersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Seed the database with test data
    await prisma.job.createMany({
      data: [
        {
          title: 'Software Engineer',
          city: 'San Francisco',
          state: 'CA',
          minSalary: 80000,
          maxSalary: 120000,
          datePosted: new Date('2025-01-01'),
        },
        {
          title: 'Data Scientist',
          city: 'New York',
          state: 'NY',
          minSalary: 90000,
          maxSalary: 130000,
          datePosted: new Date('2025-01-02'),
        },
        {
          title: 'Frontend Developer',
          city: 'Los Angeles',
          state: 'CA',
          minSalary: 70000,
          maxSalary: 110000,
          datePosted: new Date('2025-01-03'),
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.jobRequirement.deleteMany(); 
    await prisma.job.deleteMany();
    await app.close();
  });

  describe('GET /job-offers', () => {
    it('should return a list of job offers with default pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/job-offers')
        .expect(200);

      expect(response.body).toMatchObject({
        page: 1,
        limit: 10,
        total: expect.any(Number),
      });
    });

    it('should filter job offers by title', async () => {
      const response = await request(app.getHttpServer())
        .get('/job-offers')
        .query({ title: 'Software' })
        .expect(200);

      expect(response.body).toMatchObject({
        page: 1,
        limit: 10,
        total: expect.any(Number),
        jobs: [
          expect.objectContaining({
            title: 'Software Engineer',
          }),
        ],
      });
    });

    it('should filter job offers by city and state', async () => {
      const response = await request(app.getHttpServer())
        .get('/job-offers')
        .query({ city: 'San Francisco', state: 'CA' })
        .expect(200);

      expect(response.body).toMatchObject({
        page: 1,
        limit: 10,
        total: expect.any(Number),
        jobs: [
          expect.objectContaining({
            city: 'San Francisco',
            state: 'CA',
          }),
        ],
      });
    });

    it('should filter job offers by salary range', async () => {
      const response = await request(app.getHttpServer())
        .get('/job-offers')
        .query({ minSalary: 80000, maxSalary: 120000 })
        .expect(200);

      expect(response.body).toMatchObject({
        page: 1,
        limit: 10,
        total: expect.any(Number),
        jobs: expect.arrayContaining([
          expect.objectContaining({ minSalary: 80000, maxSalary: 120000 }),
        ]),
      });
    });

    it('should return a 400 error if minSalary is greater than maxSalary', async () => {
      const response = await request(app.getHttpServer())
        .get('/job-offers')
        .query({ minSalary: 100000, maxSalary: 80000 })
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message:
          'BadRequestException: minSalary cannot be greater than maxSalary',
      });
    });

    it('should return a 404 error if no jobs match the criteria', async () => {
      const response = await request(app.getHttpServer())
        .get('/job-offers')
        .query({ title: 'Non-existent Job' })
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message:
          'NotFoundException: No job offers found matching your criteria',
      });
    });
  });
});
