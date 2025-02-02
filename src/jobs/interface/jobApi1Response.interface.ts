export interface JobApi1Response {
  metadata: JobMetadata;
  jobs: Job[];
}
interface JobMetadata {
  requestId: string;
  timestamp: string;
}

interface JobDetails {
  location: string;
  type: string;
  salaryRange: string;
}

interface Company {
  name: string;
  industry: string;
}

interface Job {
  jobId: string;
  title: string;
  details: JobDetails;
  company: Company;
  skills: string[];
  postedDate: string; 
}

