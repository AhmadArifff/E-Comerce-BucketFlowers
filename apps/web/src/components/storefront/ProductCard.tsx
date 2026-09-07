'use client';

import React from 'react';
import { ShoppingBag, Star, Eye, MessageCircle, Clock } from 'lucide-react';
import type { ExtendedProduct } from '@chenille/shared';
import { useCartStore } from '@/stores/useCartStore';
import { useChatStore } from '@/stores/useChatStore';

interface ProductCardProps {
  product: ExtendedProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { setIsOpen: setChatOpen, sendMessage } = useChatStore();

  const handleAskAboutProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatOpen(true);
    sendMessage(`Halo kak, saya mau tanya kustomisasi warna buket "${product.name}"`);
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group card-hover-3d relative">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-rose-50/50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge: Best seller / Ready Stock */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
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
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-600 hover:bg-rose-600 hover:text-white shadow-md transition-all active:scale-90"
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
            <span className="font-semibold text-rose-500 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-300 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-extrabold text-sm sm:text-base text-stone-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-rose-50 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-rose-600 leading-tight">
              Rp {(product.discountPrice ?? product.price).toLocaleString('id-ID')}
            </div>
            {product.discountPrice && (
              <span className="text-xs text-stone-400 line-through">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          <button
            onClick={() => addItem(product, 1)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>
    </div>
  );
};
