import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DemoBadge from '../../components/common/DemoBadge';

const EXAMPLE_QUERIES = [
  'Show research related to land disputes',
  'What are the major land-use changes in Karnataka?',
  'Summarize climate vulnerability research',
  'Which policies are related to urban land management?',
  'Show research on agricultural land management',
  'GIS applications in land governance',
  'Tribal land rights research',
  'Digital land records modernization',
];

const MessageBubble = ({ msg }) => (
  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-3xl rounded-2xl px-5 py-4 ${
      msg.role === 'user'
        ? 'bg-primary-700 text-white rounded-br-sm'
        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm shadow-sm'
    }`}>
      {msg.role === 'assistant' && (
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-lg">🤖</span>
          <span className="text-xs font-medium text-gray-500">AI Research Assistant</span>
          <DemoBadge text="Demo AI" />
        </div>
      )}
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

      {/* Related Resources */}
      {msg.data && (
        <div className="mt-4 space-y-3">
          {msg.data.relatedResearch?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">📄 Related Research</p>
              <div className="space-y-1.5">
                {msg.data.relatedResearch.slice(0, 3).map((r) => (
                  <Link key={r._id} to={`/research/${r._id}`}
                    className="block px-3 py-2 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg text-xs text-primary-700 dark:text-primary-300 transition-colors">
                    📄 {r.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {msg.data.relatedPolicies?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">📋 Related Policies</p>
              <div className="space-y-1.5">
                {msg.data.relatedPolicies.slice(0, 2).map((p) => (
                  <Link key={p._id} to={`/policies/${p._id}`}
                    className="block px-3 py-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 rounded-lg text-xs text-green-700 dark:text-green-300 transition-colors">
                    📋 {p.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {msg.data.relatedDatasets?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">💾 Related Datasets</p>
              <div className="space-y-1.5">
                {msg.data.relatedDatasets.slice(0, 2).map((d) => (
                  <Link key={d._id} to={`/datasets/${d._id}`}
                    className="block px-3 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg text-xs text-blue-700 dark:text-blue-300 transition-colors">
                    💾 {d.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="text-xs text-gray-400 flex items-center gap-2 pt-1">
            <span>Confidence: {Math.round((msg.data.confidence || 0) * 100)}%</span>
            <span>•</span>
            <span>{msg.data.sources || 0} sources referenced</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m the AI Research Assistant for the Bharat Land Portal. I can help you explore land governance research, policies, datasets, and case studies.\n\nTry asking me about:\n• Land disputes and resolution methods\n• State-specific land use changes\n• Climate vulnerability research\n• Policy effectiveness analysis\n• GIS and remote sensing applications',
      data: null,
    },
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setQuery('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/query', { query: q });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.data.answer,
          data: data.data,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an error processing your query. Please try again.',
          data: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (q) => {
    setQuery(q);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-primary-900 to-primary-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-display font-bold">🤖 AI Research Assistant</h1>
              <p className="text-purple-200 text-sm mt-1">AI-powered knowledge exploration for land governance research</p>
            </div>
            <DemoBadge text="Demo AI – Not Official" />
          </div>

          {/* Example queries */}
          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.slice(0, 4).map((q) => (
              <button
                key={q}
                onClick={() => handleExampleClick(q)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-4">
        <div className="flex-1 min-h-96 max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">Searching knowledge base...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="card p-4">
          <div className="flex gap-3">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask about land governance research, policies, datasets... (Enter to send, Shift+Enter for new line)"
              rows={2}
              className="flex-1 input-field resize-none text-sm"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="btn-primary px-6 self-end disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : '→'}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              ⚠️ AI responses are based on demo data and for research reference only
            </p>
            <button
              type="button"
              onClick={() => setMessages([messages[0]])}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear chat
            </button>
          </div>
        </form>

        {/* More examples */}
        <div className="card p-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">💡 More example queries:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.slice(4).map((q) => (
              <button
                key={q}
                onClick={() => handleExampleClick(q)}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
