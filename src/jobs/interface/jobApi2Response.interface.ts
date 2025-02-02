export interface JobApi2Response {
  status: string;
  data: {
    jobsList: Record<string, JobDetails>;
  };
}

interface JobDetails {
  position: string;
  location: JobLocation;
  compensation: JobCompensation;
  employer: JobEmployer;
  requirements: JobRequirements;
  datePosted: string; // ISO date string
}

interface JobLocation {
  city: string;
  state: string;
  remote: boolean;
}

interface JobCompensation {
  min: number;
  max: number;
  currency: string;
}

interface JobEmployer {
  companyName: string;
  website: string;
}

interface JobRequirements {
  experience: number;
  technologies: string[];
}
