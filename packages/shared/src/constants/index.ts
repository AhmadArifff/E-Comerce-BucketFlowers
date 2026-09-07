export const ATELIER_CONFIG = {
  name: 'Aesthetic Chenille Flowers Atelier',
  address: 'Jl. Margonda Raya No. 108 Depok',
  phone: '081234567890',
  latitude: -6.3728,
  longitude: 106.8315,
  maxFreeCodRadiusKm: 5.0,
  dailyPoLimit: 10,
} as const;

export const THEME_CONFIGS = {
  'tema-a': {
    name: 'Korean Pastel Atelier',
    badge: 'Soft & Elegant',
    primaryColor: '#E86A82',
    bgPage: '#FAF8F5',
    fontHeading: 'Cormorant Garamond',
    fontBody: 'Plus Jakarta Sans',
  },
  'tema-b': {
    name: 'Modern Romantic',
    badge: 'Luxury Velvet',
    primaryColor: '#722F37',
    bgPage: '#F7F3EE',
    fontHeading: 'Bodoni Moda',
    fontBody: 'Inter',
  },
  'tema-c': {
    name: 'Playful Kawaii & Pastel Pop',
    badge: 'Fun & Cheerful',
    primaryColor: '#FF6B81',
    bgPage: '#FFF9F5',
    fontHeading: 'Nunito',
    fontBody: 'Outfit',
  },
} as const;

export const DEFAULT_FEATURE_TOGGLES = [
  { key: 'toggle_maintenance', name: 'Mode Pemeliharaan Toko', isEnabled: false, description: 'Jeda transaksi jika atelier sedang istirahat produksi' },
  { key: 'toggle_po_limit', name: 'Pembatasan Kuota PO Harian', isEnabled: true, description: 'Membatasi kapasitas pesanan per hari agar pengrajin tidak overload' },
  { key: 'toggle_ready_stock_only', name: 'Kunci Hanya Ready Stock', isEnabled: false, description: 'Menutup PO sementara saat peak season wisuda' },
  { key: 'toggle_free_cod_radius', name: 'Bebas Ongkir Radius COD 5 KM', isEnabled: true, description: 'Tarif Rp 0 untuk titik COD dalam radius 5.0 KM dari atelier' },
  { key: 'toggle_in_system_chat', name: 'Live Web Chat Terintegrasi', isEnabled: true, description: 'Wajibkan obrolan awal melalui web chat sebelum ke WA' },
  { key: 'toggle_ai_chatbot', name: 'Bot Penjawab Cerdas Otomatis', isEnabled: true, description: 'Respon ramah instan 24/7 untuk pertanyaan umum pelanggan' },
  { key: 'toggle_wa_notification', name: 'Push Notifikasi WhatsApp', isEnabled: true, description: 'Kirim notifikasi status pesanan via gateway WA' },
  { key: 'toggle_theme_public_switcher', name: 'Pemilih Tema Publik di Navbar', isEnabled: true, description: 'Pill switcher tema di navbar etalase toko' },
  { key: 'toggle_guest_checkout', name: 'Izinkan Checkout Tanpa Login', isEnabled: true, description: 'Beli cepat dengan nomor WhatsApp tanpa registrasi' },
  { key: 'toggle_flower_points', name: 'Program Poin Loyalitas Member', isEnabled: true, description: 'Reward poin belanja untuk diskon transaksi berikutnya' },
] as const;

export const CUSTOMER_FAQ_PRESETS = [
  {
    category: 'INVOICE_LOST',
    question: 'Bagaimana jika saya lupa nomor invoice atau resi pesanan?',
    answer: 'Cukup masukkan Nomor WhatsApp Anda di menu pelacakan. Sistem akan mengirimkan kode verifikasi singkat untuk menampilkan seluruh pesanan aktif Anda.',
  },
  {
    category: 'FLOWER_CARE',
    question: 'Buket kawat bulu sedikit tertekuk di dalam kardus, apakah rusak?',
    answer: 'Tidak rusak sama sekali! Bunga kawat bulu bersifat elastis. Cukup lengkungkan kembali kelopak perlahan dengan jempol Anda ke arah luar, buket akan mekar sempurna kembali.',
  },
  {
    category: 'FLOWER_CARE',
    question: 'Bagaimana cara merawat buket kawat bulu agar awet?',
    answer: 'Jauhkan dari air dan sinar matahari terik langsung. Bersihkan debu berkala dengan kuas halus atau hair dryer angin dingin. Bunga kawat bulu akan awet bertahun-tahun.',
  },
  {
    category: 'PO_SCHEDULE',
    question: 'Berapa lama estimasi buket Pre-Order wisuda selesai?',
    answer: 'Produk Ready Stock dikirim H+0/H+1. Produk Pre-Order kustom membutuhkan 1-3 hari kerja. Disarankan memesan H-4 sebelum jadwal wisuda Anda.',
  },
  {
    category: 'COD_RULES',
    question: 'Bagaimana prosedur titik temu COD di kampus atau mall?',
    answer: 'Pilih titik temu resmi di Google Maps saat checkout. Staf atelier kami akan mengonfirmasi kedatangan via chat web / WhatsApp 15 menit sebelum waktu temu.',
  },
] as const;

