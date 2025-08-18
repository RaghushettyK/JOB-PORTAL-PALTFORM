export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: 'job_seeker' | 'employer';
  phone?: string;
  location?: string;
  company_name?: string;
  company_description?: string;
  website?: string;
  resume_url?: string;
  skills?: string[];
  experience_years?: number;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  company_name: string;
  location: string;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary_min?: number;
  salary_max?: number;
  experience_required: string;
  skills_required: string[];
  posted_by: string;
  status: 'active' | 'inactive' | 'filled';
  applications_count: number;
  created_at: string;
  updated_at: string;
  employer?: User;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'accepted' | 'rejected';
  cover_letter?: string;
  resume_url?: string;
  applied_at: string;
  updated_at: string;
  job?: Job;
  applicant?: User;
}

export interface JobFilters {
  search?: string;
  location?: string;
  employment_type?: string;
  experience_level?: string;
  salary_min?: number;
}