import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import researchService from '../../services/researchService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DemoBadge from '../../components/common/DemoBadge';
import {
  getDemoResearch,
  RESEARCH_RESULT_ROWS,
  RESEARCH_VERIFICATION_ROWS,
} from '../../utils/researchDemoData';
import { hasAccess, clearDemoAccessOnce } from './ResearchPaymentPage';

// ─── Plans (mirrored from ResearchPaymentPage) ────────────────────────────────
const PLANS = [
  { id: 'single',    label: '1 Research Paper',    papers: 1,   price: 10, saving: null,       highlight: false, description: 'Access 1 specific research paper' },
  { id: 'bundle5',   label: '5 Research Papers',   papers: 5,   price: 30, saving: 'Save $20', highlight: true,  description: 'Access any 5 separate research papers' },
  { id: 'bundle100', label: '100 Research Papers', papers: 100, price: 50, saving: 'Save $950', highlight: false, description: 'Access any 100 separate research papers' },
];

// ─── Static content ───────────────────────────────────────────────────────────
const PROCESS_STEPS = [
  'Problem', 'Data Collection', 'Evidence Verification', 'Categorization',
  'GIS / Spatial Analysis', 'Pattern Identification', 'Research Findings', 'Policy-Support Information',
];
const GIS_LAYERS = [
  'Agricultural Land', 'Urban Areas', 'Forest', 'Water Bodies', 'Infrastructure',
  'Land-Use Change', 'Citizen Evidence', 'Reported Land Issues', 'Climate Vulnerability',
];
const RELATED = [
  'Agricultural Land Conversion', 'Citizen Land Monitoring',
  'GIS-Based Urban Expansion', 'Water-Body Land Management',
];

// ─── Reusable Section wrapper ─────────────────────────────────────────────────
const Section = ({ title, eyebrow, children, className = '' }) => (
  <section className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-7 ${className}`}>
    {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">{eyebrow}</p>}
    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
    {children}
  </section>
);

const Meta = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">{value || 'Demo information'}</p>
  </div>
);

// ─── Demo GIS map visual ──────────────────────────────────────────────────────
function EvidenceMap() {
  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-xl bg-gradient-to-br from-blue-950 via-cyan-800 to-emerald-700 p-5 text-white">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(32deg,transparent 47%,rgba(255,255,255,.5) 48%,transparent 50%),linear-gradient(118deg,transparent 47%,rgba(255,255,255,.35) 48%,transparent 50%)', backgroundSize: '58px 58px' }} />
      <div className="relative flex h-full min-h-[220px] flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="rounded bg-black/25 px-2 py-1 text-xs font-semibold">NAVIRA VALLEY / DEMO GIS</span>
          <span className="rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold uppercase text-amber-950">Fictional</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold">
          <span className="rounded bg-emerald-300/80 p-2 text-emerald-950">Agriculture</span>
          <span className="rounded bg-cyan-200/80 p-2 text-cyan-950">Water bodies</span>
          <span className="rounded bg-orange-300/90 p-2 text-orange-950">Reported issues</span>
        </div>
      </div>
    </div>
  );
}

// ─── Purchase Modal ───────────────────────────────────────────────────────────
function PurchaseModal({ paperId, returnPath, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-labelledby="modal-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div className="relative w-full max-w-2xl animate-slide-up rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 px-6 py-6 text-white">
          <button onClick={onClose} aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl font-bold transition-colors">
            ×
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-300 mb-1">Research Paper Access</p>
          <h2 id="modal-title" className="text-2xl font-bold">Unlock Research Papers</h2>
          <p className="text-primary-200 text-sm mt-1">
            Choose a plan to access complete research findings, methodology, analysis and conclusions.
          </p>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div key={plan.id}
                className={`relative flex flex-col rounded-xl border-2 p-5 ${
                  plan.highlight
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                    MOST POPULAR
                  </span>
                )}
                {plan.saving && (
                  <span className="absolute -top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    {plan.saving}
                  </span>
                )}
                <p className="font-bold text-gray-900 dark:text-white text-sm">{plan.label}</p>
                <p className="text-3xl font-black text-primary-700 dark:text-primary-400 my-2">${plan.price}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug flex-1">{plan.description}</p>
                <button
                  onClick={() => { onClose(); navigate('/research/payment', { state: { planId: plan.id, paperId, returnPath } }); }}
                  className={`mt-4 w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${
                    plan.highlight
                      ? 'bg-primary-700 hover:bg-primary-800 text-white'
                      : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white'
                  }`}>
                  Buy Now →
                </button>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-gray-500">
            🔒 Secure Demo Payment · Hackathon Prototype · No real transaction processed
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Lock overlay (shown between clear and blurred zones) ─────────────────────
function LockOverlay({ onBuy }) {
  return (
    <div className="relative -mt-28 z-10 flex flex-col items-center px-4 pb-2">
      <div className="w-full h-28 bg-gradient-to-b from-transparent to-slate-50 dark:to-gray-950 pointer-events-none" />
      <div className="w-full max-w-xl rounded-2xl border-2 border-primary-200 dark:border-primary-800 bg-white dark:bg-gray-900 shadow-2xl p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mx-auto text-3xl">🔒</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Full Paper Access Required</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto">
          Purchase this research paper to read the complete research findings, methodology, analysis, and conclusions.
        </p>
        <button onClick={onBuy} className="btn-primary px-8 py-3 text-sm font-bold rounded-xl">
          🔓 Buy Full Paper
        </button>
        <p className="text-xs text-amber-700 dark:text-amber-400">🔬 Demo Purchase · Hackathon Prototype</p>
      </div>
    </div>
  );
}

// ─── Blurred locked section wrapper ──────────────────────────────────────────
function LockedSection({ title, eyebrow, children }) {
  return (
    <div className="relative rounded-xl overflow-hidden select-none">
      <div className="blur-[6px] brightness-75 pointer-events-none" aria-hidden="true">
        <Section title={title} eyebrow={eyebrow}>{children}</Section>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-gray-900/80 text-white rounded-full text-[10px] font-bold z-10">
        🔒 Locked
      </div>
    </div>
  );
}

// ─── Access granted banner ────────────────────────────────────────────────────
function AccessGrantedBanner() {
  return (
    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4 flex items-center gap-3">
      <span className="text-2xl">✅</span>
      <div>
        <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Full Access Granted</p>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
          You have full access to this research paper. All sections are now unlocked.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ResearchDetailPage() {
  const { id }     = useParams();
  const location   = useLocation();
  const [research, setResearch] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);

  // ── One-time demo reset on very first visit ──────────────────────────────
  // Wipes any stale test purchase so the paper always starts locked.
  // Runs exactly once per browser (guarded by a separate LS flag).
  useEffect(() => { clearDemoAccessOnce(); }, []);

  // Access state — re-evaluated on mount, window focus, and payment return
  const [unlocked, setUnlocked] = useState(() => hasAccess(id));

  useEffect(() => {
    const onFocus = () => setUnlocked(hasAccess(id));
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [id]);

  useEffect(() => {
    if (location.state?.unlocked) {
      setUnlocked(hasAccess(id));
      window.history.replaceState({}, '');
    }
  }, [location.state, id]);

  // Load research data
  useEffect(() => {
    setLoading(true);
    researchService.getOne(id)
      .then(({ data }) => setResearch({ ...getDemoResearch(id), ...data.data }))
      .catch(() => setResearch(getDemoResearch(id)))
      .finally(() => setLoading(false));
  }, [id]);

  const openModal  = useCallback(() => setModal(true),  []);
  const closeModal = useCallback(() => setModal(false), []);

  if (loading) return <LoadingSpinner fullPage text="Loading research paper..." />;
  if (!research) return <div className="p-10 text-center">Research record not found.</div>;

  const resultChart = RESEARCH_RESULT_ROWS.map(([name, records]) => ({ name: name.split(' ')[0], records }));
  const authors     = research.authors?.map((a) => a.name).join(', ');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">

      {/* Purchase modal */}
      {modal && (
        <PurchaseModal
          paperId={id}
          returnPath={`/research/${id}`}
          onClose={closeModal}
        />
      )}

      {/* ── HEADER ───────────────────────────────────────────────── */}
      <header className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-5 flex items-center gap-2 text-sm text-primary-200">
            <Link to="/">Home</Link><span>/</span>
            <Link to="/research">Research Repository</Link><span>/</span>
            <span className="text-white">{research.researchId || id}</span>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <DemoBadge text="DEMO / FICTIONAL RESEARCH PAPER" />
            <span className="badge-blue">{research.researchType || 'Research Paper'}</span>
            {unlocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 px-3 py-1 text-xs font-bold text-emerald-200">
                ✅ Full Access Granted
              </span>
            )}
          </div>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-4xl">{research.title}</h1>
          <div className="mt-5 grid gap-4 text-sm text-primary-100 sm:grid-cols-4">
            <Meta label="Research ID" value={research.researchId || id} />
            <Meta label="Authors"     value={authors} />
            <Meta label="Year"        value={research.publicationYear || 2026} />
            <Meta label="Study area"  value={research.studyArea || 'Fictional demonstration area'} />
          </div>
          <p className="mt-6 max-w-3xl text-sm font-semibold text-amber-200">
            DEMO / FICTIONAL RESEARCH PAPER – FOR HACKATHON PROTOTYPE
          </p>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <main className="mx-auto grid max-w-screen-xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_330px]">

        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Access granted banner */}
          {unlocked && <AccessGrantedBanner />}

          {/* ── CLEAR SECTION (always visible) ────────────────── */}
          <Section title="Abstract" eyebrow="01 / Study overview">
            <p className="leading-7 text-gray-600 dark:text-gray-300">{research.abstract}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(research.keywords || []).map((kw) => (
                <span key={kw} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">{kw}</span>
              ))}
            </div>
          </Section>

          <Section title="Introduction">
            <p className="leading-7 text-gray-600 dark:text-gray-300">
              Land governance needs information that is geographically specific, understandable, and open to verification.
              This fictional paper demonstrates how local observations can be organized with photographs, survey notes,
              and GIS layers so that researchers can identify patterns without treating a citizen submission as an established fact.
            </p>
          </Section>

          <Section title="Research Problem">
            <p className="leading-7 text-gray-600 dark:text-gray-300">
              Disconnected land records, changing land use, conflicting information, and limited access to local evidence
              can delay responsible review. The prototype addresses this information gap by creating a traceable path from
              evidence collection to research findings and policy-support information.
            </p>
          </Section>

          <Section title="Research Objectives">
            <ol className="space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {[
                'Demonstrate how citizen and spatial land evidence can be collected.',
                'Categorize land-related evidence into meaningful issue categories.',
                'Use GIS analysis to identify spatial patterns.',
                'Generate structured research findings.',
                'Convert findings into policy-support information.',
              ].map((obj, i) => (
                <li key={obj} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">{i + 1}</span>
                  {obj}
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Study Area and Data Sources" eyebrow="Fictional research setting">
            <p className="mb-5 leading-7 text-gray-600 dark:text-gray-300">
              <strong>Navira Valley Demonstration Region</strong> is a fictional study area created exclusively for
              hackathon demonstration representing a mixed rural and peri-urban landscape.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[['1,200','Total evidence records'],['720','Citizen observations'],['860','Photographic evidence'],['1,050','GIS-linked records'],['340','Survey observations'],['420','Spatial issue locations']].map(([v, l]) => (
                <div key={l} className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <p className="text-xl font-bold text-primary-700 dark:text-primary-300">{v}</p>
                  <p className="mt-1 text-xs text-gray-500">{l}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-amber-700">All values are DEMO / FICTIONAL DATA ONLY</p>
            <div className="mt-6"><EvidenceMap /></div>
          </Section>

          {/* ── LOCK OVERLAY (locked only) ────────────────────── */}
          {!unlocked && <LockOverlay onBuy={openModal} />}

          {/* ── LOCKED / UNLOCKED SECTIONS ───────────────────── */}
          {unlocked ? (
            <div className="space-y-6">
              <Section title="Methodology" eyebrow="Evidence-to-policy workflow">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {PROCESS_STEPS.map((step, i) => (
                    <div key={step} className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-primary-900 dark:bg-primary-900/20">
                      <span className="text-xs font-bold text-primary-600">0{i + 1}</span>
                      <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">{step}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Evidence was collected, checked for completeness, categorized, linked to fictional GIS layers,
                  reviewed for spatial patterns, and translated into policy-support language.
                </p>
              </Section>

              <Section title="Results / Findings" eyebrow="DEMO / FICTIONAL DATA ONLY">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead><tr className="border-b text-xs uppercase tracking-wider text-gray-400">
                      <th className="py-3">Category</th><th className="py-3">Records</th><th className="py-3">Percentage</th>
                    </tr></thead>
                    <tbody>
                      {RESEARCH_RESULT_ROWS.map(([cat, rec, pct]) => (
                        <tr key={cat} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3 font-medium text-gray-700 dark:text-gray-200">{cat}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-300">{rec}</td>
                          <td className="py-3 font-semibold text-primary-700">{pct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resultChart} layout="vertical" margin={{ left: 10, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="records" fill="#2563eb" radius={[0, 5, 5, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Section>

              <Section title="Verification Status">
                <div className="space-y-3">
                  {RESEARCH_VERIFICATION_ROWS.map(([label, count, pct]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-medium text-gray-700 dark:text-gray-200">{label}</span>
                        <span className="text-gray-500">{count} · {pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-primary-600" style={{ width: `${pct * 2.8}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                  Citizen submissions are not automatically treated as confirmed facts. Records require appropriate human and administrative verification.
                </p>
              </Section>

              <Section title="GIS / Spatial Findings">
                <p className="mb-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  The fictional study connects a paper to a related dataset and map layer so researchers can inspect spatial context before interpreting a pattern.
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {GIS_LAYERS.map((l) => (
                    <span key={l} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">{l}</span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link to={`/gis-map?research=${research.researchId || id}`} className="btn-primary">View Research on GIS Map</Link>
                  <Link to="/gis-map" className="btn-secondary">Open GIS Explorer</Link>
                </div>
              </Section>

              <Section title="Discussion">
                <p className="leading-7 text-gray-600 dark:text-gray-300">
                  The fictional results show why evidence needs context. A concentration of agricultural land-conversion
                  observations may help prioritize further verification, but it does not establish unauthorized activity.
                  Researchers can compare categories and locations; administrators can plan field review; policymakers
                  can see where better records, public communication, or coordinated assessment may be useful.
                </p>
              </Section>

              <Section title="Policy / Practical Recommendations">
                <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  <li>Prioritize mapped clusters for field verification based on evidence quality and potential public impact.</li>
                  <li>Reconcile unclear land information before using it for consequential decisions.</li>
                  <li>Maintain an audit trail from policy-support statements back to reports, images, and GIS layers.</li>
                  <li>Publish clear status updates so citizens know whether an issue is received, under review, or verified.</li>
                  <li>Use consent, redaction, and role-based access for sensitive evidence and precise locations.</li>
                </ol>
              </Section>

              <Section title="Conclusion">
                <p className="leading-7 text-gray-600 dark:text-gray-300">
                  This fictional demonstration shows that the platform is more than a document repository.
                  It connects research, evidence, datasets, GIS analysis, findings, and policy-support information in one traceable workflow.
                </p>
              </Section>

              <Section title="Limitations">
                <p className="leading-7 text-gray-600 dark:text-gray-300">
                  The study area, authors, numbers, datasets, GIS layers, findings, and recommendations are fictional demo
                  content created for a hackathon prototype. No real location, person, institution, or published research is represented.
                </p>
              </Section>

              <Section title="Demo / Prototype References">
                <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
                  <li>National Digital Platform Prototype Team. (2026). Fictional citizen evidence schema for land-use reports.</li>
                  <li>National Digital Platform Prototype Team. (2026). Fictional GIS layer catalogue for the Navira Valley demonstration.</li>
                  <li>National Digital Platform Prototype Team. (2026). Evidence-to-policy workflow specification.</li>
                </ol>
              </Section>
            </div>
          ) : (
            /* Blurred placeholder sections */
            <div className="space-y-6">
              <LockedSection title="Methodology" eyebrow="Evidence-to-policy workflow">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {PROCESS_STEPS.map((step, i) => (
                    <div key={step} className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-primary-900 dark:bg-primary-900/20">
                      <span className="text-xs font-bold text-primary-600">0{i + 1}</span>
                      <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">{step}</p>
                    </div>
                  ))}
                </div>
              </LockedSection>

              <LockedSection title="Results / Findings" eyebrow="Data Collection & Analysis">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead><tr className="border-b text-xs uppercase tracking-wider text-gray-400">
                      <th className="py-3">Category</th><th className="py-3">Records</th><th className="py-3">Percentage</th>
                    </tr></thead>
                    <tbody>
                      {RESEARCH_RESULT_ROWS.map(([cat, rec, pct]) => (
                        <tr key={cat} className="border-b border-gray-100">
                          <td className="py-3 font-medium">{cat}</td>
                          <td className="py-3">{rec}</td>
                          <td className="py-3 font-semibold text-primary-700">{pct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </LockedSection>

              <LockedSection title="GIS / Spatial Findings">
                <div className="grid gap-2 sm:grid-cols-3">
                  {GIS_LAYERS.map((l) => (
                    <span key={l} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700">{l}</span>
                  ))}
                </div>
              </LockedSection>

              <LockedSection title="Discussion">
                <p className="leading-7 text-gray-600 dark:text-gray-300">
                  The fictional results show why evidence needs context. A concentration of agricultural
                  land-conversion observations may help prioritize further verification, but it does not establish unauthorized activity.
                </p>
              </LockedSection>

              <LockedSection title="Policy / Practical Recommendations">
                <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-600">
                  <li>Prioritize mapped clusters for field verification based on evidence quality.</li>
                  <li>Reconcile unclear land information before using it for consequential decisions.</li>
                  <li>Maintain an audit trail from policy-support statements back to reports.</li>
                </ol>
              </LockedSection>

              <LockedSection title="Conclusion & References">
                <p className="leading-7 text-gray-600 dark:text-gray-300">
                  This fictional demonstration shows that the platform is more than a document repository.
                  It connects research, evidence, datasets, GIS analysis, findings, and policy-support information in one traceable workflow.
                </p>
              </LockedSection>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ────────────────────────────────────── */}
        <aside className="space-y-5 lg:sticky lg:top-5 lg:self-start">
          <Section title="Research actions" className="p-5">
            <div className="grid gap-2">
              <button type="button" className="btn-primary justify-center text-sm">View Abstract</button>
              <Link to={`/datasets?research=${research.researchId || id}`} className="btn-secondary justify-center text-sm">View Dataset</Link>
              <Link to={`/gis-map?research=${research.researchId || id}`} className="btn-secondary justify-center text-sm">View GIS</Link>
              <button type="button" className="btn-secondary justify-center text-sm">Save Research</button>
              <button type="button" className="btn-secondary justify-center text-sm">Share</button>
              <button type="button" className="btn-secondary justify-center text-sm">Download Demo Paper</button>
            </div>
          </Section>

          <Section title="Evidence chain" eyebrow="Traceable research" className="p-5">
            <div className="space-y-0">
              {['Citizen Evidence','Photographs','Geographic Location','Land-Use Data','GIS Analysis','Research Findings','Policy Support'].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">{i + 1}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{step}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Related dataset" className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600">DATA-001</p>
            <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">Land Evidence Dataset – Demo 2026</h3>
            <p className="mt-2 text-xs leading-5 text-gray-500">Evidence ID, latitude, longitude, land-use category, evidence type, observation, photograph, verification status, and date.</p>
            <Link to={`/datasets?research=${research.researchId || id}`} className="btn-primary mt-4 w-full justify-center text-sm">View Dataset</Link>
          </Section>

          <Section title="Policy-support information" className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Fictional finding</p>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
              Higher concentrations of agricultural land-conversion observations were identified in the northern demonstration zone.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              <strong>Evidence:</strong> citizen observations + photographs + GIS data<br />
              <strong>Analysis:</strong> spatial clustering<br />
              <strong>Support:</strong> area may be prioritized for further verification.
            </p>
          </Section>

          <Section title="AI Research Assistant" className="p-5">
            <input className="input-field text-sm" placeholder="Ask about land governance research..." defaultValue="Show research about agricultural land conversion." />
            <div className="mt-3 rounded-lg bg-primary-50 p-3 text-xs leading-5 text-primary-900 dark:bg-primary-900/20 dark:text-primary-100">
              Demo response: Found 24 relevant research records.
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {['Research Papers','Case Studies','Datasets','GIS Layers'].map((btn) => (
                <button key={btn} type="button" className="btn-secondary justify-center px-2 py-2">{btn}</button>
              ))}
            </div>
          </Section>

          <Section title="Related research" className="p-5">
            <div className="space-y-3">
              {RELATED.map((item) => (
                <Link key={item} to="/research" className="block text-sm font-medium text-primary-700 hover:underline">{item}</Link>
              ))}
            </div>
            <div className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-700">
              Related GIS layer · Related case study · Related policy analysis
            </div>
          </Section>
        </aside>
      </main>
    </div>
  );
}
