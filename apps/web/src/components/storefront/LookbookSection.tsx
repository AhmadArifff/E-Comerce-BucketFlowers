'use client';

import React from 'react';
import { Sparkles, Heart, Quote } from 'lucide-react';

const LOOKBOOK_ITEMS = [
  {
    id: 'ui-2026',
    badge: 'Wisuda UI 2026',
    emojis: '🎓💐',
    bgGradient: 'from-pink-50 to-rose-100/70',
    tags: '#GraduationGift • Universitas Indonesia',
    title: 'Graduation Bouquet Pink & Gold Edition',
    quote:
      'Cantik banget dan rapi parah! Bunga kawat bulunya tebal dan lampu LED-nya nyala terang banget pas sesi foto wisuda di Balairung UI. Sahabatku bahagia banget pas nerima!',
    author: 'Kak Sarah Amalia',
    city: 'Jakarta Selatan',
  },
  {
    id: 'anniversary-2026',
    badge: 'Anniversary 2nd Year',
    emojis: '🌹✨',
    bgGradient: 'from-amber-50 to-orange-100/70',
    tags: '#Romance • Kado Kejutan Spesial',
    title: 'Everlasting Red Velvet & Champagne Mist',
    quote:
      'Biasanya beli bunga potong segar 3 hari langsung layu dan dibuang. Buket kawat bulu beludru ini sudah 2 bulan dipajang di meja rias, warnanya tetap anggun dan tidak berubah sama sekali!',
    author: 'Mas Dimas Prasetya',
    city: 'Bandung',
  },
  {
    id: 'sidang-ipb',
    badge: 'Sidang Skripsi IPB',
    emojis: '🌻🧸',
    bgGradient: 'from-emerald-50 to-teal-100/70',
    tags: '#DeskDecoration • Sidang Sarjana',
    title: 'Sunshine Sunflower & Mini Toga Bear',
    quote:
      'Boneka beruang wisudanya gemas sekali! Waktu foto sidang pas banget ukurannya dan pengiriman ke asrama kampus aman karena kardus double-wall tebal berlapis bubble wrap.',
    author: 'Kak Nadya Putri',
    city: 'Bogor',
  },
];

export const LookbookSection: React.FC = () => {
  return (
    <section id="lookbook" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-rose-100">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Alumni & Customer Moments</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Lookbook & Inspirasi Pelanggan
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Koleksi hasil karya buket asli yang telah menemani momen wisuda, sidang sarjana, dan perayaan bahagia pelanggan Chenille Flowers Atelier.
          </p>
        </div>

        {/* 3 CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LOOKBOOK_ITEMS.map((item) => (
            <div
              key={item.id}
              className="card-atelier overflow-hidden flex flex-col justify-between card-tilt-hover"
            >
              {/* PHOTO / VISUAL CONTAINER */}
              <div className={`p-8 bg-gradient-to-br ${item.bgGradient} flex flex-col items-center justify-center relative min-h-[200px]`}>
                <span className="absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 shadow-2xs">
                  {item.badge}
                </span>
                <span className="text-6xl sm:text-7xl transition-transform duration-300 hover:scale-110 select-none">
                  {item.emojis}
                </span>
              </div>

              {/* CARD DETAILS */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-theme-primary uppercase tracking-wider block">
                    {item.tags}
                  </span>
                  <h3 className="text-base font-extrabold text-stone-900 leading-snug font-heading">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed italic relative pl-4 border-l-2 border-theme-border">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-theme-border/60 flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>{item.author}</span>
                  <span className="text-[11px] text-stone-400 font-normal">{item.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
