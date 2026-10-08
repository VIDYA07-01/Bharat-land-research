import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import researchService from '../../services/researchService';
import { formatDate, getStatusBadgeClass } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function MyResearchPage() {
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    researchService.getMy().then(({ data }) => setResearch(data.data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Research Papers</h1>
          <p className="text-gray-500 text-sm mt-1">{research.length} papers uploaded</p>
        </div>
        <Link to="/researcher/upload-research" className="btn-primary">+ Upload Research</Link>
      </div>

      {loading ? <LoadingSpinner /> : research.length === 0 ? (
        <EmptyState icon="📄" title="No research uploaded yet" description="Upload your first research paper to get started."
          action={<Link to="/researcher/upload-research" className="btn-primary">Upload Research</Link>} />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['Title', 'Category', 'Year', 'Status', 'Views', 'Downloads', 'Uploaded'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {research.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 max-w-[250px]">
                    <Link to={`/research/${r._id}`} className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary-700 line-clamp-1">{r.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.category}</td>
                  <td className="px-4 py-3 text-gray-500">{r.publicationYear || '—'}</td>
                  <td className="px-4 py-3"><span className={getStatusBadgeClass(r.status)}>{r.status}</span></td>
                  <td className="px-4 py-3 text-gray-500">{r.viewCount || 0}</td>
                  <td className="px-4 py-3 text-gray-500">{r.downloadCount || 0}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
