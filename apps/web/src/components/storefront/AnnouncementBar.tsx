'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Truck } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { getApiUrl } from '@/lib/api-client';

export const AnnouncementBar: React.FC = () => {
  const { theme } = useThemeStore();
  const [campaign, setCampaign] = useState<{
    cod_promo_enabled?: boolean;
    cod_promo_banner_text?: string;
    cod_max_radius_km?: number;
  } | null>(null);

  const [quota, setQuota] = useState<{
    orders_today?: number;
    daily_limit?: number;
    remaining_slots?: number;
  }>({
    orders_today: 12,
    daily_limit: 20,
    remaining_slots: 8,
  });

  useEffect(() => {
    // 1. Fetch live campaign settings
    fetch(getApiUrl('/api/v1/campaigns'))
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setCampaign(res.data);
        }
      })
      .catch(() => {});

    // 2. Fetch live daily quota throttling
    fetch(getApiUrl('/api/v1/orders/quota-status'))
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setQuota(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const getBarStyle = () => {
    if (theme === 'tema-b') {
      return {
        background: '#6B2D5C',
        color: '#FDF9F0',
        className: 'border-b border-[#D4AF37] tracking-[2px] uppercase text-[11px] font-semibold',
        accentColor: '#D4AF37',
        badgeClass: 'bg-black/30 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider',
      };
    }
    if (theme === 'tema-c') {
      return {
        background: 'linear-gradient(90deg, #FFB7B2, #FFEAA7, #B4F8C8, #A0E7E5, #FFB7B2)',
        color: '#2C3E50',
        className: 'animate-rainbow-move border-b border-[#FFD4DB] font-extrabold text-xs sm:text-[13px]',
        accentColor: '#FF6B81',
        badgeClass: 'bg-white text-[#FF6B81] px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-xs',
      };
    }
    // Default / Tema A
    return {
      background: 'linear-gradient(90deg, #F4A7B9, #FCEADE, #F4A7B9)',
      color: '#722332',
      className: 'animate-gradient-move border-b border-[#F7D1D9] font-bold text-xs sm:text-[13px]',
      accentColor: '#9C3D52',
      badgeClass: 'bg-white/80 text-[#722332] px-2 py-0.5 rounded-md text-[11px] font-extrabold tracking-wide',
    };
  };

  const bar = getBarStyle();

  return (
    <div
      style={{ background: bar.background, color: bar.color }}
      className={`py-2 px-4 shadow-2xs transition-colors duration-300 ${bar.className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center w-full sm:w-auto">
          {campaign?.cod_promo_enabled ? (
            <Truck className="w-3.5 h-3.5 animate-pulse shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
          )}
          <span className="truncate max-w-xl">
            {campaign?.cod_promo_enabled && campaign.cod_promo_banner_text ? (
              <strong>{campaign.cod_promo_banner_text}</strong>
            ) : theme === 'tema-b' ? (
              <>
                ✦ <strong>Musim Wisuda 2026:</strong> Free Greeting Card Emas & Selempang Nama
              </>
            ) : theme === 'tema-c' ? (
              <>
                🎉 <strong>Spesial Wisuda Depok:</strong> Free Kartu Ucapan & Pita Custom! 🎀
              </>
            ) : (
              <>
                🌸 <strong>Musim Wisuda 2026:</strong> Free Greeting Card & Selempang Custom PO H-3!
              </>
            )}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-bold">
          <div className={bar.badgeClass}>
            <Clock className="w-3 h-3 inline mr-1" />
            <span>Sisa Kuota Hari Ini: {quota.remaining_slots ?? 8} / {quota.daily_limit ?? 20} Buket</span>
          </div>
          <span>Bebas Ongkir COD Radius {campaign?.cod_max_radius_km ?? 5} KM UI</span>
        </div>
      </div>
    </div>
  );
};

