'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MockOrder, WarrantyClaim, WarrantyStatus } from '@chenille/shared';

export type { MockOrder, MockOrder as Order, WarrantyClaim, WarrantyStatus } from '@chenille/shared';

const isLegacyMockOrder = (id: string) => /^ord-10[1-6]$/i.test((id || '').trim());
const isLegacyMockWarranty = (id: string) => /^warr-10[1-3]$/i.test((id || '').trim());

/**
 * Ensures strict uniqueness of order list by ID / invoiceNumber.
 * Prevents React duplicate key errors across component updates.
 */
export function deduplicateOrders(orders: MockOrder[]): MockOrder[] {
  if (!Array.isArray(orders)) return [];
  const map = new Map<string, MockOrder>();
  for (const o of orders) {
    if (!o) continue;
    const key = (o.id || o.invoiceNumber || '').trim();
    if (!key || isLegacyMockOrder(key)) continue;
    if (map.has(key)) {
      const prev = map.get(key)!;
      map.set(key, { ...prev, ...o });
    } else {
      map.set(key, o);
    }
  }
  return Array.from(map.values());
}

interface OrderState {
  orders: MockOrder[];
  activeOrderId: string;
  warrantyClaims: WarrantyClaim[];
  setActiveOrderId: (id: string) => void;
  updateOrderStep: (orderId: string, step: number) => void;
  findOrderByQuery: (query: string) => MockOrder | null;
  addNewOrder: (order: MockOrder) => void;
  syncDbOrders: (incomingOrders: MockOrder[]) => void;
  addWarrantyClaim: (claim: Omit<WarrantyClaim, 'id' | 'createdAt' | 'status'>) => WarrantyClaim;
  updateWarrantyClaimStatus: (claimId: string, status: WarrantyStatus, adminNote?: string) => void;
  resetOrdersToDefault: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      activeOrderId: '',
      warrantyClaims: [],

      setActiveOrderId: (id) => set({ activeOrderId: id }),

      updateOrderStep: (orderId, step) => {
        const stepMap: Record<number, { status: MockOrder['stepStatus']; label: string; desc: string }> = {
          1: {
            status: 'PAYMENT_CONFIRMED',
            label: 'Pembayaran Terkonfirmasi',
            desc: 'Pembayaran telah diverifikasi sistem. Pesanan masuk antrean perangkaian florist.',
          },
          2: {
            status: 'CRAFTING_BOUQUET',
            label: 'Sedang Dirangkai Pengrajin',
            desc: 'Florist ahli atelier sedang merangkai tangkai kawat bulu pesanan Anda dengan penuh ketelitian.',
          },
          3: {
            status: 'QUALITY_CHECK_PASSED',
            label: 'Lolos Quality Check & Siap Kirim',
            desc: 'Buket telah lolos inspeksi kerapian, kelopak simetris, dan pengemasan kardus aman.',
          },
          4: {
            status: 'COMPLETED',
            label: 'Pesanan Selesai / Terkirim',
            desc: 'Buket telah sampai dan diterima dengan kondisi mekar sempurna di tangan pelanggan.',
          },
        };

        const target = stepMap[step] || stepMap[1];

        set((state) => ({
          orders: state.orders.map((ord) => {
            if (ord.id === orderId) {
              return {
                ...ord,
                currentStep: step,
                stepStatus: target.status,
                statusLabel: target.label,
                statusDescription: target.desc,
              };
            }
            return ord;
          }),
        }));
      },

      findOrderByQuery: (query) => {
        const clean = query.trim().toLowerCase();
        if (!clean) return null;
        return (
          get().orders.find(
            (o) =>
              (o.invoiceNumber && o.invoiceNumber.toLowerCase() === clean) ||
              (o.customerPhone && o.customerPhone.includes(clean)) ||
              (o.id && o.id.toLowerCase() === clean)
          ) || null
        );
      },

      addNewOrder: (order) => {
        set((state) => {
          const orderKey = (order.id || order.invoiceNumber || '').trim();
          const existingIndex = state.orders.findIndex(
            (o) => (o.id && o.id === orderKey) || (o.invoiceNumber && o.invoiceNumber === orderKey)
          );
          if (existingIndex !== -1) {
            const updated = [...state.orders];
            updated[existingIndex] = { ...updated[existingIndex], ...order };
            return { orders: deduplicateOrders(updated), activeOrderId: order.id };
          }
          return {
            orders: deduplicateOrders([order, ...state.orders]),
            activeOrderId: order.id,
          };
        });
      },

      syncDbOrders: (incomingOrders) => {
        const cleaned = deduplicateOrders(incomingOrders || []);
        set((state) => ({
          orders: cleaned,
          activeOrderId:
            cleaned.length > 0
              ? cleaned.some((o) => o.id === state.activeOrderId)
                ? state.activeOrderId
                : cleaned[0].id
              : '',
        }));
      },

      addWarrantyClaim: (claimData) => {
        const newClaim: WarrantyClaim = {
          ...claimData,
          id: `warr-${Date.now()}`,
          status: 'SUBMITTED',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          warrantyClaims: [newClaim, ...state.warrantyClaims],
        }));
        return newClaim;
      },

      updateWarrantyClaimStatus: (claimId, status, adminNote) => {
        set((state) => ({
          warrantyClaims: state.warrantyClaims.map((claim) => {
            if (claim.id === claimId) {
              return {
                ...claim,
                status,
                adminNote: adminNote ?? claim.adminNote,
              };
            }
            return claim;
          }),
        }));
      },

      resetOrdersToDefault: () => {
        set({
          orders: [],
          activeOrderId: '',
          warrantyClaims: [],
        });
      },
    }),
    {
      name: 'chenille_order_storage',
      merge: (persistedState: any, currentState: OrderState) => {
        const rawOrders = persistedState?.orders;
        const rawWarranties = persistedState?.warrantyClaims;
        const dedupedOrders = deduplicateOrders(
          Array.isArray(rawOrders) ? rawOrders : []
        );
        const filteredWarranties = Array.isArray(rawWarranties)
          ? rawWarranties.filter((w: any) => !isLegacyMockWarranty(w?.id || ''))
          : [];
        return {
          ...currentState,
          ...persistedState,
          orders: dedupedOrders,
          warrantyClaims: filteredWarranties,
          activeOrderId: dedupedOrders.length > 0 ? (persistedState?.activeOrderId || dedupedOrders[0].id) : '',
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (Array.isArray(state.orders)) {
            state.orders = deduplicateOrders(state.orders);
          }
          if (Array.isArray(state.warrantyClaims)) {
            state.warrantyClaims = state.warrantyClaims.filter((w: any) => !isLegacyMockWarranty(w?.id || ''));
          }
        }
      },
    }
  )
);
