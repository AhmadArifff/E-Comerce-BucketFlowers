'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { MOCK_PRODUCTS, type ExtendedProduct as Product } from '@chenille/shared';
import { useThemeStore, type ThemeId } from '@/stores/useThemeStore';
import { showMagicToast } from '@/lib/magic-motion';

// ============================================================================
// 1. FINANCIAL MULTI-LINE SVG CHART CARD
// ============================================================================
export const FinancialChartCard: React.FC = () => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const handleExportExcel = () => {
    showMagicToast('Laporan Diunduh 📊', 'Berkas Laporan_Finansial_September_2026.xlsx telah di-generate.', '📥');
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-stone-800 font-extrabold text-sm sm:text-base tracking-tight">
            <TrendingUp className="w-4 h-4 text-rose-600" />
            <span>Grafik Finansial: Omzet vs HPP vs Laba Bersih</span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Evaluasi 4 minggu pergerakan omzet, modal bahan kawat bulu, dan profit bersih September 2026.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Omzet</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>HPP</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Laba Bersih</span>
          </div>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all shadow-2xs cursor-pointer ml-auto sm:ml-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Excel</span>
          </button>
        </div>
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
          <text x="32" y="34" fontSize="10" fill="#94A3B8" textAnchor="end">Rp 3.0M</text>
          <text x="32" y="84" fontSize="10" fill="#94A3B8" textAnchor="end">Rp 2.0M</text>
          <text x="32" y="134" fontSize="10" fill="#94A3B8" textAnchor="end">Rp 1.0M</text>
          <text x="32" y="184" fontSize="10" fill="#94A3B8" textAnchor="end">Rp 0</text>

          {/* Area fill under Laba Bersih */}
          <polygon points="100,180 100,131 280,108 460,95 640,130 640,180" fill="url(#gradLabaAdmin)" />

          {/* Omzet Path (Pink/Rose) */}
          <path d="M 100 97.5 Q 190 77.5 280 57.5 T 460 32.5 T 640 95" fill="none" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />

          {/* HPP Path (Amber Dashed) */}
          <path d="M 100 146 Q 190 137.5 280 129 T 460 117.5 T 640 145" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />

          {/* Laba Bersih Path (Emerald) */}
          <path d="M 100 131.5 Q 190 120 280 108.5 T 460 95 T 640 130" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

          {/* Week 1 Points */}
          <circle cx="100" cy="97.5" r="5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all" />
          <circle cx="100" cy="146" r="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" className="cursor-pointer" />
          <circle cx="100" cy="131.5" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all" />

          {/* Week 2 Points */}
          <circle cx="280" cy="57.5" r="5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all" />
          <circle cx="280" cy="129" r="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" className="cursor-pointer" />
          <circle cx="280" cy="108.5" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all" />

          {/* Week 3 Points (Peak Wisuda) */}
          <circle cx="460" cy="32.5" r="6" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2.5" className="cursor-pointer hover:r-8 transition-all" />
          <circle cx="460" cy="117.5" r="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" className="cursor-pointer" />
          <circle cx="460" cy="95" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" className="cursor-pointer hover:r-8 transition-all" />

          {/* Week 4 Points */}
          <circle cx="640" cy="95" r="5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all" />
          <circle cx="640" cy="145" r="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" className="cursor-pointer" />
          <circle cx="640" cy="130" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all" />

          {/* X Axis Labels */}
          <text x="100" y="205" fontSize="11" fontWeight="700" fill="#64748B" textAnchor="middle">Minggu 1</text>
          <text x="280" y="205" fontSize="11" fontWeight="700" fill="#64748B" textAnchor="middle">Minggu 2</text>
          <text x="460" y="205" fontSize="11" fontWeight="700" fill="#64748B" textAnchor="middle">Minggu 3 (Puncak Wisuda)</text>
          <text x="640" y="205" fontSize="11" fontWeight="700" fill="#64748B" textAnchor="middle">Minggu 4 (Berjalan)</text>
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
  const handleDownload = (format: string) => {
    showMagicToast(`Laporan ${format} Siap! 📈`, `File Laporan_Atelier_2026.${format.toLowerCase()} berhasil diekspor.`, '📄');
  };

  const reportsData = [
    { period: 'September 2026 (Berjalan)', orders: 58, omzet: 'Rp 8.750.000', hpp: 'Rp 3.650.000', net: 'Rp 5.100.000', margin: '58.2%' },
    { period: 'Agustus 2026', orders: 74, omzet: 'Rp 11.200.000', hpp: 'Rp 4.700.000', net: 'Rp 6.500.000', margin: '58.0%' },
    { period: 'Juli 2026', orders: 62, omzet: 'Rp 9.400.000', hpp: 'Rp 3.950.000', net: 'Rp 5.450.000', margin: '57.9%' },
    { period: 'Juni 2026 (Wisuda Raya)', orders: 95, omzet: 'Rp 14.800.000', hpp: 'Rp 6.100.000', net: 'Rp 8.700.000', margin: '58.7%' },
  ];

  return (
    <div className="space-y-6 admin-view-fade">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-xs">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Omzet YTD</div>
          <div className="text-xl font-black text-stone-800 mt-1">Rp 44.150.000</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">↑ 24.8% YoY</div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-xs">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total HPP Bahan Baku</div>
          <div className="text-xl font-black text-stone-800 mt-1">Rp 18.400.000</div>
          <div className="text-[11px] text-stone-400 font-medium mt-0.5">Rata-rata 41.7% Omzet</div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-xs">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Biaya Packing & Logistik</div>
          <div className="text-xl font-black text-stone-800 mt-1">Rp 2.150.000</div>
          <div className="text-[11px] text-stone-400 font-medium mt-0.5">Box Corrugated & Bubble</div>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Laba Bersih Bersih Toko</div>
          <div className="text-xl font-black text-emerald-700 mt-1">Rp 23.600.000</div>
          <div className="text-[11px] text-emerald-700 font-extrabold mt-0.5">Margin Rata-rata 53.4%</div>
        </div>
      </div>

      {/* Reports Table & Export Actions */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-stone-800 tracking-tight">
              Rekapitulasi Penjualan & Margin Bulanan
            </h2>
            <p className="text-xs text-stone-500">
              Data konsolidasi pesanan lunas, potongan biaya produksi, dan laba operasional studio.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => handleDownload('CSV')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={() => handleDownload('XLSX')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
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
                <th className="py-3 px-4">Periode Bulan</th>
                <th className="py-3 px-4">Jumlah Pesanan</th>
                <th className="py-3 px-4">Omzet Bruto</th>
                <th className="py-3 px-4">Total HPP</th>
                <th className="py-3 px-4">Laba Bersih</th>
                <th className="py-3 px-4">Margin (%)</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reportsData.map((row, idx) => (
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
              ))}
            </tbody>
          </table>
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

  const filtered = MOCK_PRODUCTS.filter((prod) => {
    const matchName = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCat === 'ALL' || prod.category === selectedCat;
    return matchName && matchCat;
  });

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-6 admin-view-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div>
          <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
            Katalog Produk & Minat Klik Pengunjung (CTR)
          </h2>
          <p className="text-xs text-stone-500">
            Pantau metrik buket yang paling banyak dilihat calon pembeli dan kelola kuota PO per varian.
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

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama buket..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all font-mono"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {['ALL', 'Single Stem', 'Graduation', 'Anniversary', 'Mini Bloom'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === cat
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-rose-50'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table with CTR */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-600">
          <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
            <tr>
              <th className="py-3 px-4">Buket Produk</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">HPP (Modal)</th>
              <th className="py-3 px-4">Harga Jual</th>
              <th className="py-3 px-4">Margin</th>
              <th className="py-3 px-4">Klik Etalase (CTR)</th>
              <th className="py-3 px-4">Status Produksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((prod, idx) => {
              const price = prod.discountPrice ?? prod.price;
              const profit = price - prod.rawCostHpp;
              const margin = Math.round((profit / price) * 100);
              const mockClicks = [430, 312, 280, 195, 140, 95][idx % 6];
              const mockCtr = ((mockClicks / 1280) * 100).toFixed(1);

              return (
                <tr key={prod.id} className="hover:bg-rose-50/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-11 h-11 rounded-xl object-cover border border-rose-100"
                      />
                      <div>
                        <div className="font-extrabold text-stone-800">{prod.name}</div>
                        <span className="text-[10px] text-stone-400">ID: {prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-600">
                    Rp {prod.rawCostHpp.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 font-black text-rose-600">
                    Rp {price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-full text-[10px]">
                      +{margin}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-extrabold text-stone-800">
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>{mockClicks} klik</span>
                      <span className="text-[10px] text-stone-400 font-semibold">({mockCtr}%)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {prod.isReadyStock ? (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                        Ready Stock ({prod.stock})
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
    </div>
  );
};

// ============================================================================
// 5. PROMOS & COUPONS VIEW
// ============================================================================
export const PromosView: React.FC = () => {
  const [coupons, setCoupons] = useState([
    { code: 'WISUDAHEMAT', discount: 'Diskon Rp 25.000', minSpend: 'Min. Belanja Rp 150.000', used: 14, quota: 50, active: true, expiry: '30 Sep 2026' },
    { code: 'LOVECHENILLE', discount: 'Diskon 10%', minSpend: 'Tanpa Minimum', used: 28, quota: 100, active: true, expiry: '15 Okt 2026' },
    { code: 'GRATISONGKIR5K', discount: 'Gratis Ongkir Rp 10.000', minSpend: 'Min. Belanja Rp 100.000', used: 42, quota: 60, active: true, expiry: '05 Okt 2026' },
    { code: 'MEMBERGOLD15', discount: 'Diskon Eksklusif 15%', minSpend: 'Khusus Member Gold', used: 8, quota: 20, active: false, expiry: '31 Des 2026' },
  ]);

  const toggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
    showMagicToast('Status Kupon Diperbarui! 🏷️', `Kupon ${code} telah diubah statusnya.`, '✅');
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-6 admin-view-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-stone-800 tracking-tight">
            Pemasaran & Manajemen Kupon Diskon
          </h2>
          <p className="text-xs text-stone-500">
            Dorong konversi pesanan dengan voucher potongan belanja dan voucher gratis ongkos kirim.
          </p>
        </div>

        <button
          onClick={() => showMagicToast('Fitur Buat Kupon', 'Form kupon baru siap digunakan.', '✨')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Kupon Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className={`p-5 rounded-2xl border transition-all ${
              coupon.active
                ? 'bg-white border-rose-200 shadow-sm'
                : 'bg-stone-50/70 border-stone-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-rose-600" />
                <span className="font-mono font-black text-sm tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                  {coupon.code}
                </span>
              </div>

              <button
                onClick={() => toggleCoupon(coupon.code)}
                className={`text-xs font-extrabold px-3 py-1 rounded-full cursor-pointer transition-all ${
                  coupon.active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {coupon.active ? 'Aktif' : 'Nonaktif'}
              </button>
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
                <span>{coupon.used} / {coupon.quota} ({Math.round((coupon.used / coupon.quota) * 100)}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                  style={{ width: `${(coupon.used / coupon.quota) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 6. MAINTENANCE & THEME SELECTOR VIEW
// ============================================================================
export const MaintenanceThemeView: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

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

      {/* 2. THEME SELECTION CARDS */}
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
  const [storeName, setStoreName] = useState('Chenille Atelier Depok');
  const [tagline, setTagline] = useState('Buket Bunga Kawat Bulu Chenille Premium & Graduation Florist');
  const [waNumber, setWaNumber] = useState('+62 812-9928-1192');
  const [studioAddress, setStudioAddress] = useState('Jl. Margonda Raya No. 120, Beji, Kota Depok, Jawa Barat 16424');
  const [dailyQuota, setDailyQuota] = useState('25');
  const [midtransId, setMidtransId] = useState('G-10293847-CHENILLE');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showMagicToast('Pengaturan Tersimpan! ⚙️', 'Konfigurasi atelier dan pembayaran Midtrans berhasil diperbarui.', '💾');
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-6 admin-view-fade">
      <div className="pb-4 border-b border-rose-100">
        <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
          Pengaturan Atelier & Kredensial Bisnis
        </h2>
        <p className="text-xs text-stone-500">
          Kelola profil toko resmi, nomor kontak CS, batasan kuota pesanan harian, dan integrasi payment gateway.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Profile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Nama Studio Atelier</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Nomor WhatsApp CS Resmi</label>
            <input
              type="text"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">Tagline Toko</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">Alamat Fisik Studio / Workshop</label>
          <textarea
            rows={2}
            value={studioAddress}
            onChange={(e) => setStudioAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
          />
        </div>

        {/* Quota & Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-100">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Kapasitas Slot PO Harian (Buket/Hari)</label>
            <input
              type="number"
              value={dailyQuota}
              onChange={(e) => setDailyQuota(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Sistem akan otomatis menutup checkout PO jika kuota harian tercapai.
            </span>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Merchant ID Midtrans Snap QRIS</label>
            <input
              type="text"
              value={midtransId}
              onChange={(e) => setMidtransId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Koneksi verifikasi otomatis QRIS Nasional & GoPay.
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
          >
            Simpan Pengaturan
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
  const [hpp, setHpp] = useState('45000');
  const [leadDays, setLeadDays] = useState('2');
  const [isReadyStock, setIsReadyStock] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    showMagicToast('Produk Ditambahkan! 🌸', `Buket "${name || 'Buket Baru'}" berhasil didaftarkan ke katalog atelier.`, '✨');
  };

  const calculatedProfit = (parseInt(price) || 0) - (parseInt(hpp) || 0);
  const calculatedMargin = parseInt(price) > 0 ? Math.round((calculatedProfit / parseInt(price)) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-stone-800 text-sm">Tambah Buket Bunga Kawat Bulu Baru</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Nama Buket</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sunflower Sunshine Graduation Bouquet"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Biaya Pokok / HPP (Rp)</label>
              <input
                type="number"
                required
                value={hpp}
                onChange={(e) => setHpp(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Harga Jual Konsumen (Rp)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
              />
            </div>
          </div>

          {/* Margin Preview Card */}
          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 flex items-center justify-between">
            <span className="text-stone-600 font-bold">Proyeksi Laba Bersih:</span>
            <div className="text-right">
              <span className="font-extrabold text-emerald-700 text-sm">
                +Rp {calculatedProfit.toLocaleString('id-ID')}
              </span>
              <span className="ml-1.5 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {calculatedMargin}% Margin
              </span>
            </div>
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
              Simpan ke Katalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

