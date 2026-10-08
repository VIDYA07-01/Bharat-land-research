import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOpportunity, TYPE_BADGE, TYPE_LABEL } from '../../data/innovationData';
import DemoBadge from '../../components/common/DemoBadge';

const STATUS_STYLE = {
  open:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  upcoming:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  closed:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  completed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const INNO_GREEN = 'from-[#0f5c3a] via-[#1a7a4e] to-[#0d7a52]';

export default function OpportunityDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const opp        = getOpportunity(id);
  const [applied,  setApplied]  = useState(false);
  const [saved,    setSaved]    = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('savedOpportunities') || '[]');
      return s.includes(id);
    } catch { return false; }
  });

  const toggleSave = () => {
    const prev = JSON.parse(localStorage.getItem('savedOpportunities') || '[]');
    const next = saved ? prev.filter((x) => x !== id) : [...prev, id];
    localStorage.setItem('savedOpportunities', JSON.stringify(next));
    setSaved(!saved);
  };

  if (!opp) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-3">🔍</p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Opportunity not found</p>
          <Link to="/innovation" className="btn-primary">← Back to Innovation Portal</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className={`bg-gradient-to-r ${INNO_GREEN} text-white py-12 px-4`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/innovation" className="hover:text-white">Innovation Portal</Link>
            <span>/</span>
            <span className="text-white truncate">{opp.id}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`badge text-xs ${TYPE_BADGE[opp.type]}`}>{TYPE_LABEL[opp.type]}</span>
                <span className={`badge text-xs ${STATUS_STYLE[opp.status]}`}>{opp.status}</span>
                <DemoBadge />
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold mb-3">{opp.title}</h1>
              <p className="text-green-200 text-sm sm:text-base max-w-2xl leading-relaxed">{opp.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {opp.tags.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 bg-white/10 text-white/80 rounded text-xs border border-white/20">{t}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex flex-col gap-2 sm:items-end">
              <button
                onClick={toggleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                  saved ? 'bg-white text-green-800 border-white' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                }`}
              >
                {saved ? '🔖 Saved' : '🔖 Save'}
              </button>
              {!applied ? (
                <button
                  onClick={() => setApplied(true)}
                  className="px-6 py-2.5 bg-white text-green-900 font-bold rounded-lg hover:bg-green-50 transition-colors text-sm"
                >
                  {opp.actionLabel} →
                </button>
              ) : (
                <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-400 rounded-lg text-emerald-200 text-sm font-medium">
                  ✅ {opp.actionLabel === 'Track' ? 'Tracking' : 'Applied / Registered'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About this Opportunity</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{opp.description}</p>
            </div>

            {opp.participants && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">👥 Who Can Participate</h2>
                <p className="text-gray-600 dark:text-gray-300">{opp.participants}</p>
              </div>
            )}

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🏷️ Category & Tags</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm border border-green-200 dark:border-green-800">
                  {opp.category}
                </span>
                {opp.tags.map((t) => (
                  <span key={t} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">{t}</span>
                ))}
              </div>
            </div>

            <div className="card p-5 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>⚠️ Demo Opportunity:</strong> This record is sample data created for demonstration purposes.
                It does not represent a real government programme or funding opportunity.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card p-5 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Details</h3>
              {[
                ['🏛️ Organisation',   opp.organization],
                ['📂 Type',           TYPE_LABEL[opp.type]],
                ['🌱 Category',       opp.category],
                ['📍 Location',       opp.location],
                ['📅 Deadline',       opp.deadline || 'Ongoing'],
                ['🚀 Start Date',     opp.startDate || 'TBC'],
                ['💰 Prize / Funding',opp.prizePool || 'N/A'],
                ['📊 Status',         opp.status],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                  <span className="text-gray-400 text-xs">{label}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{value}</span>
                </div>
              ))}
            </div>

            <div className="card p-5 space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-3">Quick Actions</h3>
              {!applied ? (
                <button onClick={() => setApplied(true)}
                  className="w-full py-2.5 bg-[#0f5c3a] text-white font-semibold rounded-lg hover:bg-[#0d4f32] transition-colors text-sm">
                  {opp.actionLabel} →
                </button>
              ) : (
                <div className="w-full py-2.5 bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-sm text-center">
                  ✅ {opp.actionLabel === 'Track' ? 'Tracking' : 'Applied / Registered'}
                </div>
              )}
              <button onClick={toggleSave}
                className="w-full py-2.5 btn-secondary text-sm">
                {saved ? '🔖 Saved' : '🔖 Save Opportunity'}
              </button>
              <Link to="/innovation/applications"
                className="w-full py-2.5 btn-secondary text-sm flex items-center justify-center gap-2">
                📋 My Applications
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button onClick={() => navigate(-1)} className="btn-secondary text-sm">← Back</button>
        </div>
      </div>
    </div>
  );
}
