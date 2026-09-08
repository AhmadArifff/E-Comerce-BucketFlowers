'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Navbar } from '@/components/storefront/Navbar';
import { HeroSection } from '@/components/storefront/HeroSection';
import { CapacityWidget } from '@/components/storefront/CapacityWidget';
import { CategoryFilter } from '@/components/storefront/CategoryFilter';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { CustomStudioSection } from '@/components/storefront/CustomStudioSection';
import { LookbookSection } from '@/components/storefront/LookbookSection';
import { QuickTrackingSection } from '@/components/storefront/QuickTrackingSection';
import { WarrantyHelpSection } from '@/components/storefront/WarrantyHelpSection';
import { ProductDetailModal } from '@/components/storefront/ProductDetailModal';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { LiveChatWidget } from '@/components/storefront/LiveChatWidget';
import { Footer } from '@/components/storefront/Footer';
import type { ExtendedProduct } from '@chenille/shared';
import { MOCK_PRODUCTS } from '@chenille/shared';
import { useThemeStore } from '@/stores/useThemeStore';

export default function StorefrontPage() {
  const { theme } = useThemeStore();
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [productsList, setProductsList] = useState<ExtendedProduct[]>(MOCK_PRODUCTS);

  // Fetch real products from Supabase API
  useEffect(() => {
    fetch('/api/v1/products')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.products?.length > 0) {
          setProductsList(res.data.products);
        }
      })
      .catch((err) => console.warn('Could not load products from Supabase API, using fallback:', err));
  }, []);

  // Sync data-theme attribute on client mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Smooth navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle URL hash or search params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveSection(hash);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }

      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get('search');
      if (searchParam) {
        setSearchQuery(searchParam);
        setTimeout(() => {
          const el = document.getElementById('katalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    }
  }, []);

  // Intersection observer to highlight current nav menu on scroll
  useEffect(() => {
    const sections = ['home', 'katalog', 'custom', 'lookbook', 'tracking', 'bantuan'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchCategory =
        selectedCategory === 'ALL' || product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [productsList, selectedCategory, searchQuery]);

  return (
    <div className="flex-1 flex flex-col">
      <AnnouncementBar />
      
      {/* 6-MENU FIXED NAVBAR (NO PUBLIC THEME SWITCHER) */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {/* 1. BERANDA / HERO SECTION */}
        <HeroSection onNavigate={handleNavigate} />

        {/* 2. KATALOG BUNGA & FILTER KATEGORI */}
        <div id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
          {/* Capacity Throttling Bar */}
          <CapacityWidget />

          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-black text-theme-primary uppercase tracking-widest mb-1">
                Koleksi Bunga Kawat Bulu Atelier
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-theme-text-main tracking-tight font-heading">
                Katalog Lengkap Buket Bunga
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Temukan buket kawat bulu istimewa yang dirangkai teliti untuk setiap momen kebahagiaan Anda
              </p>
            </div>

            <div className="text-xs text-stone-500 font-bold bg-stone-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
              Menampilkan {filteredProducts.length} buket pilihan
            </div>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <ProductGrid
            products={filteredProducts}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
          />
        </div>

        {/* 3. CUSTOM STUDIO (INTERAKTIF KE WHATSAPP & CART) */}
        <CustomStudioSection />

        {/* 4. LOOKBOOK & INSPIRASI PELANGGAN */}
        <LookbookSection />

        {/* 5. LACAK STATUS PESANAN */}
        <QuickTrackingSection />

        {/* 6. BANTUAN, PERAWATAN & GARANSI 100% */}
        <WarrantyHelpSection />
      </main>

      <CartDrawer />
      <LiveChatWidget />

      {/* Product Quick View Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Footer />
    </div>
  );
}
