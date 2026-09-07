'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MockOrder, WarrantyClaim, WarrantyStatus } from '@chenille/shared';
import { MOCK_ORDERS, MOCK_WARRANTY_CLAIMS } from '@chenille/shared';

interface OrderState {
  orders: MockOrder[];
  activeOrderId: string;
  warrantyClaims: WarrantyClaim[];
  setActiveOrderId: (id: string) => void;
  updateOrderStep: (orderId: string, step: number) => void;
  findOrderByQuery: (query: string) => MockOrder | null;
  addNewOrder: (order: MockOrder) => void;
  addWarrantyClaim: (claim: Omit<WarrantyClaim, 'id' | 'createdAt' | 'status'>) => WarrantyClaim;
  updateWarrantyClaimStatus: (claimId: string, status: WarrantyStatus, adminNote?: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: MOCK_ORDERS,
      activeOrderId: 'ord-101',
      warrantyClaims: MOCK_WARRANTY_CLAIMS,

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
              o.invoiceNumber.toLowerCase() === clean ||
              o.customerPhone.includes(clean) ||
              o.id.toLowerCase() === clean
          ) || null
        );
      },

      addNewOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
          activeOrderId: order.id,
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
    }),
    {
      name: 'chenille_order_storage',
    }
  )
);
