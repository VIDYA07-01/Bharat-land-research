import { useState } from 'react';
import { Link } from 'react-router-dom';
import { OPPORTUNITIES, TYPE_BADGE, TYPE_LABEL } from '../../data/innovationData';
import DemoBadge from '../../components/common/DemoBadge';

const INNO_GREEN = 'from-[#0f5c3a] via-[#1a7a4e] to-[#0d7a52]';

const STATUS_STYLE = {
  open:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  upcoming:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  closed:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  completed: 'bg-gray-100 text-gray-600',
};

export default function SavedOpportunities() {
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedOpportunities') || '[]'); }
    catch { return []; }
  });

  const removeSaved = (id) => {
    const next = savedIds.filter((x) => x !== id);
    localStorage.setItem('savedOpportunities', JSON.stringify(next));
    setSavedIds(next);
  };

  const saved = OPPORTUNITIES.filter((o) => savedIds.includes(o.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className={`bg-gradient-to-r ${INNO_GREEN} text-white py-10 px-4`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/innovation" className="hover:text-white">Innovation Portal</Link>
            <span>/</span>
            <span className="text-white">Saved Opportunities</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold">Saved Opportunities</h1>
            <span className="badge bg-white/20 text-white text-xs">{saved.length} saved</span>
          </div>
          <p className="text-green-200 text-sm mt-1">Opportunities you have bookmarked for later.</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {saved.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-5xl mb-3">🔖</p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">No saved opportunities</p>
            <p className="text-sm text-gray-500 mb-4">Browse the Innovation Portal and click the bookmark icon to save opportunities.</p>
            <Link to="/innovation" className="btn-primary">Browse Opportunities</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {saved.map((opp) => (
              <div key={opp.id} className="card-hover p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`badge text-xs ${TYPE_BADGE[opp.type]}`}>{TYPE_LABEL[opp.type]}</span>
                  <div className="flex items-center gap-2">
                    <span className={`badge text-xs ${STATUS_STYLE[opp.status]}`}>{opp.status}</span>
                    <button onClick={() => removeSaved(opp.id)}
                      title="Remove from saved"
                      className="text-red-400 hover:text-red-600 transition-colors text-sm font-bold">✕</button>
                  </div>
                </div>

                <Link to={`/innovation/opportunity/${opp.id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug hover:text-green-700 dark:hover:text-green-400 transition-colors line-clamp-2">
                    {opp.title}
                  </h3>
                </Link>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{opp.description}</p>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>🏛️ {opp.organization}</p>
                  <p>📍 {opp.location}</p>
                  {opp.deadline && <p>📅 Deadline: {opp.deadline}</p>}
                  {opp.prizePool && <p>💰 {opp.prizePool}</p>}
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                  <Link to={`/innovation/opportunity/${opp.id}`}
                    className="flex-1 py-2 text-center text-xs font-medium text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                    View Details
                  </Link>
                  <button onClick={() => removeSaved(opp.id)}
                    className="px-3 py-2 text-xs text-red-500 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Link to="/innovation" className="btn-secondary text-sm">← Innovation Portal</Link>
          <Link to="/innovation/applications" className="btn-primary text-sm">📋 My Applications</Link>
        </div>
      </div>
    </div>
  );
}
