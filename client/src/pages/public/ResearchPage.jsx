import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import researchService from '../../services/researchService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import {
  RESEARCH_DEMO_RECORDS,
  RESEARCH_DEMO_STATS,
  RESEARCH_FILTERS,
} from '../../utils/researchDemoData';

const DemoBadge = ({ children = 'DEMO / FICTIONAL DATA' }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
    {children}
  </span>
);

const StatCard = ({ value, label }) => (
  <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="mt-1 text-xs text-blue-100">{label}</p>
  </div>
);

const ResearchCard = ({ item }) => (
  <article className="card-hover flex flex-col gap-4 p-5">
    <div className="flex items-start justify-between gap-3">
      <span className="badge-blue">{item.researchType || 'Research Paper'}</span>
      <DemoBadge>DEMO</DemoBadge>
    </div>
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-600">{item.researchId || item._id}</p>
      <Link to={`/research/${item._id}`}>
        <h3 className="text-lg font-semibold leading-snug text-gray-900 transition-colors hover:text-primary-700 dark:text-white">{item.title}</h3>
      </Link>
    </div>
    <p className="line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.abstract}</p>
    <div className="grid grid-cols-2 gap-3 border-y border-gray-100 py-3 text-xs dark:border-gray-700">
      <div><span className="block text-gray-400">Authors</span><span className="font-medium text-gray-700 dark:text-gray-200">{item.authors?.map((author) => author.name).join(', ')}</span></div>
      <div><span className="block text-gray-400">Study area</span><span className="font-medium text-gray-700 dark:text-gray-200">{item.studyArea || 'Demo study area'}</span></div>
      <div><span className="block text-gray-400">Year</span><span className="font-medium text-gray-700 dark:text-gray-200">{item.publicationYear || 2026}</span></div>
      <div><span className="block text-gray-400">Evidence status</span><span className="font-medium text-emerald-700">{item.evidenceStatus || 'Demo data'}</span></div>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {(item.keywords || []).map((keyword) => <span key={keyword} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">{keyword}</span>)}
    </div>
    <div className="mt-auto flex flex-wrap gap-2 pt-1">
      <Link to={`/research/${item._id}`} className="btn-primary px-3 py-2 text-xs">Read Paper</Link>
      <Link to={`/datasets?research=${item.researchId || item._id}`} className="btn-secondary px-3 py-2 text-xs">View Dataset</Link>
      <Link to={`/gis-map?research=${item.researchId || item._id}`} className="btn-secondary px-3 py-2 text-xs">View GIS</Link>
    </div>
  </article>
);

export default function ResearchPage() {
  const [apiRecords, setApiRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ researchType: '', domain: '', dataType: '', methodology: '', year: '' });
  const [showFilters, setShowFilters] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    researchService.getAll({ page: 1, limit: 12 })
      .then(({ data }) => setApiRecords(data.data || []))
      .catch(() => setApiRecords([]))
      .finally(() => setLoading(false));
  }, []);

  const records = useMemo(() => [...RESEARCH_DEMO_RECORDS, ...apiRecords.filter((item) => item.researchId && !RESEARCH_DEMO_RECORDS.some((demo) => demo.researchId === item.researchId))], [apiRecords]);
  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter((item) => {
      const searchable = [item.title, item.abstract, item.category, item.studyArea, item.methodology, ...(item.keywords || []), ...(item.domain || []), ...(item.authors || []).map((author) => author.name)].join(' ').toLowerCase();
      const yearMatches = !filters.year || (filters.year === 'Before 2023' ? Number(item.publicationYear) < 2023 : String(item.publicationYear) === filters.year);
      return (!query || searchable.includes(query))
        && (!filters.researchType || item.researchType === filters.researchType)
        && (!filters.domain || (item.domain || []).includes(filters.domain) || item.category === filters.domain)
        && (!filters.dataType || (item.dataSources || []).includes(filters.dataType))
        && (!filters.methodology || (item.methodology || '').includes(filters.methodology))
        && yearMatches;
    });
  }, [filters, records, search]);

  const featured = records[0] || RESEARCH_DEMO_RECORDS[0];
  const resetFilters = () => { setFilters({ researchType: '', domain: '', dataType: '', methodology: '', year: '' }); setSearch(''); setPage(1); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <section className="page-header pb-16">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="mb-5 flex items-center gap-2 text-sm text-primary-200"><Link to="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Research Repository</span></div>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Evidence to policy workspace</p><h1 className="text-3xl font-bold sm:text-4xl">Research Repository</h1><p className="mt-3 max-w-2xl text-primary-100">Discover land governance research papers, studies, case studies, and academic publications.</p></div>
            <DemoBadge />
          </div>
          <div className="mt-7 flex max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="min-w-0 flex-1 px-4 py-3 text-sm text-gray-900 outline-none" placeholder="Search by title, abstract, keywords, institution..." />
            <button type="button" className="bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600">Search</button>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{RESEARCH_DEMO_STATS.map(([value, label]) => <StatCard key={label} value={value} label={label} />)}</div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-amber-200">DEMO / FICTIONAL STATISTICS - FOR HACKATHON PROTOTYPE</p>
        </div>
      </section>

      <main className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6">
        <section className="mb-8 grid gap-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm lg:grid-cols-[1.2fr_0.8fr] dark:border-gray-700 dark:bg-gray-800">
          <div className="p-6 sm:p-8"><div className="mb-4 flex flex-wrap items-center gap-2"><DemoBadge>DEMO / FICTIONAL RESEARCH PAPER</DemoBadge><span className="badge-blue">Featured</span></div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary-600">{featured.researchId || 'RES-001'} / {featured.researchType || 'Research Paper'}</p><h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">{featured.title}</h2><p className="mt-3 text-sm text-gray-500">{featured.authors?.map((author) => author.name).join(', ')} · {featured.studyArea}</p><p className="mt-5 leading-7 text-gray-600 dark:text-gray-300">{featured.abstract}</p><div className="mt-6 flex flex-wrap gap-2"><Link to={`/research/${featured._id}`} className="btn-primary">Read Full Paper</Link><Link to={`/datasets?research=${featured.researchId || featured._id}`} className="btn-secondary">View Dataset</Link><Link to={`/gis-map?research=${featured.researchId || featured._id}`} className="btn-secondary">View GIS Map</Link></div><p className="mt-4 text-xs text-amber-700">Navira Valley Demonstration Region is fictional and created only for the hackathon.</p></div>
          <div className="relative flex min-h-[250px] items-end overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-cyan-700 p-6 text-white"><div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(30deg, transparent 45%, rgba(255,255,255,.35) 46%, transparent 47%), linear-gradient(120deg, transparent 45%, rgba(255,255,255,.25) 46%, transparent 47%)', backgroundSize: '54px 54px' }}></div><div className="relative"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Research signal map</p><p className="mt-2 text-xl font-semibold">Evidence + GIS + analysis</p><p className="mt-2 max-w-xs text-sm text-blue-100">A fictional research-to-policy pathway, designed for demonstration.</p></div></div>
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-gray-900 dark:text-white">Advanced filters</h2><p className="text-xs text-gray-500">Filter across the demo research catalog</p></div><div className="flex gap-2"><button type="button" onClick={() => setShowFilters(!showFilters)} className="btn-secondary px-3 py-2 text-xs">{showFilters ? 'Hide filters' : 'Show filters'}</button><button type="button" onClick={resetFilters} className="btn-secondary px-3 py-2 text-xs">Reset Filters</button></div></div>
          {showFilters && <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{Object.entries(RESEARCH_FILTERS).map(([key, options]) => <label key={key} className="text-xs font-semibold capitalize text-gray-500">{key.replace(/([A-Z])/g, ' $1')}<select value={filters[key]} onChange={(event) => { setFilters({ ...filters, [key]: event.target.value }); setPage(1); }} className="input-field mt-1 text-sm font-normal"><option value="">All {key.replace(/([A-Z])/g, ' $1')}</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>)}</div>}
        </section>

        <div className="mb-5 flex items-end justify-between"><div><h2 className="section-title">Research records</h2><p className="mt-1 text-sm text-gray-500">{loading ? 'Loading repository...' : `${filteredRecords.length} demo records match your search`}</p></div><span className="text-xs font-semibold uppercase tracking-wider text-amber-700">All records are fictional</span></div>
        {loading ? <LoadingSpinner text="Loading research repository..." /> : filteredRecords.length === 0 ? <EmptyState icon="📄" title="No research found" description="Try adjusting your search or filters." /> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredRecords.slice((page - 1) * 6, page * 6).map((item) => <ResearchCard key={item._id} item={item} />)}</div>}
        <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(filteredRecords.length / 6))} onPageChange={setPage} />
      </main>
    </div>
  );
}
