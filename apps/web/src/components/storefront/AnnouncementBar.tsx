'use client';

import React from 'react';
import { Sparkles, Clock } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white text-xs py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center w-full sm:w-auto font-medium">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>
            🎓 <strong>Musim Wisuda 2026:</strong> Dapatkan Free Greeting Card & Selempang Custom untuk PO H-3!
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-semibold opacity-95">
          <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            <span>Sisa Kuota PO Hari Ini: <strong>8 / 20 Buket</strong></span>
          </div>
          <span>Bebas Ongkir COD UI & Margo City Radius 5 KM</span>
        </div>
      </div>
    </div>
  );
};
