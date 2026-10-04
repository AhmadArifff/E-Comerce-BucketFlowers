'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Palette, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Plus, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useChatStore } from '@/stores/useChatStore';
import { showMagicToast } from '@/lib/magic-motion';
import { getApiUrl } from '@/lib/api-client';
import type { ParsedActionTag } from '@/lib/chat-interactive-parser';

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  isReadyStock: boolean;
  leadTimeDays?: number;
  category?: string;
}

interface ChatProductCardProps {
  productId: string;
  productName: string;
  onNavigate?: () => void;
}

export const ChatProductCard: React.FC<ChatProductCardProps> = ({
  productId,
  productName,
  onNavigate,
}) => {
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        // Try direct product fetch or search
        const res = await fetch(getApiUrl(`/api/v1/products?search=${encodeURIComponent(productName)}`));
        if (res.ok) {
          const json = await res.json();
          const items = json.data?.items || json.data || [];
          const found = items.find((p: any) => p.id === productId || p.name.toLowerCase() === productName.toLowerCase()) || items[0];
          if (found && isMounted) {
            setProduct({
              id: found.id || productId,
              name: found.name || productName,
              price: Number(found.price || 85000),
              imageUrl: found.images?.[0]?.image_url || found.image_url || '',
              isReadyStock: Boolean(found.is_ready_stock ?? true),
              leadTimeDays: Number(found.po_lead_days || 1),
              category: found.category?.name || found.category || 'Atelier Bouquet',
            });
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to load product card info:', err);
      }

      if (isMounted) {
        // Fallback product info from name
        setProduct({
          id: productId,
          name: productName,
          price: 85000,
          imageUrl: '',
          isReadyStock: true,
          leadTimeDays: 1,
          category: 'Kawat Bulu Handmade',
        });
        setIsLoading(false);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [productId, productName]);

  const handleAddToCart = () => {
    if (!product) return;
    const cartProduct: any = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.imageUrl ? [{ image_url: product.imageUrl, is_primary: true }] : [],
      isReadyStock: product.isReadyStock,
      leadTimeDays: product.leadTimeDays || 1,
      category: product.category,
      stemCount: 1,
    };

    addItem(cartProduct, 1);
    showMagicToast('Buket Ditambahkan! 🌸', `${product.name} telah masuk ke keranjang belanja.`, '🛒');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="mt-2 p-2.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3 animate-pulse">
        <div className="w-12 h-12 rounded-xl bg-stone-200 flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-stone-200 rounded-md w-3/4" />
          <div className="h-2.5 bg-stone-200 rounded-md w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="mt-2.5 p-2.5 bg-white border border-rose-100 hover:border-rose-200 rounded-2xl shadow-xs transition-all flex flex-col gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Bouquet Thumbnail */}
        <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If broken image, fallback to icon
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="text-xl">🌸</span>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                product.isReadyStock
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {product.isReadyStock ? '⚡ Ready Stock' : `⏳ PO ~${product.leadTimeDays || 1} Hari`}
            </span>
          </div>

          <h4
            className="text-[12px] font-bold text-stone-900 truncate mt-0.5 leading-snug"
            title={product.name}
          >
            {product.name}
          </h4>

          <div className="text-[12px] font-extrabold text-rose-600 mt-0.5">
            Rp {product.price.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-stone-100">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isAdded
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm active:scale-95'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Sudah di Keranjang</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Pesan Buket Ini</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            // 1. Dispatch global select-product-by-id to open ProductDetailModal
            window.dispatchEvent(
              new CustomEvent('select-product-by-id', {
                detail: { productId: product.id },
              })
            );
            // 2. Also smooth scroll to catalog if needed
            const el = document.getElementById('katalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            // 3. Minimize chat to show modal clearly
            useChatStore.getState().setIsOpen(false);
            if (onNavigate) onNavigate();
          }}
          className="px-2.5 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
          title="Lihat foto detail dan spesifikasi lengkap buket"
        >
          <span>Detail</span>
          <ArrowRight className="w-3 h-3 text-stone-400" />
        </button>
      </div>
    </div>
  );
};

interface ChatActionChipsProps {
  actions: ParsedActionTag[];
  onActionTriggered?: () => void;
}

export const ChatActionChips: React.FC<ChatActionChipsProps> = ({
  actions,
  onActionTriggered,
}) => {
  if (!actions || actions.length === 0) return null;

  const handleActionClick = (action: ParsedActionTag) => {
    const { type, params } = action;

    if (type === 'OPEN_STUDIO') {
      const el = document.getElementById('custom') || document.getElementById('custom-studio');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#custom';
      }
      useChatStore.getState().setIsOpen(false);
      if (onActionTriggered) onActionTriggered();
    } else if (type === 'TRACK_ORDER') {
      const inv = params?.inv || '';
      if (inv) {
        window.location.href = `/lacak-pesanan?inv=${encodeURIComponent(inv)}`;
      } else {
        window.location.href = '/lacak-pesanan';
      }
      useChatStore.getState().setIsOpen(false);
      if (onActionTriggered) onActionTriggered();
    } else if (type === 'VIEW_COD') {
      // 1. Open the dedicated 6 campus COD modal via Zustand reactive store!
      useChatStore.getState().openCodModal();
      // 2. Also scroll to #cod-meetup anchor
      const el = document.getElementById('cod-meetup');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      // 3. Fallback event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-cod-modal'));
      }
      useChatStore.getState().setIsOpen(false);
      if (onActionTriggered) onActionTriggered();
    } else if (type === 'VIEW_CATALOG') {
      const el = document.getElementById('katalog') || document.querySelector('main');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#katalog';
      }
      useChatStore.getState().setIsOpen(false);
      if (onActionTriggered) onActionTriggered();
    } else if (type === 'VIEW_WARRANTY') {
      const el = document.getElementById('bantuan') || document.getElementById('warranty-help');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#bantuan';
      }
      useChatStore.getState().setIsOpen(false);
      if (onActionTriggered) onActionTriggered();
    } else {
      // Generic fallback
      const el = document.getElementById('katalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#katalog';
      }
      useChatStore.getState().setIsOpen(false);
      if (onActionTriggered) onActionTriggered();
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'OPEN_STUDIO':
        return <Palette className="w-3.5 h-3.5 text-purple-600" />;
      case 'TRACK_ORDER':
        return <Search className="w-3.5 h-3.5 text-indigo-600" />;
      case 'VIEW_COD':
        return <MapPin className="w-3.5 h-3.5 text-amber-600" />;
      case 'VIEW_CATALOG':
        return <ShoppingBag className="w-3.5 h-3.5 text-rose-600" />;
      case 'VIEW_WARRANTY':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-rose-600" />;
    }
  };

  return (
    <div className="mt-2 flex flex-wrap gap-1.5 pt-1">
      {actions.map((act, idx) => (
        <button
          key={`${act.type}-${idx}`}
          type="button"
          onClick={() => handleActionClick(act)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-stone-50 to-white hover:from-rose-50 hover:to-pink-50 border border-stone-200/90 hover:border-rose-300 rounded-full text-[11px] font-bold text-stone-700 hover:text-rose-700 shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer text-left"
        >
          {getActionIcon(act.type)}
          <span>{act.label}</span>
          <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-rose-500" />
        </button>
      ))}
    </div>
  );
};
