import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import analyticsService from '../../services/analyticsService';
import StatCard from '../../components/common/StatCard';
import DemoBadge from '../../components/common/DemoBadge';

export default function GovernmentDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [landUse, setLandUse] = useState([]);
  const [disputes, setDisputes] = useState(null);
  const [policyPerf, setPolicyPerf] = useState([]);
  const [platformStats, setPlatformStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [lu, di, pp, ps] = await Promise.all([
          analyticsService.getLandUseTrends(),
          analyticsService.getLandDisputes(),
          analyticsService.getPolicyPerformance(),
          analyticsService.getPlatformStats(),
        ]);
        setLandUse(lu.data.data.slice(-5));
        setDisputes(di.data.data);
        setPolicyPerf(pp.data.data);
        setPlatformStats(ps.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Government Dashboard
          </h1>
          <p className="text-gray-500 mt-1">{user?.organization} • {user?.designation}</p>
        </div>
        <DemoBadge text="Demo Analytics Data" />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📄" label="Research Papers" value={platformStats.research || 0} color="blue" />
        <StatCard icon="⚖️" label="Active Disputes" value={disputes?.summary?.totalPending || 0} color="red" />
        <StatCard icon="📋" label="Policies Active" value={platformStats.policies || 0} color="green" />
        <StatCard icon="💾" label="Datasets Available" value={platformStats.datasets || 0} color="purple" />
      </div>

      {/* Quick Links */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/government/policy-performance', icon: '📈', label: 'Policy Performance', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
            { to: '/government/analytics', icon: '📊', label: 'Land Analytics', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
            { to: '/government/simulation', icon: '🔬', label: 'Policy Simulation', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
            { to: '/gis-map', icon: '🗺️', label: 'GIS Map', color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' },
          ].map(({ to, icon, label, color }) => (
            <Link key={to} to={to} className={`border rounded-xl p-4 text-center transition-colors ${color}`}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-sm font-medium">{label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Land Use Trend */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Land Use Trend (Last 5 Years)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={landUse}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${(v / 1000).toFixed(0)}k km²`} />
                <Line type="monotone" dataKey="agricultural" stroke="#22c55e" name="Agricultural" strokeWidth={2} />
                <Line type="monotone" dataKey="urban" stroke="#f97316" name="Urban" strokeWidth={2} />
                <Line type="monotone" dataKey="forest" stroke="#15803d" name="Forest" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Policy Performance */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Policy Achievement Rate</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={policyPerf}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="policy" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, n, p) => [`${Math.round((p.payload.achieved / p.payload.target) * 100)}%`, 'Achievement']} />
                <Bar
                  dataKey={(p) => Math.round((p.achieved / p.target) * 100)}
                  fill="#3b82f6"
                  name="Achievement %"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dispute Summary */}
      {disputes && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Land Dispute Summary</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <p className="text-2xl font-bold text-red-700">{disputes.summary.totalDisputes?.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Disputes</p>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <p className="text-2xl font-bold text-orange-700">{disputes.summary.totalPending?.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <p className="text-2xl font-bold text-green-700">{disputes.summary.totalResolved?.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Resolved</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Resolution Rate: {Math.round((disputes.summary.totalResolved / disputes.summary.totalDisputes) * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}
