'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  Search,
  Zap,
  Info,
} from 'lucide-react';
import { MOCK_PRODUCTS, type ExtendedProduct as Product } from '@chenille/shared';
import { TableSortHeader, type SortDirection } from './TableSortHeader';

type Timeframe = '7_DAYS' | '30_DAYS';

interface CtrDataPoint {
  label: string;
  sublabel: string;
  impressions: number;
  clicks: number;
}

const DATA_7_DAYS: CtrDataPoint[] = [
  { label: 'Sen', sublabel: '1 Sep', impressions: 410, clicks: 78 },
  { label: 'Sel', sublabel: '2 Sep', impressions: 460, clicks: 88 },
  { label: 'Rab', sublabel: '3 Sep', impressions: 520, clicks: 96 },
  { label: 'Kam', sublabel: '4 Sep', impressions: 490, clicks: 84 },
  { label: 'Jum', sublabel: '5 Sep', impressions: 610, clicks: 118 },
  { label: 'Sab', sublabel: '6 Sep', impressions: 680, clicks: 132 },
  { label: 'Min', sublabel: '7 Sep (Hari Ini)', impressions: 380, clicks: 72 },
];

const DATA_30_DAYS: CtrDataPoint[] = [
  { label: 'Minggu 1', sublabel: '10 - 16 Ags', impressions: 3100, clicks: 540 },
  { label: 'Minggu 2', sublabel: '17 - 23 Ags', impressions: 3650, clicks: 680 },
  { label: 'Minggu 3', sublabel: '24 - 31 Ags (Wisuda UI)', impressions: 4800, clicks: 920 },
  { label: 'Minggu 4', sublabel: '1 - 7 Sep (Berjalan)', impressions: 3550, clicks: 648 },
];

// Product CTR evaluation criteria and recommendations
interface ProductCtrEvaluation {
  id: string;
  clicks7d: number;
  impressions7d: number;
  clicks30d: number;
  impressions30d: number;
  status: 'HIGH' | 'MEDIUM' | 'LOW';
  diagnosis: string;
  actionRecommendation: string;
}

const PRODUCT_CTR_EVALUATIONS: Record<string, Omit<ProductCtrEvaluation, 'id'>> = {
  'prod-01': {
    clicks7d: 132,
    impressions7d: 580,
    clicks30d: 540,
    impressions30d: 2450,
    status: 'HIGH',
    diagnosis: 'Kombinasi boneka toga wisuda & mawar kawat bulu burgundy sangat diminati audiens mahasiswa.',
    actionRecommendation: 'Pertahankan foto utama. Tingkatkan stok kawat bulu burgundy dan boneka toga.',
  },
  'prod-02': {
    clicks7d: 118,
    impressions7d: 560,
    clicks30d: 480,
    impressions30d: 2280,
    status: 'HIGH',
    diagnosis: 'Warna pastel pink & lilac frosting menghasilkan konversi klik tinggi untuk kado wisuda sahabat.',
    actionRecommendation: 'Buat bundling dengan kartu ucapan foil gold untuk mendongkrak average order value.',
  },
  'prod-03': {
    clicks7d: 84,
    impressions7d: 520,
    clicks30d: 360,
    impressions30d: 2200,
    status: 'MEDIUM',
    diagnosis: 'Buket sunflower kuning memiliki minat stabil, namun perlu variasi wrapping agar lebih cerah.',
    actionRecommendation: 'Coba ubah cellophane kraft ke cellophane putih transparan agar warna kuning kawat bulu lebih bersinar.',
  },
  'prod-04': {
    clicks7d: 68,
    impressions7d: 490,
    clicks30d: 290,
    impressions30d: 2050,
    status: 'MEDIUM',
    diagnosis: 'Minat kategori single stem cukup baik, namun sering dianggap kemahalan dibanding buket mini.',
    actionRecommendation: 'Tampilkan perbandingan ukuran di tangan model foto agar pembeli paham buketnya bervolume tebal.',
  },
  'prod-05': {
    clicks7d: 38,
    impressions7d: 450,
    clicks30d: 155,
    impressions30d: 1850,
    status: 'LOW',
    diagnosis: 'Foto produk Mini Pot Daisy terlalu jauh sehingga detail kawat bulu meja belajar tidak tampak jelas.',
    actionRecommendation: '⚠️ Revisi Foto & Konten: Ambil close-up pot di meja belajar ber-laptop. Ganti kombinasi warna pot kawat bulu.',
  },
  'prod-06': {
    clicks7d: 32,
    impressions7d: 470,
    clicks30d: 140,
    impressions30d: 1900,
    status: 'LOW',
    diagnosis: 'Cellophane gelap membuat bayangan pada kawat bulu mawar saat dilihat di layar handphone.',
    actionRecommendation: '⚠️ Revisi Hasil Rangkaian: Ganti wrapping ke warna pastel cerah atau tambahkan lampu LED fairy warm white.',
  },
};

export const ProductCtrAnalyticsCard: React.FC<{ onOpenBom?: (prod: Product) => void }> = ({ onOpenBom }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('7_DAYS');
  const [hoveredPoint, setHoveredPoint] = useState<CtrDataPoint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  type CtrSortField = 'name' | 'impressions' | 'clicks' | 'ctr' | 'status';
  const [sortField, setSortField] = useState<CtrSortField | null>('ctr');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: CtrSortField) => {
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

  const chartData = timeframe === '7_DAYS' ? DATA_7_DAYS : DATA_30_DAYS;

  // Aggregate stats
  const totalImpressions = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.impressions, 0);
  }, [chartData]);

  const totalClicks = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.clicks, 0);
  }, [chartData]);

  const averageCtr = useMemo(() => {
    if (totalImpressions === 0) return 0;
    return ((totalClicks / totalImpressions) * 100).toFixed(1);
  }, [totalClicks, totalImpressions]);

  // Product CTR rows with calculated metrics
  const evaluatedProducts = useMemo(() => {
    return MOCK_PRODUCTS.map((prod) => {
      const evalData = PRODUCT_CTR_EVALUATIONS[prod.id] || {
        clicks7d: 50,
        impressions7d: 400,
        clicks30d: 220,
        impressions30d: 1800,
        status: 'MEDIUM',
        diagnosis: 'Performa minat produk stabil.',
        actionRecommendation: 'Pertahankan kualitas rangkaian kawat bulu.',
      };

      const clicks = timeframe === '7_DAYS' ? evalData.clicks7d : evalData.clicks30d;
      const impressions = timeframe === '7_DAYS' ? evalData.impressions7d : evalData.impressions30d;
      const ctr = parseFloat(((clicks / impressions) * 100).toFixed(1));

      return {
        product: prod,
        clicks,
        impressions,
        ctr,
        status: evalData.status,
        diagnosis: evalData.diagnosis,
        actionRecommendation: evalData.actionRecommendation,
      };
    });
  }, [timeframe]);

  const filteredAndSortedProducts = useMemo(() => {
    const list = evaluatedProducts.filter((item) => {
      const matchName = item.product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchName && matchStatus;
    });

    if (!sortField || !sortDirection) return list;

    return [...list].sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      if (sortField === 'name') {
        valA = a.product.name;
        valB = b.product.name;
        const cmp = valA.localeCompare(valB, 'id');
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (sortField === 'impressions') {
        valA = a.impressions;
        valB = b.impressions;
      } else if (sortField === 'clicks') {
        valA = a.clicks;
        valB = b.clicks;
      } else if (sortField === 'ctr') {
        valA = a.ctr;
        valB = b.ctr;
      } else if (sortField === 'status') {
        const order = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        valA = order[a.status];
        valB = order[b.status];
      }

      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [evaluatedProducts, searchTerm, statusFilter, sortField, sortDirection]);

  // Low CTR count
  const lowCtrCount = useMemo(() => {
    return evaluatedProducts.filter((p) => p.status === 'LOW').length;
  }, [evaluatedProducts]);

  // Chart coordinate calculation
  const maxImpression = Math.max(...chartData.map((d) => d.impressions)) * 1.15;
  const maxClick = Math.max(...chartData.map((d) => d.clicks)) * 1.25;

  const width = 640;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  const pointsImpression = chartData.map((d, i) => {
    const x = paddingX + (i * (width - 2 * paddingX)) / (chartData.length - 1);
    const y = height - paddingY - (d.impressions / maxImpression) * (height - 2 * paddingY);
    return { x, y, data: d };
  });

  const pointsClicks = chartData.map((d, i) => {
    const x = paddingX + (i * (width - 2 * paddingX)) / (chartData.length - 1);
    const y = height - paddingY - (d.clicks / maxClick) * (height - 2 * paddingY);
    return { x, y, data: d };
  });

  const pathImpression = pointsImpression.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const pathClicks = pointsClicks.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Header & Timeframe Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shadow-2xs">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-800 tracking-tight flex items-center gap-2">
                <span>Analisis Minat Klik (CTR) & Evaluasi Pertumbuhan Produk</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Growth Engine
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Ukur performa tayang vs klik setiap buket, deteksi produk yang perlu perbaikan konten foto atau desain rangkaian bunga.
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setTimeframe('7_DAYS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              timeframe === '7_DAYS'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7 Hari Terakhir</span>
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('30_DAYS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              timeframe === '30_DAYS'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>30 Hari (1 Bulan Terakhir)</span>
          </button>
        </div>
      </div>

      {/* 4 Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tayang */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Total Tayang Katalog
            </span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-stone-800 tracking-tight">
            {totalImpressions.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{timeframe === '7_DAYS' ? '+14.2% vs pekan lalu' : '+22.8% vs bulan lalu'}</span>
          </div>
        </div>

        {/* Card 2: Total Klik */}
        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
              Total Klik Buket
            </span>
            <MousePointerClick className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 tracking-tight">
            {totalClicks.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Minat Tinggi Pembeli Toko</span>
          </div>
        </div>

        {/* Card 3: Rata-Rata CTR */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              Rata-rata CTR Toko
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 tracking-tight">
            {averageCtr}%
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">
            Standar Industri E-Commerce: &gt;10%
          </div>
        </div>

        {/* Card 4: Action Status */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
              Evaluasi Rangkaian & Konten
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800 tracking-tight">
            {lowCtrCount} Buket
          </div>
          <div className="text-[11px] text-amber-700 font-bold">
            Perlu Revisi Foto & Desain Bahan
          </div>
        </div>
      </div>

      {/* SVG Multi-Line Chart */}
      <div className="p-5 rounded-3xl bg-stone-50/70 border border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-black text-stone-800 tracking-tight flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
              <span>
                Grafik Tren Minat Klik ({timeframe === '7_DAYS' ? '7 Hari Terakhir' : '1 Bulan Terakhir'})
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Arahkan kursor ke titik grafik untuk melihat rincian tayang dan klik per waktu.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
              <span className="w-3 h-1 bg-blue-500 rounded-full inline-block" />
              <span>Tayangan (Impressions)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
              <span className="w-3 h-1 bg-rose-500 rounded-full inline-block" />
              <span>Klik Buket (Clicks)</span>
            </div>
          </div>
        </div>

        {/* Hovered Point Info Pill */}
        {hoveredPoint && (
          <div className="p-2.5 rounded-xl bg-stone-900 text-white text-xs font-mono flex items-center justify-between animate-in fade-in">
            <span className="font-bold">
              🗓️ {hoveredPoint.label} ({hoveredPoint.sublabel})
            </span>
            <div className="flex items-center gap-3">
              <span className="text-blue-300">
                Tayangan: <strong>{hoveredPoint.impressions}</strong>
              </span>
              <span className="text-rose-300">
                Klik: <strong>{hoveredPoint.clicks}</strong>
              </span>
              <span className="text-emerald-300">
                CTR:{' '}
                <strong>
                  {((hoveredPoint.clicks / hoveredPoint.impressions) * 100).toFixed(1)}%
                </strong>
              </span>
            </div>
          </div>
        )}

        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height + 25}`}
            className="w-full h-40 sm:h-52 overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Horizontal Grid lines */}
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Line 1: Impressions Path (Blue) */}
            <path d={pathImpression} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />

            {/* Line 2: Clicks Path (Rose) */}
            <path d={pathClicks} fill="none" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />

            {/* Data Points */}
            {pointsImpression.map((pt, idx) => (
              <g key={`imp-${idx}`}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#3B82F6"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="cursor-pointer hover:scale-150 transition-transform"
                  onMouseEnter={() => setHoveredPoint(pt.data)}
                />
              </g>
            ))}

            {pointsClicks.map((pt, idx) => (
              <g key={`clk-${idx}`}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#F43F5E"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:scale-150 transition-transform"
                  onMouseEnter={() => setHoveredPoint(pt.data)}
                />
                <text
                  x={pt.x}
                  y={height + 15}
                  fontSize="10"
                  fontWeight="700"
                  fill="#64748B"
                  textAnchor="middle"
                >
                  {pt.data.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Actionable Product CTR Breakdown Table & Growth Insights */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <span>Evaluasi Minat Tiap Buket & Rekomendasi Modifikasi Rangkaian</span>
              <span className="text-[10px] font-bold text-stone-500 font-sans">
                ({filteredAndSortedProducts.length} Produk)
              </span>
            </h4>
            <p className="text-[11px] text-stone-500">
              Gunakan data CTR ini untuk mengubah sudut foto, deskripsi momen, atau mengganti warna kertas &amp; bahan kawat bulu agar produk bertumbuh cepat.
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3 h-3 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari buket..."
                className="pl-7 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 w-36 sm:w-44 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-xl border border-stone-200 text-[11px]">
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-rose-600 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {st === 'ALL' ? 'Semua' : st === 'HIGH' ? '⭐ Bintang' : st === 'MEDIUM' ? '📈 Stabil' : '⚠️ Perlu Revisi'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto border border-stone-200 rounded-2xl">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <TableSortHeader
                  label="Buket Produk"
                  field="name"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="min-w-[240px]"
                />
                <TableSortHeader
                  label="Tayang"
                  field="impressions"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="w-24"
                />
                <TableSortHeader
                  label="Klik"
                  field="clicks"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="w-20"
                />
                <TableSortHeader
                  label="CTR Rate"
                  field="ctr"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="w-28"
                />
                <TableSortHeader
                  label="Status Evaluasi"
                  field="status"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="w-32"
                />
                <th className="py-3 px-4 min-w-[280px]">Diagnosis Masalah &amp; Rekomendasi Pertumbuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredAndSortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    Tidak ada buket yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredAndSortedProducts.map((item) => {
                  const prod = item.product;
                  const isHigh = item.status === 'HIGH';
                  const isLow = item.status === 'LOW';

                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-rose-50/20 transition-colors ${
                        isLow ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Product Name & Thumb */}
                      <td className="py-3.5 px-4 min-w-[240px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-extrabold text-stone-800 text-xs leading-snug truncate max-w-[200px]">
                              {prod.name}
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono">
                              ID: {prod.id} • {prod.category}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Impressions */}
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-600 whitespace-nowrap">
                        {item.impressions.toLocaleString('id-ID')}
                      </td>

                      {/* Clicks */}
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-600 whitespace-nowrap">
                        {item.clicks.toLocaleString('id-ID')}
                      </td>

                      {/* CTR Rate with visual progress bar */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-mono font-black text-xs ${
                                isHigh
                                  ? 'text-emerald-600'
                                  : isLow
                                  ? 'text-rose-600'
                                  : 'text-amber-600'
                              }`}
                            >
                              {item.ctr}%
                            </span>
                            <span className="text-[9px] text-stone-400">CTR</span>
                          </div>
                          <div className="w-16 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isHigh
                                  ? 'bg-emerald-500'
                                  : isLow
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(item.ctr * 4, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isHigh ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ⭐ Bintang
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                            ⚠️ Perlu Revisi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                            📈 Stabil
                          </span>
                        )}
                      </td>

                      {/* Actionable Diagnosis & Recommendation */}
                      <td className="py-3.5 px-4 min-w-[280px]">
                        <div className="space-y-1 text-[11px]">
                          <div className="text-stone-700 font-medium leading-relaxed">
                            <span className="font-bold text-stone-900">Diagnosis:</span>{' '}
                            {item.diagnosis}
                          </div>
                          <div
                            className={`p-2 rounded-xl text-[10px] font-bold ${
                              isLow
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : isHigh
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-stone-50 text-stone-700 border border-stone-200'
                            }`}
                          >
                            💡 <strong>Solusi Pertumbuhan:</strong> {item.actionRecommendation}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
