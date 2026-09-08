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
    adminFee: number;
  };
  bcaManual: {
    isEnabled: boolean;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    branch: string;
    adminFee: number;
  };
  codCash: {
    isEnabled: boolean;
    maxDistanceKm: number;
    notes: string;
    adminFee: number;
  };
}

export interface StoreCoupon {
  code: string;
  discount: string;
  discountType: 'PERCENTAGE' | 'NOMINAL' | 'FREE_SHIPPING';
  discountVal: number;
  minSpend: string;
  minSpendVal: number;
  used: number;
  quota: number;
  active: boolean;
  expiry: string;
  description?: string;
}

interface SettingsState {
  storeName: string;
  tagline: string;
  waNumber: string;
  studioAddress: string;
  dailyQuota: number;
  paymentGateways: PaymentGatewaysConfig;
  wasteMaterials: WasteMaterialItem[];
  coupons: StoreCoupon[];

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
  toggleCouponActive: (code: string) => void;
  addCoupon: (coupon: StoreCoupon) => void;
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
          adminFee: 2500,
        },
        bcaManual: {
          isEnabled: true,
          bankName: 'Bank Central Asia (BCA)',
          accountNumber: '8420-1928-31',
          accountHolder: 'PT Chenille Atelier Florist',
          branch: 'KCP Margonda Raya Depok',
          adminFee: 0,
        },
        codCash: {
          isEnabled: true,
          maxDistanceKm: 7.5,
          notes: 'Bayar tunai pas saat serah terima buket di Titik Temu Kampus UI Depok, Gunadarma, atau PNJ.',
          adminFee: 0,
        },
      },
      wasteMaterials: DEFAULT_WASTE_MATERIALS,
      coupons: [
        {
          code: 'WISUDAHEMAT',
          discount: 'Diskon Rp 25.000',
          discountType: 'NOMINAL',
          discountVal: 25000,
          minSpend: 'Min. Belanja Rp 150.000',
          minSpendVal: 150000,
          used: 14,
          quota: 50,
          active: true,
          expiry: '30 Sep 2026',
          description: 'Voucher spesial musim wisuda',
        },
        {
          code: 'LOVECHENILLE',
          discount: 'Diskon 10%',
          discountType: 'PERCENTAGE',
          discountVal: 10,
          minSpend: 'Tanpa Minimum',
          minSpendVal: 0,
          used: 28,
          quota: 100,
          active: true,
          expiry: '15 Okt 2026',
          description: 'Diskon perkenalan atelier bunga',
        },
        {
          code: 'GRATISONGKIR5K',
          discount: 'Gratis Ongkir Rp 10.000',
          discountType: 'FREE_SHIPPING',
          discountVal: 10000,
          minSpend: 'Min. Belanja Rp 100.000',
          minSpendVal: 100000,
          used: 42,
          quota: 60,
          active: true,
          expiry: '05 Okt 2026',
          description: 'Subsidi ongkir kurir J&T Fragile',
        },
        {
          code: 'MEMBERGOLD15',
          discount: 'Diskon Eksklusif 15%',
          discountType: 'PERCENTAGE',
          discountVal: 15,
          minSpend: 'Khusus Member Gold',
          minSpendVal: 0,
          used: 8,
          quota: 20,
          active: true,
          expiry: '31 Des 2026',
          description: 'Privilege VIP loyal member',
        },
      ],

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

      toggleCouponActive: (code) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code === code ? { ...c, active: !c.active } : c
          ),
        }));
      },

      addCoupon: (coupon) => {
        set((state) => ({
          coupons: [coupon, ...state.coupons],
        }));
      },
    }),
    {
      name: 'chenille-store-settings',
    }
  )
);
