'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CodPoint } from '@chenille/shared';

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

export interface RawMaterial {
  id: string;
  name: string;
  category: 'KAWAT_BULU' | 'BATANG_KAWAT' | 'CELLOPHANE' | 'PITA' | 'BONEKA_AKSESORIS' | 'FLORAL_FOAM' | 'LAINNYA';
  stock: number;
  minStock: number;
  unit: string;
  costPerUnit: number;
  supplierName: string;
  supplierContact: string;
  supplierLink?: string;
  notes?: string;
  updatedAt: string;
}

export interface ProcurementOrder {
  id: string;
  materialId: string;
  materialName: string;
  supplierName: string;
  supplierContact?: string;
  supplierLink?: string;
  orderDate: string;
  estimatedArrival: string;
  actualArrival?: string;
  qtyOrdered: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  status: 'ORDERED' | 'SHIPPED' | 'ARRIVED' | 'CANCELLED';
  trackingNumber?: string;
  isStockAdded: boolean;
  notes?: string;
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

export interface LogisticsConfig {
  isEnabled: boolean;
  isProduction: boolean;
  apiKey: string;
  apiKeyMasked: string;
  originName: string;
  originPhone: string;
  originAddress: string;
  originPostalCode: number;
  activeCouriers: {
    jnt: boolean;
    jne: boolean;
    sicepat: boolean;
    anteraja: boolean;
    gosend: boolean;
  };
  extraPackingFee: number;
}

export interface NotificationConfig {
  isEnabled: boolean;
  apiKeyMasked: string;
  apiKey: string;
  hasValidKey: boolean;
  senderDevice: string;
  events: {
    orderCreated: boolean;
    craftingStarted: boolean;
    qualityCheck: boolean;
    inDelivery: boolean;
    completed: boolean;
    warrantySubmitted: boolean;
    warrantyApproved: boolean;
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
  latitude: string;
  longitude: string;
  mapsLink: string;
  maxCodRadiusKm: number;
  paymentGateways: PaymentGatewaysConfig;
  logisticsConfig: LogisticsConfig;
  notificationConfig: NotificationConfig;
  wasteMaterials: WasteMaterialItem[];
  coupons: StoreCoupon[];
  rawMaterials: RawMaterial[];
  procurementOrders: ProcurementOrder[];

  // Actions
  updateStoreProfile: (profile: {
    storeName?: string;
    tagline?: string;
    waNumber?: string;
    studioAddress?: string;
    dailyQuota?: number;
    latitude?: string;
    longitude?: string;
    mapsLink?: string;
    maxCodRadiusKm?: number;
  }) => void;
  togglePaymentGateway: (gateway: keyof PaymentGatewaysConfig, isEnabled: boolean) => void;
  updatePaymentGatewayConfig: <K extends keyof PaymentGatewaysConfig>(
    gateway: K,
    config: Partial<PaymentGatewaysConfig[K]>
  ) => void;
  updateLogisticsConfig: (config: Partial<LogisticsConfig>) => void;
  toggleCourierActive: (courier: keyof LogisticsConfig['activeCouriers'], isEnabled: boolean) => void;
  addWasteMaterial: (item: Omit<WasteMaterialItem, 'id' | 'totalLoss' | 'reportedAt'>) => void;
  removeWasteMaterial: (id: string) => void;
  getTotalWasteLoss: () => number;
  toggleCouponActive: (code: string) => void;
  addCoupon: (coupon: StoreCoupon) => void;

  // Raw Materials & Supplier Actions
  addRawMaterial: (material: Omit<RawMaterial, 'id' | 'updatedAt'>) => void;
  updateRawMaterial: (id: string, updates: Partial<RawMaterial>) => void;
  deleteRawMaterial: (id: string) => void;

  // Procurement Restock Actions
  addProcurementOrder: (order: Omit<ProcurementOrder, 'id' | 'isStockAdded'>) => void;
  updateProcurementOrderStatus: (orderId: string, newStatus: ProcurementOrder['status']) => void;
  deleteProcurementOrder: (orderId: string) => void;

  // COD Meetup Points Actions
  codPoints: CodPoint[];
  addCodPoint: (point: Omit<CodPoint, 'id'>) => CodPoint;
  updateCodPoint: (id: string, updates: Partial<CodPoint>) => void;
  deleteCodPoint: (id: string) => void;
  resetCodPointsToDefault: () => void;
  resetAllSettingsToDefault: () => void;

  // Notification Actions
  updateNotificationConfig: (config: Partial<NotificationConfig>) => void;
  toggleNotificationEvent: (event: keyof NotificationConfig['events'], isEnabled: boolean) => void;
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

const DEFAULT_RAW_MATERIALS: RawMaterial[] = [
  {
    id: 'mat-1',
    name: 'Batang Kawat Bulu Burgundy (6mm)',
    category: 'KAWAT_BULU',
    stock: 450,
    minStock: 100,
    unit: 'Batang',
    costPerUnit: 350,
    supplierName: 'Toko Kawat Bulu Chenille Jaya Bandung',
    supplierContact: '081234567890',
    supplierLink: 'https://shopee.co.id/chenille-jaya-bandung',
    notes: 'Kawat bulu velvet halus tidak mudah rontok',
    updatedAt: '2026-09-08T10:00:00Z',
  },
  {
    id: 'mat-2',
    name: 'Batang Kawat Bulu Hijau Zaitun (6mm)',
    category: 'KAWAT_BULU',
    stock: 280,
    minStock: 80,
    unit: 'Batang',
    costPerUnit: 350,
    supplierName: 'Toko Kawat Bulu Chenille Jaya Bandung',
    supplierContact: '081234567890',
    supplierLink: 'https://shopee.co.id/chenille-jaya-bandung',
    notes: 'Untuk daun dan tangkai buket bunga atelier',
    updatedAt: '2026-09-08T10:00:00Z',
  },
  {
    id: 'mat-3',
    name: 'Batang Kawat Bulu Pastel Pink (6mm)',
    category: 'KAWAT_BULU',
    stock: 520,
    minStock: 150,
    unit: 'Batang',
    costPerUnit: 350,
    supplierName: 'Toko Kawat Bulu Chenille Jaya Bandung',
    supplierContact: '081234567890',
    supplierLink: 'https://shopee.co.id/chenille-jaya-bandung',
    notes: 'Bahan utama buket mawar pastel sakura',
    updatedAt: '2026-09-08T10:00:00Z',
  },
  {
    id: 'mat-4',
    name: 'Kawat Batang Penyangga Hijau No. 18',
    category: 'BATANG_KAWAT',
    stock: 600,
    minStock: 150,
    unit: 'Batang',
    costPerUnit: 500,
    supplierName: 'Florist Hardware Jakarta Pasar Pagi',
    supplierContact: '081987654321',
    supplierLink: 'https://tokopedia.com/floristhardware',
    notes: 'Batang kawat kokoh panjang 40cm',
    updatedAt: '2026-09-08T10:00:00Z',
  },
  {
    id: 'mat-5',
    name: 'Cellophane Korean Matte Maroon Gold',
    category: 'CELLOPHANE',
    stock: 85,
    minStock: 25,
    unit: 'Lembar',
    costPerUnit: 4500,
    supplierName: 'Korean Floral Paper Official Store',
    supplierContact: '085712345678',
    supplierLink: 'https://shopee.co.id/korean-floral-paper',
    notes: 'Waterproof dua sisi lis emas',
    updatedAt: '2026-09-08T10:00:00Z',
  },
  {
    id: 'mat-6',
    name: 'Pita Satin Burgundy Mewah 2.5cm',
    category: 'PITA',
    stock: 95,
    minStock: 20,
    unit: 'Meter',
    costPerUnit: 2200,
    supplierName: 'Pita Cantik Grosir Tanah Abang',
    supplierContact: '081399887766',
    supplierLink: 'https://shopee.co.id/pitacantikgrosir',
    notes: 'Satin kilau tebal tahan kusut',
    updatedAt: '2026-09-08T10:00:00Z',
  },
  {
    id: 'mat-7',
    name: 'Boneka Wisuda Ber-toga 10cm',
    category: 'BONEKA_AKSESORIS',
    stock: 35,
    minStock: 15,
    unit: 'Pcs',
    costPerUnit: 7400,
    supplierName: 'Souvenir Wisuda Karakter Boneka Cikampek',
    supplierContact: '081223344556',
    supplierLink: 'https://shopee.co.id/boneka-wisuda-mini',
    notes: 'Toga hitam lis kuning emas',
    updatedAt: '2026-09-08T10:00:00Z',
  },
];

const DEFAULT_PROCUREMENT_ORDERS: ProcurementOrder[] = [
  {
    id: 'PO-20260907-01',
    materialId: 'mat-1',
    materialName: 'Batang Kawat Bulu Burgundy (6mm)',
    supplierName: 'Toko Kawat Bulu Chenille Jaya Bandung',
    supplierContact: '081234567890',
    supplierLink: 'https://shopee.co.id/chenille-jaya-bandung',
    orderDate: '2026-09-07T09:00:00Z',
    estimatedArrival: '2026-09-09',
    qtyOrdered: 200,
    unit: 'Batang',
    costPerUnit: 350,
    totalCost: 70000,
    status: 'SHIPPED',
    trackingNumber: 'JP882910293 (J&T Express)',
    isStockAdded: false,
    notes: 'Pesanan restock persiapan wisuda UI Depok',
  },
  {
    id: 'PO-20260908-02',
    materialId: 'mat-5',
    materialName: 'Cellophane Korean Matte Maroon Gold',
    supplierName: 'Korean Floral Paper Official Store',
    supplierContact: '085712345678',
    supplierLink: 'https://shopee.co.id/korean-floral-paper',
    orderDate: '2026-09-08T11:00:00Z',
    estimatedArrival: '2026-09-11',
    qtyOrdered: 50,
    unit: 'Lembar',
    costPerUnit: 4500,
    totalCost: 225000,
    status: 'ORDERED',
    isStockAdded: false,
    notes: 'Order via Shopee toko official',
  },
];

export const DEFAULT_COD_POINTS: CodPoint[] = [
  {
    id: 'cod-001',
    name: 'Universitas Indonesia (Gerbatama & Rotunda)',
    fullAddress: 'Jl. Margonda Raya No. 100, Pondok Cina, Kec. Beji, Kota Depok, Jawa Barat 16424',
    googleMapsUrl: 'https://maps.google.com/?q=-6.3628,106.8315',
    embedQuery: 'Universitas Indonesia Depok',
    distanceKm: 2.4,
    deliveryNotes: 'Titik serah terima buket di pos satpam Gerbatama / Lobby Rotunda Rektorat UI',
    isActive: true,
  },
  {
    id: 'cod-002',
    name: 'Universitas Gunadarma Kampus D Margonda',
    fullAddress: 'Jl. Margonda Raya No. 100, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424',
    googleMapsUrl: 'https://maps.google.com/?q=Universitas+Gunadarma+Kampus+D',
    embedQuery: 'Universitas Gunadarma Kampus D',
    distanceKm: 1.4,
    deliveryNotes: 'Titik temu di lobi depan Gedung 1 Kampus D Margonda / pos keamanan gerbang utama',
    isActive: true,
  },
  {
    id: 'cod-003',
    name: 'Margo City Mall Depok (Lobby Utama Utara)',
    fullAddress: 'Jl. Margonda Raya No. 358, Kemiri Muka, Kec. Beji, Kota Depok, Jawa Barat 16423',
    googleMapsUrl: 'https://maps.google.com/?q=-6.3732,106.8345',
    embedQuery: 'Margo City Mall Depok',
    distanceKm: 3.1,
    deliveryNotes: 'Tempat serah terima dekat Starbucks / Lobby Utama Drop-off Mobil',
    isActive: true,
  },
  {
    id: 'cod-004',
    name: 'Stasiun KRL Pondok Cina (Pintu Timur)',
    fullAddress: 'Pondok Cina, Kec. Beji, Kota Depok, Jawa Barat 16424',
    googleMapsUrl: 'https://maps.google.com/?q=-6.3688,106.8336',
    embedQuery: 'Stasiun Pondok Cina Depok',
    distanceKm: 1.8,
    deliveryNotes: 'Serah terima cepat di depan minimarket pintu keluar stasiun sebelah timur',
    isActive: true,
  },
  {
    id: 'cod-005',
    name: "D'Mall Margonda Depok (Area Lobby Utama)",
    fullAddress: 'Jl. Margonda Raya No. 88, Kemiri Muka, Kec. Beji, Kota Depok, Jawa Barat 16423',
    googleMapsUrl: 'https://maps.google.com/?q=-6.3862,106.8285',
    embedQuery: 'DMall Depok Margonda',
    distanceKm: 3.9,
    deliveryNotes: 'Titik temu area perkantoran Margonda & lobby depan dekat hotel Santika',
    isActive: true,
  },
  {
    id: 'cod-006',
    name: 'Politeknik Negeri Jakarta (PNJ - Lobi Utama)',
    fullAddress: 'Kukusan, Kec. Beji, Kota Depok, Jawa Barat 16425',
    googleMapsUrl: 'https://maps.google.com/?q=Politeknik+Negeri+Jakarta',
    embedQuery: 'Politeknik Negeri Jakarta',
    distanceKm: 2.8,
    deliveryNotes: 'Titik temu di gerbang utama / pos satpam PNJ Kukusan',
    isActive: true,
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
      latitude: '-6.3728',
      longitude: '106.8315',
      mapsLink: 'https://maps.google.com/?q=-6.3728,106.8315',
      maxCodRadiusKm: 5.0,
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
      logisticsConfig: {
        isEnabled: true,
        isProduction: false,
        apiKey: '',
        apiKeyMasked: 'biteship_test.*****ncZo',
        originName: 'Aesthetic Chenille Flowers Atelier',
        originPhone: '081234567890',
        originAddress: 'Jl. Margonda Raya No. 108, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424',
        originPostalCode: 16424,
        activeCouriers: {
          jnt: true,
          jne: true,
          sicepat: true,
          anteraja: true,
          gosend: true,
        },
        extraPackingFee: 0,
      },
      notificationConfig: {
        isEnabled: false,
        apiKeyMasked: '',
        apiKey: '',
        hasValidKey: false,
        senderDevice: '081234567890',
        events: {
          orderCreated: true,
          craftingStarted: true,
          qualityCheck: true,
          inDelivery: true,
          completed: true,
          warrantySubmitted: true,
          warrantyApproved: true,
        },
      },
      wasteMaterials: DEFAULT_WASTE_MATERIALS,
      rawMaterials: DEFAULT_RAW_MATERIALS,
      procurementOrders: DEFAULT_PROCUREMENT_ORDERS,
      codPoints: DEFAULT_COD_POINTS,
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

      updateLogisticsConfig: (config) => {
        set((state) => ({
          logisticsConfig: {
            ...state.logisticsConfig,
            ...config,
          },
        }));
      },

      toggleCourierActive: (courier, isEnabled) => {
        set((state) => ({
          logisticsConfig: {
            ...state.logisticsConfig,
            activeCouriers: {
              ...state.logisticsConfig.activeCouriers,
              [courier]: isEnabled,
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

      addRawMaterial: (material) => {
        const newMat: RawMaterial = {
          ...material,
          id: `mat-${Date.now()}`,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          rawMaterials: [newMat, ...(state.rawMaterials || DEFAULT_RAW_MATERIALS)],
        }));
      },

      updateRawMaterial: (id, updates) => {
        set((state) => ({
          rawMaterials: (state.rawMaterials || DEFAULT_RAW_MATERIALS).map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      deleteRawMaterial: (id) => {
        set((state) => ({
          rawMaterials: (state.rawMaterials || DEFAULT_RAW_MATERIALS).filter((m) => m.id !== id),
        }));
      },

      addProcurementOrder: (order) => {
        const newPo: ProcurementOrder = {
          ...order,
          id: `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
          isStockAdded: false,
        };
        set((state) => ({
          procurementOrders: [newPo, ...(state.procurementOrders || DEFAULT_PROCUREMENT_ORDERS)],
        }));
      },

      updateProcurementOrderStatus: (orderId, newStatus) => {
        set((state) => {
          const orders = state.procurementOrders || DEFAULT_PROCUREMENT_ORDERS;
          const target = orders.find((o) => o.id === orderId);
          if (!target) return state;

          const shouldAddStock = newStatus === 'ARRIVED' && !target.isStockAdded;
          const updatedOrders = orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  actualArrival: newStatus === 'ARRIVED' ? new Date().toISOString().split('T')[0] : o.actualArrival,
                  isStockAdded: shouldAddStock ? true : o.isStockAdded,
                }
              : o
          );

          let updatedMaterials = state.rawMaterials || DEFAULT_RAW_MATERIALS;
          if (shouldAddStock) {
            updatedMaterials = updatedMaterials.map((m) =>
              m.id === target.materialId || m.name.toLowerCase() === target.materialName.toLowerCase()
                ? { ...m, stock: m.stock + target.qtyOrdered, updatedAt: new Date().toISOString() }
                : m
            );
          }

          return {
            procurementOrders: updatedOrders,
            rawMaterials: updatedMaterials,
          };
        });
      },

      deleteProcurementOrder: (orderId) => {
        set((state) => ({
          procurementOrders: (state.procurementOrders || DEFAULT_PROCUREMENT_ORDERS).filter((o) => o.id !== orderId),
        }));
      },

      addCodPoint: (point) => {
        const newPoint: CodPoint = {
          ...point,
          id: `cod-${Date.now()}`,
        };
        set((state) => ({
          codPoints: [newPoint, ...(state.codPoints || DEFAULT_COD_POINTS)],
        }));
        return newPoint;
      },

      updateCodPoint: (id, updates) => {
        set((state) => ({
          codPoints: (state.codPoints || DEFAULT_COD_POINTS).map((pt) =>
            pt.id === id ? { ...pt, ...updates } : pt
          ),
        }));
      },

      deleteCodPoint: (id) => {
        set((state) => ({
          codPoints: (state.codPoints || DEFAULT_COD_POINTS).filter((pt) => pt.id !== id),
        }));
      },

      resetCodPointsToDefault: () => {
        set({ codPoints: DEFAULT_COD_POINTS });
      },

      resetAllSettingsToDefault: () => {
        set({
          storeName: 'Chenille Atelier Depok',
          tagline: 'Buket Bunga Kawat Bulu Chenille Premium & Graduation Florist',
          waNumber: '+62 812-9928-1192',
          studioAddress: 'Jl. Margonda Raya No. 120, Beji, Kota Depok, Jawa Barat 16424',
          dailyQuota: 25,
          latitude: '-6.3728',
          longitude: '106.8315',
          mapsLink: 'https://maps.google.com/?q=-6.3728,106.8315',
          maxCodRadiusKm: 5.0,
          wasteMaterials: DEFAULT_WASTE_MATERIALS,
          rawMaterials: DEFAULT_RAW_MATERIALS,
          procurementOrders: DEFAULT_PROCUREMENT_ORDERS,
          codPoints: DEFAULT_COD_POINTS,
        });
      },

      // --- Notification Config Actions ---
      updateNotificationConfig: (config) => {
        set((state) => ({
          notificationConfig: {
            ...state.notificationConfig,
            ...config,
            events: config.events
              ? { ...state.notificationConfig.events, ...config.events }
              : state.notificationConfig.events,
          },
        }));
      },

      toggleNotificationEvent: (event, isEnabled) => {
        set((state) => ({
          notificationConfig: {
            ...state.notificationConfig,
            events: {
              ...state.notificationConfig.events,
              [event]: isEnabled,
            },
          },
        }));
      },
    }),
    {
      name: 'chenille-store-settings',
    }
  )
);
