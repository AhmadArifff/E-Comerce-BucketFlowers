# PRD: E-Commerce & Interactive Multi-Theme Catalog Buket Bunga Kawat Bulu

**Nama Produk:** E-Commerce & Interactive Multi-Theme Catalog Buket Bunga Kawat Bulu (*Aesthetic Chenille Flowers Atelier*)  
**Arsitektur:** Enterprise Turborepo Monorepo (`apps/web` + `apps/api` + `packages/shared`) + Vercel Deployment + Supabase PostgreSQL  
**Standar Operasional:** Shopify-Grade Operations, Google Maps Geofencing, Multi-Theme Engine & Real-Time Logistics  
**Role / Penulis:** Senior Product Manager, Lead Architect & Tech Critic Reviewer  
**Tanggal Rilis:** 2026-09-07  
**Versi:** v2.1 (Turborepo Monorepo Architecture, Shared Packages, ESM Backend Engine, & Battle-Tested CrownJobExpiredSupbase Best Practices)  
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
│
├── 🛒 STOREFRONT & CUSTOMER PORTAL (apps/web)
│   ├── Halaman Etalase Multi-Tema (Tema A, Tema B, Tema C)
│   │   ├── Top Announcement Bar (Promo & Info Kuota Wisuda)
│   │   ├── Sticky Navbar (Brand, Menu, Search, Link Portal Member, Cart Drawer)
│   │   ├── Hero Carousel Estetik (Highlight buket wisuda & seasonal)
│   │   ├── Kartu Filter Kategori (Wisuda, Romantis, Pastel, Karakter, Mini Pot)
│   │   ├── Grid Katalog Produk Interaktif (Add to Cart, 3D Tilt, View Counter)
│   │   ├── Floating In-System Web Chat CS (Konsultasi buket di web + Eskalasi WA)
│   │   └── Cart Drawer (Ringkasan belanja, opsi COD vs Ekspedisi, Checkout)
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
│       ├── Theme Selector Pills (Ubah suasana tema langsung di halaman login)
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
* **Strategi Penambahan Tema Baru (Tema D, E, dst.):**
  - Developer cukup mendaftarkan objek tema baru di `@chenille/shared/constants/themes.ts` dan menambahkan CSS selector `[data-theme="tema-d"]`.
  - Seluruh modul etalase, portal member, dan login akan otomatis mewarisi warna serta tipografi baru.

### 7.2 In-System Live Web Chat (Anti-Direct-WA Trap)
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

---

## 8. Skema Database Prisma (PostgreSQL Supabase)

Skema database tersimpan di `apps/api/prisma/schema.prisma` dan memanfaatkan fitur **Dual URL Connection**:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
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
  id              String   @id @default(uuid())
  name            String   // e.g. "Kampus UI Depok (Gerbatama & Rotunda)"
  full_address    String
  google_maps_url String   // Link resmi maps.google.com/?q=...
  embed_query     String?  // Kata kunci pencarian embed iframe
  distance_km     Decimal  @db.Decimal(4, 1)
  delivery_notes  String?  // "Lobby utama samping Starbucks"
  is_active       Boolean  @default(true)
  created_at      DateTime @default(now())

  orders          Order[]
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
  claims             WarrantyClaim[]
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
  id              String        @id @default(uuid())
  user_id         String?
  user            User?         @relation(fields: [user_id], references: [id])
  session_token   String        @unique
  customer_name   String
  customer_phone  String?
  is_escalated_wa Boolean       @default(false)
  created_at      DateTime      @default(now())
  updated_at      DateTime      @updatedAt

  messages        ChatMessage[]
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

// ------------------------------------------------------
// WARRANTY CLAIMS & COMPLAINTS
// ------------------------------------------------------
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

model WarrantyClaim {
  id              String         @id @default(uuid())
  order_id        String
  order           Order          @relation(fields: [order_id], references: [id], onDelete: Cascade)
  customer_phone  String
  issue_category  IssueCategory  @default(TRANSIT_DAMAGE_CRUSHED)
  description     String
  video_proof_url String?        // Link video unboxing tanpa jeda
  photo_proof_url String?
  status          WarrantyStatus @default(SUBMITTED)
  admin_notes     String?
  replacement_awb String?        // Nomor resi pengiriman buket pengganti 100% gratis
  created_at      DateTime       @default(now())
  updated_at      DateTime       @updatedAt
}

// ------------------------------------------------------
// OPERATIONAL FEATURE TOGGLES & CUSTOMER FAQ
// ------------------------------------------------------
model FeatureToggle {
  key          String   @id // e.g. "toggle_free_cod_radius"
  name         String
  description  String
  is_enabled   Boolean  @default(true)
  updated_at   DateTime @updatedAt
}

model CustomerFaq {
  id         String   @id @default(uuid())
  category   String   // "INVOICE_LOST", "FLOWER_CARE", "PO_SCHEDULE", "COD_RULES"
  question   String
  answer     String
  sort_order Int      @default(0)
  is_active  Boolean  @default(true)
  created_at DateTime @default(now())
}
```

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
* **Fase 4 (Aktif - v2.1):** Arsitektur Monorepo Turborepo, Inisialisasi Workspaces (`apps/web`, `apps/api`, `packages/shared`), Penyiapan `turbo.json`, dan Penerapan Best Practices `CrownJobExpiredSupbase`.
* **Fase 5 (Tahap Selanjutnya):** Migrasi Source Code Aplikasi ke Monorepo Workspaces, Inisialisasi Database Supabase PostgreSQL dengan Prisma Migration, dan Pengujian Integrasi API End-to-End.

---

## 12. Template Environment Variables (`.env.example`)

```env
# ==============================================================================
# BACKEND API (apps/api - Local / Vercel Serverless)
# ==============================================================================
NODE_ENV="development"
PORT=4000

# SUPABASE POSTGRESQL (Dual-URL Strategy)
# DATABASE_URL: Port 6543 dengan PgBouncer Pooling untuk runtime serverless
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
# DIRECT_URL: Port 5432 koneksi langsung untuk Prisma CLI Migrations
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

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
```
