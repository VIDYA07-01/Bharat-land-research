import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DemoBadge from '../../components/common/DemoBadge';
import { useConnectionStatus } from '../../services/connectionService';
import { subscribeSyncState, runSync } from '../../services/syncService';
import {
  seedDemoDataIfEmpty,
  getAllResources,
  togglePin,
  removeResource,
  clearUnpinned,
} from '../../services/offlineStorage';
import {
  DEMO_RESOURCES,
  RESOURCE_TYPES,
  OFFLINE_STATUS,
  TYPE_BADGE_COLORS,
  STORAGE_BREAKDOWN,
  STORAGE_USED_MB,
  STORAGE_QUOTA_MB,
  CACHED_GIS_LAYERS,
  TOTAL_RESOURCES,
  FULLY_OFFLINE,
  PARTIAL_OFFLINE,
  WITH_AI_SUMMARY,
} from '../../data/landvaultDemoData';

// ─── Palette ──────────────────────────────────────────────────────────────────
const G9 = '#0f5c3a';
const G7 = '#1a7a4e';
const G5 = '#2e9e68';

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, icon, title, badge, children, className = '' }) {
  return (
    <section id={id} className={`card overflow-hidden ${className}`}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
        <span className="text-xl">{icon}</span>
        <h2 className="font-display font-bold text-gray-900 dark:text-white text-base">{title}</h2>
        {badge && <span className="ml-auto">{badge}</span>}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

// ─── Connection status pill ───────────────────────────────────────────────────
function ConnectionPill({ status, speedLabel }) {
  const cfg = {
    online:  { icon: '🟢', label: 'Online',           cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800' },
    weak:    { icon: '🟡', label: 'Weak Connection',   cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800' },
    offline: { icon: '🔴', label: 'Offline',           cls: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' },
  }[status] || { icon: '🟡', label: 'Checking…', cls: 'bg-gray-100 text-gray-600 border-gray-200' };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${cfg.cls}`}>
      <span className="text-base leading-none">{cfg.icon}</span>
      <span>{cfg.label}</span>
      {status === 'weak' && speedLabel && (
        <span className="text-xs opacity-70">· {speedLabel}</span>
      )}
    </div>
  );
}

// ─── Storage bar ──────────────────────────────────────────────────────────────
function StorageBar({ usedMB, quotaMB }) {
  const pct = Math.min((usedMB / quotaMB) * 100, 100);
  const color = pct > 85 ? 'bg-red-500' : pct > 65 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span className="font-medium text-gray-700 dark:text-gray-300">{usedMB} MB used</span>
        <span>{quotaMB} MB available</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div className={`h-3 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400">{pct.toFixed(0)}% of your offline storage used</p>
    </div>
  );
}

// ─── Resource Card ────────────────────────────────────────────────────────────
function ResourceCard({ resource, onPin, onRemove, onViewAI }) {
  const offCfg = OFFLINE_STATUS[resource.offlineStatus] || OFFLINE_STATUS.available;
  const typeCfg = RESOURCE_TYPES.find((t) => t.key === resource.type) || RESOURCE_TYPES[0];

  return (
    <div className="card-hover flex flex-col gap-3 p-5 relative">
      {/* Pin star */}
      <button
        onClick={() => onPin(resource.id)}
        title={resource.pinned ? 'Unpin (will not auto-delete)' : 'Pin permanently'}
        className={`absolute top-3 right-3 text-lg leading-none transition-colors ${resource.pinned ? 'text-amber-500' : 'text-gray-200 dark:text-gray-700 hover:text-amber-400'}`}
      >⭐</button>

      {/* Header */}
      <div className="flex items-start gap-3 pr-7">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
          { blue:'bg-blue-50 dark:bg-blue-900/20', indigo:'bg-indigo-50 dark:bg-indigo-900/20',
            teal:'bg-teal-50 dark:bg-teal-900/20', emerald:'bg-emerald-50 dark:bg-emerald-900/20',
            amber:'bg-amber-50 dark:bg-amber-900/20', purple:'bg-purple-50 dark:bg-purple-900/20' }[typeCfg.color]
        }`}>
          {typeCfg.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-1 mb-1">
            <span className={`badge text-xs ${TYPE_BADGE_COLORS[resource.type]}`}>{typeCfg.label}</span>
            {resource.isDemoData && <DemoBadge />}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">
            {resource.title}
          </h3>
        </div>
      </div>

      {/* Category + description */}
      <p className="text-xs text-gray-400 uppercase tracking-wider">{resource.category}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
        {resource.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {resource.tags.slice(0, 3).map((t) => (
          <span key={t} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-full text-xs border border-gray-200 dark:border-gray-700">{t}</span>
        ))}
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
        <div>
          <p className="text-gray-400">Saved</p>
          <p className="font-medium text-gray-700 dark:text-gray-300">{resource.savedDate}</p>
        </div>
        <div>
          <p className="text-gray-400">Updated</p>
          <p className="font-medium text-gray-700 dark:text-gray-300">{resource.lastUpdated}</p>
        </div>
        <div>
          <p className="text-gray-400">Size</p>
          <p className="font-medium text-gray-700 dark:text-gray-300">{resource.sizeMB} MB</p>
        </div>
      </div>

      {/* Offline status */}
      <span className={`badge text-xs w-fit ${offCfg.style}`}>
        {offCfg.icon} {offCfg.label}
      </span>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
        {resource.type === 'opportunity' && resource.registrationRequiresInternet ? (
          <div className="flex-1 text-xs text-center py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400 border border-gray-200 dark:border-gray-700">
            📡 Read Only (Registration needs internet)
          </div>
        ) : (
          <button className="flex-1 py-2 text-xs font-medium rounded-lg transition-colors text-white"
            style={{ background: G9 }}
            onMouseEnter={(e) => e.currentTarget.style.background = G7}
            onMouseLeave={(e) => e.currentTarget.style.background = G9}>
            📖 Read Offline
          </button>
        )}
        {resource.aiSummary?.available && (
          <button
            onClick={() => onViewAI(resource)}
            className="px-3 py-2 text-xs border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
            🤖 AI
          </button>
        )}
        <button
          onClick={() => onRemove(resource.id)}
          className="px-3 py-2 text-xs border border-red-200 dark:border-red-800 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          🗑️
        </button>
      </div>
    </div>
  );
}

// ─── Sync Center ──────────────────────────────────────────────────────────────
const SYNC_PHASES = [
  { key: 'checking',    label: 'Checking saved resources…' },
  { key: 'downloading', label: 'Downloading changes…'      },
  { key: 'updating',    label: 'Updating local library…'   },
  { key: 'complete',    label: 'Sync Complete ✓'           },
];

function SyncCenter({ syncState, onSync }) {
  const isIdle     = syncState.phase === 'idle' || syncState.phase === 'complete';
  const isRunning  = !isIdle && syncState.phase !== 'error';
  const phaseIdx   = SYNC_PHASES.findIndex((p) => p.key === syncState.phase);

  return (
    <div className="space-y-5">
      {/* Status header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          {syncState.phase === 'complete' ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <span className="text-xl">✅</span>
              <span className="font-semibold">Sync Complete</span>
            </div>
          ) : syncState.phase === 'error' ? (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <span className="text-xl">❌</span>
              <span className="font-semibold">Sync Error</span>
            </div>
          ) : isRunning ? (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <span className="animate-spin text-lg">⟳</span>
              <span className="font-semibold">Syncing…</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Last sync: <strong className="text-gray-700 dark:text-gray-300">
                {syncState.lastSync || 'Never'}
              </strong>
            </p>
          )}
        </div>
        <button
          onClick={onSync}
          disabled={isRunning}
          className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: isRunning ? '#aaa' : G9 }}
        >
          {isRunning ? 'Syncing…' : '🔄 Sync Now'}
        </button>
      </div>

      {/* Progress bar */}
      {isRunning && (
        <div className="space-y-1">
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="h-2 rounded-full bg-primary-600 transition-all duration-500"
              style={{ width: `${syncState.progress}%` }} />
          </div>
          <p className="text-xs text-gray-400">{syncState.progress}%</p>
        </div>
      )}

      {/* Step indicators */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        {SYNC_PHASES.map((phase, i) => {
          const isDone    = syncState.phase === 'complete' || phaseIdx > i;
          const isActive  = phaseIdx === i && isRunning;
          return (
            <div key={phase.key} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                isDone   ? 'bg-emerald-500 text-white' :
                isActive ? 'bg-blue-500 text-white animate-pulse' :
                           'bg-gray-100 dark:bg-gray-700 text-gray-400'
              }`}>
                {isDone ? '✓' : i + 1}
              </div>
              <span className={`text-xs ${isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                {phase.label}
              </span>
              {i < SYNC_PHASES.length - 1 && (
                <span className="hidden sm:block text-gray-300 dark:text-gray-600 mx-1">→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Results */}
      {(syncState.phase === 'complete' || syncState.resourcesChecked > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Checked',  value: syncState.resourcesChecked, icon: '🔍' },
            { label: 'Updated',  value: syncState.resourcesUpdated, icon: '⬇️' },
            { label: 'New AI Summaries', value: syncState.newSummaries, icon: '🤖' },
            { label: 'Errors',   value: syncState.errors,           icon: '❌' },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
              <p className="text-lg">{s.icon}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Storage Manager ──────────────────────────────────────────────────────────
function StorageManager({ onClearUnpinned }) {
  const total = STORAGE_BREAKDOWN.reduce((s, x) => s + x.usedMB, 0);
  return (
    <div className="space-y-5">
      <StorageBar usedMB={STORAGE_USED_MB} quotaMB={STORAGE_QUOTA_MB} />

      <div className="space-y-2.5">
        {STORAGE_BREAKDOWN.map((item) => (
          <div key={item.label} className="flex items-center gap-3 text-sm">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="flex-1 text-gray-600 dark:text-gray-400">{item.label}</span>
            <div className="w-32 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${(item.usedMB / STORAGE_QUOTA_MB) * 100}%`, background: item.color }} />
            </div>
            <span className="w-16 text-right font-semibold text-gray-700 dark:text-gray-300 text-xs">{item.usedMB} MB</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-gray-700 dark:text-gray-300">Total Used</span>
          <span style={{ color: G9 }}>{total} MB / {STORAGE_QUOTA_MB} MB</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <button onClick={onClearUnpinned}
          className="btn-secondary text-xs py-2 px-4 text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
          🗑️ Clear Unpinned Cache
        </button>
        <button className="btn-secondary text-xs py-2 px-4">⭐ Keep Only Pinned</button>
        <button className="btn-secondary text-xs py-2 px-4">📊 Manage Storage</button>
      </div>

      <p className="text-xs text-amber-600 dark:text-amber-400">
        ⭐ Pinned resources are never auto-deleted during storage cleanup.
        <span className="ml-1 font-medium">{DEMO_RESOURCES.filter((r) => r.pinned).length} resources pinned.</span>
      </p>
    </div>
  );
}

// ─── Offline GIS ──────────────────────────────────────────────────────────────
function OfflineGIS() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
          🟢 Cached Map Data
        </span>
        <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs">
          🔴 Live Satellite Unavailable Offline
        </span>
        <span className="ml-auto text-xs text-amber-600 dark:text-amber-400 font-medium">
          ⚠️ Offline Map Mode – Demo
        </span>
      </div>

      {/* Mock map placeholder */}
      <div className="w-full h-44 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center gap-2 text-gray-400">
        <span className="text-4xl">🗺️</span>
        <p className="text-sm font-medium">Offline Map View</p>
        <p className="text-xs">Cached district boundaries and land-use summaries available</p>
        <p className="text-xs text-red-400">Live satellite imagery requires internet</p>
      </div>

      {/* Cached layers */}
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Cached Map Layers</p>
        <div className="space-y-2">
          {CACHED_GIS_LAYERS.map((layer) => (
            <div key={layer.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 text-sm">
              <span className="text-lg flex-shrink-0">
                {layer.status === 'available' ? '🟢' : '🟡'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 dark:text-gray-200 text-xs truncate">{layer.name}</p>
                <p className="text-xs text-gray-400">{layer.type} · Cached {layer.cachedDate}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{layer.size}</span>
              <button className="text-xs text-red-400 hover:text-red-600 flex-shrink-0">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
        ⚠️ Offline GIS shows only previously cached spatial data. Live tile layers, satellite imagery, and real-time overlays require an active internet connection.
      </div>
    </div>
  );
}

// ─── AI Summary Modal ─────────────────────────────────────────────────────────
function AISummaryModal({ resource, onClose }) {
  if (!resource || !resource.aiSummary?.available) return null;
  const { aiSummary } = resource;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-purple-600">🤖</span>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Cached AI Summary</h3>
              <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-xs">
                Generated while online
              </span>
            </div>
            <p className="text-xs text-gray-400">Generated: {aiSummary.generatedDate}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-1">Paper</p>
            <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{resource.title}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4">
            <p className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wider mb-1">Problem</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{aiSummary.problem}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2">Key Findings</p>
            <ul className="space-y-1.5">
              {aiSummary.keyFindings.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-blue-400 flex-shrink-0 mt-0.5">▸</span>{f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1">Policy Relevance</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{aiSummary.policyRelevance}</p>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
            ⚠️ This is a cached AI summary generated previously while online. Not a live AI response.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Low Network Banner ───────────────────────────────────────────────────────
function LowNetworkBanner({ speedLabel }) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-300 dark:border-amber-800 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">📶</span>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Low Network Mode Active</span>
            <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-xs">
              {speedLabel}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {[
              { icon: '✓', label: 'Text-first loading' },
              { icon: '✓', label: 'Images optimized'  },
              { icon: '⏸', label: 'Background sync paused' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <span className="font-bold">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function LandVaultPage() {
  const { status, speedLabel, isWeak, isOffline } = useConnectionStatus();
  const [syncState,     setSyncState]     = useState({ phase: 'idle', progress: 0, lastSync: 'Today, 09:42 AM', resourcesChecked: 0, resourcesUpdated: 0, newSummaries: 0, errors: 0 });
  const [resources,     setResources]     = useState(DEMO_RESOURCES);
  const [search,        setSearch]        = useState('');
  const [filterType,    setFilterType]    = useState('');
  const [activeTab,     setActiveTab]     = useState('library');   // library | sync | storage | gis
  const [aiResource,    setAIResource]    = useState(null);
  const [cleared,       setCleared]       = useState(false);

  // Seed IndexedDB with demo data on mount and load
  useEffect(() => {
    seedDemoDataIfEmpty(DEMO_RESOURCES).then(() =>
      getAllResources().then((rows) => {
        if (rows.length > 0) setResources(rows);
      })
    );
  }, []);

  // Subscribe to sync state
  useEffect(() => {
    return subscribeSyncState(setSyncState);
  }, []);

  const handleSync = useCallback(() => runSync(), []);

  const handlePin = useCallback(async (id) => {
    await togglePin(id);
    const updated = await getAllResources();
    setResources(updated.length > 0 ? updated : DEMO_RESOURCES.map((r) => r.id === id ? { ...r, pinned: !r.pinned } : r));
  }, []);

  const handleRemove = useCallback(async (id) => {
    await removeResource(id);
    setResources((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleClearUnpinned = useCallback(async () => {
    await clearUnpinned();
    const updated = await getAllResources();
    setResources(updated.length > 0 ? updated : DEMO_RESOURCES.filter((r) => r.pinned));
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  }, []);

  const filteredResources = useMemo(() => {
    const q = search.toLowerCase();
    return resources.filter((r) => {
      if (filterType && r.type !== filterType) return false;
      if (q && ![r.title, r.description, r.category, ...(r.tags || [])].join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [resources, search, filterType]);

  const tabs = [
    { key: 'library', icon: '📚', label: 'Offline Library'  },
    { key: 'sync',    icon: '🔄', label: 'Sync Center'      },
    { key: 'storage', icon: '💾', label: 'Storage Manager'  },
    { key: 'gis',     icon: '🗺️', label: 'Offline GIS'      },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── AI MODAL ─────────────────────────────────────────────────── */}
      {aiResource && <AISummaryModal resource={aiResource} onClose={() => setAIResource(null)} />}

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg,${G9} 0%,${G7} 60%,${G5} 100%)` }} className="text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: '#fff', transform: 'translate(30%,-30%)' }} />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/innovation" className="hover:text-white">Innovation Portal</Link>
            <span>/</span>
            <span className="text-white">LandVault Offline</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-3xl">📡</span>
                <h1 className="text-3xl sm:text-4xl font-display font-bold">LandVault Offline</h1>
                <DemoBadge text="Demo Offline Library" />
              </div>
              <p className="text-green-100 text-sm sm:text-base max-w-2xl leading-relaxed">
                Your essential land-governance knowledge, available even when connectivity is limited.
                Research papers, policies, case studies, and datasets — all accessible offline.
              </p>
            </div>

            {/* Status cluster */}
            <div className="flex-shrink-0 flex flex-col gap-3">
              <ConnectionPill status={status} speedLabel={speedLabel} />
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { icon: '📦', label: `${resources.length} Resources Saved` },
                  { icon: '💾', label: `${STORAGE_USED_MB} MB Used`          },
                  { icon: '🕐', label: `Sync: ${syncState.lastSync || '—'}`  },
                  { icon: '⭐', label: `${DEMO_RESOURCES.filter((r) => r.pinned).length} Pinned`           },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: 'rgba(255,255,255,0.12)' }}>
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSync}
                  disabled={syncState.phase !== 'idle' && syncState.phase !== 'complete' && syncState.phase !== 'error'}
                  className="flex-1 py-2 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-colors disabled:opacity-50">
                  🔄 Sync Now
                </button>
                <button onClick={() => setActiveTab('storage')}
                  className="flex-1 py-2 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-colors">
                  💾 Storage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LOW NETWORK BANNER ───────────────────────────────────────── */}
      {(isWeak || isOffline) && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-5">
          <LowNetworkBanner speedLabel={isOffline ? 'No connection' : speedLabel} />
        </div>
      )}

      {/* ── OFFLINE SEARCH NOTICE ────────────────────────────────────── */}
      {isOffline && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4">
          <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl text-sm">
            <span className="text-blue-600 text-lg">📴</span>
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              You are offline. Showing results from your Offline Library only.
            </span>
          </div>
        </div>
      )}

      {/* ── SUMMARY STATS ────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Saved',      value: TOTAL_RESOURCES, icon: '📚', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'         },
            { label: 'Fully Offline',    value: FULLY_OFFLINE,   icon: '🟢', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' },
            { label: 'Partial Offline',  value: PARTIAL_OFFLINE, icon: '🟡', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'       },
            { label: 'GIS Layers',       value: CACHED_GIS_LAYERS.length, icon: '🗺️', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' },
            { label: 'AI Summaries',     value: WITH_AI_SUMMARY, icon: '🤖', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'   },
            { label: 'Storage Used',     value: `${STORAGE_USED_MB} MB`, icon: '💾', color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300'  },
          ].map((s) => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${s.color}`}>{s.icon}</div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 leading-tight">{s.label}</p>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-[#0f5c3a] text-[#0f5c3a] dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ──────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── LIBRARY TAB ────────────────────────────────────────────── */}
        {activeTab === 'library' && (
          <>
            {/* Search + filter bar */}
            <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  type="text" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isOffline ? 'Search offline library…' : 'Search saved resources…'}
                  className="w-full pl-9 pr-8 py-2.5 input-field text-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg">×</button>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="input-field text-sm py-2.5 w-auto">
                  <option value="">All Types</option>
                  {RESOURCE_TYPES.map((t) => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
                {(search || filterType) && (
                  <button onClick={() => { setSearch(''); setFilterType(''); }}
                    className="btn-secondary text-xs py-2 px-3">✕ Clear</button>
                )}
              </div>
            </div>

            {isOffline && (
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <span>📴</span>
                <span>Showing results from your Offline Library</span>
              </div>
            )}

            {cleared && (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-700 dark:text-emerald-400">
                ✅ Unpinned resources cleared from offline cache.
              </div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {filteredResources.length} of {resources.length} resources
                {search && <span> matching "<strong className="text-gray-800 dark:text-gray-200">{search}</strong>"</span>}
              </span>
            </div>

            {/* Resource grid */}
            {filteredResources.length === 0 ? (
              <div className="card p-14 text-center">
                <p className="text-5xl mb-3">📴</p>
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No offline resources found</p>
                <p className="text-sm text-gray-500">Try a different search term or save more resources for offline use.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredResources.map((r) => (
                  <ResourceCard key={r.id} resource={r}
                    onPin={handlePin} onRemove={handleRemove}
                    onViewAI={(res) => setAIResource(res)} />
                ))}
              </div>
            )}

            {/* Demo notice */}
            <div className="card p-4 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>⚠️ DEMO OFFLINE LIBRARY:</strong> All resources shown are sample data for demonstration only.
                IndexedDB is seeded with demo records on first visit. In a production build, only explicitly saved
                resources would appear here.
              </p>
            </div>
          </>
        )}

        {/* ── SYNC TAB ─────────────────────────────────────────────── */}
        {activeTab === 'sync' && (
          <Section icon="🔄" title="Sync Center" badge={<DemoBadge text="Demo Sync" />}>
            <SyncCenter syncState={syncState} onSync={handleSync} />
          </Section>
        )}

        {/* ── STORAGE TAB ────────────────────────────────────────────── */}
        {activeTab === 'storage' && (
          <Section icon="💾" title="Storage Manager">
            <StorageManager onClearUnpinned={handleClearUnpinned} />
          </Section>
        )}

        {/* ── GIS TAB ──────────────────────────────────────────────── */}
        {activeTab === 'gis' && (
          <Section icon="🗺️" title="Offline GIS" badge={<DemoBadge text="Demo GIS Cache" />}>
            <OfflineGIS />
          </Section>
        )}

      </div>

      {/* ── QUICK NAV ────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex flex-wrap gap-3">
          <Link to="/innovation" className="btn-secondary text-sm">← Innovation Portal</Link>
          <Link to="/research"   className="btn-secondary text-sm">📄 Research Repository</Link>
          <Link to="/policies"   className="btn-secondary text-sm">📜 Policy Repository</Link>
          <Link to="/case-studies" className="btn-secondary text-sm">📋 Case Studies</Link>
          <Link to="/datasets"   className="btn-secondary text-sm">💾 Datasets</Link>
        </div>
      </div>

    </div>
  );
}
