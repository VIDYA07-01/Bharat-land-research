import { Link } from 'react-router-dom';
import { DEMO_COLLABORATIONS } from '../../data/innovationData';
import DemoBadge from '../../components/common/DemoBadge';

const INNO_GREEN = 'from-[#0f5c3a] via-[#1a7a4e] to-[#0d7a52]';

const STATUS_STYLE = {
  Active:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Paused:    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

export default function InnovationCollaborations() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className={`bg-gradient-to-r ${INNO_GREEN} text-white py-10 px-4`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/innovation" className="hover:text-white">Innovation Portal</Link>
            <span>/</span>
            <span className="text-white">My Collaborations</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold">My Collaborations</h1>
            <DemoBadge text="Demo Data" />
          </div>
          <p className="text-green-200 text-sm mt-1">Research and innovation projects you are collaborating on.</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total',     value: DEMO_COLLABORATIONS.length,                                          icon: '🤝', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'             },
            { label: 'Active',    value: DEMO_COLLABORATIONS.filter((c) => c.status === 'Active').length,    icon: '✅', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'  },
            { label: 'Completed', value: DEMO_COLLABORATIONS.filter((c) => c.status === 'Completed').length, icon: '🏁', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'    },
          ].map((s) => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{s.label} Collaborations</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Collaboration cards */}
        <div className="space-y-5">
          {DEMO_COLLABORATIONS.map((col) => (
            <div key={col.id} className="card p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">{col.title}</h3>
                    <span className={`badge text-xs ${STATUS_STYLE[col.status] || 'bg-gray-100 text-gray-600'}`}>{col.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{col.description}</p>
                </div>
                <span className="badge bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 text-xs flex-shrink-0">
                  {col.category}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Your Role</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">{col.role}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Start Date</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">{col.startDate}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Partners</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300 text-xs leading-snug">
                    {col.partners.join(' · ')}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button className="btn-primary text-xs py-2 px-4">View Details</button>
                <button className="btn-secondary text-xs py-2 px-4">📧 Message Partners</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-5 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            ⚠️ Demo Data: These collaboration records are sample data for demonstration only.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/innovation" className="btn-secondary text-sm">← Innovation Portal</Link>
          <Link to="/innovation/certificates" className="btn-primary text-sm">🏅 My Certificates</Link>
        </div>
      </div>
    </div>
  );
}
