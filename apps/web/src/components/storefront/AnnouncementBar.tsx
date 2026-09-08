'use client';

import React from 'react';
import { Sparkles, Clock } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';

export const AnnouncementBar: React.FC = () => {
  const { theme } = useThemeStore();

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
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>
            {theme === 'tema-b' ? (
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
            <span>Sisa Kuota Hari Ini: 8 / 20 Buket</span>
          </div>
          <span>Bebas Ongkir COD UI & Margo City</span>
        </div>
      </div>
    </div>
  );
};
