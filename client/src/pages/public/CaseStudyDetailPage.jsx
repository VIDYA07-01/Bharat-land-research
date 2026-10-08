import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import DemoBadge from '../../components/common/DemoBadge';
import { getCaseStudy, CASE_STUDIES } from '../../utils/caseStudyDemoData';

// ─── Leaflet (already used by project's GISMapPage) ───────────────────────────
let L;
try { L = require('leaflet'); } catch (_) { L = null; }

// ─── Colour helpers ───────────────────────────────────────────────────────────
const LAND_TYPE_COLORS = {
  'Agricultural Land': { badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300', header: 'from-emerald-900 via-emerald-800 to-emerald-700' },
  'Urban Land':        { badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',     header: 'from-indigo-900 via-indigo-800 to-indigo-700'   },
  'Forest Land':       { badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',             header: 'from-teal-900 via-teal-800 to-teal-700'         },
  'Rural Land':        { badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',         header: 'from-amber-900 via-amber-800 to-amber-700'       },
  'Community Land':    { badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',     header: 'from-orange-900 via-orange-800 to-orange-700'    },
  'Government Land':   { badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',             header: 'from-blue-900 via-blue-800 to-blue-700'           },
  'Mixed Land Use':    { badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',     header: 'from-primary-900 via-primary-800 to-primary-700' },
};
const ltc = (lt) => LAND_TYPE_COLORS[lt] || LAND_TYPE_COLORS['Mixed Land Use'];

const OUTCOME_COLORS = {
  blue:   'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  green:  'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
  orange: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
  teal:   'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300',
};

const STAKEHOLDER_COLORS = {
  Government:   'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Institutional:'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Community:    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  Private:      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ id, icon, title, badge, children }) => (
  <section id={id} className="card overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
      <span className="text-xl">{icon}</span>
      <h2 className="font-display font-bold text-gray-900 dark:text-white text-base">{title}</h2>
      {badge && <span className="ml-auto">{badge}</span>}
    </div>
    <div className="p-6">{children}</div>
  </section>
);

// ─── Inline mini-bar ─────────────────────────────────────────────────────────
const MiniBar = ({ value, max, color = 'bg-primary-500' }) => (
  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
    <div className={`h-2 rounded-full ${color}`}
      style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
  </div>
);

// ─── SVG Donut ────────────────────────────────────────────────────────────────
const DonutChart = ({ slices, size = 130 }) => {
  const r = 52, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let cum = 0;
  const total = slices.reduce((s, d) => s + d.value, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg] flex-shrink-0">
      {slices.map((s, i) => {
        const pct = s.value / total;
        const sda = `${pct * circ} ${circ}`;
        const sdo = -cum * circ;
        cum += pct;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth={22} strokeDasharray={sda} strokeDashoffset={sdo} />;
      })}
    </svg>
  );
};

// ─── GIS Map component ────────────────────────────────────────────────────────
function GISMap({ gisInfo }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!L || !mapRef.current || instanceRef.current) return;
    const map = L.map(mapRef.current, {
      center: gisInfo.center,
      zoom: gisInfo.zoom,
      zoomControl: true,
      scrollWheelZoom: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);
    const icon = L.divIcon({
      html: `<div style="background:#1d4ed8;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    });
    L.marker(gisInfo.center, { icon })
      .addTo(map)
      .bindPopup(`<b>📍 ${gisInfo.center[0].toFixed(4)}, ${gisInfo.center[1].toFixed(4)}</b><br/><span style="color:#f59e0b;font-size:11px;">⚠️ Demo Location</span>`)
      .openPopup();
    instanceRef.current = map;
    return () => { map.remove(); instanceRef.current = null; };
  }, [gisInfo]);

  if (!L) {
    return (
      <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
        🗺️ Map unavailable — Leaflet not loaded
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {gisInfo.isDemo && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
          <span>⚠️</span>
          <span>{gisInfo.note}</span>
        </div>
      )}
      <div ref={mapRef} className="w-full h-72 rounded-xl z-0 border border-gray-200 dark:border-gray-700 overflow-hidden" />
      {/* Layer legend */}
      {gisInfo.layers?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {gisInfo.layers.map((layer) => (
            <span key={layer} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs border border-gray-200 dark:border-gray-700">
              🗂️ {layer}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Inline chart renderer ────────────────────────────────────────────────────
function InlineChart({ chart }) {
  if (!chart) return null;
  if (chart.type === 'donut') {
    const total = chart.data.reduce((s, d) => s + d.value, 0);
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{chart.title}</p>
        <div className="flex items-center gap-5">
          <DonutChart slices={chart.data} size={120} />
          <div className="flex-1 space-y-1.5">
            {chart.data.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="text-gray-600 dark:text-gray-400 truncate">{s.label}</span>
                <span className="ml-auto font-semibold text-gray-800 dark:text-white">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400">Total sample: {total} | Demo data</p>
      </div>
    );
  }
  if (chart.type === 'bar') {
    const vals = chart.data.map((d) => Math.abs(d.value));
    const max = Math.max(...vals);
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{chart.title}</p>
        <div className="space-y-2">
          {chart.data.map((d) => (
            <div key={d.label} className="flex items-center gap-3 text-xs">
              <span className="w-28 text-gray-600 dark:text-gray-400 text-right flex-shrink-0 truncate">{d.label}</span>
              <MiniBar value={Math.abs(d.value)} max={max} color={d.value < 0 ? 'bg-red-400' : 'bg-primary-500'} />
              <span className="font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0 w-10 text-right">
                {d.value}{typeof d.value === 'number' && Math.abs(d.value) <= 100 ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">Demo data</p>
      </div>
    );
  }
  return null;
}

// ─── Section nav items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',       icon: '📋' },
  { id: 'location',      label: 'Location',       icon: '📍' },
  { id: 'problem',       label: 'Problem',        icon: '⚠️' },
  { id: 'background',    label: 'Background',     icon: '📜' },
  { id: 'evidence',      label: 'Evidence',       icon: '🔬' },
  { id: 'gis',           label: 'GIS Map',        icon: '🗺️' },
  { id: 'analysis',      label: 'Analysis',       icon: '📊' },
  { id: 'interventions', label: 'Interventions',  icon: '🛠️' },
  { id: 'outcomes',      label: 'Outcomes',       icon: '✅' },
  { id: 'lessons',       label: 'Lessons',        icon: '💡' },
  { id: 'stakeholders',  label: 'Stakeholders',   icon: '👥' },
  { id: 'timeline',      label: 'Timeline',       icon: '📅' },
  { id: 'sources',       label: 'Sources',        icon: '📚' },
  { id: 'related',       label: 'Related',        icon: '🔗' },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DETAIL PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function CaseStudyDetailPage() {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState('overview');
  const cs = getCaseStudy(id);
  const c = cs ? ltc(cs.landType) : ltc('Mixed Land Use');

  // Track active section via scroll
  useEffect(() => {
    const handler = () => {
      for (const item of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(item.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!cs) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">📚</p>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Case study not found</h2>
          <Link to="/case-studies" className="btn-primary">← Back to Case Studies</Link>
        </div>
      </div>
    );
  }

  const DATASET_LABELS = {
    'state-wise':     '🗺️ State-wise Land Data',
    'land-use':       '🌾 Land Use Dataset',
    'land-ownership': '🏛️ Land Ownership Dataset',
    'land-records':   '📋 Land Records Dataset',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <div className={`bg-gradient-to-r ${c.header} text-white py-12 px-4`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/case-studies" className="hover:text-white transition-colors">Case Studies</Link>
            <span>/</span>
            <span className="text-white truncate">{cs.id}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Left: title block */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`badge text-xs ${c.badge}`}>{cs.landType}</span>
                <span className="badge bg-white/20 text-white text-xs">{cs.problemCategory}</span>
                <span className="badge bg-white/20 text-white text-xs">{cs.caseStudyType}</span>
                {cs.isDemoData && <DemoBadge text="Demo Case Study" />}
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold leading-snug mb-3">{cs.title}</h1>
              <p className="text-white/75 text-sm sm:text-base max-w-2xl leading-relaxed">{cs.shortDescription}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {cs.tags.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 bg-white/10 text-white/80 rounded text-xs border border-white/20">{t}</span>
                ))}
              </div>
            </div>

            {/* Right: meta panel */}
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 min-w-[220px] space-y-2 text-sm">
              {[
                ['📍', 'Location', `${cs.state} – ${cs.district}`],
                ['🗓️', 'Year', cs.year],
                ['🔬', 'Evidence', cs.evidenceLevel],
                ['📊', 'Status', cs.status],
                ['🆔', 'Case ID', cs.id],
              ].map(([icon, label, val]) => (
                <div key={label} className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span className="text-white/50">{label}:</span>
                  <span className="font-medium text-white">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTION BAR ──────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-16 z-30">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Link to="/case-studies" className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0">
            ← All Cases
          </Link>
          <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-500 hover:text-primary-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="btn-secondary text-xs py-1.5 px-3">📥 Download</button>
            <button className="btn-primary text-xs py-1.5 px-3">🔖 Bookmark</button>
          </div>
        </div>
      </div>

      {/* ── DEMO ALERT ───────────────────────────────────────────────── */}
      {cs.isDemoData && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-300 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-300">
            <span className="text-lg flex-shrink-0">🟡</span>
            <div>
              <strong>Demo Case Study:</strong> This case study is a prototype example created for demonstration
              purposes only. It must not be interpreted as an official government report or verified field study.
              All figures, organisations, and findings are sample/illustrative data.
            </div>
          </div>
        </div>
      )}

      {/* ── SECTIONS ────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── 1. OVERVIEW ──────────────────────────────────────────── */}
        <Section id="overview" icon="📋" title="Case Study Overview">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'State',            value: cs.state },
              { label: 'District',         value: cs.district },
              { label: 'Land Type',        value: cs.landType },
              { label: 'Problem Category', value: cs.problemCategory },
              { label: 'Study Type',       value: cs.caseStudyType },
              { label: 'Evidence Level',   value: cs.evidenceLevel },
              { label: 'Study Year',       value: cs.year },
              { label: 'Status',           value: cs.status },
              { label: 'Case ID',          value: cs.id },
              { label: 'Location',         value: cs.location },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white leading-snug">{value}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 2. LOCATION ──────────────────────────────────────────── */}
        <Section id="location" icon="📍" title="Location">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[
                ['State',                cs.location_detail.state],
                ['District',             cs.location_detail.district],
                ['Taluk / Block',        cs.location_detail.taluk],
                ['Village / Area',       cs.location_detail.village],
                ['Geographic Coverage',  cs.location_detail.geographicCoverage],
                ['Coordinates (Demo)',   cs.location_detail.coordinates
                  ? `${cs.location_detail.coordinates.lat}° N, ${cs.location_detail.coordinates.lng}° E`
                  : 'Not available'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                  <span className="text-gray-400 w-40 flex-shrink-0">{label}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/10 rounded-xl p-4 text-sm space-y-2">
              <p className="font-semibold text-primary-800 dark:text-primary-300 flex items-center gap-2">
                <span>🗺️</span> Geographic Context
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{cs.location_detail.geographicCoverage}</p>
              {cs.isDemoData && (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠️ Coordinates and geographic details are demo references only.
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* ── 3. PROBLEM ───────────────────────────────────────────── */}
        <Section id="problem" icon="⚠️" title="Land-Related Problem">
          <div className="space-y-5">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="font-semibold text-red-800 dark:text-red-300 text-sm mb-1">Problem Summary</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{cs.problem.summary}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '👥', label: 'Who Was Affected',   text: cs.problem.affected },
                { icon: '📍', label: 'Where',              text: cs.problem.location },
                { icon: '❗', label: 'Why Important',      text: cs.problem.importance },
              ].map(({ icon, label, text }) => (
                <div key={label} className="card p-4 space-y-1">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span>{icon}</span>{label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Major Challenges</p>
              <ul className="space-y-2">
                {cs.problem.challenges.map((ch, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">▸</span>
                    {ch}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ── 4. BACKGROUND ────────────────────────────────────────── */}
        <Section id="background" icon="📜" title="Background">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { icon: '🌍', label: 'Regional Context',          text: cs.background.regional },
              { icon: '🌱', label: 'Land Characteristics',      text: cs.background.landCharacteristics },
              { icon: '🕰️', label: 'Historical Context',        text: cs.background.historical },
              { icon: '🏛️', label: 'Administrative Context',    text: cs.background.administrative },
              { icon: '💰', label: 'Socio-Economic Context',    text: cs.background.socioEconomic },
              { icon: '⚙️', label: 'Existing Land Practices',   text: cs.background.existingPractices },
            ].map(({ icon, label, text }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-1">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>{icon}</span>{label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl p-4 text-sm">
            <p className="font-semibold text-primary-800 dark:text-primary-300 mb-1">
              🔑 Why This Case Became Important
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{cs.background.whyImportant}</p>
          </div>
        </Section>

        {/* ── 5. EVIDENCE ──────────────────────────────────────────── */}
        <Section id="evidence" icon="🔬" title="Available Evidence"
          badge={<DemoBadge text="Demo Evidence" />}>
          <div className="space-y-4">
            {cs.evidence.map((ev, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">{ev.type}</p>
                  <span className={`badge text-xs ${ev.verificationStatus.startsWith('Demo')
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                    {ev.verificationStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    ['Source',   ev.source],
                    ['Year',     ev.year],
                    ['Coverage', ev.coverage],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">{val}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{ev.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 6. GIS MAP ───────────────────────────────────────────── */}
        <Section id="gis" icon="🗺️" title="GIS Map"
          badge={cs.gisInfo.isDemo ? <DemoBadge text="Demo Map" /> : null}>
          {cs.gisInfo.available
            ? <GISMap gisInfo={cs.gisInfo} />
            : <p className="text-sm text-gray-500">GIS data not available for this case study.</p>
          }
        </Section>

        {/* ── 7. ANALYSIS ──────────────────────────────────────────── */}
        <Section id="analysis" icon="📊" title="Analysis"
          badge={<DemoBadge text="Demo Analysis" />}>
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              {cs.analysis.summary}
            </div>

            {/* Key findings */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Findings</p>
              <ul className="space-y-2">
                {cs.analysis.findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-primary-500 mt-0.5 flex-shrink-0">▸</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Charts */}
            {cs.analysis.charts?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cs.analysis.charts.map((chart, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <InlineChart chart={chart} />
                  </div>
                ))}
              </div>
            )}

            {/* Data gaps */}
            {cs.analysis.dataGaps?.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2">⚠️ Data Gaps</p>
                <ul className="space-y-1">
                  {cs.analysis.dataGaps.map((g, i) => (
                    <li key={i} className="text-sm text-orange-700 dark:text-orange-400 flex items-start gap-2">
                      <span>–</span>{g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>

        {/* ── 8. INTERVENTIONS ─────────────────────────────────────── */}
        <Section id="interventions" icon="🛠️" title="Actions & Interventions">
          <div className="space-y-4">
            {cs.interventions.map((iv, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">{iv.name}</p>
                  <span className="badge text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    {iv.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>👤 {iv.stakeholder}</span>
                  <span>📅 {iv.period}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{iv.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 9. OUTCOMES ──────────────────────────────────────────── */}
        <Section id="outcomes" icon="✅" title="Results & Outcomes"
          badge={<DemoBadge text="Demo Indicators" />}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {cs.outcomes.map((o, i) => (
              <div key={i} className={`rounded-xl p-4 text-center ${OUTCOME_COLORS[o.color] || OUTCOME_COLORS.blue}`}>
                <div className="text-2xl mb-1">{o.icon}</div>
                <p className="text-lg font-bold">{o.value}</p>
                <p className="text-xs mt-0.5 opacity-80">{o.indicator}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400">
            ⚠️ All outcome indicators are demo/sample values for illustration purposes only.
          </p>
        </Section>

        {/* ── 10. LESSONS LEARNED ──────────────────────────────────── */}
        <Section id="lessons" icon="💡" title="Lessons Learned">
          <div className="space-y-3">
            {cs.lessonsLearned.map((l, i) => {
              const styles = {
                'What Worked':           'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300',
                'Challenge':             'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/10 text-red-700 dark:text-red-300',
                'Institutional Lesson':  'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300',
                'Technology Lesson':     'border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-300',
                'Community Lesson':      'border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/10 text-orange-700 dark:text-orange-300',
                'Data Limitation':       'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300',
                'Gender Lesson':         'border-pink-300 bg-pink-50 dark:border-pink-800 dark:bg-pink-900/10 text-pink-700 dark:text-pink-300',
                'Improvement':           'border-purple-300 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300',
                'Data Lesson':           'border-teal-300 bg-teal-50 dark:border-teal-800 dark:bg-teal-900/10 text-teal-700 dark:text-teal-300',
              };
              const cls = styles[l.category] || 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300';
              return (
                <div key={i} className={`border-l-4 rounded-r-xl p-4 ${cls}`}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">{l.category}</p>
                  <p className="text-sm leading-relaxed">{l.text}</p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── 11. STAKEHOLDERS ─────────────────────────────────────── */}
        <Section id="stakeholders" icon="👥" title="Stakeholders">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cs.stakeholders.map((s, i) => (
              <div key={i} className="flex items-start gap-3 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                  {s.type === 'Government' ? '🏛️' : s.type === 'Community' ? '👥' : s.type === 'Institutional' ? '🏫' : '🤝'}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white text-sm leading-snug">{s.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.role}</p>
                  <span className={`badge text-xs mt-1 ${STAKEHOLDER_COLORS[s.type] || 'bg-gray-100 text-gray-600'}`}>
                    {s.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 12. TIMELINE ─────────────────────────────────────────── */}
        <Section id="timeline" icon="📅" title="Timeline">
          <div className="relative pl-6 border-l-2 border-primary-200 dark:border-primary-800 space-y-6">
            {cs.timeline.map((t, i) => (
              <div key={i} className="relative">
                {/* Dot */}
                <span className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-primary-600 border-2 border-white dark:border-gray-900 flex-shrink-0" />
                <div className="ml-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">{t.year}</span>
                    <span className="font-semibold text-gray-800 dark:text-white text-sm">{t.event}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t.description}</p>
                </div>
              </div>
            ))}
            {/* End dot */}
            <span className="absolute -left-[9px] bottom-0 w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
        </Section>

        {/* ── 13. SOURCES ──────────────────────────────────────────── */}
        <Section id="sources" icon="📚" title="Sources & References"
          badge={<DemoBadge text="Demo References" />}>
          <div className="space-y-3">
            {cs.sources.map((s, i) => (
              <div key={i} className="flex items-start gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <span className="text-2xl flex-shrink-0">📄</span>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{s.title}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>🏛️ {s.org}</span>
                    <span>📅 {s.year}</span>
                    <span>📂 {s.type}</span>
                  </div>
                  <span className={`badge text-xs ${s.status.startsWith('Demo')
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                    {s.status}
                  </span>
                </div>
                {s.link ? (
                  <a href={s.link} target="_blank" rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800 text-xs font-medium flex-shrink-0">
                    View →
                  </a>
                ) : (
                  <span className="text-gray-300 dark:text-gray-600 text-xs flex-shrink-0">No link</span>
                )}
              </div>
            ))}
            {cs.isDemoData && (
              <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                Sources: Prototype/Demo References — not verified official citations.
              </p>
            )}
          </div>
        </Section>

        {/* ── 14. RELATED DATASETS + POLICIES ──────────────────────── */}
        <Section id="related" icon="🔗" title="Related Datasets & Policies">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Datasets */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>💾</span> Related Land Datasets
              </p>
              <div className="space-y-2">
                {cs.relatedDatasets.map((d) => (
                  <Link key={d} to={`/datasets/${d}`}
                    className="flex items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group">
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">
                      {DATASET_LABELS[d] || d}
                    </span>
                    <span className="text-gray-400 group-hover:text-primary-600 text-xs">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>📜</span> Related Policies / Programmes
              </p>
              <div className="space-y-2">
                {cs.relatedPolicies.map((p) => (
                  <div key={p.name} className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 space-y-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-500 leading-snug">{p.description}</p>
                    <Link to={p.link || '/policies'}
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium">
                      View Policy Repository →
                    </Link>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Full policy details are in the separate Government Policies Repository.
              </p>
            </div>
          </div>
        </Section>

      </div>

      {/* ── OTHER CASE STUDIES ─────────────────────────────────────── */}
      <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="section-title mb-5">Explore Other Case Studies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CASE_STUDIES.filter((c) => c.id !== id).slice(0, 3).map((other) => {
              const oc = ltc(other.landType);
              return (
                <Link key={other.id} to={`/case-studies/${other.id}`}
                  className={`card-hover p-5 flex items-start gap-4 group border-l-4 border-l-gray-300 dark:border-l-gray-600`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${oc.badge}`}>
                    📋
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-snug line-clamp-2">
                      {other.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">📍 {other.state} — {other.district}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{other.landType} · {other.year}</p>
                  </div>
                  <span className="text-gray-300 dark:text-gray-600 group-hover:text-primary-600 transition-colors ml-auto">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FOOTER DEMO NOTICE ─────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-10 pt-4">
        <div className="card p-5 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10">
          <div className="flex gap-3">
            <span className="text-amber-500 text-xl flex-shrink-0">⚠️</span>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Demo Case Study Notice:</strong> All content, figures, organisations, findings, and
              references in this case study are <strong>prototype demonstration data</strong> created for
              illustrative purposes only. They do not represent verified official government information.
              Official verified case studies will replace demo content once authorised sources are connected.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
