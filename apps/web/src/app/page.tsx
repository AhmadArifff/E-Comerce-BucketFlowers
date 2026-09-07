'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Navbar } from '@/components/storefront/Navbar';
import { HeroSection } from '@/components/storefront/HeroSection';
import { CapacityWidget } from '@/components/storefront/CapacityWidget';
import { CategoryFilter } from '@/components/storefront/CategoryFilter';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { LiveChatWidget } from '@/components/storefront/LiveChatWidget';
import { Footer } from '@/components/storefront/Footer';
import { MOCK_PRODUCTS } from '@chenille/shared';
import { useThemeStore } from '@/stores/useThemeStore';

export default function StorefrontPage() {
  const { theme } = useThemeStore();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync data-theme attribute on client mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchCategory =
        selectedCategory === 'ALL' || product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex-1 flex flex-col">
      <AnnouncementBar />
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-1">
        <HeroSection />

        <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Capacity Throttling Bar */}
          <CapacityWidget />

          {/* Section Heading & Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">
                Koleksi Estetik Atelier
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight">
                Katalog Buket Kawat Bulu Terpopuler
              </h2>
            </div>

            <div className="text-xs text-stone-500 font-semibold">
              Menampilkan {filteredProducts.length} buket pilihan
            </div>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <ProductGrid products={filteredProducts} />
        </div>
      </main>

      <CartDrawer />
      <LiveChatWidget />
      <Footer />
    </div>
  );
}
