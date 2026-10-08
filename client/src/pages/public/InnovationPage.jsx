import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DemoBadge from '../../components/common/DemoBadge';
import {
  OPPORTUNITIES,
  OPPORTUNITY_TYPES,
  TYPE_BADGE,
  TYPE_LABEL,
} from '../../data/innovationData';

// ─── Design tokens ────────────────────────────────────────────────────────────
const G9   = '#0f5c3a';   // primary dark green
const G7   = '#1a7a4e';
const G5   = '#2e9e68';

const STATUS_STYLE = {
  open:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  upcoming:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  closed:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  completed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const CAT_CARD_COLORS = {
  hackathon:   { ring: 'border-purple-200 dark:border-purple-800',  icon: 'bg-purple-100 dark:bg-purple-900/30',  text: 'text-purple-600 dark:text-purple-300'  },
  grant:       { ring: 'border-emerald-200 dark:border-emerald-800',icon: 'bg-emerald-100 dark:bg-emerald-900/30',text: 'text-emerald-600 dark:text-emerald-300'},
  pilot:       { ring: 'border-blue-200 dark:border-blue-800',      icon: 'bg-blue-100 dark:bg-blue-900/30',      text: 'text-blue-600 dark:text-blue-300'      },
  competition: { ring: 'border-amber-200 dark:border-amber-800',    icon: 'bg-amber-100 dark:bg-amber-900/30',    text: 'text-amber-600 dark:text-amber-300'    },
};

// ─── Opportunity Card ─────────────────────────────────────────────────────────
function OpportunityCard({ opp }) {
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedOpportunities') || '[]').includes(opp.id); }
    catch { return false; }
  });

  const toggleSave = (e) => {
    e.preventDefault();
    const prev = JSON.parse(localStorage.getItem('savedOpportunities') || '[]');
    const next  = saved ? prev.filter((x) => x !== opp.id) : [...prev, opp.id];
    localStorage.setItem('savedOpportunities', JSON.stringify(next));
    setSaved(!saved);
  };

  return (
    <div className="card-hover flex flex-col border-t-4 overflow-hidden"
      style={{ borderTopColor: opp.type === 'hackathon' ? '#7c3aed' : opp.type === 'grant' ? G5 : opp.type === 'pilot' ? '#2563eb' : '#d97706' }}>
      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className={`badge text-xs ${TYPE_BADGE[opp.type]}`}>{TYPE_LABEL[opp.type]}</span>
            <span className={`badge text-xs ${STATUS_STYLE[opp.status]}`}>{opp.status}</span>
          </div>
          <button
            onClick={toggleSave}
            title={saved ? 'Remove from saved' : 'Save opportunity'}
            className={`text-lg transition-colors flex-shrink-0 leading-none ${saved ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}
          >
            {saved ? '🔖' : '🔖'}
          </button>
        </div>

        {/* Title */}
        <Link to={`/innovation/opportunity/${opp.id}`}>
          <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm leading-snug hover:text-green-700 dark:hover:text-green-400 transition-colors line-clamp-2">
            {opp.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1">
          {opp.description}
        </p>

        {/* Meta */}
        <div className="space-y-1 text-xs text-gray-500">
          {opp.participants && <p>👥 {opp.participants}</p>}
          {opp.location     && <p>📍 {opp.location}</p>}
          {opp.deadline     && <p>📅 Deadline: <span className="font-medium text-gray-700 dark:text-gray-300">{opp.deadline}</span></p>}
          {opp.startDate && !opp.deadline && <p>🚀 Starts: <span className="font-medium text-gray-700 dark:text-gray-300">{opp.startDate}</span></p>}
          {opp.prizePool    && <p>💰 {opp.prizePool}</p>}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {opp.tags.slice(0, 4).map((t) => (
            <span key={t} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full text-xs">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer buttons */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <Link to={`/innovation/opportunity/${opp.id}`}
          className="flex-1 py-2 text-center text-xs font-medium text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
          View Details
        </Link>
        <Link to={`/innovation/opportunity/${opp.id}`}
          className="flex-1 py-2 text-center text-xs font-bold text-white rounded-lg transition-colors"
          style={{ background: G9 }}
          onMouseEnter={(e) => e.currentTarget.style.background = G7}
          onMouseLeave={(e) => e.currentTarget.style.background = G9}
        >
          {opp.actionLabel}
        </Link>
      </div>
    </div>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({ type, count, onFilter }) {
  const cfg = CAT_CARD_COLORS[type.key];
  return (
    <button
      onClick={() => onFilter(type.key)}
      className={`card-hover p-6 flex flex-col items-center gap-3 text-center border-2 ${cfg.ring} transition-all`}
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${cfg.icon}`}>
        {type.icon}
      </div>
      <div>
        <p className={`font-display font-bold text-base ${cfg.text}`}>{type.label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{count} opportunities</p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
        {type.key === 'hackathon'   && 'Solve real-world challenges with innovative solutions.'}
        {type.key === 'grant'       && 'Get funding for your research ideas and projects.'}
        {type.key === 'pilot'       && 'See research in action on the ground.'}
        {type.key === 'competition' && 'Test your knowledge and win exciting rewards.'}
      </p>
      <span className={`text-xs font-semibold ${cfg.text}`}>Explore →</span>
    </button>
  );
}

// ─── Impact Flow ──────────────────────────────────────────────────────────────
const FLOW_STEPS = [
  { icon: '📄', label: 'Research\nPaper'       },
  { icon: '💡', label: 'Innovation\nIdea'      },
  { icon: '🏆', label: 'Hackathon\n/ Grant'    },
  { icon: '🔧', label: 'Prototype'            },
  { icon: '🧪', label: 'Pilot\nProject'        },
  { icon: '📊', label: 'Results &\nEvidence'  },
  { icon: '📜', label: 'Policy /\nImplementation'},
];

function ImpactFlow() {
  return (
    <div className="py-14 px-4" style={{ background: 'linear-gradient(135deg,#f0faf4 0%,#e6f4ec 100%)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl font-display font-bold mb-2" style={{ color: G9 }}>
          From Research to Real-World Impact
        </h2>
        <p className="text-sm text-gray-600 mb-10 max-w-xl mx-auto">
          Connect research, innovation, and governance through a seamless journey.
        </p>

        {/* Desktop / tablet flow */}
        <div className="hidden sm:flex items-center justify-center gap-0 flex-wrap">
          {FLOW_STEPS.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-2 w-20">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm border-2"
                  style={{ background: '#fff', borderColor: G5 }}>
                  {step.icon}
                </div>
                <p className="text-xs font-medium text-center leading-tight whitespace-pre-line" style={{ color: G9 }}>
                  {step.label}
                </p>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className="flex items-center mx-1">
                  <div className="w-6 h-0.5" style={{ background: G5 }} />
                  <span style={{ color: G5, fontSize: 14 }}>▶</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile vertical flow */}
        <div className="sm:hidden flex flex-col items-center gap-0">
          {FLOW_STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm border-2"
                style={{ background: '#fff', borderColor: G5 }}>
                {step.icon}
              </div>
              <p className="text-xs font-medium text-center mt-1 mb-1 whitespace-pre-line" style={{ color: G9 }}>
                {step.label}
              </p>
              {i < FLOW_STEPS.length - 1 && (
                <div className="w-0.5 h-5 my-1" style={{ background: G5 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Quick Links Sidebar ──────────────────────────────────────────────────────
function QuickLinks() {
  const links = [
    { to: '/innovation/applications',   icon: '📋', label: 'My Applications'     },
    { to: '/innovation/saved',          icon: '🔖', label: 'Saved Opportunities' },
    { to: '/innovation/collaborations', icon: '🤝', label: 'My Collaborations'   },
    { to: '/innovation/certificates',   icon: '🏅', label: 'Results & Certificates'},
  ];
  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
          <span>⚡</span> Quick Links
        </h3>
        <div className="space-y-1">
          {links.map(({ to, icon, label }) => (
            <Link key={to} to={to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-800 dark:hover:text-green-300 transition-colors group">
              <span className="text-base group-hover:scale-110 transition-transform">{icon}</span>
              <span>{label}</span>
              <span className="ml-auto text-gray-300 group-hover:text-green-500 text-xs">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Promo card */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-green-200 dark:border-green-900"
        style={{ background: `linear-gradient(135deg,${G9} 0%,${G7} 60%,${G5} 100%)` }}>
        <div className="p-5 text-white space-y-3">
          <div className="text-4xl text-center">🌾</div>
          <h4 className="font-display font-bold text-center text-sm leading-snug">
            Together for a Sustainable Future
          </h4>
          <p className="text-green-200 text-xs text-center leading-relaxed">
            Innovation, collaboration and evidence-based decisions for better land governance and agricultural growth.
          </p>
          <Link to="/about"
            className="block text-center py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-lg transition-colors border border-white/30">
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Innovation Portal Footer ─────────────────────────────────────────────────
function InnoFooter() {
  const cols = [
    { head: '📚 More Research',      items: ['Stronger Evidence', 'Better Analysis', 'Data-Driven Policy'] },
    { head: '🤝 More Collaboration', items: ['Greater Innovation', 'Shared Knowledge', 'Open Science']     },
    { head: '🌱 Better Governance',  items: ['Sustainable Future', 'Inclusive Growth', 'Land for All']    },
  ];
  return (
    <div className="py-12 px-4 text-white" style={{ background: G9 }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {cols.map(({ head, items }) => (
            <div key={head}>
              <h4 className="font-display font-bold text-base mb-3" style={{ color: '#6ee7b7' }}>{head}</h4>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="text-sm text-green-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#6ee7b7' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-green-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-green-300 text-xs">
            Innovation Portal · Bharat Land – National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance
          </p>
          <p className="font-display font-bold text-sm" style={{ color: '#6ee7b7' }}>
            Innovate | Collaborate | Create Impact
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function InnovationPage() {
  const [search,      setSearch]      = useState('');
  const [filterType,  setFilterType]  = useState('');
  const [showAll,     setShowAll]     = useState(false);

  const counts = useMemo(() =>
    Object.fromEntries(OPPORTUNITY_TYPES.map((t) => [t.key, OPPORTUNITIES.filter((o) => o.type === t.key).length])),
    []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return OPPORTUNITIES.filter((o) => {
      if (filterType && o.type !== filterType) return false;
      if (q && ![o.title, o.description, o.category, o.location || '', ...(o.tags || [])].join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, filterType]);

  const displayed = showAll ? filtered : filtered.filter((o) => o.featured || filtered.length <= 4);
  const featuredList = filtered.filter((o) => o.featured);
  const allList      = filtered;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden py-16 px-4"
        style={{ background: `linear-gradient(135deg,${G9} 0%,${G7} 55%,${G5} 100%)` }}>
        {/* Decorative bg circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#fff', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: '#fff', transform: 'translate(-30%,30%)' }} />

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-green-300 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Innovation Portal</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌾</span>
                <DemoBadge text="Demo Platform" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-4">
                Innovation Portal
              </h1>
              <p className="text-green-100 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                Discover opportunities, participate in challenges and turn agricultural research into real-world solutions.
              </p>

              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setShowAll(true); }}
                    placeholder="Search opportunities, e.g. soil, crop, land, water, climate..."
                    className="w-full pl-9 pr-9 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 shadow-sm"
                    style={{ '--tw-ring-color': G5 }}
                  />
                  {search && (
                    <button onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg">×</button>
                  )}
                </div>
                <select
                  value={filterType}
                  onChange={(e) => { setFilterType(e.target.value); setShowAll(true); }}
                  className="py-3 px-4 bg-white rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 shadow-sm flex-shrink-0"
                >
                  <option value="">All Types</option>
                  {OPPORTUNITY_TYPES.map((t) => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
                <button
                  className="py-3 px-6 rounded-xl font-bold text-sm text-white shadow-sm transition-colors flex-shrink-0"
                  style={{ background: '#065f46' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#064e3b'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#065f46'}
                  onClick={() => setShowAll(true)}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Right — visual stats */}
            <div className="lg:col-span-5 hidden lg:flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: OPPORTUNITIES.length, label: 'Total Opportunities', icon: '💡'  },
                  { v: OPPORTUNITIES.filter((o) => o.status === 'open').length,     label: 'Open Now',         icon: '🟢' },
                  { v: OPPORTUNITIES.filter((o) => o.status === 'upcoming').length, label: 'Upcoming',         icon: '🔜' },
                  { v: OPPORTUNITY_TYPES.length, label: 'Categories',               icon: '📂' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <p className="text-2xl mb-1">{s.icon}</p>
                    <p className="text-xl font-bold text-white">{s.v}</p>
                    <p className="text-green-200 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── LEFT / MAIN COLUMN ─────────────────────────────────── */}
          <div className="lg:col-span-9 space-y-10">

            {/* ── CATEGORY CARDS ─────────────────────────────────── */}
            <section>
              <h2 className="text-xl font-display font-bold mb-5" style={{ color: G9 }}>
                Explore by Category
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {OPPORTUNITY_TYPES.map((type) => (
                  <CategoryCard
                    key={type.key} type={type}
                    count={counts[type.key]}
                    onFilter={(key) => { setFilterType(key === filterType ? '' : key); setShowAll(true); }}
                  />
                ))}
              </div>
            </section>

            {/* ── ACTIVE FILTER / SEARCH NOTICE ──────────────────── */}
            {(search || filterType) && (
              <div className="flex items-center justify-between flex-wrap gap-3 -mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filtered.length} opportunit{filtered.length !== 1 ? 'ies' : 'y'} found
                  {search && <span> for "<strong className="text-gray-800 dark:text-gray-200">{search}</strong>"</span>}
                  {filterType && <span> in <strong className="text-gray-800 dark:text-gray-200">{TYPE_LABEL[filterType]}</strong></span>}
                </p>
                <button onClick={() => { setSearch(''); setFilterType(''); setShowAll(false); }}
                  className="text-sm text-green-700 dark:text-green-400 font-medium hover:underline">
                  Clear filters ×
                </button>
              </div>
            )}

            {/* ── FEATURED / ALL OPPORTUNITIES ───────────────────── */}
            {!showAll && !search && !filterType ? (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-display font-bold" style={{ color: G9 }}>
                    Featured Opportunities
                  </h2>
                  <button onClick={() => setShowAll(true)}
                    className="text-sm font-medium hover:underline transition-colors"
                    style={{ color: G9 }}>
                    View All ({OPPORTUNITIES.length}) →
                  </button>
                </div>

                {featuredList.length === 0 ? (
                  <div className="card p-12 text-center">
                    <p className="text-4xl mb-2">🔍</p>
                    <p className="text-gray-500">No featured opportunities at the moment.</p>
                    <button onClick={() => setShowAll(true)} className="btn-primary mt-4 text-sm">View All Opportunities</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {featuredList.map((opp) => <OpportunityCard key={opp.id} opp={opp} />)}
                  </div>
                )}
              </section>
            ) : (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-display font-bold" style={{ color: G9 }}>
                    {search || filterType ? 'Search Results' : 'All Opportunities'}
                  </h2>
                  {showAll && !search && !filterType && (
                    <button onClick={() => setShowAll(false)}
                      className="text-sm font-medium hover:underline" style={{ color: G9 }}>
                      ← Show Featured
                    </button>
                  )}
                </div>

                {allList.length === 0 ? (
                  <div className="card p-12 text-center">
                    <p className="text-4xl mb-2">🔍</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No opportunities found</p>
                    <p className="text-sm text-gray-500 mb-4">Try a different search term or clear the filter.</p>
                    <button onClick={() => { setSearch(''); setFilterType(''); setShowAll(false); }} className="btn-primary text-sm">
                      Reset
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {allList.map((opp) => <OpportunityCard key={opp.id} opp={opp} />)}
                  </div>
                )}
              </section>
            )}

            {/* ── LANDVAULT FEATURE CARD ─────────────────────────── */}
            <div className="rounded-2xl overflow-hidden border-2 border-emerald-200 dark:border-emerald-800 shadow-sm">
              <div className="flex flex-col sm:flex-row items-stretch">
                {/* Left colour panel */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center gap-3 px-8 py-6 text-white sm:w-48"
                  style={{ background: 'linear-gradient(160deg,#0f5c3a 0%,#1a7a4e 60%,#2e9e68 100%)' }}>
                  <span className="text-5xl">📡</span>
                  <span className="badge bg-white/20 text-white text-xs border border-white/30 text-center">
                    Low-Connectivity Innovation
                  </span>
                </div>
                {/* Right content */}
                <div className="flex-1 p-5 bg-white dark:bg-gray-900 flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-lg" style={{ color: '#0f5c3a' }}>
                      LandVault Offline
                    </h3>
                    <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
                      ✨ New Feature
                    </span>
                    <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                      PWA Ready
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Access saved research papers, policies, datasets, case studies, and land-governance
                    knowledge even with limited or no internet connectivity. Your offline intelligence library.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">🟢 28 Resources Cached</span>
                    <span className="flex items-center gap-1">🤖 AI Summaries Offline</span>
                    <span className="flex items-center gap-1">🗺️ Offline GIS Layers</span>
                    <span className="flex items-center gap-1">🔄 Auto Sync</span>
                  </div>
                  <div className="pt-1">
                    <Link
                      to="/landvault"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-colors"
                      style={{ background: '#0f5c3a' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#1a7a4e'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#0f5c3a'}
                    >
                      📡 Open Offline Center →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo notice */}
            <div className="card p-4 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>⚠️ Demo Platform:</strong> All opportunities shown are sample data for demonstration only. They do not represent real government programmes or funding opportunities.
              </p>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ─────────────────────────────────────── */}
          <aside className="lg:col-span-3">
            <QuickLinks />
          </aside>
        </div>
      </div>

      {/* ── IMPACT FLOW ───────────────────────────────────────────────── */}
      <ImpactFlow />

      {/* ── INNOVATION FOOTER ─────────────────────────────────────────── */}
      <InnoFooter />
    </div>
  );
}
