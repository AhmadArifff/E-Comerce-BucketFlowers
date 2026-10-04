'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { LiveChatWidget } from '@/components/storefront/LiveChatWidget';
import { GuestTracker } from '@/components/portal/GuestTracker';
import { useThemeStore } from '@/stores/useThemeStore';
import {
  Package,
  Search,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

function LacakPesananContent() {
  const searchParams = useSearchParams();
  const invoiceParam = searchParams.get('inv') || searchParams.get('invoice') || '';
  const { theme } = useThemeStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      <AnnouncementBar />
      <Navbar
        activeSection="tracking"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigate={(id) => {
          if (id === 'katalog' || id === 'custom' || id === 'bantuan') {
            window.location.href = `/#${id}`;
          }
        }}
      />

      <main className="flex-1 pb-20">
        {/* Breadcrumb & Header Hero */}
        <section className="bg-gradient-to-b from-white via-stone-50/80 to-stone-100/40 border-b border-stone-200/80 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
              <Link href="/" className="hover:text-stone-900 flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Beranda Atelier</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-800 font-bold">Lacak Status Pesanan</span>
            </div>

            {/* Title & Badge */}
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/70 text-rose-700 text-xs font-bold tracking-wide mb-4 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Live Order Tracking • Real-Time Supabase</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-heading leading-tight mb-3">
                Pantau Perjalanan Buket Istimewa Anda
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
                Masukkan nomor invoice pesanan (contoh: <span className="font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">INV-20261003-9171</span>) atau nomor WhatsApp terdaftar untuk melacak pengerjaan florist atelier secara transparan.
              </p>
            </div>

            {/* Quick Benefits Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-xs border border-stone-200/80 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">4 Langkah Transparan</div>
                  <div className="text-[11px] text-stone-500">Dari bayar hingga serah terima</div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs border border-stone-200/80 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">COD Kampus & Kurir</div>
                  <div className="text-[11px] text-stone-500">6 Titik Temu UI / J&T / SiCepat</div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs border border-stone-200/80 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Garansi 100% Anti-Patah</div>
                  <div className="text-[11px] text-stone-500">Kawat bulu awet selamanya</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guest Tracker Component */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-8 shadow-sm">
            <GuestTracker initialInvoice={invoiceParam} />
          </div>
        </section>

        {/* Member Portal Hint */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50/50 border border-rose-200/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <div className="text-xs font-extrabold text-rose-700 uppercase tracking-wider mb-1">
                Punya Akun Member Atelier?
              </div>
              <div className="text-sm font-bold text-stone-900 mb-0.5">
                Akses Riwayat Lengkap, Kartu Stamp Bunga & Kupon Eksklusif
              </div>
              <div className="text-xs text-stone-600">
                Masuk ke Member Portal untuk melihat seluruh pesanan masa lalu dan klaim garansi dalam satu dasbor terpadu.
              </div>
            </div>
            <Link
              href="/portal"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex-shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Buka Member Portal</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <LiveChatWidget />
    </div>
  );
}

export default function LacakPesananPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="flex items-center gap-3 text-stone-600 text-sm font-semibold">
            <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <span>Memuat Sistem Lacak Pesanan...</span>
          </div>
        </div>
      }
    >
      <LacakPesananContent />
    </Suspense>
  );
}
