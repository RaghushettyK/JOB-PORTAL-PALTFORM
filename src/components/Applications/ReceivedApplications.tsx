import React, { useEffect, useState } from 'react';
import { applicationsAPI } from '../../lib/api';

const ReceivedApplications: React.FC = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await applicationsAPI.getReceivedApplications();
      setApps(res.data);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await applicationsAPI.updateApplicationStatus(id, status);
      await load();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Received Applications</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="space-y-4">
        {apps.map((a) => (
          <div key={a.id} className="bg-white border rounded p-4">
            <div className="font-semibold">{a.job_title} • {a.company_name}</div>
            <div className="text-sm">Applicant: {a.applicant_name} ({a.applicant_email})</div>
            <div className="text-sm text-gray-600">Status: {a.status}</div>
            <div className="flex space-x-2 mt-2">
              {['pending','reviewed','interviewed','accepted','rejected'].map(s => (
                <button key={s} onClick={() => updateStatus(a.id, s)} className="px-3 py-1 bg-blue-600 text-white rounded">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedApplications;


