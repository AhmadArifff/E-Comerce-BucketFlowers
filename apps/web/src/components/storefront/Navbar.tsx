'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User, Sparkles, Menu, X } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';

interface NavbarProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection = 'home',
  onNavigate,
  searchQuery,
  setSearchQuery,
}) => {
  const { theme } = useThemeStore();
  const { getTotalItems, setIsCartOpen } = useCartStore();
  const { user } = useAuthStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);

  const totalItems = getTotalItems();

  // Trigger Cart Bump Animation when total items change or via custom event
  useEffect(() => {
    if (totalItems > 0) {
      setCartBump(true);
      const timer = setTimeout(() => setCartBump(false), 450);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  useEffect(() => {
    const handleBump = () => {
      setCartBump(true);
      const timer = setTimeout(() => setCartBump(false), 450);
      return () => clearTimeout(timer);
    };
    window.addEventListener('cart-bump', handleBump);
    return () => window.removeEventListener('cart-bump', handleBump);
  }, []);

  const navMenuItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'katalog', label: 'Katalog Bunga' },
    { id: 'custom', label: 'Custom Studio' },
    { id: 'lookbook', label: 'Lookbook' },
    { id: 'tracking', label: 'Lacak Pesanan' },
    { id: 'bantuan', label: 'Bantuan & Garansi' },
  ];

  const brandInfo = {
    'tema-a': { title: 'Aesthetic Chenille Flowers', sub: 'Korean Pastel Atelier', icon: '🌸' },
    'tema-b': { title: 'Aesthetic Chenille Atelier', sub: 'Modern Romantic & Editorial', icon: '🌹' },
    'tema-c': { title: 'Chenille Kawaii Craft', sub: 'Playful Pastel & Kawaii Dream', icon: '🍭' },
  }[theme] || { title: 'Aesthetic Chenille Flowers', sub: 'Korean Pastel Atelier', icon: '🌸' };

  const handleNavClick = (id: string) => {
    setIsMobileNavOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id) || document.getElementById(`section-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/80 shadow-2xs transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3 lg:gap-4">
          
          {/* BRAND LOGO */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer flex-shrink-0 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-lg sm:text-xl shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <span>{brandInfo.icon}</span>
            </div>
            <div className="min-w-0 max-w-[190px] sm:max-w-[240px] 2xl:max-w-none">
              <span className="text-sm sm:text-base font-black text-stone-900 tracking-tight block leading-tight truncate">
                {brandInfo.title}
              </span>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block truncate">
                {brandInfo.sub}
              </span>
            </div>
          </div>

          {/* DESKTOP 6 NAVIGATION MENUS — STRICT NO WRAPPING */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 flex-shrink-0">
            {navMenuItems.map((menu) => {
              const isActive = activeSection === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => handleNavClick(menu.id)}
                  className={`px-2.5 2xl:px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                      : 'text-stone-700 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  {menu.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Search Toggle Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                isSearchOpen || searchQuery
                  ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-2xs'
                  : 'border-rose-200/80 bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-600'
              }`}
              title={isSearchOpen ? 'Tutup Pencarian' : 'Cari Buket Bunga'}
              aria-label="Cari Buket Bunga"
            >
              <Search className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">
                {searchQuery ? `"${searchQuery.slice(0, 8)}..."` : 'Cari'}
              </span>
            </button>

            {/* Masuk / Akun Pelanggan Link */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-full border border-rose-200 bg-white hover:bg-rose-50 text-stone-700 text-xs font-bold transition-all shadow-2xs flex-shrink-0"
              title="Masuk / Akun Pelanggan"
            >
              <User className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">
                {user ? user.name.split(' ')[0] : 'Masuk'}
              </span>
            </Link>

            {/* Cart Drawer Trigger with Magic UI Cart Bump Animation */}
            <button
              id="navCartBtn"
              onClick={() => setIsCartOpen(true)}
              className={`btn-nav-cart relative flex items-center justify-center gap-1.5 px-3 sm:px-4 h-9 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all flex-shrink-0 cursor-pointer ${
                cartBump ? 'cart-bump' : ''
              }`}
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keranjang</span>
              <span className="bg-white text-rose-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="xl:hidden p-2 text-stone-700 hover:text-rose-600 rounded-lg focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sleek Search Dropdown (Works on all screen sizes) */}
        {isSearchOpen && (
          <div className="py-2.5 border-t border-rose-100 bg-white/98 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-2xl mx-auto relative flex items-center">
              <Search className="w-4 h-4 text-rose-500 absolute left-3.5 pointer-events-none" />
              <input
                autoFocus
                type="text"
                placeholder="Cari buket wisuda, mawar velvet, tulip, sidang, mini pot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2 text-xs sm:text-sm bg-rose-50/50 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all placeholder:text-stone-400"
              />
              <div className="absolute right-2.5 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-stone-400 hover:text-stone-600 rounded-full text-xs font-semibold"
                    title="Hapus pencarian"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="px-2 py-0.5 text-[11px] font-bold text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Horizontal Navigation Pills Bar */}
        <div className="xl:hidden overflow-x-auto scrollbar-none py-2 flex items-center gap-1.5 border-t border-rose-50 -mx-4 px-4 sm:-mx-6 sm:px-6">
          {navMenuItems.map((menu) => {
            const isActive = activeSection === menu.id;
            return (
              <button
                key={menu.id}
                onClick={() => handleNavClick(menu.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-2xs'
                    : 'bg-stone-50 text-stone-700 hover:bg-rose-50'
                }`}
              >
                {menu.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileNavOpen && (
        <div className="xl:hidden border-t border-rose-100 bg-white/95 backdrop-blur-md px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="text-[11px] font-extrabold uppercase text-stone-400 px-3 tracking-wider">
            Menu Navigasi Toko
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {navMenuItems.map((menu) => {
              const isActive = activeSection === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => handleNavClick(menu.id)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'hover:bg-rose-50 text-stone-800'
                  }`}
                >
                  {menu.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-stone-600 px-2">
            <Link href="/portal" className="hover:text-rose-600">
              📦 Portal Pelanggan
            </Link>
            <Link href="/admin" className="hover:text-rose-600 text-amber-700">
              ⚙️ Admin Atelier
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
