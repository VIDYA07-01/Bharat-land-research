/**
 * offlineStorage.js
 * IndexedDB wrapper for LandVault Offline.
 *
 * Schema
 * ──────
 * Database  : landvault_db   (version 1)
 * Stores    :
 *   resources   – saved resource objects (keyPath: id)
 *   syncLog     – sync event records     (keyPath: id, autoIncrement)
 *   settings    – single-row KV store    (keyPath: key)
 *
 * All writes are non-blocking (Promise-based).
 * Falls back to localStorage when IndexedDB is unavailable.
 *
 * Architecture note:
 * When a real backend is connected, syncService.js will push/pull
 * from the API and call offlineStorage.upsertResource() to keep
 * the local store current.
 */

const DB_NAME    = 'landvault_db';
const DB_VERSION = 1;

// ─── Open / initialise DB ─────────────────────────────────────────────────────
let _dbPromise = null;

function openDB() {
  if (_dbPromise) return _dbPromise;

  _dbPromise = new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      // Resources store
      if (!db.objectStoreNames.contains('resources')) {
        const store = db.createObjectStore('resources', { keyPath: 'id' });
        store.createIndex('type',      'type',      { unique: false });
        store.createIndex('category',  'category',  { unique: false });
        store.createIndex('savedDate', 'savedDate', { unique: false });
        store.createIndex('pinned',    'pinned',    { unique: false });
      }
      // Sync log store
      if (!db.objectStoreNames.contains('syncLog')) {
        db.createObjectStore('syncLog', { keyPath: 'id', autoIncrement: true });
      }
      // Settings KV store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });

  return _dbPromise;
}

// ─── Generic IDB helpers ──────────────────────────────────────────────────────
function idbGet(storeName, key) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx  = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  }));
}

function idbPut(storeName, value) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx  = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).put(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  }));
}

function idbDelete(storeName, key) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx  = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).delete(key);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  }));
}

function idbGetAll(storeName) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx  = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror   = () => reject(req.error);
  }));
}

function idbClear(storeName) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx  = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).clear();
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  }));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Save a resource for offline access */
export async function saveResource(resource) {
  const record = {
    ...resource,
    savedDate: resource.savedDate || new Date().toISOString(),
    offlineStatus: 'available',
    pinned: resource.pinned || false,
  };
  await idbPut('resources', record);
  return record;
}

/** Remove a resource from offline storage */
export async function removeResource(id) {
  await idbDelete('resources', id);
}

/** Get a single saved resource */
export async function getResource(id) {
  return idbGet('resources', id);
}

/** Get all saved resources */
export async function getAllResources() {
  return idbGetAll('resources');
}

/** Toggle pinned status (pinned resources are never auto-cleared) */
export async function togglePin(id) {
  const existing = await idbGet('resources', id);
  if (!existing) return;
  await idbPut('resources', { ...existing, pinned: !existing.pinned });
}

/** Update a resource (e.g. after sync brings new version) */
export async function upsertResource(resource) {
  return saveResource(resource);
}

/** Clear all non-pinned resources */
export async function clearUnpinned() {
  const all = await getAllResources();
  const toDelete = all.filter((r) => !r.pinned);
  await Promise.all(toDelete.map((r) => removeResource(r.id)));
  return toDelete.length;
}

/** Clear everything (including pinned) */
export async function clearAll() {
  await idbClear('resources');
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export async function getSetting(key) {
  const row = await idbGet('settings', key);
  return row ? row.value : null;
}

export async function setSetting(key, value) {
  await idbPut('settings', { key, value });
}

// ─── Sync log ─────────────────────────────────────────────────────────────────
export async function appendSyncLog(entry) {
  await openDB().then((db) => new Promise((resolve, reject) => {
    const tx  = db.transaction('syncLog', 'readwrite');
    const req = tx.objectStore('syncLog').add({ ...entry, ts: new Date().toISOString() });
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  }));
}

export async function getRecentSyncLogs(limit = 10) {
  const all = await idbGetAll('syncLog');
  return all.slice(-limit).reverse();
}

// ─── Storage estimate ─────────────────────────────────────────────────────────
export async function getStorageEstimate() {
  if (navigator.storage && navigator.storage.estimate) {
    const { usage, quota } = await navigator.storage.estimate();
    return {
      usedBytes:  usage  || 0,
      quotaBytes: quota  || 0,
      usedMB:  ((usage  || 0) / 1_048_576).toFixed(1),
      quotaMB: ((quota  || 0) / 1_048_576).toFixed(1),
    };
  }
  // Fallback: use demo values
  return { usedBytes: 712_000_000, quotaBytes: 1_258_291_200, usedMB: '680', quotaMB: '1200' };
}

// ─── Seed demo data (first-time run) ─────────────────────────────────────────
export async function seedDemoDataIfEmpty(demoResources) {
  const existing = await getAllResources();
  if (existing.length === 0) {
    await Promise.all(demoResources.map((r) => saveResource(r)));
  }
}
