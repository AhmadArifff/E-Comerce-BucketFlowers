import { describe, it, expect } from 'vitest';
import {
  THEMES,
  DEFAULT_THEME_ID,
  normalizeThemeId,
  toDbThemeKey,
  isValidTheme,
} from '../../src/lib/theme.js';

describe('Theme Engine Unit Tests (PRD 7.15 & 14.1)', () => {
  it('should define all 3 core themes with required styling metadata', () => {
    expect(THEMES['tema-a']).toBeDefined();
    expect(THEMES['tema-b']).toBeDefined();
    expect(THEMES['tema-c']).toBeDefined();

    expect(THEMES['tema-a'].primaryColor).toBe('#F472B6');
    expect(THEMES['tema-b'].primaryColor).toBe('#BE123C');
    expect(THEMES['tema-c'].primaryColor).toBe('#8B5CF6');
  });

  it('should normalize various theme string formats correctly', () => {
    expect(normalizeThemeId('tema-a')).toBe('tema-a');
    expect(normalizeThemeId('TEMA_A_KOREAN_PASTEL')).toBe('tema-a');
    expect(normalizeThemeId('tema-b')).toBe('tema-b');
    expect(normalizeThemeId('TEMA_B_MODERN_ROMANTIC')).toBe('tema-b');
    expect(normalizeThemeId('tema-c')).toBe('tema-c');
    expect(normalizeThemeId('TEMA_C_PLAYFUL_KAWAII')).toBe('tema-c');
  });

  it('should fallback to DEFAULT_THEME_ID (tema-a) for unknown or null theme input', () => {
    expect(normalizeThemeId(null)).toBe(DEFAULT_THEME_ID);
    expect(normalizeThemeId(undefined)).toBe(DEFAULT_THEME_ID);
    expect(normalizeThemeId('unknown-dark-mode')).toBe(DEFAULT_THEME_ID);
    expect(normalizeThemeId('')).toBe(DEFAULT_THEME_ID);
  });

  it('should convert theme ID to database enum representation', () => {
    expect(toDbThemeKey('tema-a')).toBe('TEMA_A_KOREAN_PASTEL');
    expect(toDbThemeKey('tema-b')).toBe('TEMA_B_MODERN_ROMANTIC');
    expect(toDbThemeKey('tema-c')).toBe('TEMA_C_PLAYFUL_KAWAII');
  });

  it('should correctly validate supported theme identifiers', () => {
    expect(isValidTheme('tema-a')).toBe(true);
    expect(isValidTheme('tema-b')).toBe(true);
    expect(isValidTheme('tema-c')).toBe(true);
    expect(isValidTheme('TEMA_A_KOREAN_PASTEL')).toBe(true);
    expect(isValidTheme('tema-cyberpunk')).toBe(false);
  });
});
