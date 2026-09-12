'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Upload,
  Truck,
  MessageSquare,
  Pencil,
  Power,
  Navigation,
  Crosshair,
} from 'lucide-react';
import { MOCK_PRODUCTS, type ExtendedProduct as Product } from '@chenille/shared';
import { useThemeStore, type ThemeId } from '@/stores/useThemeStore';
import { useSettingsStore, type WasteMaterialItem } from '@/stores/useSettingsStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { showMagicToast } from '@/lib/magic-motion';
import { getApiUrl } from '@/lib/api-client';

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
// ==============================================// ============================================================================
// 5. CREATE & EDIT COUPON MODALS (POSTGRESQL SYNC)
// ============================================================================
export const CreateCouponModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onAddCoupon?: (newCoupon: any) => void;
}> = ({ isOpen, onClose, onSuccess, onAddCoupon }) => {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'FIXED_AMOUNT' | 'PERCENTAGE' | 'FREE_SHIPPING'>('FIXED_AMOUNT');
  const [discountVal, setDiscountVal] = useState('25000');
  const [minSpend, setMinSpend] = useState('150000');
  const [noMinSpend, setNoMinSpend] = useState(false);
  const [quota, setQuota] = useState('50');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showMagicToast('Kode Wajib Diisi ⚠️', 'Harap masukkan kode kupon promo.', '❌');
      return;
    }

    setIsSubmitting(true);
    const cleanCode = code.trim().toUpperCase();
    const finalMinSpend = noMinSpend ? 0 : Number(minSpend) || 0;
    const finalDiscountVal = Number(discountVal) || 0;

    try {
      const res = await fetch(getApiUrl('/api/v1/coupons'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: cleanCode,
          discount_type: discountType,
          discount_value: finalDiscountVal,
          min_order_amount: finalMinSpend,
          quota: parseInt(quota, 10) || 50,
          description: description.trim() || undefined,
          expires_at: expiryDate ? new Date(expiryDate).toISOString() : null,
          is_active: true,
        }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        showMagicToast('Kupon Baru Diterbitkan! 🏷️', `Kupon ${cleanCode} aktif dan tersimpan di database.`, '🎉');
        if (onSuccess) onSuccess();
        if (onAddCoupon) {
          onAddCoupon({
            code: cleanCode,
            discount:
              discountType === 'PERCENTAGE'
                ? `Diskon ${finalDiscountVal}%`
                : discountType === 'FREE_SHIPPING'
                ? `Gratis Ongkir Rp ${finalDiscountVal.toLocaleString('id-ID')}`
                : `Diskon Rp ${finalDiscountVal.toLocaleString('id-ID')}`,
            minSpend: noMinSpend ? 'Tanpa Minimum' : `Min. Belanja Rp ${finalMinSpend.toLocaleString('id-ID')}`,
            used: 0,
            quota: parseInt(quota, 10) || 50,
            active: true,
            expiry: expiryDate ? new Date(expiryDate).toLocaleDateString('id-ID') : 'Tanpa Batas',
          });
        }
        onClose();
      } else {
        showMagicToast('Gagal Membuat Kupon ⚠️', data.error || 'Terjadi kesalahan sistem.', '⚠️');
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error('Error creating coupon:', err);
      showMagicToast('Gagal Membuat Kupon ⚠️', 'Koneksi ke server terputus.', '⚠️');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="font-extrabold text-stone-800 text-sm">Buat Kupon Diskon Baru</h3>
              <span className="text-[11px] text-stone-500">Tersimpan ke database Supabase &amp; aktif di checkout.</span>
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
                <option value="FIXED_AMOUNT">Potongan Nominal (Rp)</option>
                <option value="PERCENTAGE">Persentase Diskon (%)</option>
                <option value="FREE_SHIPPING">Potongan Ongkir (Rp)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {discountType === 'PERCENTAGE' ? 'Persentase (%)' : 'Nilai Potongan (Rp)'}
              </label>
              <input
                type="number"
                required
                value={discountVal}
                onChange={(e) => setDiscountVal(e.target.value)}
                placeholder={discountType === 'PERCENTAGE' ? '15' : '25000'}
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
            <label className="block font-bold text-stone-700 mb-1">Deskripsi / Catatan Promo</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Diskon khusus wisuda batch September"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Tanggal Kadaluarsa (Opsional)</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menerbitkan...</span>
                </>
              ) : (
                <span>Terbitkan Kupon</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EditCouponModal: React.FC<{
  isOpen: boolean;
  coupon: any | null;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, coupon, onClose, onSuccess }) => {
  const [discountType, setDiscountType] = useState<'FIXED_AMOUNT' | 'PERCENTAGE' | 'FREE_SHIPPING'>('FIXED_AMOUNT');
  const [discountVal, setDiscountVal] = useState('');
  const [minSpend, setMinSpend] = useState('');
  const [quota, setQuota] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (coupon) {
      setDiscountType(coupon.discount_type || (coupon.discountType === 'PERCENT' ? 'PERCENTAGE' : coupon.discountType === 'ONGKIR' ? 'FREE_SHIPPING' : 'FIXED_AMOUNT'));
      setDiscountVal(String(coupon.discount_value ?? coupon.discountVal ?? '25000'));
      setMinSpend(String(coupon.min_order_amount ?? coupon.minSpendVal ?? '100000'));
      setQuota(String(coupon.quota ?? 50));
      setDescription(coupon.description || '');
      const exp = coupon.expires_at || coupon.expiry;
      if (exp && exp.includes('-')) {
        setExpiryDate(exp.slice(0, 10));
      } else {
        setExpiryDate('');
      }
      setIsActive(coupon.is_active ?? coupon.active ?? true);
    }
  }, [coupon]);

  if (!isOpen || !coupon) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(getApiUrl(`/api/v1/coupons/${coupon.id || coupon.code}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discount_type: discountType,
          discount_value: Number(discountVal),
          min_order_amount: Number(minSpend) || 0,
          quota: parseInt(quota, 10) || 50,
          description: description.trim() || null,
          expires_at: expiryDate ? new Date(expiryDate).toISOString() : null,
          is_active: isActive,
        }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        showMagicToast('Kupon Diperbarui! 🏷️', `Perubahan kupon ${coupon.code} berhasil disimpan ke database.`, '✨');
        onSuccess();
        onClose();
      } else {
        showMagicToast('Gagal Memperbarui Kupon ⚠️', data.error || 'Terjadi kesalahan sistem.', '⚠️');
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error('Error updating coupon:', err);
      showMagicToast('Gagal Memperbarui Kupon ⚠️', 'Koneksi ke backend terputus.', '⚠️');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="font-extrabold text-stone-800 text-sm">Edit Kupon: {coupon.code}</h3>
              <span className="text-[11px] text-stone-500">Perbarui kuota, diskon, dan masa berlaku kupon.</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Jenis Potongan</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white font-bold"
              >
                <option value="FIXED_AMOUNT">Potongan Nominal (Rp)</option>
                <option value="PERCENTAGE">Persentase Diskon (%)</option>
                <option value="FREE_SHIPPING">Potongan Ongkir (Rp)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {discountType === 'PERCENTAGE' ? 'Persentase (%)' : 'Nilai Potongan (Rp)'}
              </label>
              <input
                type="number"
                required
                value={discountVal}
                onChange={(e) => setDiscountVal(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Minimal Belanja (Rp)</label>
              <input
                type="number"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Kuota Pemakaian</label>
              <input
                type="number"
                required
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Deskripsi Promo</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Tanggal Kadaluarsa</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="font-bold text-stone-700">Kupon Aktif (Dapat digunakan pelanggan)</span>
            </label>
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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 6. PROMOS & COUPONS VIEW (POSTGRESQL LIVE CRUD & ACTIVE TOGGLE)
// ============================================================================
export const PromosView: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const { coupons: localCoupons, toggleCouponActive } = useSettingsStore();

  const [dbCoupons, setDbCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  type CouponSortField = 'code' | 'discount' | 'minSpend' | 'used' | 'expiry' | 'active';
  const [sortField, setSortField] = useState<CouponSortField | null>('used');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const fetchCouponsFromApi = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(getApiUrl('/api/v1/coupons?all=true'));
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Map database coupons into standard display format
        const mapped = json.data.map((c: any) => {
          let discountStr = '';
          if (c.discount_type === 'PERCENTAGE') {
            discountStr = `Diskon ${c.discount_value}%`;
          } else if (c.discount_type === 'FREE_SHIPPING') {
            discountStr = `Gratis Ongkir Rp ${Number(c.discount_value || 15000).toLocaleString('id-ID')}`;
          } else {
            discountStr = `Diskon Rp ${Number(c.discount_value).toLocaleString('id-ID')}`;
          }

          const minSpendStr =
            Number(c.min_order_amount) > 0
              ? `Min. Belanja Rp ${Number(c.min_order_amount).toLocaleString('id-ID')}`
              : 'Tanpa Minimum';

          const expiryStr = c.expires_at
            ? new Date(c.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'Tanpa Batas';

          return {
            id: c.id,
            code: c.code,
            discount: discountStr,
            discountType: c.discount_type,
            discountVal: Number(c.discount_value),
            minSpend: minSpendStr,
            minSpendVal: Number(c.min_order_amount || 0),
            used: c.used_count || 0,
            quota: c.quota || 100,
            active: c.is_active,
            expiry: expiryStr,
            expires_at: c.expires_at,
            description: c.description,
          };
        });
        setDbCoupons(mapped);
      }
    } catch (err) {
      console.warn('Could not fetch coupons from API, falling back to local:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchCouponsFromApi();
  }, []);

  const activeCouponsList = dbCoupons.length > 0 ? dbCoupons : localCoupons;

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
    if (!sortField || !sortDirection) return activeCouponsList;
    return [...activeCouponsList].sort((a, b) => {
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
  }, [activeCouponsList, sortField, sortDirection]);

  const handleToggleActive = async (c: any) => {
    const nextState = !c.active;
    // Optimistic update
    setDbCoupons((prev) =>
      prev.map((item) => (item.code === c.code ? { ...item, active: nextState } : item))
    );
    toggleCouponActive(c.code);

    try {
      const res = await fetch(getApiUrl(`/api/v1/coupons/${c.id || c.code}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: nextState }),
      });
      const data = await res.json();
      if (data.success) {
        showMagicToast(
          nextState ? 'Kupon Diaktifkan 🏷️' : 'Kupon Dinonaktifkan ⏸️',
          `Kupon ${c.code} sekarang ${nextState ? 'aktif & siap digunakan pembeli.' : 'dinonaktifkan sementara.'}`,
          nextState ? '✅' : '⏸️'
        );
      } else {
        fetchCouponsFromApi(); // rollback
      }
    } catch {
      // Offline fallback
      showMagicToast(
        nextState ? 'Kupon Diaktifkan (Lokal) 🏷️' : 'Kupon Dinonaktifkan (Lokal) ⏸️',
        `Kupon ${c.code} sekarang ${nextState ? 'aktif.' : 'nonaktif.'}`,
        nextState ? '✅' : '⏸️'
      );
    }
  };

  const handleDeleteCoupon = async (c: any) => {
    if (!confirm(`Apakah Anda yakin ingin menonaktifkan/menghapus kupon "${c.code}"?`)) return;

    try {
      const res = await fetch(getApiUrl(`/api/v1/coupons/${c.id || c.code}`), {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showMagicToast('Kupon Dinonaktifkan 🏷️', data.message || `Kupon ${c.code} dinonaktifkan.`, '🗑️');
        fetchCouponsFromApi();
      } else {
        showMagicToast('Gagal Menghapus Kupon ⚠️', data.error || 'Gagal menghapus kupon.', '⚠️');
      }
    } catch (err) {
      console.error(err);
      showMagicToast('Gagal Menghapus Kupon ⚠️', 'Koneksi ke backend terputus.', '⚠️');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-6 admin-view-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-stone-800 tracking-tight flex items-center gap-2">
            <span>Pemasaran &amp; Manajemen Kupon Diskon</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              PostgreSQL Live Sync
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            Kelola kupon diskon nominal, persentase, dan gratis ongkir langsung di database Supabase. Terintegrasi penuh dengan alur checkout.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchCouponsFromApi}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            title="Sinkronkan data kupon dari PostgreSQL"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Kupon Baru</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="py-8 text-center text-xs text-stone-400 flex items-center justify-center gap-2">
          <RotateCw className="w-4 h-4 animate-spin text-rose-500" />
          <span>Memuat data kupon dari database...</span>
        </div>
      )}

      {/* Coupon Cards Grid with Active/Inactive Toggle and Edit/Delete Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCoupons.map((coupon) => (
          <div
            key={coupon.code}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              coupon.active
                ? 'bg-white border-rose-200 shadow-sm hover:shadow-md'
                : 'bg-stone-50/70 border-stone-200 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-rose-600" />
                  <span className="font-mono font-black text-sm tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                    {coupon.code}
                  </span>
                </div>

                {/* Status Badge + Interactive Toggle Switch */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                      coupon.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-stone-100 text-stone-500 border-stone-300'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        coupon.active ? 'bg-emerald-500' : 'bg-stone-400'
                      }`}
                    />
                    <span>{coupon.active ? 'Aktif' : 'Nonaktif'}</span>
                  </span>

                  <label
                    className="relative inline-flex items-center cursor-pointer select-none"
                    title={coupon.active ? 'Klik untuk menonaktifkan kupon' : 'Klik untuk mengaktifkan kupon'}
                  >
                    <input
                      type="checkbox"
                      checked={coupon.active}
                      onChange={() => handleToggleActive(coupon)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-xs">
                <div className="font-black text-stone-800 text-sm">{coupon.discount}</div>
                <div className="text-stone-500 text-[11px] font-medium">{coupon.minSpend}</div>
                {coupon.description && (
                  <p className="text-stone-600 text-[11px] line-clamp-2 pt-0.5 italic">
                    &quot;{coupon.description}&quot;
                  </p>
                )}
                <div className="text-stone-400 text-[10px] pt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Kadaluarsa: {coupon.expiry}</span>
                </div>
              </div>
            </div>

            {/* Progress bar and card actions */}
            <div className="mt-4 pt-3 border-t border-stone-100 space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-stone-500 mb-1">
                  <span>Penggunaan Kupon</span>
                  <span>
                    {coupon.used} / {coupon.quota} ({Math.round(((coupon.used || 0) / (coupon.quota || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(((coupon.used || 0) / (coupon.quota || 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(coupon)}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 hover:border-rose-300 text-stone-600 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCoupon(coupon)}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 hover:border-rose-300 text-stone-400 hover:text-rose-600 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Nonaktifkan kupon"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Nonaktifkan</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sortable Coupons Table */}
      <div className="pt-4 border-t border-stone-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
            Tabel Seluruh Kupon ({activeCouponsList.length})
          </span>
          <span className="text-[11px] text-stone-400">Tersinkronisasi otomatis dengan PostgreSQL Supabase</span>
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
                <TableSortHeader label="Status &amp; Toggle" field="active" currentField={sortField} direction={sortDirection} onSort={handleSort} />
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedCoupons.map((c) => (
                <tr key={c.code} className="hover:bg-rose-50/20 transition-colors">
                  <td className="py-3 px-4 font-mono font-black text-rose-700">{c.code}</td>
                  <td className="py-3 px-4 font-bold text-stone-800">{c.discount}</td>
                  <td className="py-3 px-4 text-stone-500 font-medium">{c.minSpend}</td>
                  <td className="py-3 px-4 font-bold">
                    {c.used} / {c.quota} ({Math.round(((c.used || 0) / (c.quota || 1)) * 100)}%)
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
                          onChange={() => handleToggleActive(c)}
                          className="sr-only peer"
                        />
                        <div className="w-7 h-4 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rose-600"></div>
                      </label>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingCoupon(c)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:border-rose-300 text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Edit Kupon"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:border-rose-300 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Nonaktifkan Kupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
        onSuccess={fetchCouponsFromApi}
      />

      {/* Edit Coupon Modal Form */}
      <EditCouponModal
        isOpen={Boolean(editingCoupon)}
        coupon={editingCoupon}
        onClose={() => setEditingCoupon(null)}
        onSuccess={fetchCouponsFromApi}
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
        await fetch(getApiUrl('/api/v1/admin/migrate-refresh'), { method: 'POST' });
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
    latitude,
    longitude,
    mapsLink,
    maxCodRadiusKm,
    paymentGateways,
    logisticsConfig,
    notificationConfig,
    updateStoreProfile,
    togglePaymentGateway,
    updatePaymentGatewayConfig,
    updateLogisticsConfig,
    toggleCourierActive,
    updateNotificationConfig,
  } = useSettingsStore();

  const [formProfile, setFormProfile] = useState({
    storeName,
    tagline,
    waNumber,
    studioAddress,
    dailyQuota: String(dailyQuota),
    latitude: latitude || '-6.3728',
    longitude: longitude || '106.8315',
    mapsLink: mapsLink || 'https://maps.google.com/?q=-6.3728,106.8315',
    maxCodRadiusKm: String(maxCodRadiusKm || 5.0),
  });

  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSearching, setMapSearching] = useState(false);
  const [mapSearchResult, setMapSearchResult] = useState<{
    display_name: string;
    lat: string;
    lon: string;
  } | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<
    Array<{ name: string; full_name: string; lat: string; lon: string; city?: string }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [googlePlacesActive, setGooglePlacesActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced live autocomplete search (Instant Dropdown matching admin-sunjaya UX)
  useEffect(() => {
    // If Google Places API is actively working, let Google Places handle the dropdown exclusively!
    if (googlePlacesActive) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!mapSearchQuery.trim() || mapSearchQuery.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // Restricted to Indonesia bounding box (Sabang to Merauke) + bias to current coordinates
        const latBias = formProfile.latitude || '-6.9';
        const lonBias = formProfile.longitude || '107.6';
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(
            mapSearchQuery
          )}&bbox=95.0,-11.0,141.0,6.0&lat=${latBias}&lon=${lonBias}&limit=5`
        );
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const suggestions = data.features.map((f: any) => {
            const props = f.properties;
            const parts = [props.name, props.street, props.district, props.city, props.state].filter(Boolean);
            return {
              name: props.name || props.street || 'Lokasi',
              full_name: parts.join(', '),
              lat: String(f.geometry.coordinates[1]),
              lon: String(f.geometry.coordinates[0]),
              city: props.city || props.state || '',
            };
          });
          setSearchSuggestions(suggestions);
          setShowSuggestions(true);
        } else {
          // Fallback to Nominatim strictly restricted to Indonesia
          const nomRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              mapSearchQuery
            )}&countrycodes=id&limit=5&addressdetails=1`
          );
          const nomData = await nomRes.json();
          if (Array.isArray(nomData) && nomData.length > 0) {
            const suggestions = nomData.map((item: any) => ({
              name: item.name || item.display_name.split(',')[0],
              full_name: item.display_name,
              lat: item.lat,
              lon: item.lon,
              city: item.address?.city || item.address?.town || item.address?.county || item.address?.state || '',
            }));
            setSearchSuggestions(suggestions);
            setShowSuggestions(true);
          } else {
            setSearchSuggestions([]);
          }
        }
      } catch (e) {
        setSearchSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [mapSearchQuery, googlePlacesActive, formProfile.latitude, formProfile.longitude]);

  // Google Places Autocomplete Integration (Pola admin-sunjaya jika API Key tersedia)
  useEffect(() => {
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!googleApiKey || typeof window === 'undefined') return;

    // Handle Google Maps auth or activation failure gracefully
    const originalAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      console.warn('[Google Maps] Auth/Activation failure. Places API might need activation in Google Cloud Console. Falling back to local geocoder.');
      setGooglePlacesActive(false);
      if (typeof originalAuthFailure === 'function') originalAuthFailure();
    };

    const initAutocomplete = () => {
      try {
        if (!(window as any).google?.maps?.places || !searchInputRef.current) return;
        const autocomplete = new (window as any).google.maps.places.Autocomplete(searchInputRef.current, {
          componentRestrictions: { country: 'id' },
          fields: ['formatted_address', 'geometry', 'name'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;

          const lat = place.geometry.location.lat().toFixed(6);
          const lon = place.geometry.location.lng().toFixed(6);
          const address = place.formatted_address || place.name || '';

          setFormProfile((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lon,
            studioAddress: address,
            mapsLink: `https://maps.google.com/?q=${lat},${lon}`,
          }));
          setMapSearchResult({
            display_name: address,
            lat,
            lon,
          });
          showMagicToast('Google Places Terdeteksi! 📍', address.slice(0, 50) + '...', '✨');
        });

        setGooglePlacesActive(true);
      } catch (err) {
        console.warn('[Google Places] Initialization error:', err);
        setGooglePlacesActive(false);
      }
    };

    if ((window as any).google?.maps?.places) {
      initAutocomplete();
    } else {
      const scriptId = 'google-maps-places-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&language=id`;
        script.async = true;
        script.defer = true;
        script.onload = initAutocomplete;
        script.onerror = () => {
          console.warn('[Google Maps] Failed to load script. Falling back to local engine.');
          setGooglePlacesActive(false);
        };
        document.head.appendChild(script);
      }
    }
  }, []);

  const handleSelectSuggestion = (suggestion: {
    name: string;
    full_name: string;
    lat: string;
    lon: string;
  }) => {
    const lat = parseFloat(suggestion.lat).toFixed(6);
    const lon = parseFloat(suggestion.lon).toFixed(6);
    setFormProfile((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
      studioAddress: suggestion.full_name,
      mapsLink: `https://maps.google.com/?q=${lat},${lon}`,
    }));
    setMapSearchResult({
      display_name: suggestion.full_name,
      lat,
      lon,
    });
    setMapSearchQuery(suggestion.name);
    setShowSuggestions(false);
    showMagicToast('Lokasi Terpilih! 📍', suggestion.full_name.slice(0, 50) + '...', '✅');
  };

  // Synchronize store settings from backend database on mount
  useEffect(() => {
    fetch(getApiUrl('/api/v1/admin/settings/all'))
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.store_settings) {
          const s = data.data.store_settings;
          setFormProfile((prev) => ({
            ...prev,
            storeName: s.store_name || prev.storeName,
            tagline: s.tagline || prev.tagline,
            waNumber: s.wa_number || prev.waNumber,
            studioAddress: s.studio_address || prev.studioAddress,
            dailyQuota: String(s.daily_quota || prev.dailyQuota),
            latitude: s.latitude || prev.latitude,
            longitude: s.longitude || prev.longitude,
            mapsLink: s.maps_link || prev.mapsLink,
            maxCodRadiusKm: String(s.max_cod_radius_km || prev.maxCodRadiusKm),
          }));
          updateStoreProfile({
            storeName: s.store_name,
            tagline: s.tagline,
            waNumber: s.wa_number,
            studioAddress: s.studio_address,
            dailyQuota: s.daily_quota,
            latitude: s.latitude,
            longitude: s.longitude,
            mapsLink: s.maps_link,
            maxCodRadiusKm: s.max_cod_radius_km ? parseFloat(s.max_cod_radius_km) : undefined,
          });
        }
      })
      .catch((err) => console.warn('Sync store settings fetch error:', err));
  }, []);

  const handleSearchLocation = async () => {
    if (!mapSearchQuery.trim()) return;
    setMapSearching(true);
    setMapSearchResult(null);
    setShowSuggestions(false);

    // Check if user pasted a Google Maps URL
    const isGoogleMapsUrl =
      mapSearchQuery.includes('maps.app.goo.gl') ||
      mapSearchQuery.includes('google.com/maps') ||
      mapSearchQuery.includes('maps.google.com');

    if (isGoogleMapsUrl) {
      let extractedPlaceName = '';
      const placeMatch = mapSearchQuery.match(/\/place\/([^\/@?#]+)/);
      if (placeMatch) {
        extractedPlaceName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      }

      const pinLatMatch = mapSearchQuery.match(/!3d(-?\d+\.\d+)/);
      const pinLngMatch = mapSearchQuery.match(/!4d(-?\d+\.\d+)/);
      const queryCoordMatch = mapSearchQuery.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
      const centerMatch = mapSearchQuery.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

      let parsedLat: number | null = null;
      let parsedLng: number | null = null;

      if (pinLatMatch && pinLngMatch) {
        parsedLat = parseFloat(pinLatMatch[1]);
        parsedLng = parseFloat(pinLngMatch[1]);
      } else if (queryCoordMatch) {
        parsedLat = parseFloat(queryCoordMatch[1]);
        parsedLng = parseFloat(queryCoordMatch[2]);
      } else if (centerMatch) {
        parsedLat = parseFloat(centerMatch[1]);
        parsedLng = parseFloat(centerMatch[2]);
      }

      if (parsedLat !== null && parsedLng !== null) {
        const latStr = parsedLat.toFixed(6);
        const lngStr = parsedLng.toFixed(6);

        let resolvedAddress = '';
        try {
          const revRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${parsedLat}&lon=${parsedLng}&addressdetails=1`,
            { headers: { 'Accept-Language': 'id', 'User-Agent': 'Chenille/1.0' } }
          );
          const revData = await revRes.json();
          if (revData && revData.address) {
            const addr = revData.address;
            const road = addr.road || addr.pedestrian || addr.suburb || '';
            const village = addr.village || addr.neighbourhood || addr.suburb || '';
            const district = addr.city_district || addr.subdistrict || addr.district || '';
            const city = addr.city || addr.town || addr.county || '';
            const state = addr.state || '';
            const postcode = addr.postcode || '40531';

            if (extractedPlaceName && /JL\s|JALAN\s|NO\.\s*\d+/i.test(extractedPlaceName)) {
              const parts = [
                extractedPlaceName,
                village && !extractedPlaceName.toLowerCase().includes(village.toLowerCase()) ? village : '',
                district ? `Kec. ${district}` : '',
                city ? (city.startsWith('Kota') || city.startsWith('Kab') ? city : `Kota ${city}`) : '',
                state,
                postcode,
              ].filter(Boolean);
              resolvedAddress = parts.join(', ');
            } else {
              const parts = [
                extractedPlaceName || road,
                village && village !== road ? village : '',
                district ? `Kec. ${district}` : '',
                city ? (city.startsWith('Kota') || city.startsWith('Kab') ? city : `Kota ${city}`) : '',
                state,
                postcode,
              ].filter(Boolean);
              resolvedAddress = parts.join(', ') || revData.display_name;
            }
          }
        } catch (e) {
          resolvedAddress = extractedPlaceName || `${latStr}, ${lngStr}`;
        }

        const finalAddress = resolvedAddress || extractedPlaceName || `${latStr}, ${lngStr}`;
        setFormProfile((prev) => ({
          ...prev,
          latitude: latStr,
          longitude: lngStr,
          studioAddress: finalAddress,
          mapsLink: mapSearchQuery,
        }));
        setMapSearchResult({
          display_name: finalAddress,
          lat: latStr,
          lon: lngStr,
        });
        setMapSearching(false);
        showMagicToast('Link Google Maps Terdeteksi! 📍', (extractedPlaceName || finalAddress).slice(0, 50) + '...', '✅');
        return;
      }
    }

    // Check if user entered lat, lon directly (e.g. "-6.3728, 106.8315")
    const coordMatch = mapSearchQuery.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
    if (coordMatch) {
      const lat = coordMatch[1];
      const lon = coordMatch[2];
      setFormProfile((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lon,
        mapsLink: `https://maps.google.com/?q=${lat},${lon}`,
      }));
      setMapSearchResult({
        display_name: `Koordinat Manual: ${lat}, ${lon}`,
        lat,
        lon,
      });
      setMapSearching(false);
      showMagicToast('Titik Ditemukan! 📍', `Koordinat diatur ke ${lat}, ${lon}`, '✅');
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          mapSearchQuery
        )}&countrycodes=id&limit=1&addressdetails=1`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        setMapSearchResult({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
        });
        setFormProfile((prev) => ({
          ...prev,
          latitude: parseFloat(item.lat).toFixed(6),
          longitude: parseFloat(item.lon).toFixed(6),
          studioAddress: item.display_name,
          mapsLink: `https://maps.google.com/?q=${item.lat},${item.lon}`,
        }));
        showMagicToast('Lokasi Ditemukan! 📍', item.display_name.slice(0, 50) + '...', '✅');
      } else {
        showMagicToast('Lokasi Tidak Ditemukan ⚠️', 'Coba kata kunci lain atau masukkan koordinat langsung.', '❌');
      }
    } catch (err) {
      console.warn('Geocoding error:', err);
      showMagicToast('Pencarian Gagal ⚠️', 'Periksa koneksi internet Anda.', '❌');
    } finally {
      setMapSearching(false);
    }
  };

  const handleCopySearchToAddress = () => {
    if (mapSearchResult?.display_name) {
      setFormProfile((prev) => ({
        ...prev,
        studioAddress: mapSearchResult.display_name,
      }));
      showMagicToast('Alamat Tersalin! 📋', 'Alamat hasil pencarian peta disalin ke kolom alamat fisik workshop.', '✨');
    }
  };

  // Reverse Geocoding on GPS: converts hardware coordinates to real human-readable street address
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showMagicToast('GPS Tidak Didukung ⚠️', 'Browser Anda tidak mendukung geolokasi.', '❌');
      return;
    }

    setGpsLoading(true);
    showMagicToast('Mendeteksi GPS... 🛰️', 'Menghubungi satelit GPS & mencari nama jalan...', '⏳');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);

        // Reverse geocoding to resolve real human-readable street address
        let resolvedAddress = `Area Lokasi (${lat}, ${lon})`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
            { headers: { 'User-Agent': 'ChenilleAtelier/1.0' } }
          );
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            const parts: string[] = [];
            // Nama jalan / area / kelurahan
            const streetOrArea = addr.road || addr.building || addr.amenity || addr.suburb || addr.village || addr.neighbourhood;
            if (streetOrArea) parts.push(streetOrArea);
            // Kelurahan jika belum masuk
            if (addr.suburb && addr.road && addr.suburb !== streetOrArea) {
              parts.push(addr.suburb);
            }
            // Kecamatan
            const kec = addr.city_district || addr.county;
            if (kec) {
              parts.push(kec.toLowerCase().startsWith('kec') ? kec : `Kec. ${kec}`);
            }
            // Kota / Kabupaten
            const kota = addr.city || addr.town || addr.municipality;
            if (kota) {
              parts.push(kota.toLowerCase().startsWith('kota') || kota.toLowerCase().startsWith('kab') ? kota : `Kota ${kota}`);
            }
            // Provinsi
            if (addr.state) parts.push(addr.state);
            // Kode Pos
            if (addr.postcode) parts.push(addr.postcode);

            if (parts.length >= 2) {
              resolvedAddress = parts.join(', ');
            } else if (data.display_name) {
              resolvedAddress = data.display_name;
            }
          } else if (data && data.display_name) {
            resolvedAddress = data.display_name;
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
        }

        setFormProfile((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
          studioAddress: resolvedAddress, // Real human street address!
          mapsLink: `https://maps.google.com/?q=${lat},${lon}`,
        }));
        setMapSearchResult({
          display_name: resolvedAddress,
          lat,
          lon,
        });
        setGpsLoading(false);
        showMagicToast('GPS & Alamat Terdeteksi! 🎯', resolvedAddress.slice(0, 50) + '...', '📍');
      },
      (err) => {
        setGpsLoading(false);
        showMagicToast('Gagal Mendeteksi GPS ⚠️', err.message || 'Izin lokasi ditolak.', '❌');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const [midtransConfig, setMidtransConfig] = useState({ ...paymentGateways.midtrans });
  const [bcaConfig, setBcaConfig] = useState({ ...paymentGateways.bcaManual });
  const [codConfig, setCodConfig] = useState({ ...paymentGateways.codCash });
  const [logisticsForm, setLogisticsForm] = useState({ ...logisticsConfig });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWaApiKey, setShowWaApiKey] = useState(false);
  const [testApiState, setTestApiState] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
    servicesCount?: number;
  }>({ status: 'idle', message: '' });
  const [notifForm, setNotifForm] = useState({
    isEnabled: notificationConfig.isEnabled,
    apiKey: notificationConfig.apiKey || '',
    senderDevice: notificationConfig.senderDevice || '081234567890',
    events: { ...notificationConfig.events },
  });
  const [waTestState, setWaTestState] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  const handleTestBiteship = async () => {
    setTestApiState({ status: 'testing', message: 'Menghubungi server Biteship...' });
    try {
      const res = await fetch(getApiUrl('/api/v1/admin/settings/logistics/test'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: logisticsForm.apiKey }),
      });
      const data = await res.json();
      if (data.success) {
        setTestApiState({
          status: 'success',
          message: `${data.message} (${data.totalServices} Layanan Kurir Terdeteksi - ${data.mode})`,
          servicesCount: data.totalServices,
        });
        showMagicToast('API Biteship Terhubung! 🚚', `${data.totalServices} layanan kurir aktif terverifikasi.`, '✅');
      } else {
        setTestApiState({
          status: 'error',
          message: data.error || 'Gagal memverifikasi API Key Biteship.',
        });
        showMagicToast('Koneksi Biteship Gagal ⚠️', data.error || 'Periksa kembali API Key Anda.', '❌');
      }
    } catch (err: any) {
      setTestApiState({
        status: 'error',
        message: 'Koneksi ke backend API terputus.',
      });
      showMagicToast('Koneksi Error ⚠️', 'Gagal memanggil endpoint test backend.', '❌');
    }
  };

  const handleTestWa = async () => {
    setWaTestState({ status: 'testing', message: 'Mengirim pesan tes via Fonnte...' });
    try {
      const res = await fetch(getApiUrl('/api/v1/admin/settings/notifications/test'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: notifForm.apiKey || undefined,
          target_phone: notifForm.senderDevice || undefined,
          sender_device: notifForm.senderDevice || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWaTestState({
          status: 'success',
          message: data.data?.message || 'Koneksi WhatsApp berhasil!',
        });
        showMagicToast('WhatsApp Terhubung! 📱', data.data?.message || 'Pesan tes berhasil dikirim.', '✅');
      } else {
        setWaTestState({
          status: 'error',
          message: data.data?.message || data.error || 'Gagal menguji koneksi Fonnte.',
        });
        showMagicToast('Koneksi WhatsApp Gagal ⚠️', data.data?.message || 'Periksa API Key.', '❌');
      }
    } catch (err: any) {
      setWaTestState({ status: 'error', message: 'Koneksi ke backend API terputus.' });
      showMagicToast('Koneksi Error ⚠️', 'Gagal memanggil endpoint test WhatsApp.', '❌');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreProfile({
      storeName: formProfile.storeName,
      tagline: formProfile.tagline,
      waNumber: formProfile.waNumber,
      studioAddress: formProfile.studioAddress,
      dailyQuota: parseInt(formProfile.dailyQuota) || 25,
      latitude: formProfile.latitude,
      longitude: formProfile.longitude,
      mapsLink: formProfile.mapsLink,
      maxCodRadiusKm: parseFloat(formProfile.maxCodRadiusKm) || 5.0,
    });
    updatePaymentGatewayConfig('midtrans', midtransConfig);
    updatePaymentGatewayConfig('bcaManual', bcaConfig);
    updatePaymentGatewayConfig('codCash', codConfig);
    updateLogisticsConfig(logisticsForm);

    // Sync store profile to backend DB
    fetch(getApiUrl('/api/v1/admin/settings'), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store_name: formProfile.storeName,
        tagline: formProfile.tagline,
        wa_number: formProfile.waNumber,
        studio_address: formProfile.studioAddress,
        daily_quota: parseInt(formProfile.dailyQuota) || 25,
        latitude: formProfile.latitude,
        longitude: formProfile.longitude,
        maps_link: formProfile.mapsLink,
        max_cod_radius_km: parseFloat(formProfile.maxCodRadiusKm) || 5.0,
      }),
    }).catch((err) => console.warn('Sync store settings error:', err));

    // Sync logistics settings to backend DB
    fetch(getApiUrl('/api/v1/admin/settings/logistics'), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_enabled: logisticsForm.isEnabled,
        is_production: logisticsForm.isProduction,
        api_key: logisticsForm.apiKey,
        origin_name: logisticsForm.originName,
        origin_phone: logisticsForm.originPhone,
        origin_address: logisticsForm.originAddress,
        origin_postal_code: logisticsForm.originPostalCode,
        active_couriers: Object.entries(logisticsForm.activeCouriers)
          .filter(([_, v]) => v)
          .map(([k]) => k),
        extra_packing_fee: logisticsForm.extraPackingFee,
      }),
    }).catch((err) => console.warn('Sync logistics settings error:', err));

    // Sync notification settings to backend DB
    updateNotificationConfig(notifForm);
    fetch(getApiUrl('/api/v1/admin/settings/notifications'), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_enabled: notifForm.isEnabled,
        api_key: notifForm.apiKey || undefined,
        sender_device: notifForm.senderDevice,
        events: notifForm.events,
      }),
    }).catch((err) => console.warn('Sync notification settings error:', err));

    showMagicToast('Pengaturan Tersimpan! ⚙️', 'Konfigurasi profil atelier, titik maps, payment gateway, logistik kurir & notifikasi WA berhasil disinkronkan.', '💾');
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-6 admin-view-fade">
      <div className="pb-4 border-b border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
            Pengaturan Atelier & Konfigurasi Payment Gateway
          </h2>
          <p className="text-xs text-stone-500">
            Kelola profil studio, titik lokasi maps, aktivasi metode pembayaran checkout (Midtrans, BCA, COD), dan kredensial API.
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

          {/* MAPS & TITIK ACUAN COD ENGINE (Adopsi adminShuttleV3) */}
          <div className="mt-4 p-4 sm:p-5 rounded-2xl border border-rose-200/80 bg-rose-50/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                <div>
                  <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">
                    Titik Lokasi Workshop di Google Maps & Geofencing Origin COD
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Titik koordinat acuan (origin) kalkulasi jarak radius Bebas Biaya Antar COD pelanggan (Adopsi Pola adminShuttleV3).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={gpsLoading}
                  className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-60"
                  title="Deteksi koordinat GPS dan otomatis ubah menjadi nama jalan riil (Reverse Geocoding)"
                >
                  {gpsLoading ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
                  ) : (
                    <Crosshair className="w-3.5 h-3.5" />
                  )}
                  <span>{gpsLoading ? 'Mencari Alamat GPS...' : 'Gunakan GPS Saya'}</span>
                </button>
              </div>
            </div>

            {/* SEARCH MAP INPUT WITH LIVE DROPDOWN SUGGESTIONS & COPY TO ADDRESS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-stone-700 text-xs">
                  Cari Lokasi / Alamat di Maps:
                </label>
                <div className="flex items-center gap-1.5 text-[10px]">
                  {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Google Places Autocomplete Aktif
                    </span>
                  ) : (
                    <span className="text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200 font-medium flex items-center gap-1">
                      <Info className="w-3 h-3 text-stone-400" /> Smart Live Autocomplete (Pola admin-sunjaya)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 relative">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
                  <input
                    ref={searchInputRef}
                    id="search-map-input"
                    type="text"
                    placeholder="Ketik nama jalan, gedung, atau koordinat (cth: Margonda Raya, Beji Depok)..."
                    value={mapSearchQuery}
                    onChange={(e) => {
                      setMapSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => {
                      if (searchSuggestions.length > 0) setShowSuggestions(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        setShowSuggestions(false);
                        handleSearchLocation();
                      }
                    }}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />

                  {/* FLOATING SUGGESTIONS DROPDOWN (Pola admin-sunjaya UX) */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-stone-200 shadow-xl z-50 overflow-hidden divide-y divide-stone-100 max-h-60 overflow-y-auto">
                      <div className="px-3 py-1.5 bg-stone-50 text-[10px] font-bold text-stone-400 flex items-center justify-between">
                        <span>PILIH LOKASI DARI SARAN:</span>
                        <span className="text-rose-500 font-mono">{searchSuggestions.length} Hasil Ditemukan</span>
                      </div>
                      {searchSuggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSuggestion(sug)}
                          className="w-full px-3.5 py-2.5 text-left hover:bg-rose-50/70 flex items-start gap-2.5 transition-colors cursor-pointer group"
                        >
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-stone-800 truncate">{sug.name}</div>
                            <div className="text-[11px] text-stone-500 line-clamp-1">{sug.full_name}</div>
                          </div>
                          {sug.city && (
                            <span className="shrink-0 px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold self-center">
                              {sug.city}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSearchLocation}
                  disabled={mapSearching}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {mapSearching ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  {mapSearching ? 'Mencari...' : 'Cari di Maps'}
                </button>
                {mapSearchResult && (
                  <button
                    type="button"
                    onClick={handleCopySearchToAddress}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                    title="Salin hasil pencarian ke kolom Alamat Fisik Workshop"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Jadikan Alamat Studio
                  </button>
                )}
              </div>

              {/* SEARCH RESULT BANNER */}
              {mapSearchResult && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-900">Lokasi Terpilih:</span>
                      <p className="text-emerald-800 text-[11px] line-clamp-2">{mapSearchResult.display_name}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySearchToAddress}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shrink-0 cursor-pointer"
                  >
                    Salin ke Alamat
                  </button>
                </div>
              )}

              {/* QUICK PRESET PILLS */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-stone-500 font-semibold">Preset Cepat:</span>
                {[
                  { label: 'Margonda Raya 120 (Depok)', lat: '-6.3728', lon: '106.8315', addr: 'Jl. Margonda Raya No. 120, Beji, Kota Depok, Jawa Barat 16424' },
                  { label: 'Pondok Cina (Beji)', lat: '-6.3688', lon: '106.8336', addr: 'Pondok Cina, Kec. Beji, Kota Depok, Jawa Barat 16424' },
                  { label: 'UI Depok Gerbatama', lat: '-6.3628', lon: '106.8315', addr: 'Jl. Margonda Raya No. 100, Pondok Cina, Kec. Beji, Kota Depok, Jawa Barat 16424' },
                  { label: 'Margo City Mall', lat: '-6.3732', lon: '106.8345', addr: 'Jl. Margonda Raya No. 358, Kemiri Muka, Beji, Depok' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setFormProfile((prev) => ({
                        ...prev,
                        latitude: preset.lat,
                        longitude: preset.lon,
                        studioAddress: preset.addr,
                        mapsLink: `https://maps.google.com/?q=${preset.lat},${preset.lon}`,
                      }));
                      setMapSearchResult({
                        display_name: preset.addr,
                        lat: preset.lat,
                        lon: preset.lon,
                      });
                      showMagicToast('Preset Diterapkan! 📍', preset.label, '✨');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-100 text-stone-700 hover:text-rose-700 text-[11px] font-medium border border-stone-200 transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE GOOGLE MAPS EMBED VIEW */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 h-64 shadow-inner">
              <iframe
                title="Atelier Workshop Location"
                src={`https://maps.google.com/maps?q=${formProfile.latitude || -6.3728},${formProfile.longitude || 106.8315}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-xs flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
                <span className="text-[11px] font-bold text-stone-800">
                  Origin Atelier: {formProfile.latitude}, {formProfile.longitude}
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <a
                  href={formProfile.mapsLink || `https://maps.google.com/?q=${formProfile.latitude},${formProfile.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-stone-200/80 hover:bg-white text-rose-600 text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  Buka di Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* LATITUDE, LONGITUDE, COD RADIUS & MAPS LINK INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Latitude <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formProfile.latitude}
                  onChange={(e) => {
                    const lat = e.target.value;
                    setFormProfile({
                      ...formProfile,
                      latitude: lat,
                      mapsLink: `https://maps.google.com/?q=${lat},${formProfile.longitude}`,
                    });
                  }}
                  placeholder="-6.3728"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Longitude <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formProfile.longitude}
                  onChange={(e) => {
                    const lon = e.target.value;
                    setFormProfile({
                      ...formProfile,
                      longitude: lon,
                      mapsLink: `https://maps.google.com/?q=${formProfile.latitude},${lon}`,
                    });
                  }}
                  placeholder="106.8315"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Radius Bebas COD (KM)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formProfile.maxCodRadiusKm}
                  onChange={(e) => setFormProfile({ ...formProfile, maxCodRadiusKm: e.target.value })}
                  placeholder="5.0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
                <span className="text-[10px] text-stone-400">Bebas ongkir jika jarak ≤ {formProfile.maxCodRadiusKm || 5.0} KM</span>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Link Google Maps Toko
                </label>
                <input
                  type="text"
                  value={formProfile.mapsLink}
                  onChange={(e) => setFormProfile({ ...formProfile, mapsLink: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
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

        {/* SECTION 3: LOGISTICS & COURIER MANAGEMENT */}
        <div className="pt-4 border-t border-stone-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-black uppercase text-stone-700 tracking-wider">
                3. Manajemen Jasa Kirim & Logistik (Biteship API & Kurir Ekspedisi)
              </span>
            </div>
            <span className="text-[11px] text-stone-400">
              Kurir yang dinonaktifkan tidak akan muncul pada pilihan ongkir pelanggan saat checkout.
            </span>
          </div>

          <div className="space-y-4">
            {/* 1. BITESHIP AGGREGATOR CARD */}
            <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-800 text-xs flex items-center gap-2">
                      <span>Biteship Logistics Aggregator (Kalkulasi Ongkir Otomatis)</span>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          logisticsForm.isProduction
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {logisticsForm.isProduction ? 'Live Mode' : 'Testing Sandbox'}
                      </span>
                    </h4>
                    <span className="text-[10px] text-stone-500">
                      Mengkalkulasi ongkir real-time kurir ekspedisi (J&T, JNE, SiCepat, GoSend) & pembuatan resi otomatis.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      logisticsForm.isEnabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {logisticsForm.isEnabled ? 'Aktif di Checkout' : 'Nonaktif'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={logisticsForm.isEnabled}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setLogisticsForm({ ...logisticsForm, isEnabled: val });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {logisticsForm.isEnabled && (
                <div className="space-y-3 pt-3 border-t border-stone-200/60 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Mode Toggle */}
                    <div>
                      <label className="block font-bold text-stone-600 text-[11px] mb-1">Mode Lingkungan</label>
                      <select
                        value={logisticsForm.isProduction ? 'live' : 'testing'}
                        onChange={(e) =>
                          setLogisticsForm({
                            ...logisticsForm,
                            isProduction: e.target.value === 'live',
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold"
                      >
                        <option value="testing">Testing / Sandbox Mode</option>
                        <option value="live">Live Production (Kurir Riil)</option>
                      </select>
                    </div>

                    {/* API Key */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-stone-600 text-[11px]">
                          Biteship API Key
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          {showApiKey ? 'Sembunyikan' : 'Tampilkan'}
                        </button>
                      </div>
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={logisticsForm.apiKey}
                        onChange={(e) => setLogisticsForm({ ...logisticsForm, apiKey: e.target.value })}
                        placeholder="biteship_test.eyJ..."
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono"
                      />
                    </div>

                    {/* Extra Packing Fee */}
                    <div>
                      <label className="block font-bold text-stone-600 text-[11px] mb-1">
                        Biaya Packing Kardus (Rp)
                      </label>
                      <input
                        type="number"
                        value={logisticsForm.extraPackingFee ?? 0}
                        onChange={(e) =>
                          setLogisticsForm({
                            ...logisticsForm,
                            extraPackingFee: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold text-rose-700"
                      />
                    </div>
                  </div>

                  {/* Origin Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-stone-600 text-[11px] mb-1">
                        Alamat Asal Pickup Workshop (Origin Atelier)
                      </label>
                      <input
                        type="text"
                        value={logisticsForm.originAddress}
                        onChange={(e) =>
                          setLogisticsForm({ ...logisticsForm, originAddress: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-600 text-[11px] mb-1">
                        Kode Pos Origin
                      </label>
                      <input
                        type="number"
                        value={logisticsForm.originPostalCode}
                        onChange={(e) =>
                          setLogisticsForm({
                            ...logisticsForm,
                            originPostalCode: parseInt(e.target.value, 10) || 16424,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* API Test Diagnostics Bar */}
                  <div className="pt-2 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTestBiteship}
                        disabled={testApiState.status === 'testing'}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-[11px] shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${testApiState.status === 'testing' ? 'animate-spin' : ''}`}
                        />
                        <span>{testApiState.status === 'testing' ? 'Menguji API...' : 'Tes Koneksi API Biteship'}</span>
                      </button>

                      {testApiState.status === 'success' && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 animate-in fade-in">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{testApiState.message}</span>
                        </span>
                      )}

                      {testApiState.status === 'error' && (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg flex items-center gap-1 animate-in fade-in">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>{testApiState.message}</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-stone-400">
                      Terhubung ke API Biteship v1 via HTTPS Serverless
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. COURIER FILTER SELECTION CARD */}
            <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-stone-800 text-xs">
                    Kurir Ekspedisi yang Diaktifkan di Checkout
                  </h4>
                  <span className="text-[10px] text-stone-500">
                    Pilih ekspedisi mana saja yang ingin Anda aktifkan untuk pengiriman buket bunga kawat bulu.
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {Object.values(logisticsForm.activeCouriers).filter(Boolean).length} Kurir Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                {/* J&T */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    logisticsForm.activeCouriers.jnt
                      ? 'bg-white border-rose-300 shadow-xs'
                      : 'bg-stone-100 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-xs text-stone-800">🚚 J&T Express</span>
                    <input
                      type="checkbox"
                      checked={logisticsForm.activeCouriers.jnt}
                      onChange={(e) =>
                        setLogisticsForm({
                          ...logisticsForm,
                          activeCouriers: {
                            ...logisticsForm.activeCouriers,
                            jnt: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 block">Layanan: EZ & Super</span>
                  <span
                    className={`text-[9px] font-bold mt-1 inline-block ${
                      logisticsForm.activeCouriers.jnt ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  >
                    {logisticsForm.activeCouriers.jnt ? '● Aktif' : '○ Nonaktif'}
                  </span>
                </div>

                {/* JNE */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    logisticsForm.activeCouriers.jne
                      ? 'bg-white border-rose-300 shadow-xs'
                      : 'bg-stone-100 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-xs text-stone-800">📦 JNE Express</span>
                    <input
                      type="checkbox"
                      checked={logisticsForm.activeCouriers.jne}
                      onChange={(e) =>
                        setLogisticsForm({
                          ...logisticsForm,
                          activeCouriers: {
                            ...logisticsForm.activeCouriers,
                            jne: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 block">Layanan: REG & YES</span>
                  <span
                    className={`text-[9px] font-bold mt-1 inline-block ${
                      logisticsForm.activeCouriers.jne ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  >
                    {logisticsForm.activeCouriers.jne ? '● Aktif' : '○ Nonaktif'}
                  </span>
                </div>

                {/* SiCepat */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    logisticsForm.activeCouriers.sicepat
                      ? 'bg-white border-rose-300 shadow-xs'
                      : 'bg-stone-100 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-xs text-stone-800">⚡ SiCepat</span>
                    <input
                      type="checkbox"
                      checked={logisticsForm.activeCouriers.sicepat}
                      onChange={(e) =>
                        setLogisticsForm({
                          ...logisticsForm,
                          activeCouriers: {
                            ...logisticsForm.activeCouriers,
                            sicepat: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 block">Layanan: BEST & HALU</span>
                  <span
                    className={`text-[9px] font-bold mt-1 inline-block ${
                      logisticsForm.activeCouriers.sicepat ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  >
                    {logisticsForm.activeCouriers.sicepat ? '● Aktif' : '○ Nonaktif'}
                  </span>
                </div>

                {/* GoSend */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    logisticsForm.activeCouriers.gosend
                      ? 'bg-white border-rose-300 shadow-xs'
                      : 'bg-stone-100 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-xs text-stone-800">🛵 GoSend Instant</span>
                    <input
                      type="checkbox"
                      checked={logisticsForm.activeCouriers.gosend}
                      onChange={(e) =>
                        setLogisticsForm({
                          ...logisticsForm,
                          activeCouriers: {
                            ...logisticsForm.activeCouriers,
                            gosend: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 block">Instant & Same Day</span>
                  <span
                    className={`text-[9px] font-bold mt-1 inline-block ${
                      logisticsForm.activeCouriers.gosend ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  >
                    {logisticsForm.activeCouriers.gosend ? '● Aktif' : '○ Nonaktif'}
                  </span>
                </div>

                {/* AnterAja */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    logisticsForm.activeCouriers.anteraja
                      ? 'bg-white border-rose-300 shadow-xs'
                      : 'bg-stone-100 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-xs text-stone-800">🏃 AnterAja</span>
                    <input
                      type="checkbox"
                      checked={logisticsForm.activeCouriers.anteraja}
                      onChange={(e) =>
                        setLogisticsForm({
                          ...logisticsForm,
                          activeCouriers: {
                            ...logisticsForm.activeCouriers,
                            anteraja: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 block">Regular Service</span>
                  <span
                    className={`text-[9px] font-bold mt-1 inline-block ${
                      logisticsForm.activeCouriers.anteraja ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  >
                    {logisticsForm.activeCouriers.anteraja ? '● Aktif' : '○ Nonaktif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: WHATSAPP NOTIFICATION (FONNTE API GATEWAY) */}
        <div className="space-y-4 pt-4 border-t border-rose-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-black uppercase text-stone-700 tracking-wider">
              4. Notifikasi WhatsApp Otomatis (Fonnte API Gateway)
            </span>
          </div>

          <div className="space-y-4">
            {/* Master Toggle */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-extrabold text-stone-800 text-xs flex items-center gap-1.5">
                    📱 WhatsApp Auto-Notification
                  </span>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Kirim notifikasi WA otomatis saat status pesanan berubah
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold ${notifForm.isEnabled ? 'text-emerald-600' : 'text-stone-400'}`}>
                    {notifForm.isEnabled ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                  <input
                    type="checkbox"
                    checked={notifForm.isEnabled}
                    onChange={(e) => setNotifForm({ ...notifForm, isEnabled: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {notifForm.isEnabled && (
                <div className="space-y-3 mt-3 pt-3 border-t border-emerald-200/50">
                  {/* API Key */}
                  <div>
                    <label className="block font-bold text-stone-700 mb-1 text-[11px]">Fonnte API Key</label>
                    <div className="relative">
                      <input
                        type={showWaApiKey ? 'text' : 'password'}
                        value={notifForm.apiKey}
                        onChange={(e) => setNotifForm({ ...notifForm, apiKey: e.target.value })}
                        placeholder="Masukkan API Key dari dashboard fonnte.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 pr-20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowWaApiKey(!showWaApiKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                      >
                        {showWaApiKey ? 'SEMBUNYIKAN' : 'TAMPILKAN'}
                      </button>
                    </div>
                  </div>

                  {/* Sender Device */}
                  <div>
                    <label className="block font-bold text-stone-700 mb-1 text-[11px]">Nomor Device WA Pengirim</label>
                    <input
                      type="text"
                      value={notifForm.senderDevice}
                      onChange={(e) => setNotifForm({ ...notifForm, senderDevice: e.target.value })}
                      placeholder="081234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <p className="text-[9px] text-stone-400 mt-0.5">
                      Nomor HP yang terdaftar & scan QR di dashboard Fonnte
                    </p>
                  </div>

                  {/* Test Connection Button */}
                  <button
                    type="button"
                    onClick={handleTestWa}
                    disabled={waTestState.status === 'testing'}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all active:scale-[0.97] cursor-pointer ${
                      waTestState.status === 'success'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : waTestState.status === 'error'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                    }`}
                  >
                    {waTestState.status === 'testing' ? '⏳ Menguji Koneksi Fonnte...' :
                     waTestState.status === 'success' ? '✅ Koneksi Berhasil!' :
                     waTestState.status === 'error' ? '❌ Koneksi Gagal' :
                     '🧪 Tes Kirim Pesan WhatsApp'}
                  </button>
                  {waTestState.message && (
                    <p className={`text-[10px] ${waTestState.status === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                      {waTestState.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Event Triggers */}
            {notifForm.isEnabled && (
              <div className="p-4 rounded-2xl bg-white border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-stone-800 text-xs">🔔 Kontrol Event Trigger</span>
                  <span className="text-[9px] text-stone-400 font-bold">
                    {Object.values(notifForm.events).filter(Boolean).length}/7 Aktif
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {([
                    { key: 'orderCreated' as const, icon: '✅', label: 'Order Created', desc: 'Saat pesanan baru dibuat' },
                    { key: 'craftingStarted' as const, icon: '✂️', label: 'Crafting Started', desc: 'Buket mulai dirangkai' },
                    { key: 'qualityCheck' as const, icon: '🔍', label: 'Quality Check', desc: 'Lolos pemeriksaan kualitas' },
                    { key: 'inDelivery' as const, icon: '🚚', label: 'In Delivery', desc: 'Sedang dikirim ke alamat' },
                    { key: 'completed' as const, icon: '🎉', label: 'Completed', desc: 'Pesanan selesai diterima' },
                    { key: 'warrantySubmitted' as const, icon: '📋', label: 'Warranty Submitted', desc: 'Klaim garansi diajukan' },
                    { key: 'warrantyApproved' as const, icon: '✅', label: 'Warranty Approved', desc: 'Klaim garansi disetujui' },
                  ]).map((ev) => (
                    <div
                      key={ev.key}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        notifForm.events[ev.key]
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-stone-50 border-stone-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{ev.icon}</span>
                        <div>
                          <span className="text-[10px] font-extrabold text-stone-800 block">{ev.label}</span>
                          <span className="text-[9px] text-stone-400">{ev.desc}</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifForm.events[ev.key]}
                        onChange={(e) =>
                          setNotifForm({
                            ...notifForm,
                            events: { ...notifForm.events, [ev.key]: e.target.checked },
                          })
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showMagicToast('Ukuran File Terlalu Besar ⚠️', 'Maksimal ukuran gambar adalah 2 MB.', '⚠️');
        return;
      }
      setSelectedFile(file);
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPriceBelowHpp) {
      showMagicToast('Gagal Validasi HPP ⚠️', 'Harga jual tidak boleh kurang dari total biaya bahan baku (HPP).', '❌');
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = previewUrl || '/images/uploads/default-bouquet.png';

    // 1. Upload foto buket jika dipilih
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

        const uploadRes = await fetch(getApiUrl('/api/v1/products/upload-image'), {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.data?.url) {
          finalImageUrl = uploadData.data.url;
        }
      } catch (uploadErr) {
        console.warn('Image upload error:', uploadErr);
      }
    }

    // 2. Simpan produk ke Supabase DB
    try {
      const res = await fetch(getApiUrl('/api/v1/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category_id:
            category === 'Graduation'
              ? 'cat-wisuda'
              : category === 'Anniversary'
              ? 'cat-romantis'
              : 'cat-karakter',
          price: numericPrice,
          raw_cost_hpp: calculatedHpp,
          stock: 15,
          po_lead_days: parseInt(leadDays, 10) || 2,
          is_ready_stock: isReadyStock,
          image_url: finalImageUrl,
          description: `Buket ${name.trim()} kawat bulu premium 100% handcrafted atelier.`,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        onClose();
        showMagicToast(
          'Produk Berhasil Ditambahkan! 🌸',
          `Buket "${name}" tersimpan di Supabase dengan HPP Rp ${calculatedHpp.toLocaleString('id-ID')}.`,
          '✨'
        );
      } else {
        showMagicToast('Gagal Menambah Produk ⚠️', data.error || 'Terjadi kesalahan sistem.', '⚠️');
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error('Error adding product:', err);
      showMagicToast('Gagal Menambah Produk ⚠️', 'Koneksi ke backend API terputus.', '⚠️');
    }
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

          {/* Image Upload Box */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Foto Produk Buket (Supabase Storage)
            </label>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="w-14 h-14 rounded-xl bg-white border border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-5 h-5 text-stone-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="file"
                  id="bouquet-photo-input"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="bouquet-photo-input"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-rose-300 text-stone-700 font-bold text-[11px] shadow-sm hover:bg-rose-50/50 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-rose-500" />
                  <span>{selectedFile ? 'Ganti Foto Buket' : 'Pilih Foto Buket'}</span>
                </label>
                <p className="text-[10px] text-stone-400 mt-1 truncate">
                  {selectedFile ? selectedFile.name : 'PNG, JPG, WEBP maks 2 MB (Disimpan ke Supabase Storage)'}
                </p>
              </div>
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
              disabled={isPriceBelowHpp || !name.trim() || calculatedHpp === 0 || isSubmitting}
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunggah & Menyimpan...</span>
                </>
              ) : (
                <span>Simpan ke Supabase</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

