'use client';

import React, { useState } from 'react';
import { Menu, Database, Shield, Bell, User, CheckCircle2, Palette, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore, type ThemeId } from '@/stores/useThemeStore';
import type { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenMobileNav: () => void;
}

const THEMES: { id: ThemeId; label: string; icon: string; color: string; desc: string }[] = [
  { id: 'tema-a', label: 'Tema A: Korean Pastel', icon: '🌸', color: '#F43F5E', desc: 'Soft Pink & Dreamy' },
  { id: 'tema-b', label: 'Tema B: Modern Romantic', icon: '🌹', color: '#9F1239', desc: 'Velvet Wine & Gold' },
  { id: 'tema-c', label: 'Tema C: Playful Kawaii', icon: '🌻', color: '#EA580C', desc: 'Pop Coral & Cheerful' },
];

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
  const { theme, setTheme } = useThemeStore();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const current = TAB_TITLES[activeTab] || TAB_TITLES.OVERVIEW;
  const activeThemeMeta = THEMES.find((t) => t.id === theme) || THEMES[0];

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
        {/* Admin-Only Global Store Theme Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-stone-800 text-xs font-bold transition-all shadow-2xs"
            title="Kelola Tema Visual Toko (Admin Only)"
          >
            <Palette className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-sm">{activeThemeMeta.icon}</span>
            <span className="hidden sm:inline text-[11.5px]">{activeThemeMeta.label.split(':')[1]}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
          </button>

          {isThemeOpen && (
            <div className="fade-in-dropdown absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-rose-100 p-2.5 z-50">
              <div className="px-2 py-1.5 border-b border-stone-100 mb-1">
                <div className="text-[11px] font-extrabold text-stone-900 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-rose-600" />
                  <span>KONTROL TEMA TOKO (ADMIN ONLY)</span>
                </div>
                <div className="text-[10px] text-stone-500">
                  Tema yang dipilih di sini akan aktif di seluruh Storefront, Login, dan Portal.
                </div>
              </div>

              <div className="space-y-1">
                {THEMES.map((t) => {
                  const isActive = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTheme(t.id);
                        setIsThemeOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-rose-50 border border-rose-200 shadow-2xs text-rose-900'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{t.icon}</span>
                        <div>
                          <div className="text-xs font-bold">{t.label}</div>
                          <div className="text-[10px] text-stone-400">{t.desc}</div>
                        </div>
                      </div>
                      {isActive && (
                        <span className="text-[10px] font-extrabold text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-200">
                          Aktif
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Supabase Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
          <Database className="w-3.5 h-3.5" />
          <span>Supabase: Terhubung</span>
          <span className="status-dot-pulse w-2 h-2 rounded-full bg-emerald-500 inline-block" />
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
