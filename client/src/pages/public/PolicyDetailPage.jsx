import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DemoBadge from '../../components/common/DemoBadge';
import { getPolicy, getRelatedPolicies, POLICIES } from '../../utils/policyDemoData';

// ─── Colour maps (mirror PolicyPage) ─────────────────────────────────────────
const CATEGORY_COLORS = {
  'Agriculture Land':        { header: 'from-emerald-900 via-emerald-800 to-emerald-700', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  'Land Records':            { header: 'from-blue-900 via-blue-800 to-blue-700',          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',             border: 'border-blue-200 dark:border-blue-800'     },
  'Land Acquisition':        { header: 'from-red-900 via-red-800 to-red-700',             badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',                 border: 'border-red-200 dark:border-red-800'       },
  'Land Use':                { header: 'from-indigo-900 via-indigo-800 to-indigo-700',    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',     border: 'border-indigo-200 dark:border-indigo-800' },
  'Forest and Conservation': { header: 'from-teal-900 via-teal-800 to-teal-700',          badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',             border: 'border-teal-200 dark:border-teal-800'     },
  'Urban Development':       { header: 'from-purple-900 via-purple-800 to-purple-700',    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',     border: 'border-purple-200 dark:border-purple-800' },
  'Rural Development':       { header: 'from-amber-900 via-amber-800 to-amber-700',       badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',         border: 'border-amber-200 dark:border-amber-800'   },
  'Land Dispute Resolution': { header: 'from-orange-900 via-orange-800 to-orange-700',    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',     border: 'border-orange-200 dark:border-orange-800' },
};
const catC = (c) => CATEGORY_COLORS[c] || CATEGORY_COLORS['Land Records'];

const STATUS_STYLES = {
  'Active':                'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Amended':               'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Replaced':              'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  'Archived':              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'Verification Required': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
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

const DATASET_LABELS = {
  'state-wise':     '🗺️ State-wise Land Data',
  'land-use':       '🌾 Land Use Dataset',
  'land-ownership': '🏛️ Land Ownership Dataset',
  'land-records':   '📋 Land Records Dataset',
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

// ─── Section nav items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',    label: 'Overview',        icon: '📋' },
  { id: 'objective',   label: 'Objective',       icon: '🎯' },
  { id: 'description', label: 'Description',     icon: '📄' },
  { id: 'provisions',  label: 'Key Provisions',  icon: '📌' },
  { id: 'metadata',    label: 'Metadata',        icon: '🗂️' },
  { id: 'timeline',    label: 'Timeline',        icon: '📅' },
  { id: 'documents',   label: 'Documents',       icon: '🔗' },
  { id: 'related',     label: 'Related',         icon: '🔗' },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DETAIL PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function PolicyDetailPage() {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState('overview');
  const policy = getPolicy(id);

  // Scroll tracking
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
  if (!policy) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">📜</p>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Policy not found</h2>
          <Link to="/policies" className="btn-primary">← Back to Policies</Link>
        </div>
      </div>
    );
  }

  const c = catC(policy.category);
  const relatedPolicies = getRelatedPolicies(policy);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <div className={`bg-gradient-to-r ${c.header} text-white py-12 px-4`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/policies" className="hover:text-white transition-colors">Policies Repository</Link>
            <span>/</span>
            <span className="text-white">{policy.id}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Left: title block */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`badge text-xs ${c.badge}`}>{policy.category}</span>
                <span className={`badge text-xs ${TYPE_STYLES[policy.policyType] || 'bg-white/20 text-white'}`}>
                  {policy.policyType}
                </span>
                <span className={`badge text-xs ${STATUS_STYLES[policy.status] || 'bg-white/20 text-white'}`}>
                  {policy.status}
                </span>
                {policy.isDemoData && <DemoBadge text="Demo Policy Data" />}
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold leading-snug mb-3">{policy.name}</h1>
              <p className="text-white/75 text-sm sm:text-base max-w-2xl leading-relaxed">{policy.shortDescription}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {policy.tags.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 bg-white/10 text-white/80 rounded text-xs border border-white/20">{t}</span>
                ))}
              </div>
            </div>

            {/* Right: quick-info panel */}
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 min-w-[220px] space-y-2 text-sm">
              {[
                ['🏛️', 'Level',       policy.governmentLevel],
                ['📂', 'Category',    policy.category],
                ['📝', 'Type',        policy.policyType],
                ['📅', 'Year',        policy.year],
                ['🗺️', 'Applicable',  policy.applicableArea.length > 30 ? policy.applicableArea.slice(0, 30) + '…' : policy.applicableArea],
                ['🆔', 'Policy ID',   policy.id],
              ].map(([icon, label, val]) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="flex-shrink-0">{icon}</span>
                  <span className="text-white/50 flex-shrink-0">{label}:</span>
                  <span className="font-medium text-white leading-snug">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY NAV BAR ──────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-16 z-30">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Link to="/policies" className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0">← All Policies</Link>
          <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-500 hover:text-primary-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {policy.source?.url && (
              <a href={policy.source.url} target="_blank" rel="noopener noreferrer"
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                🔗 Official Source
              </a>
            )}
            <button className="btn-primary text-xs py-1.5 px-3">📥 Export</button>
          </div>
        </div>
      </div>

      {/* ── DEMO ALERT ───────────────────────────────────────────────── */}
      {policy.isDemoData && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-300 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-300">
            <span className="text-lg flex-shrink-0">🟡</span>
            <div>
              <strong>Demo Policy Data:</strong> This record is a prototype example created for interface
              demonstration only. It must not be interpreted as an official government policy document.
              All metadata, provisions, dates, and descriptions require verification against official
              government sources before use.
            </div>
          </div>
        </div>
      )}

      {/* ── SECTIONS ─────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── 1. OVERVIEW (Quick summary grid) ─────────────────────── */}
        <Section id="overview" icon="📋" title="Policy Overview">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Government Level', value: policy.governmentLevel },
              { label: 'Category',         value: policy.category },
              { label: 'Policy Type',      value: policy.policyType },
              { label: 'Year',             value: policy.year },
              { label: 'Status',           value: policy.status },
              { label: 'Ministry',         value: policy.ministry },
              { label: 'Department',       value: policy.department },
              { label: 'Issuing Authority',value: policy.issuingAuthority },
              { label: 'State',            value: policy.state || 'All India' },
              { label: 'Applicable Area',  value: policy.applicableArea },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white leading-snug">{value}</p>
              </div>
            ))}
          </div>

          {/* Related land sector chips */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Related Land Sectors</p>
            <div className="flex flex-wrap gap-2">
              {policy.relatedLandSector.map((s) => (
                <span key={s} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium border border-primary-200 dark:border-primary-800">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 2. OBJECTIVE ─────────────────────────────────────────── */}
        <Section id="objective" icon="🎯" title="Objective">
          <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-xl p-5">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{policy.objective}</p>
          </div>
        </Section>

        {/* ── 3. DESCRIPTION ───────────────────────────────────────── */}
        <Section id="description" icon="📄" title="Description" badge={policy.isDemoData ? <DemoBadge /> : null}>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {policy.description}
          </p>
        </Section>

        {/* ── 4. KEY PROVISIONS ────────────────────────────────────── */}
        <Section id="provisions" icon="📌" title="Key Provisions" badge={policy.isDemoData ? <DemoBadge /> : null}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {policy.keyProvisions.map((kp, i) => (
              <div key={i} className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-white text-sm mb-1">{kp.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{kp.description}</p>
                </div>
              </div>
            ))}
          </div>
          {policy.isDemoData && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-4">
              ⚠️ All provisions are demo content and must be verified against the official policy document.
            </p>
          )}
        </Section>

        {/* ── 5. METADATA PANEL ────────────────────────────────────── */}
        <Section id="metadata" icon="🗂️" title="Policy Metadata">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-700">
            {/* Left column */}
            <div className="space-y-0 sm:pr-6">
              {[
                ['Policy Name',        policy.name],
                ['Government Level',   policy.governmentLevel],
                ['Ministry',           policy.ministry],
                ['Department',         policy.department],
                ['Issuing Authority',  policy.issuingAuthority],
                ['State',              policy.state || 'All India'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 text-sm border-b border-gray-100 dark:border-gray-700 py-2.5 last:border-0">
                  <span className="text-gray-400 w-40 flex-shrink-0">{label}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200 leading-snug">{value}</span>
                </div>
              ))}
            </div>
            {/* Right column */}
            <div className="space-y-0 sm:pl-6 pt-0">
              {[
                ['Year',               policy.year],
                ['Effective Date',     policy.effectiveDate || 'Demo – verify official date'],
                ['Amendment Year',     policy.amendmentYear || 'N/A'],
                ['Policy Type',        policy.policyType],
                ['Category',           policy.category],
                ['Status',             policy.status],
                ['Applicable Area',    policy.applicableArea],
                ['Verification',       policy.verificationStatus],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 text-sm border-b border-gray-100 dark:border-gray-700 py-2.5 last:border-0">
                  <span className="text-gray-400 w-40 flex-shrink-0">{label}</span>
                  <span className={`font-medium leading-snug ${
                    label === 'Status' ? (STATUS_STYLES[value] ? 'text-gray-800 dark:text-gray-200' : '') : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {label === 'Status'
                      ? <span className={`badge text-xs ${STATUS_STYLES[value] || 'bg-gray-100 text-gray-600'}`}>{value}</span>
                      : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 6. POLICY TIMELINE ───────────────────────────────────── */}
        <Section id="timeline" icon="📅" title="Policy Timeline">
          <div className="relative pl-6 border-l-2 border-primary-200 dark:border-primary-800 space-y-6">
            {policy.timeline.map((t, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-primary-600 border-2 border-white dark:border-gray-900" />
                <div className="ml-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">
                      {t.year}
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-white text-sm">{t.event}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t.description}</p>
                </div>
              </div>
            ))}
            <span className="absolute -left-[9px] bottom-0 w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
          {policy.isDemoData && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-4">
              ⚠️ Timeline dates are demo references — verify against official gazette notifications.
            </p>
          )}
        </Section>

        {/* ── 7. OFFICIAL DOCUMENT / SOURCE ────────────────────────── */}
        <Section id="documents" icon="🔗" title="Official Source & Documents">
          {policy.source ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 border-2 border-primary-200 dark:border-primary-800 rounded-xl bg-primary-50 dark:bg-primary-900/10">
                <span className="text-3xl flex-shrink-0">📑</span>
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="font-semibold text-gray-800 dark:text-white">{policy.source.title}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>🏛️ {policy.source.organization}</span>
                    <span>📂 {policy.source.documentType}</span>
                  </div>
                  <span className={`badge text-xs ${policy.source.isDemo
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                    {policy.source.isDemo ? 'Demo Reference' : 'Verified Official Source'}
                  </span>
                </div>
                {policy.source.url && (
                  <a href={policy.source.url} target="_blank" rel="noopener noreferrer"
                    className="btn-primary text-sm py-2 px-4 flex-shrink-0 flex items-center gap-2">
                    View Official Source <span>↗</span>
                  </a>
                )}
              </div>

              {policy.isDemoData && (
                <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
                  <span className="flex-shrink-0">⚠️</span>
                  <span>
                    The official source link is provided for reference only. All content on this page is demo
                    data — visit the official government source to obtain verified policy information.
                  </span>
                </div>
              )}

              {/* Document actions */}
              <div className="flex flex-wrap gap-2">
                <button className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">📄 Download PDF (Demo)</button>
                <button className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">📋 Copy Citation</button>
                <button className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">📥 Export JSON</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No official source linked for this policy record.</p>
          )}
        </Section>

        {/* ── 8. RELATED SECTION ───────────────────────────────────── */}
        <Section id="related" icon="🔗" title="Related Resources">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Related Policies */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>📜</span> Related Policies
              </p>
              {relatedPolicies.length > 0 ? (
                <div className="space-y-2">
                  {relatedPolicies.map((rp) => {
                    const rc = catC(rp.category);
                    return (
                      <Link key={rp.id} to={`/policies/${rp.id}`}
                        className={`flex items-start gap-3 p-3 border rounded-xl hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors group ${rc.border}`}>
                        <span className={`badge text-xs flex-shrink-0 mt-0.5 ${rc.badge}`}>{rp.policyType}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-800 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-snug line-clamp-2">
                            {rp.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{rp.year} · {rp.governmentLevel}</p>
                        </div>
                        <span className="text-gray-300 group-hover:text-primary-600 transition-colors flex-shrink-0">→</span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No related policies linked.</p>
              )}
            </div>

            {/* Related Datasets */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>💾</span> Related Land Datasets
              </p>
              {policy.relatedDatasets?.length > 0 ? (
                <div className="space-y-2">
                  {policy.relatedDatasets.map((d) => (
                    <Link key={d} to={`/datasets/${d}`}
                      className="flex items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group text-sm">
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">
                        {DATASET_LABELS[d] || d}
                      </span>
                      <span className="text-gray-400 group-hover:text-primary-600 text-xs">→</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No related datasets linked.</p>
              )}
              <p className="text-xs text-gray-400 mt-2">Full data in the Land Dataset Repository.</p>
            </div>

            {/* Related Case Studies */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>📚</span> Related Case Studies
              </p>
              {policy.relatedCaseStudies?.length > 0 ? (
                <div className="space-y-2">
                  {policy.relatedCaseStudies.map((csId) => (
                    <Link key={csId} to={`/case-studies/${csId}`}
                      className="flex items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group text-sm">
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">
                        📋 Case Study {csId}
                      </span>
                      <span className="text-gray-400 group-hover:text-primary-600 text-xs flex-shrink-0">View →</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No related case studies linked.</p>
              )}
              <p className="text-xs text-gray-400 mt-2">Full details in the Case Studies Repository.</p>
            </div>
          </div>
        </Section>

      </div>

      {/* ── OTHER POLICIES ─────────────────────────────────────────── */}
      <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="section-title mb-5">Explore Other Policies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POLICIES.filter((p) => p.id !== id).slice(0, 3).map((other) => {
              const oc = catC(other.category);
              return (
                <Link key={other.id} to={`/policies/${other.id}`}
                  className={`card-hover p-5 flex items-start gap-4 group border-l-4 ${oc.border}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${oc.badge}`}>
                    📜
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-snug line-clamp-2">
                      {other.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-gray-400">{other.year}</span>
                      <span className="text-gray-300">·</span>
                      <span className={`badge text-xs ${TYPE_STYLES[other.policyType] || 'bg-gray-100 text-gray-600'}`}>{other.policyType}</span>
                    </div>
                  </div>
                  <span className="text-gray-300 dark:text-gray-600 group-hover:text-primary-600 transition-colors ml-auto flex-shrink-0">→</span>
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
              <strong>Demo Policy Data Notice:</strong> All content, metadata, provisions, dates, and source
              references on this page are <strong>prototype demonstration data</strong> only. They do not
              represent verified official government policy information. Some records reference real policy
              names to make the interface realistic — verify ALL details against official government
              publications before any use.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
