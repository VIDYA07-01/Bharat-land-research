import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import analyticsService from '../../services/analyticsService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DemoBadge from '../../components/common/DemoBadge';
import StatCard from '../../components/common/StatCard';

const COLORS = ['#22c55e', '#f97316', '#15803d', '#3b82f6', '#8b5cf6', '#ef4444'];

const formatArea = (value) => `${(value / 1000).toFixed(0)}k km²`;

export default function AnalyticsDashboard() {
  const [landUse, setLandUse] = useState([]);
  const [climate, setClimate] = useState([]);
  const [disputes, setDisputes] = useState(null);
  const [policyPerf, setPolicyPerf] = useState([]);
  const [platformStats, setPlatformStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('landuse');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [lu, cl, di, pp, ps] = await Promise.all([
          analyticsService.getLandUseTrends(),
          analyticsService.getClimateResilience(),
          analyticsService.getLandDisputes(),
          analyticsService.getPolicyPerformance(),
          analyticsService.getPlatformStats(),
        ]);
        setLandUse(lu.data.data);
        setClimate(cl.data.data);
        setDisputes(di.data.data);
        setPolicyPerf(pp.data.data);
        setPlatformStats(ps.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  const tabs = [
    { id: 'landuse', label: '🌾 Land Use Trends' },
    { id: 'climate', label: '🌡️ Climate Resilience' },
    { id: 'disputes', label: '⚖️ Land Disputes' },
    { id: 'policy', label: '📋 Policy Performance' },
  ];

  if (loading) return <LoadingSpinner fullPage text="Loading analytics..." />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="page-header">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-display font-bold mb-1">Land Governance Analytics</h1>
              <p className="text-primary-200">Interactive dashboards for land use, climate, disputes, and policy performance</p>
            </div>
            <DemoBadge text="Demo Data – Not Official Statistics" />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Platform Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon="📄" label="Research Papers" value={platformStats.research || 0} color="blue" />
          <StatCard icon="💾" label="Datasets" value={platformStats.datasets || 0} color="green" />
          <StatCard icon="📋" label="Policies" value={platformStats.policies || 0} color="orange" />
          <StatCard icon="📚" label="Case Studies" value={platformStats.caseStudies || 0} color="purple" />
          <StatCard icon="🔬" label="Researchers" value={platformStats.researchers || 0} color="teal" />
          <StatCard icon="🤝" label="Projects" value={platformStats.projects || 0} color="indigo" />
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-gray-200 dark:border-gray-700 px-4">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {tabs.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === id
                      ? 'border-primary-700 text-primary-700 dark:text-primary-400 dark:border-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Land Use Trends */}
            {activeTab === 'landuse' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Land Use Trends 2015–2024</h3>
                  <p className="text-sm text-gray-500 mb-4">Annual land use change across India (area in km²)</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={landUse} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v, name) => [formatArea(v), name.charAt(0).toUpperCase() + name.slice(1)]} />
                        <Legend />
                        <Area type="monotone" dataKey="agricultural" stroke="#22c55e" fill="#bbf7d0" name="Agricultural" strokeWidth={2} />
                        <Area type="monotone" dataKey="urban" stroke="#f97316" fill="#fed7aa" name="Urban" strokeWidth={2} />
                        <Area type="monotone" dataKey="forest" stroke="#15803d" fill="#dcfce7" name="Forest" strokeWidth={2} />
                        <Area type="monotone" dataKey="water" stroke="#3b82f6" fill="#dbeafe" name="Water Bodies" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Land Use Pie */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Current Land Distribution (2024)</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Agricultural', value: 167800 },
                              { name: 'Forest', value: 65900 },
                              { name: 'Urban', value: 43200 },
                              { name: 'Water Bodies', value: 13200 },
                              { name: 'Wasteland', value: 35900 },
                            ]}
                            cx="50%" cy="50%" outerRadius={90}
                            dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                          </Pie>
                          <Tooltip formatter={(v) => formatArea(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Rate of Change (km²/year)</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { category: 'Agricultural', change: -1580 },
                          { category: 'Urban', change: 1700 },
                          { category: 'Forest', change: -460 },
                          { category: 'Water', change: -200 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="change" fill="#6366f1" name="Change km²/year" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Climate Resilience */}
            {activeTab === 'climate' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Climate Vulnerability by State</h3>
                  <p className="text-sm text-gray-500 mb-4">Risk scores (0-100) for drought, flood, and land degradation</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={climate} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="droughtRisk" fill="#f59e0b" name="Drought Risk" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="floodRisk" fill="#3b82f6" name="Flood Risk" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="landDegradation" fill="#ef4444" name="Land Degradation" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="vulnerability" fill="#8b5cf6" name="Overall Vulnerability" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'High Drought Risk States', value: climate.filter(s => s.droughtRisk > 60).length, icon: '☀️', color: 'orange' },
                    { label: 'High Flood Risk States', value: climate.filter(s => s.floodRisk > 60).length, icon: '🌊', color: 'blue' },
                    { label: 'High Degradation States', value: climate.filter(s => s.landDegradation > 50).length, icon: '⚠️', color: 'red' },
                    { label: 'Avg Vulnerability Score', value: Math.round(climate.reduce((a, s) => a + s.vulnerability, 0) / climate.length), icon: '📊', color: 'purple' },
                  ].map((s) => <StatCard key={s.label} {...s} />)}
                </div>
              </div>
            )}

            {/* Land Disputes */}
            {activeTab === 'disputes' && disputes && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard icon="⚖️" label="Total Disputes" value={disputes.summary.totalDisputes} color="red" />
                  <StatCard icon="⏳" label="Pending Cases" value={disputes.summary.totalPending} color="orange" />
                  <StatCard icon="✅" label="Resolved Cases" value={disputes.summary.totalResolved} color="green" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Disputes by Category</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={disputes.breakdown} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tick={{ fontSize: 11 }} />
                          <YAxis type="category" dataKey="category" width={140} tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="pending" fill="#ef4444" name="Pending" stackId="a" />
                          <Bar dataKey="resolved" fill="#22c55e" name="Resolved" stackId="a" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Resolution Rate by Category</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={disputes.breakdown}
                            cx="50%" cy="50%" outerRadius={80}
                            dataKey="count" nameKey="category"
                            label={({ category, percent }) => `${(percent * 100).toFixed(0)}%`}
                          >
                            {disputes.breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Policy Performance */}
            {activeTab === 'policy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Policy Performance 2024</h3>
                  <p className="text-sm text-gray-500 mb-4">Target vs Achievement for key land governance schemes</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={policyPerf}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="policy" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v) => v.toLocaleString()} />
                        <Legend />
                        <Bar dataKey="target" fill="#e5e7eb" name="Target" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="achieved" fill="#3b82f6" name="Achieved" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {policyPerf.map((p) => (
                    <div key={p.policy} className="card p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{p.policy}</h4>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Achievement</span>
                        <span className="font-bold text-primary-700">{Math.round((p.achieved / p.target) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (p.achieved / p.target) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          ⚠️ All analytics data shown is for demonstration purposes only. Not official government statistics.
        </div>
      </div>
    </div>
  );
}
