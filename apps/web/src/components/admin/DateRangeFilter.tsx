'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X, ChevronDown, Check, RotateCcw } from 'lucide-react';

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  presetLabel?: string;
}

interface DateRangeFilterProps {
  range?: DateRange;
  value?: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  label?: string;
  align?: 'left' | 'right';
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  range,
  value,
  onChange,
  className = '',
  label = 'Filter Rentang Tanggal',
  align = 'right',
}) => {
  const currentRange = range || value || { startDate: '', endDate: '' };
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [effectiveAlign, setEffectiveAlign] = useState<'left' | 'right'>(align);

  // Helper presets based on simulated current date: 2026-09-08
  const PRESETS = [
    { label: 'Semua Waktu', start: '', end: '' },
    { label: 'Hari Ini (8 Sep)', start: '2026-09-08', end: '2026-09-08' },
    { label: '7 Hari Terakhir', start: '2026-09-01', end: '2026-09-08' },
    { label: '30 Hari Terakhir', start: '2026-08-09', end: '2026-09-08' },
    { label: 'Bulan Ini (Sep)', start: '2026-09-01', end: '2026-09-30' },
    { label: 'Bulan Lalu (Ags)', start: '2026-08-01', end: '2026-08-31' },
  ];

  // Detect and adjust alignment if the popover would overflow viewport bounds
  useEffect(() => {
    if (isOpen && popoverRef.current) {
      const rect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (rect.right > viewportWidth - 12) {
        setEffectiveAlign('right');
      } else if (rect.left < 12) {
        setEffectiveAlign('left');
      }
    } else {
      setEffectiveAlign(align);
    }
  }, [isOpen, align]);

  const handleSelectPreset = (preset: { label: string; start: string; end: string }) => {
    onChange({
      startDate: preset.start,
      endDate: preset.end,
      presetLabel: preset.start ? preset.label : undefined,
    });
    setIsOpen(false);
  };

  const handleReset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange({ startDate: '', endDate: '', presetLabel: undefined });
  };

  const isFiltered = Boolean(currentRange.startDate || currentRange.endDate);

  const formatShortDate = (isoStr: string) => {
    if (!isoStr) return '';
    try {
      const parts = isoStr.split('-');
      if (parts.length === 3) {
        const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        const day = parseInt(parts[2], 10);
        const month = monthNames[parseInt(parts[1], 10)] || parts[1];
        return `${day} ${month}`;
      }
      return isoStr;
    } catch {
      return isoStr;
    }
  };

  const formatDisplay = () => {
    if (currentRange.presetLabel) return currentRange.presetLabel;
    if (currentRange.startDate && currentRange.endDate) {
      if (currentRange.startDate === currentRange.endDate) {
        return formatShortDate(currentRange.startDate);
      }
      return `${formatShortDate(currentRange.startDate)} - ${formatShortDate(currentRange.endDate)}`;
    }
    if (currentRange.startDate) return `Sejak ${formatShortDate(currentRange.startDate)}`;
    if (currentRange.endDate) return `Sampai ${formatShortDate(currentRange.endDate)}`;
    return 'Semua Waktu';
  };

  return (
    <div className={`relative inline-flex items-center text-xs ${className}`}>
      {/* Trigger Button */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${
            isFiltered
              ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs hover:bg-rose-100/70'
              : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
          }`}
        >
          <Calendar className={`w-3.5 h-3.5 ${isFiltered ? 'text-rose-600' : 'text-stone-400'}`} />
          <span className="whitespace-nowrap">{formatDisplay()}</span>
          <ChevronDown
            className={`w-3 h-3 text-stone-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-rose-600' : ''
            }`}
          />
        </button>

        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            title="Reset Filter Tanggal"
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Popover Dropdown */}
      {isOpen && (
        <>
          {/* Invisible Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/5"
            onClick={() => setIsOpen(false)}
          />

          {/* Popover Card */}
          <div
            ref={popoverRef}
            className={`absolute top-full mt-2 z-50 w-[340px] sm:w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-150 ${
              effectiveAlign === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-600" />
                <span className="font-extrabold text-stone-800 text-xs tracking-tight">
                  {label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Pilihan Rentang Cepat
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESETS.map((p) => {
                  const isActive =
                    (!p.start && !currentRange.startDate) ||
                    (p.start === currentRange.startDate && p.end === currentRange.endDate);
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`text-left px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-between border ${
                        isActive
                          ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                          : 'bg-stone-50/80 hover:bg-rose-50/60 border-stone-200/80 hover:border-rose-200 text-stone-700 hover:text-rose-700'
                      }`}
                    >
                      <span className="whitespace-nowrap">{p.label}</span>
                      {isActive && <Check className="w-3 h-3 text-white stroke-[3] shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Range Inputs */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Atur Rentang Tanggal Kustom
                </span>
                {(currentRange.startDate || currentRange.endDate) && (
                  <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Kustom Aktif
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 block">Dari Tanggal</label>
                  <input
                    type="date"
                    value={currentRange.startDate}
                    onChange={(e) =>
                      onChange({
                        ...currentRange,
                        startDate: e.target.value,
                        presetLabel: undefined,
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 block">Sampai Tanggal</label>
                  <input
                    type="date"
                    value={currentRange.endDate}
                    onChange={(e) =>
                      onChange({
                        ...currentRange,
                        endDate: e.target.value,
                        presetLabel: undefined,
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Apply & Reset Buttons */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              {isFiltered ? (
                <button
                  type="button"
                  onClick={() => handleReset()}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer flex items-center gap-1 border border-transparent hover:border-rose-200"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Terapkan Filter</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
