/**
 * AIAssistantPanel
 *
 * Floating AI button (bottom-right, fixed) + slide-in chat panel.
 * Reuses all chat logic from AIAssistantPage.jsx.
 * Rendered once in MainLayout so it appears on every page.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DemoBadge from './DemoBadge';

// ─── Example queries (same set as AIAssistantPage) ───────────────────────────
const EXAMPLE_QUERIES = [
  'Show research related to land disputes',
  'What are the major land-use changes in Karnataka?',
  'Summarize climate vulnerability research',
  'Which policies are related to urban land management?',
  'Show GIS studies related to agriculture',
  'Find datasets related to land records',
  'Tribal land rights research',
  'Digital land records modernization',
];

// ─── Initial assistant message ────────────────────────────────────────────────
const WELCOME = {
  role: 'assistant',
  content:
    "Hello! I'm the AI Research Assistant for the Bharat Land Portal. " +
    'I can help you explore land governance research, policies, datasets, and case studies.\n\n' +
    'Try asking me about:\n' +
    '• Land disputes and resolution methods\n' +
    '• State-specific land-use changes\n' +
    '• Climate vulnerability research\n' +
    '• Policy effectiveness analysis\n' +
    '• GIS and remote sensing applications',
  data: null,
};

// ─── Single chat bubble ───────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  return (
    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-full rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        msg.role === 'user'
          ? 'bg-primary-700 text-white rounded-br-sm max-w-[85%]'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm shadow-sm w-full'
      }`}>
        {msg.role === 'assistant' && (
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-base">🤖</span>
            <span className="text-xs font-medium text-gray-500">AI Research Assistant</span>
            <DemoBadge text="Demo AI" />
          </div>
        )}
        <p className="whitespace-pre-wrap">{msg.content}</p>

        {/* Related resources */}
        {msg.data && (
          <div className="mt-3 space-y-2">
            {msg.data.relatedResearch?.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">📄 Related Research</p>
                <div className="space-y-1">
                  {msg.data.relatedResearch.slice(0, 2).map((r) => (
                    <Link key={r._id} to={`/research/${r._id}`}
                      className="block px-2.5 py-1.5 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg text-[11px] text-primary-700 dark:text-primary-300 transition-colors truncate">
                      📄 {r.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {msg.data.relatedPolicies?.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">📋 Related Policies</p>
                <div className="space-y-1">
                  {msg.data.relatedPolicies.slice(0, 2).map((p) => (
                    <Link key={p._id} to={`/policies/${p._id}`}
                      className="block px-2.5 py-1.5 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 rounded-lg text-[11px] text-green-700 dark:text-green-300 transition-colors truncate">
                      📋 {p.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {msg.data.relatedDatasets?.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">💾 Related Datasets</p>
                <div className="space-y-1">
                  {msg.data.relatedDatasets.slice(0, 2).map((d) => (
                    <Link key={d._id} to={`/datasets/${d._id}`}
                      className="block px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg text-[11px] text-blue-700 dark:text-blue-300 transition-colors truncate">
                      💾 {d.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {msg.data.confidence != null && (
              <p className="text-[10px] text-gray-400 pt-1">
                Confidence: {Math.round((msg.data.confidence || 0) * 100)}% · {msg.data.sources || 0} sources
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIAssistantPanel() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [query,    setQuery]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [tooltip,  setTooltip]  = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens; restore body scroll on close
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setQuery('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/query', { query: q });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.data.answer, data: data.data }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'I encountered an error processing your query. Please try again.',
        data: null,
      }]);
    } finally {
      setLoading(false);
    }
  }, [query, loading]);

  const handleExample = (q) => { setQuery(q); inputRef.current?.focus(); };
  const clearChat     = () => setMessages([WELCOME]);

  return (
    <>
      {/* ── BACKDROP ───────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── SLIDE-IN PANEL ─────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="AI Research Assistant"
        className={`
          fixed z-50 flex flex-col
          bottom-0 right-0
          sm:bottom-6 sm:right-6
          w-full sm:w-[440px]
          h-[92dvh] sm:h-[82vh]
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          rounded-t-2xl sm:rounded-2xl
          shadow-2xl
          transition-all duration-300 ease-out
          ${open
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-6 opacity-0 pointer-events-none'
          }
        `}
      >
        {/* Panel header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-indigo-900 via-primary-900 to-primary-800 rounded-t-2xl px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {/* AI icon */}
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-xl flex-shrink-0">
                🤖
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-sm leading-tight">AI Research Assistant</p>
                <p className="text-indigo-200 text-[11px] leading-tight truncate">AI-powered knowledge exploration for land governance</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <DemoBadge text="Demo AI – Not Official" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close AI Assistant"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg font-bold transition-colors leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Example query chips */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
            {EXAMPLE_QUERIES.slice(0, 4).map((q) => (
              <button
                key={q}
                onClick={() => handleExample(q)}
                className="flex-shrink-0 px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[11px] transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0">
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start mb-3">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">Searching knowledge base…</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* More example chips */}
        <div className="flex-shrink-0 px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {EXAMPLE_QUERIES.slice(4).map((q) => (
            <button
              key={q}
              onClick={() => handleExample(q)}
              className="flex-shrink-0 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[11px] rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-colors whitespace-nowrap border border-gray-200 dark:border-gray-700"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-2">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
              }}
              placeholder="Ask about land governance research, policies, datasets..."
              rows={2}
              className="flex-1 input-field resize-none text-sm py-2.5 min-h-0"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              aria-label="Send"
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-700 hover:bg-primary-800 disabled:opacity-40 text-white flex items-center justify-center transition-colors self-end"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <span className="text-base font-bold">→</span>
              }
            </button>
          </form>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-400">
              ⚠️ AI responses are based on demo data and for research reference only
            </p>
            <button
              type="button"
              onClick={clearChat}
              className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear chat
            </button>
          </div>
        </div>
      </div>

      {/* ── FLOATING TRIGGER BUTTON ─────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-1.5">
        {/* Tooltip */}
        {tooltip && !open && (
          <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-fade-in pointer-events-none">
            AI Research Assistant
            {/* Arrow */}
            <div className="absolute bottom-[-5px] right-5 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800" />
          </div>
        )}

        <button
          onClick={() => setOpen((p) => !p)}
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
          aria-label="Open AI Research Assistant"
          aria-expanded={open}
          className={`
            w-14 h-14 rounded-full shadow-xl
            flex items-center justify-center
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-4 focus:ring-indigo-400/40
            ${open
              ? 'bg-gray-700 dark:bg-gray-600 scale-95'
              : 'bg-gradient-to-br from-indigo-600 via-primary-700 to-primary-800 hover:scale-110 hover:shadow-2xl active:scale-95'
            }
          `}
        >
          {open ? (
            /* X when panel is open */
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* Sparkle / AI icon when closed */
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
          )}

          {/* Pulse ring (only when closed) */}
          {!open && (
            <span className="absolute w-14 h-14 rounded-full border-2 border-indigo-400/40 animate-ping pointer-events-none" />
          )}
        </button>
      </div>
    </>
  );
}
