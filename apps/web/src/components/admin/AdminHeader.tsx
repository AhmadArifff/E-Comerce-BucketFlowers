'use client';

import React from 'react';
import { Menu, Database, Shield, Bell, User, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import type { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenMobileNav: () => void;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  OVERVIEW: { title: 'Dashboard Operasional', subtitle: 'Ringkasan performa penjualan dan kapasitas atelier' },
  ORDERS: { title: 'Manajemen Pesanan Live', subtitle: 'Pembaruan 4 status progres perangkaian buket' },
  PRODUCTS: { title: 'Katalog & Inventory Bahan', subtitle: 'Stok buket kawat bulu & HPP per produk' },
  CLAIMS: { title: 'Komplain & Garansi 100% Anti-Patah', subtitle: 'Verifikasi klaim kerusakan buket dan kirim ganti baru' },
  BOM_CALCULATOR: { title: 'Kalkulator Bill of Materials (BOM)', subtitle: 'Kalkulasi HPP detail batang kawat, kain, & pita' },
  COD_MAPS: { title: 'Geofencing Titik Temu COD Depok', subtitle: 'Radius 5 KM bebas ongkir kampus UI & Margo City' },
  CS_HUB: { title: 'Customer Service Webchat Hub', subtitle: 'Respon percakapan langsung pelanggan di website' },
  FEATURE_TOGGLES: { title: 'Feature Toggles & Guard Control', subtitle: 'Kontrol darurat kuota PO & mode pemeliharaan' },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, onOpenMobileNav }) => {
  const { user, switchRole } = useAuthStore();
  const current = TAB_TITLES[activeTab] || TAB_TITLES.OVERVIEW;

  return (
    <header className="h-16 bg-white border-b border-rose-100 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-rose-50"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-extrabold text-stone-800 tracking-tight">
            {current.title}
          </h1>
          <p className="text-[11px] text-stone-500 hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Supabase Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
          <Database className="w-3.5 h-3.5" />
          <span>Supabase PostgreSQL: Terhubung</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Current User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
            {user?.avatarEmoji || '👑'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-stone-800 block leading-tight">
              {user?.name || 'Owner Atelier'}
            </span>
            <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">
              {user?.role || 'SUPER_ADMIN'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
