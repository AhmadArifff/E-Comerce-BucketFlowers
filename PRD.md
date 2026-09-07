# PRD: E-Commerce & Interactive Multi-Theme Catalog Buket Bunga Kawat Bulu

**Nama Produk:** E-Commerce & Interactive Multi-Theme Catalog Buket Bunga Kawat Bulu (*Aesthetic Chenille Flowers Atelier*)  
**Arsitektur:** Unified Fullstack Web App (Next.js / Nuxt 3) + Vercel Serverless + Supabase PostgreSQL  
**Standar Operasional:** Shopify-Grade Operations, Google Maps Geofencing, Multi-Theme Engine & Real-Time Logistics  
**Role / Penulis:** Senior Product Manager & Tech Critic Reviewer  
**Tanggal Rilis:** 2026-09-07  
**Versi:** v2.0 (Multi-Theme Engine, Google Maps COD Hub, BOM Costing, In-System Web Chat, & Customer Member Hub Edition)  
**Status:** Approved for Full Implementation & Git Release  
**Tech Stack Baseline:** Next.js (App Router) / Nuxt 3 (SSR + Nitro Server), Vanilla CSS Custom Properties (Design Tokens), Supabase PostgreSQL, Prisma ORM (Atomic Inventory Locking), Better Auth (RBAC + Session Rotation), Midtrans Snap SDK (QRIS Dynamic Prioritized), Biteship Logistics API, Google Maps Embed API & URL Schemes, ExcelJS (Financial Streaming Export).

---

## 1. Executive Summary & Visi Produk

Platform e-commerce dan katalog digital interaktif ini dirancang khusus untuk memfasilitasi bisnis kerajinan tangan (*handicraft*) buket bunga berbahan kawat bulu (*chenille stem / pipe cleaner*). 

Berbeda dengan e-commerce konvensional, bisnis buket kawat bulu memiliki karakteristik unik:
1. **Kombinasi Ready Stock & Pre-Order (PO):** Buket wisuda musiman membutuhkan batasan kuota harian (*capacity throttling*) agar pengrajin tidak kewalahan (*overloaded*).
2. **Kalkulasi Biaya Bahan Mentah Terperinci (*Bill of Materials / BOM*):** Setiap buket dirangkai dari puluhan batang kawat bulu warna-warni, boneka wisuda, kertas cellophane, dan pita satin, sehingga kalkulasi HPP dan margin keuntungan wajib presisi hingga rupiah terkecil.
3. **Titik Temu COD Kampus & Mall Terverifikasi Google Maps:** Menghindari salah alamat saat momen wisuda kampus dengan mengintegrasikan titik temu terverifikasi Google Maps resmi dan kalkulasi radius bebas ongkir.
4. **Dual-Scenario Pelacakan Pesanan:** Memfasilitasi pembeli cepat tanpa login (*Guest Tracking via No. HP*) serta pembeli loyal pencari rasa aman (*Registered Member Hub* dengan histori, poin reward, dan live 4-step stepper).
5. **In-System Live Web Chat (Anti-Direct-WA Trap):** Mengarahkan obrolan langsung di dalam sistem terlebih dahulu dengan asisten otomatis, baru diekskalasikan ke WhatsApp jika diperlukan konsultasi buket kustom.
6. **Dynamic Plug-and-Play Multi-Theme Engine:** Kemampuan berganti tema estetika secara instan antara **Tema A (Korean Pastel)**, **Tema B (Modern Romantic)**, dan **Tema C (Playful Kawaii)** tanpa mengganggu modul bisnis inti (cart, checkout, tracking, inventory).

---

## 2. Arsitektur Sitemap & Navigasi Terpadu

```text
E-COMMERCE CHENILLE FLOWERS SITEMAP
│
├── 🛒 STOREFRONT & CUSTOMER PORTAL
│   ├── Halaman Etalase Multi-Tema (Tema A, Tema B, Tema C)
│   │   ├── Top Announcement Bar (Promo & Info Kuota Wisuda)
│   │   ├── Sticky Navbar (Brand, Menu, Search, Link Portal Member, Cart Drawer)
│   │   ├── Hero Carousel Estetik (Highlight buket wisuda & seasonal)
│   │   ├── Kartu Filter Kategori (Wisuda, Romantis, Pastel, Karakter, Mini Pot)
│   │   ├── Grid Katalog Produk Interaktif (Add to Cart, 3D Tilt, View Counter)
│   │   ├── Floating In-System Web Chat CS (Konsultasi buket di web + Eskalasi WA)
│   │   └── Cart Drawer (Ringkasan belanja, opsi COD vs Ekspedisi, Checkout)
│   │
│   ├── Portal Pelanggan & Pelacakan (/customer-portal)
│   │   ├── Skenario 1: Guest Tracking (Input No. WhatsApp / Invoice -> Lacak Live)
│   │   └── Skenario 2: Registered Member Dashboard ("Admin Pelanggan")
│   │       ├── Header Profile Avatar (Inisial 'SA' / Emoji Kustom)
│   │       ├── Kartu Active Order Tracking (4-Step Progress Stepper Langsung)
│   │       ├── Modal Kustomisasi Profil & Pilihan Emoji Avatar (🌸, 🌷, 🧸, 👑, 🎀)
│   │       ├── Saldo Flower Points & Klaim Voucher Diskon
│   │       ├── Buku Alamat Pengiriman Tersimpan
│   │       └── Riwayat Semua Transaksi + Unduh Resi Digital
│   │
│   └── Sistem Otentikasi Terpadu (/login)
│       ├── Dual Tab: Masuk Akun & Daftar Akun Baru
│       ├── Theme Adaptor (CSS Token otomatis sinkron Tema A, B, atau C)
│       ├── Theme Selector Pills (Ubah suasana tema langsung di halaman login)
│       └── 1-Click Fast Login Demo (Member Sarah Amalia & Super Admin Rania Azzahra)
│
└── 🛠️ ADMIN OPERATIONS DASHBOARD (/admin-dashboard)
    ├── 1. Dashboard & Evaluasi Bisnis (KPI Omzet, Laba Bersih, Slot PO, Rating)
    ├── 2. Grafik Komparasi Finansial (Line Chart SVG: Omzet vs HPP vs Laba Bersih)
    ├── 3. Bill of Materials (BOM) & Biaya Bahan Baku (HPP Kawat Bulu, Cellophane, Pita)
    ├── 4. Manajemen Pesanan (Semua Order, Filter Status, Cetak Resi Thermal A6)
    ├── 5. Laporan & Ekspor Transaksi (Download Spreadsheet Excel/CSV UTF-8 BOM)
    ├── 6. Produk & Analitik Klik Pengunjung (Pantau minat buket, stok, lead time PO)
    ├── 7. Pemasaran & Kupon Diskon (Kupon Persen/Nominal, Kuota Pemakaian)
    ├── 8. Pelayanan Komplain & Rating (Verifikasi Garansi Ganti Baru 100%)
    ├── 9. CS WhatsApp & Web Chat Hub (Integrasi Chat Web Pelanggan + Eskalasi WA)
    ├── 10. Titik Temu COD Google Maps (Geofencing 5 KM, Deteksi Link Maps Otomatis)
    ├── 11. Mode Pemeliharaan & Sinkronisasi Tema (Theme Switcher Cards + Live Preview Iframe)
    ├── 12. Pusat 10 Sakelar Fitur Bisnis (Operational Feature Toggles)
    ├── 13. Pengaturan Toko & Kredensial API (Midtrans, Biteship, WhatsApp)
    └── 14. Akun Admin Header (Avatar Anti-Penyok 1:1, Edit Profil Pengrajin, Ganti Sandi, Logout)
```

---

## 3. Spesifikasi Fitur Unggulan (Detailed Specifications)

### 3.1 Plug-and-Play Multi-Theme Engine
Sistem mendukung perpindahan suasana visual toko secara instan melalui variabel CSS Token tanpa menyentuh struktur logika aplikasi:
* **Tema A: Korean Pastel Atelier**
  - *Palette:* Soft Rose `#E86A82`, Dusty Blush `#FFF0F3`, Cream `#FFF9F7`, Dark Plum `#38252B`.
  - *Typography:* Outfit & Plus Jakarta Sans.
  - *Vibe:* Elegan, lembut, minimalis butik bunga Seoul.
* **Tema B: Modern Romantic**
  - *Palette:* Velvet Wine `#722F37`, Linen Ivory `#F3ECE2`, Antique Gold `#C5A059`, Dark Burgundy `#2B181E`.
  - *Typography:* Playfair Display & Plus Jakarta Sans.
  - *Vibe:* Mewah, dramatis, editorial Eropa untuk hadiah anniversary & lamaran.
* **Tema C: Playful Kawaii & Pastel Pop**
  - *Palette:* Coral Pop `#FF6B81`, Warm Butter `#FFF3E0`, Bubblegum Pink `#EC4899`, Slate Navy `#2C3E50`.
  - *Typography:* Fredoka Rounded & Plus Jakarta Sans.
  - *Vibe:* Ceria, energik, berjiwa muda untuk wisuda sahabat dan kado ulang tahun.
* **Strategi Penambahan Tema Baru (Tema D, E, dll.):**
  - Developer cukup mendaftarkan objek tema di `themes.config.js` dan menambahkan atribut `data-theme="tema-d"`.
  - Seluruh modul inti (keranjang, chat, tracking, login) akan otomatis mewarisi token warna dan tipografi baru secara konsisten.

### 3.2 In-System Live Web Chat (Anti-Direct-WA Trap)
* **Problem:** Banyak toko online langsung menaruh tombol `wa.me/..` sehingga percakapan terpental keluar web, pelanggan ragu karena harus simpan nomor, dan sistem kehilangan jejak analitik chat.
* **Solusi:**
  - Tombol melayang *"Chat CS Pengrajin"* membuka modal chat internal web.
  - Menyediakan *Quick Prompt Chips*: "Tanya Buket Wisuda", "Panduan Pembayaran QRIS", "Titik COD Kampus", "Klaim Garansi Anti Patah".
  - Bot otomatis memberikan jawaban ramah instan.
  - Percakapan tersimpan di `localStorage` (`chenille_live_chats`).
  - Dilengkapi tombol eskalasi resmi: *"Alihkan ke WA Pengrajin"* yang menyertakan rangkuman obrolan dan nomor invoice saat pembeli ingin mengirimkan foto kustom buket.

### 3.3 Titik Temu COD Google Maps & Geofencing Atelier
* **Peta Interaktif Google Maps:** Menggunakan Google Maps Embed interaktif untuk memetakan titik kumpul aman di area kampus dan mall.
* **Deteksi Otomatis (Auto-Detect Flow):**
  - Admin dapat menempelkan link Google Maps (`maps.app.goo.gl` atau `google.com/maps`) atau mengetik nama gedung.
  - Sistem otomatis mengekstrak: **Nama Titik**, **Alamat Lengkap**, **Link Share Google Maps**, dan **Estimasi Jarak (KM)** dari Atelier Pusat (Jl. Margonda Raya No. 108 Depok).
  - Pratinjau pin live Google Maps tertampil langsung di dalam modal sebelum disimpan.
* **Preset Populer 1-Klik:** UI Gerbatama, Margo City Mall, Stasiun KRL Pondok Cina, D'Mall Margonda, Gunadarma Kampus D.
* **Aksi Kartu COD:** Fokus di Peta, Buka di Aplikasi Google Maps (Tab Baru), Salin Link Maps untuk dikirim ke chat, dan Hapus.
* **Geofencing Rule:** Radius maksimum 5.0 KM dari atelier bebas ongkos kirim (Rp 0).

### 3.4 Bill of Materials (BOM) & Kalkulator HPP Kawat Bulu
* Memecah biaya bahan mentah per buket:
  - Batang kawat bulu chenille (warna utama, daun, tangkai): Rp 250 / batang.
  - Boneka mini toga wisuda: Rp 12.000 / pcs.
  - Kertas cellophane motif Korea: Rp 3.500 / lembar.
  - Pita satin premium: Rp 1.500 / meter.
  - Lem tembak & kawat rangka: Rp 1.000 / buket.
  - Lampu LED Fairy Lights (Add-on): Rp 4.500.
* Sistem menghitung: **Total HPP Bahan Baku**, **Harga Jual Katalog**, **Laba Bersih (Rp)**, dan **Margin Untung Bersih (%)**.

### 3.5 Portal Pelanggan Dual-Scenario & Customer Member Hub
* **Skenario 1 (Guest Checkout):**
  - Pembeli tidak dipaksa mendaftar akun.
  - Pelacakan dilakukan via nomor WhatsApp. Jika lupa invoice, sistem otomatis menarik daftar transaksi aktif nomor tersebut.
* **Skenario 2 (Registered Member / "Admin Pelanggan"):**
  - Header avatar interaktif (`SA`) dengan opsi ganti emoji profil (`🌸`, `🌷`, `🧸`, `👑`, `🎀`).
  - **Embedded Active Order Tracking Stepper:** Menampilkan status pesanan aktif langsung di dashboard:
    1. *Pembayaran Diterima (Lunas via QRIS)*
    2. *Perangkaian Kawat Bulu (Sedang Dirangkai Pengrajin)*
    3. *Quality Control & Foto Buket Selesai*
    4. *Kurir Mengantar / Siap COD*
  - Saldo Flower Points loyalty untuk diskon pembelian berikutnya.
  - Riwayat lengkap transaksi dan unduh resi digital A6/thermal.

### 3.6 Admin Header Anti-Penyok & Profil Manajemen
* Header avatar dikunci strictly 1:1 circular (`width: 38px`, `height: 38px`, `aspect-ratio: 1 / 1`, `flex-shrink: 0`).
* Dropdown profil admin menyediakan:
  - **Profil Pengrajin & Akun:** Modal edit nama, bio keahlian, nomor kontak resmi.
  - **Pengaturan Atelier:** Navigasi ke pengaturan toko.
  - **Ganti Kata Sandi:** Modal validasi kata sandi lama dan baru.
  - **Keluar / Logout:** Redirect ke halaman login bertema aktif.

---

## 4. Skema Database Prisma (PostgreSQL Supabase)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  FLORIST_STAFF
  CUSTOMER_MEMBER
}

enum ThemeKey {
  TEMA_A_KOREAN_PASTEL
  TEMA_B_MODERN_ROMANTIC
  TEMA_C_PLAYFUL_KAWAII
}

enum OrderFulfillment {
  COURIER_EXPEDITION
  COD_MEETUP_POINT
}

enum OrderStepStatus {
  PAYMENT_CONFIRMED
  CRAFTING_BOUQUET
  QUALITY_CHECK_PASSED
  IN_DELIVERY
  COMPLETED
  CANCELLED
}

// ------------------------------------------------------
// USER & CUSTOMER MEMBERSHIP
// ------------------------------------------------------
model User {
  id            String          @id @default(uuid())
  email         String          @unique
  phone         String          @unique
  name          String
  password_hash String
  role          Role            @default(CUSTOMER_MEMBER)
  avatar_emoji  String?         @default("🌸")
  avatar_url    String?
  flower_points Int             @default(50)
  created_at    DateTime        @default(now())
  updated_at    DateTime        @updatedAt

  orders        Order[]
  addresses     CustomerAddress[]
  chat_sessions ChatSession[]
}

model CustomerAddress {
  id            String   @id @default(uuid())
  user_id       String
  user          User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  label         String   // e.g. "Kampus UI", "Kost Margonda", "Rumah"
  recipient     String
  phone         String
  full_address  String
  postal_code   String?
  is_primary    Boolean  @default(false)
  created_at    DateTime @default(now())
}

// ------------------------------------------------------
// PRODUCT, BILL OF MATERIALS (BOM) & INVENTORY
// ------------------------------------------------------
model Product {
  id             String          @id @default(uuid())
  name           String
  slug           String          @unique
  category       String          // Wisuda, Romantis, Pastel, Karakter, Mini Pot
  price          Decimal         @db.Decimal(12, 2)
  discount_price Decimal?        @db.Decimal(12, 2)
  raw_cost_hpp   Decimal         @db.Decimal(12, 2) // Total HPP dari BOM
  stock          Int             @default(10)
  po_lead_days   Int             @default(2)
  click_count    Int             @default(0)
  is_ready_stock Boolean         @default(true)
  is_active      Boolean         @default(true)
  created_at     DateTime        @default(now())
  updated_at     DateTime        @updatedAt

  bom_items      BillOfMaterial[]
  order_items    OrderItem[]
}

model RawMaterial {
  id             String          @id @default(uuid())
  name           String          // e.g. "Kawat Bulu Pink Pastel", "Cellophane White Border"
  category       String          // KAWAT_BULU, CELLOPHANE, PITA, ACCESSORY
  unit           String          // batang, lembar, meter, pcs
  unit_price     Decimal         @db.Decimal(10, 2)
  stock_quantity Int             @default(500)
  created_at     DateTime        @default(now())

  bom_recipes    BillOfMaterial[]
}

model BillOfMaterial {
  id              String       @id @default(uuid())
  product_id      String
  product         Product      @relation(fields: [product_id], references: [id], onDelete: Cascade)
  raw_material_id String
  raw_material    RawMaterial  @relation(fields: [raw_material_id], references: [id])
  quantity_needed Int          // Batang kawat / lembar kertas yang dibutuhkan
  subtotal_cost   Decimal      @db.Decimal(10, 2)
}

// ------------------------------------------------------
// GOOGLE MAPS COD POINTS & GEOFENCING
// ------------------------------------------------------
model CodMeetingPoint {
  id             String   @id @default(uuid())
  name           String   // e.g. "Kampus UI Depok (Gerbatama & Rotunda)"
  full_address   String
  google_maps_url String  // Link resmi maps.google.com/?q=...
  embed_query    String?  // Kata kunci pencarian embed iframe
  distance_km    Decimal  @db.Decimal(4, 1)
  delivery_notes String?  // "Lobby utama samping Starbucks"
  is_active      Boolean  @default(true)
  created_at     DateTime @default(now())

  orders         Order[]
}

// ------------------------------------------------------
// ORDERS, TRACKING & TRANSACTIONS
// ------------------------------------------------------
model Order {
  id                 String           @id @default(uuid())
  invoice_number     String           @unique // e.g. INV/20260907/001
  user_id            String?
  user               User?            @relation(fields: [user_id], references: [id])
  guest_name         String
  guest_phone        String
  guest_email        String?
  
  fulfillment_type   OrderFulfillment @default(COURIER_EXPEDITION)
  status             OrderStepStatus  @default(PAYMENT_CONFIRMED)
  
  subtotal           Decimal          @db.Decimal(12, 2)
  shipping_cost      Decimal          @default(0) @db.Decimal(12, 2)
  discount_amount    Decimal          @default(0) @db.Decimal(12, 2)
  total_amount       Decimal          @db.Decimal(12, 2)
  total_hpp_cost     Decimal          @db.Decimal(12, 2) // HPP gabungan untuk laporan laba
  net_profit         Decimal          @db.Decimal(12, 2) // total_amount - total_hpp_cost
  
  // Midtrans Payment
  payment_method     String           @default("QRIS Midtrans Snap")
  is_paid            Boolean          @default(true)
  paid_at            DateTime?
  
  // Logistics / COD
  cod_point_id       String?
  cod_point          CodMeetingPoint? @relation(fields: [cod_point_id], references: [id])
  shipping_courier   String?          // Biteship: J&T / SiCepat
  shipping_awb       String?          // Resi pengiriman
  shipping_address   String?
  
  created_at         DateTime         @default(now())
  updated_at         DateTime         @updatedAt

  items              OrderItem[]
}

model OrderItem {
  id         String   @id @default(uuid())
  order_id   String
  order      Order    @relation(fields: [order_id], references: [id], onDelete: Cascade)
  product_id String
  product    Product  @relation(fields: [product_id], references: [id])
  quantity   Int
  unit_price Decimal  @db.Decimal(12, 2)
  item_hpp   Decimal  @db.Decimal(12, 2)
  notes      String?  // Kustomisasi kartu ucapan
}

// ------------------------------------------------------
// IN-SYSTEM LIVE WEB CHAT
// ------------------------------------------------------
model ChatSession {
  id             String    @id @default(uuid())
  user_id        String?
  user           User?     @relation(fields: [user_id], references: [id])
  session_token  String    @unique
  customer_name  String
  customer_phone String?
  is_escalated_wa Boolean  @default(false)
  created_at     DateTime  @default(now())
  updated_at     DateTime  @updatedAt

  messages       ChatMessage[]
}

model ChatMessage {
  id         String      @id @default(uuid())
  session_id String
  session    ChatSession @relation(fields: [session_id], references: [id], onDelete: Cascade)
  sender     String      // "CUSTOMER" | "BOT" | "FLORIST_ADMIN"
  text       String
  sent_at    DateTime    @default(now())
}

// ------------------------------------------------------
// STORE SETTINGS & MAINTENANCE
// ------------------------------------------------------
model StoreSetting {
  id                  String   @id @default("atelier_setting")
  active_theme        ThemeKey @default(TEMA_A_KOREAN_PASTEL)
  is_maintenance_mode Boolean  @default(false)
  maintenance_title   String   @default("Atelier Chenille Sedang Istirahat Produksi")
  maintenance_desc    String   @default("Kapasitas buket wisuda hari ini telah penuh (10/10 slot).")
  daily_po_limit      Int      @default(10)
  official_whatsapp   String   @default("081234567890")
  atelier_address     String   @default("Jl. Margonda Raya No. 108 Depok")
  updated_at          DateTime @updatedAt
}
```

---

## 5. Non-Functional Requirements & Standar Kualitas (QA P0)

1. **Anti-Distortion Geometry:** Semua avatar inisial/gambar wajib mempertahankan aspect ratio 1:1 bulat sempurna pada resolusi layar berapapun (Desktop, Tablet, Mobile) tanpa toleransi distorsi oval.
2. **Deterministic Layout Flex Stability:** Tidak boleh ada elemen dialog modal yang dirender di luar pembungkus overlay (`.modal-overlay`), guna mencegah kerusakan flow dokumen (*layout rapet*).
3. **No Direct WA Trap:** Semua akses komunikasi awal pelanggan wajib melalui web chat internal dengan opsi eskalasi manual ke WhatsApp.
4. **Google Maps Compatibility:** Iframe peta wajib menggunakan embed standar yang dapat dirender instan tanpa ketergantungan API billing berbayar di tahap awal, dengan tombol fallback ke `google.com/maps/search`.
5. **Zero Data Loss:** Pengaturan tema dan riwayat chat web disinkronkan secara ganda ke `localStorage` dan state database.
6. **Security & Session RBAC:** Seluruh endpoint `/admin-dashboard` wajib memvalidasi otentikasi peran `SUPER_ADMIN`, dan tombol logout wajib menghapus seluruh token sesi aktif sebelum pengalihan rute.

---

## 6. Jadwal Rilis & Roadmap Pengembangan

* **Fase 1 (Selesai):** Pembuatan 3 Desain Tema Etalase (Korean Pastel, Modern Romantic, Playful Kawaii).
* **Fase 2 (Selesai):** Admin Operations Dashboard v2.6, 100% SVG Icons, Financial Line Chart, BOM Costing.
* **Fase 3 (Selesai):** Integrasi Google Maps Titik Temu COD, Auto-Detect Link, dan Geofencing Atelier.
* **Fase 4 (Selesai):** Portal Member Pelanggan (Avatar Emoji, Active Stepper Tracking, Flower Points).
* **Fase 5 (Selesai):** Halaman Login & Register Multi-Tema Dinamis dengan 1-Click Fast Login.
* **Fase 6 (Tahap Selanjutnya):** Migrasi Unified Framework Nuxt 3 / Next.js dengan Prisma Database Supabase, integrasi Midtrans Snap live webhook, dan Biteship live courier dispatch.
