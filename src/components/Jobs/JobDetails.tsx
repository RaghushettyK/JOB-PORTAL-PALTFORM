import React from 'react';
import { MapPin, Calendar, DollarSign, Clock, Building, ArrowLeft } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  company_name: string;
  location: string;
  employment_type: string;
  salary_min?: number;
  salary_max?: number;
  experience_required: string;
  skills_required: string[];
  created_at: string;
  applications_count: number;
}

interface JobDetailsProps {
  job: Job;
  onBack: () => void;
  onApply?: (jobId: string) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, onBack, onApply }) => {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </button>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-8">
          {/* Job Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
              <div className="flex items-center text-lg text-gray-600 mb-2">
                <Building className="h-5 w-5 mr-2" />
                <span className="font-medium">{job.company_name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{job.location}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                job.employment_type === 'full-time' ? 'bg-green-100 text-green-800' :
                job.employment_type === 'part-time' ? 'bg-blue-100 text-blue-800' :
                job.employment_type === 'contract' ? 'bg-purple-100 text-purple-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {job.employment_type.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Job Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Salary</p>
                <p className="font-semibold">{formatSalary(job.salary_min, job.salary_max)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Posted</p>
                <p className="font-semibold">{formatDate(job.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="font-semibold">{job.applications_count} candidates</p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-700">
              {job.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
            <div className="prose max-w-none text-gray-700">
              {job.requirements.split('\n').map((requirement, index) => (
                <p key={index} className="mb-2">• {requirement}</p>
              ))}
            </div>
          </div>

          {/* Experience Required */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience Required</h2>
            <p className="text-gray-700">{job.experience_required}</p>
          </div>

          {/* Skills Required */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills_required.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          {onApply && (
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => onApply(job.id)}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Apply for this position
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;