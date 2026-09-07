'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Palette, User, ShieldCheck, MapPin, Sparkles, Menu, X } from 'lucide-react';
import { useThemeStore, type ThemeId } from '@/stores/useThemeStore';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, setSearchQuery }) => {
  const { theme, setTheme } = useThemeStore();
  const { getTotalItems, setIsCartOpen } = useCartStore();
  const { user } = useAuthStore();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const themeOptions: { id: ThemeId; name: string; badge: string; color: string }[] = [
    { id: 'tema-a', name: 'Tema A: Korean Pastel', badge: 'Soft & Elegant', color: '#E11D48' },
    { id: 'tema-b', name: 'Tema B: Modern Romantic', badge: 'Luxury Velvet', color: '#9F1239' },
    { id: 'tema-c', name: 'Tema C: Playful Kawaii', badge: 'Pop & Cheerful', color: '#EA580C' },
  ];

  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold text-rose-600 tracking-tight block leading-tight">
                Chenille Atelier
              </span>
              <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                Buket Kawat Bulu Depok
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari buket wisuda, mawar pastel, mini pot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-rose-50/50 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multi-Theme Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors shadow-sm"
                title="Ganti Tema Visual Toko"
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {theme === 'tema-a' ? 'Korean Pastel' : theme === 'tema-b' ? 'Modern Romantic' : 'Playful Kawaii'}
                </span>
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-rose-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-bold text-stone-400 px-3 py-1.5 uppercase tracking-wider">
                    Pilih Tema Estetika
                  </div>
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setTheme(opt.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                        theme === opt.id
                          ? 'bg-rose-50 font-bold text-rose-700 border border-rose-200 shadow-sm'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: opt.color }}
                        />
                        <div>
                          <div className="font-semibold">{opt.name}</div>
                          <div className="text-[10px] text-stone-500 font-normal">{opt.badge}</div>
                        </div>
                      </div>
                      {theme === opt.id && <span className="text-rose-600 font-bold text-xs">Aktif</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Portal Pelanggan / Lacak Link */}
            <Link
              href="/portal"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Lacak / Portal</span>
            </Link>

            {/* Admin Hub Link */}
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Hub</span>
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95 transition-all"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-rose-600 rounded-lg"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari buket wisuda, mawar pastel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-rose-50/60 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden border-t border-rose-100 py-3 space-y-2 bg-white">
            <Link
              href="/"
              onClick={() => setIsMobileNavOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-rose-600 bg-rose-50 rounded-lg"
            >
              Etalase Katalog Toko
            </Link>
            <Link
              href="/portal"
              onClick={() => setIsMobileNavOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-rose-50 rounded-lg"
            >
              Portal Pelanggan & Lacak Pesanan
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileNavOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-rose-50 rounded-lg"
            >
              Admin Operations Dashboard
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMobileNavOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-rose-50 rounded-lg"
            >
              Masuk / Registrasi Akun
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
