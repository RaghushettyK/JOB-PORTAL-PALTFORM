import React, { useEffect, useState } from 'react';
import { applicationsAPI } from '../../lib/api';

const MyApplications: React.FC = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await applicationsAPI.getMyApplications();
        setApps(res.data);
      } catch (e: any) {
        setError(e.response?.data?.error || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">My Applications</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="space-y-4">
        {apps.map((a) => (
          <div key={a.id} className="bg-white border rounded p-4">
            <div className="font-semibold">{a.job_title} • {a.company_name}</div>
            <div className="text-sm text-gray-600">Status: {a.status}</div>
            <div className="text-sm">Applied: {new Date(a.applied_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;


