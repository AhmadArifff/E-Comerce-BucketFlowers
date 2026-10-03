'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Star, Sparkles, ShoppingBag, Clock, ShieldCheck, Heart, Check, Plus, Minus, MessageCircle, Flame } from 'lucide-react';
import { ATELIER_CONFIG, type ExtendedProduct } from '@chenille/shared';
import { useCartStore } from '@/stores/useCartStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { flyToCart, showMagicToast } from '@/lib/magic-motion';
import { formatDirectProductWhatsAppUrl } from '@/lib/whatsapp-order';

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
  const { waNumber } = useSettingsStore();
  const [quantity, setQuantity] = useState(1);
  const [greetingCardText, setGreetingCardText] = useState('');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState(
    product?.image || (product as any)?.image_url || '/images/products/buket-mawar-merah-velvet.jpg'
  );

  useEffect(() => {
    if (product) {
      setModalImgSrc(product.image || (product as any).image_url || '/images/products/buket-mawar-merah-velvet.jpg');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const activePhone = waNumber || ATELIER_CONFIG.phone;
  const activePrice = product.discountPrice ?? product.price;
  const totalPrice = activePrice * quantity;
  const estimatedViews = Math.max(14, (product.viewCount || product.clickCount || 0) + 9);

  const handleDirectWhatsAppOrder = () => {
    const url = formatDirectProductWhatsAppUrl({
      waNumber: activePhone,
      productName: product.name,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity,
      greetingCardText,
      isReadyStock: product.isReadyStock,
      poLeadDays: product.poLeadDays,
    });
    window.open(url, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAddedSuccess || isProcessingBuy) return;
    setIsProcessingBuy(true);
    addItem(product, quantity);
    setIsAddedSuccess(true);
    flyToCart(e.currentTarget, '🌸', () => {
      onClose();
      setIsCartOpen(true);
      setIsProcessingBuy(false);
      setIsAddedSuccess(false);
    });
    showMagicToast(
      'Berhasil Ditambahkan! 🌸',
      `${product.name} (${quantity} pcs)`,
      '🌸'
    );
  };

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isProcessingBuy) return;
    setIsProcessingBuy(true);
    addItem(product, quantity);
    // Wait until flower flight (750ms) and sparkle impact finish before closing modal and opening cart drawer
    flyToCart(e.currentTarget, '🌸', () => {
      onClose();
      setIsCartOpen(true);
      setIsProcessingBuy(false);
    });
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
          <div className="relative aspect-square sm:aspect-auto sm:h-full bg-theme-surface-subtle overflow-hidden">
            <Image
              src={modalImgSrc}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
              onError={() => setModalImgSrc('/images/products/buket-mawar-merah-velvet.jpg')}
            />
            {product.badge && (
              <div className="absolute top-4 left-4 badge-atelier text-[10px] font-black uppercase tracking-wider px-2.5 py-1 shadow-md">
                {product.badge}
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-theme-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400 font-normal">({product.reviewCount} ulasan)</span>
              </div>
              <div className="flex items-center gap-1 text-theme-primary font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Garansi 100%</span>
              </div>
            </div>
          </div>

          {/* Details Side */}
          <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-theme-primary">
                  {product.category} Series
                </span>
                <h2 className="text-lg sm:text-xl font-black text-stone-800 tracking-tight leading-snug mt-0.5">
                  {product.name}
                </h2>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-theme-primary">
                  Rp {activePrice.toLocaleString('id-ID')}
                </span>
                {product.discountPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                )}
              </div>

              {/* Social Proof & Live Interest */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-900 text-[11px] font-bold">
                <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500 animate-pulse flex-shrink-0" />
                <span>
                  <strong className="text-orange-950 font-black">{estimatedViews} orang</strong> sedang melihat buket ini hari ini
                </span>
              </div>

              {/* Status & Quota Lead Time with Urgency Indicators */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1.5 ${
                  product.isReadyStock
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {product.isReadyStock ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Ready Stock (Siap Kirim / COD)
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-amber-700" />
                      Pre-Order (~{product.poLeadDays} Hari Kerja)
                    </>
                  )}
                </span>

                {product.stock <= 5 ? (
                  <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 animate-pulse">
                    🚨 Sisa {product.stock} buket siap rangkai!
                  </span>
                ) : (
                  <span className="text-stone-400 text-[11px]">
                    Sisa Kuota: <strong>{product.stock} pcs</strong>
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Bill of Materials Ringkas */}
              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 text-xs space-y-1.5">
                <div className="font-extrabold text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-theme-primary" />
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
            <div className="space-y-2 pt-2 border-t border-theme-border/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-semibold">Total Estimasi:</span>
                <span className="text-base font-black text-theme-primary">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`py-2.5 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    isAddedSuccess
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'border-theme-border bg-theme-surface-subtle text-theme-primary hover:opacity-90'
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
                  disabled={isProcessingBuy}
                  onClick={handleBuyNow}
                  className="btn-primary-atelier py-2.5 text-xs font-black shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <span>{isProcessingBuy ? 'Menyiapkan Keranjang...' : 'Beli Sekarang'}</span>
                </button>
              </div>

              {/* Direct WhatsApp Ordering Button */}
              <button
                type="button"
                onClick={handleDirectWhatsAppOrder}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                title="Pesan langsung dan konsultasi cepat ke nomor WhatsApp pengrajin atelier"
              >
                <MessageCircle className="w-4 h-4 fill-white/20 text-white" />
                <span>Pesan Langsung via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
