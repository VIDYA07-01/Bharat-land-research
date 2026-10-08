/**
 * syncService.js
 * Demo synchronisation engine for LandVault Offline.
 *
 * In DEMO mode this simulates a sync with a backend using
 * a controlled delay and demo data — no real network call is made.
 *
 * Architecture note:
 * Replace DEMO_MODE = false and fill in SYNC_API_BASE_URL
 * when a real Node.js/Express backend is available.
 * The interface (runSync, getSyncStatus) stays the same.
 */

import {
  getAllResources,
  upsertResource,
  appendSyncLog,
  setSetting,
  getSetting,
} from './offlineStorage';

// ─── Config ───────────────────────────────────────────────────────────────────
const DEMO_MODE      = true;
// const SYNC_API_BASE_URL = '/api/landvault/sync'; // ← plug in when backend ready

// ─── Sync state machine ───────────────────────────────────────────────────────
// States: idle | checking | downloading | updating | complete | error
let _listeners = [];
let _state     = {
  phase:           'idle',   // idle | checking | downloading | updating | complete | error
  resourcesChecked: 0,
  resourcesUpdated: 0,
  newSummaries:     0,
  storageFreed:     0,
  errors:           0,
  lastSync:         null,
  progress:         0,       // 0–100
};

function emit(patch) {
  _state = { ..._state, ...patch };
  _listeners.forEach((fn) => fn(_state));
}

export function subscribeSyncState(fn) {
  _listeners.push(fn);
  fn(_state); // immediate snapshot
  return () => { _listeners = _listeners.filter((x) => x !== fn); };
}

export function getSyncState() { return { ..._state }; }

// ─── Demo sync steps ──────────────────────────────────────────────────────────
function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function runDemoSync() {
  emit({ phase: 'checking', progress: 10, resourcesChecked: 0, resourcesUpdated: 0, errors: 0, newSummaries: 0 });
  await delay(900);

  const resources = await getAllResources();
  emit({ phase: 'checking', progress: 30, resourcesChecked: resources.length });
  await delay(700);

  emit({ phase: 'downloading', progress: 55 });
  await delay(1000);

  // Simulate updating 2–4 resources with a bump to lastUpdated
  const updateCount  = Math.min(resources.length, Math.floor(Math.random() * 3) + 2);
  const toUpdate     = resources.slice(0, updateCount);
  const newSummaries = Math.floor(Math.random() * 2) + 1;

  emit({ phase: 'updating', progress: 75 });
  await delay(800);

  for (const r of toUpdate) {
    await upsertResource({
      ...r,
      lastUpdated: new Date().toISOString().slice(0, 10),
      offlineStatus: 'available',
    });
  }

  const syncTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  await setSetting('lastSync', syncTime);
  await appendSyncLog({
    phase: 'complete',
    resourcesChecked: resources.length,
    resourcesUpdated: updateCount,
    newSummaries,
    errors: 0,
  });

  emit({
    phase: 'complete',
    progress: 100,
    resourcesChecked: resources.length,
    resourcesUpdated: updateCount,
    newSummaries,
    storageFreed: Math.floor(Math.random() * 5),
    errors: 0,
    lastSync: syncTime,
  });

  // Reset to idle after 4 s so UI can re-trigger
  await delay(4000);
  emit({ phase: 'idle', progress: 0 });
}

async function runRealSync() {
  // Placeholder for real backend integration
  // const response = await fetch(`${SYNC_API_BASE_URL}/pull`, { method: 'POST', ... });
  // const { updates } = await response.json();
  // for (const r of updates) await upsertResource(r);
  throw new Error('Real sync not yet connected. Set DEMO_MODE = true.');
}

/** Kick off a sync. Safe to call while already syncing (no-op). */
export async function runSync() {
  if (_state.phase !== 'idle' && _state.phase !== 'complete' && _state.phase !== 'error') return;
  try {
    if (DEMO_MODE) {
      await runDemoSync();
    } else {
      await runRealSync();
    }
  } catch (err) {
    console.error('[syncService] Sync error:', err);
    emit({ phase: 'error', errors: 1, progress: 0 });
    await appendSyncLog({ phase: 'error', message: err.message });
  }
}

// ─── Restore last-sync timestamp from IDB on import ──────────────────────────
getSetting('lastSync').then((val) => {
  if (val) emit({ lastSync: val });
});
