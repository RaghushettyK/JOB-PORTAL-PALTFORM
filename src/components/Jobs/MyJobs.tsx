import React, { useEffect, useState } from 'react';
import { usersAPI, jobsAPI } from '../../lib/api';

const MyJobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await usersAPI.getMyJobs();
      setJobs(res.data);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await jobsAPI.deleteJob(id);
      await load();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to delete job');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">My Jobs</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="space-y-4">
        {jobs.map((j) => (
          <div key={j.id} className="bg-white border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{j.title}</div>
              <div className="text-sm text-gray-600">{j.company_name} • {j.location}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => handleDelete(j.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobs;


