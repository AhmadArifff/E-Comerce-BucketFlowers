'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, HelpCircle, ChevronDown, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';

const FAQS = [
  {
    q: 'Bagaimana jika kelopak bunga sedikit penyok setelah keluar dari kardus?',
    a: 'Jangan khawatir! Kawat di dalam bulu beludru chenille stem bersifat sangat lentur dan elastis. Anda cukup menggunakan jari tangan perlahan untuk merapikan, melenturkan, atau melebarkan kembali kelopak bunga ke bentuk cantiknya hanya dalam waktu 10-20 detik!',
  },
  {
    q: 'Bagaimana cara membersihkan debu jika buket sudah lama dipajang di kamar?',
    a: 'Gunakan kuas makeup berbulu halus atau kuas lukis bersih. Anda juga bisa menggunakan pengering rambut (hairdryer) dengan pengaturan angin dingin bersuhu normal. Hindari mencuci buket dengan air agar kawat di dalamnya tetap awet tidak berkarat.',
  },
  {
    q: 'Apakah bisa janjian COD (Cash on Delivery) di area kampus?',
    a: 'Bisa banget! Kami melayani titik temu COD bebas ongkir dalam radius 5 KM (Stasiun UI, Margonda, Kampus Gundar, Politeknik Negeri Jakarta, dan Margo City Mall).',
  },
];

export const WarrantyHelpSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="bantuan" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-theme-border">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-surface-subtle border border-theme-border text-theme-primary text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-theme-primary" />
            <span>Care Guide & Customer Protection</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-heading">
            Pusat Bantuan, Perawatan & Garansi 100%
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Segala informasi yang Anda butuhkan untuk merawat buket kawat bulu agar tetap awet selamanya serta jaminan garansi retur adil kami.
          </p>
        </div>

        {/* CARE GUIDE FAQS */}
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-theme-primary flex items-center gap-2">
            <span>💡</span>
            <span>Panduan Perawatan Buket (Care Guide):</span>
          </h3>

          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-theme-border bg-stone-50/50 overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-stone-800 hover:text-theme-primary cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-theme-primary' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-theme-border/60 pt-3 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 100% REPLACEMENT WARRANTY BANNER */}
        <div className="card-atelier p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-theme-primary text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-md">
              🛡️
            </div>
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-black text-stone-900">
                Garansi 100% Ganti Buket Baru (Free Shipping)
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Jika buket rusak parah akibat kelalaian kurir ekspedisi (tangkai patah atau kardus basah kuyup), cukup sertakan video unboxing 1x24 jam sejak paket diterima. Kami akan kirimkan <strong>Buket Baru 100% Gratis</strong> tanpa Anda harus repot mengembalikan buket lama!
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/portal"
              className="btn-primary-atelier px-5 py-2.5 text-xs font-extrabold shadow-md flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Ajukan Klaim Garansi di Portal Pelanggan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <span className="text-[11px] text-stone-500 font-semibold">
              ✓ Proses verifikasi instan kurang dari 2 jam kerja
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
