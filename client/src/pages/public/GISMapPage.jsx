/**
 * GIS Intelligence Map — Google Maps-style with full district drill-down
 * India → State → District → Land Detail
 *
 * DEMO DATA – Not official government data or boundaries.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer, TileLayer, GeoJSON, useMap,
  ZoomControl, ScaleControl,
} from 'react-leaflet';
import L from 'leaflet';
import api from '../../services/api';

/* ── fix leaflet icon paths ─────────────────────────────────────────────────── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ── tile layers ─────────────────────────────────────────────────────────────── */
const TILES = {
  satellite: { icon: '🛰️', label: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: 'Tiles © Esri' },
  map:       { icon: '🗺️', label: 'Map',       url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',           attr: '© OpenStreetMap' },
  terrain:   { icon: '⛰️', label: 'Terrain',   url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',             attr: '© OpenTopoMap'  },
  dark:      { icon: '🌑', label: 'Dark',       url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',attr: '© CARTO'        },
};

/* ── layer definitions ───────────────────────────────────────────────────────── */
const LAYERS = [
  { id: 'agricultural', label: 'Agricultural', icon: '🌾', color: '#22c55e' },
  { id: 'urban',        label: 'Urban',         icon: '🏙️', color: '#f97316' },
  { id: 'forest',       label: 'Forest',        icon: '🌳', color: '#15803d' },
  { id: 'water',        label: 'Water',         icon: '💧', color: '#3b82f6' },
  { id: 'climate',      label: 'Climate Risk',  icon: '🌡️', color: '#f59e0b' },
  { id: 'disputes',     label: 'Disputes',      icon: '⚖️', color: '#ef4444' },
  { id: 'infra',        label: 'Infra',         icon: '🛣️', color: '#8b5cf6' },
  { id: 'change',       label: 'Land Change',   icon: '🔄', color: '#06b6d4' },
];

const INDIA_CENTER = [20.5937, 78.9629];
const INDIA_ZOOM   = 5;

/* ── colour helpers ──────────────────────────────────────────────────────────── */
const riskColors = { low: '#22c55e', moderate: '#f59e0b', high: '#ef4444', very_high: '#7f1d1d' };
const riskLabels = { low: 'Low', moderate: 'Moderate', high: 'High', very_high: 'Very High' };
const riskBgText = {
  low:      'bg-green-100 text-green-800',
  moderate: 'bg-amber-100 text-amber-800',
  high:     'bg-red-100 text-red-700',
  very_high:'bg-red-200 text-red-900',
};

const fillForLayers = (activeLayers) => {
  if (activeLayers.includes('agricultural')) return '#22c55e';
  if (activeLayers.includes('urban'))        return '#f97316';
  if (activeLayers.includes('forest'))       return '#15803d';
  if (activeLayers.includes('water'))        return '#3b82f6';
  if (activeLayers.includes('climate'))      return '#f59e0b';
  if (activeLayers.includes('disputes'))     return '#ef4444';
  return '#6366f1';
};

/* ── utility formatters ──────────────────────────────────────────────────────── */
const km   = (v) => v   ? `${(v / 1000).toFixed(1)}k km²` : 'N/A';
const kmS  = (v) => v   ? `${(v / 1000).toFixed(0)}k km²` : 'N/A';
const pop  = (v) => v   ? `${(v / 1e6).toFixed(2)}M`      : 'N/A';
const num  = (v) => v != null ? Number(v).toLocaleString('en-IN') : 'N/A';
const pct  = (a, t) => (a && t) ? `${((a / t) * 100).toFixed(1)}%` : 'N/A';

/* ══════════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════════════════════════ */

/* FlyTo helper ─────────────────────────────────────────────────────────────── */
function FlyTo({ bounds, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(
        [[bounds.south, bounds.west], [bounds.north, bounds.east]],
        { duration: 1.1, padding: [30, 30] }
      );
    } else if (zoom) {
      map.flyTo(INDIA_CENTER, INDIA_ZOOM, { duration: 1 });
    }
  }, [bounds, zoom, map]);
  return null;
}

/* Breadcrumb ───────────────────────────────────────────────────────────────── */
function Breadcrumb({ state, district, onReset, onStateClick }) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow border border-gray-200 dark:border-gray-700">
      <button onClick={onReset} className="hover:text-primary-700 font-medium transition-colors">🇮🇳 India</button>
      {state && (
        <>
          <span className="text-gray-400">/</span>
          <button
            onClick={onStateClick}
            className={`hover:text-primary-700 font-medium transition-colors ${!district ? 'text-primary-700 dark:text-primary-400' : ''}`}
          >
            {state}
          </button>
        </>
      )}
      {district && (
        <>
          <span className="text-gray-400">/</span>
          <span className="text-primary-700 dark:text-primary-400 font-semibold">{district}</span>
        </>
      )}
    </div>
  );
}

/* Search box ───────────────────────────────────────────────────────────────── */
function SearchBox({ items, onSelect }) {
  const [q, setQ]     = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const results = q.length > 0
    ? items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative w-72">
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-600">
        <svg className="ml-3 w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          type="text" value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search state or district…"
          className="flex-1 px-3 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
        />
        {q && (
          <button onClick={() => { setQ(''); setOpen(false); }} className="mr-3 text-gray-400 hover:text-gray-600">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[2100]">
          {results.map((item) => (
            <button key={`${item.type}-${item.label}`}
              onClick={() => { onSelect(item); setQ(item.label); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-left text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
            >
              <span>{item.type === 'state' ? '🏛️' : '📍'}</span>
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-gray-400">{item.type === 'state' ? 'State · India' : `District · ${item.state}`}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Tile switcher ────────────────────────────────────────────────────────────── */
function TileSwitcher({ current, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 shadow hover:bg-gray-50 transition-colors">
        {TILES[current].icon} <span className="font-medium">{TILES[current].label}</span>
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[2100] min-w-[140px]">
          {Object.entries(TILES).map(([k, t]) => (
            <button key={k} onClick={() => { onChange(k); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors ${current === k ? 'font-semibold text-primary-700 bg-primary-50' : 'text-gray-700 dark:text-gray-200'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Layer pills ──────────────────────────────────────────────────────────────── */
function LayerPills({ active, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const show = expanded ? LAYERS : LAYERS.slice(0, 4);
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {show.map(({ id, label, icon, color }) => {
        const on = active.includes(id);
        return (
          <button key={id} onClick={() => onToggle(id)}
            style={on ? { background: color, borderColor: color, color: '#fff' } : {}}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${on ? '' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}>
            <span>{icon}</span> {label}
          </button>
        );
      })}
      <button onClick={() => setExpanded(!expanded)}
        className="px-2.5 py-1 rounded-full text-xs font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50">
        {expanded ? '▲ Less' : `+${LAYERS.length - 4}`}
      </button>
    </div>
  );
}

/* Stat bar row ─────────────────────────────────────────────────────────────── */
const StatBar = ({ label, value, pctVal, color }) => (
  <div className="mb-2.5">
    <div className="flex justify-between mb-0.5">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{value}</span>
    </div>
    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div className="h-1.5 rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, pctVal || 0)}%`, background: color }} />
    </div>
  </div>
);

/* ── District list inside the side panel ────────────────────────────────────── */
function DistrictList({ districts, loadingDistricts, onSelect }) {
  if (loadingDistricts) {
    return (
      <div className="px-4 py-4">
        <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">📍 Districts</p>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  if (!districts?.length) return null;

  return (
    <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        📍 Districts ({districts.length})
      </p>
      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
        {districts.map((d) => (
          <button key={d.district}
            onClick={() => onSelect(d.district)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-sm text-gray-700 dark:text-gray-300 group border border-transparent hover:border-primary-200 dark:hover:border-primary-700">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
              <span className="truncate font-medium">{d.district}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {d.climate?.vulnerability && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${riskBgText[d.climate.vulnerability] || 'bg-gray-100 text-gray-600'}`}>
                  {riskLabels[d.climate.vulnerability] || d.climate.vulnerability}
                </span>
              )}
              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Full detail panel (state or district) ──────────────────────────────────── */
function DetailPanel({ data, districts, loadingDistricts, loading, level, onClose, onDistrictSelect, onBackToState }) {
  const showDistricts = level === 'state';

  if (!data && !loading) return null;

  const isState = level === 'state';

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-[1001] flex flex-col border-l border-gray-200 dark:border-gray-700 overflow-hidden"
      style={{ animation: 'slideInRight 0.22s ease-out' }}>

      {/* ── Header ── */}
      <div className={`text-white px-4 py-3 flex-shrink-0 ${isState ? 'bg-gradient-to-r from-primary-800 to-primary-700' : 'bg-gradient-to-r from-emerald-700 to-teal-700'}`}>
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="h-5 w-40 bg-white/20 rounded animate-pulse mb-1" />
            ) : (
              <>
                {!isState && (
                  <button onClick={onBackToState}
                    className="flex items-center gap-1 text-xs text-white/70 hover:text-white mb-1 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                    {data?.state}
                  </button>
                )}
                <h2 className="font-bold text-lg leading-tight truncate">
                  {isState ? data?.state : data?.district}
                </h2>
                {!isState && (
                  <p className="text-xs text-white/70 mt-0.5">{data?.state} · District</p>
                )}
              </>
            )}
            <span className="inline-flex items-center gap-1 text-xs text-white/60 mt-1">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Demo / Sample Data
            </span>
          </div>
          <button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${55 + i * 4}%` }} />
            ))}
          </div>
        ) : data ? (
          <>
            {/* ── Top KPI bar ── */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700 border-b border-gray-100 dark:border-gray-700">
              {[
                { label: 'Area',       value: data.totalArea ? kmS(data.totalArea) : 'N/A' },
                { label: 'Population', value: data.population ? pop(data.population) : 'N/A' },
                { label: 'Infra',      value: data.infrastructureScore ? `${data.infrastructureScore}/100` : 'N/A' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 text-center">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* ── Climate badge ── */}
            {data.climateRiskLevel && (
              <div className="px-4 pt-3 pb-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${riskBgText[data.climateRiskLevel] || 'bg-gray-100 text-gray-700'}`}>
                  🌡️ Climate Risk: {riskLabels[data.climateRiskLevel] || data.climateRiskLevel}
                </span>
              </div>
            )}

            {/* ── Land Use ── */}
            <section className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Land Use Distribution
              </h3>
              {data.totalArea > 0 && (
                <>
                  <StatBar label="🌾 Agricultural" value={`${km(data.agriculturalArea)} · ${pct(data.agriculturalArea, data.totalArea)}`}
                    pctVal={(data.agriculturalArea / data.totalArea) * 100} color="#22c55e" />
                  <StatBar label="🏙️ Urban" value={`${km(data.urbanArea)} · ${pct(data.urbanArea, data.totalArea)}`}
                    pctVal={(data.urbanArea / data.totalArea) * 100} color="#f97316" />
                  <StatBar label="🌳 Forest" value={`${km(data.forestArea)} · ${pct(data.forestArea, data.totalArea)}`}
                    pctVal={(data.forestArea / data.totalArea) * 100} color="#15803d" />
                  <StatBar label="💧 Water" value={`${km(data.waterArea)} · ${pct(data.waterArea, data.totalArea)}`}
                    pctVal={(data.waterArea / data.totalArea) * 100} color="#3b82f6" />
                  {data.wasteland > 0 && (
                    <StatBar label="🏜️ Wasteland" value={`${km(data.wasteland)} · ${pct(data.wasteland, data.totalArea)}`}
                      pctVal={(data.wasteland / data.totalArea) * 100} color="#d1d5db" />
                  )}
                </>
              )}
            </section>

            {/* ── Districts list (state level only) ── */}
            {showDistricts && (
              <DistrictList
                districts={districts}
                loadingDistricts={loadingDistricts}
                onSelect={onDistrictSelect}
              />
            )}

            {/* ── Climate Indicators ── */}
            <section className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Climate Indicators
              </h3>
              <StatBar label="☀️ Drought Risk"      value={`${data.droughtRisk ?? 'N/A'}/100`}    pctVal={data.droughtRisk}    color="#f59e0b" />
              <StatBar label="🌊 Flood Risk"         value={`${data.floodRisk ?? 'N/A'}/100`}      pctVal={data.floodRisk}      color="#3b82f6" />
              <StatBar label="🔥 Heat Risk"          value={`${data.heatRisk ?? 'N/A'}/100`}       pctVal={data.heatRisk}       color="#ef4444" />
              <StatBar label="🌾 Land Degradation"   value={`${data.landDegradation ?? 'N/A'}/100`} pctVal={data.landDegradation} color="#92400e" />
              {data.annualRainfallMm != null && (
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">🌧️ Rainfall</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{num(data.annualRainfallMm)} mm/yr</span>
                </div>
              )}
            </section>

            {/* ── Governance ── */}
            <section className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Land Governance
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '⚖️',  label: 'Total Disputes',  value: num(data.activeLandDisputes),  color: 'text-red-600'    },
                  { icon: '⏳', label: 'Pending',           value: num(data.pendingDisputes),     color: 'text-orange-600' },
                  { icon: '🛣️', label: 'Infra Score',       value: `${data.infrastructureScore ?? '—'}/100`, color: 'text-purple-600' },
                  { icon: '🏗️', label: 'Active Projects',   value: num(data.activeProjects),      color: 'text-blue-600'   },
                  { icon: '📄', label: 'Research Papers',   value: num(data.researchCount || 0),  color: 'text-indigo-600' },
                  { icon: '📋', label: 'Related Policies',  value: num(data.policyCount || 0),    color: 'text-teal-600'   },
                ].map(({ icon, label, value, color }) => (
                  <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 border border-gray-100 dark:border-gray-700">
                    <p className="text-base leading-none mb-1">{icon}</p>
                    <p className={`text-sm font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Infrastructure detail ── */}
            {(data.roadsKm || data.railwaysKm || data.hospitals) && (
              <section className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Infrastructure
                </h3>
                <div className="space-y-1.5 text-sm">
                  {[
                    ['🛣️ Roads', data.roadsKm ? `${num(data.roadsKm)} km` : null],
                    ['🚂 Railways', data.railwaysKm ? `${num(data.railwaysKm)} km` : null],
                    ['🏥 Hospitals', data.hospitals ? num(data.hospitals) : null],
                    ['🏭 Industrial Areas', data.industrialAreas ? num(data.industrialAreas) : null],
                  ].filter(([, v]) => v).map(([l, v]) => (
                    <div key={l} className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{l}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{v}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Agriculture ── */}
            {(data.agriculture?.majorCrops?.length > 0 || data.majorCrops?.length > 0) && (
              <section className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Agriculture
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(data.agriculture?.majorCrops || data.majorCrops || []).map((c) => (
                    <span key={c} className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full border border-green-200 dark:border-green-700">{c}</span>
                  ))}
                </div>
                {(data.agriculture?.irrigatedAreaPct || data.irrigatedAreaPct) && (
                  <StatBar label="💧 Irrigated Area"
                    value={`${data.agriculture?.irrigatedAreaPct || data.irrigatedAreaPct}%`}
                    pctVal={data.agriculture?.irrigatedAreaPct || data.irrigatedAreaPct}
                    color="#3b82f6" />
                )}
                {(data.agriculture?.soilHealth || data.soilHealth) && (
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-500">🌱 Soil Health</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{data.agriculture?.soilHealth || data.soilHealth}</span>
                  </div>
                )}
              </section>
            )}

            {/* ── Admin / Demographics ── */}
            <section className="px-4 py-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Demographics & Admin
              </h3>
              <div className="space-y-1.5 text-sm">
                {[
                  ['🏛️ Capital / HQ',      data.adminInfo?.capital],
                  ['🌐 Region',             data.adminInfo?.region],
                  ['🔢 Taluks',             data.adminInfo?.talukCount],
                  ['🏘️ Villages',          data.adminInfo?.villageCount ? num(data.adminInfo.villageCount) : null],
                  ['👥 Population',         data.population ? num(data.population) : null],
                  ['📐 Pop. Density',       data.demographics?.populationDensity ? `${num(data.demographics.populationDensity)}/km²` : (data.populationDensity ? `${num(data.populationDensity)}/km²` : null)],
                  ['📚 Literacy Rate',      data.demographics?.literacyRate ? `${data.demographics.literacyRate}%` : (data.literacyRate ? `${data.literacyRate}%` : null)],
                  ['🏙️ Urban Population',  data.demographics?.urbanPopulationPct ? `${data.demographics.urbanPopulationPct}%` : null],
                  ['🌧️ Annual Rainfall',   data.annualRainfallMm ? `${num(data.annualRainfallMm)} mm` : null],
                  ['🌡️ Avg Temperature',   data.avgTempCelsius ? `${data.avgTempCelsius}°C` : null],
                ].filter(([, v]) => v != null).map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200 text-right ml-2">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Land use change trend ── */}
            {data.landUseChanges?.length > 0 && (
              <section className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> Land Use Changes
                </h3>
                <div className="space-y-1.5">
                  {data.landUseChanges.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                      <span className="text-green-600 font-medium truncate">{c.fromType}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-orange-600 font-medium truncate">{c.toType}</span>
                      <span className="ml-auto text-gray-500 shrink-0">{c.areaKm2} km² ({c.year})</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : null}
      </div>

      {/* ── Footer disclaimer ── */}
      <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800 flex-shrink-0">
        <p className="text-xs text-amber-700 dark:text-amber-400 text-center">⚠️ Demo data – Not official government statistics</p>
      </div>
    </div>
  );
}

/* ── District GeoJSON overlay inside map ────────────────────────────────────── */
function DistrictOverlay({ geoJSON, activeDistrict, onDistrictClick, activeLayers }) {
  const ref = useRef(null);
  const fillBase = fillForLayers(activeLayers);

  const style = useCallback((feature) => {
    const isActive = feature.properties.name === activeDistrict;
    return {
      fillColor:   isActive ? '#fbbf24' : fillBase,
      weight:      isActive ? 3 : 1.5,
      color:       isActive ? '#fff' : 'rgba(255,255,255,0.8)',
      fillOpacity: isActive ? 0.9 : 0.65,
    };
  }, [activeDistrict, fillBase]);

  const onEach = useCallback((feature, layer) => {
    const name = feature.properties.name;
    layer.bindTooltip(`📍 ${name}`, {
      direction: 'top', className: 'leaflet-tooltip-custom', offset: [0, -4],
    });
    layer.on({
      click() { onDistrictClick(name); },
      mouseover(e) { e.target.setStyle({ weight: 3, fillOpacity: 0.9, color: '#fff' }); },
      mouseout(e)  { if (ref.current) ref.current.resetStyle(e.target); },
    });
  }, [onDistrictClick]);

  if (!geoJSON) return null;
  return (
    <GeoJSON key={`districts-${activeDistrict}-${JSON.stringify(activeLayers)}`}
      ref={ref} data={geoJSON} style={style} onEachFeature={onEach} />
  );
}

/* ── components used INSIDE MapContainer (need useMap hook) ─────────────────── */
function ResetBtn({ onClick }) {
  const map = useMap();
  return (
    <button
      onClick={() => { map.flyTo(INDIA_CENTER, INDIA_ZOOM, { duration: 1 }); onClick(); }}
      title="Reset to India view"
      className="absolute bottom-32 right-3 z-[1000] w-9 h-9 bg-white shadow-lg rounded border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 text-base"
    >
      🇮🇳
    </button>
  );
}

function FullscreenBtn() {
  const [fs, setFs] = useState(false);
  return (
    <button
      onClick={() => {
        const el = document.getElementById('gis-map-root');
        if (!document.fullscreenElement) { el?.requestFullscreen(); setFs(true); }
        else { document.exitFullscreen(); setFs(false); }
      }}
      title="Toggle fullscreen"
      className="absolute bottom-20 right-3 z-[1000] w-9 h-9 bg-white shadow-lg rounded border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 text-sm"
    >
      {fs ? '⊡' : '⛶'}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function GISMapPage() {
  // map state
  const [indiaGeo,      setIndiaGeo]      = useState(null);
  const [districtGeo,   setDistrictGeo]   = useState(null);
  const [mapLoading,    setMapLoading]    = useState(true);
  const [tileKey,       setTileKey]       = useState('satellite');
  const [activeLayers,  setActiveLayers]  = useState(['agricultural', 'urban']);
  const [flyBounds,     setFlyBounds]     = useState(null);
  const [resetFlag,     setResetFlag]     = useState(false);

  // selection state
  const [selectedState,    setSelectedState]    = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // data state
  const [panelData,        setPanelData]        = useState(null);
  const [panelLoading,     setPanelLoading]     = useState(false);
  const [panelLevel,       setPanelLevel]       = useState(null); // 'state' | 'district'
  const [districts,        setDistricts]        = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // search items
  const [searchItems, setSearchItems] = useState([]);

  const stateGeoRef = useRef(null);

  /* load India GeoJSON once */
  useEffect(() => {
    api.get('/gis/india')
      .then(({ data }) => {
        setIndiaGeo(data.data);
        const stateItems = (data.data?.features || []).map((f) => ({
          type: 'state', label: f.properties.name, state: null,
        }));
        setSearchItems(stateItems);
      })
      .catch(console.error)
      .finally(() => setMapLoading(false));
  }, []);

  /* derive bounding box from GeoJSON feature */
  const getBounds = useCallback((geoData, name) => {
    if (!geoData) return null;
    const feat = geoData.features.find((f) => f.properties.name === name);
    if (!feat?.geometry?.coordinates?.length) return null;
    const coords = feat.geometry.coordinates[0];
    const lngs = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);
    return {
      south: Math.min(...lats) - 0.2, west: Math.min(...lngs) - 0.2,
      north: Math.max(...lats) + 0.2, east: Math.max(...lngs) + 0.2,
    };
  }, []);

  /* load state data + district list */
  const loadState = useCallback(async (stateName) => {
    setSelectedState(stateName);
    setSelectedDistrict(null);
    setDistrictGeo(null);
    setPanelData(null);
    setPanelLevel('state');
    setPanelLoading(true);
    setLoadingDistricts(true);

    // fly to state
    const bounds = getBounds(indiaGeo, stateName);
    if (bounds) setFlyBounds(bounds);

    try {
      const [stateRes, distRes] = await Promise.all([
        api.get(`/gis/state/${encodeURIComponent(stateName)}`),
        api.get(`/gis/${encodeURIComponent(stateName)}/districts`),
      ]);
      setPanelData(stateRes.data.data);
      setDistricts(distRes.data.data || []);
      if (distRes.data.geoJSON) setDistrictGeo(distRes.data.geoJSON);

      // enrich search with districts
      const distItems = (distRes.data.data || []).map((d) => ({
        type: 'district', label: d.district, state: stateName,
      }));
      setSearchItems((prev) => {
        const stateItems = prev.filter((i) => i.type === 'state');
        return [...stateItems, ...distItems];
      });
    } catch (err) {
      console.error(err);
    } finally {
      setPanelLoading(false);
      setLoadingDistricts(false);
    }
  }, [indiaGeo, getBounds]);

  /* load district data */
  const loadDistrict = useCallback(async (districtName) => {
    if (!selectedState) return;
    setSelectedDistrict(districtName);
    setPanelData(null);
    setPanelLevel('district');
    setPanelLoading(true);

    // fly to district via bounds from district GeoJSON
    if (districtGeo) {
      const b = getBounds(districtGeo, districtName);
      if (b) setFlyBounds(b);
    }

    try {
      const { data } = await api.get(
        `/gis/${encodeURIComponent(selectedState)}/${encodeURIComponent(districtName)}`
      );
      setPanelData(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setPanelLoading(false);
    }
  }, [selectedState, districtGeo, getBounds]);

  /* search select */
  const handleSearch = useCallback((item) => {
    if (item.type === 'state') {
      loadState(item.label);
    } else {
      // load state first if needed, then district
      if (selectedState !== item.state) {
        loadState(item.state).then(() => loadDistrict(item.label));
      } else {
        loadDistrict(item.label);
      }
    }
  }, [loadState, loadDistrict, selectedState]);

  /* back to state from district */
  const backToState = useCallback(() => {
    if (!selectedState) return;
    setSelectedDistrict(null);
    setPanelLevel('state');
    setPanelLoading(true);
    api.get(`/gis/state/${encodeURIComponent(selectedState)}`)
      .then(({ data }) => setPanelData(data.data))
      .catch(console.error)
      .finally(() => setPanelLoading(false));
    // fly back to state
    const b = getBounds(indiaGeo, selectedState);
    if (b) setFlyBounds(b);
  }, [selectedState, indiaGeo, getBounds]);

  /* reset everything */
  const reset = useCallback(() => {
    setSelectedState(null);
    setSelectedDistrict(null);
    setDistrictGeo(null);
    setDistricts([]);
    setPanelData(null);
    setPanelLevel(null);
    setFlyBounds(null);
    setResetFlag((f) => !f);
  }, []);

  /* state GeoJSON style */
  const stateStyle = useCallback((feature) => {
    const isSelected = feature.properties.name === selectedState;
    const base = fillForLayers(activeLayers);
    return {
      fillColor:   isSelected ? '#fbbf24' : base,
      weight:      isSelected ? 3 : 1.5,
      color:       isSelected ? '#fff' : 'rgba(255,255,255,0.5)',
      fillOpacity: isSelected ? 0.9 : 0.6,
    };
  }, [selectedState, activeLayers]);

  const onEachState = useCallback((feature, layer) => {
    const name = feature.properties.name;
    layer.bindTooltip(`🏛️ ${name}`, {
      direction: 'top', className: 'leaflet-tooltip-custom', offset: [0, -4],
    });
    layer.on({
      click()   { loadState(name); },
      mouseover(e) { e.target.setStyle({ weight: 3, fillOpacity: 0.85, color: '#fff' }); },
      mouseout(e)  { if (stateGeoRef.current) stateGeoRef.current.resetStyle(e.target); },
    });
  }, [loadState]);

  /* reset flyBounds after fly fires */
  useEffect(() => {
    if (flyBounds) {
      const t = setTimeout(() => setFlyBounds(null), 2000);
      return () => clearTimeout(t);
    }
  }, [flyBounds]);

  const panelOpen = !!(panelData || panelLoading);

  return (
    <>
      <style>{`
        @keyframes slideInRight { from { transform:translateX(100%);opacity:0 } to { transform:translateX(0);opacity:1 } }
        .leaflet-tooltip-custom { background:rgba(0,0,0,0.78); color:#fff; border:none; border-radius:6px; font-size:12px; font-weight:600; padding:4px 10px; box-shadow:0 2px 8px rgba(0,0,0,0.35); white-space:nowrap; }
        .leaflet-tooltip-custom::before { display:none; }
        .leaflet-control-zoom a { background:white !important; color:#374151 !important; border-color:#d1d5db !important; }
        .leaflet-control-zoom a:hover { background:#f9fafb !important; }
      `}</style>

      <div id="gis-map-root" className="relative w-full bg-gray-950"
        style={{ height: 'calc(100vh - 80px)', minHeight: '600px' }}>

        {/* ── TOP BAR ─────────────────────────────────────────── */}
        <div className="absolute top-0 left-0 right-0 z-[1002] p-3 flex items-start gap-3 pointer-events-none">
          {/* Search */}
          <div className="pointer-events-auto">
            <SearchBox items={searchItems} onSelect={handleSearch} />
          </div>

          {/* Breadcrumb */}
          {(selectedState || selectedDistrict) && (
            <div className="pointer-events-auto hidden sm:block mt-0.5">
              <Breadcrumb
                state={selectedState}
                district={selectedDistrict}
                onReset={reset}
                onStateClick={() => selectedDistrict ? backToState() : null}
              />
            </div>
          )}

          <div className="flex-1" />

          {/* Tile switcher */}
          <div className="pointer-events-auto">
            <TileSwitcher current={tileKey} onChange={setTileKey} />
          </div>

          {/* Demo badge */}
          <div className="pointer-events-auto hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow">
            ⚠️ Demo GeoData
          </div>
        </div>

        {/* ── LAYER BAR ───────────────────────────────────────── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto
          bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-xl border border-gray-200 dark:border-gray-700 px-3 py-2">
          <LayerPills active={activeLayers} onToggle={(id) =>
            setActiveLayers((p) => p.includes(id) ? p.filter((l) => l !== id) : [...p, id])
          } />
        </div>

        {/* ── MAP ─────────────────────────────────────────────── */}
        {mapLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white font-semibold">Loading GIS Map…</p>
              <p className="text-gray-400 text-sm mt-1">Fetching geospatial data</p>
            </div>
          </div>
        ) : (
          <MapContainer center={INDIA_CENTER} zoom={INDIA_ZOOM} zoomControl={false}
            style={{ height: '100%', width: '100%' }} className="z-0">

            <TileLayer key={tileKey} url={TILES[tileKey].url}
              attribution={TILES[tileKey].attr} maxZoom={19} />

            <ZoomControl position="bottomright" />
            <ScaleControl position="bottomleft" imperial={false} />

            {/* India states GeoJSON */}
            {indiaGeo && (
              <GeoJSON key={`states-${selectedState}-${JSON.stringify(activeLayers)}`}
                ref={stateGeoRef} data={indiaGeo}
                style={stateStyle} onEachFeature={onEachState} />
            )}

            {/* District overlay when a state is selected */}
            {districtGeo && selectedState && (
              <DistrictOverlay
                geoJSON={districtGeo}
                activeDistrict={selectedDistrict}
                onDistrictClick={loadDistrict}
                activeLayers={activeLayers}
              />
            )}

            {/* Fly-to animation */}
            {flyBounds   && <FlyTo bounds={flyBounds} />}
            {resetFlag != null && !flyBounds && !selectedState && <FlyTo zoom={true} />}

            {/* Reset & Fullscreen */}
            <ResetBtn onClick={reset} />
            <FullscreenBtn />
          </MapContainer>
        )}

        {/* ── SIDE PANEL ──────────────────────────────────────── */}
        {panelOpen && (
          <DetailPanel
            data={panelData}
            districts={districts}
            loadingDistricts={loadingDistricts}
            loading={panelLoading}
            level={panelLevel}
            onClose={reset}
            onDistrictSelect={loadDistrict}
            onBackToState={backToState}
          />
        )}

        {/* ── BOTTOM STATUS BAR ───────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-[999] bg-black/40 backdrop-blur-sm text-white/60 text-xs flex items-center justify-between px-4 py-1 pointer-events-none">
          <span>⚠️ Demo GeoJSON – Boundaries illustrative only, not official cadastral boundaries</span>
          <span>
            {selectedDistrict
              ? `📍 ${selectedState} › ${selectedDistrict}`
              : selectedState
                ? `🏛️ ${selectedState} — click a district to drill down`
                : 'Click a state to explore'}
          </span>
        </div>
      </div>
    </>
  );
}

/* ── must be defined BEFORE they appear in JSX (hoisted via function decl) ─── */
