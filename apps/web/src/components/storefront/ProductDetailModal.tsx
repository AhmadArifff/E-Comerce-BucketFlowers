'use client';

import React, { useState } from 'react';
import { X, Star, Sparkles, ShoppingBag, Clock, ShieldCheck, Heart, Check, Plus, Minus } from 'lucide-react';
import type { ExtendedProduct } from '@chenille/shared';
import { useCartStore } from '@/stores/useCartStore';
import { flyToCart, showMagicToast } from '@/lib/magic-motion';

interface ProductDetailModalProps {
  product: ExtendedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addItem, setIsCartOpen } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [greetingCardText, setGreetingCardText] = useState('');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const activePrice = product.discountPrice ?? product.price;
  const totalPrice = activePrice * quantity;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    flyToCart(e.currentTarget, '🌸');
    addItem(product, quantity);
    setIsAddedSuccess(true);
    showMagicToast(
      'Berhasil Ditambahkan! 🌸',
      `${product.name} (${quantity} pcs)`,
      '🌸',
      'Lihat Keranjang 🛍️',
      () => setIsCartOpen(true)
    );
    setTimeout(() => {
      setIsAddedSuccess(false);
    }, 1800);
  };

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    flyToCart(e.currentTarget, '🌸');
    addItem(product, quantity);
    onClose();
    setTimeout(() => {
      setIsCartOpen(true);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-2xl w-full overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-600 flex items-center justify-center shadow-md transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image Side */}
          <div className="relative aspect-square sm:aspect-auto sm:h-full bg-rose-50 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                {product.badge}
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-rose-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400 font-normal">({product.reviewCount} ulasan)</span>
              </div>
              <div className="flex items-center gap-1 text-rose-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Garansi 100%</span>
              </div>
            </div>
          </div>

          {/* Details Side */}
          <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">
                  {product.category} Series
                </span>
                <h2 className="text-lg sm:text-xl font-black text-stone-800 tracking-tight leading-snug mt-0.5">
                  {product.name}
                </h2>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-rose-600">
                  Rp {activePrice.toLocaleString('id-ID')}
                </span>
                {product.discountPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                )}
              </div>

              {/* Status & Quota Lead Time */}
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  product.isReadyStock
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {product.isReadyStock ? '● Ready Stock' : `● Pre-Order (${product.poLeadDays} Hari)`}
                </span>
                <span className="text-stone-400 text-[11px]">
                  Sisa Kuota: <strong>{product.stock} pcs</strong>
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Bill of Materials Ringkas */}
              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 text-xs space-y-1.5">
                <div className="font-extrabold text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>Komposisi Rangkaian Chenille:</span>
                </div>
                <ul className="text-[11px] text-stone-600 list-disc list-inside space-y-0.5">
                  <li>Kawat bulu chenille 6mm halus lembut anti-rontok</li>
                  <li>Wrapping kertas cellophane matte Korea water-resistant</li>
                  <li>Pita satin mewah & kartu ucapan wisuda atelier</li>
                </ul>
              </div>

              {/* Greeting Card Input */}
              <div>
                <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                  Kartu Ucapan Kustom (Opsional)
                </label>
                <input
                  type="text"
                  value={greetingCardText}
                  onChange={(e) => setGreetingCardText(e.target.value)}
                  placeholder="Contoh: Happy Graduation Sarah Amalia, S.Psi!"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-rose-500 text-stone-800"
                />
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-stone-700">Jumlah Buket:</span>
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-stone-200 text-stone-600 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-800 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 hover:bg-stone-200 text-stone-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-2 border-t border-rose-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-semibold">Total Estimasi:</span>
                <span className="text-base font-black text-rose-600">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`py-2.5 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    isAddedSuccess
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {isAddedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Masuk Keranjang!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>+ Keranjang</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Beli Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
