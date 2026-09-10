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
  selectedCourier: any | null;
  customShippingFee: number | null;
  voucherCode: string;
  discountAmount: number;
  usePoints: boolean;
  pointsDiscount: number;
  redeemPointsAmount: number;

  setIsCartOpen: (isOpen: boolean) => void;
  addItem: (product: ExtendedProduct, quantity?: number, notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setFulfillmentType: (type: 'COD_MEETUP_POINT' | 'COURIER_EXPEDITION') => void;
  setSelectedCodPointId: (id: string) => void;
  setSelectedCourier: (courier: any | null) => void;
  setCustomShippingFee: (fee: number | null) => void;
  applyVoucher: (code: string) => { success: boolean; message: string };
  setVoucherDiscount: (code: string, amount: number) => void;
  removeVoucher: () => void;
  togglePoints: (userBalance: number) => void;
  setRedeemPointsAmount: (points: number, userBalance: number) => void;
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
      selectedCourier: null,
      customShippingFee: null,
      voucherCode: '',
      discountAmount: 0,
      usePoints: false,
      pointsDiscount: 0,
      redeemPointsAmount: 0,

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

      setFulfillmentType: (type) =>
        set((state) => ({
          fulfillmentType: type,
          customShippingFee: type === 'COD_MEETUP_POINT' ? 0 : state.customShippingFee,
        })),
      setSelectedCodPointId: (id) => set({ selectedCodPointId: id }),
      setSelectedCourier: (courier) =>
        set({
          selectedCourier: courier,
          customShippingFee: courier ? courier.shipment_fee : null,
        }),
      setCustomShippingFee: (fee) => set({ customShippingFee: fee }),

      // Dynamic voucher discount setter from backend validation
      setVoucherDiscount: (code, amount) => {
        set({
          voucherCode: code.toUpperCase().trim(),
          discountAmount: Math.max(0, amount),
          // 🔒 Exclusive rule: Kupon aktif → matikan Flower Points
          usePoints: false,
          pointsDiscount: 0,
          redeemPointsAmount: 0,
        });
      },

      applyVoucher: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'WISUDAHEMAT') {
          set({
            voucherCode: clean,
            discountAmount: 25000,
            usePoints: false,
            pointsDiscount: 0,
            redeemPointsAmount: 0,
          });
          return { success: true, message: 'Kupon WISUDAHEMAT berhasil digunakan! Hemat Rp 25.000.' };
        }
        if (clean === 'LOVECHENILLE') {
          set({
            voucherCode: clean,
            discountAmount: 15000,
            usePoints: false,
            pointsDiscount: 0,
            redeemPointsAmount: 0,
          });
          return { success: true, message: 'Kupon LOVECHENILLE diskon berhasil diaktifkan!' };
        }
        if (clean === 'ONGKIRFREE') {
          set({
            voucherCode: clean,
            discountAmount: 15000,
            usePoints: false,
            pointsDiscount: 0,
            redeemPointsAmount: 0,
          });
          return { success: true, message: 'Kupon ONGKIRFREE gratis ongkir Rp 15.000 aktif!' };
        }
        return { success: false, message: 'Kode kupon tidak valid atau sudah kadaluarsa.' };
      },

      removeVoucher: () => set({ voucherCode: '', discountAmount: 0 }),

      // Toggle Flower Points redemption (Kurs: 10 poin = Rp 5.000 / Rp 500 per poin)
      togglePoints: (userBalance) => {
        set((state) => {
          if (!state.usePoints) {
            const subtotal = get().getSubtotal();
            // Maximum points that make sense based on subtotal (Rp 500 per point)
            const maxPointsForSubtotal = Math.floor(subtotal / 500);
            // Must be multiple of 10, min 10
            const availableMultiple = Math.floor(Math.min(userBalance, maxPointsForSubtotal) / 10) * 10;
            const pointsToUse = Math.max(10, Math.min(availableMultiple, 50)); // default 10-50 poin

            if (userBalance < 10) {
              return { usePoints: false, pointsDiscount: 0, redeemPointsAmount: 0 };
            }

            const discount = (pointsToUse / 10) * 5000;
            return {
              usePoints: true,
              pointsDiscount: discount,
              redeemPointsAmount: pointsToUse,
              // 🔒 Exclusive rule: Points aktif → hapus kupon
              voucherCode: '',
              discountAmount: 0,
            };
          }
          return { usePoints: false, pointsDiscount: 0, redeemPointsAmount: 0 };
        });
      },

      // Set specific redeem points amount (kelipatan 10)
      setRedeemPointsAmount: (points, userBalance) => {
        set(() => {
          if (points <= 0) {
            return { usePoints: false, pointsDiscount: 0, redeemPointsAmount: 0 };
          }
          const validPoints = Math.min(Math.floor(points / 10) * 10, userBalance);
          const discount = (validPoints / 10) * 5000;
          return {
            usePoints: validPoints >= 10,
            redeemPointsAmount: validPoints,
            pointsDiscount: validPoints >= 10 ? discount : 0,
            // 🔒 Exclusive rule: Points aktif → hapus kupon
            voucherCode: '',
            discountAmount: 0,
          };
        });
      },

      clearCart: () =>
        set({
          items: [],
          selectedCourier: null,
          customShippingFee: null,
          voucherCode: '',
          discountAmount: 0,
          usePoints: false,
          pointsDiscount: 0,
          redeemPointsAmount: 0,
        }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const price = item.product.discountPrice ?? item.product.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getShippingFee: () => {
        const { fulfillmentType, customShippingFee } = get();
        if (fulfillmentType === 'COD_MEETUP_POINT') return 0;
        return customShippingFee !== null ? customShippingFee : 11000;
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
