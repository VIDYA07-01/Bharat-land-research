import { Link } from 'react-router-dom';
import { DEMO_APPLICATIONS, TYPE_BADGE, TYPE_LABEL } from '../../data/innovationData';
import DemoBadge from '../../components/common/DemoBadge';

const STATUS_COLORS = {
  'Under Review': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Shortlisted':  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Registered':   'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Submitted':    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Rejected':     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const INNO_GREEN = 'from-[#0f5c3a] via-[#1a7a4e] to-[#0d7a52]';

export default function InnovationApplications() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className={`bg-gradient-to-r ${INNO_GREEN} text-white py-10 px-4`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/innovation" className="hover:text-white">Innovation Portal</Link>
            <span>/</span>
            <span className="text-white">My Applications</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold">My Applications</h1>
            <DemoBadge text="Demo Data" />
          </div>
          <p className="text-green-200 text-sm mt-1">Track the status of your submitted applications.</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Applied',  value: DEMO_APPLICATIONS.length, icon: '📋', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'   },
            { label: 'Under Review',   value: DEMO_APPLICATIONS.filter((a) => a.status === 'Under Review').length,  icon: '🔍', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' },
            { label: 'Shortlisted',    value: DEMO_APPLICATIONS.filter((a) => a.status === 'Shortlisted').length,   icon: '✅', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' },
            { label: 'Registered',     value: DEMO_APPLICATIONS.filter((a) => a.status === 'Registered').length,    icon: '🏆', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' },
          ].map((s) => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Application History</h2>
            <DemoBadge />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0f5c3a] text-white text-xs uppercase tracking-wider">
                  {['App ID', 'Opportunity', 'Type', 'Applied Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEMO_APPLICATIONS.map((app, idx) => (
                  <tr key={app.id} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                    <td className="px-4 py-3 font-mono text-xs text-green-700 dark:text-green-400 font-semibold">{app.id}</td>
                    <td className="px-4 py-3">
                      <Link to={`/innovation/opportunity/${app.opportunityId}`}
                        className="font-medium text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition-colors line-clamp-2 max-w-[200px] block">
                        {app.opportunityTitle}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${TYPE_BADGE[app.type]}`}>{TYPE_LABEL[app.type]}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{app.appliedDate}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-600'}`}>{app.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/innovation/opportunity/${app.opportunityId}`}
                        className="text-green-700 hover:text-green-900 text-xs font-medium">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-amber-600 dark:text-amber-400">
            ⚠️ Demo data — these are sample applications for interface demonstration only.
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/innovation" className="btn-secondary text-sm">← Innovation Portal</Link>
          <Link to="/innovation/saved" className="btn-primary text-sm">🔖 Saved Opportunities</Link>
        </div>
      </div>
    </div>
  );
}
