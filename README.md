# 🌸 E-Commerce & Interactive Multi-Theme Catalog Buket Bunga Kawat Bulu

> **Aesthetic Chenille Flowers Atelier** — Solusi platform e-commerce dan operasional kerajinan tangan (*handicraft*) buket bunga kawat bulu (*chenille stems*) berstandar Shopify-Grade dengan integrasi Google Maps COD Geofencing, Multi-Theme Design Token Engine, Kalkulator Biaya Bahan Mentah (BOM), In-System Live Web Chat, dan Portal Member Pelanggan.

[![Architecture](https://img.shields.io/badge/Architecture-Turborepo%20Monorepo-EF4444?style=for-the-badge&logo=turborepo)](PRD.md)
[![Turborepo](https://img.shields.io/badge/Workspaces-apps%20%26%20packages-000000?style=for-the-badge&logo=turborepo)](turbo.json)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL%20%2F%20Prisma-3ECF8E?style=for-the-badge&logo=supabase)](PRD.md)
[![Design Tokens](https://img.shields.io/badge/Design%20System-CSS%20Custom%20Properties-38BDF8?style=for-the-badge&logo=css3)](PRD.md)
[![Maps](https://img.shields.io/badge/Maps-Google%20Maps%20Embed%20%26%20Geofencing-EA4335?style=for-the-badge&logo=googlemaps)](PRD.md)
[![Payments](https://img.shields.io/badge/Payment-Midtrans%20Snap%20QRIS-0052CC?style=for-the-badge)](PRD.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📑 Daftar Isi

- [🏢 Arsitektur Monorepo (Turborepo)](#-arsitektur-monorepo-turborepo)
- [✨ Fitur Unggulan Sistem](#-fitur-unggulan-sistem)
- [📸 Galeri Tangkapan Layar & Verifikasi Tampilan](#-galeri-tangkapan-layar--verifikasi-tampilan)
- [📁 Struktur Folder & Navigasi Berkas](#-struktur-folder--navigasi-berkas)

- [🎭 Arsitektur Multi-Theme Engine](#-arsitektur-multi-theme-engine)
- [🗺️ Integrasi Titik Temu COD Google Maps](#️-integrasi-titik-temu-cod-google-maps)
- [🧵 Bill of Materials (BOM) & Finansial](#-bill-of-materials-bom--finansial)
- [👤 Dual-Scenario Portal Pelanggan](#-dual-scenario-portal-pelanggan)
- [🚀 Cara Menjalankan Aplikasi](#-cara-menjalankan-aplikasi)
- [📄 Spesifikasi Lengkap (PRD)](#-spesifikasi-lengkap-prd)
- [📜 Lisensi](#-lisensi)

---

## 🏢 Arsitektur Monorepo (Turborepo)

Proyek ini dibangun menggunakan arsitektur **Enterprise Monorepo** berbasis **Turborepo 2.x** dan **npm workspaces**, mengadaptasi standar arsitektur teruji dari proyek referensi [`CrownJobExpiredSupbase`](https://github.com/AhmadArifff/CrownJobExpiredSupbase):

```
E-Comerce-BucketFlowers/
├── apps/
│   ├── web/               # [Frontend] Next.js 15+ (App Router) + Tailwind CSS + Motion
│   └── api/               # [Backend] Express.js ESM Engine on Vercel Serverless + Prisma ORM
├── packages/
│   └── shared/            # [@chenille/shared] Result Pattern, Zod Schemas, DTOs & Constants
├── desain-tampilan/       # Showcase Prototype Interaktif (Tema A, B, C, Admin, Member Portal, Login)
├── turbo.json             # Turborepo Pipeline Caching & Task Orchestration
├── package.json           # Root npm workspaces configuration
└── .env.example           # Unified environment variables template
```

### 💡 Keunggulan Arsitektur Monorepo
1. **End-to-End Type Safety:** Skema validasi Zod dan tipe TypeScript diekspor dari `@chenille/shared` dan dikonsumsi bersama oleh frontend dan backend.
2. **Result Pattern Standard:** Menggantikan `throw new Error()` dengan objek `Result<T>` (`ok` / `fail`) guna mencegah crash server dan kebocoran stack trace database.
3. **Pure ESM Compliance:** Backend `apps/api` menggunakan `"type": "module"` murni dengan NodeNext resolution untuk kompatibilitas penuh dengan `better-auth`.
4. **Supabase Dual-URL Strategy:** `DATABASE_URL` (Port 6543 PgBouncer) untuk serverless pooler + `DIRECT_URL` (Port 5432) untuk Prisma CLI migrations.
5. **Independent Vercel Deployment:** Frontend (`chenille-flowers-web`) dan backend (`chenille-flowers-api`) dapat di-deploy secara terpisah ke Vercel tanpa konflik symlink.

---

## ✨ Fitur Unggulan Sistem

### 1. 🎨 Multi-Theme Storefront (Tema A, B, & C)
Tersedia 3 tema visual independen yang dapat disinkronkan secara global melalui Admin Panel:
- **Tema A (Korean Pastel Atelier):** Lembut, elegan, soft blush & sage green, tipografi Outfit.
- **Tema B (Modern Romantic):** Mewah, dramatis, deep velvet wine `#722F37` & antique gold, tipografi Playfair Display.
- **Tema C (Playful Kawaii):** Ceria, pop pastel, bubblegum pink `#EC4899` & warm butter, tipografi Fredoka.

### 2. 🗺️ Titik Temu COD Terintegrasi Google Maps & Geofencing
- **Peta Interaktif Asli:** Peta Google Maps aktif terintegrasi di sisi admin dan checkout pembeli.
- **Deteksi Otomatis (Auto-Detect):** Cukup tempel tautan `maps.app.goo.gl` atau ketik nama tempat, sistem otomatis mengisi nama lokasi, alamat lengkap, tautan navigasi resmi, serta estimasi jarak (KM).
- **Preset 1-Klik:** UI Gerbatama, Margo City Mall, Stasiun KRL Pondok Cina, D'Mall Margonda, Kampus D Gunadarma.
- **Geofencing:** Radius 5.0 KM dari atelier bebas ongkos kirim (Rp 0).

### 3. 💬 In-System Live Web Chat (Anti-Direct-WA Trap)
- Pengunjung berkonsultasi langsung di dalam web tanpa dipaksa pindah ke WhatsApp di awal.
- Quick chips rekomendasi buket wisuda, panduan QRIS, dan garansi.
- Asisten florist cerdas otomatis dengan balasan real-time.
- Opsi eskalasi resmi *"Alihkan ke WA Pengrajin"* hanya jika pembeli ingin mengirimkan foto kustom buket.

### 4. 🧵 Bill of Materials (BOM) & Line Chart Finansial
- Modul kalkulasi modal kawat bulu per batang (Rp 250), boneka wisuda, kertas cellophane, dan pita satin.
- Menghitung HPP, harga jual, laba kotor, dan margin untung bersih secara akurat.
- Grafik garis SVG 3-garis interaktif: **Omzet (Pink)** vs **HPP Bahan (Amber)** vs **Laba Bersih (Emerald)**.

### 5. 👥 Dual-Scenario Customer Portal ("Admin Pelanggan")
- **Skenario 1 (Guest Checkout):** Lacak pesanan langsung cukup dengan Nomor WhatsApp tanpa beban password.
- **Skenario 2 (Registered Member):** Dashboard akun pribadi lengkap dengan avatar header (`SA`), modal ubah foto/emoji avatar (`🌸`, `🌷`, `🧸`, `👑`, `🎀`), **kartu pelacakan pesanan aktif stepper 4-tahap langsung**, saldo Flower Points loyalty, dan buku alamat.

### 6. 🔐 Halaman Login & Register Multi-Tema Dinamis
- Visual halaman login otomatis beradaptasi dengan warna, font, dan elemen tema toko aktif.
- Tombol pemilih tema langsung di halaman login.
- Tombol 1-Click Fast Login Demo untuk Member (Sarah Amalia) dan Super Admin (Rania Azzahra).

### 7. 🛠️ Header Admin Anti-Penyok & Profil Dropdown
- Avatar admin terkunci sempurna 1:1 circular (38x38px) dengan proteksi anti-squish.
- Dropdown menu interaktif: Profil Pengrajin, Pengaturan Atelier, Ganti Password, dan Logout.

---

## 📸 Galeri Tangkapan Layar & Verifikasi Tampilan

### A. Admin Operations Dashboard (Layout Bersih & Bebas Tumpang Tindih)
Header dengan avatar bulat sempurna `RA`, pencarian invoice, tombol Buka Toko, Portal Pelanggan, dan kartu KPI omzet.
![Admin Header Clean](docs/screenshots/admin_header_layout_fixed.png)

### B. Titik Temu COD Google Maps & Geofencing Atelier
Peta Google Maps interaktif terintegrasi di sisi kiri dan daftar titik kumpul resmi di sisi kanan.
![Admin COD Google Maps](docs/screenshots/admin_cod_google_maps_view.png)

### C. Modal Tambah Titik COD via Google Maps (Auto-Detect & Live Preview)
Pencarian cepat atau paste tautan Google Maps dengan tombol preset populer dan live embed preview pin.
![Admin COD Modal](docs/screenshots/admin_cod_modal_google_maps.png)

### D. Hasil Titik COD Tersimpan & Peta Otomatis Berfokus
Titik baru langsung tersimpan dengan badge status dan peta Google Maps langsung terfokus ke lokasi pin.
![Admin COD Point Saved](docs/screenshots/admin_cod_point_saved_live.png)

### E. In-System Live Web Chat di Etalase Toko
Widget chat interaktif di etalase toko yang menggantikan tautan direct WA eksternal.
![Store Live Chat](docs/screenshots/store_live_chat_verified.png)

### F. Portal Member Pelanggan (Avatar & Live Order Tracking Stepper)
Dashboard akun pelanggan dengan avatar inisial, stepper 4-tahap pengerjaan buket aktif, dan saldo Flower Points.
![Customer Member Hub](docs/screenshots/customer_member_hub_verified.png)

### G. Halaman Login Multi-Tema (Tema A, B, dan C)
| Tema A: Korean Pastel | Tema B: Modern Romantic | Tema C: Playful Kawaii |
| :---: | :---: | :---: |
| ![Login Tema A](docs/screenshots/login_tema_a_verified.png) | ![Login Tema B](docs/screenshots/login_tema_b_verified.png) | ![Login Tema C](docs/screenshots/login_tema_c_verified.png) |

---

## 📁 Struktur Folder & Navigasi Berkas

```text
E-Comerce-BucketFlowers/
├── PRD.md                           # Master Product Requirement Document (PRD v2.1 Monorepo)
├── README.md                        # Dokumentasi Utama Repository
├── LICENSE                          # Lisensi MIT (2026 Ahmad Arif)
├── .gitignore                       # File Ignored Git (node_modules, .turbo, dist, .next)
├── .env.example                     # Template Variabel Lingkungan (Backend & Frontend)
├── package.json                     # Root Monorepo npm Workspaces
├── turbo.json                       # Konfigurasi Turborepo Pipeline & Caching
│
├── apps/
│   ├── web/                         # [Frontend] Next.js 15+ App Router, Tailwind, Motion
│   └── api/                         # [Backend] Express.js ESM, Better Auth, Prisma ORM
│
├── packages/
│   └── shared/                      # [@chenille/shared] Result Pattern, Zod Schemas, DTOs
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── result.ts            # Result<T> pattern class
│           ├── types/index.ts       # Shared TypeScript types
│           └── constants/index.ts   # Shared themes & geofencing constants
│
├── docs/
│   └── screenshots/                 # Tangkapan Layar Verifikasi E2E
│
└── desain-tampilan/                 # Prototipe Antarmuka Lengkap
    ├── login/index.html             # Halaman Login & Register Multi-Tema Dinamis
    ├── admin-dashboard/index.html   # Dashboard Operasional Admin v2.6
    ├── customer-portal/index.html   # Portal Pelanggan & Tracking Dual-Skenario
    ├── tema-a-korean-pastel/        # Etalase Toko Tema A (Korean Pastel)
    ├── tema-b-modern-romantic/      # Etalase Toko Tema B (Modern Romantic)
    └── tema-c-playful-kawaii/       # Etalase Toko Tema C (Playful Kawaii)
```

---

## 🎭 Arsitektur Multi-Theme Engine

Sistem menggunakan arsitektur **Design Token Abstraction**:
```css
/* Contoh Abstraksi Token Tema */
:root {
  --primary: #F43F5E;
  --primary-light: #FFF1F2;
  --theme-font: 'Plus Jakarta Sans', sans-serif;
  --theme-radius: 12px;
}

html[data-theme="tema-a"] {
  --primary: #E86A82;
  --theme-font: 'Outfit', sans-serif;
}

html[data-theme="tema-b"] {
  --primary: #722F37;
  --theme-font: 'Playfair Display', serif;
}

html[data-theme="tema-c"] {
  --primary: #FF6B81;
  --theme-font: 'Fredoka', cursive;
}
```
Untuk menambahkan **Tema D (Vintage Botanical)** atau tema baru lainnya di masa mendatang:
1. Daftarkan konfigurasi tema baru di registry (`themes.config.js`).
2. Tambahkan CSS token variabel `--theme-*`.
3. Seluruh fitur bisnis (checkout, chat, tracking, auth) akan langsung mewarisi tema tersebut tanpa perlu menulis ulang logika aplikasi.

---

## 🗺️ Integrasi Titik Temu COD Google Maps

```
Pelanggan / Admin Input
        │
        ▼
[ Paste Link Google Maps / Ketik Nama Tempat ]
        │
        ├── Otomatis Ekstrak Nama Tempat (e.g. "Margo City Mall")
        ├── Otomatis Ekstrak Alamat Lengkap Terverifikasi
        ├── Otomatis Ambil Share URL Google Maps (maps.google.com/?q=...)
        ├── Hitung Estimasi Jarak dari Atelier Pusat (KM)
        └── Tampilkan Live Embed Pin Google Maps di Modal
        │
        ▼
[ Simpan ke Daftar Titik Temu Aktif ]
        │
        ├── Tampil di Menu Admin COD Maps (Fokus Peta, Buka Maps, Salin Link)
        └── Tampil di Dropdown Pilihan Pengiriman Checkout Pembeli
```

---

## 👤 Dual-Scenario Portal Pelanggan

| Parameter | Skenario 1: Guest Tracking | Skenario 2: Registered Member |
| :--- | :--- | :--- |
| **Kebutuhan Akun** | Tanpa Login / Cukup No. WhatsApp | Wajib Login (Email/HP + Password) |
| **Identitas Header** | Tombol "Masuk Akun" | Avatar Inisial/Emoji (`SA`) + Dropdown Profil |
| **Penyimpanan Data** | Berbasis Cookie Sesi | Tersimpan Permanen di Database |
| **Pelacakan Aktif** | Masukkan No. HP -> Daftar Invoice | Langsung Tampil Stepper 4-Tahap di Dashboard |
| **Keuntungan Ekstra** | Cepat, ringkas | Saldo Flower Points, Voucher Diskon, Buku Alamat |

---

## 🚀 Cara Menjalankan Aplikasi

### Opsi 1: Workflow Monorepo (Turborepo + npm Workspaces)
```bash
# 1. Install seluruh dependensi workspaces (apps/* & packages/*)
npm install

# 2. Jalankan semua apps secara simultan dengan caching Turborepo
npm run dev
# atau: npx turbo run dev

# 3. Build semua package dan apps untuk produksi
npm run build
# atau: npx turbo run build
```

### Opsi 2: Preview Cepat Prototipe Showcase (Tanpa Build)
Klik dua kali berkas HTML berikut di browser (Chrome / Edge / Safari) atau gunakan local server:
- `desain-tampilan/index.html` (Hub Navigasi Semua Tampilan)
- `desain-tampilan/login/index.html` (Simulasi Login Multi-Tema)
- `desain-tampilan/admin-dashboard/index.html` (Simulasi Admin Panel v2.6)
- `desain-tampilan/customer-portal/index.html?mode=member` (Simulasi Portal Member)
- `desain-tampilan/tema-a-korean-pastel/index.html` (Etalase Tema Korean Pastel)

```bash
# Alternatif menggunakan Python HTTP server:
python -m http.server 8080
# Buka http://localhost:8080/desain-tampilan/index.html
```

---

## 📄 Spesifikasi Lengkap (PRD)

Dokumentasi rancangan produk, skema basis data PostgreSQL Prisma lengkap, aturan operasional, dan arsitektur teknis menyeluruh dapat dibaca pada berkas [PRD.md](PRD.md).

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah lisensi MIT — lihat berkas [LICENSE](LICENSE) untuk rincian lengkap hak cipta dan izin penggunaan.

---

**Dikembangkan dengan ❤️ untuk Ekosistem Usaha Kreatif Buket Bunga Kawat Bulu.**
