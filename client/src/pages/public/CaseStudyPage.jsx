import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DemoBadge from '../../components/common/DemoBadge';
import StatCard from '../../components/common/StatCard';
import {
  CASE_STUDIES,
  CS_LAND_TYPES,
  CS_PROBLEM_CATEGORIES,
  CS_STUDY_TYPES,
  CS_EVIDENCE_LEVELS,
  CS_SUMMARY_STATS,
  CS_BY_STATE,
  CS_BY_LAND_TYPE,
  CS_BY_CATEGORY,
  CS_BY_YEAR,
} from '../../utils/caseStudyDemoData';

// ─── Colour palette keyed by landType ────────────────────────────────────────
const LAND_TYPE_COLORS = {
  'Agricultural Land': { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  'Urban Land':        { bg: 'bg-indigo-50 dark:bg-indigo-900/20',   text: 'text-indigo-700 dark:text-indigo-300',   border: 'border-indigo-200 dark:border-indigo-800',   dot: 'bg-indigo-500' },
  'Forest Land':       { bg: 'bg-teal-50 dark:bg-teal-900/20',       text: 'text-teal-700 dark:text-teal-300',       border: 'border-teal-200 dark:border-teal-800',       dot: 'bg-teal-600' },
  'Rural Land':        { bg: 'bg-amber-50 dark:bg-amber-900/20',     text: 'text-amber-700 dark:text-amber-300',     border: 'border-amber-200 dark:border-amber-800',     dot: 'bg-amber-500' },
  'Community Land':    { bg: 'bg-orange-50 dark:bg-orange-900/20',   text: 'text-orange-700 dark:text-orange-300',   border: 'border-orange-200 dark:border-orange-800',   dot: 'bg-orange-500' },
  'Government Land':   { bg: 'bg-blue-50 dark:bg-blue-900/20',       text: 'text-blue-700 dark:text-blue-300',       border: 'border-blue-200 dark:border-blue-800',       dot: 'bg-blue-500' },
  'Mixed Land Use':    { bg: 'bg-purple-50 dark:bg-purple-900/20',   text: 'text-purple-700 dark:text-purple-300',   border: 'border-purple-200 dark:border-purple-800',   dot: 'bg-purple-500' },
};
const ltc = (lt) => LAND_TYPE_COLORS[lt] || LAND_TYPE_COLORS['Mixed Land Use'];

// ─── Inline horizontal bar ────────────────────────────────────────────────────
const HBar = ({ value, max, color = 'bg-primary-500', label, count }) => (
  <div className="flex items-center gap-2 text-xs">
    <span className="w-32 truncate text-gray-600 dark:text-gray-400 flex-shrink-0">{label}</span>
    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
      <div className={`h-2 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
    </div>
    <span className="w-4 text-right font-semibold text-gray-700 dark:text-gray-300">{count}</span>
  </div>
);

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

// ─── Evidence level badge ─────────────────────────────────────────────────────
const EvidenceBadge = ({ level }) => {
  const map = {
    'Demo / Prototype':   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'Verified Source':    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Published Study':    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'Government Report':  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    'Academic Research':  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'Institutional Report':'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  };
  return <span className={`badge text-xs ${map[level] || 'bg-gray-100 text-gray-600'}`}>{level}</span>;
};

// ─── Case Study Card ──────────────────────────────────────────────────────────
const CaseStudyCard = ({ cs }) => {
  const c = ltc(cs.landType);
  return (
    <div className={`card-hover flex flex-col border-t-4 ${c.border} overflow-hidden`}>
      {/* Top meta row */}
      <div className="p-5 pb-3 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <span className={`badge text-xs ${c.bg} ${c.text}`}>{cs.landType}</span>
          <div className="flex items-center gap-1.5">
            {cs.isDemoData && <DemoBadge />}
            <EvidenceBadge level={cs.evidenceLevel} />
          </div>
        </div>

        {/* Title */}
        <Link to={`/case-studies/${cs.id}`}>
          <h3 className="font-display font-bold text-gray-900 dark:text-white text-base leading-snug hover:text-primary-700 dark:hover:text-primary-400 transition-colors line-clamp-2">
            {cs.title}
          </h3>
        </Link>

        {/* Location */}
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <span>📍</span>
          <span>{cs.state} — {cs.district}</span>
        </p>

        {/* Category + type chips */}
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-xs font-medium">
            {cs.problemCategory}
          </span>
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
            {cs.caseStudyType}
          </span>
        </div>

        {/* Short description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 flex-1">
          {cs.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {cs.tags.slice(0, 4).map((t) => (
            <span key={t} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700 rounded-full text-xs">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
        <div className="text-xs text-gray-500 space-y-0.5">
          <p className="font-medium text-gray-700 dark:text-gray-300">Year: {cs.year}</p>
          <p className={`font-medium ${cs.isDemoData ? 'text-amber-600' : 'text-emerald-600'}`}>
            {cs.isDemoData ? '🟡 Demo Case Study' : '✅ Verified'}
          </p>
        </div>
        <Link
          to={`/case-studies/${cs.id}`}
          className="btn-primary text-xs py-2 px-4"
        >
          View Case Study →
        </Link>
      </div>
    </div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyResults = ({ onReset }) => (
  <div className="card p-14 text-center col-span-full">
    <p className="text-5xl mb-3">🔍</p>
    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No case studies found</p>
    <p className="text-sm text-gray-500 mt-1 mb-4">Try adjusting your search terms or filters.</p>
    <button onClick={onReset} className="btn-primary">Reset Filters</button>
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CaseStudyPage() {
  const [search,      setSearch]      = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterDist,  setFilterDist]  = useState('');
  const [filterLand,  setFilterLand]  = useState('');
  const [filterCat,   setFilterCat]   = useState('');
  const [filterType,  setFilterType]  = useState('');
  const [filterEvid,  setFilterEvid]  = useState('');
  const [filterYear,  setFilterYear]  = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const uniqueStates    = [...new Set(CASE_STUDIES.map((c) => c.state))].sort();
  const uniqueDistricts = [...new Set(
    (filterState ? CASE_STUDIES.filter((c) => c.state === filterState) : CASE_STUDIES).map((c) => c.district)
  )].sort();
  const uniqueYears = [...new Set(CASE_STUDIES.map((c) => String(c.year)))].sort((a, b) => b - a);

  const hasFilters = search || filterState || filterDist || filterLand || filterCat || filterType || filterEvid || filterYear;

  const resetAll = () => {
    setSearch(''); setFilterState(''); setFilterDist('');
    setFilterLand(''); setFilterCat(''); setFilterType('');
    setFilterEvid(''); setFilterYear('');
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return CASE_STUDIES.filter((cs) => {
      if (filterState && cs.state          !== filterState) return false;
      if (filterDist  && cs.district       !== filterDist)  return false;
      if (filterLand  && cs.landType       !== filterLand)  return false;
      if (filterCat   && cs.problemCategory !== filterCat)  return false;
      if (filterType  && cs.caseStudyType  !== filterType)  return false;
      if (filterEvid  && cs.evidenceLevel  !== filterEvid)  return false;
      if (filterYear  && String(cs.year)   !== filterYear)  return false;
      if (q && ![cs.title, cs.state, cs.district, cs.landType,
          cs.problemCategory, cs.shortDescription, ...(cs.tags || [])]
        .join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, filterState, filterDist, filterLand, filterCat, filterType, filterEvid, filterYear]);

  const maxStateCount = Math.max(...CS_BY_STATE.map((d) => d.count));
  const maxCatCount   = Math.max(...CS_BY_CATEGORY.map((d) => d.count));
  const maxYearCount  = Math.max(...CS_BY_YEAR.map((d) => d.count));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <div className="page-header">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-primary-300 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Case Studies Repository</span>
          </div>

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-display font-bold">
                  Land Governance Case Studies
                </h1>
                <DemoBadge text="Demo Repository" />
              </div>
              <p className="text-primary-200 text-sm sm:text-base max-w-2xl leading-relaxed">
                Explore real-world land governance challenges, interventions, evidence, outcomes,
                and lessons from different regions of India. All prototype case studies are clearly
                labelled as demo content.
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 text-sm text-primary-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {CASE_STUDIES.length} Case Studies
            </div>
          </div>

          {/* Search */}
          <div className="mt-6 flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search case studies, states, districts, land types, keywords…"
                className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-200 hover:text-white text-xl">×</button>
              )}
            </div>
            <button
              onClick={() => setShowFilters((p) => !p)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${showFilters ? 'bg-white text-primary-800 border-white' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'}`}
            >
              ⚙️ Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-amber-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── SUMMARY STATS ─────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CS_SUMMARY_STATS.map((s) => (
            <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} color={s.color} />
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-8">

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
              {/* Geographic */}
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">State</label>
                <select value={filterState} onChange={(e) => { setFilterState(e.target.value); setFilterDist(''); }}
                  className="input-field text-sm py-2">
                  <option value="">All States</option>
                  {uniqueStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">District</label>
                <select value={filterDist} onChange={(e) => setFilterDist(e.target.value)}
                  className="input-field text-sm py-2">
                  <option value="">All Districts</option>
                  {uniqueDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Land */}
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">Land Type</label>
                <select value={filterLand} onChange={(e) => setFilterLand(e.target.value)}
                  className="input-field text-sm py-2">
                  <option value="">All Land Types</option>
                  {CS_LAND_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">Problem Category</label>
                <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
                  className="input-field text-sm py-2">
                  <option value="">All Categories</option>
                  {CS_PROBLEM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Study */}
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">Case Study Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="input-field text-sm py-2">
                  <option value="">All Types</option>
                  {CS_STUDY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">Evidence Level</label>
                <select value={filterEvid} onChange={(e) => setFilterEvid(e.target.value)}
                  className="input-field text-sm py-2">
                  <option value="">All Evidence Levels</option>
                  {CS_EVIDENCE_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-400">Study Year</label>
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}
                  className="input-field text-sm py-2">
                  <option value="">All Years</option>
                  {uniqueYears.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {/* Apply / Reset buttons */}
              <div className="flex items-end">
                <button onClick={resetAll} className="btn-secondary w-full text-sm py-2">
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS BAR ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-gray-500">
            {filtered.length === CASE_STUDIES.length
              ? `Showing all ${filtered.length} case studies`
              : `${filtered.length} of ${CASE_STUDIES.length} case studies`}
            {search && <span className="ml-1">matching "<strong className="text-gray-800 dark:text-gray-200">{search}</strong>"</span>}
          </p>
          {hasFilters && (
            <button onClick={resetAll} className="text-sm text-primary-600 hover:text-primary-800 font-medium">
              Clear all filters →
            </button>
          )}
        </div>

        {/* ── CASE STUDY GRID ───────────────────────────────────────── */}
        <section>
          {filtered.length === 0 ? (
            <EmptyResults onReset={resetAll} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((cs) => <CaseStudyCard key={cs.id} cs={cs} />)}
            </div>
          )}
        </section>

        {/* ── ANALYTICS SECTION ─────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Repository Analytics</h2>
            <DemoBadge text="Demo Stats" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* By State */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">By State</h3>
              <div className="space-y-2.5">
                {CS_BY_STATE.map((d) => (
                  <HBar key={d.state} label={d.state} value={d.count} max={maxStateCount} count={d.count} color="bg-primary-500" />
                ))}
              </div>
            </div>

            {/* By Land Type – Donut */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">By Land Type</h3>
              <div className="flex items-center gap-4">
                <DonutChart slices={CS_BY_LAND_TYPE} size={110} />
                <div className="flex-1 space-y-1.5">
                  {CS_BY_LAND_TYPE.map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      <span className="text-gray-600 dark:text-gray-400 truncate">{s.label}</span>
                      <span className="ml-auto font-semibold text-gray-800 dark:text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* By Category */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">By Problem Category</h3>
              <div className="space-y-2.5">
                {CS_BY_CATEGORY.map((d) => (
                  <HBar key={d.category} label={d.category} value={d.count} max={maxCatCount} count={d.count} color="bg-emerald-500" />
                ))}
              </div>
            </div>

            {/* By Year */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">By Year</h3>
              <div className="flex items-end gap-2 h-24 mt-2">
                {CS_BY_YEAR.map((d) => (
                  <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{d.count}</span>
                    <div className="w-full rounded-t-sm bg-primary-500 transition-all"
                      style={{ height: `${(d.count / maxYearCount) * 60}px` }} />
                    <span className="text-xs text-gray-400">{d.year}</span>
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
                All case studies in this repository are <strong>prototype demonstration examples</strong> created
                to illustrate the Land Governance Case Studies module. They must not be interpreted as official
                government reports or verified field studies. Verified case studies will be added as authorised
                sources are connected.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
