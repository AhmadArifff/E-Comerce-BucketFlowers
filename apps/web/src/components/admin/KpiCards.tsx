'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';

export const KpiCards: React.FC = () => {
  const { orders } = useOrderStore();
  const [dashboardData, setDashboardData] = useState<{
    totalRevenue: number;
    totalHpp: number;
    netProfit: number;
    profitMargin: number;
    totalOrders: number;
    poSlotsRemaining: number;
    dailyLimit: number;
    avgRating: number;
    lowStockCount: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/v1/admin/dashboard')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.kpis) {
          setDashboardData(res.data.kpis);
        }
      })
      .catch((e) => console.warn('Could not load KPI from Supabase:', e));
  }, []);

  const activeOrdersCount = orders.filter((o) => o.currentStep < 4).length;

  const totalRev = dashboardData ? dashboardData.totalRevenue : 4850000;
  const netProf = dashboardData ? dashboardData.netProfit : 3250000;
  const margin = dashboardData ? dashboardData.profitMargin : 67.0;
  const poRemain = dashboardData ? dashboardData.poSlotsRemaining : 13;
  const poLimit = dashboardData ? dashboardData.dailyLimit : 25;
  const lowStock = dashboardData ? dashboardData.lowStockCount : 1;

  const cards = [
    {
      label: 'Omset Penjualan (Supabase)',
      value: `Rp ${totalRev.toLocaleString('id-ID')}`,
      subtext: `Laba Bersih Rp ${netProf.toLocaleString('id-ID')} (${margin}%)`,
      subtextPositive: true,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      label: 'Pesanan Aktif Diproses',
      value: `${activeOrdersCount} Pesanan`,
      subtext: `${dashboardData ? dashboardData.totalOrders : orders.length} Total Transaksi di Database`,
      subtextPositive: true,
      icon: ShoppingBag,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      label: 'Sisa Kuota PO Hari Ini',
      value: `${poRemain} / ${poLimit} Slot`,
      subtext: `${poRemain > 0 ? 'Kapasitas produksi aman' : 'Kuota harian penuh'}`,
      subtextPositive: poRemain > 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      label: 'Peringatan Stok Bahan Baku',
      value: `${lowStock} Bahan Menipis`,
      subtext: lowStock > 0 ? 'Perlu pengadaan segera' : 'Semua bahan aman tercukupi',
      subtextPositive: lowStock === 0,
      icon: AlertTriangle,
      color: 'bg-orange-50 text-orange-600 border-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-3xl p-5 border border-rose-100/80 shadow-xs flex items-start justify-between gap-3 hover:shadow-md transition-shadow"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-stone-500 block">{card.label}</span>
              <div className="text-xl font-black text-stone-800 tracking-tight">{card.value}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold">
                {card.subtextPositive ? (
                  <span className="text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {card.subtext}
                  </span>
                ) : (
                  <span className="text-amber-600">{card.subtext}</span>
                )}
              </div>
            </div>

            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border flex-shrink-0 ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
