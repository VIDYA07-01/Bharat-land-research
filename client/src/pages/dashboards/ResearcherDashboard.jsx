import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import researchService from '../../services/researchService';
import datasetService from '../../services/datasetService';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import { formatDate, getStatusBadgeClass } from '../../utils/helpers';
import { getDemoTransactions } from '../public/ResearchPaymentPage';

export default function ResearcherDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [myResearch, setMyResearch] = useState([]);
  const [myDatasets, setMyDatasets] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [txns,       setTxns]       = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [r, d, p] = await Promise.all([
          researchService.getMy(),
          datasetService.getMy(),
          api.get('/projects'),
        ]);
        setMyResearch(r.data.data || []);
        setMyDatasets(d.data.data || []);
        setMyProjects(p.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
    setTxns(getDemoTransactions());
  }, []);

  const published = myResearch.filter((r) => ['published', 'approved'].includes(r.status)).length;
  const pending = myResearch.filter((r) => r.status === 'pending').length;
  const activeProjects = myProjects.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">{user?.organization} • {user?.state}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📄" label="My Research" value={myResearch.length} color="blue" />
        <StatCard icon="✅" label="Published" value={published} color="green" />
        <StatCard icon="⏳" label="Pending Review" value={pending} color="orange" />
        <StatCard icon="🤝" label="Active Projects" value={activeProjects} color="purple" />
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/researcher/upload-research', icon: '📤', label: 'Upload Research', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
            { to: '/researcher/upload-dataset', icon: '📊', label: 'Upload Dataset', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
            { to: '/researcher/projects', icon: '🤝', label: 'New Project', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
            { to: '/researcher/ai-tools', icon: '🤖', label: 'AI Tools', color: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100' },
          ].map(({ to, icon, label, color }) => (
            <Link key={to} to={to} className={`border rounded-xl p-4 text-center transition-colors ${color}`}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-sm font-medium">{label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* My Research */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Research Papers</h2>
          <Link to="/researcher/my-research" className="text-sm text-primary-700 hover:underline">View All →</Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>)}
          </div>
        ) : myResearch.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📄</div>
            <p>No research uploaded yet.</p>
            <Link to="/researcher/upload-research" className="btn-primary mt-3 text-sm">Upload Your First Research</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myResearch.slice(0, 5).map((r) => (
              <div key={r._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <Link to={`/research/${r._id}`} className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-primary-700 line-clamp-1">
                    {r.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{r.category} • {formatDate(r.createdAt)}</p>
                </div>
                <span className={`ml-3 ${getStatusBadgeClass(r.status)}`}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Projects */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Research Projects</h2>
          <Link to="/researcher/projects" className="text-sm text-primary-700 hover:underline">View All →</Link>
        </div>
        {myProjects.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <div className="text-4xl mb-2">🤝</div>
            <p>No projects yet.</p>
            <Link to="/researcher/projects" className="btn-primary mt-3 text-sm">Start a Project</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myProjects.slice(0, 4).map((p) => (
              <div key={p._id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-start justify-between mb-2">
                  <Link to={`/researcher/projects/${p._id}`} className="font-medium text-sm text-gray-800 dark:text-gray-200 hover:text-primary-700 line-clamp-1">{p.title}</Link>
                  <span className={`ml-2 ${getStatusBadgeClass(p.status)} flex-shrink-0`}>{p.status.replace('_', ' ')}</span>
                </div>
                <p className="text-xs text-gray-400">{p.members?.length || 0} members • {formatDate(p.updatedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* ── REVENUE / EARNINGS ──────────────────────────────── */}
      {(() => {
        const totalSales      = txns.reduce((s, t) => s + t.totalAmount,   0);
        const publisherTotal  = txns.reduce((s, t) => s + t.publisherShare, 0);
        const platformTotal   = txns.reduce((s, t) => s + t.platformShare,  0);
        return (
          <div className="card p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                💰 Researcher / Publisher Earnings
              </h2>
              <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-xs">
                DEMO REVENUE DATA
              </span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-5">
              ⚠️ Demo figures only — no real money has been transferred.
            </p>

            {/* Summary stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 text-center">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Total Sales</p>
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">${totalSales.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 text-center">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Your Share (60%)</p>
                <p className="text-2xl font-black text-blue-700 dark:text-blue-300">${publisherTotal.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-4 text-center">
                <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">Platform Share (40%)</p>
                <p className="text-2xl font-black text-primary-700 dark:text-primary-300">${platformTotal.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 text-center">
                <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Purchases</p>
                <p className="text-2xl font-black text-purple-700 dark:text-purple-300">{txns.length}</p>
              </div>
            </div>

            {/* Revenue split bar */}
            {totalSales > 0 && (
              <div className="mb-6">
                <div className="flex h-4 rounded-full overflow-hidden w-full mb-1">
                  <div className="bg-primary-600 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: '40%' }}>40%</div>
                  <div className="bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: '60%' }}>60%</div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>🏛️ Platform — ${platformTotal.toFixed(2)}</span>
                  <span>👩‍🔬 You (Researcher / Publisher) — ${publisherTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Recent transactions table */}
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Recent Transactions</h3>
            {txns.length === 0 ? (
              <div className="text-center py-8 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-3xl mb-2">💳</p>
                <p className="text-sm text-gray-500">No purchases recorded yet.</p>
                <p className="text-xs text-gray-400 mt-1">Buy a research paper to see demo transaction data here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3 text-left">Paper</th>
                      <th className="px-4 py-3 text-left">Plan</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-right">Your 60%</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txns.slice(0, 8).map((t, i) => (
                      <tr key={t.transactionId} className={`border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-800/30'}`}>
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 max-w-[140px] truncate">
                          {t.paperTitle || t.paperId}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{t.planLabel}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-gray-200">${t.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-black text-emerald-600 dark:text-emerald-400">${t.publisherShare.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell font-mono text-xs text-primary-600 dark:text-primary-400">
                          {t.transactionId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-600 text-xs font-bold">
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400" colSpan={2}>Total ({txns.length} transactions)</td>
                      <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-200">${totalSales.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">${publisherTotal.toFixed(2)}</td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        );
      })()}

    </div>
  );
}
