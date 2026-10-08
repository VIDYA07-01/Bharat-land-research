import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import DemoBadge from '../../components/common/DemoBadge';
import StatCard from '../../components/common/StatCard';
import {
  LAND_DATASET_TYPES,
  STATE_WISE_DATA,
  LAND_USE_DATA,
  LAND_USE_PIE,
  LAND_OWNERSHIP_DATA,
  OWNERSHIP_PIE,
  LAND_RECORDS_DATA,
  RECORDS_LAND_TYPES,
  RECORDS_OWNERSHIP_TYPES,
  RECORDS_STATUS_TYPES,
} from '../../utils/landDatasetDemoData';

// ─── Shared colour map (mirrors LandDatasetPage) ──────────────────────────────
const colorMap = {
  blue:   { header: 'from-blue-900 via-blue-800 to-blue-700',   accent: 'text-blue-600 dark:text-blue-400',   badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',   bar: 'bg-blue-500',   icon: 'bg-blue-50 dark:bg-blue-900/30',   border: 'border-blue-200 dark:border-blue-800'   },
  green:  { header: 'from-emerald-900 via-emerald-800 to-emerald-700', accent: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300', bar: 'bg-emerald-500', icon: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800' },
  purple: { header: 'from-purple-900 via-purple-800 to-purple-700', accent: 'text-purple-600 dark:text-purple-400', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', bar: 'bg-purple-500', icon: 'bg-purple-50 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800' },
  orange: { header: 'from-orange-900 via-orange-800 to-orange-700', accent: 'text-orange-600 dark:text-orange-400', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', bar: 'bg-orange-500', icon: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800' },
};

// ─── Shared: horizontal bar ───────────────────────────────────────────────────
const HBar = ({ value, max, color = 'bg-primary-500', label }) => (
  <div className="flex items-center gap-3">
    {label && <span className="text-xs text-gray-500 w-28 flex-shrink-0 truncate">{label}</span>}
    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-2.5 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-10 text-right flex-shrink-0">
      {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}
      {typeof value === 'number' && value <= 100 && max <= 100 ? '%' : ''}
    </span>
  </div>
);

// ─── SVG Donut ────────────────────────────────────────────────────────────────
const DonutChart = ({ slices, size = 150 }) => {
  const r = 55;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;
  const total = slices.reduce((s, d) => s + d.value, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      {slices.map((slice, i) => {
        const pct = slice.value / total;
        const sda = `${pct * circumference} ${circumference}`;
        const sdo = -cumulative * circumference;
        cumulative += pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={slice.color} strokeWidth={24}
            strokeDasharray={sda} strokeDashoffset={sdo} />
        );
      })}
    </svg>
  );
};

// ─── Status badge helper ──────────────────────────────────────────────────────
const statusBadge = (s) => {
  const map = {
    Verified:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    Pending:      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'Under Review': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  };
  return map[s] || 'bg-gray-100 text-gray-600';
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATASET VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. STATE-WISE ────────────────────────────────────────────────────────────
function StateWiseView() {
  const [sortCol, setSortCol] = useState('totalArea');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('');

  const maxArea = Math.max(...STATE_WISE_DATA.map((r) => r.totalArea));

  const sorted = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = q ? STATE_WISE_DATA.filter((r) => r.state.toLowerCase().includes(q)) : [...STATE_WISE_DATA];
    return filtered.sort((a, b) =>
      sortDir === 'desc' ? b[sortCol] - a[sortCol] : a[sortCol] - b[sortCol],
    );
  }, [sortCol, sortDir, search]);

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortCol(col); setSortDir('desc'); }
  };

  const Th = ({ col, label }) => (
    <th
      onClick={() => toggleSort(col)}
      className="px-4 py-3 text-right cursor-pointer select-none hover:bg-primary-800 transition-colors"
    >
      <span className="flex items-center justify-end gap-1">
        {label}
        {sortCol === col ? (sortDir === 'desc' ? ' ↓' : ' ↑') : <span className="text-primary-400 text-xs">↕</span>}
      </span>
    </th>
  );

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🗺️" label="Total States" value={28} color="blue" />
        <StatCard icon="🏙️" label="Total UTs" value={8} color="purple" />
        <StatCard icon="📍" label="Total Districts" value={766} color="green" />
        <StatCard icon="🌾" label="Net Sown Area" value="140.1 M ha" color="orange" />
      </div>

      {/* Bar chart: top states */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Top States by Total Area (000 ha)</h3>
          <DemoBadge />
        </div>
        <div className="space-y-3">
          {STATE_WISE_DATA.slice(0, 8).map((r) => (
            <HBar key={r.state} label={r.state} value={r.totalArea} max={maxArea} color="bg-primary-500" />
          ))}
        </div>
      </div>

      {/* Land use breakdown bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Agricultural Land (000 ha)', key: 'agricultural', color: 'bg-emerald-500' },
          { label: 'Forest Cover (000 ha)', key: 'forest', color: 'bg-teal-600' },
          { label: 'Urban Area (000 ha)', key: 'urban', color: 'bg-indigo-500' },
        ].map(({ label, key, color }) => {
          const max = Math.max(...STATE_WISE_DATA.map((r) => r[key]));
          return (
            <div key={key} className="card p-5">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{label}</h4>
              <div className="space-y-2.5">
                {[...STATE_WISE_DATA]
                  .sort((a, b) => b[key] - a[key])
                  .slice(0, 6)
                  .map((r) => (
                    <HBar key={r.state} label={r.state} value={r[key]} max={max} color={color} />
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full sortable table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Complete State-wise Table</h3>
          <div className="flex items-center gap-2">
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter states…"
              className="input-field text-sm py-2 w-44"
            />
            <DemoBadge />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-900 text-white text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">State / UT</th>
                <Th col="totalArea" label="Total Area" />
                <Th col="agricultural" label="Agriculture" />
                <Th col="forest" label="Forest" />
                <Th col="water" label="Water" />
                <Th col="urban" label="Urban" />
                <Th col="other" label="Other" />
                <Th col="district" label="Districts" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, idx) => (
                <tr key={row.state} className={`text-sm border-b border-gray-100 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.state}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary-700 dark:text-primary-400">{row.totalArea.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400">{row.agricultural.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-teal-700 dark:text-teal-400">{row.forest.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">{row.water.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-indigo-600 dark:text-indigo-400">{row.urban.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{row.other.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{row.district}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
          {sorted.length} states · All area values in 000 ha (thousand hectares) · Click column headers to sort
        </div>
      </div>
    </div>
  );
}

// ─── 2. LAND USE ─────────────────────────────────────────────────────────────
function LandUseView() {
  const [selectedState, setSelectedState] = useState('');

  const tableData = selectedState
    ? LAND_USE_DATA.filter((r) => r.state === selectedState)
    : LAND_USE_DATA;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🌾" label="Agricultural" value="54.7%" color="green" />
        <StatCard icon="🌲" label="Forest Cover" value="21.7%" color="teal" />
        <StatCard icon="🏙️" label="Urban / Built-up" value="7.9%" color="indigo" />
        <StatCard icon="🏜️" label="Wasteland" value="5.6%" color="orange" />
      </div>

      {/* Donut + legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900 dark:text-white">National Land Use Distribution</h3>
            <DemoBadge />
          </div>
          <div className="flex items-center justify-center gap-8">
            <DonutChart slices={LAND_USE_PIE} size={160} />
            <div className="space-y-2.5">
              {LAND_USE_PIE.map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{s.label}</span>
                  <span className="ml-auto font-semibold text-gray-800 dark:text-white">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* State comparison bars */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Agricultural % by State</h3>
            <DemoBadge />
          </div>
          <div className="space-y-3">
            {[...LAND_USE_DATA]
              .sort((a, b) => b.agricultural - a.agricultural)
              .map((r) => (
                <HBar key={r.state} label={r.state} value={r.agricultural} max={100} color="bg-emerald-500" />
              ))}
          </div>
        </div>
      </div>

      {/* Full table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">State-wise Land Use (% of total area)</h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="input-field text-sm py-2 w-44"
            >
              <option value="">All States</option>
              {LAND_USE_DATA.map((r) => <option key={r.state} value={r.state}>{r.state}</option>)}
            </select>
            <DemoBadge />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-900 text-white text-xs uppercase tracking-wider">
                {['State / UT', 'Agriculture', 'Forest', 'Urban', 'Industrial', 'Water', 'Wasteland', 'Other'].map((h) => (
                  <th key={h} className={`px-4 py-3 ${h === 'State / UT' ? 'text-left' : 'text-right'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={row.state} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.state}</td>
                  <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400 font-semibold">{row.agricultural}%</td>
                  <td className="px-4 py-3 text-right text-teal-700 dark:text-teal-400">{row.forest}%</td>
                  <td className="px-4 py-3 text-right text-indigo-600 dark:text-indigo-400">{row.urban}%</td>
                  <td className="px-4 py-3 text-right text-orange-600 dark:text-orange-400">{row.industrial}%</td>
                  <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">{row.water}%</td>
                  <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">{row.wasteland}%</td>
                  <td className="px-4 py-3 text-right text-gray-500">{row.other}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
          {tableData.length} states shown · All values as % of total state geographic area
        </div>
      </div>
    </div>
  );
}

// ─── 3. LAND OWNERSHIP ───────────────────────────────────────────────────────
function LandOwnershipView() {
  const [selectedState, setSelectedState] = useState('');

  const tableData = selectedState
    ? LAND_OWNERSHIP_DATA.filter((r) => r.state === selectedState)
    : LAND_OWNERSHIP_DATA;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🏛️" label="Government Land" value="43.2%" color="blue" />
        <StatCard icon="👤" label="Private Holdings" value="38.6%" color="green" />
        <StatCard icon="👥" label="Community Land" value="12.1%" color="purple" />
        <StatCard icon="🏫" label="Institutional" value="6.1%" color="orange" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ownership donut */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900 dark:text-white">National Ownership Split</h3>
            <DemoBadge />
          </div>
          <div className="flex items-center justify-center gap-8">
            <DonutChart slices={OWNERSHIP_PIE} size={160} />
            <div className="space-y-3 flex-1">
              {OWNERSHIP_PIE.map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                      {s.label}
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-white">{s.value}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div className="h-1.5 rounded-full" style={{ width: `${s.value * 2}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Private ownership comparison */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Private vs Govt by State</h3>
            <DemoBadge />
          </div>
          <div className="space-y-3">
            {LAND_OWNERSHIP_DATA.slice(0, 7).map((r) => (
              <div key={r.state} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="w-28 truncate">{r.state}</span>
                  <span className="flex gap-3">
                    <span className="text-blue-600">Govt {r.government}%</span>
                    <span className="text-emerald-600">Pvt {r.private}%</span>
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden gap-px">
                  <div className="bg-blue-500 transition-all" style={{ width: `${r.government}%` }} />
                  <div className="bg-emerald-500 transition-all" style={{ width: `${r.private}%` }} />
                  <div className="bg-orange-400 transition-all" style={{ width: `${r.community}%` }} />
                  <div className="bg-purple-500 transition-all flex-1" />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 pt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> Govt</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Private</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-400 inline-block" /> Community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">State-wise Ownership Breakdown (%)</h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="input-field text-sm py-2 w-44"
            >
              <option value="">All States</option>
              {LAND_OWNERSHIP_DATA.map((r) => <option key={r.state} value={r.state}>{r.state}</option>)}
            </select>
            <DemoBadge />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-900 text-white text-xs uppercase tracking-wider">
                {['State / UT', 'Government', 'Private', 'Community', 'Institutional', 'Forest Dept'].map((h) => (
                  <th key={h} className={`px-4 py-3 ${h === 'State / UT' ? 'text-left' : 'text-right'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={row.state} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.state}</td>
                  <td className="px-4 py-3 text-right text-blue-700 dark:text-blue-400 font-semibold">{row.government}%</td>
                  <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400">{row.private}%</td>
                  <td className="px-4 py-3 text-right text-orange-600 dark:text-orange-400">{row.community}%</td>
                  <td className="px-4 py-3 text-right text-purple-700 dark:text-purple-400">{row.institutional}%</td>
                  <td className="px-4 py-3 text-right text-teal-600 dark:text-teal-400">{row.forest_dept}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
          {tableData.length} states shown · All values as % of total state land area
        </div>
      </div>
    </div>
  );
}

// ─── 4. LAND RECORDS ─────────────────────────────────────────────────────────
function LandRecordsView() {
  const [filterState,     setFilterState]     = useState('');
  const [filterLandType,  setFilterLandType]  = useState('');
  const [filterOwnership, setFilterOwnership] = useState('');
  const [filterStatus,    setFilterStatus]    = useState('');
  const [search,          setSearch]          = useState('');
  const [sortCol,         setSortCol]         = useState('id');
  const [sortDir,         setSortDir]         = useState('asc');

  const uniqueStates = [...new Set(LAND_RECORDS_DATA.map((r) => r.state))].sort();

  const processed = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = LAND_RECORDS_DATA.filter((r) => {
      if (filterState     && r.state     !== filterState)     return false;
      if (filterLandType  && r.landType  !== filterLandType)  return false;
      if (filterOwnership && r.ownership !== filterOwnership) return false;
      if (filterStatus    && r.status    !== filterStatus)    return false;
      if (q && ![r.state, r.district, r.village, r.surveyNo, r.landType, r.id]
        .join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filterState, filterLandType, filterOwnership, filterStatus, search, sortCol, sortDir]);

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('asc'); }
  };

  const SortTh = ({ col, label, align = 'left' }) => (
    <th
      onClick={() => toggleSort(col)}
      className={`px-4 py-3 cursor-pointer select-none hover:bg-orange-800 transition-colors text-${align}`}
    >
      {label} {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : <span className="text-orange-400 text-xs">↕</span>}
    </th>
  );

  // Summary counts
  const verifiedCount  = LAND_RECORDS_DATA.filter((r) => r.status === 'Verified').length;
  const pendingCount   = LAND_RECORDS_DATA.filter((r) => r.status === 'Pending').length;
  const reviewCount    = LAND_RECORDS_DATA.filter((r) => r.status === 'Under Review').length;
  const totalArea      = LAND_RECORDS_DATA.reduce((s, r) => s + r.area, 0).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📋" label="Total Records" value={LAND_RECORDS_DATA.length} color="orange" />
        <StatCard icon="✅" label="Verified" value={verifiedCount} color="green" />
        <StatCard icon="⏳" label="Pending / Review" value={pendingCount + reviewCount} color="purple" />
        <StatCard icon="📐" label="Total Area (ha)" value={`${totalArea} ha`} color="blue" />
      </div>

      {/* Land type distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Records by Land Type</h3>
            <DemoBadge />
          </div>
          <div className="space-y-3">
            {RECORDS_LAND_TYPES.map((type) => {
              const count = LAND_RECORDS_DATA.filter((r) => r.landType === type).length;
              return (
                <HBar key={type} label={type} value={count} max={LAND_RECORDS_DATA.length} color="bg-orange-500" />
              );
            })}
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Records by Ownership</h3>
            <DemoBadge />
          </div>
          <div className="space-y-4">
            {RECORDS_OWNERSHIP_TYPES.map((type) => {
              const count = LAND_RECORDS_DATA.filter((r) => r.ownership === type).length;
              const pct   = ((count / LAND_RECORDS_DATA.length) * 100).toFixed(0);
              const clr   = { Private: 'bg-emerald-500', Government: 'bg-blue-500', Community: 'bg-orange-400', Institutional: 'bg-purple-500' }[type] || 'bg-gray-400';
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{type}</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{count} records ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className={`h-2 rounded-full transition-all duration-700 ${clr}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex-shrink-0">🔎 Filters:</span>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, village, district…"
            className="input-field text-sm py-2 w-52"
          />
          <select value={filterState}     onChange={(e) => setFilterState(e.target.value)}     className="input-field text-sm py-2 w-auto">
            <option value="">All States</option>
            {uniqueStates.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterLandType}  onChange={(e) => setFilterLandType(e.target.value)}  className="input-field text-sm py-2 w-auto">
            <option value="">All Land Types</option>
            {RECORDS_LAND_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterOwnership} onChange={(e) => setFilterOwnership(e.target.value)} className="input-field text-sm py-2 w-auto">
            <option value="">All Ownership</option>
            {RECORDS_OWNERSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterStatus}    onChange={(e) => setFilterStatus(e.target.value)}    className="input-field text-sm py-2 w-auto">
            <option value="">All Status</option>
            {RECORDS_STATUS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {(search || filterState || filterLandType || filterOwnership || filterStatus) && (
            <button onClick={() => { setSearch(''); setFilterState(''); setFilterLandType(''); setFilterOwnership(''); setFilterStatus(''); }}
              className="btn-secondary text-sm py-2 px-3">
              ✕ Clear
            </button>
          )}
          <span className="ml-auto text-sm text-gray-500">{processed.length} records</span>
        </div>
      </div>

      {/* Records table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-orange-900 text-white text-xs uppercase tracking-wider">
                <SortTh col="id"        label="Record ID" />
                <SortTh col="state"     label="State" />
                <SortTh col="district"  label="District" />
                <SortTh col="village"   label="Village" />
                <SortTh col="surveyNo"  label="Survey No." />
                <SortTh col="area"      label="Area (ha)" align="right" />
                <SortTh col="landType"  label="Land Type" />
                <SortTh col="ownership" label="Ownership" />
                <SortTh col="status"    label="Status" />
              </tr>
            </thead>
            <tbody>
              {processed.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400">No records match your filters</td></tr>
              ) : (
                processed.map((row, idx) => (
                  <tr key={row.id} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors text-sm ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                    <td className="px-4 py-3 font-mono text-xs text-primary-700 dark:text-primary-400 font-semibold">{row.id}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{row.state}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.district}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.village}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{row.surveyNo}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-white">{row.area}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs">{row.landType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${{ Private: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', Government: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', Community: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', Institutional: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' }[row.ownership] || 'bg-gray-100 text-gray-600'}`}>
                        {row.ownership}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${statusBadge(row.status)}`}>{row.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 flex items-center justify-between flex-wrap gap-2">
          <span>{processed.length} of {LAND_RECORDS_DATA.length} records · Click column headers to sort</span>
          <DemoBadge />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DETAIL PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function LandDatasetDetailPage() {
  const { type } = useParams();
  const dataset = LAND_DATASET_TYPES.find((d) => d.id === type);

  // Unknown type → graceful fallback
  if (!dataset) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🗺️</p>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Dataset not found</h2>
          <Link to="/datasets" className="btn-primary">← Back to Land Datasets</Link>
        </div>
      </div>
    );
  }

  const c = colorMap[dataset.color];

  const viewMap = {
    'state-wise':      <StateWiseView />,
    'land-use':        <LandUseView />,
    'land-ownership':  <LandOwnershipView />,
    'land-records':    <LandRecordsView />,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <div className={`bg-gradient-to-r ${c.header} text-white py-12 px-4`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/datasets" className="hover:text-white transition-colors">Land Datasets</Link>
            <span>/</span>
            <span className="text-white">{dataset.title}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${c.icon} border border-white/20`}>
              {dataset.icon}
            </div>

            {/* Title block */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold">{dataset.title}</h1>
                <DemoBadge text="Demo Data" />
              </div>
              <p className="text-white/70 text-sm sm:text-base max-w-2xl leading-relaxed">
                {dataset.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {dataset.tags.map((tag) => (
                  <span key={tag} className={`badge text-xs ${c.badge}`}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Meta sidebar */}
            <div className="flex-shrink-0 sm:text-right space-y-1 text-sm text-white/70">
              <p><span className="text-white/40">Records: </span><span className="font-semibold text-white">{dataset.totalRecords.toLocaleString('en-IN')}</span></p>
              <p><span className="text-white/40">Format: </span><span className="text-white">{dataset.format}</span></p>
              <p><span className="text-white/40">Source: </span><span className="text-white">{dataset.source}</span></p>
              <p><span className="text-white/40">Updated: </span><span className="text-white">{dataset.lastUpdated}</span></p>
            </div>
          </div>

          {/* Quick-stat chips */}
          <div className="mt-6 flex flex-wrap gap-3">
            {dataset.stats.map((s) => (
              <div key={s.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
                <span>{s.icon}</span>
                <span className="text-white/70">{s.label}:</span>
                <span className="font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ACTION BAR ──────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
          <Link to="/datasets" className="btn-secondary text-sm py-2 px-4">
            ← All Datasets
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <button className="btn-secondary text-sm py-2 px-4">📥 Download CSV</button>
            <button className="btn-primary text-sm py-2 px-4">🔖 Bookmark</button>
          </div>
        </div>
      </div>

      {/* ── DATASET-SPECIFIC CONTENT ─────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        {viewMap[type]}
      </div>

      {/* ── OTHER DATASETS ──────────────────────────────────────────── */}
      <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="section-title mb-5">Explore Other Datasets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LAND_DATASET_TYPES.filter((d) => d.id !== type).map((d) => {
              const dc = colorMap[d.color];
              return (
                <Link
                  key={d.id}
                  to={`/datasets/${d.id}`}
                  className={`card-hover p-5 flex items-center gap-4 group border-l-4 ${dc.border}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${dc.icon}`}>
                    {d.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-snug">
                      {d.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{d.totalRecords.toLocaleString('en-IN')} records</p>
                  </div>
                  <span className="ml-auto text-gray-300 group-hover:text-primary-600 transition-colors">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── DEMO NOTICE ─────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-10">
        <div className="card p-5 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10 mt-6">
          <div className="flex gap-3">
            <span className="text-amber-500 text-xl flex-shrink-0">⚠️</span>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Demo Data Notice:</strong> All records, statistics, and figures shown here are
              sample data for demonstration purposes only. They do not represent official Government of
              India data. Official records will be integrated upon connection to verified authorised sources.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
