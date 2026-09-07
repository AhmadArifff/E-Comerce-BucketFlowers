'use client';

import React from 'react';
import type { ExtendedProduct } from '@chenille/shared';
import { ProductCard } from './ProductCard';
import { Flower2 } from 'lucide-react';

interface ProductGridProps {
  products: ExtendedProduct[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-rose-100 p-12 text-center my-8 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3">
          <Flower2 className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-stone-800">Tidak ada buket yang sesuai pencarian</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
          Coba ganti kata kunci pencarian Anda atau pilih kategori buket lainnya di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 my-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
