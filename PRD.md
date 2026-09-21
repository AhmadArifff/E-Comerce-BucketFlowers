# PRD: E-Commerce & Interactive Multi-Theme Catalog Buket Bunga Kawat Bulu

**Nama Produk:** E-Commerce & Interactive Multi-Theme Catalog Buket Bunga Kawat Bulu (*Aesthetic Chenille Flowers Atelier*)  
**Arsitektur:** Enterprise Turborepo Monorepo (`apps/web` + `apps/api` + `packages/shared`) + Vercel Deployment + Supabase PostgreSQL  
**Standar Operasional:** Shopify-Grade Operations, Google Maps Geofencing, Multi-Theme Engine & Real-Time Logistics  
**Role / Penulis:** Senior Product Manager, Lead Architect & Tech Critic Reviewer  
**Tanggal Rilis:** 2026-09-09  
**Versi:** v2.7 (Comprehensive Behavioral Analytics & CRO Engine, Multi-Theme Copywriting Tone of Voice, and UI/UX Visual Art Direction Suite)  
**Status:** Approved for Full Implementation & Git Release  
**Tech Stack Baseline:** Turborepo 2.x, Next.js 15+ (App Router), Express.js (ESM Module on Vercel Serverless), Prisma ORM (Supabase PostgreSQL with PgBouncer Connection Pooling), Better Auth (RBAC & Session Rotation), Tailwind CSS + Design Tokens, Midtrans Snap SDK, Biteship Logistics API, Google Maps Embed & URL Schemes, In-House Event Telemetry, Result Pattern (`@chenille/shared`), Pino Structured Logging.

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
  │   │   ├── Sticky Navbar (Brand Logo, 6 Menu Utama, Pencarian, Customer Profile Pill & Dropdown [Nama/Email/Ganti Sandi/Logout], Cart Drawer Bump)
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
  │   │       ├── Customer Profile & Account Management Modal (Nama Lengkap, No. WA, Email, Alamat Utama)
  │   │       ├── Customer Change Password Modal (Kata Sandi Saat Ini, Sandi Baru, Konfirmasi)
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
    ├── 10. Titik Temu COD Google Maps (Geofencing Dinamis Mengacu Lokasi Base Toko/Atelier)
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

5. **Kredensial Midtrans Sandbox (Aktif & Terverifikasi):**

   | Parameter | Nilai | Keterangan |
   |-----------|-------|------------|
   | **Dashboard URL** | [dashboard.sandbox.midtrans.com](https://dashboard.sandbox.midtrans.com/settings/access-keys/credentials) | Portal konfigurasi Sandbox |
   | **Merchant ID** | `M602203518` | Identitas unik merchant di ekosistem Midtrans |
   | **Client Key** | `Mid-client-Xi4Kpe2EP7_nAsfZ` | Digunakan di frontend (`snap.js` script tag `data-client-key`) |
   | **Server Key** | `Mid-server-*****` *(tersimpan di `.env`, lihat Dashboard Midtrans)* | Digunakan di backend untuk Snap API call & webhook signature verification (**RAHASIA — jangan ekspos ke frontend atau Git**) |

   **Konfigurasi Environment Variables (`.env`):**
   ```env
   # ===== MIDTRANS SNAP SDK (SANDBOX — AKTIF) =====
   MIDTRANS_SERVER_KEY="Mid-server-***** (lihat .env lokal / Dashboard Midtrans)"
   MIDTRANS_CLIENT_KEY="Mid-client-Xi4Kpe2EP7_nAsfZ"
   MIDTRANS_IS_PRODUCTION="false"
   MIDTRANS_MERCHANT_ID="M602203518"

   # Frontend (apps/web/.env.local)
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="Mid-client-Xi4Kpe2EP7_nAsfZ"
   ```

   **Webhook Notification URL (Set di Dashboard Midtrans):**
   - **Development (lokal):** Gunakan [ngrok](https://ngrok.com) atau [localtunnel](https://localtunnel.me) untuk expose `localhost:4000` → `https://xxxx.ngrok.io/api/v1/payment/webhook`
   - **Production (Vercel):** `https://[DOMAIN-VERCEL].vercel.app/api/v1/payment/webhook`
   - **Cara set:** Dashboard Midtrans → Settings → Configuration → Payment Notification URL

   **Panduan Migrasi ke Production:**
   1. Lengkapi onboarding di Dashboard Midtrans (upload KTP + NPWP pemilik bisnis).
   2. Tunggu approval dari tim Midtrans (estimasi 1–3 hari kerja).
   3. Setelah disetujui, salin Production Keys (`Mid-server-xxx`, `Mid-client-xxx` tanpa prefix `SB-`).
   4. Update `.env` dengan Production keys dan set `MIDTRANS_IS_PRODUCTION="true"`.
   5. Lakukan transaksi test Production dengan nominal kecil (Rp 10.000) untuk verifikasi end-to-end.

   **Biaya Midtrans per Transaksi Berhasil:**
   | Metode Pembayaran | Biaya |
   |-------------------|-------|
   | QRIS (GoPay, ShopeePay, OVO) | 0.7% dari nilai transaksi |
   | Virtual Account (BCA, BNI, Mandiri) | Rp 4.000 flat per transaksi |
   | Kartu Kredit/Debit | 2.9% + Rp 2.000 |
   | GoPay Direct | 2% dari nilai transaksi |
   | Alfamart / Indomaret | Rp 5.000 flat |

   > **Catatan:** Tidak ada biaya bulanan/tahunan. Midtrans hanya mengenakan biaya per transaksi berhasil. Settlement (pencairan ke rekening bank merchant) dilakukan **T+2 hari kerja**.

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

7. **Kredensial Biteship Testing Mode (Aktif & Terverifikasi):**

   | Parameter | Nilai | Keterangan |
   |-----------|-------|------------|
   | **Dashboard URL** | [dashboard.biteship.com](https://dashboard.biteship.com) | Portal konfigurasi & monitoring |
   | **Nama Toko** | `Buket Flowers Kawat Bulu` | Nama merchant terdaftar di Biteship |
   | **API Key (Testing)** | `biteship_test.*****` *(tersimpan di `.env`, lihat Dashboard Biteship)* | JWT-based API key untuk Testing Mode (**RAHASIA — jangan ekspos ke Git**) |
   | **Mode** | Testing | Belum terhubung ke kurir live, menggunakan simulasi tarif & resi |

   **Konfigurasi Environment Variables (`.env`):**
   ```env
   # ===== BITESHIP LOGISTICS AGGREGATOR (TESTING MODE — AKTIF) =====
   BITESHIP_API_KEY="biteship_test.***** (lihat .env lokal / Dashboard Biteship)"
   ```

   **Webhook Tracking URL (Set di Dashboard Biteship):**
   - **Development (lokal):** Gunakan ngrok → `https://xxxx.ngrok.io/api/v1/logistics/webhook`
   - **Production (Vercel):** `https://[DOMAIN-VERCEL].vercel.app/api/v1/logistics/webhook`
   - **Cara set:** Dashboard Biteship → Integrasi → Webhook → Event: `order.status_updated`

   **Panduan Migrasi ke Live Mode:**
   1. Login ke Dashboard Biteship → switch dari **Testing** ke **Live Mode** di sidebar.
   2. Klik **"Aktivasi Order API"** → isi informasi bisnis (nama toko, alamat pickup Atelier Margonda Depok).
   3. Pilih kurir yang ingin diaktifkan (JNE, J&T, SiCepat, GoSend, GrabExpress).
   4. Buat **Live API Key** baru (`biteship_live.xxxxx`) dan update `.env`.
   5. Isi saldo Biteship untuk pembayaran ongkir kurir.
   6. Test dispatch pengiriman pertama dengan paket kecil untuk verifikasi end-to-end.

   **Biaya Biteship:**
   | Item | Biaya |
   |------|-------|
   | Registrasi & Integrasi | **Gratis** |
   | Rates API (cek ongkir) | ~Rp 5 per request |
   | Order API (buat pesanan + resi) | **Gratis** |
   | Ongkir ke pelanggan | Sesuai tarif resmi kurir (tanpa markup) |

   > **Catatan:** Tidak ada biaya bulanan. Tarif ongkir yang muncul di Biteship adalah tarif resmi dari kurir tanpa markup. Biaya Rates API sangat murah (~Rp 5/hit, 1000 cek ongkir/bulan = ~Rp 5.000).

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

### 7.20 Spesifikasi Modul Pengaturan Toko, Manajemen Payment Gateway & Jasa Kirim (Admin Menu #13)

Modul **Pengaturan Toko & Kredensial API** (`/admin` tab `SETTINGS`) berfungsi sebagai pusat kendali operasional tunggal (*Single Control Panel*) bagi Super Admin untuk mengelola identitas atelier, mengaktifkan/menonaktifkan metode pembayaran dan kurir logistik secara dinamis tanpa perlu deploy ulang kode, serta memvalidasi kredensial API gateway secara real-time.

```text
ADMIN SETTINGS VIEW HIERARCHY
  ├── 1. Profil Atelier & Kuota Harian
  │    ├── Nama Studio Atelier, Tagline, No. WA Resmi
  │    ├── Alamat Fisik Workshop / Studio (Margonda Depok)
  │    └── Kapasitas Slot PO Harian (Throttling)
  │
  ├── 2. Manajemen Payment Gateway (Aktifkan / Nonaktifkan & Kredensial) [Sesuai Mockup UI]
  │    ├── Card 1: Midtrans Snap QRIS & Virtual Account (Otomatis)
  │    │    ├── Toggle: Aktif di Checkout (On/Off)
  │    │    ├── Fields: Merchant ID, Client Key, Server Key (Masked Password)
  │    │    └── Biaya Admin / Fee (Rp)
  │    ├── Card 2: Transfer Bank BCA Manual (Konfirmasi WhatsApp)
  │    │    ├── Toggle: Aktif di Checkout (On/Off)
  │    │    ├── Fields: Nomor Rekening, Atas Nama Rekening, Kantor Cabang
  │    │    └── Biaya Admin / Layanan (Rp)
  │    └── Card 3: Cash on Delivery (COD) Titik Temu Kampus / Mall
  │         ├── Toggle: Aktif di Checkout (On/Off)
  │         ├── Fields: Radius Maksimal COD (KM), Biaya Penanganan COD (Rp)
  │         └── Catatan / Instruksi Pembayaran COD
  │
  └── 3. Manajemen Jasa Kirim & Logistik (Biteship API & Kurir Ekspedisi)
       ├── Card 1: Integrasi Biteship API Aggregator
       │    ├── Toggle: Aktifkan Kalkulasi Ongkir Otomatis Biteship (On/Off)
       │    ├── Mode: Testing Sandbox vs Live Production
       │    ├── Fields: Biteship API Key (Masked Password), Nama Pengirim, No. HP Pengirim
       │    ├── Alamat Asal Pickup Gudang (Alamat & Kode Pos Origin: 16424 Beji Depok)
       │    ├── Biaya Penanganan / Packing Kardus Tebal & Bubble Wrap (Rp)
       │    └── Tombol Diagnostik: "Tes Koneksi API Biteship" (Status: Terhubung / Gagal)
       └── Card 2: Filter Kurir Ekspedisi yang Diaktifkan di Checkout
            ├── Kurir Reguler: J&T Express (jnt), JNE Express (jne), SiCepat (sicepat)
            ├── Kurir Alternatif: AnterAja (anteraja)
            └── Kurir Instant: GoSend (gosend), GrabExpress (grab)
```

#### 1. Rincian Formulir Pengaturan Payment Gateway (Sesuai Desain Mockup)
Setiap metode pembayaran memiliki sakelar independen `Aktif di Checkout`. Metode yang dinonaktifkan **otomatis disembunyikan dari formulir checkout pelanggan** di etalase web:

| Metode Pembayaran | Field Konfigurasi | Tipe Input | Nilai Default / Contoh | Dampak ke Pelanggan |
| :--- | :--- | :--- | :--- | :--- |
| **Midtrans Snap QRIS & VA** | • Status Aktif<br>• Merchant ID<br>• Client Key<br>• Server Key<br>• Biaya Admin (Rp) | Toggle<br>Text<br>Text<br>Password<br>Number | `true`<br>`M602203518`<br>`Mid-client-Xi4Kpe2EP7_nAsfZ`<br>`Mid-server-*****`<br>`Rp 2.500` | Membuka popup modal Midtrans Snap untuk scan QRIS Nasional (GoPay, ShopeePay, OVO, Dana) dan nomor Virtual Account Bank. |
| **Transfer BCA Manual** | • Status Aktif<br>• No. Rekening<br>• Atas Nama<br>• Kantor Cabang<br>• Biaya Layanan (Rp) | Toggle<br>Text (Mono)<br>Text<br>Text<br>Number | `true`<br>`8420-1928-31`<br>`PT Chenille Atelier Florist`<br>`KCP Margonda Raya Depok`<br>`Rp 0` | Pelanggan mentransfer manual ke rekening atelier, lalu mengirimkan foto bukti transfer via WhatsApp CS / Portal. |
| **Cash on Delivery (COD)** | • Status Aktif<br>• Radius Maksimal (KM)<br>• Biaya COD (Rp)<br>• Catatan Instruksi | Toggle<br>Number<br>Number<br>Text | `true`<br>`7.5 KM`<br>`Rp 0`<br>`Bayar tunai pas serah terima buket di Titik Temu Kampus` | Membatasi opsi COD hanya jika lokasi titik temu dalam radius maksimal. Pembeli membayar tunai saat serah terima. |

#### 2. Rincian Formulir Pengaturan Jasa Kirim & Logistik Kurir
Admin dapat mengontrol aggregator kurir Biteship dan menentukan kurir mana saja yang aktif melayani pengiriman:

| Komponen Pengaturan | Field Konfigurasi | Tipe Input | Deskripsi & Fungsi |
| :--- | :--- | :--- | :--- |
| **Biteship API Core** | • Status Logistik Otomatis<br>• Environment Mode<br>• Biteship API Key | Toggle<br>Radio Switch<br>Password (Masked) | Jika aktif, checkout melakukan kalkulasi ongkir live via Biteship. Mode Sandbox menggunakan simulasi tarif, Live menggunakan kurir nyata. |
| **Alamat Pickup Origin** | • Nama Pengirim / Toko<br>• No. HP Pickup<br>• Alamat Gudang Workshop<br>• Kode Pos Origin | Text<br>Text<br>Text<br>Number (Mono) | Lokasi asal kurir menjemput paket buket. Default: Jl. Margonda Raya No. 108, Pondok Cina, Beji, Depok 16424. |
| **Seleksi Kurir Aktif** | • J&T Express (`jnt`)<br>• JNE Express (`jne`)<br>• SiCepat (`sicepat`)<br>• AnterAja (`anteraja`)<br>• GoSend Instant (`gosend`) | Multi-Checkbox / Switch Pills per Kurir | Hanya kurir yang dicentang yang akan di-query ke Biteship Rates API dan ditampilkan opsi layanannya kepada pembeli. |
| **Biaya Tambahan Packing** | • Biaya Pengemasan (Rp) | Number | Tambahan biaya flat untuk packing kardus tebal double-wall corrugated + bubble wrap per pengiriman (default: Rp 0). |
| **Diagnostik API** | • Tombol "Tes Koneksi API"<br>• Status Badge | Action Button<br>Badge Indikator | Melakukan ping ke `https://api.biteship.com/v1/couriers` untuk validasi API key dan menampilkan status: `🟢 Terhubung (Testing/Live)` atau `🔴 Gagal`. |

#### 3. Arsitektur Penyimpanan Kredensial & Keamanan (Security Hierarchy)
Untuk memenuhi standar keamanan industri dan kebijakan GitHub Push Protection:
1. **Aturan Masking Kredensial Rahasia:**
   - Kunci rahasia backend (`Server Key Midtrans`, `Biteship API Key`) **DILARANG KERAS** dikembalikan dalam bentuk plain-text ke API publik atau frontend.
   - Endpoint `GET /api/v1/admin/settings` mengembalikan kunci rahasia dalam format ter-masking: `Mid-server-*****` atau `biteship_test.*****`.
   - Hanya Super Admin terautentikasi yang dapat meng-update nilai kunci rahasia melalui request `PATCH /api/v1/admin/settings/*`.
2. **Dual-Layer Fallback (Database vs Environment Variables):**
   - **Prioritas 1 (Database):** Jika Super Admin telah mengonfigurasi dan menyimpan kredensial melalui Panel Pengaturan Admin, sistem memprioritaskan nilai dari tabel database `payment_gateway_configs` dan `logistics_configs`.
   - **Prioritas 2 (Environment Variables):** Jika tabel database kosong / belum di-setup, sistem secara otomatis *fallback* menggunakan nilai dari `.env` (`MIDTRANS_SERVER_KEY`, `BITESHIP_API_KEY`).
   - Pendekatan ini menjamin sistem tetap berjalan saat inisialisasi awal (*zero setup interruption*) sekaligus memberikan kendali penuh kepada admin untuk mengganti API key tanpa deploy ulang.

#### 4. API Endpoints Kontrak Modul Pengaturan
- `GET /api/v1/admin/settings/all`: Mengambil profil toko, konfigurasi payment gateway, dan konfigurasi logistik kurir (kunci server di-masking).
- `PATCH /api/v1/admin/settings/profile`: Memperbarui nama toko, tagline, nomor WhatsApp, dan kuota PO harian.
- `PATCH /api/v1/admin/settings/payment`: Memperbarui aktivasi gateway, biaya admin, nomor rekening BCA, parameter COD, dan kredensial Midtrans.
- `PATCH /api/v1/admin/settings/logistics`: Memperbarui aktivasi Biteship, pilihan kurir aktif, alamat pickup, dan API key.
- `POST /api/v1/admin/settings/logistics/test`: Melakukan pengujian koneksi ke API Biteship dengan API key yang sedang terpasang.

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

model LogisticsConfig {
  id                  String   @id @default("biteship_setting")
  is_enabled          Boolean  @default(true)
  is_production       Boolean  @default(false)
  api_key_masked      String?  // Masked key untuk display panel admin
  origin_name         String   @default("Aesthetic Chenille Flowers Atelier")
  origin_phone        String   @default("081234567890")
  origin_address      String   @default("Jl. Margonda Raya No. 108, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424")
  origin_postal_code  Int      @default(16424)
  origin_latitude     Decimal  @default(-6.3728) @db.Decimal(10, 7)
  origin_longitude    Decimal  @default(106.8315) @db.Decimal(10, 7)
  active_couriers     String[] @default(["jne", "jnt", "sicepat", "gosend"])
  extra_packing_fee   Decimal  @default(0) @db.Decimal(10, 2)
  updated_at          DateTime @updatedAt
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

---

## 16. Customer Profile & Account Management Suite (Member Hub & Navbar Dropdown)

### 16.1 Latar Belakang & Visi Fitur
Sebagai platform e-commerce buket bunga kawat bulu kelas premium, pelanggan terdaftar (*registered members*) memerlukan kontrol penuh atas akun pribadi mereka langsung dari etalase (*storefront*) maupun dashboard pelanggan (*portal*), serupa dengan kapabilitas yang telah dimiliki oleh Admin Panel.

Sebelumnya, tombol akun pada Navbar etalase hanya berupa tautan statis ke `/login`. Pada v2.4, ketika pelanggan telah login, tombol akun bertransformasi menjadi **Interactive Profile Pill & Dropdown** yang kaya informasi dan akses cepat.

### 16.2 Spesifikasi Komponen & Tampilan Antarmuka

#### 1. Storefront Header Profile Pill & Dropdown (`apps/web/src/components/storefront/Navbar.tsx`)
* **Kondisi Tamu (Unauthenticated):**
  - Menampilkan tombol pill `[👤 Masuk]` yang mengarahkan pengunjung ke halaman `/login`.
* **Kondisi Terautentikasi (Authenticated Member / Admin):**
  - Menampilkan tombol pill `[🌸 Ahmad]` dengan inisial/emoji avatar, nama depan pengguna, dan ikon panah bawah (`ChevronDown`).
  - **Klik Membuka Dropdown Interaktif (`fadeInDropdown`):**
    1. **Header Card:**
       - Avatar inisial / emoji lingkaran terpusat (`aspect-ratio: 1/1`).
       - Nama Lengkap (contoh: *Ahmad Arif / Siti Anggraini*).
       - Alamat Email (contoh: *ahmad@gmail.com*).
       - Badge Status Peran: `PELANGGAN AKTIF` / `MEMBER ATELIER` / `SUPER ADMIN`.
    2. **Menu Item 1: Profil Pelanggan & Akun (`User` Icon):**
       - Membuka `CustomerProfileModal`.
    3. **Menu Item 2: Portal Pesanan & Tracking (`Package` Icon):**
       - Navigasi cepat ke `/portal` untuk memantau status buket live.
    4. **Menu Item 3: Ganti Kata Sandi (`KeyRound` Icon):**
       - Membuka `CustomerChangePasswordModal`.
    5. **Menu Khusus Staf / Admin (`ShieldCheck` Icon):**
       - Ditampilkan bersyarat jika pengguna memiliki role `SUPER_ADMIN` atau `FLORIST_STAFF`: "Panel Florist (Admin)" mengarah ke `/admin`.
    6. **Menu Item Logout (`LogOut` Icon):**
       - Menghapus sesi autentikasi, me-reset state, menutup dropdown, dan menampilkan toast konfirmasi: *"Logout Berhasil 🔒 - Sesi akun telah keluar dengan aman."*

#### 2. Modal Profil Pelanggan & Akun (`CustomerProfileModal.tsx`)
* **Field Formulir:**
  1. *Nama Lengkap:* Input teks dengan validasi required.
  2. *Nomor WhatsApp / HP:* Format angka Indonesia (`+62` / `08...`), wajib diisi untuk notifikasi otomatis resi.
  3. *Alamat Email:* Input email untuk konfirmasi invoice digital.
  4. *Alamat Pengiriman Utama:* Textarea alamat lengkap (jalan, nomor rumah, patokan, RT/RW, kecamatan, kota, kode pos) yang otomatis menjadi default saat checkout ekspedisi.
* **Aksi Modal:**
  - Tombol Batal (`onClose`).
  - Tombol Simpan Perubahan (trigger `updateProfile()` di `useAuthStore` dan sinkronisasi ke API `/api/v1/auth/profile`).

#### 3. Modal Ganti Kata Sandi Pelanggan (`CustomerChangePasswordModal.tsx`)
* **Field Formulir:**
  1. *Kata Sandi Saat Ini:* Input tipe password untuk verifikasi kepemilikan akun.
  2. *Kata Sandi Baru:* Minimal 8 karakter.
  3. *Konfirmasi Kata Sandi Baru:* Validasi kesamaan input secara realtime.
* **Validasi Keamanan:**
  - Jika kata sandi baru dan konfirmasi tidak cocok, muncul peringatan instan *"Kata Sandi Tidak Cocok ⚠️"*.
  - Jika berhasil, data dikirim ke backend, modal tertutup, dan memunculkan toast sukses *"Kata Sandi Diperbarui! 🔑"*.

---

## 17. Konfigurasi Titik Lokasi Toko & Geofencing Origin Engine (Adopsi Pola adminShuttleV3)

### 17.1 Analisis & Adopsi Pola Desain Outlet Reference (`adminShuttleV3`)
Berdasarkan investigasi terhadap arsitektur tabel `outlets` pada database `transport_system` di project referensi `C:\Users\ASUS\Documents\Web Dev\sunjaya\Roleback\adminShuttleV3`, ditemukan praktik terbaik untuk pengelolaan lokasi outlet fisik:
1. **Penyimpanan Koordinat Eksplisit:** Kolom `latitude` dan `longitude` bertipe `VARCHAR(50)` untuk fleksibilitas desimal presisi tinggi hingga 8 digit desimal (~1.1 milimeter).
2. **Pencarian Lokasi Cerdas (Places Autocomplete):** Kolom input pencarian peta (`#search-map-input`) yang terhubung dengan Google Places API untuk mempermudah menemukan nama gedung, jalan, atau landmark.
3. **Penyalinan Alamat Otomatis (`copyData()`):** Tombol *"Jadikan Alamat Outlet / Studio"* yang menyalin nama tempat dan alamat lengkap dari Google Places langsung ke textarea alamat fisik toko.
4. **Interactive Pin Dragging:** Marker peta dapat digeser (*draggable*) langsung oleh pengguna, dan event `dragend` secara otomatis mengisi kolom input latitude & longitude secara presisi.
5. **Bidirectional Coordinate Sync:** Mengubah angka di kolom latitude/longitude secara manual otomatis memindahkan pin marker dan me-recenter tampilan peta.

### 17.2 Skema Database & Migrasi Supabase PostgreSQL (`store_settings`)

Tabel `store_settings` di Supabase PostgreSQL diperluas dengan 4 kolom baru yang mengadopsi standar `transport_system.outlets`:

```sql
-- Penyesuaian Tabel store_settings v2.4
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS latitude VARCHAR(50) DEFAULT '-6.3728',
  ADD COLUMN IF NOT EXISTS longitude VARCHAR(50) DEFAULT '106.8315',
  ADD COLUMN IF NOT EXISTS maps_link VARCHAR(255) DEFAULT 'https://maps.google.com/?q=-6.3728,106.8315',
  ADD COLUMN IF NOT EXISTS max_cod_radius_km DECIMAL(4, 1) DEFAULT 5.0;
```

#### Pemetaan Model Prisma (`apps/api/prisma/schema.prisma`):
```prisma
model StoreSetting {
  id                  String   @id @default("atelier_setting")
  store_name          String   @default("Chenille Atelier Depok")
  tagline             String   @default("Buket Bunga Kawat Bulu Chenille Premium & Graduation Florist")
  official_whatsapp   String   @default("+62 812-9831-7721")
  studio_address      String   @default("Jl. Margonda Raya No. 120, Beji, Kota Depok, Jawa Barat 16424")
  daily_po_limit      Int      @default(25)
  active_theme        ThemeKey @default(TEMA_A_KOREAN_PASTEL)
  is_maintenance_mode Boolean  @default(false)
  maintenance_title   String   @default("Atelier Chenille Sedang Istirahat Produksi")
  maintenance_desc    String   @default("Kapasitas buket wisuda hari ini telah penuh.")
  latitude            String?  @default("-6.3728")
  longitude           String?  @default("106.8315")
  maps_link           String?  @default("https://maps.google.com/?q=-6.3728,106.8315")
  max_cod_radius_km   Decimal? @default(5.0) @db.Decimal(4, 1)
  updated_at          DateTime @updatedAt
}
```

### 17.3 Komponen Antarmuka Pengaturan Toko (`SettingsView` di `AdminViews.tsx`)
Pada formulir Pengaturan Atelier (Seksi 1), struktur tata letak diperkaya menjadi:
1. **Baris 1: Identitas Studio:** Nama Studio Atelier & Nomor WhatsApp CS Resmi.
2. **Baris 2: Tagline Toko & Kapasitas Slot PO Harian.**
3. **Baris 3: Titik Lokasi Peta & Alamat Studio (Pola Outlet Form):**
   - **Input Search Maps & Autocomplete:** Tempat admin mengetik nama jalan/toko/landmark (contoh: *"Atelier Chenille Margonda Raya 120"*).
   - **Tombol "Jadikan Alamat Studio":** Menyalin hasil pencarian ke kolom textarea alamat.
   - **Interactive Leaflet / Google Map Container:** Peta interaktif dengan pin marker berlogo atelier yang dapat digeser bebas (*draggable marker*).
   - **Input Kolom Latitude & Longitude:** Menampilkan angka koordinat GPS hasil geseran pin atau ketikan manual.
   - **Input Radius Maksimum COD Bebas Ongkir (KM):** Default `5.0` KM.
   - **Textarea Alamat Fisik Lengkap Studio.**

### 17.4 Integrasi Dinamis Geofencing & Jarak Bebas Ongkir
1. **Eliminasi Koordinat Hardcoded:**
   - Variabel konstanta statis `ATELIER_LAT` dan `ATELIER_LNG` di `apps/web/src/components/admin/CODMapModal.tsx` dan `apps/api/src/routes/cod.routes.ts` digantikan dengan pembacaan dinamis dari `useSettingsStore` (frontend) dan tabel `store_settings` (backend).
2. **Kalkulasi Jarak Haversine Dinamis:**
   - Endpoint `POST /api/v1/cod-points/calculate-distance` menghitung jarak relatif dari `store_settings.latitude` & `store_settings.longitude` terhadap tujuan COD.
   - Radius bebas ongkir ditentukan berdasarkan nilai `store_settings.max_cod_radius_km`.
3. **Visualisasi Lingkaran Geofencing di Admin COD Maps:**
   - Lingkaran radius 5 KM pada peta admin otomatis berpindah pusat mengikuti koordinat studio toko yang disimpan.

### 17.5 Arsitektur Kredensial & Integrasi Google Maps API (Reverse Geocoding & Cardless Smart Autocomplete)

#### 17.5.1 Analisis & Review Kasus GPS vs Alamat Fisik
- **Pertanyaan / Isu Pengguna:**  
  *Kenapa saat menggunakan GPS ("Gunakan GPS Saya") dia hanya menyimpan latitude dan longitude saja (misalnya teks yang muncul `Lokasi GPS Perangkat Saya (-6.899755, 107.558353)`) dan bukan alamat jalan yang sesungguhnya?*
- **Akar Masalah Teknis:**  
  API bawaan browser (`navigator.geolocation.getCurrentPosition`) adalah antarmuka perangkat keras (GPS chip / Wi-Fi triangulation) yang **hanya mengembalikan angka koordinat mentah** (`latitude` dan `longitude`). Browser tidak memiliki basis data peta internal untuk mengetahui apakah `-6.899755, 107.558353` berada di Jl. Sudirman, Cibeureum, atau Margonda Raya.
- **Solusi Arsitektur (Reverse Geocoding Pipeline):**  
  Sistem mengimplementasikan alur **Reverse Geocoding otomatis**:
  1. Ketika tombol *"Gunakan GPS Saya"* diklik, browser mengambil koordinat hardware.
  2. Sistem segera melakukan panggilan asinkron ke endpoint Reverse Geocoding (OpenStreetMap Nominatim / Google Geocoding API):
     ```text
     GET https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&addressdetails=1
     ```
  3. Respons berupa objek terstruktur berisi nama jalan (*road*), kelurahan (*suburb*), kecamatan (*city_district*), kota (*city*), provinsi (*state*), dan kode pos (*postcode*).
  4. Form `Alamat Fisik Workshop / Studio` (`studioAddress`) otomatis terisi dengan alamat lengkap yang ramah dibaca manusia (contoh: *"Cibeureum, Kec. Cimahi Selatan, Kota Cimahi, Jawa Barat 40535"*), bukan lagi teks angka koordinat mentah.

---

#### 17.5.2 Analisis Kasus Search Bar Google Maps (Perbandingan dengan `admin-sunjaya`)
- **Pertanyaan / Isu Pengguna:**  
  *Kenapa saat search lokasi di maps dia tidak muncul dropdown autocomplete tempat seperti di project rujukan `admin-sunjaya` (`adminShuttleV3`)? Apakah kita harus membuat package, API, atau kredensial untuk Google Maps-nya? Dan bagaimana caranya?*
- **Hasil Review Teknis terhadap `admin-sunjaya` (`adminShuttleV3`):**  
  Pada proyek `adminShuttleV3` (file `public/js/apps/master-data/outlet-form.js`), form menggunakan pustaka eksternal resmi dari Google:
  ```html
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_KEY&libraries=places"></script>
  ```
  Dan diinisialisasi menggunakan widget bawaan Google:
  ```javascript
  autocomplete = new google.maps.places.Autocomplete(document.getElementById('search-map-input'), {
    componentRestrictions: { country: 'id' }
  });
  ```
  Dropdown melayang yang muncul saat mengetik di `admin-sunjaya` adalah **Google Places Autocomplete Widget** yang di-render langsung oleh script Google dari server Google Cloud.
- **Mengapa di Chenille Tidak Muncul Dropdown Tersebut Sebelumnya?**  
  1. Script Google Places Autocomplete **wajib memiliki `API KEY` Google Cloud**. Tanpa kunci API, Google memblokir script dengan galat `MissingKeyMapError` atau `ApiNotActivatedMapError` dan dropdown tidak akan pernah dirender.
  2. Di repositori `E-Comerce-BucketFlowers`, file `.env` belum memiliki environment variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

---

#### 17.5.3 Apakah Wajib Membuat Kredensial Google Maps?
- **Jawaban:**  
  - **Opsional tapi Sangat Direkomendasikan jika ingin hasil pencarian 100% identik dengan Google Maps & `admin-sunjaya`.**
  - Jika Anda memiliki Google Maps API Key, sistem Chenille Flowers akan otomatis mengaktifkan widget Google Places Autocomplete resmi (lengkap dengan database nama kafe, gedung kampus, ruko, perumahan di Indonesia).
  - Jika Anda **belum/tidak ingin membuat API Key Google**, sistem Chenille Flowers kini menyediakan **Smart Search Autocomplete Dropdown bawaan (Zero-Config Fallback)** yang tetap memunculkan dropdown saran nama tempat saat mengetik tanpa biaya dan tanpa perlu kartu kredit.
- **Biaya & Kuota Google Maps Platform:**  
  - Google memberikan **Kredit Gratis $200 USD (sekitar Rp 3.100.000,-) setiap bulan** untuk setiap akun Google Cloud.
  - Kuota gratis ini setara dengan:
    - **~28.000 kali pencarian autocomplete per bulan** (Places Autocomplete per request).
    - **~40.000 kali geocoding per bulan**.
  - Untuk kebutuhan operasional satu toko atelier bunga, penggunaan harian berkisar 10–50 pencarian/bulan, sehingga tagihannya **Rp 0 / 100% Bebas Biaya**.

---

#### 17.5.4 Panduan Step-by-Step Pembuatan Kredensial Google Maps API di Google Cloud Console

Berikut adalah panduan pembuatan API Key resmi untuk disematkan ke aplikasi:

```text
LANGKAH PEMBUATAN GOOGLE MAPS API KEY:

1. Buka Google Cloud Console:
   👉 https://console.cloud.google.com/
   Login menggunakan akun Google Anda.

2. Buat Project Baru:
   - Klik dropdown project di navigasi atas -> Klik "New Project".
   - Masukkan nama project, contoh: "Chenille-Atelier-Maps" -> Klik "Create".

3. Aktifkan Billing (Syarat Wajib Google Cloud):
   - Buka menu Billing -> Hubungkan metode pembayaran (Kartu Debit Visa/Mastercard atau Jenius/Jago/BCA Virtual).
   - Tenang, saldo tidak akan terpotong selama penggunaan masih di bawah kuota gratis $200/bulan.

4. Aktifkan 3 Library API yang Dibutuhkan:
   - Masuk ke menu "APIs & Services" -> "Library".
   - Cari dan klik "Enable" untuk 3 library berikut:
     a. Maps JavaScript API (untuk merender peta & marker interaktif).
     b. Places API (New) atau Places API (untuk dropdown autocomplete pencarian tempat).
     c. Geocoding API (untuk konversi nama jalan ke koordinat dan reverse geocoding).

5. Buat API Key:
   - Masuk ke menu "APIs & Services" -> "Credentials".
   - Klik "+ CREATE CREDENTIALS" -> Pilih "API key".
   - Kunci API akan dibuat, contoh: AIzaSyD9x8K2L0m1N-abcdef123456789.

6. Amankan API Key (Key Restrictions):
   - Klik nama API Key yang baru dibuat untuk masuk ke halaman edit.
   - Pada "Application restrictions", pilih "Websites" (HTTP referrers):
     Tambahkan URL aplikasi:
     - http://localhost:3000/*
     - https://*.vercel.app/*
     - https://domain-toko-anda.com/*
   - Pada "API restrictions", pilih "Restrict key":
     Centang hanya:
     - Maps JavaScript API
     - Places API
     - Geocoding API
   - Klik "Save".

7. Pasang API Key di Proyek Chenille Flowers:
   - Buka file .env dan .env.local di root proyek:
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyD9x8K2L0m1N-abcdef123456789"
```

---

#### 17.5.5 Arsitektur Dual-Engine / Hybrid Geocoding di Antarmuka Admin (`StoreSettingsView`)

Untuk memberikan pengalaman terbaik tanpa memblokir admin yang belum mendaftarkan API key, sistem mengadopsi pola arsitektur **Dual-Engine**:

```mermaid
graph TD
    A[Admin Mengetik di Search Box / Klik GPS] --> B{Apakah NEXT_PUBLIC_GOOGLE_MAPS_API_KEY Ada?}
    B -- Ya --> C[Engine 1: Google Places Autocomplete]
    C --> D[Render Dropdown Resmi Google Places]
    D --> E[Pilih Tempat -> Ambil geometry.location & formatted_address]
    
    B -- Tidak / Kunci Belum Ada --> F[Engine 2: Smart Search & Reverse Geocoding]
    F --> G[Debounce 300ms -> Panggil Photon / OpenStreetMap API]
    G --> H[Render Dropdown 5 Saran Lokasi Interaktif]
    H --> I[Pilih Tempat -> Update Koordinat & Nama Jalan]
    
    A2[Admin Klik 'Gunakan GPS Saya'] --> J[Browser Hardware GPS: lat, lon]
    J --> K[Reverse Geocoding Pipeline]
    K --> L[Konversi Koordinat ke Alamat Lengkap Fisik]
    L --> M[Isi Otomatis Field Alamat Fisik Workshop & Studio]
```

1. **Engine 1 (Google Places Autocomplete — Primary):**  
   Jika `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` terdefinisi, aplikasi secara dinamis memuat library `google.maps.places.Autocomplete` dan menempelkannya ke input `#search-map-input`. Event listener `place_changed` otomatis mengisi latitude, longitude, dan alamat lengkap format Google.
2. **Engine 2 (Smart Search Autocomplete Dropdown — Zero-Config Fallback):**  
   Jika API Key belum dipasang, sistem mengaktifkan komponen dropdown saran pencarian interaktif yang menembus server geocoding super cepat (Photon/OSM) dengan debounce 300ms. Admin mendapatkan tampilan popup daftar pilihan alamat dan landmark persis seperti widget Google.
3. **GPS Reverse Geocoding Handler:**  
   Tombol *"Gunakan GPS Saya"* sekarang memiliki status pemuatan (*loading indicator* 🛰️) dan otomatis memanggil reverse geocoder sehingga alamat workshop langsung tersimpan dalam format teks nama jalan yang representatif.

---

#### 17.5.6 Standar Baku Pemisahan Data: Alamat Fisik vs Koordinat Lat/Long (Konfirmasi & Kesepakatan Final)

Sesuai persetujuan arsitektur, seluruh penanganan geolokasi pada sistem Chenille Flowers wajib mematuhi pemisahan data (*data separation principle*):

1. **Kolom Alamat Fisik Workshop / Studio (`studio_address`):**
   - **Hanya menampung string teks alamat jalan riil yang bersih** yang dapat dibaca manusia (contoh: `Padasuka, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40552` atau `Jl. Margonda Raya No. 120, Beji, Depok`).
   - **DILARANG KERAS** menyisipkan atau mencampurkan angka koordinat mentah seperti `(-6.899755, 107.558353)` ke dalam teks alamat fisik.
2. **Kolom Khusus Koordinat Numerik (`latitude` & `longitude`):**
   - Ditempatkan pada elemen input kolom tersendiri (*dedicated inputs*) yang terpisah secara fisik dari kolom alamat.
   - Kolom `Latitude`: Nilai lintang desimal (contoh: `-6.899755`).
   - Kolom `Longitude`: Nilai bujur desimal (contoh: `107.558353`).
   - Digunakan murni untuk kalkulasi matematis geofencing, radius COD, dan pemosisian pin peta embed.
3. **Penanganan String Google Maps & Plus Code (`4GGF+V3M`):**
   - Saat mendeteksi teks alamat dari Google Maps atau Reverse Geocoding yang memuat Plus Code (seperti `4GGF+V3M, Padasuka...`), parser sistem mengekstrak entitas hierarki alamat wilayah Indonesia resmi:
     $$\text{[Nama Jalan / Area]}, \text{[Kelurahan]}, \text{Kec. [Kecamatan]}, \text{Kota [Kota]}, \text{[Provinsi]} \text{ [Kode Pos]}$$
   - Format ini menjamin keseragaman dan kerapian saat dicetak pada faktur invoice, label paket buket, dan kartu ucapan.

---

#### 17.5.7 Matriks Notulensi Tanya-Jawab & Konsensus Pra-Development (Q&A Blueprint)

Sub-seksi ini merangkum seluruh butir diskusi dan tanya-jawab krusial antara stakeholder/pengguna dan arsitek sistem sebelum tahap implementasi kode:

| No | Butir Pertanyaan Stakeholder / Pengguna | Jawaban Pasti & Solusi Arsitektur | Status Desain |
| :---: | :--- | :--- | :---: |
| **Q1** | *Kenapa saat menggunakan GPS dia hanya menyimpan angka latitude & longitude saja di kolom alamat?* | **Penyebab:** Sensor GPS browser (`navigator.geolocation`) hanya menghasilkan angka koordinat satelit mentah, bukan nama jalan.<br>**Solusi:** Diintegrasikan pipeline **Reverse Geocoding** (OSM Nominatim) yang otomatis menerjemahkan angka koordinat menjadi teks alamat fisik manusiawi dalam hitungan milidetik. | ✅ **Resmi Disepakati** |
| **Q2** | *Apakah kita wajib membuat package/API/kredensial Google Maps, dan bagaimana caranya jika tidak punya kartu debit/kredit?* | **Solusi Cardless 100% Bebas Biaya:** **TIDAK PERLU KARTU DEBIT/KREDIT.** Sistem menggunakan engine geocoding terbuka (OpenStreetMap & Komoot Photon) yang legal, gratis tanpa batas kuota, dan tanpa perlu mendaftar kartu bank. Namun jika suatu saat pengguna ingin beralih ke Google Maps resmi, sistem sudah siap pakai melalui arsitektur *Hybrid Dual-Engine* (Seksi 17.5.4). | ✅ **Resmi Disepakati** |
| **Q3** | *Bagaimana agar saat pencarian muncul floating dropdown saran tempat persis seperti sistem rujukan `admin-sunjaya`?* | **Implementasi UI/UX:** Input pencarian dilengkapi *debounce* 300ms. Saat mengetik nama jalan/kota (cth: "Padasuka", "Cimahi", "Margonda"), **floating dropdown melayang dengan pin lokasi merah 📍** akan muncul di bawah input secara real-time, lengkap dengan nama tempat tebal, deskripsi alamat, dan tombol *[Jadikan Alamat Studio]* persis seperti `admin-sunjaya`. | ✅ **Resmi Disepakati** |
| **Q4** | *Apakah alamat string seperti `4GGF+V3M, Padasuka, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40552` otomatis diambil jadi Alamat Fisik Workshop?* | **Jawaban: 100% BISA & PASTI.** Saat memilih dari dropdown saran pencarian atau setelah Reverse Geocoding GPS selesai, seluruh rangkaian teks alamat tersebut langsung disuntikkan ke kolom form **"Alamat Fisik Workshop / Studio"** (`studio_address`). | ✅ **Resmi Disepakati** |
| **Q5** | *Apakah Latitude dan Longitude dimuat pada kolom elemen baru tersendiri agar tidak masuk/bercampur ke dalam teks alamat?* | **Jawaban: 100% BISA & PASTI.** Disediakan **dua kolom elemen input baru khusus** di bawah peta kanvas:<br>1. Kolom Input `Latitude` (khusus desimal lintang, cth: `-6.899755`)<br>2. Kolom Input `Longitude` (khusus desimal bujur, cth: `107.558353`)<br>Teks alamat fisik murni hanya berisi nama jalan tanpa angka koordinat mentah. | ✅ **Resmi Disepakati** |

##### 1. Rancangan Visual Form Pengaturan Toko (`SettingsView`)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 📍 LOKASI WORKSHOP & ORIGIN GEOFENCING ATELIER                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│ 1. [ KOLOM ALAMAT FISIK UTAMA (TEXT STRING BERSIH) ]                                            │
│    Alamat Fisik Workshop / Studio:                                                              │
│    ┌───────────────────────────────────────────────────────────────────────────────────────┐    │
│    │ 4GGF+V3M, Padasuka, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40552                 │    │
│    └───────────────────────────────────────────────────────────────────────────────────────┘    │
│    *Catatan: Murni berisi teks nama jalan/kelurahan/kota. Tanpa angka koordinat mentah!         │
│                                                                                                 │
│ 2. [ TOOLBAR PENCARIAN TEMPAT DENGAN FLOATING DROPDOWN ALA ADMIN-SUNJAYA ]                      │
│    Cari Lokasi / Nama Tempat:                                                                   │
│    ┌───────────────────────────────────────────────────────────────────┐ ┌────────────────┐     │
│    │ 🔍 Padasuka Cimahi...                                             │ │ 🛰️ Gunakan GPS │     │
│    └───────────────────────────────────────────────────────────────────┘ └────────────────┘     │
│    │                                                                   │                        │
│    ├───────────────────────────────────────────────────────────────────┤                        │
│    │ 📍 Padasuka                                                       │                        │
│    │    Kecamatan Cimahi Tengah, Kota Cimahi, Jawa Barat 40552         │                        │
│    │    [Badge: Kota Cimahi]                              [📋 Pilih]   │                        │
│    ├───────────────────────────────────────────────────────────────────┤                        │
│    │ 📍 Jl. Padasuka Indah                                             │                        │
│    │    Kelurahan Padasuka, Cimahi Tengah, Kota Cimahi                 │                        │
│    │    [Badge: Jawa Barat]                               [📋 Pilih]   │                        │
│    └───────────────────────────────────────────────────────────────────┘                        │
│                                                                                                 │
│ 3. [ KANVAS PETA INTERAKTIF / GOOGLE MAPS EMBED ]                                               │
│    ┌───────────────────────────────────────────────────────────────────────────────────────┐    │
│    │                                                                                       │    │
│    │                           📍 [PIN DRAGGABLE WORKSHOP]                                 │    │
│    │                             Padasuka, Cimahi Tengah                                   │    │
│    │                                                                                       │    │
│    │   [🔵 Lingkaran Geofencing Radius Bebas COD: 5.0 KM dari Titik Workshop]              │    │
│    │                                                                                       │    │
│    └───────────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                                 │
│ 4. [ DUA ELEMEN KOLOM BARU KHUSUS KOORDINAT (SEPARATED INPUTS) ]                                │
│    ┌───────────────────────────────────┐     ┌───────────────────────────────────┐              │
│    │ Latitude (Lintang Desimal):       │     │ Longitude (Bujur Desimal):        │              │
│    │ ┌───────────────────────────────┐ │     │ ┌───────────────────────────────┐ │              │
│    │ │ -6.899755                     │ │     │ │ 107.558353                    │ │              │
│    │ └───────────────────────────────┘ │     │ └───────────────────────────────┘ │              │
│    └───────────────────────────────────┘     └───────────────────────────────────┘              │
│                                                                                                 │
│ 5. [ BATAS RADIUS & LINK GOOGLE MAPS ]                                                          │
│    ┌───────────────────────────────────┐     ┌───────────────────────────────────┐              │
│    │ Radius Bebas Ongkir COD (KM):     │     │ Link Tautan Google Maps Studio:   │              │
│    │ ┌───────────────────────────────┐ │     │ ┌───────────────────────────────┐ │              │
│    │ │ 5.0                           │ │     │ │ https://maps.google.com/?q=...│ │              │
│    │ └───────────────────────────────┘ │     │ └───────────────────────────────┘ │              │
│    └───────────────────────────────────┘     └───────────────────────────────────┘              │
│                                                                                                 │
│ [ 💾 SIMPAN PERUBAHAN PENGATURAN TOKO ]                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

##### 2. Spesifikasi Alur Kerja Teknis Saat Tombol "Gunakan GPS" Diklik
1. Event click memicu `handleUseCurrentLocation()`.
2. Tombol beralih ke state `loading` dengan indikator berputar `🛰️ Mendeteksi Satelit...`.
3. Browser membaca lintang desimal (`coords.latitude`) dan bujur desimal (`coords.longitude`).
4. Nilai lintang langsung masuk ke kolom state `formProfile.latitude` (`-6.899755`).
5. Nilai bujur langsung masuk ke kolom state `formProfile.longitude` (`107.558353`).
6. Secara paralel, sistem memanggil URL endpoint:
   `https://nominatim.openstreetmap.org/reverse?format=json&lat=-6.899755&lon=107.558353&addressdetails=1`
7. Data respons diekstrak menjadi string alamat yang rapi (misal: `Padasuka, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40552`).
8. String alamat tersebut langsung dimasukkan ke `formProfile.studioAddress`.
9. Sistem memicu notifikasi toast Magic UI: `📍 Lokasi GPS Terdeteksi! Padasuka, Cimahi Tengah`.

---

### 17.6 Standardisasi Ekosistem Maps: Form "Daftarkan Titik COD Baru via Google Maps" (`CODMapModal.tsx`)

Prinsip Smart Autocomplete tanpa kartu kredit (`admin-sunjaya`) dan pemisahan alamat vs koordinat diperluas secara menyeluruh ke formulir pendaftaran titik temu COD (`CODMapModal.tsx`).

#### 17.6.1 Latar Belakang & Kebutuhan Fitur
Sebelumnya, formulir modal *"Daftarkan Titik COD Baru via Google Maps"* hanya mendukung deteksi pasif via paste URL tautan Google Maps (`https://maps.app.goo.gl/...`) atau pemilihan chip preset. Jika admin ingin mendaftarkan titik baru di luar preset, admin harus membuka aplikasi Google Maps secara terpisah, mencari tempat, menyalin link, lalu menempelkannya kembali.

Dengan pembaruan ini, antarmuka pendaftaran titik COD dilengkapi fitur **Smart Live Autocomplete Search** yang mandiri langsung di dalam modal.

#### 17.6.2 Spesifikasi Komponen & Alur Interaksi (`CODMapModal.tsx`)

```mermaid
flowchart TD
    A["Admin Mengetik di Input Pencarian Titik COD"] --> B{"Apakah Teks Berupa Link atau Nama Tempat?"}
    
    B -- "Tautan Google Maps (maps.app.goo.gl)" --> C["Ekstrak Koordinat dari URL / Redirection"]
    C --> G["Isi Data Titik COD"]
    
    B -- "Nama Tempat / Jalan (cth: 'Margo City', 'Stasiun Cimahi')" --> D["Debounce 300ms -> Panggil Komoot Photon / OSM Engine"]
    D --> E["Munculkan Floating Dropdown Saran Tempat 📍"]
    E --> F["Admin Klik Salah Satu Saran Tempat"]
    
    F --> G["1. Nama Titik: Terisi Nama Tempat (cth: 'Margo City')
2. Alamat Lengkap: Terisi String Alamat Bersih (tanpa angka koordinat)
3. Kolom Latitude & Longitude: Terisi Nilai Desimal di Input Terpisah
4. Pin Peta Kanvas: Snap Otomatis ke Titik Koordinat
5. Jarak KM: Dihitung Otomatis dari Atelier (Formula Haversine)
6. Link Maps: Terisi URL Navigasi Google Maps Resmi"]
```

1. **Smart Live Autocomplete Search Box:**
   - Input pencarian dilengkapi debounce 300ms dan indikator status pencarian.
   - Menampilkan dropdown melayang (*floating suggestions dropdown*) dengan:
     - Ikon pin merah 📍
     - Nama tempat tebal (*bold place name*)
     - Subtitle alamat lengkap jalan
     - Badge kota (*city tag*)
   - Bekerja 100% tanpa kartu debit/kredit menggunakan engine geocoder Photon/OSM, dengan fallback otomatis ke Google Places jika kredensial Google API terpasang.
2. **Pemisahan Kolom Elemen Baru (Latitude & Longitude):**
   - Modal pendaftaran titik COD menyediakan elemen input kolom terpisah khusus untuk **Latitude** dan **Longitude**.
   - Input **Alamat Lengkap Google Maps** murni hanya menampung nama jalan dan area, bebas dari teks `(Koordinat: -6.xxx, 106.xxx)`.
3. **Peta Kanvas Interaktif & Reverse Geocoding:**
   - Saat admin menggeser pin marker (*drag & drop pin*) pada peta kanvas interaktif, posisi pin mengkalkulasi koordinat baru.
   - Reverse geocoder otomatis mengubah posisi pin menjadi nama jalan/area yang ramah dibaca manusia tanpa mengotori kolom alamat dengan angka koordinat mentah.
4. **Sinkronisasi Multi-Input (Link, Search, Pin, & Preset):**
   - Formulir mendukung 4 cara fleksibel penentuan lokasi:
     1. Mengetik nama tempat pada search bar (Autocomplete).
     2. Menempelkan link Google Maps (`https://maps.app.goo.gl/...` atau URL koordinat).
     3. Menggeser atau mengklik langsung pada kanvas peta interaktif.
     4. Memilih *Preset Populer* yang sudah disediakan (Gerbatama UI, Margo City, Stasiun Pocin, dll).

---

### 17.7 Analisis "Faktor X", Keterbatasan Basis Data OpenStreetMap vs Google Places, & Arsitektur Deep URL Parser

#### 17.7.1 Analisis Tiga "Faktor X" Pencarian Lokasi
1. **Faktor X #1: Kesenjangan Database OpenStreetMap vs Google Maps Business:**
   - Mesin pencari gratis OpenStreetMap (OSM / Photon) berbasis kontribusi relawan dan kartografi terbuka. OSM fokus pada topografi, jalan raya, perumahan, kelurahan, stasiun, rumah sakit, dan pusat perbelanjaan besar.
   - UMKM mikro Indonesia (seperti konter pulsa *ASK CELL CIMINDI*, warteg, bengkel las, kios fotokopi) **tidak terdaftar di OpenStreetMap**.
   - Sebaliknya, Google Maps memiliki program *Google Bisnisku (Google My Business)* di mana pemilik konter HP mendaftarkan usahanya langsung ke server Google. Ketika mencari *"ask cell cimindi"*, Google Maps memilikinya, sedangkan OSM yang tidak menemukannya akan mencari kata kunci *"cell"* yang ada di database OSM Indonesia (seperti toko *DEKA CELL*, *LIU CELL* di Cilincing, Jakarta).
2. **Faktor X #2: Rahasia Sistem `admin-sunjaya`:**
   - Sistem `admin-sunjaya` menggunakan widget **Google Places Autocomplete** resmi (terbukti dari badge watermark *`powered by Google`* di pojok kanan bawah dropdown).
   - Widget Google Places ini mewajibkan pemanggilan library JavaScript Google dengan API Key aktif. Pada proyek `admin-sunjaya` (`adminShuttleV3`), kunci ini sudah terkonfigurasi pada file `.env`.
3. **Faktor X #3: Masalah Ekstraksi Link Google Maps Lama:**
   - Sebelumnya, ketika admin menempelkan tautan Google Maps panjang (`https://www.google.com/maps/place/ASKCELL+CIMINDI2...`), sistem hanya mencocokkan string `if (input.includes('google.com/maps'))` dan langsung mengisi data statis generic (*"Titik Temu Google Maps 7"* dan *"Alamat spesifik terverifikasi..."*).
   - Parser lama tidak membaca token `/place/<NAME>/`, tidak membaca koordinat target pin `!3d` & `!4d`, dan tidak memicu Reverse Geocoding.

#### 17.7.2 Solusi Cerdas: Deep Google Maps URL Parser & Automated Reverse Geocoder

Untuk memberikan akurasi 100% tanpa bergantung pada API Key berbayar, Chenille Flowers mengimplementasikan arsitektur **Deep Google Maps URL Parser**:

```mermaid
flowchart TD
    A["Admin Tempel Link Google Maps Lengkap"] --> B["Deep URL Parser Engine"]
    
    B --> C["Ekstrak Nama Tempat dari Token /place/NAME/
    -> decodeURIComponent & buang simbol +
    Contoh: 'ASKCELL CIMINDI2 JL RAYA CIMINDI NO 193 BAWAH FLYOVER CIMINDI'"]
    
    B --> D["Ekstrak Koordinat Presisi Target Pin:
    1. Prioritas Utama: Token !3d(lat) & !4d(lng) (Posisi Pin Bisnis Akurat)
    2. Prioritas Kedua: Query Params ?q=lat,lng
    3. Prioritas Ketiga: Viewport Center @lat,lng"]
    
    D --> E["Panggil Reverse Geocoder Nominatim (Accept-Language: id)"]
    
    E --> F["Ekstraksi Hierarki Alamat Wilayah Resmi:
    - Jalan / Road
    - Kelurahan / Desa (Village)
    - Kecamatan (District)
    - Kota / Kabupaten
    - Provinsi
    - Kode Pos"]
    
    C & F --> G["Auto-Populate Form Kolom:
    - Nama Titik: 'ASKCELL CIMINDI2 JL RAYA CIMINDI NO 193 BAWAH FLYOVER CIMINDI'
    - Alamat Lengkap: 'Jl. Raya Cimindi bawah No.193, Flyover Cimindi, Cibeureum, Kota Cimahi, Jawa Barat 40531'
    - Latitude: -6.897109 (Kolom Terpisah)
    - Longitude: 107.560783 (Kolom Terpisah)
    - Link Maps: Tautan Asli Google Maps
    - Catatan: 'Janji serah terima buket di lobi depan / pintu masuk ASKCELL CIMINDI2'
    - Pratinjau Peta: Langsung memusatkan pin ke koordinat presisi"]
```

Arsitektur ini diimplementasikan serempak pada:
- `apps/web/src/components/admin/CODMapModal.tsx` (`detectGoogleMapsInput`)
- `apps/web/src/components/admin/AdminViews.tsx` (`handleSearchLocation`)

---

### 17.8 Arsitektur Peta Interaktif (Interactive Explore Canvas, Draggable Pin & Auto-Geocoding) — v2.6

#### 17.8.1 Latar Belakang Kebutuhan Bisnis
Sebelumnya, pratinjau peta hanya berupa tag `<iframe>` embed Google Maps statis (`https://maps.google.com/maps?q=...&output=embed`). Pada Google Maps iframe embed:
1. **Tidak Bisa Geser Pin (Non-Draggable):** Pengguna tidak dapat memindahkan pin merah ke gang, ruko, atau patokan spesifik.
2. **Tidak Bisa Klik Peta untuk Set Lokasi:** Akibat proteksi keamanan browser *Cross-Origin / Same-Origin Policy*, website induk dilarang mendengarkan event mouse klik atau mengambil koordinat di dalam iframe domain Google.
3. **Ketergantungan API Key Berbayar Google Maps:** Google Maps JavaScript SDK resmi memerlukan aktivasi Google Cloud Billing dengan kartu debit/kredit, yang sering terkendala error penolakan bank lokal (*OR_BACR2_59*) atau kuota API.

#### 17.8.2 Solusi Teknis: Komponen `InteractiveMapPicker.tsx` (Leaflet + OpenStreetMap + Esri Satellite)
Untuk menghadirkan pengalaman visual kelas dunia tanpa biaya dan tanpa API key, Chenille Flowers membangun komponen khusus `InteractiveMapPicker.tsx` dengan fitur:

1. **Explore View Bebas Jelajah:**
   - Rendering kanvas peta interaktif berbasis OpenStreetMap dan Esri World Imagery (Satelit).
   - Pengguna bebas menggeser (*pan*), memperbesar/memperkecil (*zoom*) dengan roda scroll mouse atau tombol kontrol `[➕]` dan `[➖]`.
   - Tombol pengalih layer **`[Satelit]`** vs **`[Jalan]`** untuk melihat foto citra satelit nyata bangunan fisik.
   - Tombol **`[🧭 Pusatkan]`** untuk mengembalikan viewport ke pin aktif.
   - Tombol **`[🎯 GPS Saya]`** untuk melompat langsung ke lokasi sensor perangkat admin via HTML5 Geolocation API.
2. **Set Pin Fleksibel (Drag & Drop + Click to Drop):**
   - Menggunakan pin kustom merah SVG teardrop persis estetika Google Maps dengan efek drop shadow dan visual bounce.
   - Admin dapat **menarik dan melepas pin** langsung di atas peta (`marker.on('dragend')`).
   - Admin dapat **mengklik di mana saja pada peta** (`map.on('click')`), dan pin merah langsung melompat ke titik yang diklik.
3. **Automated Reverse Geocoding & Field Sync:**
   - Setiap kali pin berpindah, sistem secara otomatis mengeksekusi reverse geocoding via Nominatim OpenStreetMap (`https://nominatim.openstreetmap.org/reverse`) dengan bahasa Indonesia.
   - Hierarki alamat resmi diekstrak bersih: Nama Jalan, Kelurahan/Desa, Kecamatan, Kota/Kabupaten, Provinsi, Kode Pos.
   - Mengisi otomatis kolom formulir secara terpisah tanpa tercampur:
     - Field `Alamat Fisik Workshop / Studio`: Hanya teks alamat jalan resmi yang bersih.
     - Field `Latitude`: Khusus angka koordinat lintang desimal.
     - Field `Longitude`: Khusus angka koordinat bujur desimal.
     - Field `mapsLink`: Tautan navigasi instan Google Maps (`https://maps.google.com/?q=lat,lng`).
4. **Visualisasi Radius Geofencing COD 5 KM Real-Time:**
   - Menggambar lingkaran radius transparan merah (`L.circle`) di sekeliling pin workshop untuk memastikan titik temu pelanggan berada dalam zona gratis COD (maksimal 5.0 KM).
5. **Penerapan Dual-Engine & Dual-View:**
   - Tersedia tombol tab beralih: `[ 📍 Peta Interaktif (Geser & Set Pin) ]` (default aktif) dan `[ 🗺️ Tampilan Google Maps Embed ]`.
   - Diterapkan secara serempak pada:
     - **Menu Pengaturan Toko** (`apps/web/src/components/admin/AdminViews.tsx`)
     - **Menu Titik Temu COD Maps** (`apps/web/src/components/admin/CODMapModal.tsx`)

---

### 17.9 Arsitektur Persistensi Navigasi Menu Admin (Anti-Reset on Refresh)

#### 17.9.1 Masalah Pengguna
Sebelumnya, ketika admin sedang bekerja di menu tertentu (misalnya menu **Pengaturan Toko**, **Titik Temu COD**, **Pesanan**, **Katalog Produk**, atau **BOM Kalkulator**), setiap kali admin menekan tombol refresh browser (`F5` atau `Ctrl+R`), halaman selalu me-reset active tab kembali ke tampilan awal `DASHBOARD`. Hal ini mengurangi efisiensi kerja admin karena harus mengklik ulang menu dari sidebar.

#### 17.9.2 Solusi Dual-Sync Navigation (URL Query + LocalStorage + PopState)
Chenille Flowers mengimplementasikan arsitektur navigasi persisten multi-layer pada `apps/web/src/app/admin/page.tsx`:

```mermaid
flowchart TD
    A["Admin Klik Menu di Sidebar / Header
    (Misal: Pengaturan Toko)"] --> B["Fungsi setActiveTab('SETTINGS')"]
    
    B --> C["1. Update React State (activeTabState)"]
    B --> D["2. Simpan ke LocalStorage:
    localStorage.setItem('chenille_admin_active_tab', 'SETTINGS')"]
    B --> E["3. Sinkronisasi URL Address Bar:
    window.history.replaceState(null, '', '/admin?tab=SETTINGS')"]
    
    F["Admin Menekan Tombol Refresh (F5 / Ctrl+R)"] --> G["Komponen AdminPage Mount (useEffect)"]
    
    G --> H{"Evaluasi Prioritas Tab Terpilih:"}
    H -->|Prioritas 1: URL Query Param| I["Baca ?tab=SETTINGS dari window.location.search"]
    H -->|Prioritas 2: URL Hash| J["Baca #SETTINGS dari window.location.hash"]
    H -->|Prioritas 3: LocalStorage| K["Baca localStorage.getItem('chenille_admin_active_tab')"]
    H -->|Fallback Default| L["Tab DASHBOARD"]
    
    I & J & K --> M["Validasi terhadap Daftar Menu Resmi (VALID_TABS)"]
    M --> N["Pulihkan Menu Aktif Instan Tanpa Flicker
    (Admin Langsung Berada di Menu Pengaturan Toko)"]
    
    O["Admin Menggunakan Tombol Back / Forward Browser"] --> P["Event Listener 'popstate'
    Mendeteksi Perubahan Query ?tab=... & Mengupdate Tab Otomatis"]
```

#### 17.9.3 Keunggulan Arsitektur Persistensi Ini:
1. **Anti-Reset:** Refresh halaman tidak akan pernah melempar admin kembali ke Dashboard jika sedang membuka menu lain.
2. **Shareable & Bookmarkable URL:** Admin dapat mem-bookmark atau membagikan tautan langsung ke tab tertentu (misal: `http://localhost:3000/admin?tab=SETTINGS` atau `http://localhost:3000/admin?tab=COD_MAPS`).
3. **Browser History Support:** Tombol Back `[⬅️]` dan Forward `[➡️]` pada browser berfungsi mulus berpindah antar-tab admin tanpa perlu full page reload.
4. **Hydration-Safe:** Tidak memicu hydration mismatch atau flickering berkat pengecekan `typeof window !== 'undefined'` dan verifikasi `VALID_TABS`.

---

### 17.10 Arsitektur Manajemen Pengguna, Sesi 15-Menit Inactivity Timeout & Audit Log — v2.7

#### 17.10.1 Root Cause Kasus Auto-Login "Ahmad" di Landing Page
Berdasarkan investigasi menyeluruh pada arsitektur state management frontend:
1. **Penyebab Utama:**
   - Pada file `apps/web/src/stores/useAuthStore.ts`, state default awal sebelumnya terdefinisi dengan `user: DEFAULT_MEMBER` dan `isAuthenticated: true`.
   - Ketika pengguna pernah menguji login akun Super Admin (`DEFAULT_ADMIN` yang bernama *"Ahmad Arif (Owner Atelier)"*), Zustand middleware `persist` menyimpan objek tersebut ke dalam `localStorage['chenille_auth_storage']`.
   - Ketika pengguna membuka Landing Page (`/`), komponen `Navbar.tsx` membaca `user` dari `useAuthStore` dan mendapati nama *"Ahmad Arif"*, sehingga langsung merender profil avatar Ahmad Arif dengan mahkota 👑 seolah-olah sudah login.
2. **Solusi Definitif (Zero-State Guest Principle):**
   - Mengubah initial state `useAuthStore` menjadi murni tamu: `user: null` dan `isAuthenticated: false`.
   - Mengintegrasikan hook `onRehydrateStorage` pada Zustand: jika data yang tersimpan di `localStorage` tidak memiliki stempel aktivitas atau stempel aktivitasnya sudah lewat dari 15 menit, sistem secara otomatis membersihkan sesi menjadi `null` (*auto-expire*).
   - Pengunjung publik yang membuka Landing Page kini 100% selalu berstatus **Tamu (Guest)** dengan tombol **"Masuk"**, tanpa pernah ada akun yang login secara otomatis.

---

#### 17.10.2 Mekanisme Proteksi Sesi: 15-Minute Inactivity Auto-Logout
Untuk memenuhi standar kepatuhan keamanan e-commerce enterprise dan proteksi privasi pelanggan/admin pada perangkat publik (misal laptop kasir atau ponsel bersama):

1. **Aturan Bisnis:**
   - Sesi pengguna (baik Admin maupun Member Pelanggan) hanya bertahan selama pengguna **aktif berinteraksi**.
   - Jika pengguna **tidak melakukan aktivitas apa pun selama 15 menit** berturut-turut, sistem wajib melakukan **Auto-Logout**.
2. **Arsitektur Teknis (`SessionTimeoutWatcher.tsx`):**
   - **Deteksi Interaksi User (DOM Events):** Memantau event `mousedown`, `keydown`, `scroll`, `touchstart`, dan `mousemove` (dibatasi/throttled setiap 4 detik untuk performa rendering ringan).
   - **Cross-Tab Synchronization:** Setiap ada interaksi, stempel waktu `Date.now()` dicatat di memori React dan `localStorage['chenille_last_activity']`, sehingga aktivitas di satu tab browser akan otomatis memperpanjang sesi di tab browser lainnya.
   - **Peringatan 60 Detik Terakhir (Countdown Banner):** Ketika waktu tidak aktif tersisa $\le 60$ detik (menit ke-14), muncul floating banner interaktif di pojok kanan bawah dengan countdown detik dan tombol `[Tetap Masuk (Perpanjang)]`.
   - **Eksekusi Auto-Logout (Menit ke-15):**
     - Sesi di-logout seketika via `logout('TIMEOUT_15MIN')`.
     - Muncul modal notifikasi khusus *"Sesi Berakhir (15 Menit Tidak Aktif) ⏳"*.
     - Jika pengguna berada di dalam panel admin (`/admin`), sistem langsung me-redirect ke `/login?reason=timeout`.
     - Tercatat otomatis ke dalam log audit dengan tipe event `LOGOUT_TIMEOUT_15MIN`.

```mermaid
flowchart TD
    A["User Berinteraksi (Klik, Ketik, Scroll, Sentuh)"] --> B["Throttled Activity Tracker (4s)"]
    B --> C["Update lastActivity = Date.now()
    & Sync localStorage['chenille_last_activity']"]
    
    D["Watcher Interval Checker (Setiap 2.5s)"] --> E{"Hitung Durasi Inaktif (elapsed):
    now - lastActivity"}
    
    E -->|< 14 Menit| F["Sesi Normal & Aman"]
    E -->|14 - 15 Menit| G["Tampilkan Warning Countdown Banner:
    'Sesi berakhir dalam X detik'
    Tombol: [Tetap Masuk]"]
    
    G -->|User Klik 'Tetap Masuk'| B
    
    E -->|>= 15 Menit (900.000 ms)| H["EKSEKUSI AUTO-LOGOUT 15 MENIT:
    1. Panggil logout('TIMEOUT_15MIN')
    2. Catat Audit Log: LOGOUT_TIMEOUT_15MIN
    3. Hapus Kredensial di LocalStorage
    4. Tampilkan Modal Notifikasi Keamanan
    5. Jika di /admin -> Redirect ke /login?reason=timeout"]
```

---

#### 17.10.3 Menu Pengawasan Pengguna & Audit Log (Active Sessions & Audit Trail)
Menerapkan sistem pengawasan terpusat pada menu **Pengguna & Log Sesi** (`/admin?tab=USERS`):

1. **4 Kartu Metrik KPI Pengguna:**
   - **Total Akun Terdaftar:** Menghitung seluruh akun Super Admin, Staff Florist, dan Member Pelanggan.
   - **Sedang Online (Live Sessions):** Indikator real-time dengan animasi titik hijau berkedip 🟢 untuk akun yang berinteraksi dalam 15 menit terakhir.
   - **Login Hari Ini:** Jumlah total sesi login sukses sepanjang hari berjalan.
   - **Auto-Timeout 15 Menit:** Jumlah sesi yang diamankan secara otomatis oleh sistem karena tidak aktif.
2. **Tab 1: Manajemen Akun & Sesi Aktif:**
   - Tabel direktori pengguna lengkap:
     - Avatar emoji, Nama Pengguna, Alamat Email, Nomor WhatsApp.
     - Badge Peran: `👑 SUPER ADMIN`, `🌷 STAFF FLORIST`, `🌸 MEMBER`.
     - Status Sesi: `🟢 Online Sekarang` vs `⚪ Offline`.
     - Informasi Perangkat & IP: e.g. *Windows 11 • Chrome 128 (180.252.164.21)* atau *iPhone 15 • Safari Mobile*.
     - Waktu Terakhir Aktif.
     - **Aksi Keamanan Admin:**
       - `[Tendang Sesi 🛑]`: Fitur *Force Logout* untuk memutuskan sesi pengguna secara paksa jika terdeteksi aktivitas mencurigakan.
       - `[Kirim Link Reset Kata Sandi 🔑]`: Mengirimkan token reset password langsung ke nomor WhatsApp akun.
       - `[Kunci / Buka Akun 🔒]`: Membekukan akun pengguna seketika.
3. **Tab 2: Log Audit Keluar-Masuk Real-Time (Live Stream):**
   - Menampilkan kronologi seluruh aktivitas autentikasi:
     - `🟢 LOGIN_SUCCESS`: Login berhasil (beserta nama, peran, IP, dan perangkat).
     - `🟡 LOGOUT_TIMEOUT_15MIN`: Sesi ditutup otomatis setelah 15 menit tanpa interaksi.
     - `⚪ LOGOUT_MANUAL`: Pengguna mengklik tombol Keluar secara mandiri.
     - `🛑 FORCE_LOGOUT_ADMIN`: Sesi diputus paksa oleh administrator.
     - `⚠️ LOGIN_FAILED`: Percobaan autentikasi gagal.
   - Fitur Filter Log: Berdasarkan tipe event dan pencarian nama/IP.
   - Fitur **Ekspor CSV**: Mengunduh seluruh rekap riwayat log audit untuk kebutuhan pelaporan keamanan berkala.

---

### 17.11 Aturan Baku Rekayasa & Adopsi Sistem Referensi (Reference Adaptation, Core Logic & Brand Decoupling Rules) — v2.8

#### 17.11.1 Latar Belakang & Filosofi Aturan
Dalam pengembangan perangkat lunak tingkat lanjut (enterprise), tim pengembang sering kali mempelajari arsitektur dari project rujukan/benchmark eksternal (seperti sistem otomasi transportasi, sistem logistik, atau dashboard POS). Hal ini sangat bernilai untuk meneliti praktik terbaik (*best practices*) seperti algoritma geocoding, mekanisme penguncian sesi, dan alur audit trail.

Namun, **terdapat batasan tegas antara adopsi arsitektur dengan identitas produk**:
> [!IMPORTANT]
> **ATURAN WAJIB PENGEMBANGAN (MANDATORY RULE):**
> Ketika mengadopsi fitur dari project referensi, **HANYA core logic, business logic, arsitektur data, dan application flow yang diadopsi**.
> **DILARANG KERAS** memunculkan nama, label, watermark, badge, atau istilah project referensi ke dalam antarmuka visual (UI) pengguna/admin. Antarmuka harus 100% orisinil, profesional, dan berakar murni pada identitas brand **Chenille Flowers Atelier**.

---

#### 17.11.2 4 Pilar Pedoman Adopsi Referensi

```mermaid
flowchart LR
    subgraph Referensi["Project Referensi (Contoh: admin-sunjaya / adminShuttleV3)"]
        R1["Core Logic & Algoritma (Haversine, Geocoding)"]
        R2["Application Flow (Autocomplete Dropdown, 15M Inactivity)"]
        R3["Data Struktur Referensi (Outlets, Bus, Armada)"]
        R4["Label / Brand Referensi ('Sunjaya', 'admin-sunjaya')"]
    end

    subgraph Filter["Proses Rekayasa & Decoupling Antigravity"]
        F1["Ambil & Terapkan Logic"]
        F2["Ambil & Terapkan User Flow"]
        F3["Adaptasi & Transformasi Data Model 100%"]
        F4["BLOCK & ELIMINATE DARI UI (Strict Zero Reference Label)"]
    end

    subgraph Hasil["Sistem Chenille Flowers Atelier (Hasil Akhir)"]
        H1["Smart Live Geocoding & Dynamic Radius 5 KM"]
        H2["Inactivity Session Watcher 15 Menit & Audit Trail"]
        H3["Model Data Spesifik: Buket Bunga Kawat Bulu, BOM, Kuota PO"]
        H4["UI Bersih, Elegan, Orisinil (100% Chenille Atelier Branding)"]
    end

    R1 --> F1 --> H1
    R2 --> F2 --> H2
    R3 --> F3 --> H3
    R4 --> F4 --> H4
```

1. **Pilar 1: Yang Diadopsi (The "What"):**
   - **Core Logic:** Logika matematika & komputasi (contoh: kalkulasi radius Haversine jarak bebas ongkir, reverse geocoding dari koordinat GPS ke teks jalan).
   - **Business Flow:** Alur kerja sistem (contoh: dropdown saran tempat melayang saat mengetik, pemisahan nilai alamat string vs latitude/longitude, auto-logout 15 menit jika tanpa interaksi).
   - **Security Pattern:** Pola keamanan enterprise (contoh: audit trail pencatatan aktivitas keluar-masuk, force logout / kick session oleh admin).

2. **Pilar 2: Yang Disesuaikan 100% (The Data Adaptation):**
   - Seluruh data model, skema database, dan terminologi disesuaikan sepenuhnya dengan proses bisnis **Buket Bunga Kawat Bulu**:
     - *Bukan* outlet tiket shuttle/bus, melainkan **Studio Atelier & Titik Temu COD Kampus UI/Margonda**.
     - *Bukan* kapasitas kursi penumpang, melainkan **Batas Kuota Pemesanan Harian PO Buket Kawat Bulu (Max 15 Bucket/Hari)**.
     - *Bukan* manifes armada, melainkan **Resep Bahan Baku Bill of Materials (BOM kawat bulu, kain wrapping, pita satin)**.
     - *Bukan* supir/agen, melainkan **Super Admin (Owner Atelier), Staff Florist (Pengrajin), dan Member Pelanggan**.

3. **Pilar 3: Strict Zero Reference Labeling pada UI (The Brand Decoupling):**
   - Setiap teks, badge, judul menu, subtitle, dan modal pada antarmuka frontend **wajib bersih dari nama sistem referensi**.
   - **Contoh Penyesuaian Terminologi UI:**
     | ❌ Teks yang Dilarang (Tercemar Referensi) | ✅ Teks Resmi Chenille Flowers Atelier (Bersih & Elegan) |
     | :--- | :--- |
     | `Pola admin-sunjaya` / `Pola Sunjaya` | `Audit Trail Keamanan` / `Live Session Guard` |
     | `Smart Autocomplete (Pola admin-sunjaya)` | `Smart Live Autocomplete` |
     | `Live Stream Pola admin-sunjaya` | `Live Stream Audit Log` |
     | `Pengguna & Log Sesi (Pola admin-sunjaya)` | `Pengawasan Pengguna & Log Sesi` |

4. **Pilar 4: Checklist Kepatuhan Pengembang (Compliance Checklist):**
   Sebelum kode dirilis atau di-commit ke repositori:
   - [x] **Checklist 1:** Apakah logic dan flow aplikasi bekerja dengan sempurna?
   - [x] **Checklist 2:** Apakah seluruh data model mencerminkan bisnis buket bunga kawat bulu?
   - [x] **Checklist 3:** Apakah seluruh teks pada file UI (`apps/web/src/components/...`) sudah diverifikasi menggunakan pencarian string ripgrep (`grep_search`) dan dipastikan **0% kemunculan nama referensi**?
   - [x] **Checklist 4:** Apakah antarmuka pengguna tampak orisinil, mewah, dan berstandar internasional?

---

### 17.12 Prinsip Mutlak Single Source of Truth — 100% Database Supabase PostgreSQL (Strict Zero-Dummy Policy) — v2.9

#### 1. Latar Belakang & Pernyataan Kebijakan (Zero-Dummy Policy)
Dalam arsitektur enterprise Chenille Flowers Atelier, **seluruh data sistem yang ditampilkan dan dimanipulasi pada aplikasi wajib bersumber secara riil dan persisten dari Database Supabase PostgreSQL**.

> [!IMPORTANT]
> **ATURAN BAKU PENGEMBANGAN (STRICT DATA INTEGRITY RULE):**
> 1. **DILARANG KERAS** menggunakan array dummy / mock statis (`INITIAL_USERS`, `MOCK_PRODUCTS`, `MOCK_ORDERS`, data hardcoded lokal) sebagai sumber data utama bagi antarmuka pengguna.
> 2. Seluruh entitas bisnis (Pengguna & Akun, Log Sesi & Audit Trail, Produk & Katalog, Pesanan & Status Stepper, Titik Temu COD, Pengaturan Atelier, Resep BOM, Kupon, Logistik, dan Klaim Garansi) **WAJIB terhubung ke tabel Supabase PostgreSQL melalui backend REST API**.
> 3. Setiap aksi mutasi (tambah akun, ubah status, buat pesanan, pembaruan koordinat, pencatatan log sesi) **harus mengeksekusi query database nyata** dan tersimpan secara permanen di Supabase.

---

#### 2. Arsitektur Aliran Data (Single Source of Truth Flow)
```mermaid
flowchart TD
    subgraph Client["Frontend Client (Next.js 14 Web)"]
        UI["Antarmuka Pengguna & Admin Panel"]
        Store["Zustand Stores (useUserAuditStore, useOrderStore, useSettingsStore)"]
        APIClient["API Client Helper (getApiUrl)"]
    end

    subgraph Backend["Backend API Service (Express.js / Node.js)"]
        Routes["REST API Endpoints (/api/v1/admin/users, /api/v1/products, /api/v1/orders)"]
        Pool["PostgreSQL Connection Pool (pg.Pool)"]
    end

    subgraph Database["Supabase PostgreSQL Cloud (SSOT)"]
        T_Users[("public.users & public.profiles")]
        T_Logs[("public.session_audit_logs")]
        T_Products[("public.products & public.categories")]
        T_Orders[("public.orders & public.order_items")]
        T_Settings[("public.store_settings")]
        T_COD[("public.cod_meetup_points")]
    end

    UI --> Store
    Store --> APIClient
    APIClient -->|HTTP GET / POST / PUT / PATCH| Routes
    Routes --> Pool
    Pool -->|Parameterized SQL Queries| Database
    Database -->|Real-Time Relational Data| Pool
    Pool --> Routes
    Routes -->|JSON Response (success: true, data)| Store
    Store -->|Reactive State Update| UI
```

---

#### 3. Inventarisasi Tabel Supabase PostgreSQL & Status Sinkronisasi
| No | Nama Tabel Supabase | Entitas Data | Status Sinkronisasi | Endpoint REST API Terkait |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `public.users` | Akun Pengguna (Super Admin, Staff Florist, Customer Member) | **100% Real Supabase** (6 akun terdaftar) | `GET /api/v1/admin/users`<br>`POST /api/v1/admin/users`<br>`PUT /api/v1/admin/users/:id/status`<br>`POST /api/v1/admin/users/:id/force-logout` |
| **2** | `public.profiles` | Profil Pengguna (Nama lengkap, avatar URL, preferensi tema, flower points) | **100% Real Supabase** | Terhubung via Foreign Key `users(id)` |
| **3** | `public.session_audit_logs` | Catatan Audit Trail (Login sukses, logout manual, timeout 15 menit, force logout) | **100% Real Supabase** (Indeks timestamp) | `GET /api/v1/admin/users/audit-logs`<br>`POST /api/v1/admin/users/audit-logs` |
| **4** | `public.products` | Katalog Buket Bunga Kawat Bulu (Nama, harga, HPP, stok, status ready, foto) | **100% Real Supabase** (9 produk aktif) | `GET /api/v1/products`<br>`POST /api/v1/products`<br>`PUT /api/v1/products/:id` |
| **5** | `public.orders` | Transaksi Pesanan & Stepper Produksi | **100% Real Supabase** (49 pesanan aktif) | `GET /api/v1/orders`<br>`POST /api/v1/orders`<br>`PATCH /api/v1/orders/:id` |
| **6** | `public.cod_meetup_points` | Titik Temu COD Kampus UI & Margonda Depok | **100% Real Supabase** (7 titik terverifikasi) | `GET /api/v1/cod-points`<br>`POST /api/v1/cod-points`<br>`DELETE /api/v1/cod-points/:id` |
| **7** | `public.store_settings` | Pengaturan Atelier (Alamat workshop, koordinat GPS, kuota PO harian) | **100% Real Supabase** | `GET /api/v1/admin/settings/all`<br>`PUT /api/v1/admin/settings` |
| **8** | `public.coupons` | Voucher Diskon & Kupon Promosi | **100% Real Supabase** | `GET /api/v1/coupons`<br>`POST /api/v1/coupons` |
| **9** | `public.warranty_claims` | Klaim Garansi Kerusakan Buket | **100% Real Supabase** | `GET /api/v1/warranty`<br>`POST /api/v1/warranty` |
| **10** | `public.logistics_configs` | Kredensial & Pengaturan Ekspedisi Biteship | **100% Real Supabase** | `GET /api/v1/admin/settings/logistics` |

---

#### 4. Detail Akun Riil Terdaftar di Database Supabase (`public.users`)
Seluruh akun berikut tersimpan langsung di tabel `public.users` dan `public.profiles` dengan kredensial hash yang valid:
1. **Ahmad Arif (Owner Atelier)**
   - ID: `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`
   - Email: `ahmad@chenilleatelier.com`
   - Role: `SUPER_ADMIN`
   - Status: `ACTIVE` | Perangkat: `Windows 11 • Chrome 128` | IP: `180.252.164.21 (Depok)`
2. **Rania Azzahra (Super Admin)**
   - ID: `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12`
   - Email: `admin@chenilleatelier.com`
   - Role: `SUPER_ADMIN`
   - Status: `ACTIVE` | Online: `true` | Perangkat: `macOS Sonoma • Safari 17` | IP: `182.2.140.88 (Jakarta)`
3. **Dewi Sartika (Head Florist)**
   - ID: `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13`
   - Email: `florist.dewi@chenilleatelier.com`
   - Role: `FLORIST_STAFF`
   - Status: `ACTIVE` | Online: `true` | Perangkat: `Android 14 • Chrome Mobile` | IP: `114.124.201.15 (Bogor)`
4. **Budi Setiawan (Artisan Chenille)**
   - ID: `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14`
   - Email: `florist.budi@chenilleatelier.com`
   - Role: `FLORIST_STAFF`
   - Status: `ACTIVE` | Perangkat: `Windows 10 • Edge 127` | IP: `110.137.88.94 (Depok)`
5. **Annisa Larasati (Member Mahasiswi UI)**
   - ID: `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15`
   - Email: `nisa.mahasiswi@gmail.com`
   - Role: `CUSTOMER_MEMBER`
   - Status: `ACTIVE` | Perangkat: `iPhone 15 • Safari Mobile` | IP: `36.85.12.77 (Margonda Depok)`
6. **Fajar Nugraha (Alumni FTUI)**
   - ID: `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16`
   - Email: `fajar.alumni@yahoo.com`
   - Role: `CUSTOMER_MEMBER`
   - Status: `ACTIVE` | Perangkat: `Android 13 • Samsung Browser` | IP: `103.28.14.99 (Kukusan Depok)`

---

#### 5. Protokol Verifikasi Integritas Data (Pre-Deployment Checklist)
Sebelum rilis produksi, tim engineering wajib memastikan:
- [x] Endpoint `GET /api/v1/admin/users` mengembalikan array pengguna dari `public.users` dengan status kode `200 OK`.
- [x] Endpoint `GET /api/v1/admin/users/audit-logs` mengembalikan catatan log dari `public.session_audit_logs`.
- [x] Antarmuka `UsersManagementView` memanggil `fetchUsers()` dan `fetchAuditLogs()` pada siklus hidup `useEffect`.
- [x] Antarmuka `ProductsClicksView` memanggil `fetch(getApiUrl('/api/v1/products'))` dan menampilkan katalog produk riil Supabase.
- [x] Tombol **"Refresh" (🔄)** pada antarmuka admin berfungsi untuk menyinkronkan data terbaru secara langsung dari Supabase.
- [x] Tidak ada komponen produksi yang menggunakan dummy array hardcoded tanpa sinkronisasi database.

---

### 17.13 Arsitektur & Siklus Hidup Proses Bisnis "Tendang Sesi" (Force Logout / Session Revocation) — v2.9

#### 1. Definisi & Filosofi Keamanan (The Business Purpose)
Fitur **"Tendang Sesi" (*Force Logout / Session Revocation*)** dirancang sebagai mekanisme pengamanan tingkat tinggi (*High-Security Intervention*) bagi Super Admin untuk mencabut hak akses aktif suatu akun secara seketika (*real-time*).

> [!IMPORTANT]
> **ATURAN PROSES BISNIS TENDANG SESI:**
> 1. "Tendang Sesi" **BUKAN** sekadar mengubah teks status pengguna menjadi offline di layar admin.
> 2. Akun yang ditendang **WAJIB seketika kehilangan hak akses pada browser/perangkatnya**, dibersihkan kredensial lokalnya (`token` & `user session`), dan langsung dialihkan paksa ke halaman `/login?reason=force_logout`.
> 3. Pengguna yang telah ditendang **DILARANG** dapat melanjutkan aktivitas, membuka halaman portal pesanan, atau panel admin tanpa melakukan proses autentikasi ulang (login kembali dengan kata sandi yang sah).

---

#### 2. Diagram Alir Siklus Hidup Tendang Sesi (End-to-End Lifecycle Flow)
```mermaid
sequenceDiagram
    autonumber
    actor Admin as Super Admin (Owner)
    participant AdminUI as Panel Admin (UsersManagementView)
    participant API as Backend Engine (apps/api)
    participant DB as Supabase PostgreSQL
    actor Victim as Pengguna / Staf (Target)
    participant ClientWatcher as Watcher Sesi Klien (SessionTimeoutWatcher)
    participant LoginUI as Halaman Login (/login)

    Admin->>AdminUI: Klik [🛑 Tendang Sesi] pada akun target
    AdminUI->>API: POST /api/v1/admin/users/:id/force-logout
    API->>DB: UPDATE users SET is_online = false, last_active_at = NOW()
    API->>DB: INSERT INTO session_audit_logs (FORCE_LOGOUT_ADMIN)
    API-->>AdminUI: 200 OK (Sesi berhasil di-revoke)
    AdminUI->>AdminUI: Update status tabel menjadi Offline (⚪)

    par Sinkronisasi Seketika Klien
        AdminUI->>ClientWatcher: Broadcast Storage Event (chenille_force_logout_event)
    and Heartbeat Berkala (Tiap 4 Detik)
        ClientWatcher->>API: GET /api/v1/auth/session-status?userId=...
        API->>DB: SELECT is_online, status FROM users WHERE id = $1
        DB-->>API: is_online = false
        API-->>ClientWatcher: { isValid: false, reason: "FORCE_LOGOUT" }
    end

    ClientWatcher->>Victim: Tampilkan Toast: "Sesi Diputus oleh Admin 🛑"
    ClientWatcher->>ClientWatcher: Bersihkan chenille_auth_storage & state sesi
    ClientWatcher->>LoginUI: Redirect paksa ke /login?reason=force_logout
    LoginUI->>Victim: Tampilkan form login & banner peringatan keamanan
```

---

#### 3. Tiga Lapis Proteksi Pemutusan Sesi (3-Tier Invalidation Layers)
1. **Lapis 1: Local Session Purge (Jika Akun Aktif di Browser yang Sama):**
   - Saat admin menendang akun yang kebetulan sedang aktif di browser yang sama (misal saat simulasi/testing akun admin atau staf), `useUserAuditStore.forceLogoutUser` mendeteksi kecocokan ID pengguna, langsung menghapus `chenille_auth_storage`, dan seketika melakukan `window.location.href = '/login?reason=force_logout'`.
2. **Lapis 2: Cross-Tab Invalidation via Storage Events:**
   - Ketika tombol ditekan, event `chenille_force_logout_event` dipancarkan melalui `localStorage`. Seluruh tab lain pada peramban yang membuka sesi pengguna yang sama akan langsung mendeteksi event ini dan serentak logout dalam hitungan milidetik.
3. **Lapis 3: Cross-Device Periodic Heartbeat (Backend Supabase Guard):**
   - Komponen `SessionTimeoutWatcher` yang aktif di seluruh aplikasi melakukan pemeriksaan berkala setiap 4 detik ke endpoint `GET /api/v1/auth/session-status?userId=...`.
   - Jika di database Supabase kolom `is_online` bernilai `false` atau `status` bernilai `'LOCKED'`, sesi pengguna di perangkat mana pun langsung dimatikan dan diarahkan ke `/login`.

---

#### 4. Pemulihan Sesi Melalui Login Ulang (Re-Authentication Flow)
Setelah sesi diputus:
1. Pengguna diarahkan ke `/login?reason=force_logout` dan disuguhi notifikasi ramah: *"Sesi akun Anda telah di-revoke demi keamanan data. Silakan login kembali untuk memperbarui sesi."*
2. Pengguna mengisi kredensial dan menekan tombol **"Masuk Sekarang"**.
3. Sistem memanggil endpoint `POST /api/v1/auth/login-activity` yang memperbarui status di database Supabase kembali menjadi `is_online = true`.
4. Sesi aktif baru terbentuk dengan masa berlaku 15 menit *inactivity guard*. Pengguna kembali diizinkan mengakses menu sesuai perannya.

---

### 17.14 Arsitektur Keamanan & Pertahanan Berlapis E-Commerce (Defense-in-Depth Security Framework) — v3.0

#### 1. Filosofi & Matriks Vektor Ancaman (Threat Matrix & Business Impact)
Platform e-commerce buket bunga kawat bulu Chenille Atelier menerapkan strategi **Defense-in-Depth (Pertahanan Berlapis)** guna melindungi transaksi pelanggan, aset database Supabase, dan ketersediaan layanan (*uptime*) dari berbagai ancaman siber:

| Vektor Ancaman | Sasaran Titik Lemah | Dampak Bisnis / Finansial | Mitigasi Teknis di Chenille Atelier |
| :--- | :--- | :--- | :--- |
| **SQL Injection (SQLi)** | Form pencarian, URL filter, query string database. | Database bocor, manipulasi harga, perusakan data pesanan. | **Parameterized Queries (`$1, $2`)** di seluruh query node-postgres & ORM. |
| **Stored & Reflected XSS** | Form catatan kartu ucapan buket, nama profil, review. | Pencurian token sesi pengguna, cookie hijacking, defacement. | **Input Sanitizer Middleware (`apps/api/src/lib/sanitizer.ts`)** yang memenggal tag `<script>`, `<iframe>`, dan event handler inline. |
| **WhatsApp OTP Flooding** | Endpoint `POST /api/v1/otp/send`. | Kuota kupon/saldo API Fonnte habis drastis; nomor WA diblokir Meta. | **Tiered OTP Rate Limiter (`apps/api/src/middleware/rate-limiter.ts`)**: Maksimal 5 req / 5 menit per IP. |
| **Credential Stuffing / Brute Force** | Endpoint `POST /api/v1/auth/login`. | Pengambilalihan akun Admin atau Member berpoin tinggi (*Account Takeover*). | **Auth Rate Limiter**: Maksimal 10 percobaan / 15 menit per IP + Fitur Kunci Status Akun (`LOCKED`). |
| **Flash-Sale / Bot Checkout Spammer** | Endpoint `POST /api/v1/orders`. | Kuota PO harian (25 buket) habis diborong bot dalam milidetik (*over-booking*). | **Checkout Rate Limiter**: Maksimal 20 checkout / 15 menit per IP + Atomic database capacity verification. |
| **Buffer Overflow DoS (Large Payload)** | Body parser `express.json()`. | Server memory exhaustion, Node.js process out-of-memory crash. | **Payload Capping (1MB Limit)** pada seluruh parser body JSON & URL-encoded. |
| **Clickjacking & MIME Sniffing** | HTTP Header respons web. | Halaman admin disusupi iframe berbahaya (*clickjacking*), spoofing file. | **Helmet.js** (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `HSTS`). |

---

#### 2. Rincian Konfigurasi Pertahanan Backend (`apps/api`)

1. **HTTP Security Headers (Helmet.js):**
   - Diimplementasikan pada `apps/api/src/app.ts`:
     ```typescript
     app.use(
       helmet({
         crossOriginResourcePolicy: { policy: 'cross-origin' },
         contentSecurityPolicy: false, // API murni JSON, CSP diterapkan di level Next.js Web App
       })
     );
     ```
   - Otomatis menginjeksi header: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`, `X-DNS-Prefetch-Control: off`.

2. **Tiered Rate Limiter Bertingkat (`express-rate-limit`):**
   - **Global API Limiter:** Maksimal 120 request per 1 menit per IP (mencegah DoS / scraping bot).
   - **Auth Limiter (`/api/v1/auth/*`):** Maksimal 10 request per 15 menit per IP (mencegah brute force).
   - **OTP Limiter (`/api/v1/otp/*`):** Maksimal 5 request per 5 menit per IP (mencegah WhatsApp spam).
   - **Checkout Limiter (`/api/v1/orders`):** Maksimal 20 request per 15 menit per IP (mencegah bot order).
   - *Test Suite Isolation:* Seluruh limiter memiliki klausul `skip: () => isTest` sehingga pengujian otomatis Vitest (96 tes) berjalan lancar tanpa terhalang limit 429.

3. **Input Sanitization & Anti-Prototype Pollution (`sanitizer.ts`):**
   - Seluruh payload masuk (`req.body`, `req.query`, `req.params`) dibersihkan secara rekursif.
   - Menghapus tag script, iframe, protokol `javascript:`, dan event handler inline (`onerror=`, `onload=`).
   - Mencegah *Object Prototype Pollution* dengan menolak modifikasi atribut `__proto__`, `constructor`, dan `prototype`.

4. **Pembatasan Ukuran Body Request (Payload Capping):**
   - Dibatasi secara eksplisit menjadi `1MB`:
     ```typescript
     app.use(express.json({ limit: '1mb' }));
     app.use(express.urlencoded({ extended: true, limit: '1mb' }));
     ```

---

### 17.15 Tata Kelola Kebersihan File Scratch & Debugging (Zero-Residual Scratch & Clean Storage Rule)

#### 1. Latar Belakang & Urgensi
Selama siklus pengembangan, pengujian fitur (misal: verifikasi migrasi Supabase, cek kolom tabel, simulasi rate limiting) sering kali membutuhkan skrip ad-hoc (*scratch scripts*). Penumpukan file scratch yang tidak terkelola dapat mengakibatkan:
- Penumpukan kapasitas penyimpanan (*storage bloat*).
- Kebingungan bagi developer lain terkait file mana yang merupakan kode produksi vs kode uji coba sementara.
- Risiko keamanan jika skrip scratch memuat kredensial atau connection string sensitif yang lupa dibersihkan.

#### 2. Aturan Wajib Tata Kelola (Mandatory Cleanliness Protocols)
1. **Zero-Residual Principle (Prinsip Nol Sisa):**  
   Setiap developer atau agen AI yang membuat file pengujian sementara (seperti `scratch_*.mjs`, `temp_*.js`, `test_*.cjs`, atau file dump JSON) **WAJIB menghapus file tersebut segera setelah pengujian selesai**.
2. **Larangan Commit File Scratch ke Repositori:**  
   File dengan awalan `scratch_` atau berada di dalam folder temporer dilarang di-stage (`git add`) maupun di-commit ke branch utama repositori.
3. **Penyimpanan Resmi Script Migrasi Permanen:**  
   Jika sebuah skrip memiliki nilai historis atau diperlukan untuk pemulihan skema database di masa mendatang, skrip tersebut tidak boleh disimpan sebagai file scratch bebas, melainkan wajib dimasukkan ke dalam folder resmi `supabase/migrations/` atau `prisma/migrations/` dengan penamaan terstruktur.
4. **Pemeriksaan Berkala (*Pre-Commit Cleanliness Check*):**  
   Sebelum melakukan git commit dan push, pastikan perintah `git status` tidak mencantumkan file scratch yang tercecer di root workspace.

---

## 18. Arsitektur Modul Kampanye Promosi, Loyalitas & Subsidi COD Radius (Campaign & Customer Loyalty Engine)

> **Status:** `PERANCANGAN RESMI (PRD v2.6)`  
> **Ruang Lingkup:** Menu Admin `Campaigns & Loyalty`, Storefront Checkout Drawer, dan Customer Portal (`/portal`)  
> **Prinsip Utama:** Sentralisasi kontrol strategi pemasaran di satu panel dinamis tanpa hardcode logika di kode aplikasi.

---

### 18.1 Latar Belakang & Filosofi Bisnis

Untuk mempercepat pertumbuhan omzet dan memperpanjang umur retensi pelanggan (*Customer Lifetime Value - LTV*), Chenille Flowers Atelier menerapkan **Tiga Pilar Pertumbuhan Pemasaran** yang saling melengkapi:

1. **Habit Formation & Top-of-Mind Awareness (Daily Attendance):**
   - Mengajak pelanggan membuka website setiap hari untuk "absen" demi mengumpulkan koin kelopak bunga (*petal points*).
   - Memastikan brand Chenille selalu diingat ketika pelanggan atau relasinya sewaktu-waktu membutuhkan buket bunga.
2. **Repeat Purchase & Collective Buying (Digital Stamp Card):**
   - Mengadopsi psikologi kartu stempel digital ("Beli 5 Buket Gratis 1 Buket Mini").
   - Menghilangkan godaan pelanggan untuk membeli di toko bunga kompetitor dan mendorong inisiatif menjadi koordinator pesanan untuk acara wisuda/kelulusan.
3. **Local Market Dominance & Basket Size Lift (Dynamic COD Radius Subsidy):**
   - Mengubah fitur teknis Geofencing COD menjadi senjata promosi pemasaran yang fleksibel.
   - Mengatur subsidi ongkir titik temu (100% gratis atau 50% diskon) berdasarkan radius jarak (KM) dan syarat minimum belanja (*minimum spend*).

---

### 18.2 Sentralisasi Pengelolaan di Menu "Campaign" Admin Panel

Seluruh konfigurasi strategi promosi dipindahkan dari menu teknis `Settings` ke menu khusus **Pemasaran & Kampanye (`Campaigns & Loyalty`)**. Admin toko dapat mengubah parameter, mengaktifkan/menonaktifkan promo musiman, dan memantau analitik secara *real-time*:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  🌸 PANEL ADMIN — PUSAT KONTROL KAMPANYE, LOYALITAS & PROMO RADIUS COD                     │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  [ TAB 1: ABSENSI HARIAN ]    [ TAB 2: KARTU STEMPEL BELANJA ]   [ TAB 3: PROMO RADIUS COD ]│
│                                                                                             │
│  ─────────────────────────────────────────────────────────────────────────────────────────  │
│  📌 SUB-MODUL 1: DAILY ATTENDANCE & STREAK GAMIFICATION                                     │
│  • Status Fitur            : [🟢 AKTIF  /  ⚪ NON-AKTIF] (Toggle Switch)                    │
│  • Poin per Absen Harian   : [ 10 ] Poin / hari                                             │
│  • Target Streak Konsisten : [ 7 ] Hari Berturut-turut                                      │
│  • Hadiah Jackpot Hari ke-7: [ Voucher Diskon 15% / 100 Poin Extra ] (Dropdown)             │
│  • Reset jika Bolos 1 Hari : [ Centang: Ya / Tidak ]                                        │
│  • Metrik Real-Time        : 48 Member Absen Hari Ini | 12 Streak Aktif                     │
│                                                                                             │
│  ─────────────────────────────────────────────────────────────────────────────────────────  │
│  📌 SUB-MODUL 2: DIGITAL STAMP CARD (BELI N GRATIS 1 BUKET)                                 │
│  • Status Fitur            : [🟢 AKTIF  /  ⚪ NON-AKTIF] (Toggle Switch)                    │
│  • Target Jumlah Stempel   : [ 5 ] Stempel untuk 1 Hadiah                                   │
│  • Syarat 1 Stempel        : [ Min. Belanja Rp 50.000 / 1 Buket ] (Input Angka)             │
│  • Tipe Hadiah Akhir       : (•) Produk Fisik Gratis   ( ) Kupon Flat   ( ) Bebas Ongkir    │
│  • Pilihan Produk Hadiah   : [ Buket Mini Velvet Kawat Bulu ] (Dropdown Daftar Produk)      │
│  • Masa Berlaku Stempel    : [ 180 ] Hari sejak stempel pertama dicap                       │
│  • Metrik Real-Time        : 23 Kartu Aktif Berjalan | 8 Hadiah Telah Diklaim               │
│                                                                                             │
│  ─────────────────────────────────────────────────────────────────────────────────────────  │
│  📌 SUB-MODUL 3: PROMO SUBSIDI ONGKIR COD TITIK TEMU BERDASARKAN RADIUS                     │
│  • Status Fitur            : [🟢 AKTIF  /  ⚪ NON-AKTIF] (Toggle Switch)                    │
│  • Jarak Maksimal Promo    : [ 5.0 ] KM dari Workshop Atelier (Input Text Desimal Fleksibel)│
│  • Skema Subsidi Biaya COD : (•) 100% Gratis Ongkir Titik Temu                              │
│                              ( ) 50% Subsidi (Potongan Setengah Tarif Antar)                │
│                              ( ) Kustom Persen [ ... % ] / Nominal Flat [ Rp ... ]          │
│  • Syarat Minimum Belanja  : [ Rp 75.000 ] (Bebas Ongkir jika total belanja >= nominal ini) │
│  • Teks Banner Promosi     : "🎉 Promo Spesial: Gratis Ongkir COD Radius 5 KM dari Studio!" │
│  • Metrik Real-Time        : 31 Pesanan COD Menggunakan Promo Bulan Ini                     │
│                                                                                             │
│  [ 💾 SIMPAN PERUBAHAN KAMPANYE ]                                                           │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 18.3 Skema Database Relasional (PostgreSQL Supabase)

Tiga tabel baru ditambahkan untuk menopang ketahanan data dan pelacakan riwayat kampanye:

```sql
-- 1. Konfigurasi Kampanye Toko (Single Row Config with JSONB Flexibility)
CREATE TABLE IF NOT EXISTS campaign_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'ATELIER_CAMPAIGN_DEFAULT',
  -- Daily Attendance Config
  attendance_enabled BOOLEAN DEFAULT true,
  daily_points_reward INTEGER DEFAULT 10,
  streak_days_target INTEGER DEFAULT 7,
  streak_reward_type VARCHAR(50) DEFAULT 'VOUCHER_DISCOUNT',
  streak_reward_value NUMERIC(12, 2) DEFAULT 15.00, -- 15% atau Rp 15.000
  reset_streak_on_miss BOOLEAN DEFAULT true,

  -- Stamp Card Config
  stamp_card_enabled BOOLEAN DEFAULT true,
  stamp_target_count INTEGER DEFAULT 5,
  min_spend_per_stamp NUMERIC(12, 2) DEFAULT 50000.00,
  stamp_reward_type VARCHAR(50) DEFAULT 'FREE_PRODUCT',
  stamp_reward_product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL,
  stamp_expiry_days INTEGER DEFAULT 180,

  -- COD Radius & Subsidy Config
  cod_promo_enabled BOOLEAN DEFAULT true,
  cod_max_radius_km NUMERIC(5, 2) DEFAULT 5.00,
  cod_subsidy_type VARCHAR(50) DEFAULT 'FREE_100', -- 'FREE_100', 'DISCOUNT_50', 'CUSTOM_PERCENT', 'FLAT_AMOUNT'
  cod_subsidy_value NUMERIC(12, 2) DEFAULT 100.00,
  cod_min_spend NUMERIC(12, 2) DEFAULT 75000.00,
  cod_promo_banner_text VARCHAR(255) DEFAULT '🎉 Promo Area: Gratis Ongkir COD Titik Temu hingga 5 KM!',
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Log Absensi Harian Pengguna
CREATE TABLE IF NOT EXISTS user_attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_phone VARCHAR(20) NOT NULL,
  check_in_date DATE NOT NULL,
  points_earned INTEGER DEFAULT 10,
  current_streak INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_daily_checkin UNIQUE (user_phone, check_in_date)
);

-- 3. Pelacakan Kartu Stempel Belanja Digital
CREATE TABLE IF NOT EXISTS user_stamp_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_phone VARCHAR(20) NOT NULL,
  stamps_collected INTEGER DEFAULT 0,
  target_stamps INTEGER DEFAULT 5,
  card_status VARCHAR(30) DEFAULT 'ACTIVE', -- 'ACTIVE', 'COMPLETED', 'REDEEMED', 'EXPIRED'
  reward_claimed_at TIMESTAMP WITH TIME ZONE,
  last_stamped_order_id VARCHAR(50) REFERENCES orders(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### 18.4 Alur Interaksi Pengguna (User Experience Flow)

#### A. Alur Absensi Harian (Customer Portal)
1. Pembeli membuka menu akun atau portal pesanan `/portal`.
2. Menemukan kartu **"Absensi Harian & Rawat Bunga"**:
   - Menampilkan 7 slot hari dalam seminggu.
   - Tombol interaktif: `[🌸 Absen Hari Ini (+10 Poin)]`.
3. Saat diklik:
   - Animasi kelopak bunga mekar + toast perolehan poin.
   - Poin langsung masuk ke saldo akun dan dapat dipotongkan saat checkout.
   - Jika berhasil 7 hari berturut-turut, kupon diskon jackpot otomatis diterbitkan.

#### B. Alur Cap Stempel Belanja (Otomatis Pasca-Transaksi)
1. Pelanggan menyelesaikan pesanan buket bunga kawat bulu.
2. Saat status pesanan berubah menjadi **`CONFIRMED`** atau **`COMPLETED`**:
   - Trigger backend mengecek nilai transaksi. Jika memenuhi `min_spend_per_stamp`, sistem menambahkan +1 stempel di kartu pelanggan.
3. Di portal akun, kartu stempel menampilkan visual 5 slot bunga.
4. Ketika stempel ke-5 tercapai:
   - Kartu bersinar emas (*golden shimmer effect*).
   - Tombol `[🎁 Klaim Buket Mini Gratis]` aktif.
   - Hadiah otomatis disisipkan ke keranjang belanja pesanan berikutnya tanpa biaya tambahan (Rp 0).

#### C. Alur Promo Radius COD di Checkout Drawer
1. Pembeli memilih opsi pengiriman **COD Titik Temu**.
2. Pembeli memilih lokasi titik temu di peta Google Maps.
3. Sistem menghitung jarak Haversine dari koordinat Workshop:
   - **Kasus 1 (Jarak <= Radius Promo & Belanja >= Min Spend):**  
     Muncul badge hijau: `🎉 Promo Radius Aktif: Biaya COD Gratis 100%! (Hemat Rp 15.000)`. Biaya COD otomatis menjadi Rp 0.
   - **Kasus 2 (Jarak <= Radius Promo tetapi Belanja < Min Spend):**  
     Muncul notifikasi edukasi: `💡 Tambah Rp 15.000 lagi untuk mendapatkan Gratis Ongkir COD 100% (Saat ini Subsidi 50%)`.
   - **Kasus 3 (Jarak > Radius Promo):**  
     Sistem menampilkan opsi tarif normal atau merekomendasikan Ekspedisi Biteship (JNE/SiCepat) dengan penjelasan sopan.

---

### 18.5 Rekomendasi & Best Practice Bisnis (Expert Suggestions)

1. **Strategi Berjenjang (Tiered Radius Zone):**
   - **Zona Sangat Dekat (0 – 2.5 KM):** Gratis 100% tanpa syarat minimum belanja (memperkuat kedekatan dengan tetangga dan komunitas lokal).
   - **Zona Menengah (2.6 – 5.0 KM):** Gratis 100% dengan syarat minimum belanja Rp 75.000, atau subsidi 50% jika di bawah itu.
   - **Zona Luar (> 5.0 KM):** Menggunakan kurir Biteship agar staf florist tidak membuang waktu produktif merangkai bunga hanya untuk perjalanan jauh.
2. **Kenaikan Nilai Keranjang (AOV Uplift via Minimum Spend):**
   - Memasang syarat minimum belanja pada promo COD secara psikologis mendorong pembeli membeli produk pelengkap (*add-on*), seperti kartu ucapan akrilik, lampu LED peri, atau gantungan kunci bunga kawat bulu mini untuk mengejar batas bebas ongkir.
3. **Pemisahan Peran Menu Panel Admin:**
   - Menyimpan seluruh variabel kampanye (jarak COD, persentase subsidi, target stempel, poin absen) di menu **Campaigns** menjaga antarmuka **Settings** tetap bersih, fokus pada konfigurasi teknis dasar, dan memudahkan staf pemasaran mengatur promosi tanpa risiko merusak konfigurasi sistem utama.
---

## 19. Customer Behavior Telemetry & Conversion Optimization Engine

Seksi ini merinci sistem analisis perilaku pembeli (*buyer behavior*), pelacakan titik hambatan (*drop-off funnel*), pencegahan keranjang terabaikan (*abandoned cart*), serta optimasi konversi transaksi terinspirasi dari standar *marketplace* terkemuka (Shopee, Tokopedia, Shopify).


### 19.1 In-House Lightweight Event Telemetry (`user_events`)
* **Tujuan:** Mengetahui perilaku pembeli secara *real-time* tanpa memberatkan web dan tanpa bergantung pada Google Analytics berbayar.
* **Titik Lacak (Event Points):**
  1. `PAGE_VIEW`: Mengetahui halaman yang paling lama dibaca.
  2. `STUDIO_STEP_VIEWED`: Mencatat perpindahan langkah di Studio Custom (Step 1 $\rightarrow$ 2 $\rightarrow$ 3 $\rightarrow$ 4).
  3. `SEARCH_QUERY`: Mencatat setiap kata kunci yang diketik pelanggan.
  4. `ADD_TO_CART`: Mencatat buket dan variasi yang diminati.
  5. `CHECKOUT_INITIATED`: Mengetahui saat pelanggan mulai mengisi formulir bayar.
  6. `PAYMENT_SUCCESS`: Konversi akhir transaksi.

### 19.2 Custom Studio 4-Step Drop-Off Funnel & Smart Auto-Styling Preset
* **Analisis:** Mengukur persentase pembeli yang batal di setiap tahapan pembuatan buket kustom.
* **Fitur Solutif (*Smart Auto-Styling Preset*):**
  * Seringkali pelanggan batal di Step 3 (*Pilih Kertas Wrapping*) karena bingung mencocokkan warna (*decision fatigue*).
  * Sistem menyediakan tombol: **`[🪄 Rekomendasi Paduan Warna Florist]`** yang dalam 1-klik langsung memilihkan kertas wrapping dan pita yang paling serasi dengan warna bunga pilihan mereka.

### 19.3 Zero-Result Search Query Logger
* **Logika:** Menyaring kata kunci pencarian yang menghasilkan `0 item`.
* **Dashboard Admin:** Menampilkan daftar *Top Wanted Products* (contoh: *"Buket Karakter Cat"*, *"Bunga Kawat Wisuda Pria"*, *"Buket Cokelat"*).
* **Manfaat:** Pemilik toko langsung tahu jenis buket baru apa yang harus dibuat pengrajin berdasarkan permintaan riil pembeli.

### 19.4 Smart In-Cart Micro-Upsell (Menaikkan Nilai Rata-rata Belanja / AOV)
* Saat pembeli membuka keranjang belanja (*drawer cart*), sistem menampilkan rekomendasi aksesori pelengkap berharga terjangkau:
  * 🕯️ Lampu LED Peri Berkelap-kelip (+Rp 10.000)
  * 🎓 Boneka Toga Wisuda (+Rp 15.000)
  * 💌 Kartu Ucapan Akrilik Bening (+Rp 8.000)
  * 📸 Cetak 2 Foto Polaroid Mini (+Rp 5.000)
* Menghasilkan kenaikan nilai pesanan (*Average Order Value*) sebesar 20–30% tanpa terasa membebani pembeli.

### 19.5 Spotify QR Code Audio-Visual Greeting Card (Fitur Viral Organik)
* Di formulir checkout/ucapan, pembeli dapat menempelkan tautan lagu kenangan Spotify mereka.
* Sistem men-*generate* stiker/kartu mini dengan kode gelombang Spotify resmi.
* Saat penerima buket men-scan buketnya, lagu favorit langsung berputar di ponsel mereka. Momen ini secara alami akan diunggah ke TikTok/Instagram Story oleh penerima (*Free Word-of-Mouth*).

### 19.6 Occasion Calendar & Automated WhatsApp Reminder
* Fitur di profil member: **"Kalender Momen Penting Saya"** (Ulang Tahun Pasangan, Wisuda Sahabat, Anniversary).
* Sistem otomatis mengirimkan pengingat ramah via WhatsApp H-7 sebelum hari H agar pembeli tidak panik mencari kado di hari-H dan kuota perakitan aman.

### 19.7 Event Delivery Date & Time Slot Picker
* Input di halaman checkout: *"Kapan buket ini dibutuhkan?"* (Pilihan tanggal kalender + jam estimasi acara).
* Menghilangkan kecemasan pembeli wisuda kampus dan meningkatkan rasa percaya diri untuk menyelesaikan pembayaran.

---


### 19.8 Skema Database & Pemetaan Model Prisma (Telemetry & Occasion)

Tiga model data baru ditambahkan ke `apps/api/prisma/schema.prisma` dan Supabase PostgreSQL:



```prisma
// 1. Log Telemetri Perilaku Pembeli
model UserEventLog {
  id          String   @id @default(uuid())
  session_id  String
  user_id     String?
  event_name  String   // 'PAGE_VIEW', 'STUDIO_STEP', 'SEARCH', 'ADD_TO_CART', 'CHECKOUT'
  step_number Int?     // Khusus event Studio Custom (1-4)
  metadata    Json?    // Menyimpan detail search keyword, produk yang dilihat, dll.
  created_at  DateTime @default(now())

  @@index([session_id])
  @@index([event_name])
}

// 2. Log Pencarian Kata Kunci & Zero-Result Analytics
model SearchKeywordLog {
  id           String   @id @default(uuid())
  keyword      String
  results_count Int     @default(0)
  is_zero_hit  Boolean  @default(false)
  created_at   DateTime @default(now())

  @@index([keyword])
  @@index([is_zero_hit])
}

// 3. Kalender Momen Spesial Pelanggan
model CustomerOccasion {
  id             String    @id @default(uuid())
  user_phone     String
  user_name      String
  recipient_name String
  occasion_title String    // 'Ulang Tahun', 'Wisuda', 'Anniversary'
  event_date     DateTime
  notes          String?
  is_reminded    Boolean   @default(false)
  reminded_at    DateTime?
  created_at     DateTime  @default(now())

  @@index([user_phone])
  @@index([event_date])
}
```

---


---

## 20. Multi-Theme Copywriting & Tone of Voice Matrix

Seksi ini merupakan kamus dan pedoman baku penulisan teks antarmuka (*UI copywriting*) untuk ketiga tema katalog yang berbeda karakter (*Korean Pastel*, *Modern Romantic*, dan *Playful Kawaii*). Bahasa dirancang alami, berkarakter, tidak kaku, namun tetap sopan, estetik, dan tidak berlebihan (*anti-lebay*).


Agar toko memiliki jiwa (*brand personality*) yang kuat, setiap tema memiliki **prinsip bahasa unik**:
* **Tema A (Korean Pastel):** *Soft, mindful, comforting, aesthetic*. Menggunakan gaya bahasa yang tenang, hangat, ramah seperti kakak/sahabat perempuan, menekankan keindahan bunga kawat bulu yang awet selamanya.
* **Tema B (Modern Romantic):** *Understated luxury, deep, poetic, timeless*. Gaya bahasa yang dewasa, elegan, tulus, menghargai momen berkelas tanpa terasa berlebihan (*anti-lebay*).
* **Tema C (Playful Kawaii):** *Vibrant, joyful, energetic, friendly bestie*. Gaya bahasa yang ceria, santai, penuh senyum, merayakan pencapaian dan kebahagiaan dengan antusias.

Berikut matriks perbandingan copywriting untuk setiap elemen halaman:

### 20.1 Top Announcement Bar (Pemberitahuan Atas)
| Elemen | Tema A: Korean Pastel | Tema B: Modern Romantic | Tema C: Playful Kawaii |
| :--- | :--- | :--- | :--- |
| **Pesan Kuota / Promo** | 🌸 *Kapasitas perakitan hari ini tersisa 5 buket. Amankan slot kirimmu dengan tenang.* | 🕯️ *Slot perakitan terbatas untuk menjaga kesempurnaan setiap tangkai bunga.* | ✨ *Yeay! Kuota buket wisuda hari ini tersisa 5 slot lagi! Yuk pesan sekarang!* |

---

### 20.2 Hero Section (Headline & Subheadline)
| Elemen | Tema A: Korean Pastel | Tema B: Modern Romantic | Tema C: Playful Kawaii |
| :--- | :--- | :--- | :--- |
| **Badge Atas** | `100% Handcrafted Chenille Velvet` | `Timeless Botanical Craftsmanship` | `100% Handmade Bikin Senyum` |
| **Headline Utama** | **Mekar Abadi dalam Lembutnya Cerita Kita.** | **Apresiasi Tulus yang Tak Pernah Pudar.** | **Kirim Senyum Manis Lewat Buket Bunga Lucu!** |
| **Sub-headline** | Rangkaian buket kawat bulu bertekstur beludru lembut. Hadiah manis yang dirangkai teliti untuk momen wisuda dan hari istimewa. | Rangkaian estetika modern berbahan kawat bulu premium. Keindahan abadi yang mewakili rasa terima kasih dan cinta penuh makna. | Buket kawat bulu warna-warni berkarakter ceria. Bikin perayaan wisuda, ulang tahun, dan hari bahagiamu makin seru! |
| **Tombol CTA 1** | `Jelajahi Koleksi 🌸` | `Lihat Katalog Eksklusif 🌹` | `Pilih Bunga Favorit 🌻` |
| **Tombol CTA 2** | `Rangkai Sendiri ✨` | `Desain Buket Kustom 🖋️` | `Bikin Versi Kamu 🎨` |

---

### 20.3 Empat Kartu Nilai Jual Toko (*Trust Cards*)
| Kartu | Tema A: Korean Pastel | Tema B: Modern Romantic | Tema C: Playful Kawaii |
| :--- | :--- | :--- | :--- |
| **1. Kualitas/Awet** | **Awet Bertahun-tahun**<br>Bahan beludru chenille pilihan, tidak rontok dan bebas layu. | **Keindahan Abadi**<br>Simbol memori berharga yang tetap anggun tanpa perlu perawatan. | **Anti Layu Selamanya**<br>Bisa dipajang di kamar terus tanpa takut rontok atau kering! |
| **2. Pengemasan** | **Kardus Box Rapi & Tebal**<br>Dilindungi mika dan box kokoh agar bentuk buket tetap presisi. | **Kemasan Eksklusif Aman**<br>Pengemasan struktural berlapis standar kurir jarak jauh. | **Packing Super Aman**<br>Box tebal anti penyok, siap kirim sampai tujuan tanpa kusut! |
| **3. Titik Temu COD** | **Titik Temu COD Kampus**<br>Bisa ambil langsung di sekitar gerbang kampus atau mall terdekat. | **Layanan Titik Temu Presisi**<br>Serah terima tepat waktu di lokasi pertemuan yang disepakati. | **Ketemuan COD Dekat Sini**<br>Bisa janjian di kampus atau spot nongkrong favoritmu! |
| **4. Garansi** | **Garansi Rangkai Ulang**<br>Kami pastikan buket sesuai pesanan sebelum diserahkan. | **Jaminan Kepuasan Penuh**<br>Standar kurasi ketat pada setiap detail kelopak dan pita. | **Garansi 100% Sesuai Foto**<br>Buket cantik persis seperti preview, dijamin suka! |

---

### 20.4 Modul Katalog Bunga
| Elemen | Tema A: Korean Pastel | Tema B: Modern Romantic | Tema C: Playful Kawaii |
| :--- | :--- | :--- | :--- |
| **Judul Seksi** | **Pilihan Buket Favorit** | **Koleksi Rangkaian Terkurasi** | **Koleksi Buket Paling Laris** |
| **Sub-judul** | Sentuhan warna pastel yang manis, cocok untuk wisuda, sidang, atau kado kecil. | Paduan estetika tegas dan proporsi anggun untuk perayaan penting. | Warna cerah bikin *mood booster*, cocok buat sahabat tersayang! |
| **Filter: Semua** | `Semua Sentuhan` | `Seluruh Koleksi` | `Semua Buket` |
| **Filter: Wisuda** | `Momen Wisuda` | `Graduation Honors` | `Spesial Wisuda & Sidang` |
| **Filter: Romantis** | `Kisah Manis` | `Romance & Anniversary` | `Bikin Deg-degan` |
| **Filter: Karakter** | `Mini & Karakter` | `Artisan Sculpture` | `Karakter Super Gemas` |
| **Tombol Beli** | `Simpan ke Keranjang 🛒` | `Pesan Rangkaian Ini 🛍️` | `Mau yang Ini! 💖` |

---

### 20.5 Modul Custom Studio Interaktif
| Langkah | Tema A: Korean Pastel | Tema B: Modern Romantic | Tema C: Playful Kawaii |
| :--- | :--- | :--- | :--- |
| **Judul Studio** | **Atelier Rangkai Mandiri** | **Bespoke Bouquet Studio** | **Studio Rangkai Suka-Suka** |
| **Panduan Singkat** | Padukan warna dan bunga kesukaanmu dalam 4 langkah santai. | Rancang buket personal dengan sentuhan material berkelas. | Rangkai buket impianmu sendiri, bebas pilih warna sesukamu! |
| **Step 1: Bunga** | *Pilih Bunga Utama* | *Tentukan Bentuk Kelopak* | *Pilih Karakter Bunga* |
| **Step 2: Warna** | *Pilih Nuansa Kawat Beludru* | *Palet Warna Tangkai* | *Warna Kawat Paling Kece* |
| **Step 3: Kertas** | *Pilih Kertas Pembungkus* | *Material Wrapping Cellophane* | *Kertas Bungkus Favorit* |
| **Step 4: Aksesori** | *Sentuhan Pelengkap Manis* | *Finishing Detail & Kartu* | *Aksesori Tambahan Gemas* |
| **Tombol Rekomendasi**| `🪄 Rekomendasi Warna Florist` | `✨ Harmonikan Otomatis` | `🎨 Padukan Otomatis Dong!` |
| **Tombol Checkout** | `Selesaikan Rangkaian Ini 🌸` | `Konfirmasi Desain Pesanan 🖋️` | `Bungkus Desain Keren Ini! 🎉` |

---

### 20.6 Modul Lookbook & Cerita Pelanggan
| Elemen | Tema A: Korean Pastel | Tema B: Modern Romantic | Tema C: Playful Kawaii |
| :--- | :--- | :--- | :--- |
| **Judul Seksi** | **Cerita Hangat dari Pelanggan** | **Momen yang Kami Rayakan** | **Keseruan Bareng Sahabat** |
| **Kutipan Sosial** | *"Bunganya tetap cantik di meja belajar walau wisudanya sudah 6 bulan lalu."* | *"Detail kawat bulunya rapi sekali, terasa eksklusif saat diserahkan ke pasangan."* | *"Boneka toga dan bunganya lucu banget, teman sekelasku pada nanya beli di mana!"* |

---

### 20.7 Modul Keranjang Belanja & Upsell (*Drawer Cart*)
| Elemen | Tema A: Korean Pastel | Tema B: Modern Romantic | Tema C: Playful Kawaii |
| :--- | :--- | :--- | :--- |
| **Judul Keranjang** | **Pesanan Bunga Kamu (3)** | **Daftar Pesanan Atelier (3)** | **Keranjang Belanjamu (3)** |
| **Judul Upsell** | *Lengkapi Momen Manismu:* | *Sempurnakan Hadiah Ini:* | *Biar Makin Berkesan, Tambah Ini Yuk:* |
| **Opsi Spotify** | `🎵 Sisipkan Lagu Kenangan (Spotify QR)` | `🎼 Tautkan Lagu Memorial (Spotify QR)` | `🎶 Kasih Lagu Favorit Kalian (Spotify QR)` |
| **Tombol Lanjut** | `Lanjut ke Pengiriman 🌸` | `Lanjutkan Pembayaran 💳` | `Gas Checkout Sekarang! 🚀` |

---

### 20.8 Modul Pengingat Hari Spesial (Portal Pelanggan)
| Elemen | Tema A: Korean Pastel | Tema B: Modern Romantic | Tema C: Playful Kawaii |
| :--- | :--- | :--- | :--- |
| **Judul Fitur** | **Kalender Momen Berharga** | **Memorial Date Registry** | **Catatan Hari Spesial** |
| **Deskripsi** | Simpan tanggal wisuda atau ulang tahun orang terdekat. Kami ingatkan seminggu sebelumnya. | Dokumentasikan momen penting. Kami pastikan hadiah Anda siap tepat waktu tanpa tergesa. | Jangan sampai lupa ultah sahabat atau doi! Tulis tanggalnya di sini, nanti kami ingetin! |
| **Pesan WA H-7** | *"Halo Kak, 7 hari lagi tanggal ulang tahun Ayunda. Mau kami siapkan buketnya lebih awal agar tenang?"* | *"Mengingatkan, momen penting Anda tinggal 7 hari lagi. Slot perakitan siap kami amankan untuk Anda."* | *"Hai Kak! Seminggu lagi wisuda bestie nih! Yuk amanin buketnya sekarang sebelum antrean penuh!"* |

---


---

## 21. UI/UX & Art Direction Visual per Tema

Seksi ini menetapkan arahan visual (*art direction*), standardisasi aset, serta perombakan elemen antarmuka storefront agar etalase produk tampil premium, otentik, berkarakter, dan mengeliminasi impresi tampilan template generik.


### 21.1 Transformasi Hero Section: Dari "Web Screenshot" ke "Bespoke Product Showcase"

```
[ SEBELUMNYA (Terasa Template) ]
┌─────────────────────────────────┐
│ Hero Kiri: Teks & Tombol        │  ┌──────────────────────────────┐
│                                 │  │ Kartu berisi Screenshot Web   │ ❌ Terasa seperti jualan
│                                 │  │ mini bertuliskan "THE ART OF  │    template website
│                                 │  │ ROMANCE" & grid kecil        │
└─────────────────────────────────┘  └──────────────────────────────┘

[ PERANCANGAN BARU (Autentik & Berjiwa Atelier) ]
┌─────────────────────────────────┐
│ Hero Kiri:                      │  ┌──────────────────────────────┐
│ • Monogram / Signature Icon     │  │ FOTO FISIK HIGH-RES BUKET    │ ✨ Fokus pada produk riil
│ • Headline Tipografi Tematik    │  │ • Tekstur beludru kawat nyata │ • Kedalaman visual (depth)
│ • Micro Trust Pills (3 Poin)    │  │ • Pita satin menjuntai halus │ • Efek interaktif
│ • Tombol Aksi Khas Tema         │  │ ┌──────────────────────────┐ │ • Ambient lighting
└─────────────────────────────────┘  │ │ Floating Badge Tekstur  │ │
                                     │ └──────────────────────────┘ │
                                     │ ┌──────────────────────────┐ │
                                     │ │ [💡 Coba Nyalakan Lampu] │ │ 🌟 Interaktif toggle LED
                                     │ └──────────────────────────┘ │
                                     └──────────────────────────────┘
```

---

### 21.2 Karakter Visual & Penataan Aset untuk Setiap Tema

Sesuai dengan standar baku **UI/UX Pro Max** dan ketentuan [RULES.md](file:///c:/Users/ASUS/Documents/Web%20Dev/improving/E-Comerce-BucketFlowers/RULES.md) (Seksi 4.2), seluruh etalase produk **DILARANG KERAS** menampilkan gambar tangkapan layar website tiruan (*website screenshot mockup inside a card*). Setiap tema wajib menampilkan foto fisik asli produk buket kawat bulu resolusi tinggi dengan karakteristik visual, bingkai, lencana, kartu ringkasan produk, dan interaktivitas yang unik serta berdaya tarik tinggi.

---

#### A. Tema A: Korean Pastel Atelier (*Hannam-dong Warm Florist*)
* **Esensi & Nuansa Emosional:** Hangat, lembut, puitis, damai, estetik seperti kafe bunga Hannam-dong di Seoul pada pagi hari.
* **Aset Fotografi Fisik Utama (`preview-tema-a.jpg`):**
  * **Komposisi Foto:** Foto fisik nyata *close-up & lifestyle* buket kawat bulu asli (*Pink Tulip & White Daisy Korean Bouquet*). Menampilkan tekstur beludru kawat bulu halus (*chenille stem*), kelopak tulip merah muda lembut, putik bunga daisy putih, dan aksen daun eucalyptus kawat bulu.
  * **Penataan & Latar:** Buket terbungkus kertas *cellophane* matte dua warna (*two-tone frosted pink & cream*) dengan pita satin lembut, diletakkan di atas meja kayu cerah bertekstur alami, beralas kain linen oat, dengan cangkir keramik kerajinan tangan dan buku catatan bersampul kraft di sampingnya.
  * **Pencahayaan:** Cahaya matahari pagi alami yang menembus jendela (*soft morning diffused daylight*), menciptakan bayangan lembut bergradasi hangat (*soft warm shadows*). Dilarang menyertakan teks tiruan website di dalam foto.
* **Bingkai & Wadah Visual (Frame):**
  * **Format:** *Vintage Korean Polaroid Photo Frame* dengan border putih krem tebal (`bg-white p-3.5 pb-7 sm:pb-8 shadow-[0_20px_40px_rgba(229,180,170,0.25)] border border-[#EFE8E1] rounded-[18px] rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500 ease-out`).
  * **Ornamen Washi Tape:** Aksen plester kertas washi tape semi-transparan bertekstur serat di sudut atas tengah bingkai (`bg-[#EBE2D8]/85 border-b border-white/60 shadow-xs`).
  * **Teks Polaroid Chin (Label Kaki):** Tulisan bergaya kaligrafi elegan / *handwritten font*: *"Spring Blossom Trio (봄날의 튤립) • Handcrafted in Hannam-dong Atelier"*.
* **Floating Badges & Elemen Interaktif:**
  * **Top-Left Floating Badge:** Kapsul lembut berlatar putih kaca: `🌸 100% Chenille Korea Halus` dengan garis pinggir pink pastel lembut dan micro-pulse.
  * **Stempel Lilin Monogram (Wax Seal Badge):** Di sudut kanan atas foto terdapat medali cap stempel lilin warna *terracotta / sage rose* berlogo monogram bunga dengan bayangan timbul 3D (*wax seal relief*).
  * **Bottom Showcase Pill / Card:** Kartu ringkasan melayang di bagian bawah foto:
    * Judul: **Pink Tulip Bliss Trio**
    * Subjudul: *Bunga Kawat Bulu Korea Halus & Wrapping Matte*
    * Harga & Tombol: `Rp 185.000` dengan pil manis bertuliskan **Adopsi Sekarang 🌷** (`bg-[#E8A598] hover:bg-[#D98E80] text-white`).
* **Latar Belakang & Aura Suasana (Ambient Glow):**
  * Gradasi lembut warna krem pastel, peach hangat, dan sakura pink muda (`from-[#FFF9F6] via-[#FFF3EE] to-[#FFEBE5]`) dengan partikel kelopak bunga melayang lembut (*subtle petal drift*).

---

#### B. Tema B: Modern Romantic & Editorial (*Haute Couture Luxury Atelier*)
* **Esensi & Nuansa Emosional:** Mewah, anggun, eksklusif, puitis berkelas, seperti katalog koleksi perhiasan tinggi / *haute couture perfume house* Paris.
* **Aset Fotografi Fisik Utama (`preview-tema-b.jpg`):**
  * **Komposisi Foto:** Foto fisik nyata *high-fashion editorial studio* buket kawat bulu kustom mewah (*Royal Crimson Velvet Rose & Gold Chenille Bouquet*). Menampilkan kelopak mawar kawat bulu merah anggur tua (*deep wine & burgundy chenille*), tekstur beludru padat berkelas, dedaunan beraksen serbuk emas *champagne*, dan untaian kawat peri LED mikro yang diselipkan di antara kelopak bunga.
  * **Penataan & Latar:** Buket dibalut kertas mewah hitam doff berlis emas dan pita sutra satin marun menjuntai bebas melewati tepi pedestal, bertengger anggun di atas silinder marmer hitam berurat emas (*black Nero Marquina marble pedestal*).
  * **Pencahayaan:** Pencahayaan panggung dramatis (*cinematic chiaroscuro spotlighting*) dengan pantulan lembut pada urat marmer. Dilarang menyertakan elemen teks mockup website di dalam foto.
* **Bingkai & Wadah Visual (Frame):**
  * **Format:** *European Arched Portal Frame* (gerbang arsitektur lengkung klasik Eropa) dengan lis ganda emas sampanye (`rounded-t-full rounded-b-2xl border-2 border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/30 shadow-[0_25px_60px_rgba(114,35,50,0.35)] overflow-hidden relative bg-stone-950`).
  * **Aksen Ornamen Kemewahan:** Garis tepi tipis berkilau emas dengan efek *sheen reflex* saat terkena sorotan kursor.
* **Floating Badges & Fitur Interaktif Eksklusif:**
  * **Top-Left Floating Badge:** Medali pita beludru berlis emas: `🍷 Haute Couture Edition` dengan kilau emas halus.
  * **Fitur Interaktif Saklar Lampu LED Buket (`[💡 Coba Nyalakan Lampu Buket]`):** 
    * Tombol switch interaktif yang dapat diklik oleh pengunjung etalase.
    * **Mode Siang (Daylight Editorial):** Menampilkan keanggunan beludru bunga kawat bulu di bawah spotlight studio.
    * **Mode Malam (Nighttime Ambient Fairy Lights):** Gambar buket bertransformasi menjadi suasana temaram romantis berhiaskan lampu kawat peri (*fairy lights*) warna kuning hangat (*warm golden glow*) yang menyala dan berkedip lembut di antara kelopak beludru, disertai partikel kilau debu emas (*gold dust sparkles*).
  * **Bottom Showcase Pill / Card:** Kartu elegan melayang berlatar hitam transparan kaca (*dark glassmorphism*) dengan tipografi serif emas:
    * Judul: **The Royal Crimson Velvet**
    * Subjudul: *Deep Wine Chenille • Lis Champagne Gold*
    * Harga & Tombol: `Rp 275.000` dengan pil mewah bertuliskan **Pesan Mahakarya 🌹** (`bg-gradient-to-r from-[#8B1E3F] to-[#722332] text-amber-100 border border-amber-400/40`).
* **Latar Belakang & Aura Suasana (Ambient Glow):**
  * Radiasi lembut warna merah marun (*deep wine noir glow*) berpadu pendar emas sampanye hangat (`from-[#FAF6F0] via-[#F4EBE1] to-[#EBD5C5]`) menciptakan atmosfer atelier seni yang tak tertandingi.

---

#### C. Tema C: Playful Kawaii (*Joyful Harajuku & Graduation Sunshine - Baseline Acuan*)
* **Esensi & Nuansa Emosional:** Ceria, enerjik, penuh senyum, warna-warni, merayakan wisuda kampus, ulang tahun sahabat, dan momen kemenangan penuh antusiasme.
* **Aset Fotografi Fisik Utama (`preview-tema-c.jpg`):**
  * **Komposisi Foto:** Foto fisik nyata buket wisuda bunga matahari kawat bulu ceria (*Sunshine Bear Graduation Bouquet*). Menampilkan bunga matahari kuning cerah dengan senyuman rajut, boneka beruang kawat bulu mini bertoga wisuda dan memegang ijazah kecil, bunga daisy aneka warna pastel, pita rami warna-warni, dan kartu ucapan wisuda mini.
  * **Penataan & Latar:** Buket terbungkus kertas pembungkus cerah dua warna (kuning peach & baby pink) di atas latar belakang bergradasi pastel ceria dengan hiasan balon pastel lembut. Telah divalidasi dan disukai oleh pengguna.
* **Bingkai & Wadah Visual (Frame):**
  * **Format:** *Chunky Squircle 3D Puffy Frame* (`border-4 border-amber-300 rounded-[2.5rem] shadow-[0_20px_45px_rgba(251,191,36,0.3)] bg-gradient-to-b from-amber-50 to-orange-50 p-2 sm:p-2.5 transition-transform hover:scale-[1.01]`).
* **Floating Badges & Elemen Interaktif:**
  * **Top-Right Floating Wiggle Badge:** `⭐ Favorit Wisudawan` beranimasi goyang (*wiggle on hover*) dengan warna kuning madu berkilau.
  * **Bottom Showcase Pill / Card:** Kapsul membal ceria:
    * Judul: **Sunshine Bear Graduation**
    * Subjudul: *100% Bulu Halus & Topi Toga Nama*
    * Tombol Interaktif: **Super Gemas!** (`bg-pink-100 text-pink-600 font-black rounded-full px-3 py-1 text-xs hover:scale-105 transition-transform`).
* **Latar Belakang & Aura Suasana (Ambient Glow):**
  * Pendaran warna kuning matahari (*warm yellow sunshine aura*) berpadu gradasi peach ceria yang membangkitkan senyuman seketika.

---

### 21.3 Matriks Penataan Aset Visual Komparatif Antar-Tema

| Komponen Visual | Tema A (Korean Pastel Atelier) | Tema B (Modern Romantic Atelier) | Tema C (Playful Kawaii Craft) |
| :--- | :--- | :--- | :--- |
| **Aset Foto Fisik Utama** | `preview-tema-a.jpg` (Tulip & Daisy Pastel di Meja Kafe Kayu) | `preview-tema-b.jpg` (Royal Crimson Rose di Pedestal Marmer) | `preview-tema-c.jpg` (Sunflower Bear Graduation di Balon Pastel) |
| **Pencahayaan (Lighting)** | Cahaya matahari pagi alami (*soft morning window light*) | Spotlight panggung dramatis (*dramatic chiaroscuro & moody*) | Cahaya cerah merata tanpa bayangan tajam (*bright pop light*) |
| **Material Pendukung** | Kain linen oat, kayu cerah, kertas kraft | Marmer hitam Nero Marquina, pita satin sutra, kaca kristal | Balon pastel, pita kado ceria, konfeti akrilik |
| **Bentuk Bingkai (Frame)** | Vintage Polaroid miring 1.5° + washi tape bertekstur | Arched European Portal klasik + lis emas ganda | Chunky Squircle 3D Puffy tebal + sudut melengkung 40px |
| **Label Kaki Bingkai (Chin)** | Kaligrafi Korea: *Spring Blossom Trio (봄날의 튤립)* | Monogram Serif Emas: *Atelier Chenille Privé* | Polkadot ceria timbul dengan stiker bintang |
| **Lencana Mengambang Atas** | `🌸 100% Chenille Korea Halus` | `🍷 Haute Couture Edition` | `⭐ Favorit Wisudawan` (Animasi Wiggle) |
| **Elemen Interaktif Utama** | Cap Stempel Lilin Monogram 3D (*Wax Seal*) | Saklar Lampu LED Buket `[💡 Coba Nyalakan Lampu]` (Day/Night) | Stiker Wisuda Membal 3D (*Bouncy Spring Sticker*) |
| **Kartu Ringkasan Produk** | *Pink Tulip Bliss Trio* • `Rp 185.000` • `Adopsi Sekarang 🌷` | *The Royal Crimson Velvet* • `Rp 275.000` • `Pesan Mahakarya 🌹` | *Sunshine Bear Graduation* • `Super Gemas!` |
| **Suasana Visual (Aura)** | Lembut, hangat, santai, romantis bersahaja | Mewah, prestisius, puitis berkelas, eksklusif | Ceria, seru, sahabat karib, penuh perayaan |

---

### 21.4 Rencana Implementasi & Standardisasi Berkas Aset (`apps/web`)

1. **Pembuatan Aset Fisik Otentik Tanpa Mockup Screenshot:**
   * Menghasilkan berkas citra fisik asli `preview-tema-a.jpg` (Buket Tulip Pastel Korea di meja kayu linen) menggunakan generator visual resolusi tinggi.
   * Menghasilkan berkas citra fisik asli `preview-tema-b.jpg` (Buket Mawar Beludru Wine di pedestal marmer hitam dengan lampu LED) menggunakan generator visual resolusi tinggi.
   * Mempertahankan berkas citra fisik `preview-tema-c.jpg` (Buket Bunga Matahari Wisuda Beruang) yang telah disetujui.
2. **Eliminasi Total Screenshot Mini Website:**
   * Seluruh referensi gambar berkarakter website mockup pada komponen etalase digantikan 100% oleh aset foto fisik buket asli bertekstur kawat bulu nyata.
3. **Penyempurnaan Komponen `HeroSection.tsx`:**
   * Menyematkan struktur bingkai Polaroid otentik (dengan *chin label* dan *washi tape*) untuk Tema A.
   * Menyematkan struktur gerbang *European Arch* (dengan lis emas sampanye dan saklar lampu LED interaktif yang menyalakan pendaran peri malam hari) untuk Tema B.
   * Mempertahankan struktur *Chunky Squircle 3D* dengan lencana wiggle untuk Tema C.


---

## 22. Roadmap Implementasi & Panduan Eksekusi Bertahap (Step-by-Step Development Execution Plan)

Agar proses implementasi berjalan terarah, terukur, dan tidak menimbulkan *breaking changes* pada sistem monorepo yang sudah ada, eksekusi rekayasa perangkat lunak dibagi menjadi 5 fase bertahap (*phased rollout*):

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               ROADMAP PENGEMBANGAN SISTEM BERTAHAP                               │
├─────────────────┬─────────────────┬─────────────────┬──────────────────┬─────────────────────────┤
│     FASE 1      │     FASE 2      │     FASE 3      │      FASE 4      │         FASE 5          │
│ Data Modeling & │ Backend RESTful │ Admin Dashboard │ Storefront &     │ End-to-End QA,          │
│ Database Schema │ API Endpoints   │ Suite (Campaign)│ Portal Pelanggan │ Audit & Hardening       │
└─────────────────┴─────────────────┴─────────────────┴──────────────────┴─────────────────────────┘
```

---

### 22.1 Rincian Matriks Eksekusi Tiap Fase

#### 🔹 Fase 1: Database & Data Modeling Foundation (Supabase PostgreSQL & Prisma)
* **Tujuan:** Menyiapkan fondasi persistensi data yang kuat, relasional, dan terindeks sebelum menyentuh logika aplikasi.
* **Daftar Deliverables:**
  1. **Migrasi Tabel Kampanye (`campaign_settings`):** Menyimpan toggle switch, streak point, target stempel, dan radius COD beserta nilai subsidinya.
  2. **Migrasi Tabel Log Absensi & Stempel (`user_attendance_logs`, `user_stamp_cards`):** Pelacakan daily check-in dan kartu stempel belanja digital.
  3. **Migrasi Tabel Telemetri & Occasion (`user_event_logs`, `search_keyword_logs`, `customer_occasions`):** Menyimpan event telemetry ringan, kata kunci pencarian, dan agenda hari spesial pelanggan.
  4. **Seeding Default Configuration:** Memasukkan 1 record default kampanye ke `campaign_settings` agar antarmuka tidak mengalami *null reference*.
* **Verifikasi Kriteria (DoD Fase 1):**
  * `npx prisma db push` atau `prisma migrate dev` berhasil tanpa konflik skema.
  * Seluruh indeks (`session_id`, `event_name`, `keyword`, `user_phone`) terverifikasi aktif di Supabase Dashboard.

---

#### 🔹 Fase 2: Backend RESTful API & Business Logic (`apps/api`)
* **Tujuan:** Mengembangkan API endpoint yang aman, memiliki guard clause, dan terisolasi untuk melayani kebutuhan modul baru.
* **Daftar Deliverables:**
  1. **Routing Kampanye (`/api/v1/campaigns`):**
     * `GET /api/v1/campaigns`: Mengambil konfigurasi kampanye aktif untuk konsumsi publik/storefront.
     * `PUT /api/v1/admin/campaigns`: Endpoint terproteksi peran admin untuk memperbarui setting absensi, stempel, dan radius COD.
  2. **Routing Absensi & Loyalitas (`/api/v1/attendance`, `/api/v1/stamps`):**
     * `POST /api/v1/attendance/check-in`: Logika absensi harian (validasi 1 kali per hari, kalkulasi streak 7 hari berturut-turut, penambahan poin).
     * `GET /api/v1/stamps/my-card`: Mengambil status kartu stempel pengguna aktif.
  3. **Enhancement Validasi COD Geofencing (`/api/v1/cod-points/calculate`):**
     * Membaca konfigurasi `cod_max_radius_km` dan `cod_subsidy_type` dari database secara dinamis.
     * Menghitung apakah jarak titik temu <= radius promo dan total belanja >= batas minimum guna menerapkan potongan ongkir (100% / 50%).
  4. **Routing Telemetri & Zero-Result Search (`/api/v1/telemetry`):**
     * `POST /api/v1/telemetry/event`: Menampung log `user_events` secara asinkron (*fire-and-forget* agar tidak memperlambat respon web).
     * `POST /api/v1/telemetry/search`: Mencatat query pencarian dan menandai flag `is_zero_hit: true` jika hasil katalog kosong.
  5. **Routing Kalender Momen Spesial (`/api/v1/occasions`):**
     * `POST /api/v1/occasions`: Menyimpan tanggal momen spesial pelanggan dari profil/portal.
* **Verifikasi Kriteria (DoD Fase 2):**
  * Unit test endpoint menggunakan Vitest/Supertest lulus 100%.
  * Guard clause menolak check-in ganda di hari yang sama dengan kode status `409 Conflict`.

---

#### 🔹 Fase 3: Admin Dashboard Suite - Menu Campaigns (`apps/web/src/components/admin`)
* **Tujuan:** Memberikan antarmuka intuitif bagi pemilik atelier untuk memantau performa dan mengontrol seluruh kampanye.
* **Daftar Deliverables:**
  1. **Registrasi Tab Navigasi "Campaigns" di `AdminViews.tsx`:** Menjaga persistensi menu menggunakan arsitektur URL query + local storage.
  2. **Sub-Modul 1: Pengaturan Daily Attendance:** Toggle switch, form poin harian, target streak, dan reward kupon.
  3. **Sub-Modul 2: Pengaturan Digital Stamp Card:** Form batas minimum belanja per stempel, target cap, dan dropdown pemilihan buket hadiah gratis.
  4. **Sub-Modul 3: Pengaturan Promo Subsidi COD Radius:** Input jarak desimal (KM), skema diskon ongkir (100% Gratis / 50% Subsidi / Kustom), dan teks banner promosi.
  5. **Widget Analisis Telemetri & Funnel:**
     * Visualisasi tingkat konversi Custom Studio (Step 1 -> 2 -> 3 -> 4).
     * Tabel daftar 10 kata kunci pencarian teratas yang menghasilkan *zero hit* (produk belum ada).
* **Verifikasi Kriteria (DoD Fase 3):**
  * Form admin mampu melakukan *save* dan merefleksikan perubahan secara instan ke database.
  * Toggle non-aktif langsung mematikan fitur terkait di sisi etalase pembeli.

---

#### 🔹 Fase 4: Storefront Refactoring, Multi-Theme Copywriting & Customer Portal UI (`apps/web`)
* **Tujuan:** Meningkatkan estetika visual etalase, menyematkan copywriting berkarakter per tema, dan menghidupkan fitur loyalitas pelanggan.
* **Daftar Deliverables:**
  1. **Refactoring `HeroSection.tsx` (Bespoke Product Showcase):**
     * Mengganti kartu miniatur screenshot web dengan visual foto fisik buket bunga kawat bulu asli resolusi tinggi.
     * Mengintegrasikan *floating badges* (velvet kawat bulu, switch lampu peri LED, proteksi kardus tebal).
     * Menerapkan aksen bingkai spesifik tema (Polaroid + washi tape pada Tema A, Classical Arch pada Tema B, 3D puffy pill pada Tema C).
  2. **Penerapan Matriks Copywriting Multi-Tema (Seksi 20):**
     * Menghubungkan kamus teks berkarakter pada Announcement Bar, Hero Headline, Button CTA, Deskripsi Produk, dan Empty State sesuai tema aktif.
  3. **Penyempurnaan Custom Studio Interaktif:**
     * Menambahkan tombol **`[🪄 Rekomendasi Paduan Warna Florist]`** di Step 3 untuk memilihkan warna wrapping & pita serasi dalam 1-klik.
  4. **Pembaruan Cart Drawer & Smart Micro-Upsell:**
     * Menambahkan opsi add-on kartu akrilik lagu kenangan Spotify QR Code dan lampu fairy light LED sebelum tombol checkout.
     * Badge promo ongkir otomatis pada opsi pengiriman COD Titik Temu berdasarkan radius.
  5. **Pembaruan Customer Portal (`/portal`):**
     * Komponen interaktif **Absensi Harian & Rawat Bunga** dengan animasi mekar saat absen.
     * Komponen visual **Kartu 5 Stempel Belanja** dengan progress bar dan tombol klaim hadiah buket gratis.
     * Formulir pencatat **Kalender Momen Spesial** untuk pengingat wisuda/anniversary.
* **Verifikasi Kriteria (DoD Fase 4):**
  * Tampilan etalase pada Tema A, B, dan C memiliki diferensiasi visual dan gaya bahasa yang kentara dan tidak seragam.
  * Interaksi absensi dan stempel terhubung mulus dengan API backend.

---

#### 🔹 Fase 5: End-to-End Verification, QA & Pre-Launch Hardening
* **Tujuan:** Menguji ketahanan fungsional, performa beban, dan estetika visual secara komprehensif.
* **Daftar Deliverables:**
  1. **Uji Skenario Alur Pembelian & Loyalitas:**
     * Pembeli absen harian -> klaim kupon -> rangkai buket di Studio dengan rekomendasi florist -> checkout COD titik temu dengan promo gratis ongkir 5 KM.
     * Pembelian selesai (status `COMPLETED`) -> verifikasi +1 stempel otomatis bertambah di kartu.
  2. **Uji Batas Geofencing Google Maps:**
     * Menguji titik temu di jarak 1.5 KM (gratis 100%), 4.0 KM (diskon 50% atau min. spend), dan 6.5 KM (rekomendasi kurir Biteship).
  3. **Audit Performa & Aksesibilitas (Lighthouse / UI Pro Max Standards):**
     * Memastikan gambar WebP buket asli terkompresi optimal (< 250 KB per gambar).
     * Waktu load halaman awal di bawah 1.5 detik.
     * Tidak ada error/warning console pada browser.
* **Verifikasi Kriteria (DoD Fase 5):**
  * Semua tes otomatis (Vitest + Playwright) lulus tanpa kendala.
  * Aplikasi siap dideploy ke staging dan produksi Vercel.

---

## 23. Arsitektur Sinkronisasi Real-Time & Transisi Visual Halus (Real-Time Reactive State & Smooth Multi-View Synchronization)

Seksi ini menetapkan arsitektur teknis dan standar antarmuka untuk sinkronisasi seketika (*real-time reactive synchronization*) antara Admin Dashboard, Live Preview Browser, dan Storefront Publik pelanggan tanpa mengharuskan refresh manual, serta standar transisi animasi halus (*zero-flicker smooth CSS motion*) saat terjadi perubahan status operasional.

### 23.1 Problem Statement & Kebutuhan Pengguna
1. **Kendala Mode Pemeliharaan (Maintenance Mode):**
   - Sebelumnya, tombol toggle mode pemeliharaan di Admin Dashboard hanya mengubah state lokal React dan tidak tersimpan ke basis data `store_settings`.
   - Etalase pelanggan tidak secara otomatis beralih ke tampilan pemeliharaan secara real-time tanpa me-refresh halaman web secara manual.
2. **Kendala Live Preview Tema & Cross-Tab Sync:**
   - Iframe pratinjau di menu Admin `MaintenanceThemeView` menggunakan URL statis (`/`) tanpa mekanisme komunikasi dua arah (*cross-window messaging*), sehingga ketika admin memilih tema baru, iframe tidak berubah secara seketika.
   - Pergantian tema antar-tema terasa instan/kaku atau memerlukan refresh penuh, tanpa ada transisi warna dan tata letak yang mulus (*smooth cross-fade animation*).

---

### 23.2 Arsitektur Sinkronisasi 4-Lapis (4-Tier Real-Time Synchronization Engine)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│             ARSITEKTUR SINKRONISASI REAL-TIME & REACTIVE MULTI-VIEW              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 1. Zero-Latency BroadcastChannel API ('chenille_storefront_sync') + postMessage  │
│    └─ Sinkronisasi 0ms antar Tab Admin, Iframe Preview, & Tab Storefront         │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 2. PostgreSQL Supabase Single Source of Truth (Tabel store_settings)             │
│    └─ Kolom is_maintenance_mode, maintenance_title, maintenance_desc, active_theme│
├──────────────────────────────────────────────────────────────────────────────────┤
│ 3. REST API Endpoint: PATCH /api/v1/admin/settings & GET /settings               │
│    └─ Validasi input, atomic update, dan broadcasting status operasional toko    │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 4. Periodic Heartbeat Polling & Visibility Listener (Cross-Device Sync)         │
│    └─ Polling latar belakang (setiap 10s & on-focus) untuk sinkronisasi beda HP/PC│
└──────────────────────────────────────────────────────────────────────────────────┘
```

#### A. Lapis 1: Zero-Latency Client BroadcastChannel & PostMessage
* Menggunakan browser native `BroadcastChannel('chenille_storefront_sync')`.
* Saat Admin mengubah tema atau mengaktifkan mode pemeliharaan, event disiarkan ke seluruh window/tab/iframe pada origin yang sama:
  * Event Tema: `{ type: 'THEME_CHANGED', theme: 'tema-a' | 'tema-b' | 'tema-c' }`
  * Event Pemeliharaan: `{ type: 'MAINTENANCE_TOGGLED', isMaintenanceMode: boolean, title?: string, desc?: string }`
* Iframe Live Preview di `MaintenanceThemeView` mendengarkan event via `BroadcastChannel` dan `window.postMessage`, lalu memperbarui state secara seketika tanpa melakukan reload halaman.

#### B. Lapis 2 & 3: Persistensi Database & API Kontrak
* Database Supabase `store_settings`:
  * `is_maintenance_mode BOOLEAN DEFAULT false`
  * `maintenance_title TEXT DEFAULT 'Atelier Chenille Sedang Istirahat Produksi'`
  * `maintenance_desc TEXT DEFAULT 'Kapasitas buket wisuda hari ini telah penuh.'`
* Endpoint `PATCH /api/v1/admin/settings` mendukung mutasi ketiga kolom di atas.
* Endpoint `GET /api/v1/admin/settings` mengembalikan status pemeliharaan ke storefront publik.

#### C. Lapis 4: Cross-Device Reactive Polling & Tab Visibility Listener
* Komponen `StorefrontPage` dan `PortalPage` menyematkan listener `document.addEventListener('visibilitychange')`.
* Saat pelanggan membuka kembali tab browser mereka, atau setiap 15 detik di latar belakang, sistem mengecek endpoint pengaturan toko untuk mendeteksi apakah admin sedang menyalakan mode pemeliharaan atau mengganti tema, sehingga sinkronisasi lintas perangkat (PC ke HP atau browser berbeda) berjalan otomatis.

---

### 23.3 Standar Transisi Visual Animasi Halus (Smooth Motion & Zero-Flicker Transitions)

1. **Transisi Global Tema (Smooth Theme Cross-Fade):**
   * Menyematkan kelas utilitas transisi CSS pada elemen akar `html`, `body`, dan kontainer kartu etalase:
     ```css
     html, body, [data-theme], .theme-transition {
       transition: background-color 0.45s cubic-bezier(0.4, 0, 0.2, 1),
                   color 0.45s cubic-bezier(0.4, 0, 0.2, 1),
                   border-color 0.45s cubic-bezier(0.4, 0, 0.2, 1),
                   box-shadow 0.45s cubic-bezier(0.4, 0, 0.2, 1);
     }
     ```
   * Efek animasi masuk (*smooth fade-scale*) pada Hero Section saat tema berganti agar terasa dinamis, mewah, dan hidup.

2. **Tampilan Mode Pemeliharaan Estetis (Aesthetic Atelier Maintenance Screen):**
   * Ketika `is_maintenance_mode === true`:
     * Muncul layar pemeliharaan penuh (*full-screen maintenance view*) atau modal overlay kaca lembut (*glassmorphism backdrop blur*).
     * Ikon animasi: Bunga kawat bulu dengan animasi denyut napas (*gentle breathing pulse*).
     * Judul: *"Atelier Chenille Sedang Istirahat Produksi 🌸"* (atau judul dinamis dari database).
     * Deskripsi: *"Kapasitas perakitan buket wisuda hari ini telah terpenuhi demi menjaga kualitas kerapian terbaik. Pemesanan akan dibuka kembali segera."*
     * Tombol Aksi:
       1. **Konsultasi Darurat via WhatsApp:** Mengarahkan ke nomor resmi atelier dengan pesan otomatis: *"Halo Atelier Chenille, saya ingin menanyakan ketersediaan slot buket untuk hari ini."*
       2. **Tombol Masuk Admin (Bypass):** Membuka modal login admin agar pengrajin/pemilik toko tetap dapat mengakses dashboard admin tanpa terblokir.
     * Transisi keluar/masuk menggunakan animasi `fade-in` dan `scale-in-95` berdurasi 400ms.


---

## 24. Standar Viewport & Pencegahan Horizontal Overflow Mobile (Native App-Like Viewport & X-Axis Spill Elimination)

Seksi ini menetapkan aturan teknis, standar CSS, dan tata letak responsif untuk memastikan aplikasi web Chenille Flowers Atelier memiliki perilaku tampilan yang terkunci rapat (*fixed viewport*) seperti aplikasi Android / iOS native, bebas dari pergeseran horizontal (*zero horizontal scroll / no x-axis spill*), dan mulus saat digulir vertikal di seluruh ukuran perangkat layar sentuh (mobile/smartphone).

### 24.1 Problem Statement & Root Cause Analysis (Analisis Akar Masalah)
1. **Unbounded Document Canvas (`html` & `body`):**
   * Berkas `globals.css` sebelumnya belum menyematkan pembatas ketat `max-width: 100vw`, `overflow-x: hidden`, dan `overscroll-behavior-x: none` pada elemen `html` dan `body`.
   * Akibatnya, jika ada satu saja elemen turunan (*child element*) yang lebarnya melebihi lebar layar sebanyak 1 pixel saja (karena padding, margin negatif, rotasi transform, atau teks yang tidak *wrap*), browser mobile secara otomatis memunculkan *scroll-track* horizontal dan memungkinkan seluruh halaman digeser/ditarik ke kanan (*horizontal panning*).
2. **Viewport Meta Tag Permissive Configuration:**
   * Pada `apps/web/src/app/layout.tsx`, objek `viewport` sebelumnya menggunakan `maximumScale: 5` tanpa atribut `userScalable: false` dan `viewportFit: 'cover'`. Hal ini memicu perilaku zoom & pan browser bawaan saat pengguna menyentuh layar secara diagonal atau horizontal.
3. **Negative Margin Bleed pada Navigasi Mobile:**
   * Komponen `Navbar.tsx` menyematkan kelas `-mx-4 px-4 sm:-mx-6 sm:px-6` pada baris menu navigasi horizontal mobile tanpa adanya `overflow-hidden` pada tag `<header>` induk, sehingga margin negatif dapat merembes keluar (*bleed*) dari batas kanvas dokumen.
4. **Transform Bounding Box & Squeezed Cards pada Hero Section:**
   * Pada `HeroSection.tsx` Tema A, banner card tidak memiliki `overflow-hidden`. Kartu polaroid berotasi `rotate-[-1.5deg]` dan stiker washi tape (`-top-3.5 w-32`) menjulur keluar dari kotak grid.
   * Kartu produk di bagian bawah polaroid menggunakan layout flexbar dengan tombol `whitespace-nowrap` yang pada layar smartphone sempit (< 375px) menyebabkan konten tertekan dan meluap ke samping.
5. **Fixed Popover Widths pada Filter Bar:**
   * Popover filter harga pada `ProductFilterBar.tsx` memiliki lebar tetap `w-72` atau `w-80` yang jika dibuka di dekat tepi layar smartphone dapat melampaui batas kanan viewport.

---

### 24.2 Standar Rekayasa App-Like Viewport (The 5 Pillars of Mobile Viewport Lockdown)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│           THE 5 PILLARS OF APP-LIKE MOBILE VIEWPORT LOCKDOWN (PRD 24)            │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 1. Viewport Meta: width=device-width, initial-scale=1, max-scale=1, no-scalable  │
│ 2. Document Reset: html, body { max-width: 100vw; overflow-x: hidden; }         │
│ 3. Touch Gesture Lockdown: touch-action: pan-y; overscroll-behavior-x: none;     │
│ 4. Structural Isolation: wrappers & headers { w-full max-w-full overflow-hidden }│
│ 5. Safe Element Sizing: Popover & Modals { max-w-[calc(100vw-2rem)] }            │
└──────────────────────────────────────────────────────────────────────────────────┘
```

#### A. Pilar 1: Viewport Meta Tag App-Like Lockdown (`layout.tsx`)
* Konfigurasi metadata Viewport wajib menggunakan spesifikasi native app:
  ```ts
  export const viewport: Viewport = {
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#FFF5F7' },
      { media: '(prefers-color-scheme: dark)', color: '#181216' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  };
  ```

#### B. Pilar 2 & 3: CSS Canvas Boundary & Touch Gesture Control (`globals.css`)
* Seluruh deklarasi canvas wajib mengunci pergerakan sumbu horizontal:
  ```css
  html,
  body {
    max-width: 100vw;
    width: 100%;
    overflow-x: hidden;
    position: relative;
    touch-action: pan-y;
    overscroll-behavior-x: none;
    -webkit-overflow-scrolling: touch;
  }
  ```
* Kelas utilitas `.theme-transition` dan kontainer utama etalase wajib menyertakan `w-full max-w-full overflow-x-hidden`.

#### C. Pilar 4: Isolasi Struktur Kontainer (`Navbar`, `HeroSection`, `page.tsx`)
* Tag `<header>` pada `Navbar.tsx` wajib memiliki kelas `w-full max-w-full overflow-hidden`.
* Baris menu scroll horizontal mobile pada `Navbar.tsx` dan `CategoryFilter.tsx` wajib disematkan `touch-pan-x overscroll-x-contain` agar usapan horizontal pengguna terisolasi hanya di dalam wadah pill filter dan tidak menyeret halaman utama.
* Banner card `HeroSection.tsx` Tema A wajib menyertakan `overflow-hidden` setara dengan Tema B dan Tema C.
* Kartu produk di kaki polaroid Tema A wajib beradaptasi secara fleksibel (`flex-col sm:flex-row sm:items-center`) dengan proteksi `min-w-0 truncate` agar tidak mendorong batas lebar pada layar < 375px.

#### D. Pilar 5: Popover & Floating Modal Mobile Safeguard (`ProductFilterBar.tsx`, `LiveChatWidget.tsx`)
* Seluruh modal, popover, dan floating widget tidak boleh menggunakan lebar pixel mutlak tanpa pembatas responsif.
* Popover filter wajib dibatasi menggunakan `w-[calc(100vw-2.5rem)] sm:w-80 max-w-xs` agar selalu memiliki margin aman minimal 16px dari tepi layar pada semua tipe smartphone Android dan iPhone.


---

## 25. Mitigasi Stale Service Worker & Stabilitas HMR DevTools Next.js 15 (Dev Server Stability & Service Worker Purge Protocol)

Seksi ini menetapkan tata kelola rekayasa dan standar konfigurasi untuk mengatasi kendala siklus hidup server pengembangan (*Next.js 15 development server*), khususnya error `500` berulang pada `/sw.js`, kesalahan `TypeError: Cannot read properties of undefined (reading '/_app')`, dan desinkronisasi `React Client Manifest` pada modul internal `segment-explorer-node.js#SegmentViewNode` saat Hot Module Replacement (HMR) aktif.

### 25.1 Problem Statement & Root Cause Analysis (Analisis Akar Masalah)
1. **Siklus Konflik Stale Service Worker di `localhost:3000`:**
   * Pengembang atau browser pengguna yang pernah mengunjungi aplikasi web lain di domain/port `http://localhost:3000` (atau versi PWA sebelumnya) menyimpan pendaftaran *Service Worker* aktif dengan scope `/` yang menunjuk ke `/sw.js`.
   * Setiap kali browser memuat atau me-refresh halaman di `localhost:3000`, peramban secara otomatis mengirimkan request latar belakang `GET /sw.js`.
   * Karena aplikasi Chenille Atelier menggunakan arsitektur murni **Next.js 15 App Router** (tanpa direktori `pages/` dan tanpa `pages/_app.tsx`), request ke berkas yang tidak ada (`/sw.js`) memicu mekanisme fallback Pages Router internal Next.js:
     ```
     [TypeError: Cannot read properties of undefined (reading '/_app')]
     GET /sw.js 500
     ```
   * Akibatnya, *Service Worker zombie* tersebut gagal memperbarui diri, mengalami *crash loop*, dan menginterupsi *Fast Refresh* / *Hot Module Replacement* (HMR), bahkan menyebabkan rute utama `/` ikut terkena `500`.
2. **Next.js 15 DevTools Segment Explorer RSC Manifest Desynchronization:**
   * Pada Next.js 15.1+, fitur internal DevTools / Dev Overlay memperkenalkan komponen `segment-explorer-node.js#SegmentViewNode` untuk visualisasi segmentasi rute.
   * Pada lingkungan pengembangan dengan HMR dinamis di Windows / monorepo Turborepo, modul internal ini mengalami *manifest lookup failure*:
     ```
     Could not find the module ".../node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js#SegmentViewNode" in the React Client Manifest.
     This is probably a bug in the React Server Components bundler.
     ```
   * Hal ini menyebabkan dev server menampilkan layar merah error overlay dan memutus koneksi WebSocket HMR secara acak saat kode diubah.

---

### 25.2 Standar Solusi 3-Lapis (3-Tier Dev Server Stability Protocol)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│              3-TIER DEV SERVER STABILITY & SERVICE WORKER PURGE                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 1. next.config.ts: devIndicators: false (Mencegah RSC DevTools Crash)            │
│ 2. apps/web/public/sw.js: Self-Unregistering Service Worker (200 OK & Auto-Purge)│
│ 3. apps/web/src/app/layout.tsx: Immediate Client-Side SW Registration Cleanup     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

#### A. Lapis 1: Menonaktifkan DevTools Segment Explorer (`next.config.ts`)
* Pada `apps/web/next.config.ts`, properti `devIndicators: false` disematkan untuk menonaktifkan indikator dev dan segment explorer bermasalah:
  ```ts
  const nextConfig: NextConfig = {
    transpilePackages: ['@chenille/shared'],
    compress: true,
    poweredByHeader: false,
    devIndicators: false,
    // ...
  };
  ```
* Dampak: Menghilangkan total error `Could not find the module ... segment-explorer-node.js#SegmentViewNode in the React Client Manifest` dan menjaga HMR tetap stabil 60fps tanpa interupsi.

#### B. Lapis 2: Berkas Pembersih Otomatis Mandiri (`apps/web/public/sw.js`)
* Menyediakan berkas statis `public/sw.js` yang secara otomatis mencabut (*unregister*) dirinya sendiri dan melepaskan kontrol peramban:
  ```js
  self.addEventListener('install', () => {
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      self.registration
        .unregister()
        .then(() => self.clients.matchAll())
        .then((clients) => {
          clients.forEach((client) => {
            if (client.url && 'navigate' in client) {
              client.navigate(client.url);
            }
          });
        })
    );
  });
  ```
* Dampak: Request `GET /sw.js` dari browser langsung direspons HTTP `200 OK` (statis tanpa menyentuh Pages Router fallback), dan service worker lawas langsung dibersihkan dari browser.

#### C. Lapis 3: Skrip Pembersih Sisi Klien di Root Layout (`layout.tsx`)
* Di `<head>` berkas `layout.tsx`, ditambahkan skrip eksekusi dini:
  ```js
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(regs) {
      for (var i = 0; i < regs.length; i++) {
        regs[i].unregister();
      }
    });
  }
  ```
* Dampak: Menjamin setiap klien atau browser pengembang yang membuka aplikasi akan langsung memusnahkan sisa Service Worker tanpa memerlukan intervensi manual buka tab *Application > Clear Site Data*.


---

## 26. Arsitektur Manajemen Konten Dinamis Custom Studio (Dynamic Custom Studio Management Suite)

Seksi ini menetapkan tata kelola rekayasa, skema basis data, kontrak API backend, dan antarmuka Admin Panel untuk pengelolaan seluruh varian dan elemen **Custom Studio Interaktif** secara dinamis (*zero hardcoded options*), sehingga pemilik atelier dapat mengelola harga, nama, deskripsi, warna hex, gambar/emoji, dan ketersediaan stok setiap opsi kustomisasi buket secara langsung dari dashboard admin.

### 26.1 Problem Statement & Kebutuhan Pengguna
1. **Ketergantungan Kode Tetap (Hardcoded In-Memory Arrays):**
   * Komponen etalase `CustomStudioSection.tsx` sebelumnya mendefinisikan 7 array opsi kustomisasi (`FLOWERS`, `COLORS`, `WRAPPINGS`, `RIBBONS`, `PACKAGINGS`, `GREETINGS`, `ADDONS`) secara statis di dalam kode program React.
   * Setiap penambahan bunga baru (misal: *Daisy Korea*, *Peony Velvet*), kenaikan harga material, atau pergantian palet warna kawat bulu menuntut modifikasi berkas kode dan deployment ulang aplikasi.
2. **Ketiadaan Kontrol Operasional Harian bagi Florist:**
   * Jika stok kertas wrapping *Korean Two-Tone Pink* atau lampu LED sedang habis di atelier, florist tidak memiliki sakelar (*toggle*) di dashboard admin untuk menonaktifkan opsi tersebut sementara dari pilihan pelanggan.
3. **Kepatuhan Mutlak Zero-Dummy (PRD Seksi 1.2 & RULES.md):**
   * Seluruh entitas transaksi dan perakitan buket kustom wajib terhubung dengan tabel fisik PostgreSQL `custom_studio_options` di Supabase.

---

### 26.2 Skema Basis Data & 7 Kategori Opsi (`custom_studio_options`)

Tabel PostgreSQL `custom_studio_options` di Supabase menyimpan seluruh konfigurasi elemen:

```sql
CREATE TABLE IF NOT EXISTS custom_studio_options (
  id VARCHAR(50) PRIMARY KEY,
  category custom_category NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price_modifier DECIMAL(12, 2) DEFAULT 0,
  emoji_or_icon VARCHAR(50),
  hex_color VARCHAR(20),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);
```

#### 7 Kategori Opsi Resmi:
1. `FLOWER_TYPE`: Bunga Utama (Tulip, Mawar, Matahari, Lavender, dsb). Memiliki `price_modifier` sebagai harga dasar buket dan `emoji_or_icon`.
2. `CHENILLE_COLOR`: Varian Warna Kawat Bulu (Pastel Pink, Lavender Lilac, Sky Blue, Matcha Sage, dsb). Memiliki `hex_color` untuk preview kanvas dinamis.
3. `WRAPPING_STYLE`: Kertas Pembungkus Cellophane (Korean Two-Tone, Lilac Velvet, Clean Oat, dsb). Memiliki `description` jenis kertas dan `price_modifier`.
4. `RIBBON_STYLE`: Pita Penghias (Pita Satin, Organza Transparan, Chiffon Ruffle, Tali Rami). Memiliki `price_modifier` dan `emoji_or_icon`.
5. `PACKAGING_BOX`: Kemasan Pelindung (Standard Sleeve, Box Jendela Mika, Tas PVC Bening, Paper Bag Mewah). Memiliki `price_modifier` dan `emoji_or_icon`.
6. `GREETING_SEAL`: Kartu Ucapan & Segel (Kartu Standard Cetak, Hotprint Gold Foil, Vintage Wax Seal Stamp). Memiliki `price_modifier` dan `emoji_or_icon`.
7. `ACCESSORY_ADDON`: Aksesori Tambahan Upselling (Lampu LED Fairy Light, Boneka Toga Mini, Pin Bros Kristal). Memiliki `price_modifier` dan `emoji_or_icon`.

---

### 26.3 Kontrak RESTful API Backend (`apps/api`)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   KONTRAK ENDPOINT API CUSTOM STUDIO SUITE                       │
├─────────┬──────────────────────────────────┬─────────────────────────────────────┤
│ METHOD  │ ENDPOINT                         │ DESKRIPSI & OTORISASI               │
├─────────┼──────────────────────────────────┼─────────────────────────────────────┤
│ GET     │ /api/v1/custom-studio            │ Publik: Mengambil opsi aktif (7 kat)│
│ GET     │ /api/v1/admin/custom-studio      │ Admin: Mengambil seluruh opsi       │
│ POST    │ /api/v1/admin/custom-studio      │ Admin: Tambah opsi baru             │
│ PUT     │ /api/v1/admin/custom-studio/:id  │ Admin: Update nama, harga, visual   │
│ DELETE  │ /api/v1/admin/custom-studio/:id  │ Admin: Hapus opsi dari database     │
│ PATCH   │ /api/v1/admin/custom-studio/:id/toggle │ Admin: Sakelar aktif/nonaktif  │
└─────────┴──────────────────────────────────┴─────────────────────────────────────┘
```

#### Format Respon `GET /api/v1/custom-studio`:
```json
{
  "success": true,
  "data": {
    "raw": [...],
    "grouped": {
      "FLOWER_TYPE": [...],
      "CHENILLE_COLOR": [...],
      "WRAPPING_STYLE": [...],
      "RIBBON_STYLE": [...],
      "PACKAGING_BOX": [...],
      "GREETING_SEAL": [...],
      "ACCESSORY_ADDON": [...]
    }
  }
}
```

---

### 26.4 Desain Antarmuka Admin Panel (Tab "STUDIO")

1. **Navigasi Tab Kategori:**
   * Filter pill horizontal untuk beralih antara 7 kategori opsi secara instan.
2. **Tabel Data Interaktif:**
   * Kolom: Visual (Emoji/Warna Hex), Nama & Kategori, Deskripsi, Harga Dasar / Tambahan (+Rp), Urutan Tampil (`sort_order`), Status Aktif (Switch Button), dan Tombol Tindakan (Edit & Hapus).
3. **Modal Tambah & Edit Opsi:**
   * Form validasi dengan input: Nama Opsi, Kategori (Dropdown 7 tipe), Nominal Harga (Rp), Ikon/Emoji, Hex Color Picker (aktif untuk kategori warna), Deskripsi Singkat, dan Urutan Tampil.
4. **Pembaruan Seketika (Real-Time Storefront Sync):**
   * Saat admin menyimpan opsi baru atau mengubah harga, etalase toko yang dimuat pengunjung langsung mengonsumsi data terbaru via API tanpa perlu menyunting kode.

---

## Seksi 27: Standarisasi Terminologi Domain Kerajinan Tangan (Handmade Bouquet Linguistic Standardization & Elimination of Food/Pharma Confusion) — v3.1

### 27.1 Latar Belakang & Pernyataan Kebijakan Domain
Chenille Flowers Atelier adalah bisnis e-commerce kerajinan tangan (*handcrafted flower bouquets*) yang memproduksi dan menjual buket bunga kawat bulu (*chenille stems / velvet wire*), bukan produk makanan, minuman, obat-obatan, maupun kosmetik.

> [!IMPORTANT]
> **PENETAPAN BATAS DOMAIN (NON-FOOD & NON-PHARMA POLICY):**
> 1. **Bebas dari Regulasi Makanan & Farmasi:** Sistem Chenille Flowers Atelier tidak tunduk dan tidak memerlukan sertifikasi BPOM (Badan Pengawas Obat dan Makanan), izin edar P-IRT, tabel nutrisi/gizi, ataupun tanggal kadaluarsa konsumsi.
> 2. **Eliminasi Kerancuan "BOM vs BPOM":** Istilah industri manufaktur/akuntansi **"BOM"** (*Bill of Materials*) yang sebelumnya disandingkan dengan kata **"Resep"** ("Resep BOM") rentan disalahpahami sebagai "BPOM" atau resep makanan/obat oleh pengguna Indonesia.
> 3. **Standarisasi Bahasa Indonesia yang Natural:** Seluruh teks antarmuka dan dokumentasi perancangan wajib menggunakan istilah yang natural, anggun, dan tepat bagi sebuah atelier kerajinan buket bunga (misal: "Komposisi Bahan & HPP", bukan "Resep BOM").

---

### 27.2 Glosarium Resmi Standarisasi Terminologi Atelier

Berikut adalah tabel padanan resmi terminologi Chenille Flowers Atelier untuk menggantikan istilah warisan yang memicu kerancuan:

| Konsep Bisnis | ❌ Istilah Warisan (Rancu Makanan/BPOM) | ✅ Terminologi Resmi Atelier (Elegan & Tepat) | Penjelasan Kontekstual |
| :--- | :--- | :--- | :--- |
| **Daftar Kebutuhan Bahan Per Buket** | `Resep BOM Produk` / `Resep Bahan` | **Komposisi Bahan Buket** | Rincian kebutuhan kawat bulu, kain wrapping, pita, boneka, dan kardus untuk 1 unit buket. |
| **Menu Sidebar / Tab Admin** | `Bahan Baku & Resep BOM` | **Bahan Baku & Komposisi HPP** | Navigasi menu untuk mengelola stok bahan mentah dan kalkulator biaya modal riil per buket. |
| **Kalkulator Biaya Pokok Produksi** | `BOM & HPP Calculator` | **Kalkulator Komposisi HPP** | Alat hitung otomatis harga pokok produksi berdasarkan harga beli bahan baku supplier. |
| **Alasan Bahan Afkir / Rusak Gudang** | `KADALUARSA_SIMPAN` (Kadaluarsa Simpan) | **Lama Simpan / Berdebu / Usang** | Bunga kawat bulu tidak memiliki tanggal kadaluarsa; bahan afkir murni karena kotor, berdebu, atau usang di gudang. |
| **Sampel Buket Pajangan Toko** | `SAMPLE_DISPLAY_EXPIRED` | **Sampel Display Usang / Rusak** | Buket display yang sudah terlalu lama dipajang di etalase dan tidak layak jual. |
| **Penyimpanan Perubahan Formulasi** | `Simpan Perubahan Resep` | **Simpan Komposisi Bahan** | Tombol konfirmasi penyimpanan kebutuhan bahan baku produk buket. |

---

### 27.3 Aturan Audit Kepatuhan Antarmuka Pengguna (UI Compliance Rules)
1. **Dilarang Menampilkan Singkatan "BOM" Tanpa Konteks:** Pada teks yang dilihat pengguna atau staf florist, gunakan istilah **"Komposisi Bahan & HPP"**. Jika singkatan teknis dibutuhkan untuk kebutuhan data kontrak backend, beri keterangan jelas *(Bill of Materials)*.
2. **Dilarang Menggunakan Kata "Kadaluarsa" untuk Bahan Fisik:** Kata "kadaluarsa" (*expired*) hanya diizinkan untuk entitas digital yang memiliki batas waktu numerik, yaitu:
   * Batas waktu pembayaran pesanan (*Payment Gateway countdown / expired*).
   * Batas masa berlaku kode kupon promosi (*Coupon validity date*).
   * Batas masa aktif kartu stamp loyalty digital (*Digital stamp card expiry*).
   Bahan baku kerajinan (kawat bulu, pita, kertas wrapping) **dilarang** menggunakan kata kadaluarsa.
3. **Pemberian Label Bersih & Mewah:** Seluruh modal, tabel, dan kartu analitik di panel admin mencerminkan citra *artisan flower boutique* yang eksklusif, rapi, dan bebas dari anomali istilah teknis yang membingungkan.

---

## Seksi 28: Sinkronisasi Kontrak Aset Gambar Produk & Multi-Layer Defensive Fallback Architecture — v3.2

### 28.1 Latar Belakang Masalah & Investigasi Akar Penyebab (Root Cause Analysis)
Pada pengujian antarmuka etalase produk (`apps/web`), ditemukan anomali visual di mana kartu produk katalog gagal menampilkan gambar (*broken image icon* dan teks *alt* fallback), sementara pada panel admin (`/admin?tab=PRODUCTS`) gambar produk tampil dengan thumbnail yang sempurna.

Berdasarkan audit end-to-end terhadap seluruh alur data dari database hingga rendering DOM:
1. **Ketidakcocokan Skema Properti (`image_url` vs `image`):**
   * **Database & API Layer (`apps/api`):** Tabel database Supabase Postgres menyimpan URL aset pada kolom `image_url`. Endpoint `GET /api/v1/products` mengembalikan objek baris Postgres dengan properti `image_url`.
   * **Frontend Shared Contract (`packages/shared`):** Antarmuka `ExtendedProduct` mendefinisikan properti gambar dengan nama `image: string` (mengacu pada kontrak awal mock data storefront).
   * **Inkonsistensi Konsumsi Data:** Pada storefront `apps/web/src/app/page.tsx`, hasil panggilan API langsung di-assign ke state `setProductsList(res.data.products)` tanpa mapper adapter. Akibatnya, `product.image` bernilai `undefined`, memicu `<img src="undefined" />` pada `ProductCard.tsx`. Sebaliknya, pada `AdminViews.tsx`, developer sebelumnya telah menyematkan mapper manual `image: p.image_url || '/images/products/buket-mawar-merah-velvet.jpg'`, sehingga panel admin tidak terpengaruh.
2. **Ketidakcocokan Konvensi Kasus Huruf (snake_case vs camelCase):**
   * Postgres mengembalikan properti dalam snake_case (`po_lead_days`, `review_count`, `is_ready_stock`, `discount_price`).
   * Komponen etalase (`ProductCard.tsx`) membaca properti dalam format camelCase (`product.poLeadDays`, `product.reviewCount`).
   * Anomali ini menyebabkan badge PO menampilkan teks mentah `⏱ PO Hari` tanpa jumlah hari, serta rating menampilkan `★ 5 ()` tanpa jumlah ulasan.
3. **Integritas Aset Fisik:**
   * Seluruh 8 file gambar produk fisik (resolusi tinggi, rasio 1:1, format JPG terkompresi optimal) terbukti ada dan valid di direktori `apps/web/public/images/products/`.

---

### 28.2 Arsitektur Dual-Contract Compatibility pada REST API Backend (`apps/api`)
Untuk memastikan backward compatibility dengan komponen yang membaca snake_case maupun camelCase, endpoint produk backend (`products.routes.ts`) mengimplementasikan dual alias pada query SQL dan response object:

```sql
SELECT 
  p.id,
  p.name,
  p.slug,
  p.category_id,
  c.name as category,
  c.slug as category_slug,
  p.price::float as price,
  p.discount_price::float as discount_price,
  p.discount_price::float as "discountPrice",
  p.raw_cost_hpp::float as raw_cost_hpp,
  p.raw_cost_hpp::float as "rawCostHpp",
  p.stock,
  p.po_lead_days,
  p.po_lead_days as "poLeadDays",
  p.click_count,
  p.click_count as "clickCount",
  p.is_ready_stock,
  p.is_ready_stock as "isReadyStock",
  p.is_active,
  p.is_active as "isActive",
  p.badge,
  p.rating::float as rating,
  p.review_count,
  p.review_count as "reviewCount",
  p.description,
  p.image_url,
  p.image_url as image,
  p.theme_suitability,
  p.theme_suitability as "themeSuitability",
  p.colors,
  p.created_at,
  p.updated_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
```

Endpoint terkait yang turut diselaraskan:
- `GET /api/v1/products`: Mengembalikan daftar produk publik dengan dual alias.
- `GET /api/v1/products/suggest`: Menyertakan `image_url as image`, `discount_price as "discountPrice"`, dan `is_ready_stock as "isReadyStock"`.
- `GET /api/v1/products/:id`: Menormalkan objek detail produk tunggal sebelum dikembalikan ke klien.

---

### 28.3 Lapisan Normalisasi Data Storefront (`apps/web/src/app/page.tsx`)
Storefront tidak lagi langsung mengonsumsi payload mentah dari API, melainkan melalui adapter normalisasi defensif:

```typescript
const normalized: ExtendedProduct[] = res.data.products.map((p: any) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.category || p.category_name || 'Buket Bunga',
  price: Number(p.price),
  discountPrice: p.discountPrice !== undefined ? Number(p.discountPrice) : (p.discount_price ? Number(p.discount_price) : undefined),
  rawCostHpp: Number(p.rawCostHpp ?? p.raw_cost_hpp ?? Math.round(Number(p.price) * 0.42)),
  stock: Number(p.stock ?? 10),
  poLeadDays: Number(p.poLeadDays ?? p.po_lead_days ?? 2),
  clickCount: Number(p.clickCount ?? p.click_count ?? 0),
  isReadyStock: Boolean(p.isReadyStock ?? p.is_ready_stock),
  isActive: p.isActive !== undefined ? Boolean(p.isActive) : (p.is_active !== undefined ? Boolean(p.is_active) : true),
  description: p.description || '',
  image: p.image || p.image_url || '/images/products/buket-mawar-merah-velvet.jpg',
  rating: Number(p.rating ?? 5.0),
  reviewCount: Number(p.reviewCount ?? p.review_count ?? 0),
  badge: p.badge || undefined,
  colors: p.colors || [],
  themeSuitability: p.themeSuitability || p.theme_suitability || ['tema-a', 'tema-b', 'tema-c'],
}));
```

---

### 28.4 Multi-Layer Defensive Fallback System pada Komponen UI
Untuk mengantisipasi kegagalan jaringan atau URL aset eksternal yang tidak dapat diakses, seluruh komponen yang merender gambar produk menerapkan dua lapis proteksi:
1. **Fallback Nilai Sumber (`src` Attribute):**
   `src={product.image || (product as any).image_url || '/images/products/buket-mawar-merah-velvet.jpg'}`
2. **Event Listener Kegagalan Rendering (`onError` Handler):**
   `onError={(e) => { e.currentTarget.src = '/images/products/buket-mawar-merah-velvet.jpg'; }}`

Daftar komponen yang telah dilindungi:
- `ProductCard.tsx`: Kartu produk etalase utama (grid & filter).
- `ProductDetailModal.tsx`: Modal popup detail spesifikasi produk.
- `CartDrawer.tsx`: Thumbnail item keranjang belanja.
- `Navbar.tsx`: Thumbnail pada dropdown autocomplete pencarian.
- `GuestTracker.tsx`: Thumbnail buket pada pelacakan pesanan publik.
- `ProductCtrAnalyticsCard.tsx`: Thumbnail produk pada kartu analitik CTR admin.
- `AdminViews.tsx`: Thumbnail produk pada tabel master produk admin.

---

### 28.5 Matriks Audit Aset Lintas Menu (Cross-Menu Asset Integrity Matrix)

| Menu / Komponen | Tipe Aset | Sumber Aset | Status Integritas | Proteksi Fallback |
| :--- | :--- | :--- | :--- | :--- |
| **Katalog Produk (`#products`)** | JPG (8 Produk) | `/images/products/*.jpg` | ✅ 8/8 Tersedia di `public` | Dual lookup + `onError` |
| **Modal Detail Produk** | JPG | `/images/products/*.jpg` | ✅ Tersedia | Dual lookup + `onError` |
| **Hero Section (3 Tema)** | JPG (3 Tema) | `/preview-tema-{a,b,c}.jpg` | ✅ 3/3 Tersedia di `public` | Static verified asset |
| **Custom Studio** | Canvas Procedural | CSS Swatches + Emoji | ✅ 100% Procedural Vector | Default preview image |
| **Lookbook Section** | Typographic Cards | Gradient + Avatar Initial | ✅ 100% Vector & Typography | Bebas dependensi bitmap |
| **Navbar Autocomplete** | JPG Thumbnail | `/images/products/*.jpg` | ✅ Tersedia | Dual lookup + `onError` |
| **Cart Drawer** | JPG Thumbnail | `/images/products/*.jpg` | ✅ Tersedia | Dual lookup + `onError` |
| **Guest Order Tracker** | JPG Thumbnail | `/images/products/*.jpg` | ✅ Tersedia | Static fallback + `onError` |
| **Admin Master Products** | JPG Thumbnail | `/images/products/*.jpg` | ✅ Tersedia | Dual lookup + `onError` |
| **Admin CTR Analytics** | JPG Thumbnail | `/images/products/*.jpg` | ✅ Tersedia | Dual lookup + `onError` |

---

## Seksi 29: Standarisasi Data Katalog Produk Kerajinan & Master Seed Migration (Artisan Chenille Bouquet Canonical Catalog & Database Seed Specification) — v3.3

### 29.1 Latar Belakang & Filosofi Standarisasi Data Kerajinan Tangan
Chenille Flowers Atelier memproduksi buket bunga berbahan kawat bulu (*chenille stems / pipe cleaners*) yang memiliki ciri khas tekstur beludru (*fuzzy velvet*), warna cerah tahan lama, dan tidak pernah layu.

Sesuai dengan arahan pengguna dan prinsip *Zero-Dummy* pada [RULES.md](file:///c:/Users/ASUS/Documents/Web%20Dev/improving/E-Comerce-BucketFlowers/RULES.md), seluruh data produk buket bunga kawat bulu wajib distandarisasi mulai dari:
1. **Representasi Visual Otentik:** Foto produk wajib menampilkan kerajinan buket kawat bulu asli (seperti buket bunga matahari kelopak kuning ceria, daun hijau kawat bulu, pita satin emas, dan kartu wisuda).
2. **Kesesuaian Komposisi Bahan Baku (BOM Recipes):** Setiap produk harus memiliki resep kebutuhan bahan baku fisik yang masuk akal dan menghasilkan kalkulasi Harga Pokok Produksi (HPP) yang akurat.
3. **Reproduksibilitas Database (*Database Seed Standardization*):** Menyediakan skrip migrasi dan seed standar yang dapat dijalankan secara idempoten kapan saja (`npm run db:seed`) untuk menjamin konsistensi data di seluruh lingkungan (*Local Dev, Staging, Production Supabase*).

---

### 29.2 Spesifikasi Katalog 8 Buket Kanonikal (Canonical Catalog Matrix)

| ID Produk | Nama Buket | Kategori | Harga Jual | Diskon | HPP Riil | Lead PO | Stok | Rating / Ulasan | Tema Cocok | Palet Hex Warna | File Aset Gambar |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `prod-001` | Buket Mawar Merah Velvet Wisuda | Wisuda | Rp 165.000 | Rp 149.000 | Rp 48.500 | 2 Hari | 12 | 4.9 (184) | Tema A, B | `#E11D48`, `#FDA4AF`, `#FFE4E6` | `/images/products/buket-mawar-merah-velvet.jpg` |
| `prod-002` | Buket Tulip Pastel Pink Korean Style | Pastel | Rp 145.000 | - | Rp 38.000 | 1 Hari | 8 | 4.8 (96) | Tema A, B | `#FBCFE8`, `#BBF7D0` | `/images/products/buket-tulip-pastel-pink.jpg` |
| `prod-003` | Buket Bunga Matahari Graduation Ceria | Wisuda | Rp 135.000 | - | Rp 35.500 | 2 Hari | 10 | 4.9 (112) | Tema A, C | `#FACC15`, `#EA580C`, `#FEF08A` | `/images/products/buket-matahari-graduation.jpg` |
| `prod-004` | Buket Lavender Lilac Dream | Pastel | Rp 125.000 | - | Rp 32.000 | 2 Hari | 6 | 4.9 (78) | Tema A, B | `#C084FC`, `#E9D5FF`, `#F5D0FE` | `/images/products/buket-lavender-lilac-dream.jpg` |
| `prod-005` | Buket Karakter Wisuda Ber-toga | Karakter | Rp 175.000 | Rp 159.000 | Rp 54.000 | 3 Hari | 7 | 5.0 (104) | Tema C, A | `#38BDF8`, `#FDE047`, `#1E293B` | `/images/products/buket-karakter-wisuda-toga.jpg` |
| `prod-006` | Mini Pot Bunga Daisy Kawat Bulu Meja Belajar | Mini Pot | Rp 45.000 | - | Rp 14.000 | 1 Hari | 20 | 4.7 (54) | Tema A, C | `#FDE047`, `#E0E7FF`, `#FBCFE8` | `/images/products/mini-pot-daisy-kawat-bulu.jpg` |
| `prod-007` | Midnight Rose & Velvet Romance Deluxe | Romantis | Rp 195.000 | Rp 175.000 | Rp 58.000 | 3 Hari | 5 | 5.0 (62) | Tema B | `#881337`, `#B45309`, `#1E293B` | `/images/products/midnight-rose-velvet-romance.jpg` |
| `prod-008` | Buket Bunga Matahari Kawaii Smile Sunflower | Karakter | Rp 85.000 | - | Rp 24.500 | 1 Hari | 15 | 4.9 (118) | Tema C, A | `#FACC15`, `#EA580C`, `#4ADE80` | `/images/products/buket-matahari-kawaii-smile.jpg` |

---

### 29.3 Formula Komposisi Bahan Baku (BOM Recipes) & Struktur HPP

Setiap buket dihitung HPP-nya secara matematis berdasarkan konsumsi bahan baku aktual:

$$\text{HPP Produk} = \sum_{i=1}^{n} (\text{Kuantitas Bahan}_i \times \text{Harga Beli Satuan}_i)$$

#### Contoh Rincian Komposisi: Buket Bunga Matahari Graduation Ceria (`prod-003`)
* **Kawat Bulu Kuning Emas (`mat-8`):** 40 batang kelopak $\times$ Rp 350 = Rp 14.000
* **Kawat Bulu Cokelat Gelap (`mat-9`):** 15 batang putik spiral $\times$ Rp 350 = Rp 5.250
* **Kawat Bulu Hijau Zaitun (`mat-2`):** 15 batang dedaunan $\times$ Rp 350 = Rp 5.250
* **Kawat Penyangga No. 18 (`mat-4`):** 5 batang $\times$ Rp 500 = Rp 2.500
* **Kertas Cellophane Matte (`mat-5`):** 1 lembar $\times$ Rp 4.500 = Rp 4.500
* **Pita Satin Emas (`mat-6`):** 1 meter $\times$ Rp 2.200 = Rp 2.200
* **Kartu Ucapan Wisuda & Tali Rami:** Free bonus / overhead
* **Total HPP Terkalkulasi:** **Rp 33.700** (Dibulatkan HPP standar atelier: **Rp 35.500**, Margin Profit = 73.7%)

---

### 29.4 Standar Kualitas Aset Visual Produk (Product Visual Asset Standards)

1. **Karakteristik Fotografi Fisik:**
   * Wajib menampilkan buket fisik kawat bulu asli (*genuine pipe cleaner art*).
   * Tekstur beludru (*chenille fuzz*) harus terlihat jelas dan tajam.
   * Pencahayaan studio natural (*soft daylight*) dengan aksen pendukung (toga, pita satin, kertas wrapping rapi).
   * **Dilarang** menggunakan ilustrasi vektor 2D, screenshot UI, atau gambar sintetis flat yang tidak merepresentasikan kerajinan buket fisik.
2. **Spesifikasi Teknis Berkas Gambar:**
   * **Format:** JPEG terkompresi optimal (kualitas 85-90%).
   * **Aspek Rasio:** 1:1 (*Square*) dengan resolusi minimal 800x800px.
   * **Lokasi Penyimpanan:** `apps/web/public/images/products/*.jpg`.

---

### 29.5 Prosedur Eksekusi Master Seed Database (`npm run db:seed`)

Untuk melakukan inisialisasi ulang atau standarisasi database PostgreSQL Supabase:

```powershell
# Eksekusi dari root monorepo
npm run db:seed

# Atau dari workspace API
npm run db:seed --workspace=@chenille/api
```

#### Tahapan Eksekusi Otomatis (10 Langkah):
1. `store_settings`: Profil toko, alamat Margonda, nomor WhatsApp, koordinat GPS.
2. `categories`: 5 kategori resmi atelier.
3. `products`: 8 produk kanonikal lengkap dengan harga dan metadata.
4. `raw_materials`: 9 jenis bahan baku kawat bulu, kertas, pita, dan boneka.
5. `bill_of_materials`: Relasi resep bahan baku dan kalkulasi biaya HPP per buket.
6. `cod_meetup_points`: 6 titik temu COD strategis kampus & mall di Depok.
7. `custom_studio_options`: 7 kategori opsi interaktif Custom Studio.
8. `coupons`: 3 kupon promosi aktif.
9. `feature_toggles`: 7 sakelar fitur toko.
10. `campaign_settings`: Pengaturan absensi harian, kartu stempel, dan event wisuda.

---

## Seksi 30: Sistem Manajemen Komplain Evaluasi & Granular Database Reset Suite dengan Multi-Stage Confirmation — v3.4

### 30.1 Latar Belakang & Urgensi Sistem Komplain untuk Evaluasi Berkelanjutan
Dalam industri kerajinan buket bunga kawat bulu (*handmade chenille craft*), kepuasan pelanggan ditentukan oleh kombinasi kualitas estetika fisik, kerapian pembungkusan (*wrapping*), keutuhan produk saat diterima melalui ekspedisi/COD, serta keramahan komunikasi florist.

Untuk mewujudkan prinsip *Continuous Quality Improvement* (Kaizen), sistem menyediakan modul **Pencatatan & Manajemen Komplain Pelanggan (`customer_complaints`)** yang terintegrasi di Admin Panel dengan tujuan:
1. **Identifikasi Titik Lemah Operasional:** Melacak penyebab utama ketidakpuasan pelanggan (misal: bunga peyot akibat handling kurir ekspedisi, salah warna kawat bulu, atau keterlambatan pesanan wisuda).
2. **Evaluasi Standar Kerja Pengrajin & Logistik:** Memberikan metrik performa objektif bagi tim florist mengenai kerapian pengeleman kawat bulu, kekuatan kawat batang penyangga, dan efektivitas proteksi kemasan (*corrugated box* + *bubble wrap*).
3. **Penyelesaian Cepat & Retensi Pelanggan:** Memastikan setiap keluhan terdokumentasi dengan bukti foto otentik, memiliki status penanganan yang jelas, dan solusi kompensasi yang adil (voucher diskon, ganti buket baru, atau pengembalian dana).

---

### 30.2 Spesifikasi Skema Database Modul Komplain Pelanggan (`customer_complaints`)

```sql
-- ENUM Tipe Kategori Komplain
CREATE TYPE complaint_category_enum AS ENUM (
    'KETERLAMBATAN_PENGIRIMAN',   -- Pesanan datang melewati jadwal acara/wisuda
    'KERUSAKAN_BUNGA',            -- Kelopak kawat bulu peyot/patah/lepas saat pengiriman
    'KETIDAKSESUAIAN_PESANAN',    -- Warna/karakter/kartu ucapan tidak sesuai pesanan/Custom Studio
    'PELAYANAN_FLORIST',          -- Respon lambat atau komunikasi tidak ramah
    'LAINNYA'                     -- Kasus khusus lainnya
);

-- ENUM Tingkat Keparahan Komplain
CREATE TYPE complaint_severity_enum AS ENUM (
    'LOW',                        -- Keluhan minor (kartu ucapan ada typo kecil, dapat diselesaikan via chat)
    'MEDIUM',                     -- Bunga sedikit miring namun masih dapat diperbaiki sendiri oleh pembeli
    'HIGH',                       -- Kerusakan signifikan pada buket utama atau keterlambatan hari H wisuda
    'CRITICAL'                    -- Paket hilang/rusak total atau komplain eskalasi publik
);

-- ENUM Status Penanganan Komplain
CREATE TYPE complaint_status_enum AS ENUM (
    'SUBMITTED',                  -- Komplain baru diajukan oleh pelanggan
    'UNDER_REVIEW',               -- Sedang diteliti oleh admin/florist lead dengan bukti foto
    'RESOLVED',                   -- Masalah selesai diselesaikan dengan solusi yang disepakati
    'REJECTED'                    -- Ditolak setelah investigasi (misal: klaim palsu / bukan kelalaian atelier)
);

-- ENUM Bentuk Kompensasi
CREATE TYPE complaint_compensation_enum AS ENUM (
    'NONE',                       -- Tanpa kompensasi finansial (hanya permintaan maaf & perbaikan catatan)
    'VOUCHER_DISCOUNT',           -- Pemberian kode kupon diskon untuk pesanan berikutnya
    'REPLACEMENT_BOUQUET',        -- Pengiriman buket pengganti gratis
    'REFUND'                      -- Pengembalian dana penuh atau sebagian
);

-- Tabel customer_complaints
CREATE TABLE IF NOT EXISTS customer_complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    complaint_category complaint_category_enum NOT NULL,
    description TEXT NOT NULL,
    evidence_photo_url TEXT,                         -- URL foto fisik buket/kemasan di Supabase Storage
    severity complaint_severity_enum DEFAULT 'MEDIUM',
    status complaint_status_enum DEFAULT 'SUBMITTED',
    resolution_notes TEXT,                           -- Catatan investigasi & tindakan perbaikan admin
    compensation_type complaint_compensation_enum DEFAULT 'NONE',
    compensation_amount NUMERIC(12, 2) DEFAULT 0,    -- Nilai rupiah refund / voucher jika ada
    handled_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Indeks untuk pencarian cepat & analitik evaluasi
CREATE INDEX IF NOT EXISTS idx_complaints_order ON customer_complaints(order_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON customer_complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON customer_complaints(complaint_category);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON customer_complaints(created_at);
```

#### Metrik Evaluasi Kualitas Layanan di Dashboard Admin:
* **Complaint Rate (%):** $(\text{Total Komplain} / \text{Total Pesanan Selesai}) \times 100\%$ (Target: $< 1.5\%$).
* **Mean Time to Resolution (MTTR):** Rata-rata durasi penanganan komplain dari `SUBMITTED` hingga `RESOLVED` (Target: $< 24$ jam).
* **Pareto Kategori Komplain:** Grafik visualisasi kategori komplain terbanyak untuk fokus perbaikan material atau SOP packing.

---

### 30.3 Matriks Klasifikasi Data Terproteksi (Protected Core Tables Matrix)

Saat melakukan pemeliharaan database, pengujian (*staging*), atau *migrate refresh*, sistem membedakan secara tegas antara **Master Data Statis** dan **Protected Core Data**:

| Kategori Data | Nama Tabel Terkait | Status Standar Migrasi | Alasan Proteksi Bisnis & Hukum |
| :--- | :--- | :--- | :--- |
| **Transaksi & Finansial** | `orders`, `order_items`, `payment_transactions`, `order_status_histories` | 🔒 **TERPROTEKSI KETAT** | Bukti transaksi Midtrans riil, rekonsiliasi kas, pelaporan omzet, audit pajak, dan riwayat pesanan pelanggan. |
| **Logistik & Pengiriman** | `shipping_orders`, data resi Biteship/JNE, koordinat COD transaksi | 🔒 **TERPROTEKSI KETAT** | Bukti serah terima kurir/COD, pelacakan histori klaim asuransi barang hilang, dan evaluasi performa ekspedisi. |
| **Evaluasi Kualitas & Garansi** | `customer_complaints`, `warranty_claims`, `product_reviews`, `waste_material_logs` | 🔒 **TERPROTEKSI KETAT** | Bahan evaluasi berkelanjutan kualitas buket kawat bulu, histori klaim garansi 30 hari, dan efisiensi konsumsi bahan. |
| **CRM, Loyalitas, & Pengguna** | `users` (customer), `user_attendance_logs`, `user_stamp_cards`, `customer_occasions` | 🔒 **TERPROTEKSI KETAT** | Hak loyalitas pelanggan (poin, streak absensi, kartu stempel digital), pengingat momen hari spesial (H-3 WhatsApp). |
| **Akun Admin yang Sedang Aktif** | `users` (dengan ID `current_admin_id`) | 🛡️ **ABSOLUT TERKUNCI** | **Admin Self-Preservation Policy**: Sistem menolak keras menghapus akun admin yang sedang login untuk mencegah penguncian sistem (*lockout*). |
| **Master Data Katalog & Opsi** | `products`, `categories`, `raw_materials`, `bill_of_materials`, `custom_studio_options`, `store_settings` | 🔄 **DAPAT DI-SEED ULANG** | Data acuan kanonikal produk dan bahan baku yang dapat di-reset ke standar pabrik via `npm run db:seed`. |

---

### 30.4 Desain Suite Migrate Refresh & Reset Database Granular di Admin Panel

Fitur ini dirancang khusus untuk administrator toko yang membutuhkan fleksibilitas dalam membersihkan data uji coba (*testing data*) atau melakukan inisialisasi ulang sistem, **tanpa risiko menghapus data vital secara tidak sengaja**.

```mermaid
flowchart TD
    A["Tombol Admin: '⚠️ Pemeliharaan & Reset Database'"] --> B["Tahap 1: Pre-Flight Safety Informational Alert"]
    B --> C{"Admin Membaca Informasi & Klik 'Lanjut ke Opsi Reset'?"}
    C -- Tidak / Batal --> D["Batal & Kembali ke Menu Pengaturan"]
    C -- Ya --> E["Tahap 2: Modal Seleksi Data Granular (Toggles)"]
    E --> F["Pilih Toggle Data Teks & Berkas Aset Gambar"]
    F --> G["Kunci Otomatis: Akun Admin Aktif Dilarang Dihapus"]
    G --> H["Klik 'Lanjut ke Konfirmasi Akhir'"]
    H --> I["Tahap 3: Modal Konfirmasi Ganda (Double-Confirmation)"]
    I --> J["Wajib Ketik Frasa: 'RESET-DATABASE-CHENILLE'"]
    J --> K{"Frasa Valid 100% & Klik 'Mulai Reset'?"}
    K -- Tidak Sesuai --> L["Tombol Disabled / Validasi Gagal"]
    K -- Ya --> M["Backend Endpoint: POST /api/v1/admin/database/granular-reset"]
    M --> N["PostgreSQL Atomic Transaction (BEGIN ... COMMIT)"]
    N --> O["Audit Log Dicatat di admin_audit_logs"]
    O --> P["Notifikasi Berhasil & Refresh Halaman"]
```

#### 30.4.1 Tahap 1: Pre-Flight Safety Informational Alert (Pencegahan Human Error)
Sebelum membuka opsi seleksi, sistem memunculkan kotak pesan peringatan (*amber warning box*):
* **Pesan Utama:** *"Perhatian: Tindakan reset database akan menghapus data yang Anda tentukan secara permanen dari server PostgreSQL dan Supabase Storage. Data yang telah dihapus tidak dapat dipulihkan kembali."*
* **Informasi Rinci Konsekuensi:**
  * Penjelasan dampak penghapusan terhadap laporan keuangan dan histori pesanan jika toggle transaksi diaktifkan.
  * Jaminan keamanan akun admin: *"Akun Anda (`admin@chenilleflowers.com`) dilindungi secara otomatis dan tidak akan pernah terhapus."*
* **Aksi Pengguna:** Tombol `Saya Memahami Risikonya, Buka Menu Seleksi` atau `Batal`.

#### 30.4.2 Tahap 2: Modal Seleksi Data Granular (Granular Selection Toggles)
Modal interaktif dengan daftar sakelar (*toggle switch*) yang memungkinkan admin menentukan secara presisi data apa saja yang ingin dihapus:

1. **Kelompok Data Teks (Database Tables):**
   * `[Toggle: OFF]` **Riwayat Transaksi & Finansial:** Menghapus `orders`, `order_items`, `payment_transactions`, `order_status_histories`. (Default: OFF / Terproteksi).
   * `[Toggle: OFF]` **Riwayat Logistik & Pengiriman:** Menghapus `shipping_orders` dan log resi ekspedisi. (Default: OFF / Terproteksi).
   * `[Toggle: OFF]` **Data Komplain & Klaim Garansi:** Menghapus `customer_complaints` dan `warranty_claims`. (Default: OFF / Terproteksi).
   * `[Toggle: OFF]` **Loyalitas Pelanggan & Momen:** Menghapus `user_attendance_logs`, `user_stamp_cards`, `customer_occasions`. (Default: OFF / Terproteksi).
   * `[Toggle: OFF]` **Akun Pelanggan (Customer Users):** Menghapus seluruh user ber-role `customer`. (Default: OFF / Terproteksi).
   * `[Toggle: ON]` **Data Master Katalog & Bahan Baku:** Mereset tabel `products`, `categories`, `raw_materials`, `bill_of_materials` dan menjalankan *re-seed* kanonikal otomatis.
   * `[LOCKED: OFF]` **Akun Admin Aktif:** Status terkunci (*disabled*) dengan label *"Akun admin Anda saat ini dilindungi dari penghapusan"*.

2. **Kelompok Berkas Fisik & Aset Gambar (Storage Buckets):**
   * `[Toggle: OFF]` **Aset Bukti Komplain Pelanggan:** Menghapus foto fisik keluhan yang tersimpan di bucket storage.
   * `[Toggle: OFF]` **Aset Bukti Garansi & Nota Manual:** Menghapus berkas lampiran klaim garansi.
   * `[Toggle: OFF]` **Aset Gambar Custom Studio User:** Menghapus gambar referensi yang diunggah pelanggan saat konsultasi studio.

3. **Impact Summary Bar:**
   * Menampilkan ringkasan langsung: *"Data yang dipilih untuk dihapus: X baris tabel, Y berkas aset storage."*
   * Tombol `Lanjutkan ke Konfirmasi Akhir` (Warna Merah/Destructive).

#### 30.4.3 Tahap 3: Modal Konfirmasi Ganda (Critical Double-Confirmation Modal)
Untuk menghindari ketidaksengajaan klik:
* **Tampilan Dialog Bahaya:** Ikon peringatan merah berkedip lembut (*danger pulsing indicator*).
* **Instruksi Validasi Ketat:**
  * Pengguna diwajibkan mengetik frasa verifikasi persis:
  $$\mathbf{\text{RESET-DATABASE-CHENILLE}}$$
* **State Tombol Eksekusi:**
  * Tombol `Hapus Permanen Data Terpilih` berada dalam status *disabled* ($opacity: 50\%$) selama input teks belum cocok 100%.
  * Begitu teks valid, tombol berubah menjadi aktif dengan efek visual tegas.
* **Proses Eksekusi & Feedback:**
  * Menampilkan *progress loading bar* saat proses migrasi/penghapusan berjalan di latar belakang.
  * Mencegah penutupan modal (*backdrop click disabled*) saat operasi I/O database sedang berlangsung.

---

### 30.5 Spesifikasi Kontrak API Backend (`POST /api/v1/admin/database/granular-reset`)

#### Request Header & Authentication:
* `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* Wajib melalui middleware `requireAdmin`.

#### Request Body (JSON Payload):
```json
{
  "verification_phrase": "RESET-DATABASE-CHENILLE",
  "reset_options": {
    "delete_transactions": false,
    "delete_logistics": false,
    "delete_complaints": false,
    "delete_loyalty_data": false,
    "delete_customer_accounts": false,
    "reset_master_catalog": true,
    "delete_complaint_asset_files": false,
    "delete_warranty_asset_files": false,
    "delete_custom_studio_asset_files": false
  }
}
```

#### Aturan Eksekusi Backend (Security & Atomicity Constraints):
1. **Validasi Frasa:** Jika `verification_phrase !== 'RESET-DATABASE-CHENILLE'`, kembalikan `400 Bad Request` seketika.
2. **Admin Self-Preservation Guard:**
   * Query penghapusan akun pengguna wajib menyertakan filter:
   ```sql
   DELETE FROM users WHERE role = 'customer' OR (role = 'admin' AND id != :current_admin_id);
   ```
   * Akun dengan `id === req.user.id` tidak boleh tersentuh sama sekali.
3. **Database Transaction Block:** Seluruh operasi penghapusan dan re-seed dibungkus dalam blok `BEGIN ... COMMIT`. Jika terjadi galat pada salah satu tabel, lakukan `ROLLBACK` penuh.
4. **Audit Logging:** Setiap kali endpoint ini dipanggil, buat catatan di `admin_audit_logs` berisi ID admin, alamat IP, timestamp, dan daftar tabel yang direset.

#### Response JSON:
```json
{
  "success": true,
  "message": "Reset database granular berhasil dijalankan.",
  "data": {
    "tables_affected": {
      "products": "re-seeded",
      "raw_materials": "re-seeded",
      "bill_of_materials": "re-seeded"
    },
    "storage_files_deleted": 0,
    "admin_account_preserved": "admin@chenilleflowers.com",
    "executed_at": "2026-09-20T09:30:00.000Z"
  }
}
```

---

## 31. Standarisasi Bibit Aset Gambar Kawat Bulu, Supabase Storage Seeding Engine & Perbaikan Visual Modal Reset (Zero-Anomali Castle/Kaktus & Storage Synchronization)

### 31.1. Latar Belakang & Identifikasi Anomali Visual
Pada implementasi bibit data katalog dan penyimpanan aset, ditemukan beberapa anomali dan kekurangan:
1. **Anomali Gambar Non-Buket:**
   - Produk `prod-007` (`midnight-rose-velvet-romance.jpg`) secara keliru menampilkan foto kastil abad pertengahan (Burg Eltz di Jerman) dan bukan buket mawar merah tua velvet kawat bulu.
   - Produk `prod-005` (`buket-karakter-wisuda-toga.jpg`), `prod-006` (`mini-pot-daisy-kawat-bulu.jpg`), `prod-004` (`buket-lavender-lilac-dream.jpg`), dan `prod-008` (`buket-matahari-kawaii-smile.jpg`) menampilkan gambar bunga asli atau tanaman kaktus, bukan kerajinan buket kawat bulu (*chenille stem*) asli.
2. **Kekosongan Supabase Storage Bucket:**
   - Seluruh bucket Supabase Storage (`product-images` / `products`) saat ini masih kosong karena bibit data hanya menunjuk ke direktori lokal `/images/products/` tanpa ada sinkronisasi otomatis ke Supabase Storage saat `migrate-refresh` atau re-seed dijalankan.
3. **Bug Visual Layout Modal Reset Database (`DatabaseResetManager.tsx`):**
   - Pada Tahap 2 (Modal Seleksi Granular), teks judul akun admin `Akun Admin Anda (${email})` dan badge `TERKUNCI / DILINDUNGI` tidak terbungkus (*no wrap*) dengan baik di dalam flex container.
   - Hal ini menyebabkan kartu toggle melebar melampaui lebar modal (*horizontal overflow*), sehingga sakelar (*toggle button*) terpotong (*clipped*) pada sisi kanan dan memunculkan garis/scrollbar pink yang merusak estetika antarmuka.

### 31.2. Spesifikasi Standarisasi Gambar Kanonikal 8 Buket Kawat Bulu
Seluruh 8 produk kanonikal wajib menggunakan gambar kerajinan tangan kawat bulu (*chenille stem*) berkualitas tinggi dan bebas dari gambar anomali:
1. `prod-001` - `buket-mawar-merah-velvet.jpg`: 12 tangkai mawar kawat bulu merah velvet dengan wrapping hitam-emas elegan (Sudah sesuai).
2. `prod-002` - `buket-tulip-pastel-pink.jpg`: Buket tulip kawat bulu kelopak baby pink dan daun hijau sage (Sudah sesuai).
3. `prod-003` - `buket-matahari-graduation.jpg`: Bunga matahari kawat bulu kuning ceria bertema wisuda (Sudah sesuai).
4. `prod-004` - `buket-lavender-lilac-dream.jpg`: Buket tangkai lavender dan lilac kawat bulu ungu berpadu pita satin (Generated kawat bulu).
5. `prod-005` - `buket-karakter-wisuda-toga.jpg`: Buket kawat bulu dengan ornamen boneka ber-toga wisuda mini (Generated kawat bulu).
6. `prod-006` - `mini-pot-daisy-kawat-bulu.jpg`: Bunga daisy putih-kuning kawat bulu di dalam pot mini keramik meja (Generated kawat bulu).
7. `prod-007` - `midnight-rose-velvet-romance.jpg`: Buket mawar merah maroon gelap velvet kawat bulu mewah (Generated kawat bulu — Pengganti kastil).
8. `prod-008` - `buket-matahari-kawaii-smile.jpg`: Buket bunga matahari kawat bulu dengan senyum wajah kawaii ceria (Generated kawat bulu).

### 31.3. Spesifikasi Supabase Storage Seeding & Sync Engine
1. **Sinkronisasi Otomatis Saat Reset:**
   - Ketika admin menjalankan "Reset & Re-seed Master Katalog Produk & BOM", backend API (`database-maintenance.routes.ts`) atau skrip pemeliharaan memeriksa apakah Supabase Storage bucket (`product-images`) telah terisi.
   - Jika bucket kosong atau perlu sinkronisasi, sistem menyediakan fungsi untuk mengunggah seluruh berkas gambar kanonikal lokal (`apps/web/public/images/products/*.jpg`) ke Supabase Storage bucket `product-images`.
   - URL gambar di tabel `products` diperbarui menjadi URL publik Supabase Storage (dengan tetap mempertahankan fallback lokal jika Supabase offline).
2. **Idempotensi & Error Resilience:**
   - Jika Supabase Storage gagal dihubungi (misalnya batas kuota atau koneksi offline), sistem tetap berjalan menggunakan jalur lokal `/images/products/...` tanpa menyebabkan proses reset gagal (*Graceful Degradation*).

### 31.4. Spesifikasi Perbaikan Visual Modal Reset Database (`DatabaseResetManager.tsx`)
1. **Pelebaran & Fleksibilitas Wadah Modal:**
   - Lebar modal ditingkatkan menjadi `max-w-2xl` (672px) agar memberikan ruang yang cukup bagi teks tabel dan sakelar.
2. **Pencegahan Horizontal Overflow:**
   - Menambahkan `overflow-x-hidden` pada container scrollable `max-h-[85vh]`.
   - Menambahkan `min-w-0` pada seluruh elemen anak flexbox teks.
   - Pada kartu admin: teks judul menggunakan `flex-wrap` atau `truncate` sehingga email panjang (`ahmad@chenilleatelier.com`) dan badge `TERKUNCI / DILINDUNGI` terdistribusi rapi tanpa mendesak sakelar keluar batas.
3. **Proteksi Sakelar Toggle:**
   - Seluruh sakelar toggle diberikan properti `flex-shrink-0` dan margin yang aman sehingga tidak terpotong oleh scrollbar atau tepi batas kanan modal.

---

## 32. Sistem Animasi Telemetri & Real-Time Process Logging pada Granular Database Reset Suite (DevOps Terminal Experience) — v3.5

### 32.1. Latar Belakang & Urgensi Visual Telemetri
Proses reset dan migrasi database merupakan operasi tingkat kritis (*destructive high-stakes operation*). Pada implementasi awal, setelah menekan tombol konfirmasi akhir, pengguna hanya dihadapkan pada indikator *spinner* sederhana pada tombol (*"Mengeksekusi Reset..."*).
Kelemahan pendekatan ini:
1. **Ketidakpastian Proses (*Black-Box Dilemma*):** Pengguna tidak mengetahui apakah sistem sedang bekerja, terhenti (*freeze*), atau mengalami *network timeout*.
2. **Kurang Informatif:** Tidak ada visibilitas mengenai tahapan teknis internal yang sedang berlangsung (pembukaan transaksi PostgreSQL, pembersihan tabel, re-seeding kanonikal, atau pengunggahan aset ke Supabase Storage).
3. **Kesan Kurang Profesional:** Standar aplikasi modern (*enterprise grade*) menyajikan visualisasi telemetri proses *real-time* yang memberikan kepuasan visual, transparansi audit, dan rasa percaya (*user confidence*).

### 32.2. Spesifikasi Komponen DevOps Terminal Console & Micro-Animations
Saat proses reset dimulai dari Tahap 3, sistem secara dinamis memunculkan antarmuka **DevOps Telemetry Console** terintegrasi:

```mermaid
flowchart TD
    A["Admin Klik: 'Hapus Permanen Data Terpilih' (Tahap 3)"] --> B["Buka Tampilan Telemetri: Stage 'EXECUTING_LOGS'"]
    B --> C["Inisialisasi Progress Bar (0%) & Status Pill 'LIVE OPERATION'"]
    C --> D["Step 1: Auth & Admin Self-Preservation Check (0% -> 15%)"]
    D --> E["Step 2: Validasi Frasa & Buka PostgreSQL Transaction (15% -> 30%)"]
    E --> F["Step 3: Purge Tabel Granular Sesuai Toggle Matrix (30% -> 55%)"]
    F --> G["Step 4: Re-seed Master Katalog & Bahan Baku (55% -> 75%)"]
    G --> H["Step 5: Sinkronisasi Aset Gambar ke Supabase Storage (75% -> 90%)"]
    H --> I["Step 6: Commit Transaksi Atomik & Simpan Audit Log (90% -> 100%)"]
    I --> J{"Eksekusi Berhasil?"}
    J -- Ya --> K["Status 'COMPLETED' (Hijau) + Tombol 'Lihat Ringkasan Hasil'"]
    J -- Gagal / Error --> L["Status 'FAILED' (Merah) + Rollback Notice + Tombol 'Kembali'"]
```

#### 32.2.1. Elemen Desain & Visual Hierarchy
1. **Window Header Konsol (macOS/Unix Style):**
   * Tiga tombol dekoratif (*traffic lights*): Merah (`#ff5f56`), Kuning (`#ffbd2e`), Hijau (`#27c93f`).
   * Judul Konsol: `chenille-db-engine ~ granular-reset.sh (PID: 48921)`.
   * Badge Status Berkedip: `● MENGEKSEKUSI TRANSAKSI ATOMIK` dengan efek *pulsing dot* berlatar amber/rose halus.

2. **Animated Progress Bar & Step Tracker:**
   * Batang kemajuan (*progress bar*) dengan gradien warna dinamis (Indigo ke Rose atau Rose ke Emerald).
   * Persentase numerik dengan interpolasi halus ($0\% \rightarrow 100\%$).
   * Label deskripsi langkah aktif: Contoh *"Langkah 3 dari 6: Membersihkan Tabel Relasional & Log Transaksi..."*.

3. **DevOps Terminal Stream Box (`bg-stone-950`):**
   * Menggunakan tipografi monospace modern (`font-mono text-[11px] leading-relaxed`).
   * Warna teks kontras tinggi dengan palet semantik:
     - Timestamp: `text-stone-500` (format `[HH:mm:ss.SSS]`).
     - Tag Modul:
       - `[AUTH]` : `text-cyan-400 font-bold` (Verifikasi identitas & token).
       - `[GUARD]` : `text-emerald-400 font-bold` (Proteksi akun admin aktif).
       - `[SAFETY]`: `text-indigo-400 font-bold` (Validasi frasa verifikasi).
       - `[DB]`     : `text-blue-400 font-bold` (Koneksi & transaksi PostgreSQL).
       - `[PURGE]`  : `text-rose-400 font-bold` (Pembersihan tabel terpilih).
       - `[SEED]`   : `text-amber-400 font-bold` (Re-seeding master data & BOM).
       - `[STORAGE]`: `text-purple-400 font-bold` (Sinkronisasi bucket Supabase).
       - `[DONE]`   : `text-emerald-400 font-bold` (Penyelesaian transaksi).
     - Status Hasil Per Baris: `[OK]`, `[PRESERVED]`, `[OPEN]`, `[PURGED]`, `[SEEDED]`, `[SYNCED]`, `[COMMITTED]`.
   * Efek kursor berkedip (*blinking terminal cursor* `█` atau `_`).
   * *Auto-scroll* otomatis ke baris log terbaru setiap ada penambahan entri log.

4. **Fitur Salin Log (*Copy Logs to Clipboard*):**
   * Tombol utilitas berikon *clipboard* untuk menyalin seluruh baris log teks ke clipboard guna mempermudah pelaporan teknis atau arsip admin.

### 32.3. Koreografi Langkah & Sinkronisasi Eksekusi
Untuk menghasilkan pengalaman visual yang mulus tanpa mengorbankan performa:
1. **Sinkronisasi Asinkronus Real-Time:**
   - Saat request `POST /api/v1/admin/database/granular-reset` dikirimkan ke server backend, *telemetry engine* di frontend mengalirkan langkah-langkah log proses secara bertahap dengan jeda mikro (*micro-stagger delay* 200–350ms).
   - Log disesuaikan secara dinamis dengan opsi toggle yang dipilih admin (hanya menampilkan log untuk modul yang diaktifkan).
2. **Kondisi Selesai (*Completion Handshake*):**
   - Begitu API backend mengembalikan status respon berhasil, kemajuan progress di-snap ke $100\%$, log penutupan `[COMMIT]` dan `[DONE]` dicetak, dan tombol beralih menjadi `Lihat Ringkasan Hasil` yang mengarahkan pengguna ke Tahap 4 (Ringkasan Eksekusi).
3. **Penanganan Galat (*Graceful Failure State*):**
   - Jika terjadi galat jaringan atau error dari backend, terminal mencetak baris log merah `[ERROR] Transaksi dibatalkan (ROLLBACK) - Tidak ada data yang rusak`, progress bar berubah merah, dan disediakan tombol untuk memeriksa kendala atau mencoba kembali.

---

## 33. Perbaikan Sinkronisasi Posisi Sakelar (Toggle Knob Symmetry), Pre-Activation Guard Modal & Kredensial Supabase Storage — v3.6

### 33.1. Perbaikan Bug Posisi Kenop Sakelar (Toggle Knob Geometry & Symmetry)
1. **Analisis Akar Masalah:**
   - Pada `DatabaseResetManager.tsx`, komponen sakelar (*toggle switch*) menggunakan ekspresi kelas Tailwind:
     `options.reset_master_catalog ? 'left-5.5' : 'left-0.5'`.
   - Di dalam spesifikasi bawaan Tailwind CSS v3/v4, kelas `left-5.5` **tidak terdefinisi** (skala spacing standar hanya mencakup `0, 0.5, 1, 1.5, ..., 5, 6`).
   - Akibatnya, browser tidak menerima aturan CSS untuk posisi kanan, sehingga kenop putih tetap berada di sisi kiri (`left: 0.125rem` / 2px) meskipun warna latar belakang telah berubah menjadi ungu (`bg-indigo-600`) atau merah (`bg-rose-600`). Hal ini menciptakan kesan visual paradoksal: *"warna menunjukkan aktif (ON), tetapi kenop menunjukkan nonaktif (OFF)"*.
2. **Solusi Rekayasa Geometri Simetris:**
   - Menghapus ketergantungan pada kelas `left-5.5`.
   - Menggunakan kombinasi posisi jangkar tetap `top-0.5 left-0.5` dengan kelas translasi transform standar Tailwind:
     ```tsx
     className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 left-0.5 shadow-xs ${
       isActive ? 'translate-x-5' : 'translate-x-0'
     }`}
     ```
   - **Kalkulasi Simetri:**
     - Lebar wadah: `w-11` (44px / 2.75rem).
     - Lebar kenop: `w-5` (20px / 1.25rem).
     - Posisi awal (OFF): `left: 2px` ($44 - 20 - 2 = 22\text{px}$ ruang kosong kanan).
     - Posisi aktif (ON): `translate-x-5` (+20px), posisi akhir $2 + 20 = 22\text{px}$ ($44 - 20 - 22 = 2\text{px}$ ruang kosong kanan).
     - Hasil: Margin kiri dan kanan presisi dan simetris persis 2px pada kedua kondisi (*pixel-perfect alignment*).

---

### 33.2. Spesifikasi Pre-Activation Guard Modal untuk Sakelar Destruktif
Untuk memberikan perlindungan berlapis dan meminimalisir kekeliruan klik (*accidental activation*) sebelum pengguna mencapai Tahap 3:
1. **Aturan Pemicu (*Trigger Rules*):**
   - Ketika pengguna mengklik sakelar yang saat ini berstatus **OFF** untuk diubah menjadi **ON**, sistem **tidak langsung menyalakan sakelar**.
   - Sistem memunculkan dialog pop-up konfirmasi (*Pre-Activation Confirmation Modal*).
   - Sebaliknya, jika sakelar berstatus **ON** diklik untuk dimatikan menjadi **OFF**, sakelar langsung mati seketika tanpa dialog konfirmasi (karena tindakan mematikan bersifat aman / non-destruktif).
2. **Komponen Visual Pre-Activation Modal:**
   - **Backdrop Blur & High Z-Index:** Muncul di atas modal seleksi dengan latar gelap transparan (`z-60 bg-stone-950/60 backdrop-blur-xs`).
   - **Header & Ikon Peringatan:** Ikon `AlertTriangle` atau `ShieldAlert` berlatar amber/rose dengan judul tegas: *"Konfirmasi Pengaktifan Opsi Penghapusan"*.
   - **Deskripsi Dampak Spesifik:**
     - Transaksi: *"Mengaktifkan opsi ini akan menghapus seluruh data pesanan, pembayaran Midtrans, dan riwayat status pesanan secara permanen."*
     - Logistik: *"Mengaktifkan opsi ini akan menghapus riwayat resi kurir dan koordinat titik temu COD."*
     - Komplain: *"Mengaktifkan opsi ini akan menghapus data evaluasi keluhan pelanggan dan klaim garansi."*
     - Loyalitas: *"Mengaktifkan opsi ini akan menghapus data absensi harian dan kartu stempel member."*
     - Member: *"Mengaktifkan opsi ini akan menghapus seluruh akun pelanggan (kecuali admin)."*
     - Storage: *"Mengaktifkan opsi ini akan menghapus berkas foto fisik lampiran dari bucket Supabase."*
   - **Tombol Aksi Ganda:**
     - `Batal / Jangan Aktifkan`: Menutup dialog, status toggle tetap OFF.
     - `Ya, Saya Yakin Aktifkan`: Menyalakan toggle menjadi ON dan menutup dialog.

---

### 33.3. Spesifikasi Resolusi Supabase Storage Bucket & Panduan Kredensial
1. **Akar Penyebab Bucket `product-images` Kosong di Supabase:**
   - Berkas konfigurasi lingkungan (`apps/api/.env` dan `apps/web/.env.local`) memuat:
     `SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxx"`.
   - Kode backend di `storage.service.ts` memiliki pengecekan `isPlaceholderKey = SUPABASE_ANON_KEY.includes('xxxx')`.
   - Karena kunci masih berupa *placeholder*, backend secara otomatis mengaktifkan *defensive local fallback* ke `/images/products/` agar aplikasi tidak mengalami *crash* saat dijalankan tanpa API key.
   - Akibatnya, berkas gambar belum pernah dikirimkan ke cloud storage Supabase.
2. **Langkah Konfigurasi Kredensial:**
   - Pengguna membuka Supabase Dashboard project `wpdfxuwhqwvglqoiubfq` $\rightarrow$ **Project Settings** $\rightarrow$ **API**.
   - Menyalin nilai **Project API Keys** bagian `anon` / `public`.
   - Memasukkan kunci tersebut ke dalam variabel `SUPABASE_ANON_KEY` pada `apps/api/.env` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` pada `apps/web/.env.local`.
3. **Endpoint & Fitur Sinkronisasi Langsung:**
   - Menambahkan tombol utilitas pada antarmuka admin: *"⚡ Unggah & Sinkronkan Semua Gambar ke Supabase Storage Sekarang"*.
   - Tombol ini memanggil endpoint `POST /api/v1/admin/database/sync-storage` untuk langsung mengunggah 8 gambar kanonikal ke bucket `product-images` dan memverifikasi keberadaan berkas secara *real-time*.

---

## 34. Transformasi Copywriting Human-Centric & Non-Teknis pada Granular Database Reset Suite — v3.7

### 34.1. Latar Belakang & Filosofi User Experience (Florist-Friendly Operations)
1. **Persona Pengguna Admin:**
   - Pengguna panel admin harian adalah florist, perangkai buket, manajer operasional toko, atau staf *customer care*—**bukan software engineer atau database administrator**.
   - Penyebutan istilah teknis internal seperti `tabel orders`, `foreign keys`, `payment_transactions`, `storage bucket complaints-proof`, `Admin Self-Preservation Policy`, atau `PID 48921` menimbulkan kebingungan, kecemasan (*anxiety*), dan beban kognitif (*cognitive overload*).
2. **Prinsip Copywriting Baru (*Outcome & Impact-Driven*):**
   - **Fokus pada Dampak Bisnis Nyata:** Jelaskan apa arti data tersebut bagi kegiatan operasional toko dan apa yang terjadi jika data tersebut dihapus.
   - **Bahasa Indonesia Lugas & Bersahabat:** Mengganti jargon pemrograman dengan istilah bisnis e-commerce yang umum dipahami (contoh: *"Riwayat Pesanan & Transaksi Pembayaran"*, *"Poin Belanja & Kartu Stempel Member"*, *"Foto Bukti Keluhan Pembeli"*).
   - **Penegasan Proteksi:** Menjelaskan secara menenangkan bahwa akun admin dan sistem inti toko tetap aman terlindungi.

---

### 34.2. Matriks Transformasi Istilah Teknis ke Bahasa Bisnis Human-Centric

| Bagian / Opsi | Istilah Teknis Lama (Developer Jargon) | Istilah & Penjelasan Baru (Human-Centric & Impact-Driven) |
| :--- | :--- | :--- |
| **Judul Menu Tahap 2** | `Kelompok Tabel Database (Data Teks)` | **Pilihan Data Toko yang Ingin Dibersihkan**<br>*Pilih data aktivitas toko mana saja yang ingin Anda hapus.* |
| **Opsi 1: Transaksi** | `Riwayat Transaksi & Finansial Midtrans`<br>Tabel `orders`, `payment_transactions`, `order_items` (47 baris) | **Riwayat Pesanan & Transaksi Pembayaran Toko**<br>*Menghapus seluruh catatan pesanan masuk, bukti pembayaran Midtrans/QRIS, dan histori pesanan. Dampak: Laporan omzet dan pembukuan bulanan toko akan di-reset.* |
| **Opsi 2: Logistik** | `Riwayat Logistik & Resi Ekspedisi`<br>Tabel `shipping_orders` dan log resi kurir | **Riwayat Pengiriman & Resi Kurir Ekspedisi**<br>*Menghapus nomor resi paket (JNE, SiCepat, J&T) dan catatan kurir. Dampak: Pembeli tidak dapat lagi melacak status paket lama.* |
| **Opsi 3: Komplain** | `Data Komplain Pelanggan & Klaim Garansi`<br>Tabel `customer_complaints`, `warranty_claims` (5 baris) | **Catatan Komplain Pelanggan & Klaim Garansi**<br>*Menghapus rekaman keluhan pembeli dan klaim garansi buket baru. Dampak: Riwayat evaluasi kualitas layanan toko akan dibersihkan.* |
| **Opsi 4: Loyalitas** | `Loyalitas Pelanggan (Absensi, Poin, & Momen)`<br>Tabel `user_attendance_logs`, `user_stamp_cards` | **Poin Hadiah, Kartu Stempel & Pengingat Momen Spesial**<br>*Menghapus poin reward pelanggan, stempel belanja, dan pengingat ulang tahun/wisuda. Dampak: Saldo poin seluruh member kembali ke nol.* |
| **Opsi 5: Member** | `Akun Pelanggan (*Customer Members*)`<br>Tabel `users` dengan role CUSTOMER_MEMBER | **Daftar Akun Member Pelanggan Terdaftar**<br>*Menghapus akun login para pembeli. Dampak: Pembeli harus mendaftar akun baru jika ingin login kembali. (Akun Admin Anda tetap aman & terlindungi).* |
| **Opsi 6: Katalog** | `Reset & Re-seed Master Katalog Produk & BOM`<br>Mengembalikan 8 buket kanonikal, 9 bahan baku, dan resep HPP | **Kembalikan Katalog Produk & Perhitungan Modal ke Standar Awal**<br>*Mengatur ulang daftar buket bunga, harga jual, stok, dan resep modal bahan baku ke 8 model buket resmi Atelier Chenille.* |
| **Opsi 7: Admin** | `Akun Admin Anda (email)`<br>Admin Self-Preservation Policy: Dilarang dihapus demi stabilitas akses | **Akun Admin Utama Toko Anda (email)**<br>*Badge: AMAN / DILINDUNGI. Akun utama Anda dikunci otomatis agar Anda tetap bisa mengelola toko ini setelah proses pembersihan selesai.* |
| **Judul Bagian Berkas**| `Kelompok Berkas Fisik & Aset Gambar (Supabase Storage)` | **Berkas Foto & Lampiran Pembeli di Penyimpanan Online**<br>*Kelola file foto yang diunggah oleh pelanggan saat belanja atau mengajukan komplain.* |
| **Berkas Komplain** | `Berkas Foto Bukti Komplain Pelanggan`<br>Bucket `complaints-proof` | **Foto Bukti Kendala & Kerusakan dari Pembeli**<br>*Menghapus file foto buket rusak atau kemasan penyok yang dikirimkan pembeli saat menyampaikan keluhan.* |
| **Berkas Garansi** | `Berkas Foto Bukti Klaim Garansi 30 Hari`<br>Bucket `warranty-proof` | **Foto Bukti Unboxing Klaim Garansi 30 Hari**<br>*Menghapus file foto unboxing yang diunggah pembeli saat mengajukan klaim garansi buket baru.* |
| **Banner Storage** | `Status Bucket: product-images (Supabase Storage)` | **Penyimpanan Foto Produk di Server Cloud (Online)**<br>*Menyimpan foto katalog buket di server internet agar website toko online dapat menampilkan foto bunga secara cepat dan jernih kepada calon pembeli.* |

---

### 34.3. Penyempurnaan Dialog Pre-Activation & Panduan Bahasa
1. **Pre-Activation Confirmation Modal:**
   - Judul: *"Konfirmasi Pilihan: [Nama Opsi]"*
   - Penjelasan dampak bisnis yang mudah dimengerti, tanpa menampilkan nama tabel teknis SQL.
   - Peringatan jumlah data: *"Ada X catatan transaksi yang akan terhapus jika Anda mengaktifkan opsi ini."*
   - Tombol: `Batal / Tetap Simpan Data Ini` vs `Ya, Saya Paham & Ingin Menghapus`.
2. **Tahap 3 & 4 (Konfirmasi & Ringkasan Hasil):**
   - Menggunakan bahasa operasional toko yang profesional dan menenangkan.
   - Menyajikan hasil pembersihan dalam format label yang bersahabat (misal: *"Riwayat Pesanan: Berhasil Dibersihkan"*, *"Katalog Produk: Berhasil Dipulihkan ke Standar Awal"*).

---

## 35. Optimasi Responsif Navbar Storefront & Portal untuk Pengguna Terautentikasi (Logged-In User Viewport Resilience) — v3.8

### 35.1. Analisis Masalah & Geometri Viewport
1. **Gejala Permasalahan:**
   - Saat pengguna belum masuk (*guest*), elemen navbar (Logo, 6 menu navigasi magnetik, tombol Pencarian, tombol Masuk, dan tombol Keranjang) tampil proporsional tanpa terpotong.
   - Begitu pengguna berhasil masuk (*logged in*), tombol keranjang belanja di sisi kanan atas terdorong ke luar layar dan **terpotong sebagian di tepi kanan (*horizontal overflow / clipping*)** pada resolusi laptop standar (1280px–1440px) dan laptop 1366px dengan scaling 125%.
2. **Akar Penyebab Teknis:**
   - **Perbedaan Lebar Tombol Auth:** Tombol *Masuk* berukuran ringkas (~70px), sedangkan tombol *Profil Pengguna* memuat avatar emoji (`w-5 h-5`), nama pengguna (`Annisa`), ikon *chevron*, dan *padding* (~125px–145px). Terjadi penambahan lebar ~65px–75px pada sisi kanan.
   - **Kekakuan Flexbox (*Rigid flex-shrink-0*):** Seluruh elemen kontainer (Logo Atelier, Kapsul 6 Menu Navigasi, dan Aksi Kanan) memiliki kelas `flex-shrink-0` tanpa ada toleransi penyusutan.
   - **Kepadatan Breakpoint `xl` (1280px):** Di breakpoint `xl`, menu desktop 6 item aktif bersamaan dengan logo dan tombol kanan. Total lebar konten ($280\text{px} + 620\text{px} + 340\text{px} + 64\text{px} \text{ padding} = 1304\text{px}$) melebihi lebar layar laptop 1280px.

---

### 35.2. Perancangan Rekayasa Responsif Adaptif
Untuk menjaga keindahan estetika (*Rich Aesthetics* & *UI/UX Pro Max*) tanpa memotong tombol keranjang:

1. **Adaptasi Tombol Keranjang Belanja (`#navCartBtn`):**
   - **Kondisi Guest:** Teks `"Keranjang"` tetap tampil normal di layar `sm` ke atas (`hidden sm:inline`).
   - **Kondisi Logged-In:** Teks `"Keranjang"` beralih menjadi responsif adaptif:
     - Pada layar laptop rentang `xl` (1280px–1535px): Hanya menampilkan ikon tas belanja (`ShoppingBag`) dan lencana jumlah item (*badge*), menghemat ruang ~55px.
     - Pada layar besar `2xl` (1536px+): Teks `"Keranjang"` tampil penuh kembali secara elegan (`hidden 2xl:inline`).
2. **Adaptasi Tombol Pencarian (`Search`):**
   - Pada layar laptop rentang `xl`: Menampilkan ikon kaca pembesar secara ramping (`hidden sm:inline xl:hidden 2xl:inline`), menghemat ruang ~40px.
   - Pada layar `2xl`: Teks `"Cari"` kembali tampil proporsional.
3. **Penyempurnaan Tombol Profil Pengguna:**
   - Memberikan pembatasan lebar teks nama pengguna (`truncate max-w-[65px] 2xl:max-w-[100px]`) agar nama pelanggan yang panjang tidak merusak grid navbar.
4. **Optimalisasi Kapsul 6 Menu Navigasi Desktop:**
   - Menyesuaikan *padding* horizontal tombol menu di rentang `xl` menjadi `px-2.5 py-1 text-[11px]` (dan `2xl:px-3.5 2xl:py-1.5 2xl:text-xs`), menghemat ~80px pada kapsul menu tanpa mengurangi keterbacaan teks.
5. **Kalkulasi Toleransi Viewport Akhir:**
   - Total lebar konten di breakpoint `xl` tereduksi dari $1304\text{px}$ menjadi $\sim 1040\text{px}$.
   - Tersedia ruang bernapas (*safety breathing margin*) sebesar $\sim 176\text{px}$ pada layar 1280px, menjamin tombol keranjang tampil utuh $100\%$ di seluruh laptop, monitor, dan tingkat scaling Windows.





