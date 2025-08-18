import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
};

// Jobs API
export const jobsAPI = {
  getJobs: (filters?: any) => api.get('/jobs', { params: filters }),
  getJob: (id: string) => api.get(`/jobs/${id}`),
  createJob: (jobData: any) => api.post('/jobs', jobData),
  updateJob: (id: string, jobData: any) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id: string) => api.delete(`/jobs/${id}`),
};

// Applications API
export const applicationsAPI = {
  applyForJob: (applicationData: any) => api.post('/applications', applicationData),
  getMyApplications: () => api.get('/applications/my-applications'),
  getReceivedApplications: () => api.get('/applications/received'),
  updateApplicationStatus: (id: string, status: string) => 
    api.put(`/applications/${id}/status`, { status }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData: any) => api.put('/users/profile', profileData),
  getMyJobs: () => api.get('/users/my-jobs'),
};

export default api;