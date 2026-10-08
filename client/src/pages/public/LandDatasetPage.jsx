import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DemoBadge from '../../components/common/DemoBadge';
import StatCard from '../../components/common/StatCard';
import {
  LAND_DATASET_TYPES,
  LAND_SUMMARY_STATS,
  STATE_WISE_DATA,
  LAND_USE_PIE,
  OWNERSHIP_PIE,
  YEAR_TREND,
} from '../../utils/landDatasetDemoData';
import { INDIAN_STATES } from '../../utils/constants';

// ─── Inline mini bar (no external charting lib needed) ───────────────────────
const MiniBar = ({ value, max, color = 'bg-primary-600' }) => (
  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
    <div
      className={`h-2 rounded-full transition-all duration-700 ${color}`}
      style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
    />
  </div>
);

// ─── SVG Donut chart (no dependency) ─────────────────────────────────────────
const DonutChart = ({ slices, size = 140 }) => {
  const r = 52;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;
  const total = slices.reduce((s, d) => s + d.value, 0);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      {slices.map((slice, i) => {
        const pct = slice.value / total;
        const strokeDasharray = `${pct * circumference} ${circumference}`;
        const strokeDashoffset = -cumulative * circumference;
        cumulative += pct;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={slice.color}
            strokeWidth={22}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        );
      })}
    </svg>
  );
};

// ─── Dataset type card ────────────────────────────────────────────────────────
const colorMap = {
  blue:   { border: 'border-blue-200 dark:border-blue-800',   icon: 'bg-blue-50 dark:bg-blue-900/30',   tag: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',   btn: 'bg-blue-700 hover:bg-blue-800',   bar: 'bg-blue-500' },
  green:  { border: 'border-emerald-200 dark:border-emerald-800', icon: 'bg-emerald-50 dark:bg-emerald-900/30', tag: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300', btn: 'bg-emerald-700 hover:bg-emerald-800', bar: 'bg-emerald-500' },
  purple: { border: 'border-purple-200 dark:border-purple-800', icon: 'bg-purple-50 dark:bg-purple-900/30', tag: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', btn: 'bg-purple-700 hover:bg-purple-800', bar: 'bg-purple-500' },
  orange: { border: 'border-orange-200 dark:border-orange-800', icon: 'bg-orange-50 dark:bg-orange-900/30', tag: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', btn: 'bg-orange-600 hover:bg-orange-700',   bar: 'bg-orange-500' },
};

const DatasetTypeCard = ({ dataset, searchMatch }) => {
  const c = colorMap[dataset.color];
  return (
    <div className={`card-hover flex flex-col border-t-4 ${c.border} overflow-hidden ${searchMatch ? 'ring-2 ring-primary-400 ring-offset-2' : ''}`}>
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${c.icon} flex-shrink-0`}>
            {dataset.icon}
          </div>
          <DemoBadge />
        </div>
        <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg leading-snug mb-1">
          {dataset.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{dataset.subtitle}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
          {dataset.description}
        </p>
      </div>

      {/* Mini stats row */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/60 grid grid-cols-2 gap-3 text-center">
        {dataset.stats.slice(0, 4).map((s, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400">{s.icon} {s.label}</span>
            <span className="font-bold text-gray-800 dark:text-white text-sm">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="px-5 pt-3 flex flex-wrap gap-1.5">
        {dataset.tags.slice(0, 4).map((tag) => (
          <span key={tag} className={`badge text-xs ${c.tag}`}>{tag}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 py-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
        <div className="text-xs text-gray-500 space-y-0.5">
          <p className="font-medium text-gray-700 dark:text-gray-300">{dataset.totalRecords.toLocaleString('en-IN')} records</p>
          <p>Format: {dataset.format}</p>
        </div>
        <Link
          to={`/datasets/${dataset.id}`}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${c.btn}`}
        >
          Explore <span>→</span>
        </Link>
      </div>
    </div>
  );
};

// ─── State-wise mini table ────────────────────────────────────────────────────
const MAX_AREA = Math.max(...STATE_WISE_DATA.map((r) => r.totalArea));

const StateTableRow = ({ row, idx }) => (
  <tr className={`text-sm ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
    <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.state}</td>
    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 text-right">{row.totalArea.toLocaleString('en-IN')}</td>
    <td className="px-4 py-2.5">
      <MiniBar value={row.totalArea} max={MAX_AREA} color="bg-primary-500" />
    </td>
    <td className="px-4 py-2.5 text-emerald-700 dark:text-emerald-400 text-right">{row.agricultural.toLocaleString('en-IN')}</td>
    <td className="px-4 py-2.5 text-teal-700 dark:text-teal-400 text-right">{row.forest.toLocaleString('en-IN')}</td>
    <td className="px-4 py-2.5 text-indigo-600 dark:text-indigo-400 text-right">{row.urban.toLocaleString('en-IN')}</td>
    <td className="px-4 py-2.5 text-center text-gray-500">{row.district}</td>
  </tr>
);

// ─── Trend sparkline bars ─────────────────────────────────────────────────────
const TrendBars = () => (
  <div className="flex items-end gap-2 h-20">
    {YEAR_TREND.map((d) => (
      <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full flex flex-col gap-0.5 justify-end" style={{ height: 56 }}>
          <div className="w-full rounded-sm bg-primary-500 opacity-90" style={{ height: `${(d.agricultural / 182) * 36}px` }} title={`Agriculture: ${d.agricultural}M ha`} />
          <div className="w-full rounded-sm bg-emerald-600" style={{ height: `${(d.forest / 72) * 16}px` }} title={`Forest: ${d.forest}M ha`} />
          <div className="w-full rounded-sm bg-orange-400" style={{ height: `${(d.urban / 22) * 8}px` }} title={`Urban: ${d.urban}M ha`} />
        </div>
        <span className="text-xs text-gray-400">{d.year}</span>
      </div>
    ))}
  </div>
);

// ─── Main page component ──────────────────────────────────────────────────────
export default function LandDatasetPage() {
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'preview'

  // Filter dataset cards by search
  const filteredDatasets = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return LAND_DATASET_TYPES;
    return LAND_DATASET_TYPES.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q),
    );
  }, [search]);

  // Filter state-wise preview table
  const filteredStates = useMemo(() => {
    if (!filterState) return STATE_WISE_DATA;
    return STATE_WISE_DATA.filter((r) => r.state === filterState);
  }, [filterState]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <div className="page-header">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-primary-300 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Land Dataset Module</span>
          </div>

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-display font-bold">Land Dataset Module</h1>
                <DemoBadge text="Sample Data" />
              </div>
              <p className="text-primary-200 text-sm sm:text-base max-w-2xl">
                Explore structured land data across India — state-wise distribution, land use patterns,
                ownership categories, and parcel-level records. All data is labelled as demo until
                verified official sources are connected.
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 text-sm text-primary-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Last synced: Aug 2026
            </div>
          </div>

          {/* Global search */}
          <div className="mt-6 relative max-w-2xl">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search datasets by name, category, or keywords…"
              className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-200 hover:text-white text-xl leading-none"
              >×</button>
            )}
          </div>
        </div>
      </div>

      {/* ── SUMMARY STAT CARDS ──────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {LAND_SUMMARY_STATS.map((s) => (
            <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} color={s.color} />
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* ── SECTION 1: DATASET CARDS ─────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Available Datasets</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {filteredDatasets.length} of {LAND_DATASET_TYPES.length} datasets
                {search && <span className="ml-1">matching "<strong>{search}</strong>"</span>}
              </p>
            </div>
            {search && (
              <button onClick={() => setSearch('')} className="btn-secondary text-sm py-1.5 px-4">
                Clear Search
              </button>
            )}
          </div>

          {filteredDatasets.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No datasets match your search</p>
              <p className="text-sm text-gray-500 mt-1">Try searching for "agriculture", "forest", "records", or "ownership"</p>
              <button onClick={() => setSearch('')} className="btn-primary mt-4">Clear Search</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {filteredDatasets.map((d) => (
                <DatasetTypeCard key={d.id} dataset={d} searchMatch={!!search} />
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 2: CHARTS ────────────────────────────────── */}
        <section>
          <h2 className="section-title mb-6">Data Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* Land Use Donut */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Land Use Breakdown</h3>
                <DemoBadge />
              </div>
              <div className="flex items-center gap-6">
                <DonutChart slices={LAND_USE_PIE} size={130} />
                <div className="flex-1 space-y-2">
                  {LAND_USE_PIE.map((s) => (
                    <div key={s.label} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <span className="text-gray-600 dark:text-gray-400 truncate">{s.label}</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-white flex-shrink-0">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ownership Donut */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Ownership Distribution</h3>
                <DemoBadge />
              </div>
              <div className="flex items-center gap-6">
                <DonutChart slices={OWNERSHIP_PIE} size={130} />
                <div className="flex-1 space-y-3">
                  {OWNERSHIP_PIE.map((s) => (
                    <div key={s.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                          <span className="text-gray-600 dark:text-gray-400">{s.label}</span>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-white">{s.value}%</span>
                      </div>
                      <MiniBar value={s.value} max={50} color="bg-primary-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Year trend */}
            <div className="card p-6 md:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Land Area Trend (M ha)</h3>
                <DemoBadge />
              </div>
              <TrendBars />
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-primary-500 inline-block" /> Agriculture</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-emerald-600 inline-block" /> Forest</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-orange-400 inline-block" /> Urban</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">2020–2025 demo trend values</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: PREVIEW DATA TABLE ─────────────────────── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="section-title">State-wise Land Area Preview</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Area figures in thousand hectares (000 ha) · <DemoBadge />
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="input-field w-auto text-sm py-2"
              >
                <option value="">All States</option>
                {STATE_WISE_DATA.map((r) => (
                  <option key={r.state} value={r.state}>{r.state}</option>
                ))}
              </select>
              {filterState && (
                <button onClick={() => setFilterState('')} className="btn-secondary text-sm py-2 px-3">✕</button>
              )}
              <Link to="/datasets/state-wise" className="btn-primary text-sm py-2">
                View Full Dataset →
              </Link>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary-900 text-white text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">State / UT</th>
                    <th className="px-4 py-3 text-right">Total Area</th>
                    <th className="px-4 py-3 text-left w-28">Relative</th>
                    <th className="px-4 py-3 text-right">Agricultural</th>
                    <th className="px-4 py-3 text-right">Forest</th>
                    <th className="px-4 py-3 text-right">Urban</th>
                    <th className="px-4 py-3 text-center">Districts</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStates.map((row, idx) => (
                    <StateTableRow key={row.state} row={row} idx={idx} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 flex items-center justify-between">
              <span>Showing {filteredStates.length} of {STATE_WISE_DATA.length} states · All values in 000 ha</span>
              <Link to="/datasets/state-wise" className="text-primary-600 hover:underline font-medium">
                Explore full dataset →
              </Link>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: QUICK LINKS ───────────────────────────── */}
        <section>
          <h2 className="section-title mb-5">Explore by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LAND_DATASET_TYPES.map((d) => {
              const c = colorMap[d.color];
              return (
                <Link
                  key={d.id}
                  to={`/datasets/${d.id}`}
                  className={`card-hover p-5 flex items-center gap-4 group border-l-4 ${c.border}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${c.icon}`}>
                    {d.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                      {d.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{d.totalRecords.toLocaleString('en-IN')} records</p>
                  </div>
                  <span className="ml-auto text-gray-300 dark:text-gray-600 group-hover:text-primary-600 transition-colors text-lg">→</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── FOOTER NOTE ──────────────────────────────────────── */}
        <div className="card p-5 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10">
          <div className="flex gap-3">
            <span className="text-amber-500 text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Demo Data Notice</p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                All statistics, records, and figures on this page are <strong>sample / demo data</strong> for
                demonstration purposes only. They do not represent official Government of India figures.
                Official data will be integrated upon verified connection to authorised sources such as
                Ministry of Land Resources, NLRMP, and Survey of India.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
