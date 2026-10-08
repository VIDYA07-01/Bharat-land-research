import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatDate, getStatusBadgeClass } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function AdminResearchPage() {
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [notes, setNotes] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const params = { limit: 30 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/research', { params });
      setResearch(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleAction = async (id, status) => {
    try {
      await api.put(`/research/${id}/approve`, { status, reviewNotes: notes[id] || '' });
      setResearch((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
      toast.success(`Research ${status}`);
    } catch (err) { toast.error('Action failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this research permanently?')) return;
    try {
      await api.delete(`/research/${id}`);
      setResearch((prev) => prev.filter((r) => r._id !== id));
      toast.success('Research deleted');
    } catch (err) { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Research Management</h1>
        <div className="flex gap-2">
          {['', 'pending', 'approved', 'published', 'rejected'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${statusFilter === s ? 'bg-primary-700 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {research.map((r) => (
            <div key={r._id} className={`card p-4 ${r.status === 'pending' ? 'border-l-4 border-l-orange-400' : ''}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={getStatusBadgeClass(r.status)}>{r.status}</span>
                    <span className="badge-blue">{r.category}</span>
                    {r.isDemoData && <span className="badge bg-amber-100 text-amber-700 text-xs">Demo</span>}
                  </div>
                  <Link to={`/research/${r._id}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-700 line-clamp-1">{r.title}</Link>
                  <p className="text-xs text-gray-400 mt-0.5">{r.uploadedBy?.name} • {r.uploadedBy?.organization} • {formatDate(r.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {r.status === 'pending' && (
                    <>
                      <button onClick={() => handleAction(r._id, 'approved')} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">✓ Approve</button>
                      <button onClick={() => handleAction(r._id, 'rejected')} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">✕ Reject</button>
                    </>
                  )}
                  {r.status === 'approved' && (
                    <button onClick={() => handleAction(r._id, 'published')} className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700">📢 Publish</button>
                  )}
                  <button onClick={() => handleDelete(r._id)} className="px-3 py-1.5 bg-gray-100 text-red-600 text-xs rounded-lg hover:bg-red-50">🗑️</button>
                </div>
              </div>
              {r.status === 'pending' && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Optional review notes..."
                    value={notes[r._id] || ''}
                    onChange={(e) => setNotes({ ...notes, [r._id]: e.target.value })}
                    className="input-field text-xs py-1.5"
                  />
                </div>
              )}
            </div>
          ))}
          {research.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">📄</div>
              <p>No research found for this filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
