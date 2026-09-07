'use client';

import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const CapacityWidget: React.FC = () => {
  const currentSlots = 12;
  const maxSlots = 20;
  const remaining = maxSlots - currentSlots;
  const percentage = Math.round((currentSlots / maxSlots) * 100);

  return (
    <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 rounded-2xl border border-rose-200/80 p-4 sm:p-5 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-rose-600/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-extrabold text-stone-800">
              Kapasitas Produksi Harian Atelier (Capacity Throttling)
            </h4>
            <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
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
            className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
