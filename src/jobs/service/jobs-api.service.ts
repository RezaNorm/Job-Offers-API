import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';
import { JobApi1Response } from '../interface/jobApi1Response.interface';
import { JobApi2Response } from '../interface/jobApi2Response.interface';

@Injectable()
export class JobApiService {
  private readonly logger = new Logger(JobApiService.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchApi1Jobs(): Promise<JobApi1Response> {
    return this.fetchData<JobApi1Response>('https://assignment.devotel.io/api/provider1/jobs');
  }

  async fetchApi2Jobs(): Promise<JobApi2Response> {
    return this.fetchData<JobApi2Response>('https://assignment.devotel.io/api/provider2/jobs');
  }

  private async fetchData<T>(url: string): Promise<T> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<T>(url).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`Error fetching data from ${url}`, error.response?.data);
            throw new InternalServerErrorException(`Failed to fetch data from ${url}`);
          }),
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error in fetchData for ${url}`, error);
      throw new InternalServerErrorException(`API unavailable: ${url}`);
    }
  }
}
