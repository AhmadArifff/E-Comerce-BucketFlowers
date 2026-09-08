'use client';

import React, { useState } from 'react';
import { ShoppingBag, Star, Eye, MessageCircle, Clock } from 'lucide-react';
import type { ExtendedProduct } from '@chenille/shared';
import { useCartStore } from '@/stores/useCartStore';
import { useChatStore } from '@/stores/useChatStore';
import { flyToCart, showMagicToast } from '@/lib/magic-motion';

interface ProductCardProps {
  product: ExtendedProduct;
  onSelectProduct?: (product: ExtendedProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addItem, setIsCartOpen } = useCartStore();
  const { setIsOpen: setChatOpen, sendMessage } = useChatStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAskAboutProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatOpen(true);
    sendMessage(`Halo kak, saya mau tanya kustomisasi warna buket "${product.name}"`);
  };

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="card-atelier overflow-hidden flex flex-col group relative cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-theme-surface-subtle">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge: Best seller / Ready Stock */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="badge-atelier text-[10px] px-2.5 py-1 tracking-wider">
              {product.badge}
            </span>
          )}
          {product.isReadyStock ? (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Ready Stock ({product.stock})
            </span>
          ) : (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              PO {product.poLeadDays} Hari
            </span>
          )}
        </div>

        {/* Quick Consultation Float Button */}
        <button
          onClick={handleAskAboutProduct}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-theme-primary hover:bg-theme-primary hover:text-white shadow-md transition-all active:scale-90"
          title="Tanya Florist tentang buket ini"
        >
          <MessageCircle className="w-4 h-4" />
        </button>

        {/* Views Counter */}
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span>{product.clickCount}</span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="font-semibold text-theme-primary uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-300 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-extrabold text-sm sm:text-base text-theme-text-main line-clamp-1 group-hover:text-theme-primary transition-colors font-heading">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-theme-border/60 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-theme-primary leading-tight">
              Rp {(product.discountPrice ?? product.price).toLocaleString('id-ID')}
            </div>
            {product.discountPrice && (
              <span className="text-xs text-stone-400 line-through">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectProduct) onSelectProduct(product);
              }}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 active:scale-95 text-xs font-bold transition-all"
              title="Intip Rincian Buket"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              disabled={isAdding}
              onClick={(e) => {
                e.stopPropagation();
                if (isAdding) return;
                setIsAdding(true);
                addItem(product, 1);
                flyToCart(e.currentTarget, '🌸', () => {
                  setIsAdding(false);
                  setIsCartOpen(true);
                });
                const price = product.discountPrice ?? product.price;
                showMagicToast(
                  'Berhasil Ditambahkan! 🌸',
                  `${product.name} (Rp ${price.toLocaleString('id-ID')})`,
                  '🌸'
                );
              }}
              className="btn-card-add cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Menerbangkan...' : 'Tambah'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
