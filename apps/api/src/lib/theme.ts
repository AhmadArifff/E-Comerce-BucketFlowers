/**
 * Theme Engine Definitions & Validation
 * Complies with PRD Section 7.15 & 14.1.
 */

export type StoreThemeId = 'tema-a' | 'tema-b' | 'tema-c';
export type DbThemeKey = 'TEMA_A_KOREAN_PASTEL' | 'TEMA_B_MODERN_ROMANTIC' | 'TEMA_C_PLAYFUL_KAWAII';

export interface ThemeConfig {
  id: StoreThemeId;
  dbKey: DbThemeKey;
  name: string;
  aesthetic: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export const THEMES: Record<StoreThemeId, ThemeConfig> = {
  'tema-a': {
    id: 'tema-a',
    dbKey: 'TEMA_A_KOREAN_PASTEL',
    name: 'Tema A — Korean Pastel Bloom',
    aesthetic: 'Soft, clean, aesthetic pastel tone with gentle pink and sage accents',
    primaryColor: '#F472B6',
    secondaryColor: '#A7F3D0',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  'tema-b': {
    id: 'tema-b',
    dbKey: 'TEMA_B_MODERN_ROMANTIC',
    name: 'Tema B — Modern Romantic Velvet',
    aesthetic: 'Deep burgundy, warm rose, and luxury gold foil aesthetics',
    primaryColor: '#BE123C',
    secondaryColor: '#FDE047',
    fontFamily: 'Playfair Display, serif',
  },
  'tema-c': {
    id: 'tema-c',
    dbKey: 'TEMA_C_PLAYFUL_KAWAII',
    name: 'Tema C — Playful Kawaii Chenille',
    aesthetic: 'Vibrant candy colors, bubbly cards, and cheerful emoji accents',
    primaryColor: '#8B5CF6',
    secondaryColor: '#FBBF24',
    fontFamily: 'Outfit, Poppins, sans-serif',
  },
};

export const DEFAULT_THEME_ID: StoreThemeId = 'tema-a';

export function normalizeThemeId(input?: string | null): StoreThemeId {
  if (!input) return DEFAULT_THEME_ID;
  const lower = input.toLowerCase().trim();
  if (lower === 'tema-a' || lower === 'tema_a_korean_pastel') return 'tema-a';
  if (lower === 'tema-b' || lower === 'tema_b_modern_romantic') return 'tema-b';
  if (lower === 'tema-c' || lower === 'tema_c_playful_kawaii') return 'tema-c';
  return DEFAULT_THEME_ID;
}

export function toDbThemeKey(themeId: StoreThemeId): DbThemeKey {
  return THEMES[themeId]?.dbKey ?? 'TEMA_A_KOREAN_PASTEL';
}

export function isValidTheme(theme: string): boolean {
  return ['tema-a', 'tema-b', 'tema-c', 'TEMA_A_KOREAN_PASTEL', 'TEMA_B_MODERN_ROMANTIC', 'TEMA_C_PLAYFUL_KAWAII'].includes(theme);
}
