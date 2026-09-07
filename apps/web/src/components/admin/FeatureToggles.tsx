'use client';

import React, { useState } from 'react';
import { Sliders, ShieldCheck, Check } from 'lucide-react';
import { DEFAULT_FEATURE_TOGGLES } from '@chenille/shared';

interface ToggleItem {
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

export const FeatureToggles: React.FC = () => {
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

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6 mb-8">
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
  );
};
