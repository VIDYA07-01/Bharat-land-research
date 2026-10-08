import { useState } from 'react';
import api from '../../services/api';
import DemoBadge from '../../components/common/DemoBadge';

const TOOLS = [
  { id: 'summarize', icon: '📝', title: 'Research Summarization', desc: 'Summarize a research paper or text to extract key points' },
  { id: 'trends', icon: '📈', title: 'Trend Analysis', desc: 'Identify and analyze trends in land governance data' },
  { id: 'recommendations', icon: '💡', title: 'Research Recommendations', desc: 'Get recommendations for related research and datasets' },
];

export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState('summarize');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Summarize state
  const [text, setText] = useState('');
  // Trends state
  const [trendParams, setTrendParams] = useState({ category: '', state: '', timeRange: '2015-2024' });
  // Recommendations state
  const [recParams, setRecParams] = useState({ category: '', state: '' });

  const runSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/ai/summarize', { text });
      setResult(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const runTrends = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/ai/trends', trendParams);
      setResult(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const runRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/ai/recommendations', { params: recParams });
      setResult(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">AI Research Tools</h1>
          <p className="text-gray-500 text-sm mt-1">AI-powered tools for research analysis and synthesis</p>
        </div>
        <DemoBadge text="Demo AI Tools" />
      </div>

      {/* Tool Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TOOLS.map(({ id, icon, title, desc }) => (
          <button
            key={id}
            onClick={() => { setActiveTool(id); setResult(null); }}
            className={`p-4 text-left rounded-xl border-2 transition-all ${activeTool === id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 card'}`}
          >
            <div className="text-2xl mb-2">{icon}</div>
            <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">{title}</div>
            <div className="text-xs text-gray-500 mt-1">{desc}</div>
          </button>
        ))}
      </div>

      {/* Tool Interface */}
      <div className="card p-6">
        {activeTool === 'summarize' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">📝 Research Summarization</h2>
            <p className="text-sm text-gray-500">Paste your research abstract or text to get an AI-generated summary with key points.</p>
            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste research text, abstract, or findings here..."
              className="input-field resize-none"
            />
            <button onClick={runSummarize} disabled={loading || !text.trim()} className="btn-primary">
              {loading ? 'Summarizing...' : '📝 Summarize'}
            </button>
          </div>
        )}

        {activeTool === 'trends' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">📈 Trend Analysis</h2>
            <p className="text-sm text-gray-500">Analyze trends in land governance across categories and regions.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="label">Category</label>
                <input type="text" value={trendParams.category} onChange={(e) => setTrendParams({ ...trendParams, category: e.target.value })} placeholder="Land Use, Climate..." className="input-field" />
              </div>
              <div>
                <label className="label">State/Region</label>
                <input type="text" value={trendParams.state} onChange={(e) => setTrendParams({ ...trendParams, state: e.target.value })} placeholder="Karnataka, National..." className="input-field" />
              </div>
              <div>
                <label className="label">Time Range</label>
                <input type="text" value={trendParams.timeRange} onChange={(e) => setTrendParams({ ...trendParams, timeRange: e.target.value })} placeholder="2015-2024" className="input-field" />
              </div>
            </div>
            <button onClick={runTrends} disabled={loading} className="btn-primary">
              {loading ? 'Analyzing...' : '📈 Analyze Trends'}
            </button>
          </div>
        )}

        {activeTool === 'recommendations' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">💡 Research Recommendations</h2>
            <p className="text-sm text-gray-500">Get personalized recommendations for related research papers and datasets.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Category of Interest</label>
                <input type="text" value={recParams.category} onChange={(e) => setRecParams({ ...recParams, category: e.target.value })} placeholder="Land Use & Land Cover..." className="input-field" />
              </div>
              <div>
                <label className="label">State Focus</label>
                <input type="text" value={recParams.state} onChange={(e) => setRecParams({ ...recParams, state: e.target.value })} placeholder="Maharashtra, Karnataka..." className="input-field" />
              </div>
            </div>
            <button onClick={runRecommendations} disabled={loading} className="btn-primary">
              {loading ? 'Getting recommendations...' : '💡 Get Recommendations'}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">📊 Results</h2>
            <DemoBadge text="Demo AI Output" />
          </div>

          {/* Summarization results */}
          {result.summary && (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wider">Summary</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{result.summary}</p>
              </div>
              {result.keyPoints?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Key Points</p>
                  <ul className="space-y-1.5">
                    {result.keyPoints.map((p, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-primary-600 font-bold">•</span><span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Trend results */}
          {result.trends && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Period: {result.period} | Region: {result.region}</p>
              <div className="space-y-2">
                {result.trends.map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{t.indicator}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${t.direction === 'increasing' ? 'text-green-600' : t.direction === 'decreasing' ? 'text-red-600' : 'text-orange-600'}`}>
                        {t.direction === 'increasing' ? '↑' : t.direction === 'decreasing' ? '↓' : '→'} {t.rate}
                      </span>
                      <span className="badge bg-gray-200 text-gray-600 text-xs">{t.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
              {result.keyInsights && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Key Insights</p>
                  <ul className="space-y-1.5">
                    {result.keyInsights.map((insight, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span>💡</span><span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Recommendation results */}
          {result.recommendedResearch && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">📄 Recommended Research</p>
              <div className="space-y-2">
                {result.recommendedResearch.map((r) => (
                  <div key={r._id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{r.title}</p>
                    <p className="text-xs text-gray-400">{r.institution} • {r.publicationYear}</p>
                  </div>
                ))}
              </div>
              {result.recommendedDatasets?.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">💾 Recommended Datasets</p>
                  <div className="space-y-2">
                    {result.recommendedDatasets.map((d) => (
                      <div key={d._id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{d.name}</p>
                        <p className="text-xs text-gray-400">{d.category} • {d.year}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
