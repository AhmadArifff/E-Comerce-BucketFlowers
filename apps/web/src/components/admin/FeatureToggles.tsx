'use client';

import React, { useState } from 'react';
import { Sliders, ShieldCheck, Check, Palette, Sparkles } from 'lucide-react';
import { DEFAULT_FEATURE_TOGGLES } from '@chenille/shared';
import { useThemeStore, type ThemeId } from '@/stores/useThemeStore';

interface ToggleItem {
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

export const FeatureToggles: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const [toggles, setToggles] = useState<ToggleItem[]>(
    DEFAULT_FEATURE_TOGGLES.map((t) => ({
      key: t.key,
      name: t.name,
      description: t.description,
      isEnabled: Boolean(t.isEnabled),
    }))
  );

  const handleToggle = (key: string) => {
    setToggles(
      toggles.map((t) => (t.key === key ? { ...t, isEnabled: !t.isEnabled } : t))
    );
  };

  const themesList: { id: ThemeId; title: string; subtitle: string; icon: string; bg: string; color: string; desc: string }[] = [
    {
      id: 'tema-a',
      title: 'Tema A: Korean Soft Pastel',
      subtitle: 'Aesthetic & Dreamy Florist',
      icon: '🌸',
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      color: '#E11D48',
      desc: 'Blush pink, sage green, fairy lights, cocok untuk momen wisuda & sidang skripsi.',
    },
    {
      id: 'tema-b',
      title: 'Tema B: Modern Romantic',
      subtitle: 'Deep Velvet Wine & Gold',
      icon: '🌹',
      bg: 'bg-rose-950/10 border-amber-300 text-rose-950',
      color: '#9F1239',
      desc: 'Burgundy velvet, wax seal, golden glow, untuk momen anniversary & valentine mewah.',
    },
    {
      id: 'tema-c',
      title: 'Tema C: Playful Kawaii',
      subtitle: 'Vibrant Coral & Cute Bears',
      icon: '🌻',
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      color: '#EA580C',
      desc: 'Boneka wisuda toga lucu, senyuman ceria, dan palet warna energik anak muda.',
    },
  ];

  return (
    <div className="space-y-8 mb-8">
      {/* EXCLUSIVE ADMIN THEME CONTROLLER PANEL */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
                  Tata Kelola Tema Toko Online (Admin-Only Control)
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Global Sync
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Pilih tema visual yang aktif untuk seluruh pengunjung storefront, login, dan portal pelanggan.
              </p>
            </div>
          </div>

          <div className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full self-start sm:self-auto flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tema Aktif Saat Ini: <strong className="uppercase">{theme}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themesList.map((t) => {
            const isCurrent = theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? 'border-rose-500 bg-rose-50/70 shadow-md ring-2 ring-rose-400/20'
                    : 'border-stone-200 bg-white hover:border-rose-200 hover:shadow-xs'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Aktif</span>
                  </div>
                )}
                <div>
                  <span className="text-3xl mb-2 block">{t.icon}</span>
                  <h3 className="font-extrabold text-sm text-stone-800">{t.title}</h3>
                  <div className="text-[11px] font-semibold text-rose-600 mb-2">{t.subtitle}</div>
                  <p className="text-xs text-stone-500 leading-relaxed mb-4">{t.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTheme(t.id);
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {isCurrent ? '✓ Tema Sedang Digunakan' : 'Terapkan Tema Ini'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
              Feature Toggles & Guard Clauses
            </h2>
            <p className="text-xs text-stone-500">
              Mengontrol fitur kritis toko secara dinamis tanpa perlu deploy ulang kode aplikasi.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
          {toggles.filter((t) => t.isEnabled).length} / {toggles.length} Fitur Aktif
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {toggles.map((t) => (
          <div
            key={t.key}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
              t.isEnabled
                ? 'bg-rose-50/40 border-rose-200 shadow-xs'
                : 'bg-stone-50/50 border-stone-200 opacity-75'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-stone-800">{t.name}</span>
                <span
                  className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                    t.isEnabled ? 'bg-rose-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {t.isEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">{t.description}</p>
              <code className="text-[10px] text-stone-400 block font-mono">{t.key}</code>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => handleToggle(t.key)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 ${
                t.isEnabled ? 'bg-rose-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  t.isEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};
