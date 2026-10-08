/**
 * connectionService.js
 * Detects online/offline/weak-network status.
 * Uses the Navigator API + Network Information API where available.
 * Exports a React hook for use in components.
 *
 * Architecture note:
 * This is designed so a backend sync endpoint can be plugged in later
 * by replacing the DEMO_SYNC_URL placeholder in syncService.js.
 */

import { useState, useEffect, useCallback } from 'react';

// ─── Connection quality thresholds ────────────────────────────────────────────
const WEAK_DOWNLINK_MBPS = 1.0;   // below this = weak
const OFFLINE_DOWNLINK_MBPS = 0;

/**
 * Reads the best available signal strength from the browser.
 * Returns: 'online' | 'weak' | 'offline'
 */
export function getConnectionStatus() {
  if (!navigator.onLine) return 'offline';

  // Network Information API (Chrome/Android)
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    if (conn.downlink === OFFLINE_DOWNLINK_MBPS) return 'offline';
    if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') return 'weak';
    if (conn.downlink < WEAK_DOWNLINK_MBPS) return 'weak';
  }
  return 'online';
}

/**
 * Returns estimated speed string for display.
 */
export function getConnectionSpeedLabel() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!navigator.onLine) return 'No connection';
  if (!conn) return 'Speed unknown';
  if (conn.downlink != null) return `${(conn.downlink * 1000).toFixed(0)} Kbps`;
  return conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Unknown';
}

/**
 * React hook — subscribes to online/offline events + Network Info change events.
 * Returns { status, speedLabel, isOnline, isWeak, isOffline }
 */
export function useConnectionStatus() {
  const [status, setStatus] = useState(getConnectionStatus);
  const [speedLabel, setSpeedLabel] = useState(getConnectionSpeedLabel);

  const refresh = useCallback(() => {
    setStatus(getConnectionStatus());
    setSpeedLabel(getConnectionSpeedLabel());
  }, []);

  useEffect(() => {
    window.addEventListener('online',  refresh);
    window.addEventListener('offline', refresh);

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) conn.addEventListener('change', refresh);

    // Poll every 10 s as fallback for browsers without Network Info API
    const interval = setInterval(refresh, 10_000);

    return () => {
      window.removeEventListener('online',  refresh);
      window.removeEventListener('offline', refresh);
      if (conn) conn.removeEventListener('change', refresh);
      clearInterval(interval);
    };
  }, [refresh]);

  return {
    status,
    speedLabel,
    isOnline:  status === 'online',
    isWeak:    status === 'weak',
    isOffline: status === 'offline',
  };
}
