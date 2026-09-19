/**
 * Real-Time Cross-Tab, Cross-Window, and Iframe Reactive Synchronization Channel
 * Rujukan Mutlak: PRD.md Seksi 23 (Arsitektur Sinkronisasi Real-Time 4-Lapis)
 */

export type StorefrontSyncEvent =
  | { type: 'THEME_CHANGED'; theme: string }
  | { type: 'MAINTENANCE_TOGGLED'; isMaintenanceMode: boolean; title?: string; desc?: string };

const CHANNEL_NAME = 'chenille_storefront_sync';

let channel: BroadcastChannel | null = null;

const getChannel = (): BroadcastChannel | null => {
  if (typeof window === 'undefined') return null;
  if (!channel && 'BroadcastChannel' in window) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch (e) {
      console.warn('BroadcastChannel not supported or restricted:', e);
    }
  }
  return channel;
};

/**
 * Memancarkan event sinkronisasi seketika ke seluruh tab dan iframe pada origin yang sama
 */
export const broadcastSyncEvent = (event: StorefrontSyncEvent) => {
  if (typeof window === 'undefined') return;

  // 1. BroadcastChannel (antar tab & browser windows pada origin yang sama)
  const ch = getChannel();
  if (ch) {
    try {
      ch.postMessage(event);
    } catch (err) {
      console.warn('Failed to broadcast via channel:', err);
    }
  }

  // 2. window.postMessage ke parent (jika berjalan di dalam iframe)
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(event, '*');
  }

  // 3. window.postMessage ke semua child iframe (jika window utama memiliki iframe preview)
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    try {
      iframe.contentWindow?.postMessage(event, '*');
    } catch {
      // ignore cross-origin restrictions if any
    }
  });
};

export const broadcastThemeChange = (theme: string) => {
  broadcastSyncEvent({ type: 'THEME_CHANGED', theme });
};

export const broadcastMaintenanceToggle = (isMaintenanceMode: boolean, title?: string, desc?: string) => {
  broadcastSyncEvent({ type: 'MAINTENANCE_TOGGLED', isMaintenanceMode, title, desc });
};

/**
 * Mendaftarkan listener untuk menerima pembaruan real-time
 */
export const subscribeStorefrontSync = (callback: (event: StorefrontSyncEvent) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleChannelMessage = (e: MessageEvent) => {
    if (e.data && (e.data.type === 'THEME_CHANGED' || e.data.type === 'MAINTENANCE_TOGGLED')) {
      callback(e.data as StorefrontSyncEvent);
    }
  };

  const handleWindowMessage = (e: MessageEvent) => {
    if (e.data && (e.data.type === 'THEME_CHANGED' || e.data.type === 'MAINTENANCE_TOGGLED')) {
      callback(e.data as StorefrontSyncEvent);
    }
  };

  const ch = getChannel();
  if (ch) {
    ch.addEventListener('message', handleChannelMessage);
  }
  window.addEventListener('message', handleWindowMessage);

  return () => {
    if (ch) {
      ch.removeEventListener('message', handleChannelMessage);
    }
    window.removeEventListener('message', handleWindowMessage);
  };
};
