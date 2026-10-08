import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import analyticsService from '../../services/analyticsService';
import StatCard from '../../components/common/StatCard';
import { formatDate, getStatusBadgeClass, getRoleBadgeClass } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getDemoTransactions } from '../public/ResearchPaymentPage';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingResearch, setPendingResearch] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, pendingRes, usersRes] = await Promise.all([
          analyticsService.getAdminStats(),
          api.get('/research/pending'),
          api.get('/users', { params: { limit: 5, sort: '-createdAt' } }),
        ]);
        setStats(statsRes.data.data);
        setPendingResearch(pendingRes.data.data || []);
        setRecentUsers(usersRes.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
    setTxns(getDemoTransactions());
  }, []);

  const handleApprove = async (id, status) => {
    try {
      await api.put(`/research/${id}/approve`, { status });
      setPendingResearch((prev) => prev.filter((r) => r._id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <LoadingSpinner text="Loading admin data..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Bharat Land Research & Governance Portal Management</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <>
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Platform Users</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="👥" label="Total Users" value={stats.users.total} color="blue" />
              <StatCard icon="🔬" label="Researchers" value={stats.users.researchers} color="purple" />
              <StatCard icon="🏛️" label="Government" value={stats.users.governmentUsers} color="green" />
              <StatCard icon="🔑" label="Admins" value={stats.users.admins} color="red" />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Platform Content</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="📄" label="Research Papers" value={stats.research.total} color="blue" />
              <StatCard icon="⏳" label="Pending Research" value={stats.research.pending} color="orange" />
              <StatCard icon="💾" label="Datasets" value={stats.datasets.total} color="green" />
              <StatCard icon="📋" label="Policies" value={stats.policies.total} color="teal" />
            </div>
          </div>
        </>
      )}

      {/* Admin Quick Links */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Management</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { to: '/admin/users', icon: '👥', label: 'Users' },
            { to: '/admin/research', icon: '📄', label: 'Research' },
            { to: '/admin/datasets', icon: '💾', label: 'Datasets' },
            { to: '/admin/policies', icon: '📋', label: 'Policies' },
            { to: '/admin/case-studies', icon: '📚', label: 'Case Studies' },
            { to: '/analytics', icon: '📊', label: 'Analytics' },
          ].map(({ to, icon, label }) => (
            <Link key={to} to={to} className="card p-4 text-center hover:shadow-md transition-shadow group">
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{icon}</div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pending Research Approvals
            {pendingResearch.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-normal">
                {pendingResearch.length}
              </span>
            )}
          </h2>
          <Link to="/admin/research" className="text-sm text-primary-700 hover:underline">View All</Link>
        </div>

        {pendingResearch.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-3xl mb-2">✅</div>
            <p>All caught up! No pending research to review.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingResearch.slice(0, 5).map((r) => (
              <div key={r._id} className="flex items-start justify-between p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-1">{r.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {r.uploadedBy?.name} • {r.uploadedBy?.organization} • {formatDate(r.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(r._id, 'approved')}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleApprove(r._id, 'rejected')}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── PLATFORM REVENUE ─────────────────────────────────── */}
      {(() => {
        const totalSales     = txns.reduce((s, t) => s + t.totalAmount,    0);
        const platformTotal  = txns.reduce((s, t) => s + t.platformShare,  0);
        const publisherTotal = txns.reduce((s, t) => s + t.publisherShare, 0);
        return (
          <div className="card p-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                💰 Platform Revenue
              </h2>
              <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-xs">
                DEMO REVENUE DATA
              </span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-5">
              ⚠️ Demo figures only — no real money has been transferred. Hackathon Prototype.
            </p>

            {/* Summary stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-4 text-center">
                <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">Total Sales</p>
                <p className="text-2xl font-black text-primary-700 dark:text-primary-300">${totalSales.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 text-center">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Platform Share (40%)</p>
                <p className="text-2xl font-black text-blue-700 dark:text-blue-300">${platformTotal.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 text-center">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Publisher Share (60%)</p>
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">${publisherTotal.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 text-center">
                <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Total Transactions</p>
                <p className="text-2xl font-black text-purple-700 dark:text-purple-300">{txns.length}</p>
              </div>
            </div>

            {/* Split bar */}
            {totalSales > 0 && (
              <div className="mb-6">
                <div className="flex h-4 rounded-full overflow-hidden w-full mb-1">
                  <div className="bg-primary-600 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: '40%' }}>40% Platform</div>
                  <div className="bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: '60%' }}>60% Publisher</div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>🏛️ Platform — ${platformTotal.toFixed(2)}</span>
                  <span>👩‍🔬 Researchers / Publishers — ${publisherTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Recent revenue table */}
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Recent Revenue Transactions</h3>
            {txns.length === 0 ? (
              <div className="text-center py-8 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-3xl mb-2">📊</p>
                <p className="text-sm text-gray-500">No demo transactions recorded yet.</p>
                <p className="text-xs text-gray-400 mt-1">Purchase a research paper to generate demo revenue data.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3 text-left">Transaction ID</th>
                      <th className="px-4 py-3 text-left">Plan</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-right">Platform 40%</th>
                      <th className="px-4 py-3 text-right">Publisher 60%</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txns.slice(0, 10).map((t, i) => (
                      <tr key={t.transactionId} className={`border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-800/30'}`}>
                        <td className="px-4 py-3 font-mono text-xs text-primary-600 dark:text-primary-400">{t.transactionId}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.planLabel}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-gray-200">${t.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-bold text-primary-600 dark:text-primary-400">${t.platformShare.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">${t.publisherShare.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">
                          {new Date(t.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-600 text-xs font-bold">
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400" colSpan={2}>Total ({txns.length})</td>
                      <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-200">${totalSales.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-primary-600 dark:text-primary-400">${platformTotal.toFixed(2)}</td>
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

      {/* Recent Users */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Registrations</h2>
          <Link to="/admin/users" className="text-sm text-primary-700 hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 font-medium text-gray-500">Name</th>
                <th className="pb-2 font-medium text-gray-500">Role</th>
                <th className="pb-2 font-medium text-gray-500">Organization</th>
                <th className="pb-2 font-medium text-gray-500">Joined</th>
                <th className="pb-2 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2.5 font-medium text-gray-800 dark:text-gray-200">{u.name}</td>
                  <td className="py-2.5">
                    <span className={getRoleBadgeClass(u.role)}>{u.role}</span>
                  </td>
                  <td className="py-2.5 text-gray-500 truncate max-w-[150px]">{u.organization || '—'}</td>
                  <td className="py-2.5 text-gray-400">{formatDate(u.createdAt)}</td>
                  <td className="py-2.5">
                    <span className={u.isActive ? 'badge-green' : 'badge-red'}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
