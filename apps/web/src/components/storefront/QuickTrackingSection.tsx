'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, ArrowRight } from 'lucide-react';

export const QuickTrackingSection: React.FC = () => {
  const [invoiceQuery, setInvoiceQuery] = useState('INV/20260907/FLW-0001');
  const [isSearched, setIsSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearched(true);
  };

  return (
    <section id="tracking" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-theme-bg border-b border-theme-border">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider">
            <Package className="w-3.5 h-3.5 text-rose-600" />
            <span>Real-Time Craft Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Lacak Status Pesanan Buket
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Pantau progres perakitan buket bunga kawat bulu Anda secara transparan dari meja pengrajin hingga tangan kurir.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={invoiceQuery}
                onChange={(e) => setInvoiceQuery(e.target.value)}
                placeholder="Masukkan nomor invoice (contoh: INV/20260907/...)"
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-stone-50 border border-rose-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-mono"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lacak Sekarang</span>
            </button>
          </form>

          {isSearched && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* INVOICE DETAILS SUMMARY */}
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-rose-800 text-sm">{invoiceQuery}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                    Dalam Pengantaran
                  </span>
                </div>
                <div className="text-stone-700 font-bold">
                  Pesanan: <strong>Pink Tulip Bliss Trio + Lampu LED Fairy Light</strong>
                </div>
                <div className="text-stone-500 text-[11px]">
                  Tujuan: Tebet, Jakarta Selatan • Kurir: J&T Express (Resi: <strong>JNT99281726</strong>)
                </div>
              </div>

              {/* 4-STEP PROGRESS TIMELINE */}
              <div className="space-y-4 pl-2">
                <div className="flex gap-4 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-stone-800">
                      Pembayaran Terverifikasi Otomatis (QRIS Midtrans)
                    </div>
                    <div className="text-[11px] text-stone-400">07 Sep 2026, 09:15 WIB • Otomatis Lunas</div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-stone-800">
                      Buket Sedang Dirangkai oleh Pengrajin Atelier
                    </div>
                    <div className="text-[11px] text-stone-400">07 Sep 2026, 10:45 WIB • Quality Check Passed</div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-stone-800">
                      Selesai Dipacking dalam Box Corrugated Tebal
                    </div>
                    <div className="text-[11px] text-stone-400">07 Sep 2026, 11:30 WIB • Double-wall box tebal</div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-rose-600/30 animate-pulse">
                    🚚
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-rose-700">
                      Paket Telah Diambil Kurir Menuju Alamat Penerima
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold">
                      Sedang Berjalan (Estimasi Tiba Hari Ini Pukul 16:00 WIB)
                    </div>
                  </div>
                </div>
              </div>

              {/* CALLOUT TO FULL PORTAL */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-stone-800">
                    Lupa Nomor Invoice atau Ingin Lacak via Nomor WhatsApp?
                  </div>
                  <div className="text-stone-500 text-[11px]">
                    Gunakan Portal Pelanggan Terpadu untuk pencarian instan tanpa login atau kelola klaim garansi.
                  </div>
                </div>
                <Link
                  href="/portal"
                  className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold hover:bg-rose-50 transition-colors flex items-center gap-1.5 flex-shrink-0 shadow-2xs"
                >
                  <span>Buka Portal Pelanggan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
};
