'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Award } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { useChatStore } from '@/stores/useChatStore';

export const HeroSection: React.FC = () => {
  const { theme } = useThemeStore();
  const { setIsOpen: setChatOpen } = useChatStore();

  if (theme === 'tema-b') {
    // Modern Romantic Theme
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-rose-950 to-stone-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-rose-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-700/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-900/60 border border-rose-700/50 text-rose-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Modern Romantic Collection</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight text-stone-100">
              Keabadian Romansa Dalam Sentuhan Beludru Kawat Bulu.
            </h1>
            <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Dibuat eksklusif untuk momen terindah Anda. Setiap kelopak dirangkai tangan dengan ketelitian mahakarya, tidak akan pernah layu, dan selalu menyimpan kenangan abadi.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#catalog"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-950/60 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Lihat Koleksi Mewah</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setChatOpen(true)}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-rose-200 border border-rose-700/50 text-sm font-semibold backdrop-blur-sm transition-all"
              >
                Konsultasi Buket Custom
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-800/40 group">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                alt="Midnight Rose Luxury Bouquet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-black/60 px-2.5 py-1 rounded-full border border-amber-400/40">
                    Handmade Atelier
                  </span>
                  <div className="text-lg font-bold text-white mt-1">Midnight Velvet Bouquet</div>
                  <div className="text-xs text-rose-200">100% Kawat Bulu Beludru Anti-Layu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (theme === 'tema-c') {
    // Playful Kawaii Theme
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50/60 to-yellow-50 text-stone-800 py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-orange-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-orange-700 text-xs font-bold uppercase tracking-wider">
              <span>🌻 Playful Kawaii Atelier</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-orange-950 font-sans">
              Buket Ceria Bunga Kawat Bulu, Bikin Hari Wisuda Penuh Senyum! ✨
            </h1>
            <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Pilihan buket karakter imut, sunflower kawaii, dan mini pot gemas berbahan pipe cleaner premium lembut. Hadiah paling berkesan untuk sahabat wisuda dan orang tersayang.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#catalog"
                className="px-6 py-3 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-black shadow-lg shadow-orange-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Beli Buket Lucu Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setChatOpen(true)}
                className="px-6 py-3 rounded-full bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 text-sm font-bold shadow-sm transition-all"
              >
                Tanya Florist
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-yellow-200 group">
              <img
                src="https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80"
                alt="Sunflower Kawaii"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-yellow-400 text-stone-900 text-xs font-black px-3 py-1 rounded-full shadow-md">
                ⭐ Rating 4.9/5.0
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default: Tema A (Korean Pastel)
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-pink-50/30 to-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-rose-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Handcrafted Chenille Flowers • Depok Atelier</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-800 tracking-tight leading-tight">
            Keindahan Buket Kawat Bulu Pastel yang Selalu Mekar Abadi 🌸
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Dibuat teliti oleh pengrajin lokal berbahan kawat bulu halus grade premium. Solusi hadiah wisuda, anniversary, dan ulang tahun tanpa khawatir bunga layu atau gugur.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-stone-600 py-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garansi Ganti Baru Jika Rusak Kurir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-rose-600" />
              <span>Bebas Ongkir COD UI & Margonda</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <a
              href="#catalog"
              className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>Jelajahi Buket Wisuda</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setChatOpen(true)}
              className="px-6 py-3 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-sm font-bold shadow-sm transition-all"
            >
              Konsultasi Custom Almamater
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
            <img
              src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"
              alt="Pastel Rose Graduation Bouquet"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-rose-600 text-xs font-black px-3 py-1.5 rounded-full shadow-md border border-rose-100 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Favorit Wisudawan 2026</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-rose-100 shadow-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold text-stone-800">Buket Mawar Pastel Spesial</div>
                <div className="text-[11px] text-stone-500 font-medium">Bahan Kawat Bulu Halus (Pipe Cleaner)</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-rose-600">Rp 119.000</span>
                <span className="text-[10px] text-stone-400 line-through block">Rp 135.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
