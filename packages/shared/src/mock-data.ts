import type { ProductSummary, CodPoint, OrderStepStatus, BomItem, LiveChatMessage, WarrantyClaim, CustomerFaqItem } from './types/index.js';

export interface ExtendedProduct extends ProductSummary {
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  colors?: string[];
  themeSuitability?: ('tema-a' | 'tema-b' | 'tema-c')[];
}

export interface MockOrder {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAvatarEmoji: string;
  currentStep: number; // 1, 2, 3, 4
  stepStatus: OrderStepStatus;
  statusLabel: string;
  statusDescription: string;
  fulfillmentType: 'COURIER_EXPEDITION' | 'COD_MEETUP_POINT';
  meetupPointName?: string;
  courierName?: string;
  trackingNumber?: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotalAmount: number;
  shippingFee: number;
  discountAmount: number;
  flowerPointsEarned: number;
  adminFee?: number;
  totalAmount: number;
  createdAt: string;
  estimatedDelivery: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  paymentStatus?: 'WAITING_PAYMENT' | 'PAYMENT_CONFIRMED' | 'PAID_ON_COD';
}

export const MOCK_PRODUCTS: ExtendedProduct[] = [
  {
    id: 'prod-001',
    name: 'Buket Mawar Merah Velvet Wisuda',
    slug: 'buket-mawar-merah-velvet',
    category: 'Wisuda',
    price: 165000,
    discountPrice: 149000,
    rawCostHpp: 48500,
    stock: 12,
    poLeadDays: 2,
    clickCount: 1420,
    isReadyStock: true,
    isActive: true,
    badge: 'Terlaris Wisuda',
    rating: 4.9,
    reviewCount: 184,
    description: 'Buket bunga mawar kawat bulu halus premium 12 tangkai berpadu dengan boneka wisuda toga mini, dibungkus cellophane Korea matte water-resistant.',
    image: '/images/products/buket-mawar-merah-velvet.jpg',
    colors: ['#E11D48', '#FDA4AF', '#FFE4E6'],
    themeSuitability: ['tema-a', 'tema-b'],
  },
  {
    id: 'prod-002',
    name: 'Buket Tulip Pastel Pink Korean Style',
    slug: 'buket-tulip-pastel-pink',
    category: 'Pastel',
    price: 145000,
    rawCostHpp: 38000,
    stock: 8,
    poLeadDays: 1,
    clickCount: 980,
    isReadyStock: true,
    isActive: true,
    badge: 'Trending Korea',
    rating: 4.8,
    reviewCount: 96,
    description: 'Buket 7 tangkai tulip kawat bulu kelopak mekar lembut bernuansa baby pink dan sage green, sentuhan pita organza transparan mewah.',
    image: '/images/products/buket-tulip-pastel-pink.jpg',
    colors: ['#FBCFE8', '#BBF7D0'],
    themeSuitability: ['tema-a', 'tema-b'],
  },
  {
    id: 'prod-003',
    name: 'Buket Bunga Matahari Graduation Ceria',
    slug: 'buket-matahari-graduation',
    category: 'Wisuda',
    price: 135000,
    rawCostHpp: 35500,
    stock: 10,
    poLeadDays: 2,
    clickCount: 1120,
    isReadyStock: true,
    isActive: true,
    badge: 'Wisuda Favorit',
    rating: 4.9,
    reviewCount: 112,
    description: 'Buket 5 tangkai bunga matahari kawat bulu ceria dengan selempang wisuda kecil, pembungkus cellophane kuning doff elegan.',
    image: '/images/products/buket-matahari-graduation.jpg',
    colors: ['#FACC15', '#EA580C', '#FEF08A'],
    themeSuitability: ['tema-a', 'tema-c'],
  },
  {
    id: 'prod-004',
    name: 'Buket Lavender Lilac Dream',
    slug: 'buket-lavender-lilac-dream',
    category: 'Pastel',
    price: 125000,
    rawCostHpp: 32000,
    stock: 6,
    poLeadDays: 2,
    clickCount: 890,
    isReadyStock: true,
    isActive: true,
    badge: 'Wangi Estetik',
    rating: 4.9,
    reviewCount: 78,
    description: 'Buket paduan tangkai lavender kawat bulu ungu lilac harum berpadu pita satin mewah, cocok untuk hadiah sidang skripsi dan ulang tahun.',
    image: '/images/products/buket-lavender-lilac-dream.jpg',
    colors: ['#C084FC', '#E9D5FF', '#F5D0FE'],
    themeSuitability: ['tema-a', 'tema-b'],
  },
  {
    id: 'prod-005',
    name: 'Buket Karakter Wisuda Ber-toga',
    slug: 'buket-karakter-wisuda-toga',
    category: 'Karakter',
    price: 175000,
    discountPrice: 159000,
    rawCostHpp: 54000,
    stock: 7,
    poLeadDays: 3,
    clickCount: 1310,
    isReadyStock: false,
    isActive: true,
    badge: 'Custom Nama & Gelar',
    rating: 5.0,
    reviewCount: 104,
    description: 'Buket bunga kawat bulu premium dengan boneka wisuda karakter ber-toga mini lengkap dengan selempang sablon nama wisudawan custom.',
    image: '/images/products/buket-karakter-wisuda-toga.jpg',
    colors: ['#38BDF8', '#FDE047', '#1E293B'],
    themeSuitability: ['tema-c', 'tema-a'],
  },
  {
    id: 'prod-006',
    name: 'Mini Pot Bunga Daisy Kawat Bulu Meja Belajar',
    slug: 'mini-pot-daisy-kawat-bulu',
    category: 'Mini Pot',
    price: 45000,
    rawCostHpp: 14000,
    stock: 20,
    poLeadDays: 1,
    clickCount: 650,
    isReadyStock: true,
    isActive: true,
    badge: 'Best Budget',
    rating: 4.7,
    reviewCount: 54,
    description: 'Pot gerabah mini estetik dengan 5 tangkai bunga daisy kawat bulu warna pastel, cocok untuk penghias meja kerja atau kado sahabat.',
    image: '/images/products/mini-pot-daisy-kawat-bulu.jpg',
    colors: ['#FDE047', '#E0E7FF', '#FBCFE8'],
    themeSuitability: ['tema-a', 'tema-c'],
  },
  {
    id: 'prod-007',
    name: 'Midnight Rose & Velvet Romance Deluxe',
    slug: 'midnight-rose-velvet-romance',
    category: 'Romantis',
    price: 195000,
    discountPrice: 175000,
    rawCostHpp: 58000,
    stock: 5,
    poLeadDays: 3,
    clickCount: 1750,
    isReadyStock: false,
    isActive: true,
    badge: 'Edisi Mewah',
    rating: 5.0,
    reviewCount: 62,
    description: 'Buket mawar merah maroon pekat berbahan kawat bulu bertekstur beludru mewah beraksen dedaunan emas, cellophane hitam doff & pita satin merah anggur.',
    image: '/images/products/midnight-rose-velvet-romance.jpg',
    colors: ['#881337', '#B45309', '#1E293B'],
    themeSuitability: ['tema-b'],
  },
  {
    id: 'prod-008',
    name: 'Buket Bunga Matahari Kawaii Smile Sunflower',
    slug: 'buket-matahari-kawaii-smile',
    category: 'Karakter',
    price: 85000,
    rawCostHpp: 24500,
    stock: 15,
    poLeadDays: 1,
    clickCount: 1120,
    isReadyStock: true,
    isActive: true,
    badge: 'Mood Booster',
    rating: 4.9,
    reviewCount: 118,
    description: 'Buket 3 bunga matahari kawat bulu ceria dengan ekspresi wajah kawaii imut, ornamen pita kuning polkadot yang menggemaskan.',
    image: '/images/products/buket-matahari-kawaii-smile.jpg',
    colors: ['#FACC15', '#EA580C', '#4ADE80'],
    themeSuitability: ['tema-c', 'tema-a'],
  },
];

export const MOCK_MEETUP_POINTS: CodPoint[] = [
  {
    id: 'cod-001',
    name: 'Universitas Indonesia (Stasiun UI / Rektorat)',
    fullAddress: 'Stasiun Kereta UI, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424',
    googleMapsUrl: 'https://maps.google.com/?q=Stasiun+UI+Depok',
    distanceKm: 2.1,
    deliveryNotes: 'Titik temu di Indomaret Point Stasiun UI / Halte Bikun Rektorat',
    isActive: true,
  },
  {
    id: 'cod-002',
    name: 'Universitas Gunadarma Kampus D Margonda',
    fullAddress: 'Jl. Margonda Raya No. 100, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424',
    googleMapsUrl: 'https://maps.google.com/?q=Universitas+Gunadarma+Kampus+D',
    distanceKm: 1.4,
    deliveryNotes: 'Titik temu di lobi depan Gedung 1 Kampus D Margonda',
    isActive: true,
  },
  {
    id: 'cod-003',
    name: 'Margo City Mall Depok (Lobby Starbucks GF)',
    fullAddress: 'Jl. Margonda Raya No. 358, Kemiri Muka, Beji, Kota Depok, Jawa Barat 16423',
    googleMapsUrl: 'https://maps.google.com/?q=Margo+City+Depok',
    distanceKm: 1.8,
    deliveryNotes: 'Lobby Utama depan Starbucks GF, dekat drop off mobil',
    isActive: true,
  },
  {
    id: 'cod-004',
    name: 'Politeknik Negeri Jakarta (PNJ - Lobi Utama)',
    fullAddress: 'Kukusan, Beji, Kota Depok, Jawa Barat 16425',
    googleMapsUrl: 'https://maps.google.com/?q=Politeknik+Negeri+Jakarta',
    distanceKm: 2.8,
    deliveryNotes: 'Titik temu di gerbang utama PNJ Kukusan',
    isActive: true,
  },
];

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'ord-101',
    invoiceNumber: 'INV-20260907-001',
    customerName: 'Siti Anggraini',
    customerPhone: '081298765432',
    customerEmail: 'siti.anggraini@student.ui.ac.id',
    customerAvatarEmoji: '🌸',
    currentStep: 2, // CRAFTING_BOUQUET
    stepStatus: 'CRAFTING_BOUQUET',
    statusLabel: 'Sedang Dirangkai Pengrajin',
    statusDescription: 'Florist ahli atelier sedang merangkai 12 tangkai mawar kawat bulu pesanan Anda dengan penuh ketelitian.',
    fulfillmentType: 'COD_MEETUP_POINT',
    meetupPointName: 'Universitas Indonesia (Stasiun UI / Rektorat)',
    items: [
      {
        productId: 'prod-001',
        productName: 'Buket Mawar Pastel Wisuda Spesial',
        productImage: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        unitPrice: 119000,
        subtotal: 119000,
      },
    ],
    subtotalAmount: 119000,
    shippingFee: 0,
    discountAmount: 10000,
    flowerPointsEarned: 50,
    totalAmount: 109000,
    createdAt: '2026-09-07T09:30:00Z',
    estimatedDelivery: '2026-09-08 10:00 WIB',
  },
  {
    id: 'ord-102',
    invoiceNumber: 'INV-20260907-002',
    customerName: 'Budi Santoso',
    customerPhone: '081345678901',
    customerAvatarEmoji: '🧸',
    currentStep: 3, // QUALITY_CHECK_PASSED
    stepStatus: 'QUALITY_CHECK_PASSED',
    statusLabel: 'Lolos Quality Check & Siap Kirim',
    statusDescription: 'Buket telah diverifikasi kerapian batang kawat, simetri kelopak, dan packing kardus aman.',
    fulfillmentType: 'COURIER_EXPEDITION',
    courierName: 'J&T Express (Biteship)',
    trackingNumber: 'JT98218392109',
    items: [
      {
        productId: 'prod-004',
        productName: 'Buket Bunga Matahari Kawaii Smile Sunflower',
        productImage: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
        quantity: 2,
        unitPrice: 85000,
        subtotal: 170000,
      },
    ],
    subtotalAmount: 170000,
    shippingFee: 15000,
    discountAmount: 0,
    flowerPointsEarned: 85,
    totalAmount: 185000,
    createdAt: '2026-09-06T14:15:00Z',
    estimatedDelivery: '2026-09-08 14:00 WIB',
  },
  {
    id: 'ord-103',
    invoiceNumber: 'INV-20260905-089',
    customerName: 'Nadia Rahmawati',
    customerPhone: '085712345678',
    customerAvatarEmoji: '🌷',
    currentStep: 4, // COMPLETED
    stepStatus: 'COMPLETED',
    statusLabel: 'Pesanan Selesai & Diterima',
    statusDescription: 'Pesanan telah diterima oleh pelanggan dengan kondisi sempurna di Margo City Mall Depok.',
    fulfillmentType: 'COD_MEETUP_POINT',
    meetupPointName: 'Margo City Mall Depok (Lobby Starbucks GF)',
    items: [
      {
        productId: 'prod-002',
        productName: 'Buket Tulip Pink Korean Aesthetic',
        productImage: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        unitPrice: 95000,
        subtotal: 95000,
      },
    ],
    subtotalAmount: 95000,
    shippingFee: 0,
    discountAmount: 5000,
    flowerPointsEarned: 45,
    totalAmount: 90000,
    createdAt: '2026-09-05T11:00:00Z',
    estimatedDelivery: '2026-09-06 13:00 WIB',
  },
];

export const MOCK_BOM_DATA: Record<string, BomItem[]> = {
  'prod-001': [
    { id: 'bom-1', rawMaterialName: 'Batang Kawat Bulu Pastel Pink (Pipe Cleaner 6mm)', category: 'KAWAT_BULU', unit: 'Batang', unitPrice: 350, quantityNeeded: 36, subtotalCost: 12600 },
    { id: 'bom-2', rawMaterialName: 'Batang Kawat Bulu Daun Hijau Sage', category: 'KAWAT_BULU', unit: 'Batang', unitPrice: 350, quantityNeeded: 12, subtotalCost: 4200 },
    { id: 'bom-3', rawMaterialName: 'Kawat Batang Hijau No. 18 (Penyangga)', category: 'ACCESSORY', unit: 'Batang', unitPrice: 500, quantityNeeded: 12, subtotalCost: 6000 },
    { id: 'bom-4', rawMaterialName: 'Cellophane Korean Waterproof Matte (2 Lembar)', category: 'CELLOPHANE', unit: 'Lembar', unitPrice: 4500, quantityNeeded: 2, subtotalCost: 9000 },
    { id: 'bom-5', rawMaterialName: 'Pita Satin Mewah 2.5cm Burgundy Rose', category: 'PITA', unit: 'Meter', unitPrice: 2200, quantityNeeded: 1.5, subtotalCost: 3300 },
    { id: 'bom-6', rawMaterialName: 'Boneka Wisuda Mini Ber-toga 10cm', category: 'ACCESSORY', unit: 'Pcs', unitPrice: 7400, quantityNeeded: 1, subtotalCost: 7400 },
  ],
};

export const MOCK_CHAT_HISTORY: LiveChatMessage[] = [
  { id: 'c-1', sessionId: 'sess-001', sender: 'BOT', text: 'Halo kak! Selamat datang di Aesthetic Chenille Flowers Atelier 🌸 Ada yang bisa kami bantu seputar buket wisuda atau custom bunga kawat bulu?', sentAt: '10:00' },
  { id: 'c-2', sessionId: 'sess-001', sender: 'CUSTOMER', text: 'Halo kak, untuk buket mawar pastel wisuda apakah bisa ganti warna pita jadi navy?', sentAt: '10:01' },
  { id: 'c-3', sessionId: 'sess-001', sender: 'BOT', text: 'Tentu bisa kak! Warna pita dan kertas wrapping bisa disesuaikan dengan warna almamater Anda tanpa biaya tambahan.', sentAt: '10:01' },
];

export const MOCK_FAQS: CustomerFaqItem[] = [
  {
    id: 'faq-1',
    category: 'FLOWER_CARE',
    question: 'Berapa lama buket bunga kawat bulu (chenille stem) dapat bertahan?',
    answer: 'Buket bunga kawat bulu kami terbuat dari serat sintetis premium dengan inti kawat galvanis anti-karat. Bunga ini tidak akan layu, tidak membutuhkan air, dan dapat bertahan bertahun-tahun sebagai pajangan kamar atau kenang-kenangan wisuda abadi.',
    sortOrder: 1,
  },
  {
    id: 'faq-2',
    category: 'FLOWER_CARE',
    question: 'Bagaimana jika bunga agak gepeng atau kelopak tertekan saat pengiriman ekspedisi?',
    answer: 'Jangan khawatir! Keunggulan utama kawat bulu adalah sifatnya yang fleksibel dan elastis. Anda cukup merapikan dan memekarkan kembali lekukan kelopak bunga menggunakan ujung jari secara perlahan. Buket akan kembali mekar simetris dan cantik seketika.',
    sortOrder: 2,
  },
  {
    id: 'faq-3',
    category: 'COD_RULES',
    question: 'Bagaimana cara janjian COD (Cash on Delivery) di kampus atau mall?',
    answer: 'Saat checkout, pilih opsi "COD Titik Temu Google Maps". Anda dapat memilih salah satu titik kumpul terverifikasi (Stasiun UI, Gerbang PNJ, Kampus D Gunadarma, atau Margo City). Kurir atelier kami akan menunggu di lobi titik temu sesuai jadwal yang Anda tentukan.',
    sortOrder: 3,
  },
  {
    id: 'faq-4',
    category: 'PO_SCHEDULE',
    question: 'Apakah bisa request custom warna wisuda atau karakter boneka khusus?',
    answer: 'Sangat bisa! Silakan manfaatkan widget Live Web Chat kami terlebih dahulu untuk berkonsultasi mengenai kombinasi warna kawat bulu dan aksesoris boneka wisuda. Jika membutuhkan rancangan spesifik, asisten web kami dapat meneruskan detail pesanan ke WhatsApp florist pengrajin.',
    sortOrder: 4,
  },
  {
    id: 'faq-5',
    category: 'INVOICE_LOST',
    question: 'Bagaimana prosedur klaim Garansi 100% Anti-Patah jika buket rusak parah?',
    answer: 'Jika tangkai kawat bulu patah atau lepas saat Anda membuka paket unboxing, Anda berhak atas Garansi 100% Ganti Baru. Masuk ke halaman Portal Pelanggan, klik tombol "Klaim Garansi 100%", masukkan foto unboxing dan nomor invoice. Tim kami akan memverifikasi dan merangkai buket pengganti baru tanpa biaya tambahan.',
    sortOrder: 5,
  },
];

export const MOCK_WARRANTY_CLAIMS: WarrantyClaim[] = [
  {
    id: 'warr-001',
    invoiceNumber: 'INV-20260905-089',
    customerName: 'Nadia Rahmawati',
    customerPhone: '085712345678',
    issueCategory: 'TRANSIT_DAMAGE_CRUSHED',
    description: 'Buket tulip tertindih kardus berat saat pengiriman kurir ekspedisi luar kota, tangkai utama penyangga bengkok 90 derajat.',
    solutionPreference: 'FREE_REPLACEMENT',
    status: 'UNDER_REVIEW',
    photoProofUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-06T15:30:00Z',
    adminNote: 'Sedang diperiksa oleh Lead Florist untuk penjadwalan kirim tangkai ganti baru.',
  },
  {
    id: 'warr-002',
    invoiceNumber: 'INV-20260902-045',
    customerName: 'Alya Putri',
    customerPhone: '081298765432',
    issueCategory: 'WRONG_PRODUCT_VARIANT',
    description: 'Pesan varian mawar dusty pink tetapi yang terkirim warna lavender ungu.',
    solutionPreference: 'FREE_REPLACEMENT',
    status: 'APPROVED_REPLACE',
    photoProofUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-02T10:15:00Z',
    adminNote: 'Disetujui ganti baru tanpa perlu retur buket lama.',
  },
  {
    id: 'warr-003',
    invoiceNumber: 'INV-20260828-012',
    customerName: 'Dina Maulida',
    customerPhone: '081345678901',
    issueCategory: 'WRONG_GREETING_CARD',
    description: 'Kartu ucapan wisuda salah nama gelar wisudawan.',
    solutionPreference: 'FREE_REPLACEMENT',
    status: 'RESOLVED',
    photoProofUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-28T14:20:00Z',
    adminNote: 'Kartu ucapan revisi telah dikirimkan ulang dengan kurir instan.',
  },
  {
    id: 'warr-004',
    invoiceNumber: 'INV-20260907-098',
    customerName: 'Rian Pratama',
    customerPhone: '085811223344',
    issueCategory: 'TRANSIT_DAMAGE_CRUSHED',
    description: 'Kertas wrapping cellophane kusut parah dan pita terlepas saat diterima dari kurir reguler.',
    solutionPreference: 'FREE_REPLACEMENT',
    status: 'SUBMITTED',
    photoProofUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-07T09:45:00Z',
    adminNote: 'Baru diajukan pembeli, menunggu verifikasi foto bukti.',
  },
];

