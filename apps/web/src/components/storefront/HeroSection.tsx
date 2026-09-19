'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { getThemeCopy } from '@/lib/theme-copy';

interface HeroSectionProps {
  onNavigate?: (section: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [isNightModeLed, setIsNightModeLed] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme : 'tema-a';
  const copy = getThemeCopy(activeTheme);

  const handleAction = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // =========================================================================
  // TEMA B: MODERN ROMANTIC & EDITORIAL LUXURY
  // Arch Frame + Champagne Gold + Interactive Day/Night LED Switch
  // =========================================================================
  if (activeTheme === 'tema-b') {
    return (
      <section id="home" className="relative overflow-hidden bg-[#FAFAFA] text-[#1E1919] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E8E0DA]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          
          {/* EDITORIAL HERO BANNER WITH GOLD INNER ACCENT */}
          <div className="bg-white border border-[#E8E0DA] rounded-[14px] p-6 sm:p-12 shadow-[0_12px_36px_rgba(107,45,92,0.08)] relative overflow-hidden after:content-[''] after:absolute after:inset-2 sm:after:inset-3 after:border after:border-[#D4AF37]/30 after:rounded-[10px] after:pointer-events-none">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center relative z-10">
              
              {/* LEFT COLUMN: EDITORIAL COPY */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[2.5px] text-[#C98A90] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>✦ {copy.hero.topBadge}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-bold font-heading-b tracking-tight leading-tight text-[#6B2D5C]">
                  {copy.hero.headlinePart1} <span className="italic text-[#C98A90]">{copy.hero.headlineHighlight}</span>
                </h1>

                <p className="text-sm sm:text-base text-[#6E6868] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  {copy.hero.subheadline}
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleAction('katalog')}
                    className="btn-primary-atelier px-7 py-3.5 rounded-[6px] text-xs font-bold tracking-[1.5px] uppercase cursor-pointer shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <span>{copy.hero.ctaPrimary}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('custom')}
                    className="px-6 py-3 rounded-[6px] border border-[#6B2D5C] text-[#6B2D5C] hover:bg-[#6B2D5C] hover:text-white transition-all text-xs font-bold tracking-[1px] uppercase cursor-pointer active:scale-95"
                  >
                    {copy.hero.ctaSecondary}
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: BESPOKE ARCH SHOWCASE + LED INTERACTIVE TOGGLE */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div
                  className={`relative w-full max-w-sm aspect-[3/4] rounded-t-[140px] rounded-b-[20px] overflow-hidden border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/20 shadow-2xl transition-all duration-700 group bg-stone-950 ${
                    isNightModeLed ? 'shadow-[0_0_55px_rgba(212,175,55,0.55)] border-amber-400' : ''
                  }`}
                >
                  <img
                    src="/preview-tema-b.jpg"
                    alt="The Royal Crimson Velvet Rose Chenille Bouquet on Nero Marquina Marble Pedestal"
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isNightModeLed ? 'brightness-80 contrast-125 saturate-110' : 'brightness-100 group-hover:scale-105'
                    }`}
                  />

                  {/* NIGHT MODE LED FAIRY LIGHTS OVERLAY */}
                  {isNightModeLed && (
                    <div className="absolute inset-0 bg-radial from-amber-300/30 via-black/45 to-black/75 pointer-events-none flex items-center justify-center animate-fade-in">
                      <div className="absolute top-1/4 left-1/4 w-3.5 h-3.5 bg-amber-200 rounded-full blur-[2px] animate-ping" />
                      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-yellow-100 rounded-full blur-[1px] animate-pulse" />
                      <div className="absolute top-1/2 left-1/3 w-3.5 h-3.5 bg-amber-300 rounded-full blur-[2px] animate-pulse" />
                      <div className="absolute bottom-1/3 right-1/3 w-2.5 h-2.5 bg-yellow-200 rounded-full blur-[1px] animate-ping" />
                      <div className="absolute top-1/5 right-1/3 w-2 h-2 bg-amber-100 rounded-full blur-[1px] animate-pulse" />
                      <div className="absolute bottom-1/4 left-1/4 w-2.5 h-2.5 bg-amber-400 rounded-full blur-[1.5px] animate-ping" />
                    </div>
                  )}

                  {/* TOP BADGES */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-[4px] border border-[#D4AF37]/50 shadow-md">
                      ✦ Haute Couture Edition
                    </span>
                    <span className="text-[9px] font-serif font-black tracking-widest text-amber-200/90 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-[4px] border border-amber-500/30">
                      PARIS • ATELIER
                    </span>
                  </div>

                  {/* PRD 21.2 B BOTTOM SHOWCASE PILL / CARD (DARK GLASSMORPHISM) */}
                  <div className="absolute inset-x-3 bottom-3 bg-black/85 backdrop-blur-md p-3.5 sm:p-4 rounded-[14px] border border-amber-500/40 shadow-xl flex items-center justify-between z-10">
                    <div className="min-w-0 pr-2">
                      <div className="text-xs sm:text-sm font-bold font-heading-b text-amber-100 truncate">The Royal Crimson Velvet</div>
                      <div className="text-[10px] text-amber-300/80 font-light truncate">Deep Wine Chenille • Lis Emas</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAction('katalog')}
                      className="bg-gradient-to-r from-[#8B1E3F] to-[#722332] hover:from-[#A02349] hover:to-[#8B1E3F] text-amber-100 border border-amber-400/40 px-3.5 py-1.5 rounded-[6px] text-[11px] font-bold tracking-wider uppercase cursor-pointer active:scale-95 transition-all flex-shrink-0 shadow-sm"
                    >
                      Pesan Mahakarya 🌹
                    </button>
                  </div>
                </div>

                {/* PRD 21.2 B INTERACTIVE LED TOGGLE BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsNightModeLed(!isNightModeLed)}
                  className={`mt-4 px-5 py-2.5 rounded-full border text-xs font-bold tracking-wide uppercase transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 ${
                    isNightModeLed
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                      : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300 hover:border-amber-400'
                  }`}
                >
                  <Lightbulb className={`w-4 h-4 ${isNightModeLed ? 'text-stone-950 fill-stone-950 animate-bounce' : 'text-amber-500'}`} />
                  <span>{isNightModeLed ? '✨ Matikan Lampu LED Buket' : '💡 Coba Nyalakan Lampu Buket'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 EDITORIAL VALUE CARDS WITH LUCIDE ICONS (NO RAW EMOJI) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {copy.trustCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="p-5 rounded-[10px] bg-white border border-[#E8E0DA] space-y-2 text-center shadow-[0_4px_16px_rgba(107,45,92,0.06)] hover:border-[#D4AF37] transition-all cursor-default group"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#FAFAFA] border border-[#E8E0DA] flex items-center justify-center text-[#6B2D5C] group-hover:scale-110 group-hover:border-[#D4AF37] transition-transform">
                    <Icon className="w-5 h-5 text-[#6B2D5C]" />
                  </div>
                  <div className="text-xs font-bold text-[#6B2D5C] uppercase tracking-wider">{card.title}</div>
                  <div className="text-[11px] text-[#6E6868] leading-tight font-light">{card.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // TEMA C: PLAYFUL KAWAII & GRADUATION SUNSHINE
  // Chunky Squircle 3D + Wiggle Badge + High-Res Sunflower Bear Photo
  // =========================================================================
  if (activeTheme === 'tema-c') {
    return (
      <section id="home" className="relative overflow-hidden bg-[#FFFDF9] text-[#2C3E50] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#F2E8DE]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          
          {/* PLAYFUL KAWAII HERO BANNER */}
          <div className="bg-gradient-to-br from-[#FFF2F4] via-[#FFF9E6] to-[#E8FAF8] border-3 border-[#FFE3E6] rounded-[32px] p-6 sm:p-12 shadow-[0_14px_32px_rgba(255,107,129,0.18)] relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center relative z-10">
              
              {/* LEFT COLUMN: VIBRANT POP COPY */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 bg-[#FFD166] text-[#2C3E50] px-4 py-1.5 rounded-full text-xs font-black -rotate-2 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#2C3E50]" />
                  <span>{copy.hero.topBadge}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black font-heading-c tracking-tight leading-tight text-[#2C3E50]">
                  {copy.hero.headlinePart1} <span className="text-[#FF6B81]">{copy.hero.headlineHighlight}</span>
                </h1>

                <p className="text-sm sm:text-base text-[#576574] max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
                  {copy.hero.subheadline}
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleAction('katalog')}
                    className="btn-primary-atelier px-7 py-3.5 rounded-full text-sm font-black shadow-md shadow-[#FF6B81]/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>{copy.hero.ctaPrimary}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('custom')}
                    className="px-6 py-3 rounded-full bg-white text-[#2C3E50] border-2 border-[#FFEAA7] hover:bg-[#FFF9E6] text-xs sm:text-sm font-extrabold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {copy.hero.ctaSecondary}
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: CHUNKY SQUIRCLE WITH SUNFLOWER BEAR PHOTO & WIGGLE BADGE */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-[36px] overflow-hidden shadow-2xl border-4 border-[#FFEAA7] bg-[#FFF9F0] group hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src="/preview-tema-c.jpg"
                    alt="Playful Kawaii Chenille Sunflower Bouquet with Graduation Bear"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* PRD 21.2 C INTERACTIVE WIGGLE BADGE */}
                  <div
                    onMouseEnter={() => setIsWiggling(true)}
                    onAnimationEnd={() => setIsWiggling(false)}
                    className={`absolute top-4 right-4 bg-[#FFD166] text-[#2C3E50] text-xs font-black px-3.5 py-1.5 rounded-full shadow-md border-2 border-white cursor-pointer select-none ${
                      isWiggling ? 'animate-wiggle' : 'rotate-2 hover:rotate-6'
                    }`}
                  >
                    ⭐ Favorit Wisudawan
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-[22px] border-2 border-[#FFEAA7] shadow-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-[#2C3E50]">Sunshine Bear Graduation</div>
                      <div className="text-[10px] text-[#FF6B81] font-bold">100% Bulu Halus & Topi Toga Nama</div>
                    </div>
                    <div className="bg-[#FFE3E6] text-[#FF6B81] px-3 py-1 rounded-full text-xs font-black">
                      Super Gemas!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 KAWAII VALUE CARDS WITH LUCIDE ICONS (NO RAW EMOJI) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {copy.trustCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="p-5 rounded-[24px] bg-white border-2 border-[#F2E8DE] space-y-2 text-center shadow-[0_6px_18px_rgba(255,107,129,0.08)] hover:border-[#FF6B81] hover:-translate-y-1 transition-all cursor-default group"
                >
                  <div className="w-11 h-11 mx-auto rounded-2xl bg-[#FFF2F4] border border-[#FFE3E6] flex items-center justify-center text-[#FF6B81] group-hover:rotate-12 transition-transform">
                    <Icon className="w-5 h-5 text-[#FF6B81]" />
                  </div>
                  <div className="text-xs font-black text-[#2C3E50]">{card.title}</div>
                  <div className="text-[11px] text-[#7F8C8D] font-medium leading-tight">{card.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // TEMA A (DEFAULT): KOREAN PASTEL ATELIER
  // Polaroid Frame + Washi Tape + Handcrafted Lucide Icons
  // =========================================================================
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FAF8F5] to-[#FAF8F5] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EFE8E1]">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* KOREAN PASTEL HERO BANNER */}
        <div className="bg-white border border-[#EFE8E1] rounded-[24px] p-6 sm:p-12 shadow-[0_10px_30px_-8px_rgba(244,167,185,0.22)] relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
            
            {/* LEFT COLUMN: PASTEL COPYWRITING */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F4] border border-[#F7D1D9] text-[#9C3D52] text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F4A7B9]" />
                <span>{copy.hero.topBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold font-heading-a text-[#2D2A2A] tracking-tight leading-tight">
                {copy.hero.headlinePart1} <span className="text-[#E38EA1] italic">{copy.hero.headlineHighlight}</span>
              </h1>

              <p className="text-sm sm:text-base text-[#7E7676] max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                {copy.hero.subheadline}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleAction('katalog')}
                  className="btn-primary-atelier px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-[#F4A7B9]/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>{copy.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('custom')}
                  className="px-6 py-3 rounded-full bg-white hover:bg-[#FDF2F4] text-[#2D2A2A] border border-[#EFE8E1] text-xs sm:text-sm font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {copy.hero.ctaSecondary}
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: POLAROID FRAME + WASHI TAPE + WAX SEAL + PRODUCT PILL */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md p-3.5 sm:p-4 pb-8 sm:pb-9 bg-white rounded-[20px] shadow-[0_20px_45px_rgba(229,180,170,0.3)] border-2 border-[#EFE8E1] rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500 group">
                
                {/* PRD 21.2 A WASHI TAPE STICKER ACCENT */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#EBE2D8]/90 backdrop-blur-xs border-dashed border border-[#D4C3A3] shadow-xs rotate-[-1deg] pointer-events-none z-20 rounded-xs flex items-center justify-center">
                  <span className="text-[9px] uppercase tracking-widest text-[#8C7A6B] font-semibold opacity-75">HANNAM FLORIST</span>
                </div>

                {/* PRD 21.2 A WAX SEAL MONOGRAM BADGE (TOP RIGHT) */}
                <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-gradient-to-br from-[#D98E80] to-[#B85D4F] border border-[#FADCD5] shadow-md flex items-center justify-center text-white text-[11px] font-serif font-black z-20 select-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]">
                  C
                </div>

                <div className="relative aspect-square w-full rounded-[14px] overflow-hidden bg-stone-100 shadow-inner">
                  <img
                    src="/preview-tema-a.jpg"
                    alt="Korean Pastel Atelier Tulip & Daisy Chenille Bouquet Lifestyle Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* FLOATING CHENILLE VELVET BADGE */}
                  <div className="animate-float-hero absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#9C3D52] text-xs font-black px-3.5 py-1.5 rounded-full shadow-md border border-[#F7D1D9] flex items-center gap-1.5 z-10">
                    <Sparkles className="w-3.5 h-3.5 text-[#E38EA1]" />
                    <span>🌸 100% Chenille Korea Halus</span>
                  </div>
                </div>

                {/* POLAROID CHIN: HANDWRITTEN LABEL + PRODUCT PILL */}
                <div className="mt-3.5 px-1 space-y-2.5">
                  <div className="text-center">
                    <div className="text-[11px] font-serif italic text-[#8C7A6B] tracking-wide">
                      Spring Blossom Trio (봄날의 튤립) • Handcrafted in Hannam-dong Atelier
                    </div>
                  </div>

                  <div className="bg-[#FFF9F6] p-3 rounded-[14px] border border-[#F5E6DF] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-[#2D2A2A]">Pink Tulip Bliss Trio</div>
                      <div className="text-[10px] text-[#7E7676] font-medium">Bunga Kawat Bulu Korea Halus & Wrapping Matte</div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <span className="text-xs font-black text-[#9C3D52] block">Rp 185.000</span>
                        <span className="text-[9px] text-stone-400 line-through block">Rp 210.000</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAction('katalog')}
                        className="bg-[#E8A598] hover:bg-[#D98E80] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                      >
                        Adopsi Sekarang 🌷
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 PASTEL VALUE CARDS WITH LUCIDE ICONS (NO RAW EMOJI) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {copy.trustCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="p-5 rounded-[18px] bg-white border border-[#EFE8E1] space-y-2 text-center shadow-[0_4px_14px_rgba(244,167,185,0.08)] hover:border-[#F7D1D9] hover:-translate-y-0.5 transition-all cursor-default group"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-[#FDF2F4] border border-[#F7D1D9] flex items-center justify-center text-[#9C3D52] group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-[#9C3D52]" />
                </div>
                <div className="text-xs font-extrabold text-[#2D2A2A]">{card.title}</div>
                <div className="text-[11px] text-[#7E7676] leading-tight">{card.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
