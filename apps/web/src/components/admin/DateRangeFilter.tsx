'use client';

import React, { useState } from 'react';
import { Calendar, X, Filter, ChevronDown, Check } from 'lucide-react';

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
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  range,
  value,
  onChange,
  className = '',
  label = 'Filter Tanggal',
}) => {
  const currentRange = range || value || { startDate: '', endDate: '' };
  const [isOpen, setIsOpen] = useState(false);

  // Helper presets based on simulated current date: 2026-09-08
  const PRESETS = [
    { label: 'Semua Waktu', start: '', end: '' },
    { label: 'Hari Ini (8 Sep)', start: '2026-09-08', end: '2026-09-08' },
    { label: '7 Hari Terakhir', start: '2026-09-01', end: '2026-09-08' },
    { label: '30 Hari Terakhir', start: '2026-08-09', end: '2026-09-08' },
    { label: 'Bulan Ini (Sep 2026)', start: '2026-09-01', end: '2026-09-30' },
    { label: 'Bulan Lalu (Ags 2026)', start: '2026-08-01', end: '2026-08-31' },
  ];

  const handleSelectPreset = (preset: { label: string; start: string; end: string }) => {
    onChange({
      startDate: preset.start,
      endDate: preset.end,
      presetLabel: preset.start ? preset.label : undefined,
    });
    setIsOpen(false);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ startDate: '', endDate: '', presetLabel: undefined });
  };

  const isFiltered = Boolean(currentRange.startDate || currentRange.endDate);

  const formatDisplay = () => {
    if (currentRange.presetLabel) return currentRange.presetLabel;
    if (currentRange.startDate && currentRange.endDate) {
      return `${currentRange.startDate} s/d ${currentRange.endDate}`;
    }
    if (currentRange.startDate) return `Sejak ${currentRange.startDate}`;
    if (currentRange.endDate) return `Sampai ${currentRange.endDate}`;
    return 'Semua Rentang Waktu';
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
              ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs'
              : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
          }`}
        >
          <Calendar className={`w-3.5 h-3.5 ${isFiltered ? 'text-rose-600' : 'text-stone-400'}`} />
          <span className="truncate max-w-[170px] sm:max-w-[220px]">{formatDisplay()}</span>
          <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
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
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white rounded-2xl shadow-xl border border-rose-100 p-3.5 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="font-extrabold text-stone-800 text-[11px] uppercase tracking-wider">
                {label}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Pilihan Rentang Cepat
              </span>
              <div className="grid grid-cols-2 gap-1">
                {PRESETS.map((p) => {
                  const isActive =
                    (!p.start && !currentRange.startDate) ||
                    (p.start === currentRange.startDate && p.end === currentRange.endDate);
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all truncate cursor-pointer ${
                        isActive
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-stone-50 hover:bg-rose-50 text-stone-700 hover:text-rose-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Range Inputs */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Atur Rentang Tanggal Kustom
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Dari</label>
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
                    className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">Sampai</label>
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
                    className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Apply & Close */}
            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all shadow-2xs"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
