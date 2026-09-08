'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  ExternalLink,
  Users,
  ChevronDown,
  User,
  Settings,
  KeyRound,
  LogOut,
  Palette,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { showMagicToast } from '@/lib/magic-motion';
import type { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenMobileNav: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenProfile?: () => void;
  onOpenChangePassword?: () => void;
  onSelectTab?: (tab: AdminTab) => void;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  DASHBOARD: {
    title: 'Dashboard & Evaluasi Bisnis',
    subtitle: 'Ringkasan performa penjualan, produksi buket kawat bulu, dan margin keuntungan.',
  },
  ORDERS: {
    title: 'Manajemen Pesanan Live',
    subtitle: 'Pembaruan progres perangkaian, pelacakan ekspedisi Biteship, dan titik COD kampus.',
  },
  REPORTS: {
    title: 'Laporan Finansial & Ekspor Excel',
    subtitle: 'Rekapitulasi omzet, kalkulasi HPP riil bahan baku, dan unduhan berkas laporan akuntansi.',
  },
  PRODUCTS: {
    title: 'Produk & Klik Pelanggan',
    subtitle: 'Katalog buket kawat bulu, pantauan minat klik pengunjung, dan pengelolaan margin HPP.',
  },
  BOM: {
    title: 'Bahan Baku & Resep BOM (Bill of Materials)',
    subtitle: 'Kalkulasi HPP akurat per batang chenille kawat bulu, kain wrapping, pita, dan box corrugated.',
  },
  PROMOS: {
    title: 'Pemasaran & Kupon Diskon',
    subtitle: 'Kelola kode kupon promo, kuota penukaran diskon, dan batas masa berlaku kampanye.',
  },
  COMPLAINTS: {
    title: 'Komplain & Garansi Unboxing 100%',
    subtitle: 'Verifikasi video unboxing pelanggan, persetujuan klaim ganti baru, dan rating kepuasan.',
  },
  WHATSAPP: {
    title: 'CS WhatsApp Hub & Webchat',
    subtitle: 'Konsol komunikasi terpadu, balasan cepat otomatis, dan eskalasi langsung ke WhatsApp Web.',
  },
  COD_MAPS: {
    title: 'Titik Temu COD Maps (Geofencing Depok)',
    subtitle: 'Kelola titik serah terima bebas ongkir radius 5 KM di area kampus UI, Margonda & Margo City.',
  },
  MAINTENANCE: {
    title: 'Mode Pemeliharaan & Kontrol Tema',
    subtitle: 'Pilihan tema visual etalase toko (A, B, C), live preview perangkat, dan sakelar operasional.',
  },
  SETTINGS: {
    title: 'Pengaturan Atelier & Kredensial Toko',
    subtitle: 'Konfigurasi profil studio atelier, kuota pesanan harian, dan gerbang pembayaran Midtrans.',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onOpenMobileNav,
  searchQuery = '',
  onSearchChange,
  onOpenProfile,
  onOpenChangePassword,
  onSelectTab,
}) => {
  const { user, logout } = useAuthStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const current = TAB_TITLES[activeTab] || TAB_TITLES.DASHBOARD;

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    logout();
    showMagicToast('Logout Berhasil 🔒', 'Sesi admin Rania Azzahra telah keluar dengan aman.', '👋');
  };

  return (
    <header className="h-16 bg-white border-b border-rose-100 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-rose-50"
          aria-label="Buka Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-extrabold text-stone-800 tracking-tight truncate">
            {current.title}
          </h1>
          <p className="text-[11px] text-stone-500 hidden sm:block truncate">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Global Search Input */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Cari invoice, pembeli..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all font-mono"
          />
        </div>

        {/* Shortcut: Buka Toko (Storefront Preview) */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-2xs"
          title="Buka Toko Frontend di Tab Baru"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Buka Toko</span>
        </Link>

        {/* Shortcut: Customer Portal */}
        <Link
          href="/portal"
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-all shadow-2xs"
          title="Buka Portal Pelanggan Terpadu"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Portal Pelanggan</span>
        </Link>

        {/* Admin Profile with Interactive Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-stone-200 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center font-black text-xs shadow-sm shadow-rose-500/20">
              RA
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-stone-800 block leading-tight group-hover:text-rose-600 transition-colors">
                Rania Azzahra
              </span>
              <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                Super Admin Florist
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileDropdownOpen(false)}
              />
              <div className="fade-in-dropdown absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-rose-100 p-2 z-50 text-xs space-y-1">
                <div className="px-3 py-2 border-b border-stone-100">
                  <div className="font-extrabold text-stone-800">Rania Azzahra</div>
                  <div className="text-[11px] text-stone-400">rania.florist@atelier.com</div>
                  <span className="inline-block mt-1.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Super Admin Utama
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onOpenProfile?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 hover:bg-rose-50 hover:text-rose-700 font-semibold transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>Profil Pengrajin & Akun</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onSelectTab?.('SETTINGS');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 hover:bg-rose-50 hover:text-rose-700 font-semibold transition-colors text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-400" />
                  <span>Pengaturan Atelier</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onOpenChangePassword?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-700 hover:bg-rose-50 hover:text-rose-700 font-semibold transition-colors text-left"
                >
                  <KeyRound className="w-3.5 h-3.5 text-stone-400" />
                  <span>Ganti Kata Sandi</span>
                </button>

                <div className="border-t border-stone-100 my-1" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar / Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

