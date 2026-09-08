'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Award, CheckCircle2, PackageCheck, MapPin, RefreshCw } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';

interface HeroSectionProps {
  onNavigate?: (section: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { theme } = useThemeStore();

  const handleAction = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (theme === 'tema-b') {
    // Modern Romantic & Editorial Luxury Theme
    return (
      <section id="home" className="relative overflow-hidden bg-[#FAFAFA] text-[#1E1919] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E8E0DA]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          {/* EDITORIAL HERO BANNER WITH GOLD INNER FRAME */}
          <div className="bg-white border border-[#E8E0DA] rounded-[10px] p-6 sm:p-12 shadow-[0_12px_32px_rgba(107,45,92,0.08)] relative overflow-hidden after:content-[''] after:absolute after:inset-2 sm:after:inset-3 after:border after:border-[#D4AF37]/30 after:rounded-[6px] after:pointer-events-none">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[2.5px] text-[#C98A90] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>✦ Exclusive Handcrafted Atelier Privé</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-bold font-heading-b tracking-tight leading-tight text-[#6B2D5C]">
                  Buket Bunga Kawat Bulu <span className="italic text-[#C98A90]">Kemewahan Abadi</span>
                </h1>

                <p className="text-sm sm:text-base text-[#6E6868] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Mahakarya kawat bulu beludru deep wine velvet & champagne gold. Dirangkai presisi untuk perayaan wisuda prestisius, lamaran, dan hari jadi pernikahan penuh cinta.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleAction('katalog')}
                    className="btn-primary-atelier px-7 py-3.5 rounded-[6px] text-xs font-bold tracking-[1.5px] uppercase cursor-pointer shadow-md active:scale-95"
                  >
                    <span>Lihat Koleksi Mewah 🌹</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('custom')}
                    className="px-6 py-3 rounded-[6px] border border-[#6B2D5C] text-[#6B2D5C] hover:bg-[#6B2D5C] hover:text-white transition-all text-xs font-bold tracking-[1px] uppercase cursor-pointer active:scale-95"
                  >
                    Rangkai Custom Atelier ✨
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-[8px] overflow-hidden shadow-xl border border-[#E8D399] group">
                  <img
                    src="/preview-tema-b.jpg"
                    alt="Modern Romantic Velvet Bouquet Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-5 sm:p-6">
                    <div className="text-left w-full flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-black/60 px-3 py-1 rounded-[4px] border border-[#D4AF37]/50 inline-block">
                          ✦ 100% Velvet Chenille Stem
                        </span>
                        <div className="text-base sm:text-lg font-bold text-white mt-1">Midnight Velvet & Champagne Gold</div>
                        <div className="text-xs text-[#C98A90]">Tahan Selamanya Tanpa Perlu Disiram</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 EDITORIAL VALUE CARDS (CLEAN WHITE) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-5 rounded-[8px] bg-white border border-[#E8E0DA] space-y-1.5 text-center shadow-[0_4px_16px_rgba(107,45,92,0.06)] hover:border-[#D4AF37] transition-all cursor-default">
              <div className="text-2xl">🌹</div>
              <div className="text-xs font-bold text-[#6B2D5C] uppercase tracking-wider">Awet Selamanya</div>
              <div className="text-[11px] text-[#6E6868] leading-tight">Kawat bulu premium anti-rontok & tak pernah layu</div>
            </div>
            <div className="p-5 rounded-[8px] bg-white border border-[#E8E0DA] space-y-1.5 text-center shadow-[0_4px_16px_rgba(107,45,92,0.06)] hover:border-[#D4AF37] transition-all cursor-default">
              <div className="text-2xl">📦</div>
              <div className="text-xs font-bold text-[#6B2D5C] uppercase tracking-wider">Rigid Hardbox</div>
              <div className="text-[11px] text-[#6E6868] leading-tight">Packaging kokoh mewah tahan benturan ekspedisi</div>
            </div>
            <div className="p-5 rounded-[8px] bg-white border border-[#E8E0DA] space-y-1.5 text-center shadow-[0_4px_16px_rgba(107,45,92,0.06)] hover:border-[#D4AF37] transition-all cursor-default">
              <div className="text-2xl">🤝</div>
              <div className="text-xs font-bold text-[#6B2D5C] uppercase tracking-wider">COD Eksklusif</div>
              <div className="text-[11px] text-[#6E6868] leading-tight">Janji temu langsung di kampus UI & Margo City</div>
            </div>
            <div className="p-5 rounded-[8px] bg-white border border-[#E8E0DA] space-y-1.5 text-center shadow-[0_4px_16px_rgba(107,45,92,0.06)] hover:border-[#D4AF37] transition-all cursor-default">
              <div className="text-2xl">🛡️</div>
              <div className="text-xs font-bold text-[#6B2D5C] uppercase tracking-wider">Garansi 100% Baru</div>
              <div className="text-[11px] text-[#6E6868] leading-tight">Ganti buket baru gratis jika rusak di perjalanan</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (theme === 'tema-c') {
    // Playful Pastel & Kawaii Dream Theme
    return (
      <section id="home" className="relative overflow-hidden bg-[#FFFDF9] text-[#2C3E50] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#F2E8DE]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          {/* PLAYFUL KAWAII HERO BANNER */}
          <div className="bg-gradient-to-br from-[#FFF2F4] via-[#FFF9E6] to-[#E8FAF8] border-2 border-[#FFE3E6] rounded-[26px] p-6 sm:p-12 shadow-[0_12px_28px_rgba(255,107,129,0.18)] relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 bg-[#FFD166] text-[#2C3E50] px-4 py-1.5 rounded-full text-xs font-black -rotate-2 shadow-xs">
                  <span>🎉 Super Cute Handcrafted Flowers! ⭐</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black font-heading-c tracking-tight leading-tight text-[#2C3E50]">
                  Buket Bunga Kawat Bulu <span className="text-[#FF6B81]">Gemas & Ceria!</span> 🌻
                </h1>

                <p className="text-sm sm:text-base text-[#576574] max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
                  Pilihan buket karakter boneka beruang toga wisuda, bunga matahari tersenyum, dan tulip pastel ceria. Bikin momen sidang dan wisuda makin seru dan berkesan!
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleAction('katalog')}
                    className="btn-primary-atelier px-7 py-3.5 rounded-full text-sm font-black shadow-md shadow-[#FF6B81]/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Jelajahi Buket Lucu 🌻</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('custom')}
                    className="px-6 py-3 rounded-full bg-white text-[#2C3E50] border-2 border-[#FFEAA7] hover:bg-[#FFF9E6] text-xs sm:text-sm font-extrabold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Custom Karakter Toga ✨
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-[24px] overflow-hidden shadow-xl border-4 border-[#FFEAA7] bg-[#FFF9F0] flex items-center justify-center group">
                  <div className="text-center p-6 space-y-3">
                    <div className="animate-float-hero text-7xl inline-block drop-shadow-md">🌻🧸</div>
                    <div className="font-extrabold text-[#2C3E50] text-lg">Sunshine Bear Graduation</div>
                    <div className="text-xs text-[#FF6B81] font-black bg-white px-3 py-1 rounded-full shadow-xs inline-block">
                      100% Bulu Halus & Topi Toga Nama
                    </div>
                  </div>
                  <div className="animate-bounce-in absolute top-3 right-3 bg-[#FFD166] text-[#2C3E50] text-[10px] font-black px-3 py-1 rounded-full shadow-xs rotate-3">
                    ⭐ Favorit Wisudawan
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 KAWAII VALUE CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-5 rounded-[20px] bg-white border-2 border-[#F2E8DE] space-y-1.5 text-center shadow-[0_4px_14px_rgba(255,107,129,0.08)] hover:border-[#FF6B81] transition-all cursor-default">
              <div className="text-2xl">🌿</div>
              <div className="text-xs font-extrabold text-[#2C3E50]">Awet Selamanya</div>
              <div className="text-[11px] text-[#7F8C8D] font-medium leading-tight">Bunga kawat bulu tahan tahunan tanpa rontok</div>
            </div>
            <div className="p-5 rounded-[20px] bg-white border-2 border-[#F2E8DE] space-y-1.5 text-center shadow-[0_4px_14px_rgba(255,107,129,0.08)] hover:border-[#FF6B81] transition-all cursor-default">
              <div className="text-2xl">📦</div>
              <div className="text-xs font-extrabold text-[#2C3E50]">Kardus Tebal Double</div>
              <div className="text-[11px] text-[#7F8C8D] font-medium leading-tight">Aman dikirim ke seluruh Indonesia tanpa gepeng</div>
            </div>
            <div className="p-5 rounded-[20px] bg-white border-2 border-[#F2E8DE] space-y-1.5 text-center shadow-[0_4px_14px_rgba(255,107,129,0.08)] hover:border-[#FF6B81] transition-all cursor-default">
              <div className="text-2xl">🤝</div>
              <div className="text-xs font-extrabold text-[#2C3E50]">COD Gratis Kampus</div>
              <div className="text-[11px] text-[#7F8C8D] font-medium leading-tight">Bebas ongkir UI, Gundar, dan PNJ Depok</div>
            </div>
            <div className="p-5 rounded-[20px] bg-white border-2 border-[#F2E8DE] space-y-1.5 text-center shadow-[0_4px_14px_rgba(255,107,129,0.08)] hover:border-[#FF6B81] transition-all cursor-default">
              <div className="text-2xl">🛡️</div>
              <div className="text-xs font-extrabold text-[#2C3E50]">Garansi 100% Ganti</div>
              <div className="text-[11px] text-[#7F8C8D] font-medium leading-tight">Langsung dikirim baru bila rusak saat pengiriman</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default: Tema A (Korean Pastel Atelier)
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FAF8F5] to-[#FAF8F5] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EFE8E1]">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* KOREAN PASTEL HERO BANNER */}
        <div className="bg-white border border-[#EFE8E1] rounded-[20px] p-6 sm:p-12 shadow-[0_10px_30px_-8px_rgba(244,167,185,0.22)] relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F4] border border-[#F7D1D9] text-[#9C3D52] text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F4A7B9]" />
                <span>✨ Korean Florist Craft • Everlasting Love</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold font-heading-a text-[#2D2A2A] tracking-tight leading-tight">
                Buket Bunga Kawat Bulu <span className="text-[#E38EA1] italic">Estetik & Abadi</span>
              </h1>

              <p className="text-sm sm:text-base text-[#7E7676] max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Sentuhan lembut beludru chenille stem buatan tangan yang tahan selamanya tanpa layu. Kado paling manis dan berkesan untuk momen wisuda, sidang skripsi, dan perayaan romantis.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleAction('katalog')}
                  className="btn-primary-atelier px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-[#F4A7B9]/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Jelajahi Katalog 🌸</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('custom')}
                  className="px-6 py-3 rounded-full bg-white hover:bg-[#FDF2F4] text-[#2D2A2A] border border-[#EFE8E1] text-xs sm:text-sm font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Rangkai Custom ✨
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-[20px] overflow-hidden shadow-2xl border-4 border-white group">
                <img
                  src="/preview-tema-a.jpg"
                  alt="Preview Koleksi Buket Bunga Kawat Bulu Korean Pastel Atelier"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="animate-float-hero absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#9C3D52] text-xs font-black px-3 py-1.5 rounded-full shadow-md border border-[#F7D1D9] flex items-center gap-1.5">
                  <span>🌸 100% Handcrafted Chenille Velvet</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-[16px] border border-[#F7D1D9] shadow-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-[#2D2A2A]">Pink Tulip Bliss Trio</div>
                    <div className="text-[10px] text-[#7E7676] font-semibold">Bunga Kawat Bulu Korea Halus</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#9C3D52]">Rp 185.000</span>
                    <span className="text-[10px] text-stone-400 line-through block">Rp 210.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 PASTEL VALUE CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-5 rounded-[16px] bg-white border border-[#EFE8E1] space-y-1.5 text-center shadow-[0_4px_12px_rgba(244,167,185,0.08)] hover:border-[#F7D1D9] transition-all cursor-default">
            <div className="text-2xl">🌿</div>
            <div className="text-xs font-extrabold text-[#2D2A2A]">Awet Selamanya</div>
            <div className="text-[11px] text-[#7E7676] leading-tight">Kawat bulu premium anti-rontok & tak pernah layu</div>
          </div>
          <div className="p-5 rounded-[16px] bg-white border border-[#EFE8E1] space-y-1.5 text-center shadow-[0_4px_12px_rgba(244,167,185,0.08)] hover:border-[#F7D1D9] transition-all cursor-default">
            <div className="text-2xl">📦</div>
            <div className="text-xs font-extrabold text-[#2D2A2A]">Kardus Box Tebal</div>
            <div className="text-[11px] text-[#7E7676] leading-tight">Double-wall box aman dari tekanan kurir</div>
          </div>
          <div className="p-5 rounded-[16px] bg-white border border-[#EFE8E1] space-y-1.5 text-center shadow-[0_4px_12px_rgba(244,167,185,0.08)] hover:border-[#F7D1D9] transition-all cursor-default">
            <div className="text-2xl">🤝</div>
            <div className="text-xs font-extrabold text-[#2D2A2A]">COD Titik Temu</div>
            <div className="text-[11px] text-[#7E7676] leading-tight">Janji temu langsung di kampus UI atau stasiun</div>
          </div>
          <div className="p-5 rounded-[16px] bg-white border border-[#EFE8E1] space-y-1.5 text-center shadow-[0_4px_12px_rgba(244,167,185,0.08)] hover:border-[#F7D1D9] transition-all cursor-default">
            <div className="text-2xl">🛡️</div>
            <div className="text-xs font-extrabold text-[#2D2A2A]">Garansi 100% Baru</div>
            <div className="text-[11px] text-[#7E7676] leading-tight">Ganti buket baru jika rusak saat pengiriman</div>
          </div>
        </div>
      </div>
    </section>
  );
};
