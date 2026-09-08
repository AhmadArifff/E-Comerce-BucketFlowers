'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WasteMaterialItem {
  id: string;
  materialName: string;
  category: 'KAWAT_BULU' | 'CELLOPHANE' | 'PITA' | 'ACCESSORY' | 'FLORAL_FOAM';
  qty: number;
  unit: string;
  costPerUnit: number;
  totalLoss: number;
  reason: 'LEMBAP_BERKARAT' | 'KERTAS_LECEK_ROBEK' | 'CACAT_PRODUKSI' | 'KADALUARSA_SIMPAN';
  reportedAt: string;
  mitigationAction?: string;
}

export interface PaymentGatewaysConfig {
  midtrans: {
    isEnabled: boolean;
    merchantId: string;
    clientKey: string;
    serverKey: string;
    isProduction: boolean;
  };
  bcaManual: {
    isEnabled: boolean;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    branch: string;
  };
  codCash: {
    isEnabled: boolean;
    maxDistanceKm: number;
    notes: string;
  };
}

interface SettingsState {
  storeName: string;
  tagline: string;
  waNumber: string;
  studioAddress: string;
  dailyQuota: number;
  paymentGateways: PaymentGatewaysConfig;
  wasteMaterials: WasteMaterialItem[];

  // Actions
  updateStoreProfile: (profile: {
    storeName?: string;
    tagline?: string;
    waNumber?: string;
    studioAddress?: string;
    dailyQuota?: number;
  }) => void;
  togglePaymentGateway: (gateway: keyof PaymentGatewaysConfig, isEnabled: boolean) => void;
  updatePaymentGatewayConfig: <K extends keyof PaymentGatewaysConfig>(
    gateway: K,
    config: Partial<PaymentGatewaysConfig[K]>
  ) => void;
  addWasteMaterial: (item: Omit<WasteMaterialItem, 'id' | 'totalLoss' | 'reportedAt'>) => void;
  removeWasteMaterial: (id: string) => void;
  getTotalWasteLoss: () => number;
}

const DEFAULT_WASTE_MATERIALS: WasteMaterialItem[] = [
  {
    id: 'wst-1',
    materialName: 'Kawat Bulu Pastel Pink (6mm)',
    category: 'KAWAT_BULU',
    qty: 40,
    unit: 'Batang',
    costPerUnit: 350,
    totalLoss: 14000,
    reason: 'LEMBAP_BERKARAT',
    reportedAt: '2026-09-02T10:00:00Z',
    mitigationAction: 'Disimpan di container kedap udara ber-silika gel',
  },
  {
    id: 'wst-2',
    materialName: 'Cellophane Korean Waterproof Maroon',
    category: 'CELLOPHANE',
    qty: 6,
    unit: 'Lembar',
    costPerUnit: 4500,
    totalLoss: 27000,
    reason: 'KERTAS_LECEK_ROBEK',
    reportedAt: '2026-09-04T14:30:00Z',
    mitigationAction: 'Gunakan tabung selongsong karton untuk penyimpanan',
  },
  {
    id: 'wst-3',
    materialName: 'Lampu LED Fairy Warm White (1M)',
    category: 'ACCESSORY',
    qty: 4,
    unit: 'Pcs',
    costPerUnit: 6000,
    totalLoss: 24000,
    reason: 'CACAT_PRODUKSI',
    reportedAt: '2026-09-06T09:15:00Z',
    mitigationAction: 'Klaim retur ke distributor pabrik',
  },
];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      storeName: 'Chenille Atelier Depok',
      tagline: 'Buket Bunga Kawat Bulu Chenille Premium & Graduation Florist',
      waNumber: '+62 812-9928-1192',
      studioAddress: 'Jl. Margonda Raya No. 120, Beji, Kota Depok, Jawa Barat 16424',
      dailyQuota: 25,
      paymentGateways: {
        midtrans: {
          isEnabled: true,
          merchantId: 'G-10293847-CHENILLE',
          clientKey: 'SB-Mid-client-W3nK829dL-Chenille',
          serverKey: 'SB-Mid-server-x82KdpL19-Chenille',
          isProduction: false,
        },
        bcaManual: {
          isEnabled: true,
          bankName: 'Bank Central Asia (BCA)',
          accountNumber: '8420-1928-31',
          accountHolder: 'PT Chenille Atelier Florist',
          branch: 'KCP Margonda Raya Depok',
        },
        codCash: {
          isEnabled: true,
          maxDistanceKm: 7.5,
          notes: 'Bayar tunai pas saat serah terima buket di Titik Temu Kampus UI Depok, Gunadarma, atau PNJ.',
        },
      },
      wasteMaterials: DEFAULT_WASTE_MATERIALS,

      updateStoreProfile: (profile) => {
        set((state) => ({ ...state, ...profile }));
      },

      togglePaymentGateway: (gateway, isEnabled) => {
        set((state) => ({
          paymentGateways: {
            ...state.paymentGateways,
            [gateway]: {
              ...state.paymentGateways[gateway],
              isEnabled,
            },
          },
        }));
      },

      updatePaymentGatewayConfig: (gateway, config) => {
        set((state) => ({
          paymentGateways: {
            ...state.paymentGateways,
            [gateway]: {
              ...state.paymentGateways[gateway],
              ...config,
            },
          },
        }));
      },

      addWasteMaterial: (item) => {
        const totalLoss = item.qty * item.costPerUnit;
        const newItem: WasteMaterialItem = {
          ...item,
          id: `wst-${Date.now()}`,
          totalLoss,
          reportedAt: new Date().toISOString(),
        };
        set((state) => ({
          wasteMaterials: [newItem, ...state.wasteMaterials],
        }));
      },

      removeWasteMaterial: (id) => {
        set((state) => ({
          wasteMaterials: state.wasteMaterials.filter((m) => m.id !== id),
        }));
      },

      getTotalWasteLoss: () => {
        return get().wasteMaterials.reduce((sum, item) => sum + item.totalLoss, 0);
      },
    }),
    {
      name: 'chenille-store-settings',
    }
  )
);
