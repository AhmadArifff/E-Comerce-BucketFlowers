# PRD: E-Commerce & Interactive Multi-Theme Catalog Buket Bunga Kawat Bulu

**Nama Produk:** E-Commerce & Interactive Multi-Theme Catalog Buket Bunga Kawat Bulu (*Aesthetic Chenille Flowers Atelier*)  
**Arsitektur:** Enterprise Turborepo Monorepo (`apps/web` + `apps/api` + `packages/shared`) + Vercel Deployment + Supabase PostgreSQL  
**Standar Operasional:** Shopify-Grade Operations, Google Maps Geofencing, Multi-Theme Engine & Real-Time Logistics  
**Role / Penulis:** Senior Product Manager, Lead Architect & Tech Critic Reviewer  
**Tanggal Rilis:** 2026-09-07  
**Versi:** v2.2 (Complete Pre-Development Specification — Checkout Flow, Payment Gateway, Logistics, RBAC, API Contract, Image Storage, Loyalty Points, Search Engine, Notifications & Testing Strategy)  
**Status:** Approved for Full Implementation & Git Release  
**Tech Stack Baseline:** Turborepo 2.x, Next.js 15+ (App Router), Express.js (ESM Module on Vercel Serverless), Prisma ORM (Supabase PostgreSQL with PgBouncer Connection Pooling), Better Auth (RBAC & Session Rotation), Tailwind CSS + Design Tokens, Midtrans Snap SDK, Biteship Logistics API, Google Maps Embed & URL Schemes, Result Pattern (`@chenille/shared`), Pino Structured Logging.

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
7. **Enterprise Monorepo Architecture (Turborepo):** Memisahkan modul frontend storefront/admin (`apps/web`), backend API engine (`apps/api`), dan kontrak validasi/tipe data (`packages/shared`) guna menjamin skalabilitas, *type safety* end-to-end, dan kemudahan deployment independen di Vercel.

---

## 2. Arsitektur Sitemap & Navigasi Terpadu

```text
E-COMMERCE CHENILLE FLOWERS SITEMAP
  ├── 🛒 STOREFRONT & CUSTOMER PORTAL (apps/web)
  │   ├── Halaman Etalase & Landing Page Terpadu (http://localhost:3000/)
  │   │   ├── Top Announcement Bar (Promo & Info Kuota Wisuda)
  │   │   ├── Sticky Navbar (Brand Logo, 6 Menu Utama Tanpa Wrapping, Pencarian, Masuk/Akun, Cart Drawer Bump)
  │   │   ├── 1. Modul Beranda (#home)
  │   │   │   ├── Hero Banner Realistik (Preview foto buket asli, badge 100% Handcrafted Chenille Velvet)
  │   │   │   ├── CTA Ganda: "Jelajahi Katalog 🌸" (#katalog) & "Rangkai Custom ✨" (#custom)
  │   │   │   ├── 4 Trust Cards: Awet Selamanya, Kardus Box Tebal, COD Titik Temu, Garansi 100% Baru
  │   │   │   └── Koleksi Favorit Paling Diminati (4 Bestsellers, star rating, view count, 3D tilt hover)
  │   │   ├── 2. Modul Katalog Bunga (#katalog)
  │   │   │   ├── Indikator Throttling Kuota Harian (Batas 20 buket/hari agar presisi)
  │   │   │   ├── Filter Pills: Semua Model (8), Wisuda & Sidang, Romantis, Karakter, Mini Pot
  │   │   │   └── Grid 8 Buket Lengkap (Badge PO vs Ready, Price was/now, modal detail, Add to Cart)
  │   │   ├── 3. Modul Custom Studio Interaktif (#custom)
  │   │   │   ├── Step 1: Bunga Utama (Tulip 🌷, Mawar 🌹, Matahari 🌻, Lavender 🪻)
  │   │   │   ├── Step 2: Swatch Warna Kawat Bulu (Pastel Pink, Lavender Lilac, Sky Blue, Matcha Sage)
  │   │   │   ├── Step 3: Pilihan Kertas Wrapping Cellophane (Korean Two-Tone, Lilac Velvet, Clean Oat)
  │   │   │   ├── Step 4: Aksesori Tambahan Upselling (Lampu LED +10k, Boneka Toga +15k, Kartu Ucapan +5k)
  │   │   │   ├── Preview Canvas Live Emoji & Label Dinamis
  │   │   │   ├── Ringkasan Pesanan & Kalkulasi Subtotal Live
  │   │   │   └── Direct WhatsApp Order Deep Link & Tambah ke Keranjang Web
  │   │   ├── 4. Modul Lookbook & Inspirasi Pelanggan (#lookbook)
  │   │   │   ├── Bukti Sosial Wisuda UI 2026, Anniversary 2nd Year, Sidang Skripsi IPB
  │   │   │   └── Kutipan Testimoni Autentik, Hashtag, dan Lokasi Pelanggan
  │   │   ├── 5. Modul Lacak Pesanan Cepat (#tracking)
  │   │   │   ├── Input Cepat No. Invoice (contoh: INV/20260907/FLW-0001)
  │   │   │   ├── 4-Step Progress Stepper Timeline Real-time (Bayar -> Rangkai -> Packing -> Kurir)
  │   │   │   └── Tautan Cepat ke Portal Pelanggan Terpadu
  │   │   ├── 6. Modul Bantuan, Perawatan & Garansi 100% (#bantuan)
  │   │   │   ├── FAQ Panduan Perawatan (Merapikan kelopak kawat lentur, bersihkan debu tanpa air)
  │   │   │   └── Banner Kebijakan Garansi 100% Ganti Buket Baru (Free Shipping)
  │   │   ├── Floating In-System Web Chat CS (Konsultasi buket di web + Eskalasi WA)
  │   │   └── Cart Drawer (Ringkasan belanja, opsi COD vs Ekspedisi, Kupon, Checkout)
  │   │
  │   ├── Portal Pelanggan & Pelacakan (/portal)
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
  │       ├── Tata Kelola Tema: Dikunci oleh Admin (Publik Dilarang Mengganti Tema)
  │       └── 1-Click Fast Login Demo (Member Sarah Amalia & Super Admin Rania Azzahra)
│
└── 🛠️ ADMIN OPERATIONS DASHBOARD (apps/web & apps/api)
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

## 3. Arsitektur Monorepo & Workspace Blueprint (Turborepo + npm Workspaces)

> **KEPUTUSAN ARSITEKTURAL UTAMA:** Proyek ini mengadopsi struktur **Turborepo Monorepo** yang terinspirasi dari arsitektur teruji pada proyek reference `CrownJobExpiredSupbase`. Pendekatan ini memisahkan layer presentasi, layer backend business-logic, dan layer kontrak data secara modular dan terisolasi.

```
E-Comerce-BucketFlowers/
├── README.md                            # Dokumentasi teknis & instalasi monorepo
├── LICENSE                              # Lisensi MIT (2026 Ahmad Arif)
├── PRD.md                               # Dokumen Spesifikasi Produk & Arsitektur (Master PRD)
├── .gitignore                           # Git ignore terpadu untuk node_modules, .turbo, .next, dist
├── .env.example                         # Template environment variables (Backend API & Frontend Web)
├── package.json                         # Root package.json (npm workspaces & turbo scripts)
├── turbo.json                           # Konfigurasi caching, task pipeline, dan dependencies
│
├── apps/
│   ├── web/                             # [Frontend] Next.js 15+ (App Router) + Tailwind CSS + Motion
│   │   ├── package.json                 # Dependensi: @chenille/shared, next, react, motion, lucide-react
│   │   ├── next.config.ts               # Next.js config (transpilePackages: ["@chenille/shared"])
│   │   ├── tailwind.config.js           # Konfigurasi Tailwind & CSS Custom Properties
│   │   ├── tsconfig.json                # TypeScript config (paths & project references)
│   │   ├── public/                      # Static assets, logo atelier, favicon
│   │   └── src/
│   │       ├── app/                     # Next.js App Router
│   │       │   ├── layout.tsx           # Root layout dengan Font Injection
│   │       │   ├── page.tsx             # Storefront Multi-Tema (Tema A, B, C switcher)
│   │       │   ├── login/page.tsx       # Halaman Login Multi-Tema
│   │       │   ├── portal/page.tsx      # Customer Member Hub & Tracking Portal
│   │       │   └── admin/page.tsx       # Admin Operations Dashboard
│   │       ├── components/              # Modular Reusable Components
│   │       │   ├── storefront/          # Navbar, Hero, ProductCard, CartDrawer, LiveChatModal
│   │       │   ├── portal/              # GuestTracker, MemberHeader, OrderStepper, PointsCard
│   │       │   ├── admin/               # KPIWidgets, FinancialChart, BOMCalculator, CODGoogleMapsModal
│   │       │   └── shared/              # Toast, ModalOverlay, AvatarRound, Buttons
│   │       ├── lib/
│   │       │   ├── api-client.ts        # Axios/Fetch wrapper terintegrasi Result Pattern
│   │       │   ├── auth-client.ts       # Better Auth Client session hooks
│   │       │   └── theme-engine.ts      # Logika inject data-theme & CSS variables
│   │       └── stores/
│   │           ├── useCartStore.ts      # State cart, kupon diskon, dan kalkulasi COD
│   │           ├── useThemeStore.ts     # State tema aktif (Tema A/B/C) tersinkron
│   │           └── useChatStore.ts      # State obrolan live web chat & histori
│   │
│   └── api/                             # [Backend] Express.js Engine (Vercel Serverless / Node ESM)
│       ├── package.json                 # "type": "module", Prisma, Better Auth, Express, Zod, Pino
│       ├── tsconfig.json                # TypeScript ESM ("module": "NodeNext", "moduleResolution": "NodeNext")
│       ├── vercel.json                  # Vercel Serverless Function routing config
│       ├── api/
│       │   └── index.ts                 # Serverless Entry Point untuk deployment Vercel
│       ├── prisma/
│       │   ├── schema.prisma            # PostgreSQL Database Schema (Supabase)
│       │   └── migrations/              # Riwayat migrasi Prisma
│       └── src/
│           ├── app.ts                   # Express application setup & middleware registration
│           ├── server.ts                # Local development listener (port 4000)
│           ├── config/
│           │   ├── env.ts               # Validasi Zod untuk Environment Variables
│           │   ├── database.ts          # PrismaClient singleton dengan error handling
│           │   └── cors.ts              # CORS allowlist (Frontend Vercel Domain & Localhost)
│           ├── routes/
│           │   ├── index.ts             # Route aggregator (/api/v1/*)
│           │   ├── auth.routes.ts       # Autentikasi Better Auth (/api/v1/auth/*)
│           │   ├── products.routes.ts   # Katalog produk & analitik klik
│           │   ├── bom.routes.ts        # Bill of Materials & HPP calculator
│           │   ├── orders.routes.ts     # Transaksi, pelacakan pesanan, & status stepper
│           │   ├── cod.routes.ts        # Titik temu COD Google Maps & kalkulasi radius
│           │   ├── chat.routes.ts       # Live web chat internal & eskalasi WhatsApp
│           │   ├── payment.routes.ts    # Midtrans Snap webhook & verifikasi QRIS
│           │   └── logistics.routes.ts  # Biteship courier dispatch & resi webhook
│           ├── controllers/             # Handler request/response per domain
│           ├── services/                # Business logic murni yang mengembalikan Result<T>
│           ├── middlewares/
│           │   ├── auth.middleware.ts   # Guard otentikasi role SUPER_ADMIN vs CUSTOMER_MEMBER
│           │   ├── error.middleware.ts  # Centralized error handler dengan logging Pino
│           │   └── validate.middleware.ts # Validasi Zod schema dari @chenille/shared
│           └── lib/
│               ├── logger.ts            # Pino JSON structured logger
│               └── result.ts            # Result Pattern helper (self-contained ESM)
│
├── packages/
│   └── shared/                          # [@chenille/shared] Kontrak Data & Shared Utilities
│       ├── package.json                 # Package metadata & build scripts
│       ├── tsconfig.json                # TypeScript compiler config (declaration: true, outDir: dist)
│       └── src/
│           ├── index.ts                 # Main bundle export
│           ├── result.ts                # Result<T> pattern class wrapper
│           ├── types/                   # TypeScript Interfaces & Enums
│           │   ├── product.types.ts     # Tipe data produk, kategori, & varian
│           │   ├── bom.types.ts         # Tipe data Bill of Materials & komponen bahan
│           │   ├── order.types.ts       # Tipe data invoice, fulfillment, & order status
│           │   ├── cod.types.ts         # Tipe data titik temu COD Google Maps
│           │   ├── chat.types.ts        # Tipe data sesi obrolan live chat
│           │   ├── auth.types.ts        # Tipe data User, Role, & Session Token
│           │   └── theme.types.ts       # Definisi ThemeKey (Tema A, B, C) & Token Warna
│           ├── schemas/                 # Zod Validation Schemas
│           │   ├── product.schema.ts    # Validasi input produk baru & kuota PO
│           │   ├── order.schema.ts      # Validasi checkout (Guest vs Member)
│           │   ├── cod.schema.ts        # Validasi koordinat & URL link Google Maps
│           │   └── chat.schema.ts       # Validasi pesan teks & bot prompt
│           └── constants/               # Nilai Konstanta Bisnis
│               ├── geofencing.ts        # RADIUS_MAX_FREE_SHIPPING_KM = 5.0
│               ├── themes.ts            # Definisi palette CSS tokens & font pairings
│               └── limits.ts            # Batas kuota PO harian & rate limiting
│
├── desain-tampilan/                     # Prototype Showcase & Interactive HTML Demonstrators
│   ├── index.html                       # Hub Navigasi 6 Desain Interaktif
│   ├── tema-a-korean-pastel/index.html  # Demo Etalase Tema A
│   ├── tema-b-modern-romantic/index.html# Demo Etalase Tema B
│   ├── tema-c-playful-kawaii/index.html # Demo Etalase Tema C
│   ├── admin-dashboard/index.html       # Demo Admin Panel v2.6 (COD Maps, BOM, Charts)
│   ├── customer-portal/index.html       # Demo Portal Pelanggan (Guest & Member)
│   └── login/index.html                 # Demo Login & Register Multi-Tema
│
└── docs/                                # Bukti Verifikasi & Tangkapan Layar
    └── screenshots/                     # 14 Tangkapan Layar E2E Playwright Hasil Uji
```

---

## 4. Pembelajaran Kritis dari Project `CrownJobExpiredSupbase` (Battle-Tested Lessons & Mitigations)

Berdasarkan investigasi menyeluruh pada arsitektur reference `CrownJobExpiredSupbase`, berikut adalah kumpulan solusi nyata atas kendala deployment dan monorepo tooling yang wajib diterapkan pada proyek ini:

### 4.1 Mitigasi Vercel `@vercel/node` Monorepo Symlink Trace Bug (500 Module Not Found)
* **Masalah Lapangan:** Vercel menggunakan utility `@vercel/nft` (Node File Trace) untuk membungkus serverless function pada `apps/api`. Saat function meng-import package internal `@chenille/shared` via symlink npm workspaces, tracing Vercel kerap gagal mencari file di luar root folder `apps/api`, sehingga menghasilkan runtime error `Cannot find module '@chenille/shared'`.
* **Solusi Teruji:**
  1. `packages/shared` dikompilasi secara deterministik ke direktori `dist/` (`tsc -b`) sebelum proses build aplikasi dimulai (`dependsOn: ["^build"]` di `turbo.json`).
  2. File utility inti seperti `Result<T>` disediakan pula secara mandiri (*self-contained copy*) di `apps/api/src/lib/result.ts` agar backend API tidak lumpuh total saat symlink environment serverless mengalami de-sync.
  3. Pada dashboard Vercel untuk `apps/api`, opsi **"Include source files outside of the Root Directory"** wajib diset ke **ON (Checked)**.

### 4.2 Standardisasi Pure ESM Module (`"type": "module"`)
* **Masalah Lapangan:** Library modern seperti `better-auth` dirilis murni sebagai ECMAScript Module (`.mjs` ESM-only). Jika backend `apps/api` menggunakan format CommonJS lama (`require()`), Node.js akan melempar crash `ERR_REQUIRE_ESM`.
* **Solusi Teruji:**
  1. `package.json` pada `apps/api` dan `packages/shared` secara eksplisit mendefinisikan `"type": "module"`.
  2. `tsconfig.json` backend dikonfigurasi dengan `"module": "NodeNext"` dan `"moduleResolution": "NodeNext"`.
  3. Seluruh import internal lokal wajib menyertakan ekstensi `.js` (contoh: `import { prisma } from "./config/database.js"`).

### 4.3 Dual-URL Supabase PostgreSQL (Connection Pooling vs Direct Migration)
* **Masalah Lapangan:** Serverless function Next.js dan Express menciptakan koneksi baru secara masif pada lonjakan traffic, yang dengan cepat menyebabkan PostgreSQL crash karena kehabisan slot koneksi (*Connection Pool Exhaustion*). Sebaliknya, tool migrasi Prisma (`prisma migrate`) tidak bisa berjalan di atas PgBouncer dalam mode *transaction pooling*.
* **Solusi Teruji:**
  Konfigurasi Prisma wajib menerapkan arsitektur Dual-URL pada `schema.prisma`:
  ```prisma
  datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL") // Port 6543 (PgBouncer Connection Pooling + limit=1)
    directUrl = env("DIRECT_URL")   // Port 5432 (Direct connection untuk migrasi skema)
  }
  ```

### 4.4 Result Pattern untuk Error Handling Tanpa Try-Catch Leak
* **Prinsip Desain:** Mengeliminasi penggunaan `throw new Error()` yang tidak terkontrol pada business logic. Seluruh service wajib mengembalikan objek `Result<T>`:
  ```typescript
  export class Result<T> {
    public readonly isSuccess: boolean;
    public readonly isFailure: boolean;
    public readonly error: string | null;
    public readonly errorCode?: string;
    private readonly _value?: T;
    // ok() & fail() factory constructors
  }
  ```
  Ini mencegah tereksposnya stack trace database/server ke pengguna dan memastikan response HTTP selalu memiliki struktur yang konsisten.

### 4.5 Penanganan Konflik Port Monorepo Dev Server (`EADDRINUSE: address already in use :::3000`)
* **Masalah Lapangan:**
  Saat developer tim atau runner menjalankan `npm run dev` atau `turbo run dev`, proses gagal dengan error:
  ```text
  ⨯ Failed to start server
  Error: listen EADDRINUSE: address already in use :::3000
      at <unknown> (Error: listen EADDRINUSE: address already in use :::3000)
      code: 'EADDRINUSE',
      syscall: 'listen',
      address: '::',
      port: 3000
  ```
* **Akar Penyebab (*Root Cause*):**
  1. Adanya proses Node.js / Next.js sebelumnya yang masih aktif di latar belakang (misalnya sub-proses IDE, daemon agent, atau sesi terminal yang belum dimatikan sempurna) dan tetap mengikat (*holding socket*) port 3000.
  2. Paket monorepo belum melepaskan listener saat server di-restart secara paksa.
* **Solusi Teruji & Standar Operasional Tim:**
  1. **Solusi Cepat Otomatis (Perintah npm):**
     Jalankan script yang telah disediakan di root `package.json`:
     ```bash
     npm run kill:port
     npm run dev
     ```
  2. **Solusi Manual via PowerShell (Windows):**
     Hentikan proses yang mengunci port 3000 secara langsung:
     ```powershell
     Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force
     ```
  3. **Solusi Port Alternatif:**
     Jika port 3000 sengaja digunakan aplikasi lain, jalankan pada port cadangan:
     ```bash
     npm run dev:web -- --port 3001
     ```

---

## 5. Konfigurasi Root Monorepo & Task Pipeline

### 5.1 Konfigurasi Root `package.json`

```json
{
  "name": "e-commerce-bucket-flowers",
  "private": true,
  "version": "2.1.0",
  "packageManager": "npm@10.8.2",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:generate": "turbo run db:generate",
    "db:push": "turbo run db:push"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "devDependencies": {
    "turbo": "^2.4.0",
    "typescript": "^5.7.3"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 5.2 Konfigurasi Turborepo Pipeline (`turbo.json`)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": [
    "NODE_ENV",
    "DATABASE_URL",
    "DIRECT_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "JWT_SECRET",
    "MIDTRANS_SERVER_KEY",
    "MIDTRANS_CLIENT_KEY",
    "BITESHIP_API_KEY",
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_MIDTRANS_CLIENT_KEY"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    },
    "db:generate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

## 6. Architectural Decision Records (ADR) Monorepo

| # | Keputusan Arsitektural | Opsi Terpilih | Alasan & Rasional |
|---|------------------------|---------------|-------------------|
| **ADR-01** | **Monorepo Tooling Engine** | **Turborepo 2.x + npm Workspaces** | Native Vercel integration, zero-config remote caching, execution parallelisasi super cepat, dan dependensi terorganisir rapi. |
| **ADR-02** | **Pemisahan Frontend & Backend** | **`apps/web` (Next.js) & `apps/api` (Express ESM)** | Frontend fokus pada UI render, CSS tokens, & dynamic layout. Backend fokus pada atomic lock inventory, Midtrans webhook, dan BOM calculation. |
| **ADR-03** | **Shared Contract Layer** | **`packages/shared`** | Mencegah redundansi skema validasi Zod dan tipe TypeScript antara frontend form dan backend payload request. |
| **ADR-04** | **Format Modul Backend** | **Pure ECMAScript Module (ESM)** | Menjamin kompatibilitas 100% dengan `better-auth` dan library modern tanpa perlu polyfill Babel/Webpack CommonJS. |
| **ADR-05** | **Database Connection Strategy** | **Supabase PgBouncer Pooler + Direct URL** | PgBouncer port 6543 mencegah connection limit leak pada serverless, sementara port 5432 menjaga kelancaran migrasi Prisma. |
| **ADR-06** | **Pola Penanganan Error** | **Result Pattern (`Result<T>`)** | Standarisasi respons tanpa overhead crash/exceptions, memudahkan frontend menampilkan pesan kesalahan ramah pengguna. |
| **ADR-07** | **In-System Chat Architecture** | **Internal Web Chat + Escalation Token** | Mengatasi masalah pembeli yang langsung lari ke WA tanpa jejak transaksi, sembari tetap menyediakan fallback konsultasi via WhatsApp. |

---

## 7. Spesifikasi Fitur Unggulan (Detailed Specifications)

### 7.1 Plug-and-Play Multi-Theme Engine & Shared Tokens
Sistem mendukung perpindahan suasana visual toko secara instan melalui variabel CSS Custom Properties tanpa menyentuh struktur logika aplikasi. Definisi token disimpan di `@chenille/shared/constants/themes.ts`:
* **Tema A: Korean Pastel Atelier**
  - *Palette:* Soft Rose `#E86A82`, Dusty Blush `#FFF0F3`, Cream `#FFF9F7`, Dark Plum `#38252B`.
  - *Typography:* Cormorant Garamond & Plus Jakarta Sans.
  - *Vibe:* Elegan, lembut, minimalis butik bunga Seoul.
* **Tema B: Modern Romantic**
  - *Palette:* Velvet Wine `#722F37`, Linen Ivory `#F3ECE2`, Antique Gold `#C5A059`, Dark Burgundy `#2B181E`.
  - *Typography:* Bodoni Moda & Inter.
  - *Vibe:* Mewah, dramatis, editorial Eropa untuk hadiah anniversary & lamaran.
* **Tema C: Playful Kawaii & Pastel Pop**
  - *Palette:* Coral Pop `#FF6B81`, Warm Butter `#FFF3E0`, Bubblegum Pink `#EC4899`, Slate Navy `#2C3E50`.
  - *Typography:* Nunito Rounded & Outfit.
  - *Vibe:* Ceria, energik, berjiwa muda untuk wisuda sahabat dan kado ulang tahun.
* **Aturan Tata Kelola Tema (Admin-Only Control Policy):**
  - **Prinsip Utama:** Tema etalase toko (`tema-a`, `tema-b`, `tema-c`) **hanya dapat dikonfigurasi dan diubah oleh Super Admin dari dalam Admin Panel (`/admin`)**.
  - **Larangan Halaman Publik:** Dilarang keras menampilkan selector/dropdown/pill tema pada halaman Storefront publik, Customer Portal, ataupun Login Page pengunjung.
  - **Mekanisme Sinkronisasi Global:** Ketika Super Admin memilih tema baru di Admin Panel (`AdminHeader` atau `FeatureToggles`), sistem menyimpan kunci di `localStorage.setItem('chenille_active_theme', themeKey)` dan memancarkan state Zustand `useThemeStore`. Seluruh tab, sesi pengunjung, halaman login, dan portal otomatis menyesuaikan variabel CSS tokens tanpa perlu refresh halaman.
  - **Injeksi Anti-Flicker:** Menggunakan inline script pada `<head>` di `layout.tsx` agar browser membaca `chenille_active_theme` sebelum hydration pertama, mencegah terjadinya visual flash tema default.
* **Strategi Penambahan Tema Baru (Tema D, E, dst.):**
  - Developer cukup mendaftarkan objek tema baru di `@chenille/shared/constants/themes.ts` dan menambahkan CSS selector `[data-theme="tema-d"]`.
  - Seluruh modul etalase, portal member, dan login akan otomatis mewarisi warna serta tipografi baru.

### 7.2 Spesifikasi 6 Modul Utama Storefront Terpadu
Halaman etalase utama (`http://localhost:3000/`) menyatukan 6 modul interaktif berbasis prototipe desain asli:
1. **Modul 1: Beranda (#home)**
   - *Hero Banner:* Menggunakan aset foto resolusi tinggi asli pengrajin (`/preview-tema-a.jpg` / `/preview-tema-b.jpg`), badge `100% Handcrafted Chenille Velvet`, serta tombol ganda eksplorasi katalog dan studio custom.
   - *4 Trust Cards:*
     - 🌿 **Awet Selamanya:** Kawat bulu premium anti-rontok & tak pernah layu.
     - 📦 **Kardus Box Tebal:** Double-wall corrugated box aman dari tekanan kurir.
     - 🤝 **COD Titik Temu:** Janji temu langsung di kampus UI, Gundar, atau stasiun.
     - 🛡️ **Garansi 100% Baru:** Ganti buket baru jika rusak saat pengiriman.
   - *Koleksi Favorit:* 4 buket terlaris dengan rating bintang, jumlah ulasan, view counter, dan 3D tilt hover.

2. **Modul 2: Katalog Lengkap & Filter Kategori (#katalog)**
   - Filter pills kategori: *Semua Model (8)*, *Wisuda & Sidang*, *Romantis & Valentine*, *Karakter & Hewan*, *Mini Pot Hias Meja*.
   - Kartu produk interaktif dengan indikator ketersediaan: *Ready Stock* vs *Pre-Order (PO Lead Time)*.
   - Widget batas kapasitas harian (*Capacity Throttling*: 20 buket/hari).

3. **Modul 3: Custom Studio Interaktif (#custom)**
   - Pemilih bunga utama: Tulip 🌷 (Rp 120k), Mawar Velvet 🌹 (Rp 130k), Bunga Matahari 🌻 (Rp 115k), Lavender 🪻 (Rp 125k).
   - Swatch warna kawat bulu (*Chenille Stem*): Pastel Pink, Lavender Lilac, Sky Blue, Matcha Sage.
   - Pilihan kertas wrapping: Korean Two-Tone Pink, Lilac & White Velvet, Minimalist Clean Oat.
   - Aksesori tambahan upselling (*BOM Accessories*): Lampu LED Fairy Light (+Rp 10.000), Boneka Toga Wisuda (+Rp 15.000), Kartu Ucapan Kaligrafi (+Rp 5.000).
   - Live Preview Canvas dengan emoji animasi dinamis dan kalkulasi harga subtotal instan.
   - Integrasi langsung pemesanan via tautan WhatsApp deep link terstruktur serta tombol tambah ke keranjang website.

4. **Modul 4: Lookbook & Inspirasi Pelanggan (#lookbook)**
   - Galeri bukti sosial wisuda kampus: Wisuda UI 2026, Anniversary 2nd Year, Sidang Skripsi IPB.
   - Menampilkan kutipan testimoni autentik pelanggan, foto gradient wrapper tematik, dan nama wisudawan.

5. **Modul 5: Lacak Status Pesanan Cepat (#tracking)**
   - Input nomor invoice instan (contoh: `INV/20260907/FLW-0001`).
   - Stepper timeline 4 langkah progres pengerjaan buket: *Pembayaran Terverifikasi -> Sedang Dirangkai -> Selesai Packing -> Diambil Kurir*.
   - Tombol alihan cepat ke Portal Pelanggan Terpadu (`/portal`).

6. **Modul 6: Bantuan, Perawatan & Garansi 100% (#bantuan)**
   - *Care Guide FAQ:* Panduan merapikan kembali kelopak bunga kawat yang lentur dalam 10-20 detik, serta cara membersihkan debu menggunakan kuas halus atau hairdryer tanpa air.
   - *Kebijakan Garansi:* Banner jaminan 100% ganti buket baru gratis ongkir dengan cukup menyertakan video unboxing 1x24 jam tanpa perlu repot mengembalikan buket lama.

### 7.3 Micro-Animations & Standar Visual Feedback
1. **Magic UI Cart Bump Animation (`cartBumpAnim`):** Tombol keranjang memantul secara elastis (*spring rotate -6deg to +4deg*) setiap kali item berhasil dimasukkan.
2. **3D Card Hover Tilt (`card-tilt-hover`):** Efek kedalaman perspektif yang mengangkat kartu produk saat disentuh kursor.
3. **Laser Beam Progress Stepper (`beam-laser-step4` & `beam-laser-warranty`):** Sinar laser horizontal dan vertikal yang berdenyut mulus menandakan alur kerja sedang aktif.
* **Problem:** Toko online konvensional menaruh tombol WhatsApp mentah sehingga obrolan terpental keluar website, pengguna harus simpan nomor kontak, dan sistem kehilangan jejak analitik chat.
* **Solusi Terpadu:**
  - Tombol melayang *"Chat CS Pengrajin"* membuka modal chat interaktif di browser.
  - Menyediakan *Quick Prompt Chips*: "Tanya Buket Wisuda", "Panduan Pembayaran QRIS", "Titik COD Kampus", "Klaim Garansi Anti Patah".
  - Bot otomatis memberikan respon cepat 24/7.
  - Histori obrolan tersimpan di database via endpoint `/api/v1/chat` dan backup `localStorage`.
  - Tombol eskalasi resmi: *"Alihkan ke WA Pengrajin"* menyertakan token sesi obrolan dan ringkasan konsultasi.

### 7.3 Titik Temu COD Google Maps & Geofencing Atelier
* **Peta Interaktif Google Maps:** Menggunakan embed resmi Google Maps untuk memetakan titik temu aman di kampus dan pusat perbelanjaan.
* **Deteksi Otomatis (Auto-Detect Flow):**
  - Admin dapat menempelkan link Google Maps (`maps.app.goo.gl` atau `google.com/maps`) atau mengetik nama tempat.
  - Sistem mengekstrak: **Nama Titik**, **Alamat Lengkap**, **Link Share Google Maps**, dan **Estimasi Jarak (KM)** dari Atelier Pusat (Jl. Margonda Raya No. 108 Depok).
  - Pin peta interaktif tertampil langsung di modal admin sebelum disimpan.
* **Preset Populer:** Gerbatama UI, Margo City Mall, Stasiun Pondok Cina, D'Mall Margonda, Gunadarma Kampus D.
* **Geofencing Rule:** Radius maksimum 5.0 KM dari atelier bebas ongkos kirim (Rp 0).

### 7.4 Bill of Materials (BOM) & Kalkulator HPP Kawat Bulu
* Mengurai kalkulasi biaya bahan mentah per buket secara transparan:
  - Batang kawat bulu chenille: Rp 250 / batang.
  - Boneka mini toga wisuda: Rp 12.000 / pcs.
  - Kertas cellophane motif Korea: Rp 3.500 / lembar.
  - Pita satin premium: Rp 1.500 / meter.
  - Lem tembak & kawat rangka: Rp 1.000 / buket.
  - Lampu LED Fairy Lights (Add-on): Rp 4.500.
* Sistem menghitung otomatis: **Total HPP Bahan Baku**, **Harga Jual Katalog**, **Laba Bersih (Rp)**, dan **Margin Untung Bersih (%)**.

### 7.5 Portal Pelanggan Dual-Scenario & Customer Member Hub
* **Skenario 1 (Guest Tracking):**
  - Pembeli tidak dipaksa mendaftar akun.
  - Pelacakan dilakukan via nomor WhatsApp / Invoice. Jika lupa resi, sistem otomatis memunculkan transaksi aktif berdasarkan nomor HP terverifikasi OTP.
* **Skenario 2 (Registered Member Hub / "Admin Pelanggan"):**
  - Header avatar interaktif (`SA`) dengan opsi ganti emoji profil (`🌸`, `🌷`, `🧸`, `👑`, `🎀`).
  - **Embedded Active Order Tracking Stepper:** Menampilkan status pesanan aktif langsung di dashboard:
    1. *Pembayaran Diterima (Lunas via QRIS)*
    2. *Perangkaian Kawat Bulu (Sedang Dirangkai Pengrajin)*
    3. *Quality Control & Foto Buket Selesai*
    4. *Kurir Mengantar / Siap COD*
  - Saldo Flower Points loyalty untuk ditukarkan dengan kupon diskon.
  - Riwayat lengkap transaksi dan unduh resi digital A6/thermal.

### 7.6 Admin Header Anti-Penyok & Operations Control Center
* Avatar inisial admin dikunci circular strictly 1:1 (`38px x 38px`, `aspect-ratio: 1/1`, `flex-shrink: 0`).
* Dropdown profil admin menyediakan: Edit Profil Pengrajin, Pengaturan Atelier, Ganti Sandi, dan Logout aman.

### 7.7 Skema Garansi 100% Anti-Patah & Alur Klaim Komplain (Fast-Track Replacement Workflow)
* **Karakteristik & Risiko Produk Buket Kawat Bulu:**
  Buket kawat bulu tidak akan layu atau mengering seperti bunga asli. Namun, saat transit via ekspedisi reguler (J&T/SiCepat), paket berpotensi tertindih beban berat sehingga kelopak bunga gepeng, rangka kawat bengkok ekstrem, atau wrapping kertas cellophane lecek.
* **Kebijakan Garansi Toko & Syarat Validasi:**
  1. **Video Unboxing Tanpa Jeda:** Wajib direkam sejak paket tersegel rapat hingga dibuka, maksimal diajukan dalam 1x24 jam sejak resi berstatus `DELIVERED`.
  2. **Kategori Kendala Terlindungi:**
     - *Kerusakan Ekspedisi Parah:* Kawat bulu patah, boneka wisuda lepas/rusak, atau cellophane sobek parah yang tidak bisa dirapikan manual.
     - *Salah Produk / Varian:* Warna buket tidak sesuai pesanan atau boneka toga bukan pesanan pembeli.
     - *Salah Kartu Ucapan:* Kesalahan cetak nama wisudawan / pesan ucapan oleh staf atelier.
     - *Paket Hilang / Tertahan Ekspedisi:* Tidak bergerak > 3 hari kerja melewati estimasi.
  3. **Fast-Track 100% Free Replacement (Tanpa Repot Retur Fisik):**
     - Pembeli wisuda memiliki waktu terbatas menjelang hari H. Memaksa pembeli mengembalikan paket rusak ke ekspedisi hanya akan menambah beban dan kekecewaan.
     - Jika klaim disetujui (verifikasi video unboxing valid via portal), atelier langsung memproduksi buket baru dan mengirimkannya via pengiriman kilat/instant (ongkir 100% ditanggung atelier).
  4. **Tahapan Stepper Status Klaim Garansi di Portal Pelanggan:**
     - `SUBMITTED` (Klaim Diajukan Pelanggan)
     - `UNDER_REVIEW` (Sedang Ditinjau Florist Atelier)
     - `APPROVED_REPLACE` (Klaim Diterima - Penggantian Baru Sedang Dirangkai)
     - `DISPATCHED` (Buket Pengganti Sedang Dikirim via Kurir)
     - `RESOLVED` (Klaim Selesai & Pelanggan Puas)

### 7.8 Pusat Bantuan & Edukasi Pelanggan (Customer Help Center / FAQ Knowledge Base)
Disediakan di halaman etalase, portal pelanggan, dan terintegrasi dengan quick chips Live Web Chat untuk menyelesaikan 5 skenario friksi utama pembeli:
1. **Kasus 1: Lupa Nomor Invoice atau Resi Ekspedisi:**
   - *Solusi:* Pelanggan cukup memasukkan Nomor WhatsApp pada menu pelacakan. Sistem mengirimkan kode OTP instan atau magic link untuk menampilkan seluruh daftar transaksi aktif tanpa perlu mengingat nomor resi yang rumit.
2. **Kasus 2: Kelopak / Tangkai Kawat Bulu Sedikit Tertekuk Saat Buka Kardus:**
   - *Solusi:* Kawat bulu (*chenille pipe cleaner*) memiliki sifat elastis dan lentur. Di dalam kardus disertakan kartu panduan + video QR code: pembeli cukup melengkungkan kembali kelopak dengan jempol dan telunjuk tangan secara lembut ke arah luar, maka buket akan kembali mekar sempurna dalam 10 detik.
3. **Kasus 3: Panduan Perawatan Jangka Panjang (Long-Term Care):**
   - Tidak memerlukan air atau sinar matahari (dilarang menyiram air agar kawat rangka tidak berkarat).
   - Simpan di ruangan kering / ber-AC.
   - Bersihkan debu berkala menggunakan kuas make-up halus atau hembusan hair dryer (mode angin dingin). Bunga kawat bulu dapat bertahan abadi hingga bertahun-tahun.
4. **Kasus 4: Estimasi Waktu Pembuatan (Lead Time PO Wisuda):**
   - Produk *Ready Stock*: Dikirim di hari yang sama jika pembayaran terverifikasi sebelum pukul 13.00 WIB.
   - Produk *Pre-Order (PO) Kustom*: Membutuhkan waktu perangkaian 1-3 hari kerja. Sangat disarankan memesan minimal H-4 sebelum tanggal wisuda atau acara.
5. **Kasus 5: Panduan Titik Temu COD Kampus & Mall:**
   - Pelanggan memilih titik kumpul resmi di Google Maps saat checkout (misal: Gerbatama UI / Lobby Margo City).
   - Staf atelier mengonfirmasi kedatangan via web chat / WhatsApp 15 menit sebelum waktu temu. Gratis ongkir jika berada dalam radius 5.0 KM.

### 7.9 Pusat 10 Sakelar Fitur Bisnis di Admin Panel (Operational Feature Toggles)
Admin Panel dilengkapi dengan pusat kendali 10 sakelar on/off untuk fleksibilitas operasional harian tanpa perlu deploy ulang kode:

| # | Key Sakelar (ID) | Nama Fitur | Default | Dampak Fungsional & Kasus Bisnis |
|---|------------------|------------|:-------:|----------------------------------|
| 1 | `toggle_maintenance` | Mode Pemeliharaan Toko | `OFF` | Mengunci sementara keranjang checkout jika atelier sedang libur/istirahat produksi. Menampilkan halaman estetik dengan pesan kuota penuh. |
| 2 | `toggle_po_limit` | Pembatasan Kuota PO Harian | `ON` | Membatasi maksimal pesanan PO per hari (default: 10 buket) agar pengrajin tidak kewalahan (*overloaded*). |
| 3 | `toggle_ready_stock_only` | Kunci Hanya Ready Stock | `OFF` | Menonaktifkan opsi pesanan Pre-Order dan hanya menjual buket yang sudah siap di etalase saat peak-season wisuda. |
| 4 | `toggle_free_cod_radius` | Bebas Ongkir Radius COD 5 KM | `ON` | Otomatis memberikan tarif pengiriman Rp 0 untuk titik temu COD dalam radius 5.0 KM dari atelier pusat (Jl. Margonda Raya No. 108 Depok). |
| 5 | `toggle_in_system_chat` | Live Web Chat Terintegrasi | `ON` | Mewajibkan obrolan awal melalui web chat modal internal sebelum dialihkan ke WhatsApp, menghindari hilangnya jejak pelanggan. |
| 6 | `toggle_ai_chatbot` | Bot Penjawab Cerdas Otomatis | `ON` | Memberikan jawaban ramah instan 24/7 untuk pertanyaan umum (kuota, harga, titik COD, garansi). |
| 7 | `toggle_wa_notification` | Push Notifikasi WhatsApp | `ON` | Mengirimkan notifikasi perubahan status pesanan otomatis ke nomor WhatsApp pembeli melalui webhook gateway. |
| 8 | `toggle_theme_public_switcher` | Pemilih Tema Publik di Navbar | `ON` | Memunculkan pill switcher tema di navbar etalase agar pengunjung dapat menikmati pengalaman 3 tema toko. |
| 9 | `toggle_guest_checkout` | Izinkan Checkout Tanpa Login | `ON` | Memfasilitasi pembelian cepat bagi pembeli yang tidak ingin membuat akun, cukup memasukkan nomor WhatsApp. |
| 10 | `toggle_flower_points` | Program Poin Loyalitas & Diskon | `ON` | Memberikan Flower Points kepada member terdaftar setiap selesai transaksi untuk ditukarkan dengan potongan belanja. |

### 7.10 Cetak Biru Penambahan Tema Baru di Masa Depan (Theme Plugin Engine & Extension Blueprint)
Arsitektur sistem dirancang dengan prinsip **Open-Closed Principle (OCP)**: sistem terbuka untuk penambahan tema visual baru, namun tertutup dari modifikasi kode logika bisnis yang sudah stabil:

1. **Kontrak Interface Desain Token (`ThemeDefinition`):**
   Setiap tema visual wajib memenuhi interface seragam yang didefinisikan di `@chenille/shared/types/theme.types.ts`:
   ```typescript
   export interface ThemeDefinition {
     id: string;             // e.g. "tema-d"
     name: string;           // e.g. "Vintage Botanical Atelier"
     badge: string;          // e.g. "Earthy & Nostalgic"
     colors: {
       primary: string;      // Warna tombol CTA & highlight
       primaryLight: string; // Background chip & alert
       bgPage: string;       // Latar belakang halaman
       bgCard: string;       // Latar kartu produk
       textMain: string;     // Teks judul & heading
       textMuted: string;    // Teks deskripsi & label
       border: string;       // Garis pembatas kartu
       accent: string;       // Aksen pelengkap
     };
     typography: {
       fontHeading: string;  // Font serif / sans khusus judul
       fontBody: string;     // Font keterbacaan teks utama
     };
     radii: {
       card: string;         // e.g. "16px"
       button: string;       // e.g. "9999px"
     };
   }
   ```

2. **Zero Logic Coupling (Bebas Hardcode):**
   Seluruh komponen frontend Next.js (`ProductCard.tsx`, `CartDrawer.tsx`, `OrderTrackingStepper.tsx`, `LoginForm.tsx`) **DILARANG KERAS** menggunakan pengecekan kondisi manual seperti `if (theme === 'tema-a')`. Seluruh styling murni mengonsumsi variabel CSS Custom Properties:
   ```css
   .product-card {
     background-color: var(--theme-card-bg);
     border-color: var(--theme-border);
     border-radius: var(--theme-radius-card);
   }
   ```

3. **Langkah 3-Menit Menambahkan Tema Baru (Contoh: Tema D - Vintage Botanical):**
   - **Langkah 1:** Daftarkan metadata & palette warna tema baru di file `@chenille/shared/constants/themes.ts`.
   - **Langkah 2:** Tambahkan blok variabel CSS di stylesheet global:
     ```css
     [data-theme="tema-d"] {
       --theme-primary: #556B2F;
       --theme-bg-page: #F5F5DC;
       --theme-font-heading: 'Cinzel', serif;
       --theme-font-body: 'Lora', serif;
     }
     ```
   - **Langkah 3:** Tema baru langsung otomatis muncul di dropdown Admin Panel, live preview etalase, selector login, dan halaman portal tanpa perlu menyentuh kode logika keranjang atau database!

### 7.11 Spesifikasi Animasi Interaktif Magic UI & Motion Design
Sistem mengadopsi prinsip gerak dinamis *UI/UX Pro Max* untuk menciptakan pengalaman visual yang memikat (*wow factor*):
1. **Parabolic Flying Flower to Cart Animation:**
   - Saat tombol *"Tambah ke Keranjang"* diklik, klon thumbnail buket bunga mini melayang melengkung (kurva parabola Bézier) menuju ikon keranjang di header navbar.
   - Begitu partikel mendarat di ikon keranjang, badge counter keranjang memicu efek *spring bounce animation* (+1) disertai toast notifikasi estetik.
2. **Interactive 3D Perspective Card Tilt:**
   - Kartu katalog produk di etalase mendeteksi posisi kursor mouse (`mousemove`) dan melakukan rotasi 3D halus (`rotateX`, `rotateY`, `transform-style: preserve-3d`) dengan efek kilauan cahaya (*dynamic glare reflection*).
3. **Pulse Glowing Add-to-Cart Badge:**
   - Tombol transaksi memiliki efek animasi bernapas (*pulse breathing glow*) dengan warna aksen tema aktif untuk memicu ketertarikan klik pembeli secara psikologis.
4. **Smooth Stepper Progress Transition:**
   - Pada kartu pelacakan pesanan aktif di portal member, titik indikator dan garis penghubung bertransisi dengan animasi pengisian hijau mulus (*fill bar progress*) dari tahap 1 hingga tahap 4.


### 7.12 Spesifikasi Checkout Flow & Cart Logic (Alur Transaksi End-to-End)

Alur checkout dirancang untuk mengakomodasi dua skenario pembeli (Guest & Member) dengan validasi stok real-time dan atomic lock inventory:

1. **Tahap 1 — Cart Review (Cart Drawer di Storefront)**
   - Pembeli mengklik *"Tambah ke Keranjang"* → item masuk `useCartStore` (Zustand/localStorage).
   - Cart Drawer menampilkan: daftar produk, qty modifier (+/-), subtotal per item, total keseluruhan.
   - Validasi stok ringan (soft check) setiap kali drawer dibuka — menampilkan badge *"Stok Menipis: tersisa 3"* jika `stock <= 5`.
   - Tombol *"Lanjut ke Checkout"* → berpindah ke halaman/modal checkout.

2. **Tahap 2 — Pilih Metode Pengiriman (Fulfillment Selection)**
   - **Opsi A: COD Titik Temu Kampus/Mall**
     - Dropdown pilihan titik temu dari `CodMeetingPoint` aktif.
     - Estimasi jarak otomatis dari atelier pusat (Haversine formula).
     - Jika radius ≤ 5.0 KM dan `toggle_free_cod_radius = ON` → ongkir Rp 0.
     - Jika radius > 5.0 KM → tampilkan biaya tambahan atau sarankan ekspedisi.
   - **Opsi B: Ekspedisi Reguler (Biteship API)**
     - Input alamat lengkap + kode pos.
     - Fetch ongkir real-time dari Biteship API → tampilkan 3-5 opsi kurir (JNE REG, J&T Express, SiCepat, AnterAja, GoSend Instant).
     - Pembeli memilih kurir dan tarif → `shipping_cost` diinject ke order total.

3. **Tahap 3 — Data Pembeli & Kupon**
   - **Guest Checkout** (`toggle_guest_checkout = ON`):
     - Field: Nama Lengkap, No. WhatsApp (wajib), Email (opsional), Alamat Pengiriman (jika ekspedisi).
     - OTP verification via WhatsApp untuk validasi nomor HP.
   - **Member Checkout** (sudah login):
     - Data auto-filled dari profil `User` + alamat tersimpan `CustomerAddress`.
     - Opsi pilih alamat tersimpan atau input alamat baru.
   - **Kode Kupon**: Input field kupon diskon. Validasi: kode valid, belum expired, kuota belum habis, memenuhi min. pembelian.
   - **Redeem Flower Points**: Toggle switch untuk menukarkan poin (jika `toggle_flower_points = ON`). Kupon dan poin **tidak bisa di-stack** (pilih salah satu).

4. **Tahap 4 — Atomic Lock Inventory & Create Order**
   - Saat tombol *"Bayar Sekarang"* diklik:
     1. Backend menerima request `POST /api/v1/orders`.
     2. **Atomic Transaction (Prisma `$transaction`)**: Lock stok produk, validasi ketersediaan, decrement `Product.stock`.
     3. Jika stok habis saat dikunci → return `Result.fail("Stok buket tidak mencukupi")` → frontend menampilkan toast error.
     4. Jika berhasil → generate `invoice_number` format `INV/YYYYMMDD/XXX` → hitung `total_hpp_cost` dan `net_profit`.
     5. Cek kuota PO harian jika `toggle_po_limit = ON` dan produk bukan ready stock.
     6. Buat record `Order` + `OrderItem[]` dalam satu transaksi database.

5. **Tahap 5 — Pembayaran Midtrans Snap (Section 7.13)**

6. **Tahap 6 — Konfirmasi & Notifikasi**
   - Halaman sukses menampilkan: nomor invoice, ringkasan pesanan, estimasi waktu.
   - Push notifikasi WhatsApp ke pembeli (jika `toggle_wa_notification = ON`).
   - Redirect ke halaman tracking portal.
   - **Timeout Policy**: Jika pembayaran tidak diselesaikan dalam 24 jam → order otomatis dibatalkan (`CANCELLED`) → stok di-restore (increment back).

### 7.13 Spesifikasi Integrasi Payment Gateway Midtrans Snap SDK

Seluruh transaksi pembayaran diproses melalui **Midtrans Snap** (popup overlay) tanpa redirect keluar website:

1. **Arsitektur Flow Pembayaran:**
   ```
   [Frontend]                    [Backend API]                [Midtrans Server]
       │                              │                              │
       │  POST /api/v1/payment/create │                              │
       │  { order_id, amount }        │                              │
       │ ─────────────────────────────>│                              │
       │                              │  POST /v2/charge (Snap API)  │
       │                              │ ─────────────────────────────>│
       │                              │  { token, redirect_url }     │
       │                              │ <─────────────────────────────│
       │  { snap_token }              │                              │
       │ <─────────────────────────────│                              │
       │                              │                              │
       │  snap.pay(snap_token)        │                              │
       │  [Popup Midtrans Muncul]     │                              │
       │  Pembeli memilih metode      │                              │
       │  & selesaikan pembayaran     │                              │
       │                              │                              │
       │                              │  POST /api/v1/payment/webhook│
       │                              │ <─────────────────────────────│
       │                              │  { notification_payload }    │
       │                              │  Verify signature SHA-512    │
       │                              │  Update Order.status         │
       │                              │  Response 200 OK             │
       │                              │ ─────────────────────────────>│
   ```

2. **Metode Pembayaran yang Didukung:**
   | Metode | Kode Midtrans | Batas Waktu | Keterangan |
   |--------|---------------|:-----------:|------------|
   | QRIS (Utama) | `gopay`, `shopeepay` | 15 menit | Scan QR di kasir digital |
   | Transfer Bank VA | `bank_transfer` (BCA, BNI, Mandiri, Permata) | 24 jam | Virtual Account auto-generate |
   | E-Wallet GoPay | `gopay` | 15 menit | Deeplink ke app GoPay |
   | E-Wallet ShopeePay | `shopeepay` | 5 menit | Deeplink ke app Shopee |

3. **Webhook Notification Handler (`POST /api/v1/payment/webhook`):**
   - Validasi **Server Key Signature** (SHA-512 hash dari `order_id + status_code + gross_amount + server_key`).
   - **Idempotency Guard**: Cek apakah `Order.is_paid` sudah `true` sebelum proses ulang.
   - Status mapping dari Midtrans ke internal `OrderStepStatus`:
     - `capture` / `settlement` → Set `is_paid = true`, `paid_at = now()`, status = `PAYMENT_CONFIRMED`.
     - `pending` → Tetap di status awal (order sudah dibuat tapi belum bayar).
     - `expire` / `cancel` → Set status = `CANCELLED`, restore stok inventory.
     - `deny` → Set status = `CANCELLED`, log reason.
     - `refund` → Buat record refund, update `net_profit`.
   - Retry mechanism: Midtrans akan retry webhook hingga 5x jika response bukan `200 OK`.

4. **Konfigurasi Sandbox vs Production:**
   - Kontrol via `MIDTRANS_IS_PRODUCTION` di `.env`.
   - Sandbox URL: `https://app.sandbox.midtrans.com/snap/snap.js`
   - Production URL: `https://app.midtrans.com/snap/snap.js`

### 7.14 Spesifikasi Integrasi Logistik Biteship API

Biteship digunakan sebagai aggregator logistik untuk cek ongkir, booking kurir, dan tracking resi otomatis:

1. **Flow Cek Ongkir (Courier Rates):**
   ```
   [Frontend Checkout]              [Backend API]              [Biteship API]
       │                                 │                          │
       │ POST /api/v1/logistics/rates    │                          │
       │ { origin_postal, dest_postal,   │                          │
       │   items: [{ weight, dimension }]│                          │
       │ }                               │                          │
       │ ────────────────────────────────>│                          │
       │                                 │ POST /v1/rates/couriers  │
       │                                 │ ────────────────────────>│
       │                                 │ { pricing[] }            │
       │                                 │ <────────────────────────│
       │ { couriers: [                   │                          │
       │   { name: "JNE REG",           │                          │
       │     price: 12000,              │                          │
       │     etd: "2-3 hari" },         │                          │
       │   { name: "SiCepat BEST",      │                          │
       │     price: 15000,              │                          │
       │     etd: "1-2 hari" }          │                          │
       │ ]}                              │                          │
       │ <────────────────────────────────│                          │
   ```

2. **Kurir yang Didukung:**
   | Kurir | Service | Estimasi | Use Case |
   |-------|---------|:--------:|----------|
   | JNE | REG / YES | 2-3 / 1 hari | Reguler Jabodetabek & Luar Kota |
   | J&T Express | EZ | 2-3 hari | Budget-friendly |
   | SiCepat | BEST / HALU | 1-2 / same day | Cepat & same-day Jabodetabek |
   | AnterAja | Regular / Same Day | 2-3 / same day | Alternatif reguler |
   | GoSend | Instant / Same Day | 1-3 jam / 6-8 jam | COD alternatif & urgent delivery |

3. **Booking & Resi Otomatis:**
   - Setelah order status = `CRAFTING_BOUQUET` selesai, admin klik *"Kirim via Kurir"* di panel → trigger `POST /api/v1/logistics/book`.
   - Backend memanggil Biteship `POST /v1/orders` → generate AWB (resi).
   - `Order.shipping_awb` diisi otomatis → status update ke `IN_DELIVERY`.

4. **Webhook Tracking Resi (`POST /api/v1/logistics/webhook`):**
   - Biteship mengirim update status pengiriman real-time.
   - Status mapping: `allocated` → `IN_DELIVERY`, `delivered` → `COMPLETED`.
   - Auto-update `OrderStepStatus` dan kirim notifikasi WA ke pembeli.

5. **Cetak Resi Thermal A6:**
   - Admin dapat mencetak label pengiriman format thermal A6 (10x15 cm).
   - Generate PDF via `@react-pdf/renderer` atau HTML-to-PDF library.
   - Informasi label: barcode AWB, nama pengirim, nama penerima, alamat, berat, kurir.

6. **Fallback Manual (Biteship Down):**
   - Jika API Biteship tidak merespons (timeout 10 detik), admin dapat input nomor resi manual di panel order.
   - Tracking status diupdate manual oleh admin pada stepper order.

### 7.15 Spesifikasi Autentikasi, Otorisasi & RBAC Matrix (Better Auth)

Sistem menggunakan **Better Auth** untuk autentikasi berbasis session dengan Role-Based Access Control (RBAC):

1. **Matriks Akses Per Role (RBAC Authorization Matrix):**

   | Endpoint / Fitur | `SUPER_ADMIN` | `FLORIST_STAFF` | `CUSTOMER_MEMBER` | `GUEST` (No Auth) |
   |-------------------|:-------------:|:---------------:|:------------------:|:-----------------:|
   | Admin Dashboard (KPI, Grafik) | ✅ Full | ✅ Read-Only | ❌ | ❌ |
   | Manage Products & BOM | ✅ CRUD | ✅ Read + Edit | ❌ | ❌ |
   | Manage Orders & Status | ✅ Full | ✅ Update Status | ❌ | ❌ |
   | Feature Toggles | ✅ Full | ❌ | ❌ | ❌ |
   | Store Settings & API Keys | ✅ Full | ❌ | ❌ | ❌ |
   | COD Points Management | ✅ CRUD | ✅ Read | ❌ | ❌ |
   | CS Web Chat Hub | ✅ Full | ✅ Reply | ❌ | ❌ |
   | Coupon Management | ✅ CRUD | ✅ Read | ❌ | ❌ |
   | View Own Orders (Member) | ✅ | ✅ | ✅ | ❌ |
   | Track Order by Phone/Invoice | ✅ | ✅ | ✅ | ✅ (OTP Verified) |
   | Checkout & Create Order | ✅ | ✅ | ✅ | ✅ (Guest Checkout) |
   | Live Web Chat (Customer) | ✅ | ✅ | ✅ | ✅ |
   | Storefront Browse Products | ✅ | ✅ | ✅ | ✅ |
   | Member Profile & Points | ✅ | ❌ | ✅ (Own Profile) | ❌ |
   | Warranty Claim Submission | ✅ | ✅ | ✅ | ✅ (via Phone) |

2. **Session Management (Better Auth Configuration):**
   - **Session Strategy**: Database-backed sessions (Prisma adapter) dengan cookie `httpOnly`, `secure`, `sameSite: lax`.
   - **Session Expiry**: 7 hari idle timeout, 30 hari absolute maximum.
   - **Token Rotation**: Session token dirotasi setiap 24 jam atau setelah perubahan role/password.
   - **Concurrent Session**: Maksimal 3 sesi aktif per akun. Sesi terlama otomatis di-invalidate saat sesi ke-4 dibuat.

3. **Password & Security Policy:**
   - Minimum 8 karakter, mengandung huruf dan angka.
   - Hashing: **bcrypt** (cost factor 12) via Better Auth built-in.
   - Rate limiting login: Maksimal 5 percobaan gagal per IP dalam 15 menit → cooldown 15 menit, tampilkan pesan *"Terlalu banyak percobaan. Coba lagi dalam 15 menit."*
   - CSRF protection via Better Auth built-in double-submit cookie.

4. **OTP Verification Flow (Guest Tracking):**
   - Guest memasukkan No. WhatsApp di portal tracking.
   - Backend generate OTP 6 digit → simpan hashed di database dengan expiry 5 menit.
   - Kirim OTP via WhatsApp API gateway.
   - Guest memasukkan OTP → verifikasi → tampilkan daftar order aktif berdasarkan nomor HP.

### 7.16 Spesifikasi Upload & Manajemen Gambar Produk

1. **Arsitektur Storage:**
   - **Primary**: Supabase Storage Bucket `product-images` (gratis 1 GB, auto CDN via Supabase).
   - **Fallback**: Jika kebutuhan melebihi 1 GB, migrasi ke Cloudinary free tier (25 GB) atau Supabase Pro.
   - **CDN URL Pattern**: `https://[PROJECT_REF].supabase.co/storage/v1/object/public/product-images/[filename]`

2. **Spesifikasi Upload:**
   - Format yang diterima: `image/jpeg`, `image/png`, `image/webp`.
   - Maksimal ukuran file: **2 MB** per gambar.
   - Maksimal gambar per produk: **5 gambar** (1 primary + 4 gallery).
   - Nama file: Auto-rename ke format `[product_slug]-[timestamp]-[index].webp`.

3. **Image Processing Pipeline:**
   - Resize otomatis ke 3 ukuran: `thumb` (200x200), `medium` (600x600), `large` (1200x1200).
   - Kompresi ke format WebP quality 85% untuk performa load.
   - Generate `blur placeholder` (base64 10x10px) untuk progressive loading.

4. **Admin Panel Upload UX:**
   - Drag & drop zone atau klik untuk browse file.
   - Preview thumbnail sebelum upload.
   - Reorder gambar via drag & drop.
   - Set gambar primary (ditampilkan di grid katalog).
   - Tombol hapus per gambar dengan konfirmasi.

### 7.17 Spesifikasi Kupon Diskon & Program Flower Points Loyalty

1. **Mekanisme Kupon Diskon:**
   - **Tipe Kupon:**
     - `PERCENT`: Diskon persentase (contoh: 15% off, max potongan Rp 25.000).
     - `FIXED_AMOUNT`: Diskon nominal tetap (contoh: Rp 10.000 off).
   - **Validasi Kupon di Checkout:**
     1. Cek kode kupon ada di database dan `is_active = true`.
     2. Cek `valid_from <= now() <= valid_until`.
     3. Cek `usage_count < max_uses` (kuota pemakaian belum habis).
     4. Cek `subtotal >= min_purchase` (memenuhi minimum pembelian).
     5. Jika semua valid → kalkulasi diskon, inject ke `Order.discount_amount`.
   - **Business Rules:**
     - Satu order hanya bisa memakai **1 kupon ATAU 1 redeem poin** (tidak bisa keduanya).
     - Kupon khusus member (`member_only = true`) tidak bisa digunakan guest.
     - Admin membuat kupon di menu *"Pemasaran & Kupon"* di dashboard.

2. **Program Flower Points Loyalty:**
   - **Mekanisme Pengumpulan Poin:**
     - Setiap transaksi selesai (`COMPLETED`), member mendapat **1 poin per Rp 10.000** pembelian (dibulatkan ke bawah).
     - Bonus poin: +10 poin saat pertama kali mendaftar (welcome bonus, sudah ada di `User.flower_points @default(50)`).
   - **Mekanisme Penukaran Poin:**
     - **10 poin = Rp 5.000 diskon** (kurs tetap).
     - Minimum penukaran: 10 poin.
     - Poin di-redeem saat checkout → `discount_amount` dikalkulasi dari jumlah poin dikali kurs.
   - **Expiry**: Poin tidak kedaluwarsa (lifetime loyalty).
   - **Tracking**: Setiap perubahan poin dicatat di tabel `FlowerPointTransaction` untuk audit trail.

### 7.18 Spesifikasi Search & Filter Produk di Storefront

1. **Search (Pencarian Full-Text):**
   - Input search di navbar melakukan pencarian pada field: `Product.name`, `Product.category`, dan tag/deskripsi.
   - Implementasi: PostgreSQL `ILIKE` atau `to_tsvector/to_tsquery` untuk full-text search.
   - Auto-suggest dropdown menampilkan hingga 5 hasil saat mengetik (debounce 300ms).
   - Pencarian memfilter hanya produk dengan `is_active = true`.

2. **Filter (Penyaringan Multi-Kriteria):**
   | Filter | Tipe | Nilai |
   |--------|------|-------|
   | Kategori | Multi-select checkbox | Wisuda, Romantis, Pastel, Karakter, Mini Pot |
   | Ketersediaan | Toggle | Semua / Ready Stock Only |
   | Rentang Harga | Dual range slider | Rp 25.000 — Rp 500.000 |
   | Promo/Diskon | Toggle | Tampilkan produk diskon saja |

3. **Sort (Pengurutan):**
   | Opsi Sort | Field Database | Default |
   |-----------|----------------|:-------:|
   | Terbaru | `created_at DESC` | ✅ |
   | Harga Terendah | `price ASC` | |
   | Harga Tertinggi | `price DESC` | |
   | Terpopuler | `click_count DESC` | |

4. **Pagination:**
   - Offset-based pagination (simple, cocok untuk katalog < 1.000 produk).
   - Default **12 produk per halaman** (grid 3x4 desktop, 2x6 mobile).
   - URL params: `?page=1&limit=12&category=Wisuda&sort=price_asc&search=buket`.

### 7.19 Spesifikasi Notifikasi WhatsApp & Template Pesan

Notifikasi otomatis dikirim via WhatsApp API gateway (rekomendasi: **Fonnte** — integrasi simpel, harga terjangkau untuk UMKM):

1. **Event Triggers & Template Pesan:**

   | Event | Trigger | Template Pesan |
   |-------|---------|----------------|
   | **Order Created** | Setelah payment confirmed | *"🌸 Pesanan #{invoice} berhasil! Buketmu sedang disiapkan pengrajin. Estimasi: {lead_time}. Track: {portal_url}"* |
   | **Crafting Started** | Admin update ke `CRAFTING_BOUQUET` | *"✂️ Buket #{invoice} sedang dirangkai dengan penuh cinta oleh pengrajin kami! Estimasi selesai: {etd}"* |
   | **Quality Check** | Admin update ke `QUALITY_CHECK_PASSED` | *"✅ Buketmu sudah selesai & lolos QC! Foto buketmu: {photo_url}. Menunggu pengiriman."* |
   | **In Delivery** | Status update `IN_DELIVERY` | *"🚚 Buket #{invoice} sedang dalam perjalanan! Resi: {awb}. Track kurir: {tracking_url}"* |
   | **Completed** | Delivered confirmation | *"🎉 Buket sudah sampai! Semoga momen wisudamu berkesan. Kamu dapat +{points} Flower Points! 💐"* |
   | **Warranty Submitted** | Klaim garansi diajukan | *"📋 Klaim garansi #{claim_id} diterima. Tim kami akan meninjau dalam 1x24 jam kerja."* |
   | **Warranty Approved** | Klaim garansi disetujui | *"✅ Klaim disetujui! Buket pengganti baru sedang dirangkai & akan dikirim GRATIS. Resi: {awb}"* |

2. **Konfigurasi API Gateway:**
   ```env
   # Tambahkan ke .env.example
   WA_GATEWAY_API_KEY="fonnte-api-key-xxxxxxxxxxxxxxxx"
   WA_GATEWAY_URL="https://api.fonnte.com/send"
   WA_SENDER_DEVICE="081234567890"
   ```

3. **Retry Policy:**
   - Jika pengiriman WA gagal (timeout/error), retry hingga **3x** dengan interval 30 detik, 2 menit, 10 menit (exponential backoff).
   - Jika tetap gagal setelah 3x retry → log warning ke Pino logger, admin mendapat notifikasi di dashboard.

---

## 8. Skema Database & Infrastruktur Supabase PostgreSQL

### 8.1 Konfigurasi Database Supabase (Shared Pooler & Connection Details)

Sistem menggunakan database cloud **Supabase PostgreSQL** yang di-host pada region AWS Asia Pacific (Tokyo) dengan arsitektur **Dual-URL Connection Strategy**:

#### 1. Detail Parameter Koneksi
- **Project Reference ID:** `wpdfxuwhqwvglqoiubfq`
- **Region:** `ap-northeast-1` (AWS Tokyo, Japan)
- **Host:** `aws-0-ap-northeast-1.pooler.supabase.com`
- **Port Shared Pooler (Transaction Mode / PgBouncer):** `6543` (Digunakan untuk runtime API / Serverless connection pooling)
- **Port Direct Connection (Session Mode):** `5432` (Digunakan untuk Prisma CLI Migrations)
- **Database Name:** `postgres`
- **User:** `postgres.wpdfxuwhqwvglqoiubfq`
- **Database Password:** `HtDqenaSKAmCdQGK`
- **Supabase Project URL:** `https://wpdfxuwhqwvglqoiubfq.supabase.co`

#### 2. Format Connection Strings

- **Connection String Base (Shared Pooler Template):**
  ```text
  postgresql://postgres.wpdfxuwhqwvglqoiubfq:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
  ```

- **Runtime Connection String (`DATABASE_URL` — `apps/api` runtime):**
  ```env
  DATABASE_URL="postgresql://postgres.wpdfxuwhqwvglqoiubfq:HtDqenaSKAmCdQGK@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
  ```
  *Rasional:* Port 6543 memanfaatkan PgBouncer Transaction Mode dengan batas koneksi terkontrol (`connection_limit=1`) untuk mencegah terjadinya *connection exhaustion* saat puluhan instance Vercel Serverless Function aktif secara konkuren.

- **Direct Migration String (`DIRECT_URL` — Prisma CLI Migrations):**
  ```env
  DIRECT_URL="postgresql://postgres.wpdfxuwhqwvglqoiubfq:HtDqenaSKAmCdQGK@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
  ```
  *Rasional:* Port 5432 direct connection (session mode) diwajibkan oleh Prisma CLI (`prisma migrate dev` dan `prisma migrate deploy`) karena operasi DDL migrasi dan skema lock memerlukan session-level advisory locks yang tidak didukung oleh transaction pooler PgBouncer.

#### 3. Supabase Agent Skills Tooling (AI Coding & Automation)
Framework agen telah dilengkapi dengan official Supabase Agent Skills yang terpasang pada workspace root (`.agents/skills/`):
- **Command Instalasi:**
  ```bash
  npx skills add supabase/agent-skills
  ```
- **Skill Terpasang:**
  1. `supabase`: Best practices produk Supabase (Database, Auth, Storage, Edge Functions, Realtime, Logging, client SDK).
  2. `supabase-postgres-best-practices`: Aturan baku arsitektur skema PostgreSQL, penulisan migrasi, Row Level Security (RLS) policies, indexing query optimasi, dan pencegahan connection leak.

### 8.2 Skema Prisma ORM (Dual URL Configuration & 27 Models)

Skema database tersimpan di `apps/api/prisma/schema.prisma` dan memanfaatkan fitur **Dual URL Connection Strategy** (PgBouncer Pooler + Direct Session Migration) yang selaras dengan seluruh antarmuka yang telah dibangun:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================================================
// ENUMS
// ============================================================================

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

enum PaymentGatewayType {
  MIDTRANS
  BCA_MANUAL
  COD_CASH
}

enum PaymentStatus {
  WAITING_PAYMENT
  PAYMENT_CONFIRMED
  PAID_ON_COD
  FAILED
  REFUNDED
}

enum WarrantyStatus {
  SUBMITTED
  UNDER_REVIEW
  APPROVED_REPLACE
  REJECTED
  RESOLVED
}

enum IssueCategory {
  TRANSIT_DAMAGE_CRUSHED
  WRONG_PRODUCT_VARIANT
  WRONG_GREETING_CARD
  PACKAGE_LOST_EXPEDITION
}

enum RawCategory {
  KAWAT_BULU
  BATANG_KAWAT
  CELLOPHANE
  PITA
  BONEKA_AKSESORIS
  FLORAL_FOAM
  LAINNYA
}

enum ProcurementStatus {
  ORDERED
  SHIPPED
  ARRIVED
  CANCELLED
}

enum WasteReason {
  LEMBAP_BERKARAT
  KERTAS_LECEK_ROBEK
  CACAT_PRODUKSI
  KADALUARSA_SIMPAN
}

enum CouponType {
  PERCENT
  FIXED_AMOUNT
  FREE_SHIPPING
}

enum PointTransactionType {
  EARN
  REDEEM
  BONUS
  EXPIRE
  ADJUSTMENT
}

enum CustomOptionCategory {
  FLOWER_HEAD        // Step 1: Tulip, Mawar, Matahari, Lavender
  STEM_COLOR         // Step 2: Pastel Pink, Lavender, Sky Blue, Sage
  CELLOPHANE_WRAP    // Step 3: Korean Two-Tone, Lilac Velvet, Clean Oat
  ACCESSORY          // Step 4: Lampu LED Fairy, Boneka Toga Mini, Kartu
  RIBBON_STYLE       // Step 5 (Tambahan): Satin Burgundy, Organza, Chiffon, Tali Rami
  PACKAGING_BOX      // Step 6 (Tambahan): Tas Mika Transparan, Box Jendela Mika, Pot Keramik
  GREETING_SEAL      // Step 7 (Tambahan): Kartu Gold Foil, Akrilik Bening, Wax Seal Stamp
}

// ============================================================================
// 1. USERS, CUSTOMER MEMBERSHIP & AUTH
// ============================================================================

model User {
  id                 String                    @id @default(uuid())
  email              String                    @unique
  phone              String                    @unique
  name               String
  password_hash      String
  role               Role                      @default(CUSTOMER_MEMBER)
  avatar_emoji       String?                   @default("🌸")
  avatar_url         String?                   // URL Supabase Storage
  flower_points      Int                       @default(50)
  created_at         DateTime                  @default(now())
  updated_at         DateTime                  @updatedAt

  orders             Order[]
  addresses          CustomerAddress[]
  point_transactions FlowerPointTransaction[]
  chat_sessions      ChatSession[]
  reviews            ProductReview[]
  saved_designs      SavedCustomDesign[]

  @@index([email])
  @@index([phone])
}

model CustomerAddress {
  id           String   @id @default(uuid())
  user_id      String
  user         User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  label        String   // "Kampus UI Depok", "Kost Beji", "Rumah"
  recipient    String
  phone        String
  full_address String
  postal_code  String?
  is_primary   Boolean  @default(false)
  created_at   DateTime @default(now())

  @@index([user_id])
}

model FlowerPointTransaction {
  id         String               @id @default(uuid())
  user_id    String
  user       User                 @relation(fields: [user_id], references: [id], onDelete: Cascade)
  type       PointTransactionType
  points     Int                  // Positif = bertambah, negatif = ditukar
  balance    Int                  // Saldo poin setelah transaksi
  order_id   String?
  note       String?
  created_at DateTime             @default(now())

  @@index([user_id])
}

model OtpVerification {
  id          String   @id @default(uuid())
  phone       String
  otp_hash    String
  attempts    Int      @default(0)
  is_verified Boolean  @default(false)
  expires_at  DateTime
  created_at  DateTime @default(now())

  @@index([phone, expires_at])
}

// ============================================================================
// 2. PRODUCT CATALOG, IMAGES & ANALYTICS
// ============================================================================

model Product {
  id                String             @id @default(uuid())
  name              String
  slug              String             @unique
  category          String             // Wisuda, Romantis, Pastel, Karakter, Mini Pot
  price             Decimal            @db.Decimal(12, 2)
  discount_price    Decimal?           @db.Decimal(12, 2)
  raw_cost_hpp      Decimal            @db.Decimal(12, 2) // HPP gabungan dari BOM
  stock             Int                @default(10)
  po_lead_days      Int                @default(2)
  click_count       Int                @default(0)
  is_ready_stock    Boolean            @default(true)
  is_active         Boolean            @default(true)
  badge             String?            // "Terlaris Wisuda", "Trending Korea"
  rating            Decimal            @default(4.9) @db.Decimal(3, 2)
  review_count      Int                @default(0)
  description       String             @db.Text
  theme_suitability String[]           // ["tema-a", "tema-b", "tema-c"]
  created_at        DateTime           @default(now())
  updated_at        DateTime           @updatedAt

  images            ProductImage[]
  bom_recipes       BillOfMaterial[]
  order_items       OrderItem[]
  reviews           ProductReview[]
  click_logs        ProductClickLog[]

  @@index([category])
  @@index([is_active])
}

model ProductImage {
  id          String   @id @default(uuid())
  product_id  String
  product     Product  @relation(fields: [product_id], references: [id], onDelete: Cascade)
  url         String   // Supabase Storage CDN URL atau local backup fallback
  thumb_url   String?
  medium_url  String?
  alt_text    String?
  sort_order  Int      @default(0)
  is_primary  Boolean  @default(false)
  created_at  DateTime @default(now())

  @@index([product_id])
}

model ProductClickLog {
  id            String   @id @default(uuid())
  product_id    String
  product       Product  @relation(fields: [product_id], references: [id], onDelete: Cascade)
  ip_address    String?
  session_token String?
  user_agent    String?
  referrer      String?
  clicked_at    DateTime @default(now())

  @@index([product_id, clicked_at])
}

model ProductReview {
  id          String   @id @default(uuid())
  product_id  String
  product     Product  @relation(fields: [product_id], references: [id], onDelete: Cascade)
  user_id     String?
  user        User?    @relation(fields: [user_id], references: [id], onDelete: SetNull)
  customer_name String
  rating      Int      @default(5)
  comment     String   @db.Text
  photo_url   String?  // Foto lookbook pelanggan saat wisuda
  occasion    String?  // "Wisuda UI Depok", "Anniversary", "Sidang Skripsi"
  is_featured Boolean  @default(false)
  created_at  DateTime @default(now())

  @@index([product_id])
}

// ============================================================================
// 3. CUSTOM STUDIO INTERAKTIF
// ============================================================================

model CustomStudioOption {
  id              String               @id @default(uuid())
  category        CustomOptionCategory
  name            String
  extra_price     Decimal              @default(0) @db.Decimal(10, 2)
  color_hex       String?
  image_url       String?
  raw_material_id String?
  raw_material    RawMaterial?         @relation(fields: [raw_material_id], references: [id], onDelete: SetNull)
  is_active       Boolean              @default(true)
  sort_order      Int                  @default(0)

  @@index([category, is_active])
}

model SavedCustomDesign {
  id                  String   @id @default(uuid())
  user_id             String?
  user                User?    @relation(fields: [user_id], references: [id], onDelete: SetNull)
  session_token       String?
  flower_name         String   // Tulip, Mawar, Matahari, Lavender
  wire_color          String   // Pastel Pink, Lavender Lilac, Sky Blue, Matcha
  cellophane_type     String   // Korean Two-Tone, Lilac Velvet, Clean Oat
  accessory_name      String?  // LED, Boneka Toga Mini
  ribbon_type         String?  // Satin Burgundy, Organza Transparan
  packaging_type      String?  // Tas Mika, Box Jendela Mika
  greeting_card_text  String?  @db.Text
  estimated_total     Decimal  @db.Decimal(12, 2)
  created_at          DateTime @default(now())

  @@index([user_id])
  @@index([session_token])
}

// ============================================================================
// 4. BILL OF MATERIALS (BOM), SUPPLIERS & PROCUREMENT
// ============================================================================

model SupplierDirectory {
  id               String             @id @default(uuid())
  name             String             // "Toko Kawat Bulu Chenille Bandung"
  pic_name         String?
  phone            String             // Nomor WhatsApp supplier
  address          String?
  marketplace_link String?            // "https://shopee.co.id/..."
  terms_notes      String?
  rating           Decimal?           @default(4.9) @db.Decimal(3, 2)
  is_active        Boolean            @default(true)
  created_at       DateTime           @default(now())

  raw_materials    RawMaterial[]
  procurements     ProcurementOrder[]
}

model RawMaterial {
  id               String               @id @default(uuid())
  name             String               // "Kawat Bulu Burgundy 6mm", "Cellophane Matte Gold"
  category         RawCategory
  stock            Int                  @default(100)
  min_stock        Int                  @default(20)
  unit             String               // Batang, Lembar, Meter, Pcs
  cost_per_unit    Decimal              @db.Decimal(10, 2)
  supplier_id      String?
  supplier         SupplierDirectory?   @relation(fields: [supplier_id], references: [id], onDelete: SetNull)
  supplier_name    String
  supplier_contact String
  supplier_link    String?
  notes            String?
  updated_at       DateTime             @updatedAt

  bom_recipes      BillOfMaterial[]
  procurements     ProcurementOrder[]
  waste_logs       WasteMaterialLog[]
  custom_options   CustomStudioOption[]

  @@index([category])
}

model BillOfMaterial {
  id              String       @id @default(uuid())
  product_id      String
  product         Product      @relation(fields: [product_id], references: [id], onDelete: Cascade)
  raw_material_id String
  raw_material    RawMaterial  @relation(fields: [raw_material_id], references: [id], onDelete: Restrict)
  quantity_needed Int          // Kebutuhan bahan per 1 buket
  subtotal_cost   Decimal      @db.Decimal(10, 2)

  @@index([product_id])
  @@index([raw_material_id])
}

model ProcurementOrder {
  id                String             @id // e.g. "PO-20260907-01"
  material_id       String
  material          RawMaterial        @relation(fields: [material_id], references: [id], onDelete: Restrict)
  material_name     String
  supplier_id       String?
  supplier          SupplierDirectory? @relation(fields: [supplier_id], references: [id], onDelete: SetNull)
  supplier_name     String
  supplier_contact  String?
  supplier_link     String?
  order_date        DateTime           @default(now())
  estimated_arrival DateTime           // ETA
  actual_arrival    DateTime?
  qty_ordered       Int
  unit              String
  cost_per_unit     Decimal            @db.Decimal(10, 2)
  total_cost        Decimal            @db.Decimal(12, 2)
  status            ProcurementStatus  @default(ORDERED)
  tracking_number   String?            // Resi J&T / SiCepat
  is_stock_added    Boolean            @default(false) // Auto-tambah saat status ARRIVED
  notes             String?
  created_at        DateTime           @default(now())

  @@index([material_id])
  @@index([status])
}

model WasteMaterialLog {
  id                String      @id @default(uuid())
  material_id       String?
  material          RawMaterial? @relation(fields: [material_id], references: [id], onDelete: SetNull)
  material_name     String
  category          RawCategory
  qty               Int
  unit              String
  cost_per_unit     Decimal     @db.Decimal(10, 2)
  total_loss        Decimal     @db.Decimal(12, 2) // qty * cost_per_unit
  reason            WasteReason
  mitigation_action String?
  reported_at       DateTime    @default(now())

  @@index([category])
  @@index([reported_at])
}

// ============================================================================
// 5. GOOGLE MAPS COD POINTS & GEOFENCING
// ============================================================================

model CodMeetingPoint {
  id              String   @id @default(uuid())
  name            String   // "Kampus UI Depok (Gerbatama & Rotunda)"
  full_address    String   @db.Text
  google_maps_url String   @db.Text // https://maps.google.com/?q=-6.3628,106.8315
  embed_query     String?
  distance_km     Decimal  @db.Decimal(4, 1)
  latitude        Decimal  @db.Decimal(10, 7)
  longitude       Decimal  @db.Decimal(10, 7)
  delivery_notes  String?  @db.Text
  is_active       Boolean  @default(true)
  created_at      DateTime @default(now())

  orders          Order[]

  @@index([is_active])
}

// ============================================================================
// 6. ORDERS, TRANSACTIONS & SHIPPING
// ============================================================================

model Order {
  id                    String              @id @default(uuid())
  invoice_number        String              @unique // INV-20260907-001
  user_id               String?
  user                  User?               @relation(fields: [user_id], references: [id], onDelete: SetNull)
  customer_name         String
  customer_phone        String
  customer_email        String?
  customer_avatar_emoji String?             @default("🌸")
  
  fulfillment_type      OrderFulfillment    @default(COURIER_EXPEDITION)
  status                OrderStepStatus     @default(PAYMENT_CONFIRMED)
  
  subtotal              Decimal             @db.Decimal(12, 2)
  shipping_cost         Decimal             @default(0) @db.Decimal(12, 2)
  discount_amount       Decimal             @default(0) @db.Decimal(12, 2)
  admin_fee             Decimal             @default(0) @db.Decimal(12, 2)
  total_amount          Decimal             @db.Decimal(12, 2)
  total_hpp_cost        Decimal             @db.Decimal(12, 2) // Total HPP dari BOM
  net_profit            Decimal             @db.Decimal(12, 2) // total_amount - total_hpp_cost
  
  // Payment
  payment_method        String              @default("midtrans")
  payment_status        PaymentStatus       @default(WAITING_PAYMENT)
  paid_at               DateTime?
  
  // Logistics & COD
  cod_point_id          String?
  cod_point             CodMeetingPoint?    @relation(fields: [cod_point_id], references: [id], onDelete: SetNull)
  courier_name          String?             // "J&T Express Fragile"
  tracking_number       String?             // "BTE-88910293"
  shipping_address      String?             @db.Text
  cod_meetup_notes      String?             @db.Text
  greeting_card_notes   String?             @db.Text
  
  // Coupon
  coupon_id             String?
  coupon                Coupon?             @relation(fields: [coupon_id], references: [id], onDelete: SetNull)

  created_at            DateTime            @default(now())
  updated_at            DateTime            @updatedAt

  items                 OrderItem[]
  claims                WarrantyClaim[]
  payments              PaymentTransaction[]

  @@index([invoice_number])
  @@index([customer_phone])
  @@index([status])
  @@index([created_at])
}

model OrderItem {
  id         String   @id @default(uuid())
  order_id   String
  order      Order    @relation(fields: [order_id], references: [id], onDelete: Cascade)
  product_id String
  product    Product  @relation(fields: [product_id], references: [id], onDelete: Restrict)
  quantity   Int
  unit_price Decimal  @db.Decimal(12, 2)
  item_hpp   Decimal  @db.Decimal(12, 2)
  notes      String?  @db.Text

  @@index([order_id])
}

model PaymentTransaction {
  id             String             @id @default(uuid())
  order_id       String
  order          Order              @relation(fields: [order_id], references: [id], onDelete: Cascade)
  gateway        PaymentGatewayType
  transaction_id String?            // ID Transaksi Midtrans / No Referensi Bank
  status         PaymentStatus      @default(WAITING_PAYMENT)
  gross_amount   Decimal            @db.Decimal(12, 2)
  fee            Decimal            @default(0) @db.Decimal(10, 2)
  payload_json   Json?              // Raw webhook payload dari Midtrans
  created_at     DateTime           @default(now())

  @@index([order_id])
  @@index([transaction_id])
}

// ============================================================================
// 7. MARKETING & COUPONS
// ============================================================================

model Coupon {
  id           String     @id @default(uuid())
  code         String     @unique // "WISUDAHEMAT", "LOVECHENILLE"
  type         CouponType @default(PERCENT)
  value        Decimal    @db.Decimal(10, 2)
  max_discount Decimal?   @db.Decimal(10, 2)
  min_purchase Decimal    @default(0) @db.Decimal(10, 2)
  quota        Int        @default(100)
  usage_count  Int        @default(0)
  is_active    Boolean    @default(true)
  valid_from   DateTime   @default(now())
  valid_until  DateTime
  description  String?
  created_at   DateTime   @default(now())
  updated_at   DateTime   @updatedAt

  orders       Order[]

  @@index([code])
  @@index([is_active])
}

// ============================================================================
// 8. WARRANTY & COMPLAINTS
// ============================================================================

model WarrantyClaim {
  id               String         @id @default(uuid())
  order_id         String
  order            Order          @relation(fields: [order_id], references: [id], onDelete: Cascade)
  customer_phone   String
  issue_category   IssueCategory  @default(TRANSIT_DAMAGE_CRUSHED)
  description      String         @db.Text
  video_proof_url  String?        // Video unboxing di Supabase Storage
  photo_proof_url  String?        // Foto bukti kelopak rusak
  status           WarrantyStatus @default(SUBMITTED)
  admin_notes      String?        @db.Text
  replacement_awb  String?        // Resi buket pengganti 100% gratis
  replacement_date DateTime?
  created_at       DateTime       @default(now())
  updated_at       DateTime       @updatedAt

  @@index([order_id])
  @@index([customer_phone])
  @@index([status])
}

// ============================================================================
// 9. IN-SYSTEM LIVE WEB CHAT CS HUB
// ============================================================================

model ChatSession {
  id              String        @id @default(uuid())
  user_id         String?
  user            User?         @relation(fields: [user_id], references: [id], onDelete: SetNull)
  session_token   String        @unique
  customer_name   String
  customer_phone  String?
  is_escalated_wa Boolean       @default(false)
  created_at      DateTime      @default(now())
  updated_at      DateTime      @updatedAt

  messages        ChatMessage[]

  @@index([session_token])
  @@index([is_escalated_wa])
}

model ChatMessage {
  id             String      @id @default(uuid())
  session_id     String
  session        ChatSession @relation(fields: [session_id], references: [id], onDelete: Cascade)
  sender         String      // "CUSTOMER" | "BOT" | "FLORIST_ADMIN"
  text           String      @db.Text
  attachment_url String?     // Lampiran gambar kustomisasi buket
  sent_at        DateTime    @default(now())

  @@index([session_id])
}

model CannedResponse {
  id              String   @id @default(uuid())
  trigger_keyword String
  title           String
  message_text    String   @db.Text
  category        String   // "FAQ", "CUSTOM_ORDER", "DELIVERY", "CARE"
  sort_order      Int      @default(0)
  is_active       Boolean  @default(true)

  @@index([trigger_keyword])
}

// ============================================================================
// 10. STORE SETTINGS, GATEWAYS & FEATURE TOGGLES
// ============================================================================

model StoreSetting {
  id                  String   @id @default("atelier_setting")
  store_name          String   @default("Chenille Atelier Depok")
  tagline             String   @default("Buket Bunga Kawat Bulu Chenille Premium & Graduation Florist")
  official_whatsapp   String   @default("+62 812-9928-1192")
  studio_address      String   @default("Jl. Margonda Raya No. 120, Beji, Kota Depok, Jawa Barat 16424")
  daily_po_limit      Int      @default(25)
  active_theme        ThemeKey @default(TEMA_A_KOREAN_PASTEL)
  is_maintenance_mode Boolean  @default(false)
  maintenance_title   String   @default("Atelier Chenille Sedang Istirahat Produksi")
  maintenance_desc    String   @default("Kapasitas buket wisuda hari ini telah penuh.")
  updated_at          DateTime @updatedAt
}

model PaymentGatewayConfig {
  id               String             @id @default(uuid())
  gateway_type     PaymentGatewayType @unique
  is_enabled       Boolean            @default(true)
  credentials_json Json?              // Menyimpan keys terenkripsi (Client/Server Key Midtrans, No Rek BCA)
  admin_fee        Decimal            @default(0) @db.Decimal(10, 2)
  max_distance_km  Decimal?           @db.Decimal(4, 1) // Khusus COD Cash
  notes            String?            @db.Text
  updated_at       DateTime           @updatedAt
}

model FeatureToggle {
  key         String   @id // "toggle_maintenance", "toggle_free_cod_radius"
  name        String
  description String
  is_enabled  Boolean  @default(true)
  updated_at  DateTime @updatedAt
}

model CustomerFaq {
  id         String   @id @default(uuid())
  category   String   // "FLOWER_CARE", "COD_RULES", "PO_SCHEDULE", "WARRANTY"
  question   String
  answer     String   @db.Text
  sort_order Int      @default(0)
  is_active  Boolean  @default(true)
  created_at DateTime @default(now())

  @@index([category])
}
```

---

### 8.3 Spesifikasi Supabase Storage Buckets & Strategi Local Backup Failover

Untuk menjamin ketersediaan media (gambar produk, bukti pembayaran, klaim garansi) dan mencegah broken images jika Supabase Storage di-reset atau mengalami *downtime*, arsitektur menerapkan strategi **Dual-Layer Media Storage**:

#### 1. Daftar 7 Supabase Storage Buckets

| Nama Bucket | Level Privasi | Tipe File yang Diizinkan | Ukuran Maksimal | Fungsi Utama |
| :--- | :--- | :--- | :--- | :--- |
| **`product-images`** | **Public** | `image/jpeg`, `image/png`, `image/webp` | 5 MB | Foto katalog produk buket bunga kawat bulu (Cover 1:1, Detail Kelopak, Packaging Box). |
| **`raw-material-images`** | **Public** | `image/jpeg`, `image/png`, `image/webp` | 3 MB | Foto fisik bahan baku mentah (kawat bulu burgundy, kertas cellophane, pita satin, boneka toga). |
| **`lookbook-reviews`** | **Public** | `image/jpeg`, `image/png`, `image/webp` | 5 MB | Foto bukti sosial pelanggan wisuda UI, IPB, anniversary untuk modul Lookbook. |
| **`avatars`** | **Public** | `image/jpeg`, `image/png`, `image/webp` | 2 MB | Foto profil akun admin Rania Azzahra dan member Sarah Amalia. |
| **`chat-attachments`** | **Public** | `image/jpeg`, `image/png`, `image/webp` | 5 MB | Foto referensi buket custom yang dikirim pelanggan melalui Web Chat CS Hub. |
| **`payment-receipts`** | **Private (Auth Only)** | `image/jpeg`, `image/png`, `application/pdf` | 5 MB | Bukti transfer pembayaran bank BCA manual. |
| **`warranty-proofs`** | **Private (Auth Only)** | `image/jpeg`, `image/png`, `video/mp4` | 30 MB | Foto dan rekaman video unboxing utuh untuk validasi klaim garansi 100% ganti baru. |

#### 2. Kebijakan Row Level Security (RLS) Supabase Storage

- **Bucket Publik (`product-images`, `raw-material-images`, `lookbook-reviews`, `avatars`, `chat-attachments`):**
  - `SELECT` (Read): `true` (Dapat diakses publik tanpa login via Supabase CDN URL).
  - `INSERT / UPDATE / DELETE` (Write): Hanya role `authenticated` dengan claim role `SUPER_ADMIN` atau `FLORIST_STAFF`.
- **Bucket Privat (`payment-receipts`, `warranty-proofs`):**
  - `SELECT` (Read): Pemilik file (`auth.uid() = owner`) atau staf admin (`auth.jwt() ->> 'role' IN ('SUPER_ADMIN', 'FLORIST_STAFF')`).
  - `INSERT` (Upload): Pengguna terautentikasi atau session token guest transaksi terkait.

#### 3. Strategi Failover Backup Lokal (`apps/web/public/images/`)

Setiap gambar produk dan bahan baku mentah wajib memiliki salinan lokal (*fallback backup*) di folder `apps/web/public/images/products/`:
```text
apps/web/public/images/
├── products/
│   ├── buket-mawar-merah-velvet.jpg      # Foto studio AI 8K Mawar Velvet
│   ├── buket-tulip-pastel-pink.jpg       # Foto studio AI 8K Tulip Pink Korean
│   ├── buket-matahari-graduation.jpg     # Foto studio AI 8K Bunga Matahari
│   ├── buket-lavender-lilac-dream.jpg    # Foto studio Lavender Lilac Dream
│   ├── buket-karakter-wisuda-toga.jpg    # Foto studio Buket Karakter Toga
│   ├── mini-pot-daisy-kawat-bulu.jpg     # Foto studio Mini Pot Meja Belajar
│   ├── midnight-rose-velvet-romance.jpg  # Foto studio Midnight Rose Deluxe
│   └── buket-matahari-kawaii-smile.jpg   # Foto studio Kawaii Smile Sunflower
└── materials/
    ├── kawat-bulu-pink.jpg
    ├── cellophane-matte-gold.jpg
    └── pita-satin-burgundy.jpg
```

Komponen frontend menggunakan tag `<Image>` dengan atribut fallback: jika URL Supabase Storage mengalami kegagalan load (`onError`), antarmuka secara otomatis memuat file lokal `/images/products/[slug].jpg` tanpa memicu error visual.

---

### 8.4 Spesifikasi Data Seeding Lengkap (`prisma/seed.ts`)

Saat inisialisasi awal database (`npx prisma db seed`), data seed berikut akan di-generate secara otomatis:

#### 1. Akun Pengguna & Hak Akses (RBAC)
- **Super Admin:**
  - Email: `admin@chenilleatelier.com` | Password: `AdminPassword2026!`
  - Nama: `Rania Azzahra (Lead Florist & Owner)` | Role: `SUPER_ADMIN` | Avatar: `/images/avatars/rania.jpg`
- **Florist Staff:**
  - Email: `staff@chenilleatelier.com` | Password: `StaffPassword2026!`
  - Nama: `Budi Handcraft (Artisan)` | Role: `FLORIST_STAFF`
- **Member Loyal:**
  - Email: `sarah.amalia@student.ui.ac.id` | Phone: `081298765432` | Password: `MemberPassword2026!`
  - Nama: `Sarah Amalia` | Role: `CUSTOMER_MEMBER` | Saldo Poin: `50 Flower Points`
  - Alamat: `Jl. Margonda Raya No. 100, Kost UI Kutek Beji Depok`

#### 2. 8 Produk Buket Bunga Kawat Bulu Lengkap
1. `Buket Mawar Merah Velvet Wisuda` (Ready Stock, Rp 165.000, HPP Rp 48.500, Kategori: Wisuda)
2. `Buket Tulip Pastel Pink Korean Style` (PO 2 Hari, Rp 145.000, HPP Rp 38.000, Kategori: Pastel)
3. `Buket Bunga Matahari Graduation Ceria` (Ready Stock, Rp 135.000, HPP Rp 35.500, Kategori: Wisuda)
4. `Buket Lavender Lilac Dream` (Ready Stock, Rp 125.000, HPP Rp 32.000, Kategori: Pastel)
5. `Buket Karakter Wisuda Ber-toga` (PO 3 Hari, Rp 175.000, HPP Rp 54.000, Kategori: Karakter)
6. `Buket Mini Daisy Aesthetic Oat` (Ready Stock, Rp 75.000, HPP Rp 18.000, Kategori: Mini Pot)
7. `Buket Lily Putih Pure Elegance` (PO 2 Hari, Rp 155.000, HPP Rp 42.000, Kategori: Romantis)
8. `Mini Pot Bunga Kawat Bulu Meja Belajar` (Ready Stock, Rp 45.000, HPP Rp 14.000, Kategori: Mini Pot)

#### 3. 7 Master Bahan Baku Mentah & Resep BOM
- `mat-1`: Batang Kawat Bulu Burgundy (6mm) - Stok 350 Batang @ Rp 350 (Supplier: Chenille Jaya Bandung)
- `mat-2`: Batang Kawat Bulu Pastel Pink (6mm) - Stok 420 Batang @ Rp 350 (Supplier: Chenille Jaya Bandung)
- `mat-3`: Batang Kawat Bulu Kuning Matahari - Stok 280 Batang @ Rp 350 (Supplier: Chenille Jaya Bandung)
- `mat-4`: Batang Kawat Tangkai Hijau Kaku (30cm) - Stok 500 Batang @ Rp 500 (Supplier: Florist Supplies Cikampek)
- `mat-5`: Cellophane Korean Matte Maroon Gold - Stok 85 Lembar @ Rp 4.500 (Supplier: Korean Floral Paper Store)
- `mat-6`: Pita Satin Burgundy Mewah 2.5cm - Stok 95 Meter @ Rp 2.200 (Supplier: Pita Cantik Grosir)
- `mat-7`: Boneka Wisuda Mini Ber-toga 10cm - Stok 35 Pcs @ Rp 7.400 (Supplier: Souvenir Boneka Wisuda)

#### 4. 7 Kategori Opsi Custom Studio Interaktif (Termasuk 3 Kategori Tambahan)
- **Kategori 1 (Bunga Utama):** Tulip (+Rp 0), Mawar (+Rp 15.000), Matahari (+Rp 10.000), Lavender (+Rp 5.000)
- **Kategori 2 (Warna Kawat Bulu):** Pastel Pink, Lavender Lilac, Sky Blue, Matcha Sage, Red Velvet
- **Kategori 3 (Kertas Cellophane):** Korean Two-Tone Pink/White, Lilac Velvet, Clean Oat, Midnight Black Gold
- **Kategori 4 (Aksesori Tambahan):** Lampu LED Fairy Light (+Rp 10.000), Boneka Toga Mini (+Rp 15.000), Pin Bros (+Rp 5.000)
- **Kategori 5 (Pita & Ribbon Tambahan):** Satin Tebal (+Rp 0), Organza Transparan (+Rp 5.000), Chiffon Ruffle (+Rp 7.500), Tali Rami Vintage (+Rp 3.000)
- **Kategori 6 (Packaging Eksklusif Tambahan):** Kardus Box Jendela Mika (+Rp 12.000), Tas Jinjing PVC Bening Aesthetic (+Rp 8.000), Paper Bag Mewah Lis Gold (+Rp 6.000)
- **Kategori 7 (Kartu Ucapan & Seal Tambahan):** Kartu Standard Cetak (+Rp 0), Kartu Hotprint Gold Foil (+Rp 5.000), Kartu Vintage Wax Seal Stamp (+Rp 8.000)

#### 5. 6 Titik Temu COD Google Maps Depok
1. `Kampus UI Depok (Gerbatama & Rotunda)` - Jarak: 2.4 KM (Gratis Ongkir, Lat: -6.3628, Lng: 106.8315)
2. `Stasiun KRL Pondok Cina (Pintu Timur)` - Jarak: 1.8 KM (Gratis Ongkir, Lat: -6.3688, Lng: 106.8336)
3. `Universitas Gunadarma (Kampus D Margonda)` - Jarak: 1.4 KM (Gratis Ongkir, Lat: -6.3692, Lng: 106.8322)
4. `Margo City Mall Depok (Lobby Utama Utara)` - Jarak: 3.1 KM (Gratis Ongkir, Lat: -6.3732, Lng: 106.8345)
5. `D'Mall Margonda Depok (Lobby Depan)` - Jarak: 3.9 KM (Gratis Ongkir, Lat: -6.3862, Lng: 106.8285)
6. `Politeknik Negeri Jakarta (PNJ - Gerbang Utama)` - Jarak: 2.8 KM (Gratis Ongkir, Lat: -6.3601, Lng: 106.8272)

#### 6. 3 Kupon Diskon Promo
- `WISUDAHEMAT`: Diskon Rp 25.000 (Min. Belanja Rp 150.000, Kuota 50)
- `LOVECHENILLE`: Diskon 10% (Min. Belanja Rp 100.000, Kuota 100)
- `ONGKIRFREE`: Bebas Ongkir Ekspedisi J&T (Min. Belanja Rp 120.000, Kuota 30)

#### 7. 4 Contoh Transaksi Awal & 10 Sakelar Fitur
- `INV-20260907-001` (Lunas Midtrans, COD Gerbatama UI, Status: `PAYMENT_CONFIRMED`)
- `INV-20260907-002` (Ekspedisi J&T, Status: `CRAFTING_BOUQUET`)
- `INV-20260907-003` (COD Margo City, Status: `QUALITY_CHECK_PASSED`)
- `INV-20260907-004` (Selesai, Review Bintang 5, Status: `COMPLETED`)
- 10 Feature Toggles aktif (Mode PO Throttling, Free COD Radius, Midtrans Active, Live Chat Web, Direct WhatsApp Escalation, Promo Banners, dsb).

---

## 9. Vercel Deployment Strategy & CI/CD Pipeline

Mengadopsi pola deployment multi-project terisolasi seperti yang diterapkan pada `CrownJobExpiredSupbase`:

| Project Aplikasi | Vercel Project Name | Root Directory | Framework Preset | Output Build |
|------------------|---------------------|----------------|------------------|--------------|
| **Frontend Web** | `chenille-flowers-web` | `apps/web` | Next.js | `.next` |
| **Backend API** | `chenille-flowers-api` | `apps/api` | Other / Express | `api/index.js` (Serverless) |

### 9.1 Konfigurasi Dashboard Vercel
1. **Include Source Files Outside Root Directory:** Wajib diaktifkan (**ON**) pada kedua project agar Vercel dapat meng-akses `packages/shared`.
2. **Install Command:** Menggunakan root installer: `npm install --prefix=../..` atau `cd ../.. && npm install`.
3. **Build Command:**
   - Frontend: `turbo run build --filter=@chenille/web...`
   - Backend: `turbo run build --filter=@chenille/api...`

---

## 10. Non-Functional Requirements & Standar Kualitas (QA P0)

1. **Anti-Distortion Geometry:** Semua avatar inisial/gambar wajib mempertahankan aspect ratio 1:1 bulat sempurna pada resolusi layar berapapun (`aspect-ratio: 1 / 1; flex-shrink: 0;`).
2. **Deterministic Layout Stability:** Tidak boleh ada elemen modal yang dirender di luar pembungkus overlay (`.modal-overlay`), guna mencegah kerusakan flow layout dokumen.
3. **Zero Direct WA Trap:** Akses awal konsultasi wajib dialirkan melalui internal live web chat sebelum dieskalasikan ke WhatsApp.
4. **Resilience & Fault Tolerance:** Apabila integrasi eksternal (Midtrans / Biteship / Google Maps) mengalami gangguan, sistem menyediakan fallback graceful degradation tanpa membuat browser freeze atau server crash.
5. **Zero Data Loss:** Pengaturan tema dan riwayat chat web disinkronkan secara ganda ke database dan `localStorage`.
6. **Pure ESM Compliance:** Tidak ada campuran format module CommonJS yang dapat memicu `ERR_REQUIRE_ESM`.

---

## 11. Jadwal Rilis & Roadmap Pengembangan Monorepo

* **Fase 1 (Selesai):** Desain & Verifikasi 6 Antarmuka Interaktif Showcase (Tema A, B, C, Admin Panel, Customer Hub, Login Multi-Tema).
* **Fase 2 (Selesai):** Perancangan PRD v2.0 (Google Maps COD, Kalkulator HPP BOM, Dual-Scenario Tracking, Web Chat).
* **Fase 3 (Selesai):** Rilis Berkas Lisensi MIT & Penyiapan Dokumentasi GitHub.
* **Fase 4 (Selesai - v2.1):** Arsitektur Monorepo Turborepo, Inisialisasi Workspaces (`apps/web`, `apps/api`, `packages/shared`), Penyiapan `turbo.json`, dan Penerapan Best Practices `CrownJobExpiredSupbase`.
* **Fase 5 (Selesai - v2.2):** Spesifikasi Pre-Development Lengkap — Checkout Flow, Integrasi Payment Gateway Midtrans, Logistik Biteship, RBAC Authorization Matrix, API Endpoint Contract, Upload & Storage Gambar, Kupon & Loyalty Points, Search & Filter, Notifikasi WhatsApp, dan Testing Strategy.
* **Fase 6 (Aktif — Development Sprint 1):** Setup monorepo workspace (`apps/web` Next.js 15 + `apps/api` Express ESM), inisialisasi Prisma schema & Supabase database, implementasi `packages/shared` (types, schemas, result pattern), dan autentikasi Better Auth.
* **Fase 7 (Sprint 2):** Implementasi Core Business — Product CRUD + BOM Calculator + Image Upload, Checkout Flow + Atomic Inventory, Midtrans Payment Integration, dan Customer Portal (Guest Tracking + Member Hub).
* **Fase 8 (Sprint 3):** Implementasi Operations — Admin Dashboard KPI & Charts, Order Management & Status Stepper, Biteship Logistics Integration, COD Google Maps, Live Web Chat CS, dan Warranty Claims.
* **Fase 9 (Sprint 4):** Polish & Launch — Multi-Theme Engine Integration, Coupon & Flower Points, WhatsApp Notifications (Fonnte), Search & Filter, Feature Toggles, SEO Optimization, E2E Testing (Playwright), dan Vercel Production Deployment.

---

## 12. Template Environment Variables (`.env.example`)

```env
# ==============================================================================
# BACKEND API (apps/api - Local / Vercel Serverless)
# ==============================================================================
NODE_ENV="development"
PORT=4000

# SUPABASE POSTGRESQL (Dual-URL Strategy - Project Ref: wpdfxuwhqwvglqoiubfq | Region: ap-northeast-1)
# DATABASE_URL: Port 6543 dengan PgBouncer Pooling untuk runtime serverless / API
DATABASE_URL="postgresql://postgres.wpdfxuwhqwvglqoiubfq:HtDqenaSKAmCdQGK@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
# DIRECT_URL: Port 5432 koneksi langsung untuk Prisma CLI Migrations
DIRECT_URL="postgresql://postgres.wpdfxuwhqwvglqoiubfq:HtDqenaSKAmCdQGK@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

# AUTHENTICATION & SECURITY
BETTER_AUTH_SECRET="chenille-atelier-secret-key-minimum-32-chars-2026"
BETTER_AUTH_URL="http://localhost:4000"
JWT_SECRET="chenille-jwt-secret-key-minimum-32-chars-2026"

# CORS
FRONTEND_URL="http://localhost:3000"

# PAYMENT GATEWAY (MIDTRANS SNAP)
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxxxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxxxx"
MIDTRANS_IS_PRODUCTION="false"

# LOGISTICS AGGREGATOR (BITESHIP)
BITESHIP_API_KEY="biteship_test.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ATELIER GEOLOCATION (TITIK PUSAT DEPOK)
ATELIER_LATITUDE="-6.3728"
ATELIER_LONGITUDE="106.8315"
ATELIER_MAX_COD_RADIUS_KM="5.0"

# ==============================================================================
# FRONTEND WEB (apps/web - Local / Vercel)
# ==============================================================================
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_DEFAULT_THEME="tema-a"

# ==============================================================================
# WHATSAPP NOTIFICATION GATEWAY (Fonnte)
# ==============================================================================
WA_GATEWAY_API_KEY="fonnte-api-key-xxxxxxxxxxxxxxxxxxxxxxxx"
WA_GATEWAY_URL="https://api.fonnte.com/send"
WA_SENDER_DEVICE="081234567890"

# ==============================================================================
# IMAGE STORAGE (Supabase Storage)
# ==============================================================================
SUPABASE_URL="https://wpdfxuwhqwvglqoiubfq.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxx"
SUPABASE_STORAGE_BUCKET="product-images"
```

---

## 13. Spesifikasi API Endpoint Contract (RESTful API v1)

Seluruh endpoint backend diakses melalui base URL `{API_URL}/api/v1`. Setiap response mengikuti format standar Result Pattern:

```json
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Descriptive error message",
  "errorCode": "STOCK_INSUFFICIENT"
}
```

### 13.1 Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|:----:|-------------|-------------|----------|
| `POST` | `/auth/register` | 🔓 Public | Daftar member baru | `{ name, email, phone, password }` | `{ user, session }` |
| `POST` | `/auth/login` | 🔓 Public | Login email + password | `{ email, password }` | `{ user, session }` |
| `POST` | `/auth/logout` | 🔒 Auth | Logout & invalidate session | — | `{ message }` |
| `GET` | `/auth/me` | 🔒 Auth | Get current user profile | — | `{ user }` |
| `PATCH` | `/auth/profile` | 🔒 Auth | Update profil & avatar emoji | `{ name?, avatar_emoji? }` | `{ user }` |
| `PATCH` | `/auth/password` | 🔒 Auth | Ganti password | `{ current_password, new_password }` | `{ message }` |

### 13.2 Product & Catalog Endpoints (`/api/v1/products`)

| Method | Endpoint | Auth | Description | Query/Body | Response |
|--------|----------|:----:|-------------|-----------|----------|
| `GET` | `/products` | 🔓 Public | List produk + filter + search + pagination | `?page=1&limit=12&category=Wisuda&sort=price_asc&search=buket` | `{ products[], total, page, totalPages }` |
| `GET` | `/products/:slug` | 🔓 Public | Detail produk + BOM + images | — | `{ product, bomItems[], images[] }` |
| `POST` | `/products` | 🔒 Admin | Buat produk baru | `{ name, category, price, stock, ... }` | `{ product }` |
| `PATCH` | `/products/:id` | 🔒 Admin | Update produk | `{ name?, price?, stock?, ... }` | `{ product }` |
| `DELETE` | `/products/:id` | 🔒 Admin | Soft delete produk | — | `{ message }` |
| `POST` | `/products/:id/images` | 🔒 Admin | Upload gambar produk (multipart) | `FormData: file` | `{ image }` |
| `DELETE` | `/products/:id/images/:imageId` | 🔒 Admin | Hapus gambar produk | — | `{ message }` |
| `POST` | `/products/:id/click` | 🔓 Public | Increment click count (analytics) | — | `{ click_count }` |

### 13.3 Order & Checkout Endpoints (`/api/v1/orders`)

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|:----:|-------------|-------------|----------|
| `POST` | `/orders` | 🔓 Public* | Create order (guest/member) | `{ items[], fulfillment_type, guest_name?, guest_phone, shipping_address?, cod_point_id?, coupon_code? }` | `{ order, snap_token }` |
| `GET` | `/orders/:invoice` | 🔒 Auth/OTP | Get order detail by invoice | — | `{ order, items[], tracking }` |
| `GET` | `/orders/track/:phone` | 🔓 OTP | Track semua order by phone | `?otp=123456` | `{ orders[] }` |
| `GET` | `/orders/my` | 🔒 Member | List order milik member login | `?page=1&status=COMPLETED` | `{ orders[], total }` |
| `PATCH` | `/orders/:id/status` | 🔒 Admin | Update status order (stepper) | `{ status: OrderStepStatus }` | `{ order }` |
| `GET` | `/orders/admin` | 🔒 Admin | List semua order (admin view) | `?page=1&status=PAYMENT_CONFIRMED&date_from&date_to` | `{ orders[], total, summary }` |

### 13.4 Payment Endpoints (`/api/v1/payment`)

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|:----:|-------------|-------------|----------|
| `POST` | `/payment/create` | 🔒 Internal | Create Midtrans transaction | `{ order_id }` | `{ snap_token, redirect_url }` |
| `POST` | `/payment/webhook` | 🔓 Midtrans | Midtrans notification handler | `{ notification_payload }` | `200 OK` |
| `GET` | `/payment/:orderId/status` | 🔒 Auth | Check payment status | — | `{ is_paid, method, paid_at }` |

### 13.5 Logistics Endpoints (`/api/v1/logistics`)

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|:----:|-------------|-------------|----------|
| `POST` | `/logistics/rates` | 🔓 Public | Cek ongkir Biteship | `{ origin_postal, dest_postal, weight }` | `{ couriers[] }` |
| `POST` | `/logistics/book` | 🔒 Admin | Booking kurir & generate AWB | `{ order_id, courier_code, service }` | `{ awb, tracking_url }` |
| `POST` | `/logistics/webhook` | 🔓 Biteship | Biteship tracking webhook | `{ webhook_payload }` | `200 OK` |

### 13.6 Chat Endpoints (`/api/v1/chat`)

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|:----:|-------------|-------------|----------|
| `POST` | `/chat/session` | 🔓 Public | Start chat session | `{ customer_name, customer_phone? }` | `{ session }` |
| `POST` | `/chat/message` | 🔓 Public | Send message | `{ session_id, text }` | `{ message, bot_reply? }` |
| `GET` | `/chat/session/:id` | 🔒 Auth | Get chat history | — | `{ session, messages[] }` |
| `PATCH` | `/chat/session/:id/escalate` | 🔒 Admin | Escalate to WhatsApp | — | `{ wa_url, escalation_token }` |
| `GET` | `/chat/admin` | 🔒 Admin | List all chat sessions (CS Hub) | `?status=active&page=1` | `{ sessions[] }` |

### 13.7 COD & Maps Endpoints (`/api/v1/cod-points`)

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|:----:|-------------|-------------|----------|
| `GET` | `/cod-points` | 🔓 Public | List active COD meeting points | — | `{ points[] }` |
| `POST` | `/cod-points` | 🔒 Admin | Add COD point (auto-detect Maps URL) | `{ name, google_maps_url, delivery_notes? }` | `{ point }` |
| `PATCH` | `/cod-points/:id` | 🔒 Admin | Update COD point | `{ name?, is_active? }` | `{ point }` |
| `DELETE` | `/cod-points/:id` | 🔒 Admin | Delete COD point | — | `{ message }` |

### 13.8 Admin Dashboard & Settings Endpoints (`/api/v1/admin`)

| Method | Endpoint | Auth | Description | Response |
|--------|----------|:----:|-------------|----------|
| `GET` | `/admin/dashboard` | 🔒 Admin | KPI summary (omzet, laba, slot PO, rating) | `{ kpis, recentOrders[] }` |
| `GET` | `/admin/financial-chart` | 🔒 Admin | Data grafik finansial (7/30/90 hari) | `{ chartData[] }` |
| `GET` | `/admin/bom` | 🔒 Admin | BOM raw materials & stock | `{ materials[], totalValue }` |
| `GET` | `/admin/settings` | 🔒 SuperAdmin | Get store settings | `{ settings }` |
| `PATCH` | `/admin/settings` | 🔒 SuperAdmin | Update store settings | `{ settings }` |
| `GET` | `/admin/toggles` | 🔒 Admin | List feature toggles | `{ toggles[] }` |
| `PATCH` | `/admin/toggles/:key` | 🔒 SuperAdmin | Toggle feature on/off | `{ is_enabled }` |

### 13.9 Coupon & Loyalty Endpoints (`/api/v1/coupons`, `/api/v1/points`)

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|:----:|-------------|-------------|----------|
| `POST` | `/coupons/validate` | 🔓 Public | Validate coupon code at checkout | `{ code, subtotal }` | `{ coupon, discount_amount }` |
| `GET` | `/coupons` | 🔒 Admin | List all coupons | `?page=1&is_active=true` | `{ coupons[] }` |
| `POST` | `/coupons` | 🔒 Admin | Create coupon | `{ code, type, value, ... }` | `{ coupon }` |
| `PATCH` | `/coupons/:id` | 🔒 Admin | Update coupon | `{ is_active?, max_uses? }` | `{ coupon }` |
| `GET` | `/points/balance` | 🔒 Member | Get flower points balance | — | `{ balance, transactions[] }` |
| `POST` | `/points/redeem` | 🔒 Member | Redeem points at checkout | `{ points, order_id }` | `{ discount_amount, new_balance }` |

### 13.10 Warranty & Complaint Endpoints (`/api/v1/warranty`)

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|:----:|-------------|-------------|----------|
| `POST` | `/warranty/claim` | 🔓 Public | Submit warranty claim | `{ order_id, phone, issue_category, description, video_proof_url? }` | `{ claim }` |
| `GET` | `/warranty/claim/:id` | 🔒 Auth/OTP | Get claim detail & status | — | `{ claim, order }` |
| `PATCH` | `/warranty/claim/:id` | 🔒 Admin | Update claim status | `{ status, admin_notes?, replacement_awb? }` | `{ claim }` |
| `GET` | `/warranty/admin` | 🔒 Admin | List all claims | `?status=SUBMITTED&page=1` | `{ claims[] }` |

### 13.11 OTP Verification (`/api/v1/otp`)

| Method | Endpoint | Auth | Description | Request Body | Response |
|--------|----------|:----:|-------------|-------------|----------|
| `POST` | `/otp/send` | 🔓 Public | Send OTP to WhatsApp | `{ phone }` | `{ message, expires_in }` |
| `POST` | `/otp/verify` | 🔓 Public | Verify OTP code | `{ phone, otp }` | `{ verified, temp_token }` |

---

## 14. Spesifikasi Testing Strategy & Quality Assurance

Strategi pengujian multi-layer untuk menjamin stabilitas dan keandalan sistem sebelum deployment production:

### 14.1 Unit Tests (Vitest)
**Target coverage: ≥ 80% pada services layer.**

| Modul | Test Cases | Prioritas |
|-------|-----------|:---------:|
| `Result<T>` Pattern | `ok()`, `fail()`, `isSuccess`, `isFailure`, chaining | P0 |
| BOM Calculator | Kalkulasi HPP per buket, margin untung, edge cases (0 item) | P0 |
| Geofencing (Haversine) | Kalkulasi jarak, boundary radius 5.0 KM, edge coordinates | P0 |
| Coupon Validator | Expired, kuota habis, min purchase, member-only, stacking | P0 |
| Flower Points | Earn calculation, redeem limit, balance tracking | P1 |
| Invoice Generator | Format `INV/YYYYMMDD/XXX`, uniqueness, timezone WIB | P1 |
| OTP Service | Hash verification, expiry check, max attempts | P1 |
| Theme Engine | Token injection, valid theme keys, fallback default | P2 |

**Tooling**: `vitest` + `@vitest/coverage-v8` di `apps/api`.

### 14.2 Integration Tests (Supertest)
**Target: Seluruh endpoint API memiliki happy path + error path test.**

| Flow | Endpoint(s) | Validasi |
|------|------------|----------|
| Auth Flow | `/auth/register` → `/auth/login` → `/auth/me` → `/auth/logout` | Session creation, cookie, role check |
| Product CRUD | `POST /products` → `GET /products` → `PATCH` → `DELETE` | Zod validation, slug uniqueness |
| Checkout Flow | `POST /orders` (guest + member) | Atomic lock, stock decrement, invoice format |
| Payment Webhook | `POST /payment/webhook` | Signature verification, idempotency, status mapping |
| COD Points | `POST /cod-points` → `GET /cod-points` | Maps URL parsing, distance calculation |
| Chat Flow | `POST /chat/session` → `POST /chat/message` → escalation | Bot reply, session token, WA escalation |

**Tooling**: `supertest` + `vitest` + Prisma test database (SQLite atau Supabase test project).

### 14.3 End-to-End Tests (Playwright)
**Target: 5 critical user journeys terotomasi penuh.**

| # | Journey | Steps |
|---|---------|-------|
| 1 | **Guest Purchase** | Browse → Add to Cart → Guest Checkout → Midtrans Payment → Track by Phone |
| 2 | **Member Purchase** | Register → Login → Browse → Add to Cart → Member Checkout → View in Portal |
| 3 | **Admin Order Management** | Admin Login → Dashboard → View Orders → Update Status Stepper → Cetak Resi |
| 4 | **Theme Switching** | Browse Tema A → Switch to Tema B → Verify CSS tokens change → Switch Tema C |
| 5 | **Warranty Claim** | Submit Claim → Admin Review → Approve → Verify Status Update |

**Tooling**: `@playwright/test` di root monorepo, dengan fixture untuk database seeding.

### 14.4 Performance & Load Testing
- **Lighthouse**: Target score ≥ 90 (Performance, Accessibility, Best Practices, SEO) pada halaman storefront.
- **Concurrent Checkout Stress Test**: Simulasi 50 user checkout bersamaan → validasi tidak ada oversell (atomic lock bekerja).
- **Database Query Optimization**: Query produk dengan pagination harus < 100ms pada 1.000 produk.

---

## 15. Spesifikasi Master Sistem Animasi Interaktif, Micro-Interactions & Magic UI Engine

Berdasarkan audit menyeluruh terhadap artefak prototype desain pada direktori `desain-tampilan/` (`tema-a-korean-pastel`, `tema-b-modern-romantic`, `tema-c-playful-kawaii`, `customer-portal`, `admin-dashboard`, dan `login`), sistem antarmuka web wajib mengimplementasikan seluruh ekosistem animasi interaktif dan Magic UI untuk menghadirkan pengalaman pengguna yang hidup, responsif, dan bernilai estetika tinggi (*delightful & premium*).

### 15.1 Filosofi Motion & Standar Teknis
1. **GPU-Accelerated (60-120fps):** Seluruh animasi berbasis `transform` (translate, scale, rotate) dan `opacity` untuk menghindari layout thrashing/reflow.
2. **Spring Physics & Natural Easing:** Menggunakan cubic-bezier terkalibrasi (`cubic-bezier(0.16, 1, 0.3, 1)` untuk ease-out fluid dan `cubic-bezier(0.175, 0.885, 0.32, 1.275)` untuk spring bounce/pop).
3. **Accessibility (`prefers-reduced-motion`):** Tetap menghormati preferensi aksesibilitas pengguna sistem operasi dengan mematikan animasi berulang jika requested.

---

### 15.2 Magic UI Fly-to-Cart & Particle Burst System
Fitur utama yang memberikan kepuasan visual instan saat pengunjung memasukkan buket ke keranjang belanja:

```
[Tombol "Tambah ke Keranjang"]
       │
       ▼ (Klik Pengguna)
1. Hitung Koordinat Awal: getBoundingClientRect(sourceBtn)
2. Hitung Koordinat Tujuan: getBoundingClientRect(navCartBtn)
3. Spawn .magic-flyer (Bulatan 48px berisi emoji buket 🌸)
       │
       ▼ (Terbang Parabolik 750ms: cubic-bezier(0.2, 0.8, 0.2, 1))
   Scale: 1.0 ➔ 0.35 | Rotate: 0deg ➔ 360deg | Opacity: 1 ➔ 0.7
       │
       ▼ (Tiba di Icon Keranjang Navbar)
4. Hapus .magic-flyer dari DOM
5. Tambahkan class .cart-bump pada navbar cart (Wiggle 450ms)
6. Ledakkan spawnSparkles(): 8 partikel (🌸, ✨, 💖, 🌷) meledak radial
7. Tampilkan Sonner Magic Toast di pojok kiri bawah (Countdown bar 3.5s)
```

#### Spesifikasi Elemen Fly-to-Cart:
- **Flyer Element (`.magic-flyer`):**
  - Ukuran: 48x48px, bulat penuh (`border-radius: 50%`), background putih dengan border 2px `--primary-border`, bayangan `0 8px 24px rgba(...)`.
  - Durasi Terbang: `750ms` menggunakan kurva `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- **Cart Bump Animation (`@keyframes cartBumpAnim`):**
  - `0% { transform: scale(1); }`
  - `35% { transform: scale(1.3) rotate(-6deg); }`
  - `65% { transform: scale(0.92) rotate(4deg); }`
  - `100% { transform: scale(1); }`
  - Durasi: `450ms` spring easing.
- **Sparkle Burst Explosion (`spawnSparkles(x, y)`):**
  - Jumlah: 8 partikel radial dengan variasi emoji `['🌸', '✨', '💖', '🌷']`.
  - Fisika: Jarak sebar 35px - 60px dengan sudut rotasi merata `(i / 8) * 2π`.
  - Animasi (`@keyframes sparkleFade`): Bergerak ke koordinat CSS variables `--tx`, `--ty` sambil mengecil ke `scale(0.2)` dan memudar dalam `600ms`.

---

### 15.3 Magic UI Sonner-Style Interactive Toast Notification
Sistem notifikasi mengambang non-blocking yang menggantikan alert konvensional:
- **Lokasi & Posisi:** Mengambang di sudut kiri-bawah (`bottom: 28px; left: 28px`), z-index: `99999`.
- **Struktur Visual:**
  - Glassmorphism: `background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(14px);`
  - Border: 1.5px solid bertema pastel, radius 18px, bayangan elevasi halus.
  - Thumbnail: Kotak rounded 46x46px dengan latar pastel dan emoji produk.
  - Teks: Judul tebal (*bold*), deskripsi produk, dan harga terformat.
  - Action Button: Tombol pill "Lihat Keranjang 🛍️" yang langsung membuka Cart Drawer ketika diklik.
  - Countdown Progress Bar: Garis horizontal 3px di bagian dasar kartu yang menyusut dari 100% ke 0% (`@keyframes toastTimer 3.5s linear forwards`).
- **Dismissal Physics:** Jika diabaikan selama 3.5 detik atau tombol dismiss ditekan, toast bertransisi `translateY(20px) scale(0.9)` dengan opacity 0 selama 300ms sebelum di-unmount.

---

### 15.4 Modul Etalase & Katalog Produk
1. **Card 3D Perspective Tilt (`card-tilt-hover`):**
   - Transisi elevasi `-6px` pada sumbu Y saat kursor melayang di atas kartu produk.
   - Peningkatan saturasi bayangan mengikuti warna aksen tema aktif (`box-shadow: 0 12px 28px rgba(...)`).
   - Zoom mikro gambar produk (`scale(1.05)`) dengan transisi halus 500ms.
2. **Category Filter Tabs:**
   - Transisi indikator pill kategori aktif dengan efek spring scale mikro (`active-cat`).
   - Transisi fade-in saat daftar produk berganti filter kategori.
3. **Quick Detail Modal Zoom (`modal-zoom-in`):**
   - Transisi pembukaan dialog modal dari `scale(0.92)` ke `scale(1)` dengan backdrop blur bertahap.
   - Tombol "+ Keranjang" di dalam modal terintegrasi penuh dengan engine Fly-to-Cart.

---

### 15.5 Announcement Bar & Hero Section
1. **Multi-Theme Dynamic Announcement Bar:**
   - **Tema A (Korean Pastel):** Gradien pink pastel bergerak terus-menerus (`gradientMove 8s ease infinite`).
   - **Tema C (Playful Kawaii):** Gradien pelangi menyapu horizontal ceria (`rainbowMove 6s linear infinite`).
   - **Tema B (Modern Romantic):** Latar belakang luxury dark shimmer dengan pencahayaan emas lembut.
2. **Hero Floating Badges & Mascots:**
   - Floating Mascot/Icon: Melayang naik-turun halus (`floatHero 3s ease-in-out infinite`: `-8px` offset, rotasi `3deg`).
   - Floating Secondary Badge: Melayang lebih tenang (`floatHeroSlow 4s ease-in-out infinite`: `-6px` offset, rotasi `2deg`).
3. **CTA Button Shimmer (`btnShimmer`):**
   - Garis cahaya kilap bersudut 120 derajat bergerak melintasi tombol setiap 3 detik untuk menarik perhatian pengunjung.

---

### 15.6 Custom Studio Interaktif
1. **Live Preview Canvas:**
   - Model buket utama di kanvas tengah mengambang secara kontinyu dengan `animate-float-hero`.
   - Transisi pergantian bunga/warna seketika dengan efek spring scale kecil saat swatch warna diklik.
2. **Swatch & Option Selection Feedback:**
   - Pilihan warna kawat bulu dan kertas wrapping memicu ring outline aktif dan elevasi bayangan seketika.
3. **Upselling Addons Checkbox:**
   - Kotak centang aksesori (Lampu LED, Boneka Toga, Kartu Ucapan) memantul (*bounce*) saat dicentang, disertai kalkulasi harga total yang ter-update live.
4. **Tombol Masukkan Keranjang Custom:**
   - Memicu Fly-to-Cart dengan emoji bunga yang dipilih (🌷, 🌹, 🌻, 🪻) menuju ikon keranjang navbar.

---

### 15.7 Cart Drawer & Alur Checkout
1. **Drawer Slide-in Physics:**
   - Menggunakan cubic bezier presisi `slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)` dari sisi kanan layar.
2. **Micro-interaction Kuantitas (+/-):**
   - Tombol kuantitas memiliki efek active scale `0.9` untuk feedback sentuhan yang nyata.
3. **Kupon Diskon Validation:**
   - Feedback visual instan dengan toast Sonner saat kode voucher dimasukkan (`WISUDA10K`).
4. **Opsi Pengiriman (COD vs Kurir):**
   - Transisi accordion halus saat membuka peta titik temu COD kampus.
5. **Modal Pembayaran QRIS & Timer:**
   - Dialog popup dengan animasi `zoomIn`.
   - Timer hitung mundur 15 menit (`qrisTimer`) yang berdetak setiap detik hingga simulasi pembayaran berhasil.

---

### 15.8 Customer Portal & Logistics Laser Magic Beam
Fitur unggulan visual pelacakan pengiriman:
1. **Horizontal Desktop Stepper:**
   - Garis konektor antar titik status dilengkapi laser beam animasi (`magicBeamStep2`, `magicBeamStep3`, `magicBeamStep4`) yang bergerak sepanjang rel progres pesanan.
2. **Vertical Mobile Timeline:**
   - Jalur rel vertikal dengan laser beam menyala (`magicBeamVertical`) yang mengalir ke bawah menuju status aktif.
3. **Breathing Node Rings:**
   - Titik status pesanan aktif berdenyut dengan concentric glowing rings:
     - `pulseActiveNode`: Denyutan merah/pink rose untuk status kurir berjalan.
     - `pulseWarrantyNode`: Denyutan kuning amber untuk status klaim garansi aktif.
     - `pulseTimelineActive`: Denyutan hijau emerald untuk pesanan selesai.
4. **Input Invoice Search Bounce:**
   - Saat nomor invoice diverifikasi, kartu timeline bergetar/memantul lembut (`transform: scale(1.02)` kembali ke `scale(1)`).

---

### 15.9 In-System Live Chat Concierge
1. **Popup Window Spring (`chatPopup`):**
   - Jendela obrolan memantul dari kanan bawah dengan kurva `cubic-bezier(0.16, 1, 0.3, 1)`.
2. **Online Beacon Pulse (`pulseGreen`):**
   - Lampu indikator status florist online berdenyut terus-menerus.
3. **Message Bubble Insertion:**
   - Balasan otomatis asisten atelier muncul dengan transisi fade-up lembut.

---

### 15.10 Admin Operations Dashboard
1. **Theme Switcher Live Preview Frame:**
   - Transisi responsif saat admin beralih antara ukuran viewport Desktop (100%), Tablet (768px), dan Mobile (375px).
2. **View Tabs Transition (`fadeInView`):**
   - Pergantian modul menu admin (Dashboard, Pesanan, Produk, COD Maps, Toggles, dsb.) menggunakan transisi `fadeInView 0.28s cubic-bezier(0.16, 1, 0.3, 1)`.
3. **Header Dropdown & Profile Menu (`fadeInDropdown`):**
   - Menu profil dan pemilih tema meluncur turun dengan lembut.
4. **Database Status Indicator (`pulseDot`):**
   - Titik status koneksi Supabase berkedip perlahan menandakan koneksi live.
5. **Thermal Resi Modal & COD Maps Modal (`modalFade`):**
   - Transisi pembukaan dialog modal cetak thermal resi dan manajemen titik kumpul COD.

---

### 15.11 Sistem Otentikasi (/login)
1. **Demo Role Quick-Fill Cards:**
   - Kartu role Sarah Amalia (Member) dan Rania Azzahra (Admin) memiliki interaksi `card-tilt-hover` yang mengundang klik pengguna.
2. **Tab Switcher Fade (`fadeInAuth`):**
   - Transisi form Masuk vs Daftar Akun berpindah dengan mulus tanpa jeda layar.
3. **Button Shimmer & Loading State:**
   - Tombol submit formulir memancarkan `btnShimmer` dan menampilkan spinner saat autentikasi berlangsung.

---

### 15.12 Matriks Pemetaan Animasi: Prototype vs Implementasi Frontend

| Kategori Animasi | Nama / Class di Prototype HTML | Implementasi Frontend Next.js | Status |
|------------------|--------------------------------|-------------------------------|:------:|
| **Fly-to-Cart** | `flyToCartAnimation(btn, emoji)` | `useMagicMotion` + `MagicFlyer` | Ready to Implement |
| **Cart Bump** | `@keyframes cartBumpAnim`, `.cart-bump` | `Navbar.tsx` `#navCartBtn` + CSS | Connected via Event |
| **Sparkle Burst**| `spawnSparkles(x, y)`, `.magic-sparkle` | `spawnSparkles()` DOM helper | Ready to Implement |
| **Magic Toast** | `showToast()`, `.magic-toast`, `toastTimer` | Global Sonner-style `MagicToastContainer` | Ready to Implement |
| **Card Tilt 3D**| `.product-card:hover`, `.card-hover-3d` | CSS `card-tilt-hover` | Verified Active |
| **Hero Float** | `@keyframes floatHero`, `.animate-float-hero` | `HeroSection.tsx` | Verified Active |
| **Button Shimmer**| `@keyframes btnShimmer`, `.btn-shimmer` | `globals.css` + Action Buttons | Verified Active |
| **Laser Beam Stepper**| `@keyframes magicBeamStep2..4`, `magicBeamVertical` | `OrderStepper.tsx` + `globals.css` | Verified Active |
| **Node Breathing**| `@keyframes pulseActiveNode`, `pulseWarrantyNode` | `OrderStepper.tsx`, `WarrantyClaimModal` | Verified Active |
| **Drawer Slide** | `@keyframes slideLeft`, `.drawer-slide-in` | `CartDrawer.tsx` | Verified Active |
| **Chat Popup** | `@keyframes chatPopup`, `.chat-popup-anim` | `LiveChatWidget.tsx` | Verified Active |
| **Admin View Fade**| `@keyframes fadeInView`, `.admin-view-fade` | `apps/web/src/app/admin/page.tsx` | Verified Active |

