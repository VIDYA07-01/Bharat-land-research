import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import SearchBar from '../../components/common/SearchBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useDebounce from '../../hooks/useDebounce';
import { useEffect } from 'react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const debouncedQuery = useDebounce(query, 600);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setResults(null); return; }
    const search = async () => {
      setLoading(true);
      try {
        const params = { q: debouncedQuery };
        if (type) params.type = type;
        const { data } = await api.get('/search', { params });
        setResults(data);
        setSearchParams({ q: debouncedQuery });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    search();
  }, [debouncedQuery, type]);

  const totalResults = results ? (
    (results.data?.research?.length || 0) +
    (results.data?.datasets?.length || 0) +
    (results.data?.policies?.length || 0) +
    (results.data?.caseStudies?.length || 0)
  ) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-2 text-center">Search Land Knowledge</h1>
          <p className="text-primary-200 text-center mb-6">Search across research, datasets, policies, and case studies</p>
          <SearchBar value={query} onChange={setQuery} placeholder="Search everything – research, datasets, policies, case studies..." />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Type filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[['', 'All'], ['research', 'Research'], ['datasets', 'Datasets'], ['policies', 'Policies'], ['casestudies', 'Case Studies']].map(([v, l]) => (
            <button key={v} onClick={() => setType(v)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${type === v ? 'bg-primary-700 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}>
              {l}
            </button>
          ))}
        </div>

        {loading && <LoadingSpinner text="Searching..." />}

        {results && !loading && (
          <div className="space-y-8">
            <p className="text-sm text-gray-500">{totalResults} results for "<strong>{results.query}</strong>"</p>

            {results.data?.research?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">📄 Research Papers <span className="badge-blue">{results.data.research.length}</span></h2>
                <div className="space-y-2">
                  {results.data.research.map((r) => (
                    <Link key={r._id} to={`/research/${r._id}`} className="card-hover p-4 block">
                      <h3 className="font-medium text-gray-900 dark:text-white hover:text-primary-700 mb-1">{r.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{r.abstract}</p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-400">
                        <span>{r.institution}</span><span>{r.publicationYear}</span><span className="badge-blue">{r.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.data?.datasets?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">💾 Datasets <span className="badge-green">{results.data.datasets.length}</span></h2>
                <div className="space-y-2">
                  {results.data.datasets.map((d) => (
                    <Link key={d._id} to={`/datasets/${d._id}`} className="card-hover p-4 block">
                      <h3 className="font-medium text-gray-900 dark:text-white hover:text-primary-700">{d.name}</h3>
                      <p className="text-sm text-gray-500">{d.category} • {d.state} • {d.year}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.data?.policies?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">📋 Policies <span className="badge-orange">{results.data.policies.length}</span></h2>
                <div className="space-y-2">
                  {results.data.policies.map((p) => (
                    <Link key={p._id} to={`/policies/${p._id}`} className="card-hover p-4 block">
                      <h3 className="font-medium text-gray-900 dark:text-white hover:text-primary-700">{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.department} • {p.year}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.data?.caseStudies?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">📚 Case Studies <span className="badge-purple">{results.data.caseStudies.length}</span></h2>
                <div className="space-y-2">
                  {results.data.caseStudies.map((c) => (
                    <Link key={c._id} to={`/case-studies/${c._id}`} className="card-hover p-4 block">
                      <h3 className="font-medium text-gray-900 dark:text-white hover:text-primary-700">{c.title}</h3>
                      <p className="text-sm text-gray-500">{c.location?.state}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {totalResults === 0 && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <p>No results found for "{results.query}"</p>
                <p className="text-sm mt-1">Try different keywords or broaden your search</p>
              </div>
            )}
          </div>
        )}

        {!results && !loading && query.length < 2 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg">Start typing to search across the knowledge base</p>
            <p className="text-sm mt-2">Research papers, datasets, policies, case studies</p>
          </div>
        )}
      </div>
    </div>
  );
}
