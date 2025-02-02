import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { HttpModule } from '@nestjs/axios';
import { JobApiService } from './service/jobs-api.service';
import { JobTransformerService } from './service/jobs-transformer.service';

@Module({
  imports: [HttpModule],
  controllers: [JobsController],
  providers: [JobsService, JobApiService, JobTransformerService],
})
export class JobsModule {}
