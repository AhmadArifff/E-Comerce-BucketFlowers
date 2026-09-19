'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getApiUrl } from '@/lib/api-client';

import { broadcastThemeChange, subscribeStorefrontSync } from '@/lib/sync-channel';

export type ThemeId = 'tema-a' | 'tema-b' | 'tema-c';

export const THEME_DB_MAP: Record<ThemeId, string> = {
  'tema-a': 'TEMA_A_KOREAN_PASTEL',
  'tema-b': 'TEMA_B_MODERN_ROMANTIC',
  'tema-c': 'TEMA_C_PLAYFUL_KAWAII',
};

export const DB_THEME_MAP: Record<string, ThemeId> = {
  TEMA_A_KOREAN_PASTEL: 'tema-a',
  TEMA_B_MODERN_ROMANTIC: 'tema-b',
  TEMA_C_PLAYFUL_KAWAII: 'tema-c',
  'tema-a': 'tema-a',
  'tema-b': 'tema-b',
  'tema-c': 'tema-c',
};

interface ThemeState {
  theme: ThemeId;
  setTheme: (theme: ThemeId, persistToBackend?: boolean) => Promise<void>;
  syncFromServer: (dbTheme: string) => void;
  fetchServerTheme: () => Promise<ThemeId | null>;
  initSyncListener: () => () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'tema-a',

      setTheme: async (theme, persistToBackend = false) => {
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
        set({ theme });
        broadcastThemeChange(theme);

        if (persistToBackend) {
          try {
            const dbEnum = THEME_DB_MAP[theme] || 'TEMA_A_KOREAN_PASTEL';
            await fetch(getApiUrl('/api/v1/admin/settings'), {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ active_theme: dbEnum }),
            });
          } catch (e) {
            console.warn('[useThemeStore] Gagal menyimpan tema ke basis data:', e);
          }
        }
      },

      initSyncListener: () => {
        return subscribeStorefrontSync((event) => {
          if (event.type === 'THEME_CHANGED' && event.theme) {
            const mapped = DB_THEME_MAP[event.theme];
            if (mapped && mapped !== get().theme) {
              if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('data-theme', mapped);
              }
              set({ theme: mapped });
            }
          }
        });
      },

      syncFromServer: (dbTheme: string) => {
        const mapped = DB_THEME_MAP[dbTheme];
        if (mapped) {
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', mapped);
          }
          set({ theme: mapped });
        }
      },

      fetchServerTheme: async () => {
        try {
          const res = await fetch(getApiUrl('/api/v1/admin/settings'));
          const json = await res.json();
          if (json.success && json.data?.active_theme) {
            const mapped = DB_THEME_MAP[json.data.active_theme];
            if (mapped) {
              if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('data-theme', mapped);
              }
              set({ theme: mapped });
              return mapped;
            }
          }
        } catch (e) {
          console.warn('[useThemeStore] Gagal fetch server settings:', e);
        }
        return null;
      },
    }),
    {
      name: 'chenille_active_theme',
      onRehydrateStorage: () => (state) => {
        if (state?.theme && typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
