import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import analyticsService from '../../services/analyticsService';
import { formatNumber } from '../../utils/helpers';

/* ── Animated SVG tree ─────────────────────────────────────────────────────── */
const SWAY_DURATIONS = [2.8, 3.2, 2.5, 3.5, 2.9, 3.1, 2.7, 3.3, 2.6, 3.0, 2.8, 3.4, 2.5, 3.2, 2.9, 3.0];
const Tree = ({ x, y, h = 38, color = '#2d6a4f', sway = false, swayIdx = 0 }) => {
  const dur = SWAY_DURATIONS[swayIdx % SWAY_DURATIONS.length];
  return (
    <g transform={`translate(${x},${y})`}
      style={sway ? { animation: `sway ${dur}s ease-in-out infinite alternate` } : {}}>
      <rect x={-3} y={h * 0.55} width={6} height={h * 0.45} fill="#7c5c3e" rx={2} />
      <polygon points={`0,0 ${h * 0.45},${h * 0.55} ${-h * 0.45},${h * 0.55}`} fill={color} opacity={0.92} />
      <polygon points={`0,${h * 0.15} ${h * 0.38},${h * 0.62} ${-h * 0.38},${h * 0.62}`} fill={color} opacity={0.85} />
    </g>
  );
};

/* ── Land category tile ────────────────────────────────────────────────────── */
const LandTile = ({ label, color, icon, pct, delay = 0 }) => (
  <div
    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/20 backdrop-blur-sm hover:scale-105 transition-transform cursor-default"
    style={{ background: `${color}22`, borderColor: `${color}55`, animationDelay: `${delay}s` }}
  >
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-white text-xs font-semibold leading-tight">{label}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-1 rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
        </div>
        <span className="text-white/60 text-xs">{pct}%</span>
      </div>
    </div>
  </div>
);

/* ── Floating stat pill ────────────────────────────────────────────────────── */
const FloatPill = ({ icon, label, value, style }) => (
  <div className="absolute flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg text-white pointer-events-none" style={style}>
    <span className="text-lg">{icon}</span>
    <div>
      <p className="text-xs text-white/60 leading-none">{label}</p>
      <p className="text-sm font-bold leading-tight mt-0.5">{value}</p>
    </div>
  </div>
);

const HeroSection = () => {
  const [activeLayer, setActiveLayer] = useState('forest');

  const layers = [
    { id: 'forest',  label: 'Forest Land',        icon: '🌳', color: '#22c55e',  desc: '65.9M km² forest cover across India' },
    { id: 'agri',    label: 'Agricultural Land',   icon: '🌾', color: '#f59e0b',  desc: '167.8M km² of cultivated land' },
    { id: 'urban',   label: 'Urban Land',          icon: '🏙️', color: '#f97316', desc: '43.2M km² built-up urban area' },
    { id: 'water',   label: 'Water Bodies',        icon: '💧', color: '#3b82f6',  desc: '13.2M km² rivers, lakes & wetlands' },
    { id: 'dispute', label: 'Disputed Land',       icon: '⚖️', color: '#ef4444', desc: '21,844+ active land disputes tracked' },
  ];

  const active = layers.find((l) => l.id === activeLayer) || layers[0];

  // Sky & ground colours per layer
  const themes = {
    forest:  { sky: 'from-emerald-900 via-green-800 to-teal-700',   ground: 'from-green-800 to-green-950',   horizon: '#14532d' },
    agri:    { sky: 'from-amber-900 via-yellow-800 to-orange-700',  ground: 'from-yellow-800 to-amber-950',  horizon: '#78350f' },
    urban:   { sky: 'from-slate-900 via-gray-800 to-zinc-700',      ground: 'from-gray-700 to-gray-950',     horizon: '#1f2937' },
    water:   { sky: 'from-blue-900 via-cyan-800 to-sky-700',        ground: 'from-blue-800 to-blue-950',     horizon: '#1e3a5f' },
    dispute: { sky: 'from-red-900 via-orange-800 to-amber-700',     ground: 'from-red-800 to-red-950',       horizon: '#7f1d1d' },
  };
  const t = themes[activeLayer] || themes.forest;

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '88vh' }}>
      {/* ── Dynamic sky gradient ── */}
      <div className={`absolute inset-0 bg-gradient-to-b ${t.sky} transition-all duration-700`} />

      {/* ── Animated stars/particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(28)].map((_, i) => (
          <div key={i}
            className="absolute rounded-full bg-white/30"
            style={{
              width: `${1 + (i % 3)}px`, height: `${1 + (i % 3)}px`,
              left: `${(i * 37) % 100}%`, top: `${(i * 19) % 50}%`,
              animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* ── SVG landscape scene ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={t.horizon} stopOpacity="1" />
              <stop offset="100%" stopColor={t.horizon} stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Far hills */}
          <path d="M0,200 Q200,100 400,160 Q600,220 800,130 Q1000,40 1200,130 Q1350,190 1440,140 L1440,320 L0,320 Z"
            fill={t.horizon} opacity={0.35} />

          {/* Mid hills */}
          <path d="M0,240 Q180,170 360,210 Q540,250 720,180 Q900,110 1080,190 Q1260,270 1440,200 L1440,320 L0,320 Z"
            fill={t.horizon} opacity={0.55} />

          {/* Ground */}
          <path d="M0,270 Q360,230 720,255 Q1080,280 1440,260 L1440,320 L0,320 Z"
            fill="url(#groundGrad)" opacity={1} />

          {/* Trees — shown for forest/agri layers */}
          {(activeLayer === 'forest' || activeLayer === 'agri') && (
            <>
              <Tree x={80}   y={240} h={52} color={activeLayer === 'forest' ? '#166534' : '#92400e'} sway swayIdx={0} />
              <Tree x={160}  y={248} h={44} color={activeLayer === 'forest' ? '#14532d' : '#78350f'} sway swayIdx={1} />
              <Tree x={240}  y={242} h={58} color={activeLayer === 'forest' ? '#15803d' : '#a16207'} swayIdx={2} />
              <Tree x={310}  y={252} h={36} color={activeLayer === 'forest' ? '#166534' : '#854d0e'} sway swayIdx={3} />
              <Tree x={1100} y={244} h={50} color={activeLayer === 'forest' ? '#14532d' : '#78350f'} sway swayIdx={4} />
              <Tree x={1180} y={250} h={42} color={activeLayer === 'forest' ? '#15803d' : '#a16207'} swayIdx={5} />
              <Tree x={1260} y={245} h={56} color={activeLayer === 'forest' ? '#166534' : '#854d0e'} sway swayIdx={6} />
              <Tree x={1340} y={252} h={38} color={activeLayer === 'forest' ? '#14532d' : '#92400e'} sway swayIdx={7} />
              {activeLayer === 'forest' && (
                <>
                  <Tree x={520}  y={260} h={30} color="#166534" sway swayIdx={8} />
                  <Tree x={920}  y={258} h={34} color="#14532d" sway swayIdx={9} />
                  <Tree x={680}  y={262} h={28} color="#15803d" swayIdx={10} />
                </>
              )}
            </>
          )}

          {/* Urban skyline */}
          {activeLayer === 'urban' && (
            <>
              {[[100,160,40,80],[170,180,30,60],[230,140,50,100],[320,170,35,70],[410,150,45,90],
                [1050,155,45,90],[1140,175,32,64],[1210,145,48,96],[1300,165,38,76],[1380,148,42,84]
              ].map(([x, y, w, h], i) => (
                <g key={i}>
                  <rect x={x} y={y} width={w} height={h} fill="#374151" opacity={0.9} />
                  {[...Array(3)].map((_, r) =>
                    [...Array(2)].map((_, c) => (
                      <rect key={`${r}-${c}`} x={x + 6 + c * 12} y={y + 8 + r * 20} width={6} height={10}
                        fill={Math.random() > 0.4 ? '#fbbf24' : '#374151'} opacity={0.9} />
                    ))
                  )}
                </g>
              ))}
            </>
          )}

          {/* Water ripples */}
          {activeLayer === 'water' && (
            <>
              {[[200,290,120],[500,298,80],[850,285,100],[1200,295,90]].map(([cx,cy,rx],i) => (
                <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={12} fill="#38bdf8" opacity={0.25} />
              ))}
              <path d="M0,295 Q360,280 720,295 Q1080,310 1440,295 L1440,320 L0,320 Z" fill="#0ea5e9" opacity={0.35} />
            </>
          )}

          {/* Dispute markers */}
          {activeLayer === 'dispute' && (
            <>
              {[[300,255],[600,248],[900,252],[1150,257]].map(([x,y],i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r={14} fill="#ef4444" opacity={0.8} />
                  <text x={x} y={y+5} textAnchor="middle" fontSize="14" fill="white">⚠</text>
                </g>
              ))}
            </>
          )}

          {/* Agricultural crops pattern */}
          {activeLayer === 'agri' && (
            <>
              {[...Array(20)].map((_, i) => (
                <g key={i}>
                  <line x1={420 + i * 32} y1={268} x2={420 + i * 32} y2={285} stroke="#a16207" strokeWidth={2} opacity={0.6} />
                  <ellipse cx={420 + i * 32} cy={262} rx={6} ry={10} fill="#f59e0b" opacity={0.5} />
                </g>
              ))}
            </>
          )}
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 pt-16 pb-56 sm:pb-64 flex flex-col lg:flex-row items-start lg:items-center gap-12">

        {/* Left — text */}
        <div className="flex-1 text-white">
          {/* Tricolor bar */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-5 h-1.5 bg-orange-500 rounded-full" />
            <span className="w-5 h-1.5 bg-white rounded-full" />
            <span className="w-5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-white/60 text-sm ml-2 font-medium">Government of India Initiative</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 max-w-2xl drop-shadow-lg">
            National Digital Platform for{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${active.color}, #fbbf24)` }}>
              Land Research
            </span>{' '}
            & Policy Innovation
          </h1>

          <p className="text-white/80 text-lg mb-3 max-w-xl leading-relaxed">
            Empowering evidence-based land governance through research, geospatial intelligence, AI and collaborative innovation.
          </p>
          <p className="text-white/50 text-sm mb-8 font-mono tracking-wide">
            DATA → RESEARCH → AI → GIS → INSIGHTS → POLICY
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link to="/research"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-gray-100 transition-all hover:scale-105 text-sm">
              📄 Explore Research
            </Link>
            <Link to="/gis-map"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-all text-sm backdrop-blur-sm">
              🗺️ GIS Map
            </Link>
            <Link to="/ai-assistant"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-all text-sm backdrop-blur-sm">
              🤖 AI Assistant
            </Link>
            <Link to="/datasets"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-all text-sm backdrop-blur-sm">
              💾 Datasets
            </Link>
          </div>

          {/* Demo badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 border border-amber-400/30 rounded-lg text-amber-300 text-xs">
            ⚠️ SIH26019 Prototype – All data is for demonstration purposes only
          </div>
        </div>

        {/* Right — interactive land type selector */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">
              🗺️ India Land Categories
            </p>

            {/* Active description */}
            <div className="mb-4 p-3 rounded-xl border border-white/10 text-center transition-all duration-300"
              style={{ background: `${active.color}22` }}>
              <span className="text-3xl block mb-1">{active.icon}</span>
              <p className="text-white font-semibold text-sm">{active.label}</p>
              <p className="text-white/60 text-xs mt-1">{active.desc}</p>
            </div>

            {/* Layer selector buttons */}
            <div className="space-y-2">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
                  style={activeLayer === layer.id
                    ? { background: `${layer.color}33`, border: `1px solid ${layer.color}88`, boxShadow: `0 0 12px ${layer.color}44` }
                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
                  }
                >
                  <span className="text-lg flex-shrink-0">{layer.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{layer.label}</p>
                  </div>
                  {activeLayer === layer.id && (
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: layer.color }} />
                  )}
                </button>
              ))}
            </div>

            {/* Land use mini-bars */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/50 text-xs mb-3">Land use distribution (Demo)</p>
              {[
                { label: '🌾 Agricultural', pct: 46, color: '#f59e0b' },
                { label: '🌳 Forest',       pct: 21, color: '#22c55e' },
                { label: '🏙️ Urban',       pct: 12, color: '#f97316' },
                { label: '💧 Water',        pct: 4,  color: '#3b82f6' },
                { label: '🏜️ Wasteland',   pct: 17, color: '#9ca3af' },
              ].map(({ label, pct: p, color }) => (
                <div key={label} className="flex items-center gap-2 mb-1.5">
                  <span className="text-white/60 text-xs w-24 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-1.5 rounded-full" style={{ width: `${p}%`, background: color }} />
                  </div>
                  <span className="text-white/50 text-xs w-7 text-right">{p}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating info pills over landscape ── */}
      <div className="absolute bottom-40 left-0 right-0 pointer-events-none hidden lg:block">
        <div className="max-w-screen-xl mx-auto px-6 relative h-20">
          <FloatPill icon="🌳" label="Forest Cover" value="65.9M km²" style={{ left: '5%', bottom: 0 }} />
          <FloatPill icon="🌾" label="Agricultural" value="167.8M km²" style={{ left: '22%', bottom: 10 }} />
          <FloatPill icon="🏙️" label="Urban Area" value="43.2M km²" style={{ left: '42%', bottom: 0 }} />
          <FloatPill icon="💧" label="Water Bodies" value="13.2M km²" style={{ right: '20%', bottom: 10 }} />
          <FloatPill icon="⚖️" label="Land Disputes" value="21,844+" style={{ right: '4%', bottom: 0 }} />
        </div>
      </div>

      {/* ── Inline keyframes ── */}
      <style>{`
        @keyframes sway {
          from { transform: rotate(-2deg); }
          to   { transform: rotate(2deg);  }
        }
      `}</style>
    </section>
  );
};

const StatsSection = ({ stats }) => {
  const items = [
    { icon: '📄', label: 'Research Papers', value: stats?.research || 0, color: 'text-blue-400' },
    { icon: '💾', label: 'Datasets', value: stats?.datasets || 0, color: 'text-emerald-400' },
    { icon: '📋', label: 'Policy Documents', value: stats?.policies || 0, color: 'text-orange-400' },
    { icon: '📚', label: 'Case Studies', value: stats?.caseStudies || 0, color: 'text-purple-400' },
    { icon: '🤝', label: 'Research Projects', value: stats?.projects || 0, color: 'text-pink-400' },
    { icon: '🔬', label: 'Researchers', value: stats?.researchers || 0, color: 'text-teal-400' },
  ];

  return (
    <section className="bg-white dark:bg-gray-900 py-12 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map(({ icon, label, value, color }) => (
            <div key={label} className="text-center p-4">
              <div className={`text-3xl mb-2 ${color}`}>{icon}</div>
              <div className="text-2xl font-bold font-display text-gray-900 dark:text-white">
                {formatNumber(value)}+
              </div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, link, linkLabel, color }) => (
  <div className="card-hover p-6 group">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-4">{description}</p>
    <Link to={link} className="text-primary-700 dark:text-primary-400 text-sm font-medium hover:underline">
      {linkLabel} →
    </Link>
  </div>
);

const ResearchCard = ({ research }) => (
  <Link to={`/research/${research._id}`} className="card-hover p-5 block group">
    <div className="flex items-start justify-between mb-3">
      <span className="badge-blue text-xs">{research.category}</span>
      <span className="text-xs text-gray-400">{research.publicationYear}</span>
    </div>
    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 text-sm mb-2 line-clamp-2">
      {research.title}
    </h3>
    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{research.abstract}</p>
    <div className="flex items-center justify-between text-xs text-gray-400">
      <span>{research.institution}</span>
      <span>👁️ {research.viewCount || 0}</span>
    </div>
  </Link>
);

export default function HomePage() {
  const [stats, setStats] = useState({});
  const [latestResearch, setLatestResearch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, researchRes] = await Promise.all([
          analyticsService.getPlatformStats(),
          api.get('/research', { params: { limit: 6, sort: '-createdAt' } }),
        ]);
        setStats(statsRes.data.data);
        setLatestResearch(researchRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const features = [
    {
      icon: '📄', title: 'Research Repository',
      description: 'Discover thousands of research papers on land governance, GIS analysis, agricultural management, and more.',
      link: '/research', linkLabel: 'Browse Research', color: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      icon: '💾', title: 'Land Datasets',
      description: 'Access comprehensive land-use, climate, agricultural, and geospatial datasets from government and research sources.',
      link: '/datasets', linkLabel: 'Browse Datasets', color: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
    {
      icon: '🗺️', title: 'GIS Intelligence',
      description: 'Explore India\'s land landscape through interactive GIS maps with layers for agricultural, urban, forest, and climate data.',
      link: '/gis-map', linkLabel: 'Open GIS Map', color: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      icon: '📊', title: 'Analytics Dashboard',
      description: 'Visualize land use trends, climate resilience data, dispute statistics, and policy performance through interactive charts.',
      link: '/analytics', linkLabel: 'View Analytics', color: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      icon: '🤖', title: 'AI Research Assistant',
      description: 'Get AI-powered insights on land governance research, policy analysis, trend identification, and literature synthesis.',
      link: '/ai-assistant', linkLabel: 'Try AI Assistant', color: 'bg-pink-100 dark:bg-pink-900/20',
    },
    {
      icon: '📋', title: 'Policy Repository',
      description: 'Search and compare government policies and legal documents related to land governance, acquisition, and development.',
      link: '/policies', linkLabel: 'View Policies', color: 'bg-teal-100 dark:bg-teal-900/20',
    },
    {
      icon: '📚', title: 'Case Studies',
      description: 'Learn from real-world land governance interventions across India — challenges, solutions, and measurable impacts.',
      link: '/case-studies', linkLabel: 'Read Case Studies', color: 'bg-amber-100 dark:bg-amber-900/20',
    },
    {
      icon: '💡', title: 'Innovation Portal',
      description: 'Discover hackathons, research grants, pilot projects and innovation opportunities in land governance technology.',
      link: '/innovation', linkLabel: 'Explore Innovation', color: 'bg-rose-100 dark:bg-rose-900/20',
    },
  ];

  return (
    <div>
      <HeroSection />
      <StatsSection stats={stats} />

      {/* Features Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
              Everything You Need for Land Governance Research
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              A comprehensive platform combining research, data, geospatial intelligence and AI to support evidence-based land governance in India.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* Latest Research */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Latest Research</h2>
              <p className="text-gray-500 text-sm mt-1">Recent publications on land governance and management</p>
            </div>
            <Link to="/research" className="btn-secondary text-sm">View All →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-3 w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestResearch.map((r) => <ResearchCard key={r._id} research={r} />)}
            </div>
          )}
        </div>
      </section>

      {/* GIS Preview Banner */}
      <section className="py-16 bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="badge-blue text-xs mb-4 inline-block bg-white/20 text-white border-white/20">🗺️ Geospatial Intelligence</span>
            <h2 className="text-3xl font-display font-bold mb-4">Interactive GIS Land Map</h2>
            <p className="text-primary-200 leading-relaxed mb-6">
              Explore land use across India with interactive maps. Select any state to view agricultural land, urban areas, forests, water bodies, climate vulnerability zones, and active land disputes.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Agricultural Land', 'Urban Areas', 'Forest Cover', 'Water Bodies', 'Climate Vulnerability', 'Land Disputes'].map((l) => (
                <span key={l} className="px-3 py-1 bg-white/15 border border-white/20 rounded-full text-xs">{l}</span>
              ))}
            </div>
            <Link to="/gis-map" className="btn-outline">Open GIS Map →</Link>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm h-64 bg-primary-800/50 rounded-2xl border border-white/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-3">🗺️</div>
                <p className="text-primary-300 text-sm">Interactive India Land Map</p>
                <p className="text-primary-400 text-xs mt-1">Click to explore GIS data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="py-16 bg-gradient-to-br from-purple-900 to-primary-900 text-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-6">🤖</div>
          <h2 className="text-3xl font-display font-bold mb-4">AI-Powered Research Assistant</h2>
          <p className="text-purple-200 max-w-2xl mx-auto mb-8 text-lg">
            Ask questions about land governance, get research summaries, identify trends, and discover relevant policies — powered by AI analysis of the knowledge base.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {[
              '"Show research on land disputes"',
              '"Climate vulnerability in Karnataka"',
              '"Summarize this research paper"',
              '"Urban land management policies"',
            ].map((q) => (
              <Link key={q} to="/ai-assistant" className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm hover:bg-white/20 transition-colors">
                {q}
              </Link>
            ))}
          </div>
          <Link to="/ai-assistant" className="btn-primary bg-purple-600 hover:bg-purple-700 py-3 px-8 text-base shadow-lg">
            🤖 Try AI Research Assistant
          </Link>
          <p className="text-purple-400 text-xs mt-4">Demo AI – responses based on prototype data for illustration purposes</p>
        </div>
      </section>

      {/* Innovation Banner */}
      <section className="py-12 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">Innovation & Opportunities</h2>
          <p className="text-gray-500 mb-6">Hackathons, research grants, pilot projects and more</p>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {[
              { icon: '🏆', label: 'Hackathons' },
              { icon: '💰', label: 'Grants' },
              { icon: '🧪', label: 'Pilot Projects' },
              { icon: '🎯', label: 'Challenges' },
            ].map(({ icon, label }) => (
              <div key={label} className="card px-6 py-4 flex items-center gap-2">
                <span className="text-2xl">{icon}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
              </div>
            ))}
          </div>
          <Link to="/innovation" className="btn-primary">Explore Innovation Portal →</Link>
        </div>
      </section>
    </div>
  );
}
