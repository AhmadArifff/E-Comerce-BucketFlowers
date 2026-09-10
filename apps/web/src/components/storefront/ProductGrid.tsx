'use client';

import React from 'react';
import type { ExtendedProduct } from '@chenille/shared';
import { ProductCard } from './ProductCard';
import { Flower2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: ExtendedProduct[];
  onSelectProduct?: (product: ExtendedProduct) => void;
  page?: number;
  totalPages?: number;
  totalProducts?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  page = 1,
  totalPages = 1,
  totalProducts = 0,
  limit = 12,
  onPageChange,
  onResetFilters,
}) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-rose-100 p-12 text-center my-8 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3">
          <Flower2 className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-stone-800">Tidak ada buket yang cocok</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
          Tidak ada buket yang memenuhi kombinasi filter dan pencarian yang Anda pilih saat ini.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-theme-primary text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Semua Filter</span>
          </button>
        )}
      </div>
    );
  }

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalProducts || products.length);

  return (
    <div className="space-y-6 my-6">
      {/* Product Card Grid (3 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>

      {/* Pagination Bar (PRD 7.18) */}
      {totalPages > 1 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-theme-border">
          <div className="text-xs text-stone-400 font-medium">
            Menampilkan <strong className="text-stone-700">{startItem}-{endItem}</strong> dari{' '}
            <strong className="text-stone-700">{totalProducts || products.length}</strong> buket
          </div>

          <div className="flex items-center gap-1.5">
            {/* Previous Page Button */}
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => {
                onPageChange(page - 1);
                const el = document.getElementById('katalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Page Number Pills */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isCurrent = p === page;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      onPageChange(p);
                      const el = document.getElementById('katalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-theme-primary text-white shadow-xs'
                        : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => {
                onPageChange(page + 1);
                const el = document.getElementById('katalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
