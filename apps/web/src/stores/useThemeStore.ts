'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeId = 'tema-a' | 'tema-b' | 'tema-c';

interface ThemeState {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'tema-a',
      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
        set({ theme });
      },
    }),
    {
      name: 'chenille_active_theme',
    }
  )
);
