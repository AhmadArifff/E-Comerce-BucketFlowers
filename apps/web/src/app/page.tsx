'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Navbar } from '@/components/storefront/Navbar';
import { HeroSection } from '@/components/storefront/HeroSection';
import { CapacityWidget } from '@/components/storefront/CapacityWidget';
import { CategoryFilter } from '@/components/storefront/CategoryFilter';
import { ProductFilterBar, FilterState } from '@/components/storefront/ProductFilterBar';
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
import { getApiUrl } from '@/lib/api-client';

const ITEMS_PER_PAGE = 12;

export default function StorefrontPage() {
  const { theme } = useThemeStore();
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [productsList, setProductsList] = useState<ExtendedProduct[]>(MOCK_PRODUCTS);

  // Multi-criteria filter state (PRD 7.18)
  const [filterState, setFilterState] = useState<FilterState>({
    sort: 'newest',
    readyStockOnly: false,
    discountOnly: false,
    minPrice: null,
    maxPrice: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch real products from Supabase API via backend engine
  useEffect(() => {
    fetch(getApiUrl('/api/v1/products?limit=50'))
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

  // Handle URL hash or search params on mount (PRD 7.18)
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
      const catParam = params.get('category');
      const sortParam = params.get('sort');
      const readyParam = params.get('ready_stock') === 'true';
      const discParam = params.get('discount_only') === 'true';
      const minParam = params.get('min_price') ? parseInt(params.get('min_price')!, 10) : null;
      const maxParam = params.get('max_price') ? parseInt(params.get('max_price')!, 10) : null;
      const pageParam = params.get('page') ? parseInt(params.get('page')!, 10) : 1;

      if (searchParam) setSearchQuery(searchParam);
      if (catParam) setSelectedCategory(catParam);
      if (pageParam && !isNaN(pageParam)) setCurrentPage(pageParam);
      setFilterState({
        sort: sortParam || 'newest',
        readyStockOnly: readyParam,
        discountOnly: discParam,
        minPrice: minParam,
        maxPrice: maxParam,
      });

      if (searchParam || catParam || minParam || maxParam || readyParam || discParam) {
        setTimeout(() => {
          const el = document.getElementById('katalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    }
  }, []);

  // URL query params synchronization (PRD 7.18)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
    if (filterState.sort !== 'newest') params.set('sort', filterState.sort);
    if (filterState.readyStockOnly) params.set('ready_stock', 'true');
    if (filterState.discountOnly) params.set('discount_only', 'true');
    if (filterState.minPrice !== null) params.set('min_price', String(filterState.minPrice));
    if (filterState.maxPrice !== null) params.set('max_price', String(filterState.maxPrice));
    if (currentPage > 1) params.set('page', String(currentPage));

    const newQuery = params.toString();
    const newUrl = newQuery ? `${window.location.pathname}?${newQuery}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, selectedCategory, filterState, currentPage]);

  // Listen to select-product event from Navbar auto-suggest
  useEffect(() => {
    const handleSelectProduct = (e: any) => {
      const { productId, slug } = e.detail || {};
      const found = productsList.find((p) => p.id === productId || p.slug === slug);
      if (found) {
        setSelectedProduct(found);
      }
    };
    window.addEventListener('select-product-by-id', handleSelectProduct);
    return () => window.removeEventListener('select-product-by-id', handleSelectProduct);
  }, [productsList]);

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

  // Filter change handler
  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1);
  };

  // Reset all filters
  const handleResetAll = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setFilterState({
      sort: 'newest',
      readyStockOnly: false,
      discountOnly: false,
      minPrice: null,
      maxPrice: null,
    });
    setCurrentPage(1);
  };

  // Filtered & Sorted products pipeline (PRD 7.18)
  const filteredProducts = useMemo(() => {
    let result = productsList.filter((product) => {
      const matchCategory =
        selectedCategory === 'ALL' || product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const isReady = Boolean((product as any).is_ready_stock ?? product.isReadyStock);
      const matchReady = !filterState.readyStockOnly || isReady;

      const dPrice = (product as any).discount_price ?? product.discountPrice;
      const effectivePrice = dPrice !== undefined && dPrice !== null ? Number(dPrice) : Number(product.price);
      const matchMinPrice = filterState.minPrice === null || effectivePrice >= filterState.minPrice;
      const matchMaxPrice = filterState.maxPrice === null || effectivePrice <= filterState.maxPrice;
      const matchDiscount =
        !filterState.discountOnly ||
        (dPrice !== undefined && dPrice !== null && Number(dPrice) < Number(product.price));

      return matchCategory && matchSearch && matchReady && matchMinPrice && matchMaxPrice && matchDiscount;
    });

    // Multi-criteria sorting
    result = [...result].sort((a, b) => {
      const dPriceA = (a as any).discount_price ?? a.discountPrice;
      const dPriceB = (b as any).discount_price ?? b.discountPrice;
      const priceA = dPriceA !== undefined && dPriceA !== null ? Number(dPriceA) : Number(a.price);
      const priceB = dPriceB !== undefined && dPriceB !== null ? Number(dPriceB) : Number(b.price);

      if (filterState.sort === 'price_asc') {
        return priceA - priceB;
      }
      if (filterState.sort === 'price_desc') {
        return priceB - priceA;
      }
      if (filterState.sort === 'popular') {
        const clickA = Number((a as any).click_count ?? a.clickCount ?? 0);
        const clickB = Number((b as any).click_count ?? b.clickCount ?? 0);
        return clickB - clickA;
      }
      // 'newest' default
      const dateStrA = (a as any).created_at;
      const dateStrB = (b as any).created_at;
      const dateA = dateStrA ? new Date(dateStrA).getTime() : 0;
      const dateB = dateStrB ? new Date(dateStrB).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [productsList, selectedCategory, searchQuery, filterState]);

  // Paginated subset
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="flex-1 flex flex-col">
      <AnnouncementBar />
      
      {/* 6-MENU FIXED NAVBAR WITH AUTO-SUGGEST */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
      />

      <main className="flex-1">
        {/* 1. BERANDA / HERO SECTION */}
        <HeroSection onNavigate={handleNavigate} />

        {/* 2. KATALOG BUNGA, MULTI-CRITERIA FILTER & PAGINASI */}
        <div id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
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

          {/* Category Horizontal Pills Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
          />

          {/* Multi-Criteria Filter Bar (PRD 7.18) */}
          <ProductFilterBar
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onResetAll={handleResetAll}
            totalFiltered={filteredProducts.length}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />

          {/* Product Grid with Pagination */}
          <ProductGrid
            products={paginatedProducts}
            page={currentPage}
            totalPages={totalPages}
            totalProducts={filteredProducts.length}
            limit={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            onResetFilters={handleResetAll}
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
