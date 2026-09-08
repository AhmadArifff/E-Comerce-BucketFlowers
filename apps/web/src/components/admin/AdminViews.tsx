'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { TableSortHeader, type SortDirection } from './TableSortHeader';
import { DateRangeFilter, type DateRange } from './DateRangeFilter';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Tag,
  Percent,
  Copy,
  Check,
  MapPin,
  ExternalLink,
  Laptop,
  Smartphone,
  RotateCw,
  Sliders,
  Shield,
  ShieldAlert,
  AlertTriangle,
  X,
  Printer,
  User,
  KeyRound,
  Sparkles,
  Lock,
  CreditCard,
  Building,
  Banknote,
  Layers,
  Archive,
  Trash2,
  Info,
  ShieldCheck,
  Database,
  RefreshCw,
  Terminal,
  CheckCheck,
} from 'lucide-react';
import { MOCK_PRODUCTS, type ExtendedProduct as Product } from '@chenille/shared';
import { useThemeStore, type ThemeId } from '@/stores/useThemeStore';
import { useSettingsStore, type WasteMaterialItem } from '@/stores/useSettingsStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { showMagicToast } from '@/lib/magic-motion';

// ============================================================================
// 1. FINANCIAL MULTI-LINE SVG CHART CARD
// ============================================================================
export const FinancialChartCard: React.FC = () => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: '',
    presetLabel: '30 Hari Terakhir',
  });

  const is7Days = dateRange.presetLabel === '7 Hari Terakhir' ||
    (dateRange.startDate && dateRange.endDate &&
      (new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) <= 7 * 86400000);

  const chartData = useMemo(() => {
    if (is7Days) {
      return [
        { label: 'Sen', sub: '1 Sep', omzet: 1200000, hpp: 510000, laba: 690000, x: 80, yOmzet: 120, yHpp: 155, yLaba: 145 },
        { label: 'Sel', sub: '2 Sep', omzet: 1450000, hpp: 620000, laba: 830000, x: 175, yOmzet: 105, yHpp: 148, yLaba: 135 },
        { label: 'Rab', sub: '3 Sep', omzet: 1800000, hpp: 750000, laba: 1050000, x: 270, yOmzet: 85, yHpp: 140, yLaba: 120 },
        { label: 'Kam', sub: '4 Sep', omzet: 1600000, hpp: 680000, laba: 920000, x: 365, yOmzet: 95, yHpp: 144, yLaba: 128 },
        { label: 'Jum', sub: '5 Sep', omzet: 2200000, hpp: 900000, laba: 1300000, x: 460, yOmzet: 65, yHpp: 130, yLaba: 105 },
        { label: 'Sab', sub: '6 Sep', omzet: 2800000, hpp: 1150000, laba: 1650000, x: 555, yOmzet: 40, yHpp: 118, yLaba: 85 },
        { label: 'Min', sub: '7 Sep', omzet: 2100000, hpp: 880000, laba: 1220000, x: 640, yOmzet: 70, yHpp: 132, yLaba: 110 },
      ];
    }
    return [
      { label: 'Minggu 1', sub: '1 - 7 Sep', omzet: 8750000, hpp: 3650000, laba: 5100000, x: 100, yOmzet: 97.5, yHpp: 146, yLaba: 131.5 },
      { label: 'Minggu 2', sub: '8 - 14 Sep', omzet: 11200000, hpp: 4700000, laba: 6500000, x: 280, yOmzet: 57.5, yHpp: 129, yLaba: 108.5 },
      { label: 'Minggu 3 (Puncak)', sub: '15 - 21 Sep', omzet: 14800000, hpp: 6100000, laba: 8700000, x: 460, yOmzet: 32.5, yHpp: 117.5, yLaba: 95 },
      { label: 'Minggu 4', sub: '22 - 30 Sep', omzet: 9400000, hpp: 3950000, laba: 5450000, x: 640, yOmzet: 95, yHpp: 145, yLaba: 130 },
    ];
  }, [is7Days]);

  const totalOmzetPeriod = chartData.reduce((a, b) => a + b.omzet, 0);
  const totalLabaPeriod = chartData.reduce((a, b) => a + b.laba, 0);

  const handleExportExcel = () => {
    showMagicToast('Laporan Diunduh 📊', `Berkas Laporan_Finansial_${(dateRange.presetLabel || 'Custom').replace(/\s+/g, '_')}.xlsx telah di-generate.`, '📥');
  };

  const omzetPath = useMemo(() => {
    return chartData.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.yOmzet}`).join(' ');
  }, [chartData]);

  const hppPath = useMemo(() => {
    return chartData.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.yHpp}`).join(' ');
  }, [chartData]);

  const labaPath = useMemo(() => {
    return chartData.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.yLaba}`).join(' ');
  }, [chartData]);

  const polygonPoints = useMemo(() => {
    const firstX = chartData[0].x;
    const lastX = chartData[chartData.length - 1].x;
    const pts = chartData.map((p) => `${p.x},${p.yLaba}`).join(' ');
    return `${firstX},180 ${pts} ${lastX},180`;
  }, [chartData]);

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-stone-800 font-extrabold text-sm sm:text-base tracking-tight">
            <TrendingUp className="w-4 h-4 text-rose-600" />
            <span>Grafik Finansial: Omzet vs HPP vs Laba Bersih</span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Evaluasi pergerakan omzet, modal bahan kawat bulu, dan laba bersih ({dateRange.presetLabel || 'Rentang Khusus'}).
          </p>
        </div>

        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 text-xs shrink-0 self-start lg:self-auto">
          <DateRangeFilter value={dateRange} onChange={setDateRange} align="right" />
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Excel</span>
          </button>
        </div>
      </div>

      {/* Legend & Stats banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Omzet: <strong className="text-stone-800">Rp {totalOmzetPeriod.toLocaleString('id-ID')}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>HPP</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Laba: <strong className="text-emerald-700">Rp {totalLabaPeriod.toLocaleString('id-ID')}</strong></span>
          </div>
        </div>
        <span className="text-[10px] text-stone-400 font-medium">Arahkan kursor ke titik grafik untuk detail angka</span>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full overflow-hidden pt-2">
        {tooltip && (
          <div
            className="absolute z-20 px-3 py-1.5 rounded-xl bg-stone-900 text-white text-[11px] font-bold shadow-xl pointer-events-none transition-all -translate-x-1/2 -translate-y-full mb-2"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.text}
          </div>
        )}

        <svg viewBox="0 0 700 220" className="w-full h-44 sm:h-56 overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradLabaAdmin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="40" y1="30" x2="680" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="40" y1="80" x2="680" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="40" y1="130" x2="680" y2="130" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="40" y1="180" x2="680" y2="180" stroke="#E2E8F0" strokeWidth="1.5" />

          {/* Y Axis labels */}
          <text x="32" y="34" fontSize="10" fill="#94A3B8" textAnchor="end">Tinggi</text>
          <text x="32" y="84" fontSize="10" fill="#94A3B8" textAnchor="end">Sedang</text>
          <text x="32" y="134" fontSize="10" fill="#94A3B8" textAnchor="end">Normal</text>
          <text x="32" y="184" fontSize="10" fill="#94A3B8" textAnchor="end">Rp 0</text>

          {/* Area fill under Laba Bersih */}
          <polygon points={polygonPoints} fill="url(#gradLabaAdmin)" />

          {/* Omzet Path (Pink/Rose) */}
          <path d={omzetPath} fill="none" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* HPP Path (Amber Dashed) */}
          <path d={hppPath} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Laba Bersih Path (Emerald) */}
          <path d={labaPath} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {chartData.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.yOmzet}
                r="5"
                fill="#F43F5E"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="cursor-pointer hover:r-7 transition-all"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({ x: pt.x, y: pt.yOmzet - 5, text: `${pt.label} (${pt.sub}): Omzet Rp ${pt.omzet.toLocaleString('id-ID')}` });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
              <circle
                cx={pt.x}
                cy={pt.yHpp}
                r="4.5"
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="cursor-pointer hover:r-6 transition-all"
                onMouseEnter={(e) => {
                  setTooltip({ x: pt.x, y: pt.yHpp - 5, text: `${pt.label} (${pt.sub}): HPP Rp ${pt.hpp.toLocaleString('id-ID')}` });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
              <circle
                cx={pt.x}
                cy={pt.yLaba}
                r="5"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="cursor-pointer hover:r-7 transition-all"
                onMouseEnter={(e) => {
                  setTooltip({ x: pt.x, y: pt.yLaba - 5, text: `${pt.label} (${pt.sub}): Laba Bersih Rp ${pt.laba.toLocaleString('id-ID')}` });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
              <text x={pt.x} y="205" fontSize="11" fontWeight="700" fill="#64748B" textAnchor="middle">
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// ============================================================================
// 2. PRODUCTION CALENDAR & TOP PROFITABLE PRODUCTS
// ============================================================================
export const ProductionCalendarCard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-stone-800 text-sm">
            <Calendar className="w-4 h-4 text-rose-600" />
            <span>Kalender Produksi Atelier (September 2026)</span>
          </div>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            Aktif
          </span>
        </div>

        <div className="flex gap-2 text-[10px] text-stone-500 font-bold">
          <span className="inline-flex items-center gap-1 text-rose-600">● Rangkai</span>
          <span className="inline-flex items-center gap-1 text-blue-600">● Biteship J&T</span>
          <span className="inline-flex items-center gap-1 text-amber-600">● COD Kampus</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center text-xs pt-1">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
            <div key={i} className="text-[10px] font-black text-stone-400 uppercase py-1">
              {d}
            </div>
          ))}
          <div className="p-2 rounded-xl bg-stone-50 text-stone-700 font-bold">1</div>
          <div className="p-2 rounded-xl bg-stone-50 text-stone-700 font-bold">2</div>
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold">
            <div>3</div>
            <div className="text-[8px] bg-rose-600 text-white rounded px-0.5 mt-0.5">2 Buket</div>
          </div>
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold">
            <div>4</div>
            <div className="text-[8px] bg-blue-600 text-white rounded px-0.5 mt-0.5">Pick Up</div>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 text-stone-700 font-bold">5</div>
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold">
            <div>6</div>
            <div className="text-[8px] bg-amber-600 text-white rounded px-0.5 mt-0.5">COD UI</div>
          </div>
          <div className="p-2 rounded-xl bg-rose-600 text-white font-extrabold shadow-sm">
            <div>7</div>
            <div className="text-[8px] bg-white text-rose-700 rounded px-0.5 mt-0.5 font-black">Hari Ini</div>
          </div>
        </div>
      </div>

      {/* Top Profitable Products */}
      <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 font-extrabold text-stone-800 text-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Top Produk Paling Menguntungkan</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-stone-800">Sunshine Daisy Bear Toga</div>
              <div className="text-[11px] text-stone-400">HPP: Rp 52.600 • Jual: Rp 175.000</div>
            </div>
            <div className="text-right">
              <span className="text-emerald-600 font-extrabold text-sm block">+Rp 122.400</span>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Margin 70.0%
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-stone-800">Pink Tulip Bliss Trio + LED</div>
              <div className="text-[11px] text-stone-400">HPP: Rp 46.800 • Jual: Rp 150.000</div>
            </div>
            <div className="text-right">
              <span className="text-emerald-600 font-extrabold text-sm block">+Rp 103.200</span>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Margin 68.8%
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-stone-800">Royal Amethyst Lavender Crown</div>
              <div className="text-[11px] text-stone-400">HPP: Rp 78.400 • Jual: Rp 230.000</div>
            </div>
            <div className="text-right">
              <span className="text-emerald-600 font-extrabold text-sm block">+Rp 151.600</span>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Margin 65.9%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. REPORTS & EXCEL EXPORT VIEW
// ============================================================================
export const ReportsView: React.FC = () => {
  const { wasteMaterials, getTotalWasteLoss } = useSettingsStore();
  const totalWasteLoss = getTotalWasteLoss();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: '',
    presetLabel: 'Semua Waktu',
  });

  const handleDownload = (format: string) => {
    showMagicToast(`Laporan ${format} Siap! 📈`, `File Laporan_Atelier_${(dateRange.presetLabel || 'Custom').replace(/\s+/g, '_')}.${format.toLowerCase()} berhasil diekspor.`, '📄');
  };

  type ReportSortField = 'period' | 'orders' | 'omzet' | 'hpp' | 'net' | 'margin';
  const [sortField, setSortField] = useState<ReportSortField | null>('period');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: ReportSortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const rawReportsData = [
    { period: 'September 2026 (Berjalan)', isoMonth: '2026-09', startDate: '2026-09-01', endDate: '2026-09-30', monthOrder: 9, orders: 58, omzetNum: 8750000, omzet: 'Rp 8.750.000', hppNum: 3650000, hpp: 'Rp 3.650.000', netNum: 5100000, net: 'Rp 5.100.000', marginNum: 58.2, margin: '58.2%' },
    { period: 'Agustus 2026', isoMonth: '2026-08', startDate: '2026-08-01', endDate: '2026-08-31', monthOrder: 8, orders: 74, omzetNum: 11200000, omzet: 'Rp 11.200.000', hppNum: 4700000, hpp: 'Rp 4.700.000', netNum: 6500000, net: 'Rp 6.500.000', marginNum: 58.0, margin: '58.0%' },
    { period: 'Juli 2026', isoMonth: '2026-07', startDate: '2026-07-01', endDate: '2026-07-31', monthOrder: 7, orders: 62, omzetNum: 9400000, omzet: 'Rp 9.400.000', hppNum: 3950000, hpp: 'Rp 3.950.000', netNum: 5450000, net: 'Rp 5.450.000', marginNum: 57.9, margin: '57.9%' },
    { period: 'Juni 2026 (Wisuda Raya)', isoMonth: '2026-06', startDate: '2026-06-01', endDate: '2026-06-30', monthOrder: 6, orders: 95, omzetNum: 14800000, omzet: 'Rp 14.800.000', hppNum: 6100000, hpp: 'Rp 6.100.000', netNum: 8700000, net: 'Rp 8.700.000', marginNum: 58.7, margin: '58.7%' },
    { period: 'Mei 2026', isoMonth: '2026-05', startDate: '2026-05-01', endDate: '2026-05-31', monthOrder: 5, orders: 50, omzetNum: 7900000, omzet: 'Rp 7.900.000', hppNum: 3300000, hpp: 'Rp 3.300.000', netNum: 4600000, net: 'Rp 4.600.000', marginNum: 58.2, margin: '58.2%' },
  ];

  const filteredReportsData = useMemo(() => {
    return rawReportsData.filter((r) => {
      if (dateRange.startDate && r.endDate < dateRange.startDate) return false;
      if (dateRange.endDate && r.startDate > dateRange.endDate) return false;
      return true;
    });
  }, [dateRange]);

  const sortedReports = useMemo(() => {
    if (!sortField || !sortDirection) return filteredReportsData;
    return [...filteredReportsData].sort((a, b) => {
      let valA: any = a[sortField as keyof typeof a];
      let valB: any = b[sortField as keyof typeof b];

      if (sortField === 'period') {
        valA = a.monthOrder;
        valB = b.monthOrder;
      } else if (sortField === 'omzet') {
        valA = a.omzetNum;
        valB = b.omzetNum;
      } else if (sortField === 'hpp') {
        valA = a.hppNum;
        valB = b.hppNum;
      } else if (sortField === 'net') {
        valA = a.netNum;
        valB = b.netNum;
      } else if (sortField === 'margin') {
        valA = a.marginNum;
        valB = b.marginNum;
      }

      if (typeof valA === 'string') {
        const c = valA.localeCompare(valB, 'id');
        return sortDirection === 'asc' ? c : -c;
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [filteredReportsData, sortField, sortDirection]);

  // Dynamic calculations based on active date range
  const totalOmzetFiltered = filteredReportsData.reduce((acc, r) => acc + r.omzetNum, 0);
  const totalHppFiltered = filteredReportsData.reduce((acc, r) => acc + r.hppNum, 0);
  const totalOrdersFiltered = filteredReportsData.reduce((acc, r) => acc + r.orders, 0);
  const totalPackingFiltered = Math.round(totalOmzetFiltered * 0.048);
  const netEvaluated = Math.max(0, totalOmzetFiltered - totalHppFiltered - totalPackingFiltered - totalWasteLoss);

  return (
    <div className="space-y-6 admin-view-fade">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-xs">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Omzet ({filteredReportsData.length} Bln)</div>
          <div className="text-lg font-black text-stone-800 mt-1">Rp {totalOmzetFiltered.toLocaleString('id-ID')}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Total {totalOrdersFiltered} Pesanan Buket</div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-xs">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total HPP Bahan Baku</div>
          <div className="text-lg font-black text-stone-800 mt-1">Rp {totalHppFiltered.toLocaleString('id-ID')}</div>
          <div className="text-[11px] text-stone-400 font-medium mt-0.5">
            {totalOmzetFiltered > 0 ? `${((totalHppFiltered / totalOmzetFiltered) * 100).toFixed(1)}% Omzet` : '0%'}
          </div>
        </div>

        {/* Waste / Scrap Loss Card */}
        <div className="bg-white rounded-2xl border border-rose-200 bg-rose-50/30 p-4 shadow-xs">
          <div className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
            <Archive className="w-3.5 h-3.5 text-rose-600" />
            <span>Kerugian Bahan Rusak</span>
          </div>
          <div className="text-lg font-black text-rose-700 mt-1">
            -Rp {totalWasteLoss.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-rose-600 font-bold mt-0.5">
            {wasteMaterials.length} Batch Afkir Terlacak
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-xs">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Packing & Logistik</div>
          <div className="text-lg font-black text-stone-800 mt-1">Rp {totalPackingFiltered.toLocaleString('id-ID')}</div>
          <div className="text-[11px] text-stone-400 font-medium mt-0.5">Box Corrugated & Bubble</div>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Laba Bersih Evaluasi</div>
          <div className="text-lg font-black text-emerald-700 mt-1">
            Rp {netEvaluated.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-700 font-extrabold mt-0.5">Setelah Potong Afkir</div>
        </div>
      </div>

      {/* Reports Table & Export Actions */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-stone-800 tracking-tight">
              Rekapitulasi Penjualan & Margin Bulanan
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Data konsolidasi pesanan lunas, potongan biaya produksi, dan laba operasional studio ({dateRange.presetLabel || 'Rentang Khusus'}).
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 self-start 2xl:self-auto">
            <DateRangeFilter value={dateRange} onChange={setDateRange} align="right" />
            <button
              onClick={() => handleDownload('CSV')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={() => handleDownload('XLSX')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <TableSortHeader
                  label="Periode Bulan"
                  field="period"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  label="Jumlah Pesanan"
                  field="orders"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  label="Omzet Bruto"
                  field="omzet"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  label="Total HPP"
                  field="hpp"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  label="Laba Bersih"
                  field="net"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  label="Margin (%)"
                  field="margin"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400 font-medium">
                    Tidak ada data laporan keuangan pada rentang tanggal yang dipilih.
                  </td>
                </tr>
              ) : (
                sortedReports.map((row, idx) => (
                  <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-stone-800">{row.period}</td>
                    <td className="py-3.5 px-4 font-bold">{row.orders} Buket</td>
                    <td className="py-3.5 px-4 font-bold text-stone-700">{row.omzet}</td>
                    <td className="py-3.5 px-4 text-stone-500 font-medium">{row.hpp}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">{row.net}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px]">
                        {row.margin}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDownload('XLSX')}
                        className="px-2.5 py-1 rounded-lg border border-stone-200 hover:border-rose-300 text-stone-600 hover:text-rose-600 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        Unduh
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spoilage & Damaged Materials Evaluation Section */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-800 text-sm">
                Evaluasi Laporan Kerugian Bahan Baku Gudang (Spoilage & Waste)
              </h3>
              <p className="text-[11px] text-stone-500">
                Pencatatan bahan lama atau tidak layak pakai guna evaluasi cepat potensi kerugian atelier.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full">
            Status: Kerugian Terkendali (-{((totalWasteLoss / 18400000) * 100).toFixed(2)}% dari HPP)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {wasteMaterials.slice(0, 3).map((wst) => (
            <div key={wst.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-stone-800 truncate">{wst.materialName}</span>
                <span className="text-[10px] text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded-full">
                  -Rp {wst.totalLoss.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-[11px] text-stone-500">
                Jumlah Rusak: <strong>{wst.qty} {wst.unit}</strong> • Alasan:{' '}
                <span className="text-rose-700 font-semibold">{wst.reason.replace('_', ' ')}</span>
              </div>
              {wst.mitigationAction && (
                <div className="text-[10px] text-emerald-700 bg-emerald-50/60 p-1.5 rounded-lg font-medium">
                  💡 Mitigasi: {wst.mitigationAction}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
          <span className="text-stone-600">
            Kelola pencatatan bahan rusak lengkap atau tambah catatan baru di tab{' '}
            <strong>Bahan Rusak / Afkir</strong> pada modul Kalkulator BOM.
          </span>
          <span className="font-bold text-rose-600">Total Akumulasi: Rp {totalWasteLoss.toLocaleString('id-ID')}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. PRODUCTS & CTR CLICKS VIEW
// ============================================================================
export const ProductsClicksView: React.FC<{ onOpenAddModal: () => void }> = ({ onOpenAddModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedProdBom, setSelectedProdBom] = useState<Product | null>(null);

  type ProductSortField = 'name' | 'category' | 'recipe' | 'rawCostHpp' | 'price' | 'margin' | 'clicks' | 'status';
  const [sortField, setSortField] = useState<ProductSortField | null>('clicks');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: ProductSortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Mock recipe ingredients generator based on product ID
  const getProductRecipe = (prod: Product) => {
    return [
      { name: 'Batang Kawat Bulu Utama (6mm)', qty: 32, unit: 'Batang', cost: 350, subtotal: 11200 },
      { name: 'Kawat Batang Penyangga Hijau No. 18', qty: 12, unit: 'Batang', cost: 500, subtotal: 6000 },
      { name: 'Kertas Cellophane Korean Matte Waterproof', qty: 2, unit: 'Lembar', cost: 4500, subtotal: 9000 },
      { name: 'Pita Satin Burgundy Mewah 2.5cm', qty: 1.5, unit: 'Meter', cost: 2200, subtotal: 3300 },
      { name: 'Aksesoris / Kartu Ucapan / Box Kemas', qty: 1, unit: 'Pcs', cost: prod.rawCostHpp - 29500 > 0 ? prod.rawCostHpp - 29500 : 5000, subtotal: prod.rawCostHpp - 29500 > 0 ? prod.rawCostHpp - 29500 : 5000 },
    ];
  };

  const sortedProducts = useMemo(() => {
    const list = MOCK_PRODUCTS.filter((prod) => {
      const matchName = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCat === 'ALL' || prod.category === selectedCat;
      return matchName && matchCat;
    });

    if (sortField && sortDirection) {
      return [...list].sort((a, b) => {
        let valA: any = a[sortField as keyof Product];
        let valB: any = b[sortField as keyof Product];

        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;
        const profitA = priceA - a.rawCostHpp;
        const profitB = priceB - b.rawCostHpp;
        const marginA = Math.round((profitA / priceA) * 100);
        const marginB = Math.round((profitB / priceB) * 100);

        if (sortField === 'price') {
          valA = priceA;
          valB = priceB;
        } else if (sortField === 'margin') {
          valA = marginA;
          valB = marginB;
        } else if (sortField === 'clicks') {
          valA = a.clickCount || 0;
          valB = b.clickCount || 0;
        } else if (sortField === 'status') {
          valA = a.isReadyStock ? 1 : 0;
          valB = b.isReadyStock ? 1 : 0;
        } else if (sortField === 'recipe') {
          valA = getProductRecipe(a).length;
          valB = getProductRecipe(b).length;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          const comp = valA.localeCompare(valB, 'id');
          return sortDirection === 'asc' ? comp : -comp;
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
      });
    }

    return list;
  }, [searchTerm, selectedCat, sortField, sortDirection]);

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-6 admin-view-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div>
          <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
            Katalog Produk & Resep Bahan Baku (BOM)
          </h2>
          <p className="text-xs text-stone-500">
            Daftar buket, kebutuhan bahan baku tiap produk, validasi HPP, dan performa klik CTR.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Buket Baru</span>
        </button>
      </div>

      {/* Full-width Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama buket bunga, deskripsi, atau ID produk..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white focus:border-rose-400 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {['ALL', 'Single Stem', 'Graduation', 'Anniversary', 'Mini Bloom'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCat === cat
                  ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-rose-50 border-stone-200 text-stone-600 hover:text-rose-700'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
          <span className="text-[11px] font-bold text-stone-400 ml-auto hidden sm:inline">
            Menampilkan {sortedProducts.length} produk
          </span>
        </div>
      </div>

      {/* Products Table with CTR and BOM */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-600">
          <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
            <tr>
              <TableSortHeader label="Buket Produk" field="name" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[280px]" />
              <TableSortHeader label="Kategori" field="category" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[120px]" align="center" />
              <TableSortHeader label="Resep Bahan" field="recipe" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[160px]" align="center" />
              <TableSortHeader label="HPP (Modal)" field="rawCostHpp" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[130px]" align="right" />
              <TableSortHeader label="Harga Jual" field="price" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[130px]" align="right" />
              <TableSortHeader label="Margin" field="margin" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[100px]" align="center" />
              <TableSortHeader label="Klik (CTR)" field="clicks" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[130px]" align="center" />
              <TableSortHeader label="Status Produksi" field="status" currentField={sortField} direction={sortDirection} onSort={handleSort} className="min-w-[130px]" align="center" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {sortedProducts.map((prod, idx) => {
              const price = prod.discountPrice ?? prod.price;
              const profit = price - prod.rawCostHpp;
              const margin = Math.round((profit / price) * 100);
              const mockClicks = [430, 312, 280, 195, 140, 95][idx % 6];
              const mockCtr = ((mockClicks / 1280) * 100).toFixed(1);

              return (
                <tr key={prod.id} className="hover:bg-rose-50/20 transition-colors">
                  <td className="py-3.5 px-4 min-w-[280px]">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-rose-100 shadow-2xs shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-extrabold text-stone-800 text-xs leading-snug">{prod.name}</div>
                        <span className="text-[10px] text-stone-400 font-mono">ID: {prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-full text-[10px] border border-rose-100">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedProdBom(prod)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap"
                    >
                      <Layers className="w-3.5 h-3.5 text-rose-600" />
                      <span>Lihat Resep BOM</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-700 whitespace-nowrap">
                    Rp {prod.rawCostHpp.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-rose-600 text-sm whitespace-nowrap">
                    Rp {price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="bg-emerald-50 text-emerald-700 font-black px-2.5 py-1 rounded-full text-[10px] border border-emerald-200">
                      +{margin}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center justify-center gap-1.5 font-mono font-black text-stone-800">
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>{mockClicks}</span>
                      <span className="text-[10px] text-stone-400 font-sans font-semibold">({mockCtr}%)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {prod.isReadyStock ? (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                        Ready ({prod.stock})
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                        PO {prod.poLeadDays} Hari
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal View Resep Bahan Baku untuk 1 Produk */}
      {selectedProdBom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-rose-600" />
                <div>
                  <h3 className="font-extrabold text-stone-800 text-sm">Resep Bahan Baku (BOM): 1 Produk</h3>
                  <span className="text-[11px] text-stone-500">{selectedProdBom.name}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProdBom(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-stone-600">
                Komposisi bahan baku yang dihabiskan untuk merangkai 1 unit buket ini:
              </div>

              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-700 font-extrabold text-[10px] uppercase border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">Bahan</th>
                      <th className="py-2.5 px-3">Kuantitas</th>
                      <th className="py-2.5 px-3">Subtotal HPP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-[11px]">
                    {getProductRecipe(selectedProdBom).map((ing, i) => (
                      <tr key={i} className="hover:bg-stone-50/50">
                        <td className="py-2 px-3 font-semibold text-stone-800">{ing.name}</td>
                        <td className="py-2 px-3 text-stone-600">
                          {ing.qty} {ing.unit}
                        </td>
                        <td className="py-2 px-3 font-bold text-rose-600">
                          Rp {ing.subtotal.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Verification Alert */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Total HPP Produksi:</span>
                  <span className="font-bold text-stone-800">
                    Rp {selectedProdBom.rawCostHpp.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Harga Jual Etalase:</span>
                  <span className="font-bold text-rose-600">
                    Rp {(selectedProdBom.discountPrice ?? selectedProdBom.price).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-200 font-extrabold text-emerald-700">
                  <span>Margin Bersih Per Buket:</span>
                  <span>
                    +Rp{' '}
                    {(
                      (selectedProdBom.discountPrice ?? selectedProdBom.price) - selectedProdBom.rawCostHpp
                    ).toLocaleString('id-ID')}{' '}
                    (Validasi Aman ✅)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedProdBom(null)}
                className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Tutup Resep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. CREATE COUPON MODAL
// ============================================================================
export const CreateCouponModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddCoupon: (newCoupon: {
    code: string;
    discount: string;
    minSpend: string;
    used: number;
    quota: number;
    active: boolean;
    expiry: string;
  }) => void;
}> = ({ isOpen, onClose, onAddCoupon }) => {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'NOMINAL' | 'PERCENT' | 'ONGKIR'>('NOMINAL');
  const [discountVal, setDiscountVal] = useState('25000');
  const [minSpend, setMinSpend] = useState('150000');
  const [noMinSpend, setNoMinSpend] = useState(false);
  const [quota, setQuota] = useState('50');
  const [expiry, setExpiry] = useState('31 Okt 2026');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showMagicToast('Kode Wajib Diisi ⚠️', 'Harap masukkan kode kupon promo.', '❌');
      return;
    }

    let discountStr = '';
    if (discountType === 'PERCENT') {
      discountStr = `Diskon ${discountVal}%`;
    } else if (discountType === 'ONGKIR') {
      discountStr = `Gratis Ongkir Rp ${parseInt(discountVal || '0').toLocaleString('id-ID')}`;
    } else {
      discountStr = `Diskon Rp ${parseInt(discountVal || '0').toLocaleString('id-ID')}`;
    }

    const minSpendStr = noMinSpend
      ? 'Tanpa Minimum'
      : `Min. Belanja Rp ${parseInt(minSpend || '0').toLocaleString('id-ID')}`;

    onAddCoupon({
      code: code.trim().toUpperCase(),
      discount: discountStr,
      minSpend: minSpendStr,
      used: 0,
      quota: parseInt(quota) || 50,
      active: true,
      expiry,
    });

    onClose();
    showMagicToast('Kupon Baru Diterbitkan! 🏷️', `Kupon ${code.toUpperCase()} aktif dan siap digunakan pembeli.`, '✨');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="font-extrabold text-stone-800 text-sm">Buat Kupon Diskon Baru</h3>
              <span className="text-[11px] text-stone-500">Kupon akan langsung aktif di etalase checkout toko.</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Kode Kupon Diskon <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CONTOH: WISUDAHEMAT25"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono font-black text-xs uppercase tracking-wider text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Jenis Potongan</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white font-bold"
              >
                <option value="NOMINAL">Potongan Nominal (Rp)</option>
                <option value="PERCENT">Persentase Diskon (%)</option>
                <option value="ONGKIR">Potongan Ongkir (Rp)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {discountType === 'PERCENT' ? 'Persentase (%)' : 'Nilai Potongan (Rp)'}
              </label>
              <input
                type="number"
                required
                value={discountVal}
                onChange={(e) => setDiscountVal(e.target.value)}
                placeholder={discountType === 'PERCENT' ? '15' : '25000'}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Minimal Belanja (Rp)</label>
              <input
                type="number"
                disabled={noMinSpend}
                value={noMinSpend ? 0 : minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono font-bold text-xs disabled:bg-stone-100 disabled:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
              <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer text-[11px] text-stone-600 font-medium">
                <input
                  type="checkbox"
                  checked={noMinSpend}
                  onChange={(e) => setNoMinSpend(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Tanpa Minimal Belanja</span>
              </label>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Kuota Pemakaian (Kupon)</label>
              <input
                type="number"
                required
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                placeholder="50"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Masa Berlaku / Kadaluarsa</label>
            <input
              type="text"
              required
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="Contoh: 31 Okt 2026"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
            >
              Terbitkan Kupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 6. PROMOS & COUPONS VIEW (WITH ACTIVE/INACTIVE TOGGLES & CREATE FORM)
// ============================================================================
export const PromosView: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { coupons, toggleCouponActive, addCoupon } = useSettingsStore();

  type CouponSortField = 'code' | 'discount' | 'minSpend' | 'used' | 'expiry' | 'active';
  const [sortField, setSortField] = useState<CouponSortField | null>('used');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: CouponSortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCoupons = useMemo(() => {
    if (!sortField || !sortDirection) return coupons;
    return [...coupons].sort((a, b) => {
      let valA: any = a[sortField as keyof typeof a];
      let valB: any = b[sortField as keyof typeof b];

      if (sortField === 'discount') {
        valA = a.discountVal;
        valB = b.discountVal;
      } else if (sortField === 'minSpend') {
        valA = a.minSpendVal;
        valB = b.minSpendVal;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        const comp = valA.localeCompare(valB, 'id');
        return sortDirection === 'asc' ? comp : -comp;
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      if (typeof valA === 'boolean' && typeof valB === 'boolean') {
        return sortDirection === 'asc' ? (valA ? 1 : 0) - (valB ? 1 : 0) : (valB ? 1 : 0) - (valA ? 1 : 0);
      }
      return 0;
    });
  }, [coupons, sortField, sortDirection]);

  const handleAddCoupon = (newCoupon: any) => {
    addCoupon({
      code: newCoupon.code,
      discount: newCoupon.discount,
      discountType:
        newCoupon.discountType === 'PERCENT'
          ? 'PERCENTAGE'
          : newCoupon.discountType === 'ONGKIR'
          ? 'FREE_SHIPPING'
          : 'NOMINAL',
      discountVal: newCoupon.discountVal,
      minSpend: newCoupon.minSpend,
      minSpendVal: newCoupon.minSpendVal,
      used: 0,
      quota: newCoupon.quota,
      active: true,
      expiry: newCoupon.expiry,
      description: newCoupon.description,
    });
    showMagicToast('Kupon Berhasil Dibuat 🏷️', `Kupon ${newCoupon.code} telah diterbitkan dan aktif.`, '🎉');
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-6 admin-view-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-stone-800 tracking-tight flex items-center gap-2">
            <span>Pemasaran & Manajemen Kupon Diskon</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              Voucher Studio
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            Kelola kupon diskon nominal, persentase, dan gratis ongkir. Lengkap dengan sakelar toggle aktif/nonaktif sewaktu-waktu.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Kupon Baru</span>
        </button>
      </div>

      {/* Coupon Cards Grid with Active/Inactive Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedCoupons.map((coupon) => (
          <div
            key={coupon.code}
            className={`p-5 rounded-2xl border transition-all ${
              coupon.active
                ? 'bg-white border-rose-200 shadow-sm'
                : 'bg-stone-50/60 border-stone-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-rose-600" />
                <span className="font-mono font-black text-sm tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                  {coupon.code}
                </span>
              </div>

              {/* Status Badge + Interactive Toggle Switch */}
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                    coupon.active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-stone-100 text-stone-600 border-stone-300'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      coupon.active ? 'bg-emerald-500' : 'bg-stone-400'
                    }`}
                  />
                  <span>{coupon.active ? 'Kupon Aktif' : 'Nonaktif'}</span>
                </span>

                <label
                  className="relative inline-flex items-center cursor-pointer select-none"
                  title={coupon.active ? 'Klik untuk menonaktifkan kupon' : 'Klik untuk mengaktifkan kupon'}
                >
                  <input
                    type="checkbox"
                    checked={coupon.active}
                    onChange={() => {
                      toggleCouponActive(coupon.code);
                      showMagicToast(
                        !coupon.active ? 'Kupon Diaktifkan 🏷️' : 'Kupon Dinonaktifkan ⏸️',
                        `Kupon ${coupon.code} sekarang ${!coupon.active ? 'aktif & bisa dipakai di checkout.' : 'dinonaktifkan sementara.'}`,
                        !coupon.active ? '✅' : '⏸️'
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-3 space-y-1 text-xs">
              <div className="font-black text-stone-800 text-sm">{coupon.discount}</div>
              <div className="text-stone-500 text-[11px]">{coupon.minSpend}</div>
              <div className="text-stone-400 text-[10px]">Kadaluarsa: {coupon.expiry}</div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 pt-3 border-t border-stone-100">
              <div className="flex justify-between text-[11px] font-bold text-stone-500 mb-1">
                <span>Penggunaan Kupon</span>
                <span>
                  {coupon.used} / {coupon.quota} ({Math.round((coupon.used / coupon.quota) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                  style={{ width: `${Math.min((coupon.used / coupon.quota) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sortable Coupons Table */}
      <div className="pt-4 border-t border-stone-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
            Tabel Seluruh Voucher &amp; Kupon ({coupons.length})
          </span>
          <span className="text-[11px] text-stone-400">Gunakan toogle untuk aktivasi instan kupon sewaktu-waktu</span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-2xl">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <TableSortHeader label="Kode Kupon" field="code" currentField={sortField} direction={sortDirection} onSort={handleSort} />
                <TableSortHeader label="Jenis Diskon" field="discount" currentField={sortField} direction={sortDirection} onSort={handleSort} />
                <TableSortHeader label="Min. Belanja" field="minSpend" currentField={sortField} direction={sortDirection} onSort={handleSort} />
                <TableSortHeader label="Penggunaan Kupon" field="used" currentField={sortField} direction={sortDirection} onSort={handleSort} />
                <TableSortHeader label="Masa Berlaku" field="expiry" currentField={sortField} direction={sortDirection} onSort={handleSort} />
                <TableSortHeader label="Status &amp; Toogle Kupon" field="active" currentField={sortField} direction={sortDirection} onSort={handleSort} />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedCoupons.map((c) => (
                <tr key={c.code} className="hover:bg-rose-50/20 transition-colors">
                  <td className="py-3 px-4 font-mono font-black text-rose-700">{c.code}</td>
                  <td className="py-3 px-4 font-bold text-stone-800">{c.discount}</td>
                  <td className="py-3 px-4 text-stone-500 font-medium">{c.minSpend}</td>
                  <td className="py-3 px-4 font-bold">
                    {c.used} / {c.quota} ({Math.round((c.used / c.quota) * 100)}%)
                  </td>
                  <td className="py-3 px-4 text-stone-600">{c.expiry}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          c.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border-stone-200'
                        }`}
                      >
                        {c.active ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={c.active}
                          onChange={() => {
                            toggleCouponActive(c.code);
                            showMagicToast(
                              !c.active ? 'Kupon Diaktifkan 🏷️' : 'Kupon Dinonaktifkan ⏸️',
                              `Kupon ${c.code} sekarang ${!c.active ? 'aktif.' : 'nonaktif.'}`,
                              !c.active ? '✅' : '⏸️'
                            );
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-7 h-4 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rose-600"></div>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal Form */}
      <CreateCouponModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddCoupon={handleAddCoupon}
      />
    </div>
  );
};

// ============================================================================
// 6. MAINTENANCE & THEME SELECTOR VIEW
// ============================================================================
export const MaintenanceThemeView: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const { resetOrdersToDefault } = useOrderStore();
  const { resetAllSettingsToDefault } = useSettingsStore();

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [refreshStep, setRefreshStep] = useState(0);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleCopySqlSnippet = () => {
    const textToCopy = `-- CHENILLE ATELIER - SUPABASE SQL SCHEMA (27 TABLES & 7 BUCKETS)
-- File master schema: supabase/schema.sql
-- Silakan buka Supabase Dashboard -> SQL Editor dan jalankan isi file supabase/schema.sql`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSql(true);
    showMagicToast('Info SQL Disalin! 📋', 'File schema.sql lengkap ada di folder supabase/schema.sql', '✨');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleExecuteMigrateRefresh = async () => {
    setIsRefreshing(true);
    setRefreshStep(1);

    try {
      // Step 1: Membersihkan transaksi dummy
      await new Promise((r) => setTimeout(r, 500));
      setRefreshStep(2);

      // Step 2: Memulihkan 8 buket & 7 bahan baku
      resetAllSettingsToDefault();
      await new Promise((r) => setTimeout(r, 600));
      setRefreshStep(3);

      // Step 3: Memulihkan 6 titik COD & status order
      resetOrdersToDefault();

      try {
        await fetch('/api/admin/migrate-refresh', { method: 'POST' });
      } catch (err) {
        console.warn('API migrate refresh background notification:', err);
      }

      await new Promise((r) => setTimeout(r, 500));
      setRefreshStep(4);
      await new Promise((r) => setTimeout(r, 400));

      setShowResetModal(false);
      setIsRefreshing(false);
      setRefreshStep(0);

      showMagicToast(
        'Migrate Refresh Berhasil! 🚀',
        'Database Atelier & antarmuka telah dipulihkan ke bibit data awal (8 Buket, 7 Bahan, 6 Titik COD).',
        '✨'
      );
    } catch (e) {
      console.error(e);
      setIsRefreshing(false);
      setRefreshStep(0);
      showMagicToast('Gagal Reset Database', 'Terjadi kesalahan saat mengeksekusi reset.', '⚠️');
    }
  };

  const themesList: {
    id: ThemeId;
    title: string;
    desc: string;
    swatches: string[];
    badge: string;
  }[] = [
    {
      id: 'tema-a',
      title: 'Tema A: Korean Pastel',
      desc: 'Nuansa pastel lembut ala florist Seoul dengan sentuhan soft pink sakura, krem hangat, dan plum anggun.',
      swatches: ['#38252B', '#FFF0F3', '#E86A82', '#FFF9F7'],
      badge: 'Korean Florist',
    },
    {
      id: 'tema-b',
      title: 'Tema B: Modern Romantic',
      desc: 'Sentuhan mewah editorial bergaya butik bunga Eropa dengan aksen merah marun velvet dan emas champagne.',
      swatches: ['#2B181E', '#F3ECE2', '#722F37', '#D4AF37'],
      badge: 'Atelier Privé',
    },
    {
      id: 'tema-c',
      title: 'Tema C: Playful Kawaii',
      desc: 'Nuansa pop ceria anak muda, penuh energi dengan warna peach coral dan kuning mentega cerah.',
      swatches: ['#2C3E50', '#FFF3E0', '#FF6B81', '#FFFDF9'],
      badge: 'Kawaii Pop',
    },
  ];

  const handleSelectTheme = (tId: ThemeId) => {
    setTheme(tId);
    showMagicToast('Tema Diperbarui! 🎨', `Tema etalase toko aktif sekarang: ${tId.toUpperCase()}`, '✨');
  };

  const toggleMaintenance = () => {
    setIsMaintenanceMode(!isMaintenanceMode);
    showMagicToast(
      !isMaintenanceMode ? 'Mode Pemeliharaan Aktif ⚠️' : 'Toko Dibuka Kembali! 🌸',
      !isMaintenanceMode ? 'Pengunjung akan diarahkan ke halaman pemeliharaan.' : 'Storefront live dan dapat menerima pesanan.',
      !isMaintenanceMode ? '🛑' : '🚀'
    );
  };

  return (
    <div className="space-y-6 admin-view-fade">
      {/* 1. STATUS MODE PEMELIHARAAN */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
              isMaintenanceMode ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isMaintenanceMode ? '⚠️' : '🌸'}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
                Status Operasional Toko: {isMaintenanceMode ? 'Mode Pemeliharaan (Maintenance)' : 'Buka Pesanan (Live)'}
              </h2>
              <p className="text-xs text-stone-500">
                Gunakan saat atelier sedang overload pesanan wisuda atau pembaruan sistem katalog.
              </p>
            </div>
          </div>

          <button
            onClick={toggleMaintenance}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all shadow-md active:scale-95 ${
              isMaintenanceMode
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
            }`}
          >
            {isMaintenanceMode ? '✓ Buka Toko Sekarang' : '⚠️ Aktifkan Mode Pemeliharaan'}
          </button>
        </div>
      </div>

      {/* 2. DATABASE MAINTENANCE & SETUP MIGRATE REFRESH */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs flex-shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
                  Database Maintenance & Setup Migrate Refresh
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700">
                  Supabase Ready
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed max-w-2xl">
                Fitur pemeliharaan untuk mereset seluruh database & transaksi pengujian ke bibit data awal (*initial seed*):
                8 buket bunga kawat bulu, 7 master bahan baku BOM, 6 titik temu COD Google Maps Depok, dan pemulihan kuota PO harian.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Memproses Reset...' : '⚡ Jalankan Migrate Refresh'}</span>
          </button>
        </div>

        {/* STATS TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Katalog Produk</div>
            <div className="text-sm sm:text-base font-black text-stone-800 mt-0.5">8 Buket Wisuda</div>
            <div className="text-[10px] text-emerald-600 font-bold">100% Asset Lokal Backup</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Bahan Baku (BOM)</div>
            <div className="text-sm sm:text-base font-black text-stone-800 mt-0.5">7 Master Bahan</div>
            <div className="text-[10px] text-indigo-600 font-bold">Resep HPP Otomatis</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Titik COD Maps</div>
            <div className="text-sm sm:text-base font-black text-stone-800 mt-0.5">6 Titik Depok</div>
            <div className="text-[10px] text-amber-600 font-bold">Geofence Radius 5 KM</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tabel Supabase</div>
            <div className="text-sm sm:text-base font-black text-stone-800 mt-0.5">27 Tabel Relasional</div>
            <div className="text-[10px] text-rose-600 font-bold">7 Storage Buckets</div>
          </div>
        </div>

        {/* QUICK ACTION BARS & SQL TOOLS */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-stone-700 font-semibold">
            <Terminal className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>Master Script DDL: <code className="font-mono px-1.5 py-0.5 rounded bg-white border border-indigo-200 text-indigo-800 text-[11px]">supabase/schema.sql</code></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySqlSnippet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              {copiedSql ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
              <span>{copiedSql ? 'Tersalin!' : 'Salin Perintah SQL'}</span>
            </button>
            <a
              href="/supabase/schema.sql"
              download="chenille-atelier-schema.sql"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh .sql</span>
            </a>
          </div>
        </div>
      </div>

      {/* CONFIRMATION & RESET PROGRESS MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-100 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  Konfirmasi Migrate Refresh Database
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Tindakan ini akan mengembalikan data atelier ke bibit data awal (*seed defaults*).
                </p>
              </div>
            </div>

            {isRefreshing ? (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-bold text-indigo-900">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Sedang memproses reset database...</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-stone-600">
                  <div className={`flex items-center gap-2 ${refreshStep >= 1 ? 'font-bold text-indigo-700' : 'text-stone-400'}`}>
                    <span>{refreshStep > 1 ? '✓' : '1.'}</span>
                    <span>Membersihkan transaksi pengujian & keranjang...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${refreshStep >= 2 ? 'font-bold text-indigo-700' : 'text-stone-400'}`}>
                    <span>{refreshStep > 2 ? '✓' : '2.'}</span>
                    <span>Memulihkan 8 produk buket bunga & 7 bahan baku BOM...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${refreshStep >= 3 ? 'font-bold text-indigo-700' : 'text-stone-400'}`}>
                    <span>{refreshStep > 3 ? '✓' : '3.'}</span>
                    <span>Mengatur ulang 6 titik COD Google Maps Depok...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${refreshStep >= 4 ? 'font-bold text-emerald-600' : 'text-stone-400'}`}>
                    <span>{refreshStep >= 4 ? '✓' : '4.'}</span>
                    <span>Selesai! Database siap digunakan.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-stone-600 space-y-2.5 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="font-bold text-stone-800">Item yang akan di-refresh:</div>
                <ul className="list-disc pl-4 space-y-1 text-stone-600 text-[11px]">
                  <li>Semua transaksi pengujian akan dibersihkan.</li>
                  <li>Stok 8 katalog buket bunga kawat bulu dikembalikan ke default.</li>
                  <li>7 master bahan baku BOM & 6 titik COD Google Maps dipulihkan.</li>
                  <li>Pengaturan toko dan kuota PO harian di-reset ke 25 order.</li>
                </ul>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isRefreshing}
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isRefreshing}
                onClick={handleExecuteMigrateRefresh}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Mereset Data...</span>
                  </>
                ) : (
                  <span>Ya, Reset Sekarang ⚡</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. THEME SELECTION CARDS */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-black text-stone-800 tracking-tight">
            Pemilihan Tema Visual Etalase Toko (Storefront Themes)
          </h3>
          <p className="text-xs text-stone-500">
            Pilih salah satu dari 3 desain tema etalase. Tema yang dipilih akan langsung aktif di Storefront, Login, dan Portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themesList.map((t) => {
            const isActive = theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleSelectTheme(t.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                  isActive
                    ? 'bg-rose-50/50 border-rose-500 shadow-md shadow-rose-500/10'
                    : 'bg-white border-stone-200 hover:border-rose-300 hover:bg-rose-50/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-extrabold text-sm text-stone-800">{t.title}</div>
                  {isActive && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                      Aktif Sekarang
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-500 leading-relaxed min-h-[3rem] mb-3">
                  {t.desc}
                </p>

                {/* Swatches */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-stone-100">
                  {t.swatches.map((color, i) => (
                    <span
                      key={i}
                      className="w-5 h-5 rounded-full border border-black/10 shadow-2xs inline-block"
                      style={{ background: color }}
                    />
                  ))}
                  <span className="text-[10px] text-stone-400 font-bold ml-auto">{t.badge}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. LIVE PREVIEW BROWSER CARD */}
      <div className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-xs">
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="font-mono text-[11px] text-stone-400 ml-2 hidden sm:inline">
              https://atelier-chenille.store/{theme}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewDevice === 'desktop' ? 'bg-white text-stone-900' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewDevice === 'mobile' ? 'bg-white text-stone-900' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all ml-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Tab Baru</span>
            </Link>
          </div>
        </div>

        <div className="p-6 bg-stone-100/60 flex justify-center items-center min-h-[340px]">
          <div
            className={`transition-all duration-300 bg-white shadow-xl rounded-2xl overflow-hidden border border-stone-300 ${
              previewDevice === 'mobile' ? 'w-[375px] h-[520px]' : 'w-full h-[420px]'
            }`}
          >
            <iframe
              src="/"
              title="Storefront Live Preview"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 7. STORE SETTINGS VIEW
// ============================================================================
export const StoreSettingsView: React.FC = () => {
  const {
    storeName,
    tagline,
    waNumber,
    studioAddress,
    dailyQuota,
    paymentGateways,
    updateStoreProfile,
    togglePaymentGateway,
    updatePaymentGatewayConfig,
  } = useSettingsStore();

  const [formProfile, setFormProfile] = useState({
    storeName,
    tagline,
    waNumber,
    studioAddress,
    dailyQuota: String(dailyQuota),
  });

  const [midtransConfig, setMidtransConfig] = useState({ ...paymentGateways.midtrans });
  const [bcaConfig, setBcaConfig] = useState({ ...paymentGateways.bcaManual });
  const [codConfig, setCodConfig] = useState({ ...paymentGateways.codCash });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreProfile({
      storeName: formProfile.storeName,
      tagline: formProfile.tagline,
      waNumber: formProfile.waNumber,
      studioAddress: formProfile.studioAddress,
      dailyQuota: parseInt(formProfile.dailyQuota) || 25,
    });
    updatePaymentGatewayConfig('midtrans', midtransConfig);
    updatePaymentGatewayConfig('bcaManual', bcaConfig);
    updatePaymentGatewayConfig('codCash', codConfig);
    showMagicToast('Pengaturan Tersimpan! ⚙️', 'Konfigurasi profil atelier & payment gateway berhasil disinkronkan ke checkout.', '💾');
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-6 admin-view-fade">
      <div className="pb-4 border-b border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
            Pengaturan Atelier & Konfigurasi Payment Gateway
          </h2>
          <p className="text-xs text-stone-500">
            Kelola profil studio, aktivasi metode pembayaran checkout (Midtrans, BCA, COD), dan kredensial API.
          </p>
        </div>

        <button
          onClick={handleSave}
          type="button"
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          Simpan Semua Pengaturan
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* SECTION 1: PROFIL ATELIER */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-black uppercase text-stone-700 tracking-wider">
              1. Profil Atelier & Kuota Harian
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Nama Studio Atelier</label>
              <input
                type="text"
                value={formProfile.storeName}
                onChange={(e) => setFormProfile({ ...formProfile, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Nomor WhatsApp CS Resmi</label>
              <input
                type="text"
                value={formProfile.waNumber}
                onChange={(e) => setFormProfile({ ...formProfile, waNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Tagline Toko</label>
            <input
              type="text"
              value={formProfile.tagline}
              onChange={(e) => setFormProfile({ ...formProfile, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Alamat Fisik Workshop / Studio</label>
              <input
                type="text"
                value={formProfile.studioAddress}
                onChange={(e) => setFormProfile({ ...formProfile, studioAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Kapasitas Slot PO (Buket/Hari)</label>
              <input
                type="number"
                value={formProfile.dailyQuota}
                onChange={(e) => setFormProfile({ ...formProfile, dailyQuota: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PAYMENT GATEWAYS MANAGEMENT */}
        <div className="pt-4 border-t border-stone-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-black uppercase text-stone-700 tracking-wider">
                2. Manajemen Payment Gateway (Aktifkan / Nonaktifkan & Kredensial)
              </span>
            </div>
            <span className="text-[11px] text-stone-400">
              Metode yang dinonaktifkan tidak akan muncul di formulir checkout pelanggan.
            </span>
          </div>

          <div className="space-y-4">
            {/* 1. MIDTRANS SNAP */}
            <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-rose-600" />
                  <div>
                    <h4 className="font-extrabold text-stone-800 text-xs">
                      Midtrans Snap QRIS & Virtual Account (Otomatis)
                    </h4>
                    <span className="text-[10px] text-stone-500">
                      QRIS Nasional, GoPay, ShopeePay, VA BCA, BNI, Mandiri.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      midtransConfig.isEnabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {midtransConfig.isEnabled ? 'Aktif di Checkout' : 'Nonaktif'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={midtransConfig.isEnabled}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setMidtransConfig({ ...midtransConfig, isEnabled: val });
                        togglePaymentGateway('midtrans', val);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {midtransConfig.isEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-stone-200/60 animate-in fade-in">
                  <div>
                    <label className="block font-bold text-stone-600 text-[11px] mb-1">Merchant ID</label>
                    <input
                      type="text"
                      value={midtransConfig.merchantId}
                      onChange={(e) => setMidtransConfig({ ...midtransConfig, merchantId: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-600 text-[11px] mb-1">Client Key</label>
                    <input
                      type="text"
                      value={midtransConfig.clientKey}
                      onChange={(e) => setMidtransConfig({ ...midtransConfig, clientKey: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-600 text-[11px] mb-1">Server Key</label>
                    <input
                      type="password"
                      value={midtransConfig.serverKey}
                      onChange={(e) => setMidtransConfig({ ...midtransConfig, serverKey: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-600 text-[11px] mb-1">
                      Biaya Admin / Fee (Rp)
                    </label>
                    <input
                      type="number"
                      value={midtransConfig.adminFee ?? 0}
                      onChange={(e) =>
                        setMidtransConfig({ ...midtransConfig, adminFee: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold text-rose-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. BCA MANUAL */}
            <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-blue-600" />
                  <div>
                    <h4 className="font-extrabold text-stone-800 text-xs">
                      Transfer Bank BCA Manual (Konfirmasi WhatsApp)
                    </h4>
                    <span className="text-[10px] text-stone-500">
                      Pelanggan mentransfer ke rekening atelier dan mengirim bukti bayar ke WA CS.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      bcaConfig.isEnabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {bcaConfig.isEnabled ? 'Aktif di Checkout' : 'Nonaktif'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bcaConfig.isEnabled}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setBcaConfig({ ...bcaConfig, isEnabled: val });
                        togglePaymentGateway('bcaManual', val);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {bcaConfig.isEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-stone-200/60 animate-in fade-in">
                  <div>
                    <label className="block font-bold text-stone-600 text-[11px] mb-1">Nomor Rekening</label>
                    <input
                      type="text"
                      value={bcaConfig.accountNumber}
                      onChange={(e) => setBcaConfig({ ...bcaConfig, accountNumber: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-600 text-[11px] mb-1">Atas Nama Rekening</label>
                    <input
                      type="text"
                      value={bcaConfig.accountHolder}
                      onChange={(e) => setBcaConfig({ ...bcaConfig, accountHolder: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-600 text-[11px] mb-1">Kantor Cabang</label>
                    <input
                      type="text"
                      value={bcaConfig.branch}
                      onChange={(e) => setBcaConfig({ ...bcaConfig, branch: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-600 text-[11px] mb-1">
                      Biaya Admin / Layanan (Rp)
                    </label>
                    <input
                      type="number"
                      value={bcaConfig.adminFee ?? 0}
                      onChange={(e) =>
                        setBcaConfig({ ...bcaConfig, adminFee: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold text-rose-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. COD CASH */}
            <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <div>
                    <h4 className="font-extrabold text-stone-800 text-xs">
                      Cash on Delivery (COD) Titik Temu Kampus / Mall
                    </h4>
                    <span className="text-[10px] text-stone-500">
                      Pembayaran tunai langsung saat penyerahan buket di titik temu terverifikasi.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      codConfig.isEnabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {codConfig.isEnabled ? 'Aktif di Checkout' : 'Nonaktif'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={codConfig.isEnabled}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setCodConfig({ ...codConfig, isEnabled: val });
                        togglePaymentGateway('codCash', val);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {codConfig.isEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-200/60 animate-in fade-in">
                  <div>
                    <label className="block font-bold text-stone-600 text-[11px] mb-1">
                      Radius Maksimal COD (KM)
                    </label>
                    <input
                      type="number"
                      value={codConfig.maxDistanceKm}
                      onChange={(e) =>
                        setCodConfig({ ...codConfig, maxDistanceKm: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-600 text-[11px] mb-1">
                      Biaya Penanganan COD (Rp)
                    </label>
                    <input
                      type="number"
                      value={codConfig.adminFee ?? 0}
                      onChange={(e) =>
                        setCodConfig({ ...codConfig, adminFee: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold text-rose-700"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-600 text-[11px] mb-1">
                      Catatan / Instruksi Pembayaran COD
                    </label>
                    <input
                      type="text"
                      value={codConfig.notes}
                      onChange={(e) => setCodConfig({ ...codConfig, notes: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
          >
            Simpan Konfigurasi
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// 8. SHIPPING LABEL MODAL (modalResi)
// ============================================================================
export const ShippingLabelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  order: any;
}> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-stone-800 text-sm">Label Pengiriman Pesanan (Resi Biteship)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="p-4 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div>
              <span className="font-black text-rose-600 text-sm block">CHENILLE ATELIER</span>
              <span className="text-[10px] text-stone-400">Depok Express Florist Fulfillment</span>
            </div>
            <div className="text-right font-mono font-bold text-stone-700">
              <div>AWB: {order.trackingNumber || 'BTE-99281726'}</div>
              <div className="text-[10px] text-stone-400">J&T Express Fragile</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Penerima:</span>
              <div className="font-extrabold text-stone-800">{order.customerName}</div>
              <div className="text-stone-500">{order.customerPhone || '0812-9988-1122'}</div>
              <div className="text-stone-500 mt-0.5">{order.deliveryAddress || 'Tebet, Jakarta Selatan'}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Pengirim:</span>
              <div className="font-extrabold text-stone-800">Chenille Atelier Studio</div>
              <div className="text-stone-500">0812-9928-1192</div>
              <div className="text-stone-500 mt-0.5">Margonda Raya, Beji, Depok</div>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">Isi Paket:</span>
            <div className="font-bold text-stone-800">
              {order.items?.map((i: any) => `${i.productName} (x${i.quantity})`).join(', ') || order.bouquetName || 'Buket Bunga Kawat Bulu Chenille'}
            </div>
            <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-1 font-bold">
              ⚠️ AWAS RUSAK: BUKET KAWAT BULU & LAMPU LED
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Label Pengiriman</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 9. ADMIN PROFILE MODAL
// ============================================================================
export const AdminProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('Rania Azzahra');
  const [email, setEmail] = useState('rania.florist@atelier.com');
  const [phone, setPhone] = useState('+62 812-9988-7711');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    showMagicToast('Profil Diperbarui! 👤', 'Data akun Super Admin Florist berhasil disimpan.', '✅');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-stone-800 text-sm">Profil Pengrajin & Akun Admin</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-xl font-black shadow-md shadow-rose-500/20">
              RA
            </div>
            <div>
              <div className="font-black text-stone-800 text-sm">Rania Azzahra</div>
              <div className="text-[11px] text-rose-600 font-bold">Kepala Studio & Master Florist</div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Email Akun Florist</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Nomor Handphone WhatsApp</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
            >
              Simpan Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 10. CHANGE PASSWORD MODAL
// ============================================================================
export const ChangePasswordModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showMagicToast('Kata Sandi Tidak Cocok ⚠️', 'Konfirmasi kata sandi baru harus sama persis.', '❌');
      return;
    }
    onClose();
    showMagicToast('Kata Sandi Diperbarui! 🔑', 'Kredensial login admin telah diubah dengan aman.', '✅');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-stone-800 text-sm">Ganti Kata Sandi Super Admin</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Kata Sandi Saat Ini</label>
            <input
              type="password"
              required
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Kata Sandi Baru</label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Konfirmasi Kata Sandi Baru</label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
            >
              Simpan Kata Sandi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 11. ADD PRODUCT MODAL
// ============================================================================
export const AddProductModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Graduation');
  const [price, setPrice] = useState('145000');
  const [leadDays, setLeadDays] = useState('2');
  const [isReadyStock, setIsReadyStock] = useState(true);

  // Master Bahan Baku database reference
  const MASTER_RAW_MATERIALS = [
    { name: 'Batang Kawat Bulu Utama (6mm)', unit: 'Batang', costPerUnit: 350 },
    { name: 'Kawat Batang Penyangga No. 18', unit: 'Batang', costPerUnit: 500 },
    { name: 'Cellophane Korean Matte Waterproof', unit: 'Lembar', costPerUnit: 4500 },
    { name: 'Pita Satin Mewah Burgundy 2.5cm', unit: 'Meter', costPerUnit: 2200 },
    { name: 'Pita Organza Korea Glossy', unit: 'Meter', costPerUnit: 2500 },
    { name: 'Boneka Wisuda Mini Ber-toga 10cm', unit: 'Pcs', costPerUnit: 7400 },
    { name: 'Fairy Light LED Kawat Warm White', unit: 'Pcs', costPerUnit: 6500 },
    { name: 'Dry Floral Foam Oasis', unit: 'Blok', costPerUnit: 4000 },
    { name: 'Kartu Ucapan Gold Foil + Amplop', unit: 'Pcs', costPerUnit: 1500 },
    { name: 'Box Packaging Corrugated Tebal', unit: 'Pcs', costPerUnit: 7500 },
  ];

  // BOM Recipe Ingredients for 1 product
  interface IngredientItem {
    id: string;
    name: string;
    qty: number;
    unit: string;
    costPerUnit: number;
  }

  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { id: '1', name: 'Batang Kawat Bulu Utama (6mm)', qty: 30, unit: 'Batang', costPerUnit: 350 },
    { id: '2', name: 'Kawat Batang Penyangga No. 18', qty: 10, unit: 'Batang', costPerUnit: 500 },
    { id: '3', name: 'Cellophane Korean Matte Waterproof', qty: 2, unit: 'Lembar', costPerUnit: 4500 },
    { id: '4', name: 'Pita Satin Mewah Burgundy 2.5cm', qty: 1.5, unit: 'Meter', costPerUnit: 2200 },
  ]);

  if (!isOpen) return null;

  const handleAddIngredient = () => {
    const defaultMat = MASTER_RAW_MATERIALS[ingredients.length % MASTER_RAW_MATERIALS.length];
    const newItem: IngredientItem = {
      id: `ing-${Date.now()}`,
      name: defaultMat.name,
      qty: 1,
      unit: defaultMat.unit,
      costPerUnit: defaultMat.costPerUnit,
    };
    setIngredients([...ingredients, newItem]);
  };

  const handleMaterialChange = (id: string, matName: string) => {
    const found = MASTER_RAW_MATERIALS.find((m) => m.name === matName);
    if (found) {
      setIngredients(
        ingredients.map((item) =>
          item.id === id ? { ...item, name: found.name, unit: found.unit, costPerUnit: found.costPerUnit } : item
        )
      );
    } else {
      handleUpdateIngredient(id, 'name', matName);
    }
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const handleUpdateIngredient = (id: string, field: keyof IngredientItem, value: any) => {
    setIngredients(
      ingredients.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const calculatedHpp = ingredients.reduce((sum, item) => sum + item.qty * item.costPerUnit, 0);
  const numericPrice = parseInt(price) || 0;
  const isPriceBelowHpp = numericPrice < calculatedHpp;
  const calculatedProfit = numericPrice - calculatedHpp;
  const calculatedMargin = numericPrice > 0 ? Math.round((calculatedProfit / numericPrice) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPriceBelowHpp) {
      showMagicToast('Gagal Validasi HPP ⚠️', 'Harga jual tidak boleh kurang dari total biaya bahan baku (HPP).', '❌');
      return;
    }
    onClose();
    showMagicToast('Produk Ditambahkan! 🌸', `Buket "${name || 'Buket Baru'}" berhasil didaftarkan dengan HPP Rp ${calculatedHpp.toLocaleString('id-ID')}.`, '✨');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="font-extrabold text-stone-800 text-sm">Tambah Buket Baru & Resep Bahan Baku (BOM)</h3>
              <span className="text-[11px] text-stone-500">
                Wajib mencantumkan bahan baku untuk 1 buket. Harga jual tidak boleh kurang dari HPP.
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">
                Nama Buket Produk <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Sunflower Sunshine Graduation Bouquet"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              >
                <option value="Graduation">Graduation / Wisuda</option>
                <option value="Anniversary">Anniversary & Romance</option>
                <option value="Single Stem">Single Stem Minimalist</option>
                <option value="Mini Bloom">Mini Bloom Table Decor</option>
              </select>
            </div>
          </div>

          {/* BOM Recipe Ingredients Builder */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-rose-600" />
                <span className="font-extrabold text-stone-800 text-xs">
                  Bahan Baku yang Dibutuhkan untuk 1 Produk Buket Ini (Resep BOM):
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Bahan</span>
              </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-extrabold text-[10px] uppercase border-b border-stone-200">
                  <tr>
                    <th className="py-2 px-3">Nama Bahan Baku</th>
                    <th className="py-2 px-2 w-16">Jumlah</th>
                    <th className="py-2 px-2 w-20">Satuan</th>
                    <th className="py-2 px-2 w-28">Harga/Unit (Terkunci)</th>
                    <th className="py-2 px-3 w-28">Subtotal HPP</th>
                    <th className="py-2 px-2 text-center w-8">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-[11px]">
                  {ingredients.map((ing) => {
                    const subtotal = ing.qty * ing.costPerUnit;
                    return (
                      <tr key={ing.id}>
                        <td className="py-1.5 px-3">
                          <select
                            value={ing.name}
                            onChange={(e) => handleMaterialChange(ing.id, e.target.value)}
                            className="w-full font-semibold text-stone-800 bg-transparent border border-stone-200 rounded-lg p-1 focus:border-rose-400 focus:outline-none text-[11px]"
                          >
                            {MASTER_RAW_MATERIALS.map((m) => (
                              <option key={m.name} value={m.name}>
                                {m.name} ({m.unit} - Rp {m.costPerUnit.toLocaleString('id-ID')})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="number"
                            min="0.1"
                            step="any"
                            value={ing.qty}
                            onChange={(e) =>
                              handleUpdateIngredient(ing.id, 'qty', parseFloat(e.target.value) || 0)
                            }
                            className="w-16 p-1 bg-white border border-stone-200 rounded text-center font-bold text-[11px] focus:ring-1 focus:ring-rose-500"
                          />
                        </td>
                        <td className="py-1.5 px-2 text-stone-500 font-medium">{ing.unit}</td>
                        {/* Harga/Unit is disabled so master price isn't corrupted */}
                        <td className="py-1.5 px-2">
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              disabled
                              value={ing.costPerUnit}
                              className="w-24 p-1 bg-stone-100 text-stone-500 border border-stone-200 rounded font-mono font-bold text-[11px] cursor-not-allowed select-none"
                              title="Harga per unit dikunci dari database Master Bahan Baku (BOM)"
                            />
                            <Lock className="w-2.5 h-2.5 text-stone-400 absolute right-1.5 pointer-events-none" />
                          </div>
                        </td>
                        <td className="py-1.5 px-3 font-bold text-rose-600">
                          Rp {subtotal.toLocaleString('id-ID')}
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(ing.id)}
                            className="text-stone-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-1 gap-2">
              <span className="text-[11px] text-stone-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-stone-400" />
                <span>Harga/Unit dikunci dari database Bahan Baku agar HPP tidak tumpang tindih.</span>
              </span>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-stone-500 font-medium">Total HPP 1 Buket:</span>
                <span className="text-sm font-black text-rose-700">
                  Rp {calculatedHpp.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Strict HPP Validation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Harga Jual Konsumen (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 ${
                  isPriceBelowHpp
                    ? 'border-2 border-rose-500 bg-rose-50 text-rose-700 focus:ring-rose-500'
                    : 'border border-stone-200 bg-stone-50 text-stone-800 focus:ring-rose-500/20 focus:bg-white'
                }`}
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Harus lebih besar atau sama dengan HPP (Rp {calculatedHpp.toLocaleString('id-ID')}).
              </span>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Status Stok</label>
              <select
                value={isReadyStock ? 'READY' : 'PO'}
                onChange={(e) => setIsReadyStock(e.target.value === 'READY')}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              >
                <option value="READY">Ready Stock (Siap Kirim)</option>
                <option value="PO">Pre-Order (Dirangkai Dahulu)</option>
              </select>
            </div>
          </div>

          {/* HPP STRICT VALIDATION ERROR BANNER */}
          {isPriceBelowHpp && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-black text-rose-800 text-xs uppercase tracking-wide">
                  Validasi Gagal: Harga Jual Kurang Dari HPP!
                </div>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Harga jual (Rp {numericPrice.toLocaleString('id-ID')}) lebih rendah dari HPP bahan baku (Rp{' '}
                  {calculatedHpp.toLocaleString('id-ID')}). Potensi kerugian atelier:{' '}
                  <strong>Rp {(calculatedHpp - numericPrice).toLocaleString('id-ID')} per buket</strong>. Harap naikkan
                  harga jual minimal Rp {calculatedHpp.toLocaleString('id-ID')}.
                </p>
              </div>
            </div>
          )}

          {/* Margin Preview Card */}
          {!isPriceBelowHpp && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <span className="text-emerald-900 font-bold">Proyeksi Laba Bersih Per Buket:</span>
              <div className="text-right">
                <span className="font-extrabold text-emerald-700 text-sm">
                  +Rp {calculatedProfit.toLocaleString('id-ID')}
                </span>
                <span className="ml-1.5 text-[10px] font-black bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                  {calculatedMargin}% Margin Sehat
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPriceBelowHpp || !name.trim() || calculatedHpp === 0}
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simpan ke Katalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

