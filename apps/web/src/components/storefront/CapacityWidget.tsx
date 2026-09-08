'use client';

import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const CapacityWidget: React.FC = () => {
  const currentSlots = 12;
  const maxSlots = 20;
  const remaining = maxSlots - currentSlots;
  const percentage = Math.round((currentSlots / maxSlots) * 100);

  return (
    <div className="bg-theme-surface-subtle rounded-2xl border border-theme-border p-4 sm:p-5 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-theme-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-extrabold text-stone-800">
              Kapasitas Produksi Harian Atelier (Capacity Throttling)
            </h4>
            <span className="bg-white text-theme-primary border border-theme-border text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
              Live Tracker
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Kami membatasi {maxSlots} buket PO/hari agar setiap tangkai dirangkai dengan presisi sempurna tanpa terburu-buru.
          </p>
        </div>
      </div>

      <div className="w-full sm:w-60 flex-shrink-0 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-stone-600">Terisi {currentSlots} / {maxSlots}</span>
          <span className={remaining <= 5 ? 'text-amber-600 font-extrabold' : 'text-emerald-600 font-extrabold'}>
            Sisa {remaining} Slot Hari Ini
          </span>
        </div>
        <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-theme-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
