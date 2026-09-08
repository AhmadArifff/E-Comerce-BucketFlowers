'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Package, ArrowRight } from 'lucide-react';
import { showMagicToast } from '@/lib/magic-motion';
import { useThemeStore } from '@/stores/useThemeStore';

export const QuickTrackingSection: React.FC = () => {
  const { theme } = useThemeStore();
  const defaultInvoice =
    theme === 'tema-b'
      ? 'INV/20260907/FLW-0002'
      : theme === 'tema-c'
      ? 'INV/20260907/FLW-0003'
      : 'INV/20260907/FLW-0001';

  const [invoiceQuery, setInvoiceQuery] = useState(defaultInvoice);
  const [isSearched, setIsSearched] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);

  // Sync default invoice when theme changes if user hasn't typed a custom one
  React.useEffect(() => {
    if (
      invoiceQuery === 'INV/20260907/FLW-0001' ||
      invoiceQuery === 'INV/20260907/FLW-0002' ||
      invoiceQuery === 'INV/20260907/FLW-0003'
    ) {
      setInvoiceQuery(defaultInvoice);
    }
  }, [theme, defaultInvoice]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearched(true);
    setIsBouncing(true);
    showMagicToast('Invoice Terverifikasi! 🚚', `${invoiceQuery} dalam perjalanan kurir`, '📦');
    setTimeout(() => setIsBouncing(false), 350);
  };

  const getTrackingSteps = () => {
    if (theme === 'tema-b') {
      return [
        {
          title: '✦ Pembayaran QRIS Midtrans Terverifikasi',
          subtitle: '07 Sep 2026, 09:30 WIB',
          active: false,
        },
        {
          title: '✦ Proses Penataan & Finishing Aksen Emas',
          subtitle: '07 Sep 2026, 11:00 WIB • Passed Quality Inspection',
          active: false,
        },
        {
          title: '✦ Disegel dalam Box Pelindung Corrugated Tebal',
          subtitle: '07 Sep 2026, 11:45 WIB',
          active: false,
        },
        {
          title: '✦ Kurir Sedang Menuju Lokasi Penerima',
          subtitle: 'Estimasi Penerimaan Tepat Waktu Sore Hari Ini',
          active: true,
        },
      ];
    }
    if (theme === 'tema-c') {
      return [
        {
          title: '✅ Pembayaran QRIS Midtrans Dikonfirmasi',
          subtitle: '07 Sep 2026, 09:20 WIB',
          active: false,
        },
        {
          title: '🌸 Buket Sedang Dibuat Penuh Cinta',
          subtitle: '07 Sep 2026, 10:30 WIB • Quality Check Passed',
          active: false,
        },
        {
          title: '📦 Sudah Masuk Box Tebal + Bubble Wrap',
          subtitle: '07 Sep 2026, 11:20 WIB',
          active: false,
        },
        {
          title: '🚚 Kurir Sedang Ngebut Menuju Lokasimu!',
          subtitle: 'Estimasi Tiba Sore Ini Pukul 15:30 WIB',
          active: true,
        },
      ];
    }
    return [
      {
        title: '✅ Pembayaran Terverifikasi Otomatis (QRIS Midtrans)',
        subtitle: '07 Sep 2026, 09:15 WIB',
        active: false,
      },
      {
        title: '🌸 Buket Sedang Dirangkai oleh Pengrajin Atelier',
        subtitle: '07 Sep 2026, 10:45 WIB • Quality Check Passed',
        active: false,
      },
      {
        title: '📦 Selesai Dipacking dalam Box Corrugated Tebal',
        subtitle: '07 Sep 2026, 11:30 WIB • Bubble wrap berlapis',
        active: false,
      },
      {
        title: '🚚 Paket Telah Diambil Kurir Menuju Alamat Penerima',
        subtitle: 'Sedang Berjalan (Estimasi Tiba Hari Ini Pukul 16:00 WIB)',
        active: true,
      },
    ];
  };

  const steps = getTrackingSteps();

  return (
    <section id="tracking" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-theme-bg border-b border-theme-border">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-surface-subtle border border-theme-border text-theme-primary text-xs font-black uppercase tracking-wider">
            <Package className="w-3.5 h-3.5 text-theme-primary" />
            <span>Real-Time Craft Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-heading">
            {theme === 'tema-b' ? 'Pelacakan Pengiriman Pesanan' : 'Lacak Status Pesanan Buket'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {theme === 'tema-b'
              ? 'Kawal perjalanan kurasi buket Anda dari atelier hingga sampai di pelukan orang terkasih'
              : 'Pantau progres perakitan buket bunga kawat bulu Anda secara transparan dari meja pengrajin hingga tangan kurir.'}
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="card-atelier p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={invoiceQuery}
                onChange={(e) => setInvoiceQuery(e.target.value)}
                placeholder="Nomor Invoice (INV/...)"
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-stone-50 border border-theme-border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-theme-primary focus:bg-white transition-all font-mono"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="btn-primary-atelier px-6 py-3 text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{theme === 'tema-b' ? 'Lacak' : 'Lacak Sekarang'}</span>
            </button>
          </form>

          {isSearched && (
            <div className={`space-y-6 auth-fade-in transition-transform duration-300 ${isBouncing ? 'scale-[1.02]' : 'scale-100'}`}>
              
              {/* INVOICE DETAILS SUMMARY */}
              <div
                className="p-4 sm:p-5 rounded-xl sm:rounded-2xl space-y-1 text-xs"
                style={{
                  background:
                    theme === 'tema-b'
                      ? 'var(--primary-light)'
                      : theme === 'tema-c'
                      ? '#FFF0F2'
                      : 'var(--primary-light)',
                  border:
                    theme === 'tema-b'
                      ? '1px solid var(--gold-border)'
                      : theme === 'tema-c'
                      ? '1.5px solid #FFD4DB'
                      : '1px solid var(--border)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-theme-primary text-sm">Invoice: {invoiceQuery}</span>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                    Dalam Pengantaran
                  </span>
                </div>
                <div className="text-stone-800 font-bold">
                  Pesanan:{' '}
                  <strong>
                    {theme === 'tema-b'
                      ? 'Everlasting Red Velvet Rose + Fairy Lights'
                      : theme === 'tema-c'
                      ? 'Fluffy Sunflower Sunshine Party + Pin Gemas'
                      : 'Pink Tulip Bliss Trio + Lampu LED Fairy Light'}
                  </strong>
                </div>
                <div className="text-stone-500 text-[11px]">
                  {theme === 'tema-b'
                    ? 'Tujuan: Menteng, Jakarta Pusat • Ekspedisi: Biteship Express (AWB: BTE772819)'
                    : theme === 'tema-c'
                    ? 'Tujuan: Kuningan, Jakarta Selatan • Kurir: SiCepat Halu (Resi: SCP994821)'
                    : 'Tujuan: Tebet, Jakarta Selatan • Kurir: J&T Express (Resi: JNT99281726)'}
                </div>
              </div>

              {/* 4-STEP PROGRESS TIMELINE WITH MAGIC BEAM LASER ANIMATION */}
              <ul className="timeline" id="trackingTimeline">
                {steps.map((step, idx) => (
                  <li
                    key={idx}
                    className={`timeline-step ${step.active ? 'active' : ''}`}
                    style={step.active ? { color: 'var(--primary)' } : undefined}
                  >
                    <div className={`font-bold ${step.active ? 'font-extrabold text-sm sm:text-base' : 'text-xs sm:text-sm text-stone-800'}`}>
                      {step.title}
                    </div>
                    <div className={`text-[11px] sm:text-xs mt-0.5 ${step.active ? 'font-semibold text-emerald-700' : 'text-stone-500'}`}>
                      {step.subtitle}
                    </div>
                  </li>
                ))}
              </ul>

              {/* CALLOUT TO FULL PORTAL */}
              <div
                className="p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
                style={{
                  background:
                    theme === 'tema-b'
                      ? 'var(--primary-light)'
                      : theme === 'tema-c'
                      ? '#FFF0F2'
                      : '#FFF9FA',
                  border:
                    theme === 'tema-b'
                      ? '1.5px dashed var(--gold-border)'
                      : theme === 'tema-c'
                      ? '2px dashed #FFD4DB'
                      : '1.5px dashed var(--border)',
                }}
              >
                <div>
                  <div className="font-bold text-stone-800">
                    {theme === 'tema-b'
                      ? 'Lacak Instan Tanpa Login atau Kelola Klaim Garansi?'
                      : theme === 'tema-c'
                      ? 'Lupa Invoice atau Mau Lacak Cepat Tanpa Login?'
                      : 'Lupa Nomor Invoice atau Ingin Lacak via No. HP?'}
                  </div>
                  <div className="text-stone-500 text-[11px] mt-0.5">
                    {theme === 'tema-b'
                      ? 'Akses Portal Pelanggan Terpadu untuk pencarian via nomor telepon atau verifikasi unboxing garansi 100%.'
                      : theme === 'tema-c'
                      ? 'Cukup cari pakai Nomor HP di Portal Pelanggan, atau ajukan klaim garansi ganti baru 100%!'
                      : 'Gunakan Portal Pelanggan Terpadu untuk pencarian instan tanpa login atau kelola klaim garansi Anda.'}
                  </div>
                </div>
                <Link
                  href="/portal"
                  className="btn-primary-atelier px-4 py-2 text-xs flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>
                    {theme === 'tema-b'
                      ? '✦ Buka Portal Pelanggan ↗'
                      : theme === 'tema-c'
                      ? '🚀 Buka Portal Pelanggan ↗'
                      : '📦 Buka Portal Pelanggan ↗'}
                  </span>
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

