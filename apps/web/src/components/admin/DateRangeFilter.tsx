'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Calendar,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

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

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAY_NAMES_ID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

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

  // Simulated base date for the store: 2026-09-08
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(8); // 8 = September
  const [hoverDate, setHoverDate] = useState<string>('');

  // When opening, sync the calendar view with the active startDate or default to Sept 2026
  useEffect(() => {
    if (isOpen) {
      if (currentRange.startDate) {
        const parts = currentRange.startDate.split('-');
        if (parts.length === 3) {
          setViewYear(parseInt(parts[0], 10));
          setViewMonth(parseInt(parts[1], 10) - 1);
        }
      } else {
        setViewYear(2026);
        setViewMonth(8);
      }
    }
  }, [isOpen, currentRange.startDate]);

  // Quick presets based on simulated current date: 2026-09-08
  const PRESETS = [
    { label: 'Semua Waktu', start: '', end: '' },
    { label: 'Hari Ini (8 Sep)', start: '2026-09-08', end: '2026-09-08' },
    { label: '7 Hari Terakhir', start: '2026-09-01', end: '2026-09-08' },
    { label: '30 Hari Terakhir', start: '2026-08-09', end: '2026-09-08' },
    { label: 'Bulan Ini (Sep)', start: '2026-09-01', end: '2026-09-30' },
    { label: 'Bulan Lalu (Ags)', start: '2026-08-01', end: '2026-08-31' },
  ];

  // Detect and adjust alignment if popover would overflow viewport bounds
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
    if (preset.start) {
      const parts = preset.start.split('-');
      if (parts.length === 3) {
        setViewYear(parseInt(parts[0], 10));
        setViewMonth(parseInt(parts[1], 10) - 1);
      }
    }
  };

  const handleReset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange({ startDate: '', endDate: '', presetLabel: undefined });
    setHoverDate('');
  };

  // Click on a date cell in the calendar
  const handleDateClick = (dateStr: string) => {
    // If no start date or both start and end are already set, start fresh
    if (!currentRange.startDate || (currentRange.startDate && currentRange.endDate)) {
      onChange({
        startDate: dateStr,
        endDate: '',
        presetLabel: undefined,
      });
      return;
    }

    // Only start is set; now setting end
    if (dateStr < currentRange.startDate) {
      // User clicked a date earlier than start date, so flip them
      onChange({
        startDate: dateStr,
        endDate: currentRange.startDate,
        presetLabel: undefined,
      });
    } else {
      onChange({
        startDate: currentRange.startDate,
        endDate: dateStr,
        presetLabel: undefined,
      });
    }
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Calendar days grid computation
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // Monday as first day of week: Sunday = 0 -> 6, Monday = 1 -> 0
    const rawFirstDay = new Date(viewYear, viewMonth, 1).getDay();
    const startDayIndex = (rawFirstDay + 6) % 7;

    const days: Array<{
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
    }> = [];

    // Empty lead slots
    for (let i = 0; i < startDayIndex; i++) {
      days.push({ dayNumber: 0, dateStr: '', isCurrentMonth: false });
    }

    // Actual days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: true });
    }

    return days;
  }, [viewYear, viewMonth]);

  // Calculate day count
  const calculateDaysCount = (start: string, end: string) => {
    if (!start) return 0;
    if (!end || start === end) return 1;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const activeDaysCount = calculateDaysCount(currentRange.startDate, currentRange.endDate);

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

  const formatIndoFull = (isoStr: string) => {
    if (!isoStr) return '';
    try {
      const parts = isoStr.split('-');
      if (parts.length === 3) {
        const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        const day = parseInt(parts[2], 10);
        const month = monthNames[parseInt(parts[1], 10)] || parts[1];
        const year = parts[0];
        return `${day} ${month} ${year}`;
      }
      return isoStr;
    } catch {
      return isoStr;
    }
  };

  const formatTriggerDisplay = () => {
    if (currentRange.presetLabel) {
      if (currentRange.startDate && currentRange.endDate) {
        return `${currentRange.presetLabel} (${formatShortDate(currentRange.startDate)} - ${formatShortDate(currentRange.endDate)})`;
      }
      return currentRange.presetLabel;
    }
    if (currentRange.startDate && currentRange.endDate) {
      if (currentRange.startDate === currentRange.endDate) {
        return formatIndoFull(currentRange.startDate);
      }
      return `${formatShortDate(currentRange.startDate)} - ${formatIndoFull(currentRange.endDate)}`;
    }
    if (currentRange.startDate) return `Mulai ${formatShortDate(currentRange.startDate)}`;
    if (currentRange.endDate) return `Sampai ${formatShortDate(currentRange.endDate)}`;
    return 'Semua Rentang Waktu';
  };

  const isFiltered = Boolean(currentRange.startDate || currentRange.endDate);

  return (
    <div className={`relative inline-flex items-center text-xs ${className}`}>
      {/* Trigger Button */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all cursor-pointer font-bold shadow-2xs ${
            isFiltered
              ? 'bg-rose-50/90 border-rose-300 text-rose-700 hover:bg-rose-100 hover:border-rose-400'
              : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-xl flex items-center justify-center transition-colors ${
              isFiltered ? 'bg-rose-600 text-white shadow-xs' : 'bg-stone-100 text-stone-500'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <span className="whitespace-nowrap font-extrabold text-xs tracking-tight">
            {formatTriggerDisplay()}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-rose-600' : ''
            }`}
          />
        </button>

        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            title="Reset Filter Tanggal"
            className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Popover Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-stone-900/10 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          />

          {/* Popover Card */}
          <div
            ref={popoverRef}
            className={`absolute top-full mt-2 z-50 w-[350px] sm:w-[380px] max-w-[calc(100vw-24px)] bg-white rounded-3xl shadow-2xl border border-stone-200/90 p-4 sm:p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
              effectiveAlign === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {/* 1. Header Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-stone-800 text-xs tracking-tight">
                    {label}
                  </h4>
                  <p className="text-[10px] text-stone-400 font-medium">
                    Klik tanggal awal & akhir langsung pada kalender
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Unified Active Date Range Parameter Card (1 Element Tanggal Terpadu) */}
            <div className="bg-gradient-to-r from-rose-50/80 via-white to-rose-50/80 rounded-2xl p-3 border border-rose-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-extrabold text-stone-700 uppercase tracking-wider text-[10px]">
                  <Sparkles className="w-3 h-3 text-rose-500" />
                  <span>Rentang Parameter Aktif</span>
                </div>
                {activeDaysCount > 0 && (
                  <span className="font-black text-rose-600 bg-rose-100/80 px-2.5 py-0.5 rounded-full text-[10px] border border-rose-200/60 shadow-2xs">
                    {activeDaysCount} Hari Terpilih
                  </span>
                )}
              </div>

              {/* Single visual dual-pill parameter container */}
              <div className="flex items-center gap-2">
                {/* Tanggal Awal */}
                <div className="flex-1 bg-white border border-rose-200/80 rounded-xl px-2.5 py-1.5 shadow-2xs flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 ring-2 ring-rose-200" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block leading-none">
                      Mulai
                    </span>
                    <span className="text-xs font-black text-stone-800 truncate block mt-0.5">
                      {currentRange.startDate ? formatIndoFull(currentRange.startDate) : 'Pilih di kalender'}
                    </span>
                  </div>
                </div>

                <div className="w-5 h-5 rounded-full bg-rose-100/70 text-rose-600 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3" />
                </div>

                {/* Tanggal Akhir */}
                <div className="flex-1 bg-white border border-rose-200/80 rounded-xl px-2.5 py-1.5 shadow-2xs flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-700 shrink-0 ring-2 ring-rose-200" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block leading-none">
                      Sampai
                    </span>
                    <span className="text-xs font-black text-stone-800 truncate block mt-0.5">
                      {currentRange.endDate
                        ? formatIndoFull(currentRange.endDate)
                        : currentRange.startDate
                        ? 'Klik tgl akhir...'
                        : 'Pilih di kalender'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Quick Presets Chips */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Pilihan Cepat
                </span>
                {currentRange.presetLabel && (
                  <span className="text-[10px] font-bold text-rose-600">
                    Preset: {currentRange.presetLabel}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {PRESETS.map((p) => {
                  const isActive =
                    (!p.start && !currentRange.startDate) ||
                    (p.start === currentRange.startDate && p.end === currentRange.endDate);
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`px-2 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer text-center truncate border ${
                        isActive
                          ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                          : 'bg-stone-50/90 hover:bg-rose-50/70 border-stone-200/80 text-stone-700 hover:text-rose-700'
                      }`}
                      title={p.label}
                    >
                      {p.label.split(' (')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Single Interactive Custom Calendar Element */}
            <div className="border border-stone-200/90 rounded-2xl p-3 bg-stone-50/40 space-y-2">
              {/* Month & Year Navigation */}
              <div className="flex items-center justify-between px-1">
                <span className="font-black text-xs text-stone-800">
                  {MONTH_NAMES_ID[viewMonth]} {viewYear}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-white border border-transparent hover:border-stone-200 transition-colors cursor-pointer"
                    title="Bulan sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-white border border-transparent hover:border-stone-200 transition-colors cursor-pointer"
                    title="Bulan berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day of week headers */}
              <div className="grid grid-cols-7 gap-0 text-center">
                {DAY_NAMES_ID.map((dayName, idx) => (
                  <div
                    key={dayName}
                    className={`text-[10px] font-black py-1 ${
                      idx >= 5 ? 'text-rose-500' : 'text-stone-400'
                    }`}
                  >
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Calendar Days Matrix with Connected Range Highlighting */}
              <div
                className="grid grid-cols-7 gap-y-1 gap-x-0"
                onMouseLeave={() => setHoverDate('')}
              >
                {calendarDays.map((item, idx) => {
                  if (!item.isCurrentMonth) {
                    return <div key={`empty-${idx}`} className="h-8" />;
                  }

                  const { dateStr, dayNumber } = item;
                  const isStart = currentRange.startDate === dateStr;
                  const isEnd = currentRange.endDate === dateStr;
                  const isSingle = isStart && isEnd;

                  // Date range logic
                  const effectiveEnd =
                    currentRange.endDate || (currentRange.startDate ? hoverDate : '');

                  const inRange =
                    currentRange.startDate &&
                    effectiveEnd &&
                    ((dateStr > currentRange.startDate && dateStr < effectiveEnd) ||
                      (dateStr < currentRange.startDate && dateStr > effectiveEnd));

                  const isToday = dateStr === '2026-09-08';

                  // Styling classes based on range position
                  let containerBg = 'bg-transparent';
                  let buttonStyle =
                    'text-stone-700 hover:bg-rose-100/70 hover:text-rose-800 font-bold';

                  if (isSingle || (isStart && !currentRange.endDate)) {
                    buttonStyle =
                      'bg-rose-600 text-white font-black shadow-md shadow-rose-600/30 rounded-xl';
                  } else if (isStart) {
                    containerBg = 'bg-rose-100/60 rounded-l-xl';
                    buttonStyle =
                      'bg-rose-600 text-white font-black shadow-md shadow-rose-600/30 rounded-l-xl';
                  } else if (isEnd) {
                    containerBg = 'bg-rose-100/60 rounded-r-xl';
                    buttonStyle =
                      'bg-rose-600 text-white font-black shadow-md shadow-rose-600/30 rounded-r-xl';
                  } else if (inRange) {
                    containerBg = 'bg-rose-100/60';
                    buttonStyle = 'text-rose-900 font-black rounded-none';
                  }

                  return (
                    <div
                      key={dateStr}
                      className={`h-8 flex items-center justify-center ${containerBg}`}
                    >
                      <button
                        type="button"
                        onClick={() => handleDateClick(dateStr)}
                        onMouseEnter={() => {
                          if (currentRange.startDate && !currentRange.endDate) {
                            setHoverDate(dateStr);
                          }
                        }}
                        className={`w-full h-8 flex flex-col items-center justify-center text-xs transition-all cursor-pointer relative ${buttonStyle}`}
                      >
                        <span>{dayNumber}</span>
                        {isToday && !isStart && !isEnd && (
                          <span className="w-1 h-1 rounded-full bg-rose-500 absolute bottom-1" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Footer Actions */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
              {isFiltered ? (
                <button
                  type="button"
                  onClick={() => handleReset()}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer flex items-center gap-1 border border-transparent hover:border-rose-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bersihkan</span>
                </button>
              ) : (
                <span className="text-[11px] text-stone-400 font-medium">
                  {currentRange.startDate ? 'Klik tgl akhir untuk selesai' : 'Semua data aktif'}
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Terapkan Rentang</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
