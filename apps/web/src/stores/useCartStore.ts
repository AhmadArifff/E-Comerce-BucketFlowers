'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExtendedProduct } from '@chenille/shared';

export interface CartItem {
  product: ExtendedProduct;
  quantity: number;
  customNotes?: string;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  fulfillmentType: 'COD_MEETUP_POINT' | 'COURIER_EXPEDITION';
  selectedCodPointId: string;
  voucherCode: string;
  discountAmount: number;
  usePoints: boolean;
  pointsDiscount: number;

  setIsCartOpen: (isOpen: boolean) => void;
  addItem: (product: ExtendedProduct, quantity?: number, notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setFulfillmentType: (type: 'COD_MEETUP_POINT' | 'COURIER_EXPEDITION') => void;
  setSelectedCodPointId: (id: string) => void;
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;
  togglePoints: (userBalance: number) => void;
  clearCart: () => void;

  getSubtotal: () => number;
  getShippingFee: () => number;
  getGrandTotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      fulfillmentType: 'COD_MEETUP_POINT',
      selectedCodPointId: 'cod-001',
      voucherCode: '',
      discountAmount: 0,
      usePoints: false,
      pointsDiscount: 0,

      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      addItem: (product, quantity = 1, notes = '') => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.product.id === product.id);
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            if (notes) updated[existingIndex].customNotes = notes;
            return { items: updated };
          }
          return {
            items: [...state.items, { product, quantity, customNotes: notes }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, delta) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.product.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);
          return { items: updated };
        });
      },

      setFulfillmentType: (type) => set({ fulfillmentType: type }),
      setSelectedCodPointId: (id) => set({ selectedCodPointId: id }),

      applyVoucher: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'WISUDA10K') {
          set({ voucherCode: clean, discountAmount: 10000 });
          return { success: true, message: 'Voucher Potongan Rp 10.000 berhasil digunakan!' };
        }
        if (clean === 'KOREANPASTEL') {
          set({ voucherCode: clean, discountAmount: 15000 });
          return { success: true, message: 'Voucher Diskon Rp 15.000 berhasil diaktifkan!' };
        }
        return { success: false, message: 'Kode voucher tidak valid atau sudah kedaluwarsa.' };
      },

      removeVoucher: () => set({ voucherCode: '', discountAmount: 0 }),

      togglePoints: (userBalance) => {
        set((state) => {
          if (!state.usePoints) {
            // 1 point = Rp 100, max discount 50 points = Rp 5.000 or up to available
            const pointsToUse = Math.min(userBalance, 100);
            return { usePoints: true, pointsDiscount: pointsToUse * 100 };
          }
          return { usePoints: false, pointsDiscount: 0 };
        });
      },

      clearCart: () =>
        set({
          items: [],
          voucherCode: '',
          discountAmount: 0,
          usePoints: false,
          pointsDiscount: 0,
        }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const price = item.product.discountPrice ?? item.product.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getShippingFee: () => {
        const { fulfillmentType } = get();
        return fulfillmentType === 'COD_MEETUP_POINT' ? 0 : 15000;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingFee();
        const discount = get().discountAmount;
        const points = get().pointsDiscount;
        return Math.max(0, subtotal + shipping - discount - points);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'chenille_cart_storage',
    }
  )
);
