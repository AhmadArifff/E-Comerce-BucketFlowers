'use client';

import React from 'react';
import { DollarSign, ShoppingBag, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';

export const KpiCards: React.FC = () => {
  const { orders } = useOrderStore();
  const activeOrdersCount = orders.filter((o) => o.currentStep < 4).length;

  const cards = [
    {
      label: 'Omset Kotor Bulan Ini',
      value: 'Rp 4.850.000',
      subtext: '+18.4% vs bulan lalu',
      subtextPositive: true,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      label: 'Pesanan Sedang Diproses',
      value: `${activeOrdersCount} Pesanan`,
      subtext: 'Proses perangkaian aktif',
      subtextPositive: true,
      icon: ShoppingBag,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      label: 'Kuota PO Hari Ini',
      value: '12 / 20 Buket',
      subtext: 'Sisa 8 slot (Throttling Aktif)',
      subtextPositive: true,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      label: 'Peringatan Bahan Menipis',
      value: 'Kawat Bulu Pink',
      subtext: 'Sisa 140 batang (Segera Restock)',
      subtextPositive: false,
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
