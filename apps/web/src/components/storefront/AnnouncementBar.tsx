'use client';

import React from 'react';
import { Sparkles, Clock } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';

export const AnnouncementBar: React.FC = () => {
  const { theme } = useThemeStore();

  const getBarStyle = () => {
    if (theme === 'tema-b') {
      return {
        background: 'linear-gradient(90deg, #1C0D18, #45152F, #1C0D18)',
        color: '#FDF4E3',
        className: 'animate-gradient-move border-b border-[#4A203E]/50',
      };
    }
    if (theme === 'tema-c') {
      return {
        background: 'linear-gradient(90deg, #FFB7B2, #FFEAA7, #B4F8C8, #A0E7E5, #FFB7B2)',
        color: '#2C3E50',
        className: 'animate-rainbow-move border-b border-orange-200/60',
      };
    }
    // Default / Tema A
    return {
      background: 'linear-gradient(90deg, #F4A7B9, #FCEADE, #F4A7B9)',
      color: '#722332',
      className: 'animate-gradient-move border-b border-rose-200/60',
    };
  };

  const bar = getBarStyle();

  return (
    <div
      style={{ background: bar.background, color: bar.color }}
      className={`text-xs py-2 px-4 shadow-2xs font-semibold ${bar.className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center w-full sm:w-auto font-bold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>
            🎓 <strong>Musim Wisuda 2026:</strong> Dapatkan Free Greeting Card & Selempang Custom untuk PO H-3!
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-bold opacity-95">
          <div className="flex items-center gap-1.5 bg-white/30 px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-2xs">
            <Clock className="w-3 h-3" />
            <span>Sisa Kuota PO Hari Ini: <strong>8 / 20 Buket</strong></span>
          </div>
          <span>Bebas Ongkir COD UI & Margo City Radius 5 KM</span>
        </div>
      </div>
    </div>
  );
};
