import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import datasetService from '../../services/datasetService';
import api from '../../services/api';
import { formatDate, getStatusBadgeClass } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function MyDatasetsPage() {
  const { user } = useSelector((s) => s.auth);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFn = user?.role === 'admin'
      ? () => api.get('/datasets', { params: { limit: 50 } })
      : () => datasetService.getMy();

    loadFn().then(({ data }) => setDatasets(data.data || [])).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  const handleApprove = async (id, status) => {
    try {
      await datasetService.approve(id, { status });
      setDatasets((prev) => prev.map((d) => d._id === id ? { ...d, status } : d));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            {user?.role === 'admin' ? 'All Datasets' : 'My Datasets'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{datasets.length} datasets</p>
        </div>
        {user?.role === 'researcher' && <Link to="/researcher/upload-dataset" className="btn-primary">+ Upload Dataset</Link>}
      </div>

      {loading ? <LoadingSpinner /> : datasets.length === 0 ? (
        <EmptyState icon="💾" title="No datasets" action={user?.role === 'researcher' && <Link to="/researcher/upload-dataset" className="btn-primary">Upload Dataset</Link>} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {['Name', 'Category', 'Format', 'Year', 'Status', 'Downloads', 'Uploaded', ...(user?.role === 'admin' ? ['Actions'] : [])].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {datasets.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 max-w-[200px]">
                      <Link to={`/datasets/${d._id}`} className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary-700 line-clamp-1">{d.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{d.category}</td>
                    <td className="px-4 py-3"><span className="badge bg-blue-100 text-blue-700">{d.dataFormat}</span></td>
                    <td className="px-4 py-3 text-gray-500">{d.year || '—'}</td>
                    <td className="px-4 py-3"><span className={getStatusBadgeClass(d.status)}>{d.status}</span></td>
                    <td className="px-4 py-3 text-gray-500">{d.downloadCount || 0}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(d.createdAt)}</td>
                    {user?.role === 'admin' && (
                      <td className="px-4 py-3">
                        {d.status === 'pending' && (
                          <div className="flex gap-1">
                            <button onClick={() => handleApprove(d._id, 'published')} className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">✓</button>
                            <button onClick={() => handleApprove(d._id, 'rejected')} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">✕</button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
