import React, { useState } from 'react';
import { jobsAPI } from '../../lib/api';

const PostJob: React.FC = () => {
  const [form, setForm] = useState<any>({
    title: '',
    description: '',
    requirements: '',
    company_name: '',
    location: '',
    employment_type: 'full-time',
    salary_min: '',
    salary_max: '',
    experience_required: '',
    skills_required: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : undefined,
        salary_max: form.salary_max ? Number(form.salary_max) : undefined,
        skills_required: form.skills_required
          ? form.skills_required.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
      };
      await jobsAPI.createJob(payload);
      setSuccess('Job posted successfully');
      setForm({
        title: '', description: '', requirements: '', company_name: '', location: '', employment_type: 'full-time',
        salary_min: '', salary_max: '', experience_required: '', skills_required: '',
      });
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Post a Job</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border rounded-lg">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-3 py-2 border rounded" />
        <input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Company" className="w-full px-3 py-2 border rounded" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full px-3 py-2 border rounded" />
        <select name="employment_type" value={form.employment_type} onChange={handleChange} className="w-full px-3 py-2 border rounded">
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="remote">Remote</option>
        </select>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="salary_min" value={form.salary_min} onChange={handleChange} placeholder="Salary Min" className="w-full px-3 py-2 border rounded" />
          <input name="salary_max" value={form.salary_max} onChange={handleChange} placeholder="Salary Max" className="w-full px-3 py-2 border rounded" />
        </div>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-3 py-2 border rounded" rows={4} />
        <textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements" className="w-full px-3 py-2 border rounded" rows={4} />
        <input name="experience_required" value={form.experience_required} onChange={handleChange} placeholder="Experience Required" className="w-full px-3 py-2 border rounded" />
        <input name="skills_required" value={form.skills_required} onChange={handleChange} placeholder="Skills (comma separated)" className="w-full px-3 py-2 border rounded" />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Posting...' : 'Post Job'}</button>
      </form>
    </div>
  );
};

export default PostJob;


