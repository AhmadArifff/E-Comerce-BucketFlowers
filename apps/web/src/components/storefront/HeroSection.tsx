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
    // Modern Romantic Theme
    return (
      <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#1C0D18] via-[#2A1024] to-[#160A13] text-[#FDF4E3] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#4A203E]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3B1733] border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>✦ Exclusive Handcrafted Atelier Privé</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-heading-b tracking-tight leading-tight text-white">
                Buket Bunga Kawat Bulu <span className="text-amber-400">Kemewahan Abadi</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-serif">
                Mahakarya kawat bulu beludru deep wine velvet & champagne gold. Dirangkai presisi untuk perayaan wisuda prestisius, lamaran, dan hari jadi pernikahan penuh cinta.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleAction('katalog')}
                  className="btn-shimmer px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-950/60 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Lihat Koleksi Mewah 🌹</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('custom')}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-stone-200 border border-amber-500/30 text-xs sm:text-sm font-bold backdrop-blur-sm transition-all cursor-pointer"
                >
                  Rangkai Custom Atelier ✨
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/30 group">
                <img
                  src="/preview-tema-b.jpg"
                  alt="Modern Romantic Velvet Bouquet Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5 sm:p-6">
                  <div className="text-left w-full flex items-center justify-between">
                    <div>
                      <span className="animate-float-hero text-[10px] font-black uppercase tracking-widest text-amber-400 bg-black/60 px-2.5 py-1 rounded-full border border-amber-400/40 inline-block">
                        ✦ 100% Velvet Chenille Stem
                      </span>
                      <div className="text-base sm:text-lg font-bold text-white mt-1">Midnight Velvet & Champagne Gold</div>
                      <div className="text-xs text-rose-300">Tahan Selamanya Tanpa Perlu Disiram</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 TRUST CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-[#3D1A34]">
            <div className="card-tilt-hover p-4 rounded-2xl bg-[#240F20] border border-[#481E40] space-y-1 text-left cursor-default">
              <div className="text-2xl">🌹</div>
              <div className="text-xs font-bold text-white">Awet Selamanya</div>
              <div className="text-[11px] text-stone-400">Kawat bulu premium anti-rontok & tak pernah layu</div>
            </div>
            <div className="card-tilt-hover p-4 rounded-2xl bg-[#240F20] border border-[#481E40] space-y-1 text-left cursor-default">
              <div className="text-2xl">📦</div>
              <div className="text-xs font-bold text-white">Rigid Hardbox</div>
              <div className="text-[11px] text-stone-400">Packaging kokoh mewah tahan benturan ekspedisi</div>
            </div>
            <div className="card-tilt-hover p-4 rounded-2xl bg-[#240F20] border border-[#481E40] space-y-1 text-left cursor-default">
              <div className="text-2xl">🤝</div>
              <div className="text-xs font-bold text-white">COD Eksklusif</div>
              <div className="text-[11px] text-stone-400">Janji temu langsung di kampus UI & Margo City</div>
            </div>
            <div className="card-tilt-hover p-4 rounded-2xl bg-[#240F20] border border-[#481E40] space-y-1 text-left cursor-default">
              <div className="text-2xl">🛡️</div>
              <div className="text-xs font-bold text-white">Garansi 100% Baru</div>
              <div className="text-[11px] text-stone-400">Ganti buket baru gratis jika rusak di perjalanan</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (theme === 'tema-c') {
    // Playful Kawaii Theme
    return (
      <section id="home" className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-yellow-50/20 text-stone-800 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-orange-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-orange-700 text-xs font-black uppercase tracking-wider shadow-xs">
                <span>🎉 Super Cute Handcrafted Flowers</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-heading-c tracking-tight leading-tight text-orange-950">
                Buket Bunga Kawat Bulu <span className="text-pink-600">Gemas & Ceria!</span> 🌻
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Pilihan buket karakter boneka beruang toga wisuda, bunga matahari tersenyum, dan tulip pastel ceria. Bikin momen sidang dan wisuda makin seru dan berkesan!
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleAction('katalog')}
                  className="btn-shimmer px-6 py-3 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Jelajahi Buket Lucu 🌻</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('custom')}
                  className="px-6 py-3 rounded-full bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                >
                  Custom Karakter Toga ✨
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-yellow-300 bg-amber-100 flex items-center justify-center group">
                <div className="text-center p-6 space-y-3">
                  <div className="animate-float-hero text-7xl inline-block drop-shadow-md">🌻🧸</div>
                  <div className="font-extrabold text-stone-900 text-lg">Sunshine Bear Graduation</div>
                  <div className="text-xs text-orange-700 font-bold bg-white px-3 py-1 rounded-full shadow-xs inline-block">
                    100% Bulu Halus & Topi Toga Nama
                  </div>
                </div>
                <div className="animate-bounce-in absolute top-3 right-3 bg-yellow-400 text-stone-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                  ⭐ Favorit Wisudawan
                </div>
              </div>
            </div>
          </div>

          {/* 4 TRUST CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-orange-200">
            <div className="card-tilt-hover p-4 rounded-2xl bg-white border border-orange-200 space-y-1 text-left shadow-2xs cursor-default">
              <div className="text-2xl">🌿</div>
              <div className="text-xs font-bold text-stone-900">Awet Selamanya</div>
              <div className="text-[11px] text-stone-500">Bunga kawat bulu tahan tahunan tanpa rontok</div>
            </div>
            <div className="card-tilt-hover p-4 rounded-2xl bg-white border border-orange-200 space-y-1 text-left shadow-2xs cursor-default">
              <div className="text-2xl">📦</div>
              <div className="text-xs font-bold text-stone-900">Kardus Tebal Double</div>
              <div className="text-[11px] text-stone-500">Aman dikirim ke seluruh Indonesia tanpa gepeng</div>
            </div>
            <div className="card-tilt-hover p-4 rounded-2xl bg-white border border-orange-200 space-y-1 text-left shadow-2xs cursor-default">
              <div className="text-2xl">🤝</div>
              <div className="text-xs font-bold text-stone-900">COD Gratis Kampus</div>
              <div className="text-[11px] text-stone-500">Bebas ongkir UI, Gundar, dan PNJ Depok</div>
            </div>
            <div className="card-tilt-hover p-4 rounded-2xl bg-white border border-orange-200 space-y-1 text-left shadow-2xs cursor-default">
              <div className="text-2xl">🛡️</div>
              <div className="text-xs font-bold text-stone-900">Garansi 100% Ganti</div>
              <div className="text-[11px] text-stone-500">Langsung dikirim baru bila rusak saat pengiriman</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default: Tema A (Korean Pastel)
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-rose-50/80 via-pink-50/40 to-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-rose-100">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>✨ Korean Florist Craft • Everlasting Love</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading-a text-stone-900 tracking-tight leading-tight">
              Buket Bunga Kawat Bulu <span className="text-rose-600">Estetik & Abadi</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Sentuhan lembut beludru chenille stem buatan tangan yang tahan selamanya tanpa layu. Kado paling manis dan berkesan untuk momen wisuda, sidang skripsi, dan perayaan romantis.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleAction('katalog')}
                className="btn-shimmer px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Jelajahi Katalog 🌸</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleAction('custom')}
                className="px-6 py-3 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                Rangkai Custom ✨
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <img
                src="/preview-tema-a.jpg"
                alt="Preview Koleksi Buket Bunga Kawat Bulu Korean Pastel Atelier"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="animate-float-hero absolute top-4 left-4 bg-white/95 backdrop-blur-md text-rose-600 text-xs font-black px-3 py-1.5 rounded-full shadow-md border border-rose-100 flex items-center gap-1.5">
                <span>🌸 100% Handcrafted Chenille Velvet</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-rose-100 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-stone-800">Pink Tulip Bliss Trio</div>
                  <div className="text-[10px] text-stone-500 font-semibold">Bunga Kawat Bulu Korea Halus</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-rose-600">Rp 185.000</span>
                  <span className="text-[10px] text-stone-400 line-through block">Rp 210.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 TRUST CARDS (SEPERTI DI DESAIN TAMPILAN) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-rose-100">
          <div className="card-tilt-hover p-4 rounded-2xl bg-white border border-rose-100 space-y-1 text-left shadow-2xs hover:shadow-xs transition-shadow cursor-default">
            <div className="text-2xl">🌿</div>
            <div className="text-xs font-extrabold text-stone-900">Awet Selamanya</div>
            <div className="text-[11px] text-stone-500">Kawat bulu premium anti-rontok & tak pernah layu</div>
          </div>
          <div className="card-tilt-hover p-4 rounded-2xl bg-white border border-rose-100 space-y-1 text-left shadow-2xs hover:shadow-xs transition-shadow cursor-default">
            <div className="text-2xl">📦</div>
            <div className="text-xs font-extrabold text-stone-900">Kardus Box Tebal</div>
            <div className="text-[11px] text-stone-500">Double-wall box aman dari tekanan kurir</div>
          </div>
          <div className="card-tilt-hover p-4 rounded-2xl bg-white border border-rose-100 space-y-1 text-left shadow-2xs hover:shadow-xs transition-shadow cursor-default">
            <div className="text-2xl">🤝</div>
            <div className="text-xs font-extrabold text-stone-900">COD Titik Temu</div>
            <div className="text-[11px] text-stone-500">Janji temu langsung di kampus UI atau stasiun</div>
          </div>
          <div className="card-tilt-hover p-4 rounded-2xl bg-white border border-rose-100 space-y-1 text-left shadow-2xs hover:shadow-xs transition-shadow cursor-default">
            <div className="text-2xl">🛡️</div>
            <div className="text-xs font-extrabold text-stone-900">Garansi 100% Baru</div>
            <div className="text-[11px] text-stone-500">Ganti buket baru jika rusak saat pengiriman</div>
          </div>
        </div>
      </div>
    </section>
  );
};
