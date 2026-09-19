'use client';

import React from 'react';
import { Sparkles, MessageCircle, Lock, Flower2 } from 'lucide-react';
import Link from 'next/link';

interface MaintenanceOverlayProps {
  title?: string;
  desc?: string;
  waNumber?: string;
}

export const MaintenanceOverlay: React.FC<MaintenanceOverlayProps> = ({
  title = 'Atelier Chenille Sedang Istirahat Produksi 🌸',
  desc = 'Kapasitas buket wisuda hari ini telah penuh demi menjaga kualitas kerapian terbaik. Pemesanan akan dibuka kembali segera.',
  waNumber = '+62 812-9831-7721',
}) => {
  const cleanPhone = waNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Halo Atelier Chenille, saya ingin menanyakan ketersediaan slot buket untuk hari ini.'
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all duration-500 animate-in fade-in">
      <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-10 text-center shadow-2xl border border-rose-100/80 space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-400">
        
        {/* TOP ACCENT GRADIENT */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400" />

        {/* FLOWER ANIMATION ICON */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-50 border-2 border-rose-200/80 flex items-center justify-center text-rose-500 shadow-md relative">
          <Flower2 className="w-10 h-10 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-stone-900 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* HEADINGS */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-wider">
            <span>⚠️ Mode Pemeliharaan Aktif</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-snug">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
            {desc}
          </p>
        </div>

        {/* INFO NOTICE */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-left space-y-1.5 text-xs text-stone-600">
          <div className="font-bold text-stone-800 flex items-center gap-2">
            <span>✨ Butuh Buket Darurat?</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-500">
            Pengrajin kami masih melayani konsultasi khusus untuk buket wisuda mendesak melalui layanan hotline WhatsApp resmi.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-2.5 pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-[#25D366]/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hubungi WhatsApp Resmi Florist</span>
          </a>

          <Link
            href="/admin"
            className="w-full py-2.5 px-4 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Masuk Area Pengrajin (Admin Bypass)</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
