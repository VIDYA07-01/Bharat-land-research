import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DemoBadge from '../../components/common/DemoBadge';
import StatCard from '../../components/common/StatCard';
import {
  POLICIES,
  POLICY_CATEGORY_LIST,
  POLICY_TYPE_LIST,
  POLICY_STATUS_LIST,
  GOVT_LEVEL_LIST,
  POLICY_SORT_OPTIONS,
  POL_SUMMARY_STATS,
  POL_BY_CATEGORY,
  POL_BY_LEVEL,
  POL_BY_YEAR,
  POL_BY_TYPE,
} from '../../utils/policyDemoData';
import { INDIAN_STATES } from '../../utils/constants';

// ─── Colour helpers ───────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  'Agriculture Land':       { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700', dot: 'bg-emerald-500' },
  'Land Records':           { bg: 'bg-blue-50 dark:bg-blue-900/20',       text: 'text-blue-700 dark:text-blue-300',       border: 'border-blue-300 dark:border-blue-700',       dot: 'bg-blue-500'   },
  'Land Acquisition':       { bg: 'bg-red-50 dark:bg-red-900/20',         text: 'text-red-700 dark:text-red-300',         border: 'border-red-300 dark:border-red-700',         dot: 'bg-red-500'    },
  'Land Use':               { bg: 'bg-indigo-50 dark:bg-indigo-900/20',   text: 'text-indigo-700 dark:text-indigo-300',   border: 'border-indigo-300 dark:border-indigo-700',   dot: 'bg-indigo-500' },
  'Forest and Conservation':{ bg: 'bg-teal-50 dark:bg-teal-900/20',       text: 'text-teal-700 dark:text-teal-300',       border: 'border-teal-300 dark:border-teal-700',       dot: 'bg-teal-600'   },
  'Urban Development':      { bg: 'bg-purple-50 dark:bg-purple-900/20',   text: 'text-purple-700 dark:text-purple-300',   border: 'border-purple-300 dark:border-purple-700',   dot: 'bg-purple-500' },
  'Rural Development':      { bg: 'bg-amber-50 dark:bg-amber-900/20',     text: 'text-amber-700 dark:text-amber-300',     border: 'border-amber-300 dark:border-amber-700',     dot: 'bg-amber-500'  },
  'Land Dispute Resolution':{ bg: 'bg-orange-50 dark:bg-orange-900/20',   text: 'text-orange-700 dark:text-orange-300',   border: 'border-orange-300 dark:border-orange-700',   dot: 'bg-orange-500' },
};
const catColor = (c) => CATEGORY_COLORS[c] || CATEGORY_COLORS['Land Records'];

const STATUS_STYLES = {
  'Active':                 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Amended':                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Replaced':               'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  'Archived':               'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Verification Required':  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

const TYPE_STYLES = {
  Act:        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Programme:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Scheme:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Policy:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Rule:       'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  Guideline:  'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  Regulation: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Initiative: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

// ─── SVG Donut ────────────────────────────────────────────────────────────────
const DonutChart = ({ slices, size = 120 }) => {
  const r = 48, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let cum = 0;
  const total = slices.reduce((s, d) => s + d.value, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      {slices.map((s, i) => {
        const pct = s.value / total;
        const sda = `${pct * circ} ${circ}`;
        const sdo = -cum * circ;
        cum += pct;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth={20} strokeDasharray={sda} strokeDashoffset={sdo} />;
      })}
    </svg>
  );
};

// ─── Horizontal bar ───────────────────────────────────────────────────────────
const HBar = ({ label, value, max, color = 'bg-primary-500' }) => (
  <div className="flex items-center gap-2 text-xs">
    <span className="w-36 truncate text-gray-600 dark:text-gray-400 flex-shrink-0">{label}</span>
    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
      <div className={`h-2 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
    </div>
    <span className="w-4 text-right font-semibold text-gray-700 dark:text-gray-300">{value}</span>
  </div>
);

// ─── Policy Card ──────────────────────────────────────────────────────────────
const PolicyCard = ({ policy, compareIds, onToggleCompare }) => {
  const cc = catColor(policy.category);
  const inCompare = compareIds.includes(policy.id);
  const canAdd = !inCompare && compareIds.length < 3;

  return (
    <div className={`card-hover flex flex-col border-t-4 ${cc.border} overflow-hidden relative`}>
      {/* Compare checkbox */}
      <button
        onClick={() => onToggleCompare(policy.id)}
        title={inCompare ? 'Remove from comparison' : canAdd ? 'Add to comparison' : 'Maximum 3 policies'}
        className={`absolute top-3 right-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors z-10 ${
          inCompare
            ? 'bg-primary-600 border-primary-600 text-white'
            : canAdd
              ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-500'
              : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-40'
        }`}
      >
        {inCompare && <span className="text-xs font-bold leading-none">✓</span>}
      </button>

      <div className="p-5 pb-3 flex-1 flex flex-col gap-3">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 pr-7">
          <span className={`badge text-xs ${cc.bg} ${cc.text}`}>{policy.category}</span>
          <span className={`badge text-xs ${TYPE_STYLES[policy.policyType] || 'bg-gray-100 text-gray-600'}`}>
            {policy.policyType}
          </span>
          {policy.isDemoData && <DemoBadge />}
        </div>

        {/* Title */}
        <Link to={`/policies/${policy.id}`}>
          <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm leading-snug hover:text-primary-700 dark:hover:text-primary-400 transition-colors line-clamp-3">
            {policy.name}
          </h3>
        </Link>

        {/* Ministry + level */}
        <div className="space-y-1 text-xs text-gray-500">
          <p className="flex items-center gap-1">
            <span>🏛️</span>
            <span className="truncate">{policy.ministry}</span>
          </p>
          <p className="flex items-center gap-1">
            <span>{policy.governmentLevel === 'Central Government' ? '🇮🇳' : '🗺️'}</span>
            <span>{policy.governmentLevel}</span>
            {policy.state && <span className="text-gray-400">– {policy.state}</span>}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 flex-1">
          {policy.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {policy.tags.slice(0, 4).map((t) => (
            <span key={t} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full text-xs">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
        <div className="text-xs space-y-0.5">
          <p className="font-medium text-gray-700 dark:text-gray-300">Year: {policy.year}</p>
          <span className={`badge text-xs ${STATUS_STYLES[policy.status] || 'bg-gray-100 text-gray-600'}`}>
            {policy.status}
          </span>
        </div>
        <Link to={`/policies/${policy.id}`} className="btn-primary text-xs py-2 px-4">
          View Policy →
        </Link>
      </div>
    </div>
  );
};

// ─── Category navigation pill ─────────────────────────────────────────────────
const CategoryPill = ({ cat, active, count, onClick }) => {
  const cc = catColor(cat);
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        active
          ? `${cc.bg} ${cc.text} ${cc.border} shadow-sm`
          : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:text-primary-700'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${cc.dot}`} />
      {cat}
      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${active ? cc.bg : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
        {count}
      </span>
    </button>
  );
};

// ─── Comparison table ─────────────────────────────────────────────────────────
const ComparePanel = ({ ids, onClear, onRemove }) => {
  const selected = ids.map((id) => POLICIES.find((p) => p.id === id)).filter(Boolean);
  if (selected.length < 2) return null;

  const ROWS = [
    { label: 'Government Level', key: 'governmentLevel' },
    { label: 'Ministry',         key: 'ministry' },
    { label: 'Year',             key: 'year' },
    { label: 'Category',         key: 'category' },
    { label: 'Policy Type',      key: 'policyType' },
    { label: 'Status',           key: 'status' },
    { label: 'Applicable Area',  key: 'applicableArea' },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-primary-900 text-white">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          ⚖️ Policy Comparison <span className="badge bg-white/20 text-white text-xs">{selected.length} selected</span>
        </h3>
        <button onClick={onClear} className="text-white/60 hover:text-white text-sm">✕ Clear</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-xs text-gray-400 uppercase tracking-wider w-36">Field</th>
              {selected.map((p) => (
                <th key={p.id} className="px-4 py-3 text-left min-w-[200px]">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/policies/${p.id}`} className="font-semibold text-gray-800 dark:text-white text-xs leading-snug hover:text-primary-700 line-clamp-2">
                      {p.name}
                    </Link>
                    <button onClick={() => onRemove(p.id)} className="text-gray-400 hover:text-red-500 text-xs flex-shrink-0">✕</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, idx) => (
              <tr key={row.label} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}>
                <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">{row.label}</td>
                {selected.map((p) => (
                  <td key={p.id} className="px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300">{p[row.key] || '–'}</td>
                ))}
              </tr>
            ))}
            <tr className="bg-white dark:bg-gray-900">
              <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">Objective</td>
              {selected.map((p) => (
                <td key={p.id} className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{p.objective}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-amber-600">
        ⚠️ All data shown is demo content. Verify against official government sources before use.
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 9;

export default function PolicyPage() {
  const [search,       setSearch]       = useState('');
  const [filterLevel,  setFilterLevel]  = useState('');
  const [filterState,  setFilterState]  = useState('');
  const [filterCat,    setFilterCat]    = useState('');
  const [filterType,   setFilterType]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterYear,   setFilterYear]   = useState('');
  const [sortBy,       setSortBy]       = useState('newest');
  const [showFilters,  setShowFilters]  = useState(false);
  const [page,         setPage]         = useState(1);
  const [compareIds,   setCompareIds]   = useState([]);

  const uniqueYears = [...new Set(POLICIES.map((p) => String(p.year)))].sort((a, b) => b - a);
  const hasFilters  = search || filterLevel || filterState || filterCat || filterType || filterStatus || filterYear;

  const resetAll = () => {
    setSearch(''); setFilterLevel(''); setFilterState('');
    setFilterCat(''); setFilterType(''); setFilterStatus('');
    setFilterYear(''); setPage(1);
  };

  const categoryCounts = useMemo(() =>
    Object.fromEntries(POLICY_CATEGORY_LIST.map((c) => [c, POLICIES.filter((p) => p.category === c).length])),
    []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = POLICIES.filter((p) => {
      if (filterLevel  && p.governmentLevel !== filterLevel)  return false;
      if (filterState  && p.state           !== filterState)  return false;
      if (filterCat    && p.category        !== filterCat)    return false;
      if (filterType   && p.policyType      !== filterType)   return false;
      if (filterStatus && p.status          !== filterStatus) return false;
      if (filterYear   && String(p.year)    !== filterYear)   return false;
      if (q && ![p.name, p.ministry, p.department, p.category,
          p.policyType, p.shortDescription, p.state || '',
          ...(p.tags || [])].join(' ').toLowerCase().includes(q)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'newest')    return b.year - a.year;
      if (sortBy === 'oldest')    return a.year - b.year;
      if (sortBy === 'name_asc')  return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'category')  return a.category.localeCompare(b.category);
      if (sortBy === 'level')     return a.governmentLevel.localeCompare(b.governmentLevel);
      return 0;
    });
    return list;
  }, [search, filterLevel, filterState, filterCat, filterType, filterStatus, filterYear, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const maxCatCount  = Math.max(...POL_BY_CATEGORY.map((d) => d.count));
  const maxYearCount = Math.max(...POL_BY_YEAR.map((d) => d.count));

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <div className="page-header">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-primary-300 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Government Policies Repository</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-display font-bold">
                  Government Policies & Programmes
                </h1>
                <DemoBadge text="Demo Repository" />
              </div>
              <p className="text-primary-200 text-sm sm:text-base max-w-2xl leading-relaxed">
                Discover government policies, laws, schemes, rules, and programmes shaping land
                governance across India. All prototype records are clearly labelled as demo content.
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 text-sm text-primary-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {POLICIES.length} Policies
            </div>
          </div>

          {/* Search row */}
          <div className="mt-6 flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
              <input
                type="text" value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search policies, laws, schemes, departments…"
                className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-200 hover:text-white text-xl">×</button>
              )}
            </div>
            <button
              onClick={() => setShowFilters((p) => !p)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all flex-shrink-0 ${
                showFilters ? 'bg-white text-primary-800 border-white' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
              }`}
            >
              ⚙️ Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-amber-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── SUMMARY STATS ─────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {POL_SUMMARY_STATS.map((s) => (
            <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} color={s.color} />
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── CATEGORY NAV ─────────────────────────────────────────── */}
        <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
          <div className="flex gap-2 pb-1">
            <CategoryPill
              cat="All Categories" active={!filterCat}
              count={POLICIES.length}
              onClick={() => { setFilterCat(''); setPage(1); }}
            />
            {POLICY_CATEGORY_LIST.map((cat) => (
              <CategoryPill
                key={cat} cat={cat} active={filterCat === cat}
                count={categoryCounts[cat]}
                onClick={() => { setFilterCat(filterCat === cat ? '' : cat); setPage(1); }}
              />
            ))}
          </div>
        </div>

        {/* ── FILTER PANEL ─────────────────────────────────────────── */}
        {showFilters && (
          <div className="card p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                Advanced Filters
              </h3>
              {hasFilters && (
                <button onClick={resetAll} className="text-sm text-red-500 hover:text-red-700 font-medium">
                  ✕ Reset All
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">Government Level</label>
                <select value={filterLevel} onChange={(e) => { setFilterLevel(e.target.value); setPage(1); }} className="input-field text-sm py-2">
                  <option value="">All Levels</option>
                  {GOVT_LEVEL_LIST.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">State</label>
                <select value={filterState} onChange={(e) => { setFilterState(e.target.value); setPage(1); }} className="input-field text-sm py-2">
                  <option value="">All States</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">Policy Category</label>
                <select value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }} className="input-field text-sm py-2">
                  <option value="">All Categories</option>
                  {POLICY_CATEGORY_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">Policy Type</label>
                <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }} className="input-field text-sm py-2">
                  <option value="">All Types</option>
                  {POLICY_TYPE_LIST.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">Status</label>
                <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="input-field text-sm py-2">
                  <option value="">All Statuses</option>
                  {POLICY_STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">Year</label>
                <select value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setPage(1); }} className="input-field text-sm py-2">
                  <option value="">All Years</option>
                  {uniqueYears.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field text-sm py-2">
                  {POLICY_SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={resetAll} className="btn-secondary w-full text-sm py-2">Reset Filters</button>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS BAR ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-gray-500">
            {filtered.length === POLICIES.length
              ? `Showing all ${filtered.length} policies`
              : `${filtered.length} of ${POLICIES.length} policies`}
            {search && <span className="ml-1">matching "<strong className="text-gray-800 dark:text-gray-200">{search}</strong>"</span>}
          </p>
          <div className="flex items-center gap-3">
            {compareIds.length > 0 && (
              <span className="text-xs text-primary-600 font-medium">
                {compareIds.length} selected for comparison
              </span>
            )}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Sort:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="input-field text-xs py-1.5 w-auto">
                {POLICY_SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {hasFilters && (
              <button onClick={resetAll} className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                Clear filters →
              </button>
            )}
          </div>
        </div>

        {/* ── COMPARISON PANEL ─────────────────────────────────────── */}
        {compareIds.length >= 2 && (
          <ComparePanel
            ids={compareIds}
            onClear={() => setCompareIds([])}
            onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
          />
        )}
        {compareIds.length === 1 && (
          <div className="card p-4 border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/10 text-sm text-primary-700 dark:text-primary-300">
            ⚖️ Select 1 more policy to compare (max 3). Click the checkbox on any card.
          </div>
        )}

        {/* ── POLICY GRID ──────────────────────────────────────────── */}
        <section>
          {paginated.length === 0 ? (
            <div className="card p-14 text-center">
              <p className="text-5xl mb-3">📜</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No policies found</p>
              <p className="text-sm text-gray-500 mt-1 mb-4">Try adjusting your search terms or filters.</p>
              <button onClick={resetAll} className="btn-primary">Reset Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map((p) => (
                <PolicyCard key={p.id} policy={p} compareIds={compareIds} onToggleCompare={toggleCompare} />
              ))}
            </div>
          )}
        </section>

        {/* ── PAGINATION ───────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} policies
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="btn-secondary text-xs py-2 px-3 disabled:opacity-40">← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    n === page ? 'bg-primary-700 text-white' : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}>{n}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="btn-secondary text-xs py-2 px-3 disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Repository Analytics</h2>
            <DemoBadge text="Demo Stats" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* By Category */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">By Category</h3>
              <div className="space-y-2.5">
                {POL_BY_CATEGORY.map((d) => (
                  <HBar key={d.category} label={d.category} value={d.count} max={maxCatCount} color="bg-primary-500" />
                ))}
              </div>
            </div>

            {/* Central vs State Donut */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Central vs State</h3>
              <div className="flex items-center gap-4">
                <DonutChart slices={POL_BY_LEVEL} size={110} />
                <div className="flex-1 space-y-3">
                  {POL_BY_LEVEL.map((s) => (
                    <div key={s.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                          {s.label}
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-white">{s.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div className="h-1.5 rounded-full" style={{ width: `${(s.value / POLICIES.length) * 100}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* By Policy Type Donut */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">By Policy Type</h3>
              <div className="flex items-center gap-3">
                <DonutChart slices={POL_BY_TYPE} size={110} />
                <div className="flex-1 space-y-1.5">
                  {POL_BY_TYPE.map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      <span className="text-gray-600 dark:text-gray-400 truncate">{s.label}</span>
                      <span className="ml-auto font-semibold text-gray-800 dark:text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* By Year */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">By Year</h3>
              <div className="flex items-end gap-1.5 h-24 mt-2">
                {POL_BY_YEAR.map((d) => (
                  <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{d.count}</span>
                    <div className="w-full rounded-t-sm bg-primary-500 transition-all"
                      style={{ height: `${(d.count / maxYearCount) * 56}px` }} />
                    <span className="text-xs text-gray-400" style={{ fontSize: '9px' }}>{d.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── DEMO NOTICE ───────────────────────────────────────────── */}
        <div className="card p-5 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10">
          <div className="flex gap-3">
            <span className="text-amber-500 text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Demo Repository Notice</p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                All policy records in this repository are <strong>prototype demonstration data</strong> for
                interface development only. They must not be interpreted as verified official government policy
                information. Some records reference real policy names to make the interface realistic, but ALL
                metadata, provisions, dates, and descriptions are demo content and must be verified against
                official government sources before use.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
