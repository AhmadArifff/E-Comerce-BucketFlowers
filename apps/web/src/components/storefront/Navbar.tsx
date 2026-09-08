'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [mounted, setMounted] = useState(false);

  // Floating sliding pill state
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  const navRef = useRef<HTMLElement>(null);
  const menuRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const mobileMenuRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update sliding pill position based on active section
  const updatePillPosition = useCallback(() => {
    const container = navRef.current;
    const activeBtn = menuRefs.current[activeSection];
    if (container && activeBtn) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setPillStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
        opacity: 1,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    updatePillPosition();
    const raf = requestAnimationFrame(updatePillPosition);
    window.addEventListener('resize', updatePillPosition);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updatePillPosition);
    };
  }, [updatePillPosition, mounted]);

  // Mobile horizontal auto-scroll to active pill
  useEffect(() => {
    const activeBtn = mobileMenuRefs.current[activeSection];
    if (activeBtn && mobileNavRef.current) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeSection]);

  const totalItems = mounted ? getTotalItems() : 0;

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
    'tema-a': {
      title: 'Aesthetic Chenille Flowers',
      sub: 'Korean Pastel Atelier',
      icon: '🌸',
      subColor: 'text-[#A8C3A0]',
      iconClass: 'bg-[#FDF2F4] border border-[#F7D1D9] text-[#9C3D52] shadow-sm',
    },
    'tema-b': {
      title: 'Aesthetic Chenille Atelier',
      sub: 'Modern Romantic & Editorial',
      icon: '🌹',
      subColor: 'text-[#D4AF37]',
      iconClass: 'bg-white border border-[#E8D399] text-[#6B2D5C] shadow-sm',
    },
    'tema-c': {
      title: 'Chenille Kawaii Craft',
      sub: 'Playful Pastel & Kawaii Dream',
      icon: '🍭',
      subColor: 'text-[#7F8C8D]',
      iconClass: 'bg-gradient-to-tr from-[#FFEAA7] to-[#FFB7B2] text-[#2C3E50] shadow-sm',
    },
  }[theme] || {
    title: 'Aesthetic Chenille Flowers',
    sub: 'Korean Pastel Atelier',
    icon: '🌸',
    subColor: 'text-[#A8C3A0]',
    iconClass: 'bg-[#FDF2F4] border border-[#F7D1D9] text-[#9C3D52] shadow-sm',
  };

  const handleNavClick = (id: string) => {
    setIsMobileNavOpen(false);
    setIsSearchOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id) || document.getElementById(`section-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = id === 'home' ? '/' : `/#${id}`;
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-theme-border shadow-2xs transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3 lg:gap-4">
          
          {/* BRAND LOGO */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer flex-shrink-0 group"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl group-hover:scale-105 transition-transform flex-shrink-0 ${brandInfo.iconClass}`}>
              <span>{brandInfo.icon}</span>
            </div>
            <div className="min-w-0 max-w-[190px] sm:max-w-[240px] 2xl:max-w-none">
              <span className="text-sm sm:text-base font-black text-theme-text-main tracking-tight block leading-tight truncate">
                {brandInfo.title}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest block truncate ${brandInfo.subColor}`}>
                {brandInfo.sub}
              </span>
            </div>
          </div>

          {/* DESKTOP 6 NAVIGATION MENUS — FLOATING MAGNETIC SLIDING PILL */}
          <nav
            ref={navRef}
            className="relative hidden xl:flex items-center gap-1 2xl:gap-1.5 flex-shrink-0 p-1 bg-stone-100/70 rounded-full border border-stone-200/60 overflow-hidden"
          >
            {/* The Magnetic Sliding Pink Pill — Anchored inside capsule */}
            <div
              className="absolute top-1 bottom-1 rounded-full pointer-events-none z-0 will-change-transform"
              style={{
                transform: `translateX(${pillStyle.left}px)`,
                width: `${pillStyle.width}px`,
                opacity: pillStyle.opacity,
                transition: 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1) 50ms, width 450ms cubic-bezier(0.22, 1, 0.36, 1) 50ms, opacity 200ms ease',
                background:
                  theme === 'tema-b'
                    ? 'linear-gradient(135deg, #6B2D5C 0%, #8E3A7B 100%)'
                    : theme === 'tema-c'
                    ? 'linear-gradient(135deg, #FF6B81 0%, #FFA07A 100%)'
                    : 'linear-gradient(135deg, #F4A7B9 0%, #FF8DA1 100%)',
                boxShadow:
                  theme === 'tema-b'
                    ? '0 2px 8px rgba(107, 45, 92, 0.3)'
                    : '0 2px 8px rgba(244, 167, 185, 0.35)',
              }}
            />

            {navMenuItems.map((menu) => {
              const isActive = activeSection === menu.id;
              return (
                <button
                  key={menu.id}
                  ref={(el) => {
                    menuRefs.current[menu.id] = el;
                  }}
                  onClick={() => handleNavClick(menu.id)}
                  className={`relative z-10 px-3 2xl:px-3.5 py-1.5 text-xs font-black rounded-full transition-colors duration-400 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-white drop-shadow-2xs'
                      : 'text-stone-700 hover:text-rose-600'
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
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (!isSearchOpen) setIsMobileNavOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                isSearchOpen || searchQuery
                  ? 'border-theme-primary bg-theme-surface-subtle text-theme-primary shadow-2xs'
                  : 'border-theme-border bg-white hover:bg-theme-surface-subtle text-theme-text-main'
              }`}
              title={isSearchOpen ? 'Tutup Pencarian' : 'Cari Buket Bunga'}
              aria-label="Cari Buket Bunga"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {searchQuery ? `"${searchQuery.slice(0, 8)}..."` : 'Cari'}
              </span>
            </button>

            {/* Masuk / Akun Pelanggan Link */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-full border border-theme-border bg-white hover:bg-theme-surface-subtle text-theme-text-main text-xs font-bold transition-all shadow-2xs flex-shrink-0"
              title="Masuk / Akun Pelanggan"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline" suppressHydrationWarning>
                {mounted && user ? user.name.split(' ')[0] : 'Masuk'}
              </span>
            </Link>

            {/* Cart Drawer Trigger with Magic UI Cart Bump Animation */}
            <button
              id="navCartBtn"
              onClick={() => setIsCartOpen(true)}
              className={`btn-nav-cart relative flex items-center justify-center gap-1.5 px-3 sm:px-4 h-9 active:scale-95 transition-all flex-shrink-0 cursor-pointer ${
                cartBump ? 'cart-bump' : ''
              }`}
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold text-xs">Keranjang</span>
              <span
                className="cart-badge text-[10px] font-black px-1.5 py-0.5 rounded-full"
                suppressHydrationWarning
              >
                {mounted ? totalItems : 0}
              </span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => {
                setIsMobileNavOpen(!isMobileNavOpen);
                if (!isMobileNavOpen) setIsSearchOpen(false);
              }}
              className="xl:hidden p-2 text-stone-700 hover:text-theme-primary rounded-lg focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sleek Search Dropdown (Works on all screen sizes) */}
        {isSearchOpen && (
          <div className="py-2.5 border-t border-theme-border bg-white/98 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-2xl mx-auto relative flex items-center">
              <Search className="w-4 h-4 text-theme-primary absolute left-3.5 pointer-events-none" />
              <input
                autoFocus
                type="text"
                placeholder="Cari buket wisuda, mawar velvet, tulip, sidang, mini pot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setIsSearchOpen(false);
                    if (typeof window !== 'undefined') {
                      if (window.location.pathname !== '/') {
                        window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
                      } else {
                        const el = document.getElementById('katalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }
                }}
                className="w-full pl-10 pr-20 py-2 text-xs sm:text-sm bg-theme-surface-subtle border border-theme-border rounded-full focus:outline-none focus:ring-2 focus:ring-theme-primary focus:bg-white transition-all placeholder:text-stone-400"
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
                  className="px-2 py-0.5 text-[11px] font-bold text-stone-500 hover:text-theme-primary hover:bg-theme-surface-subtle rounded-full transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Horizontal Navigation Pills Bar */}
        <div
          ref={mobileNavRef}
          className="xl:hidden overflow-x-auto scrollbar-none py-2 flex items-center gap-1.5 border-t border-theme-border -mx-4 px-4 sm:-mx-6 sm:px-6"
        >
          {navMenuItems.map((menu) => {
            const isActive = activeSection === menu.id;
            return (
              <button
                key={menu.id}
                ref={(el) => {
                  mobileMenuRefs.current[menu.id] = el;
                }}
                onClick={() => handleNavClick(menu.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'btn-primary-atelier text-white shadow-2xs scale-105'
                    : 'bg-stone-50 text-stone-700 hover:bg-theme-surface-subtle'
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
        <div className="xl:hidden border-t border-theme-border bg-white/95 backdrop-blur-md px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
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
                  className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'btn-primary-atelier text-white shadow-xs'
                      : 'hover:bg-theme-surface-subtle text-stone-800'
                  }`}
                >
                  {menu.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-theme-border flex items-center justify-between text-xs font-bold text-stone-600 px-2">
            <Link href="/portal" className="hover:text-theme-primary">
              📦 Portal Pelanggan
            </Link>
            <Link href="/admin" className="hover:text-theme-primary text-amber-700">
              ⚙️ Admin Atelier
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
