# 📜 ENGINEERING & DEVELOPMENT RULES: CHENILLE FLOWERS ATELIER MONOREPO

> **Dokumen Resmi Standar Rekayasa & Tata Kelola Pengembangan Sistem**  
> **Dasar Rujukan Mutlak:** [PRD.md](file:///c:/Users/ASUS/Documents/Web%20Dev/improving/E-Comerce-BucketFlowers/PRD.md)  
> **Status:** Berlaku Mengikat (*Strict Mandatory*) untuk Seluruh Proses Development

---

## 1. Filosofi Inti & Prinsip Rekayasa (*Core Engineering Philosophy*)

1. **Supremasi [PRD.md](file:///c:/Users/ASUS/Documents/Web%20Dev/improving/E-Comerce-BucketFlowers/PRD.md) (Single Source of Truth):**
   * Seluruh penamaan variabel, struktur basis data, kontrak API endpoint, alur logika bisnis, hingga matriks teks (*copywriting*) wajib merujuk 100% pada [PRD.md](file:///c:/Users/ASUS/Documents/Web%20Dev/improving/E-Comerce-BucketFlowers/PRD.md).
   * Dilarang mengarang asumsi arsitektur atau mengubah skema yang sudah disepakati tanpa persetujuan pengguna.

2. **Kebijakan Mutlak *Zero-Dummy* (PRD Seksi 17.12):**
   * Dilarang keras menggunakan data tiruan statis (*hardcoded dummy data*) pada *production code paths*.
   * Seluruh entitas data (produk, kampanye, absensi, stempel, telemetri, toko, COD) wajib terhubung ke database fisik PostgreSQL Supabase melalui Prisma ORM.

3. **Prinsip *Zero-Regression* (Perlindungan Fitur Aktif):**
   * Fitur e-commerce yang sudah stabil dan lulus uji (katalog produk, keranjang belanja, simulasi pembayaran Midtrans Snap, kalkulasi ongkir Biteship, geofencing Google Maps, dan autentikasi sesi) **DILARANG RUSAK** saat menambahkan fitur baru.
   * Setiap penambahan kode baru wajib melewati verifikasi kompatibilitas terhadap fitur yang telah ada.

4. **Tata Kelola Kebersihan Berkas (*Zero-Residual Scratch Rule*, PRD Seksi 17.15):**
   * Dilarang membuat file uji coba, berkas *scratch*, skrip sementara, atau catatan *debug* di *root* monorepo maupun di dalam folder aplikasi (`apps/web`, `apps/api`).
   * Seluruh pengujian sementara wajib dibersihkan segera setelah verifikasi selesai.

---

## 2. Protokol Eksekusi Bertahap & Pelaporan Selesai (*Phased Handover Protocol*)

Sesuai dengan **Seksi 22 [PRD.md](file:///c:/Users/ASUS/Documents/Web%20Dev/improving/E-Comerce-BucketFlowers/PRD.md)**, pengembangan sistem dijalankan secara berurutan dalam **5 Fase Bertahap**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               ROADMAP PENGEMBANGAN SISTEM BERTAHAP                               │
├─────────────────┬─────────────────┬─────────────────┬──────────────────┬─────────────────────────┤
│     FASE 1      │     FASE 2      │     FASE 3      │      FASE 4      │         FASE 5          │
│ Data Modeling & │ Backend RESTful │ Admin Dashboard │ Storefront &     │ End-to-End QA,          │
│ Database Schema │ API Endpoints   │ Suite (Campaign)│ Portal Pelanggan │ Audit & Hardening       │
└─────────────────┴─────────────────┴─────────────────┴──────────────────┴─────────────────────────┘
```

### 📌 Aturan Wajib Pelaporan Setiap Fase Selesai:
Setiap kali satu tahapan fase selesai dikerjakan, pengembang/AI **WAJIB** melakukan:
1. **Verifikasi Teknis Nyata:** Menjalankan `build`, `type-check`, atau `test` untuk memastikan kode tidak memiliki kesalahan sintaks atau tipe data.
2. **Laporan Deliverables Selesai:** Menyajikan rangkuman daftar file yang diubah/dibuat serta fitur apa saja yang berhasil diimplementasikan.
3. **Penyajian Status *Definition of Done* (DoD):** Menampilkan checklist kriteria sukses fase tersebut.
4. **Pemberitahuan Langkah Selanjutnya (*Next Step Preview*):** Menjelaskan secara spesifik apa agenda pengerjaan pada fase berikutnya dan meminta konfirmasi/persetujuan pengguna sebelum melangkah ke fase berikutnya (*Human-in-the-Loop*).

---

## 3. Standar Rekayasa Backend (`apps/api`)

1. **Pola Penulisan Kode (Guard Clause & Early Return):**
   * Wajib menerapkan *Guard Clauses*. Periksa kondisi gagal/invalid di awal fungsi dan langsung kembalikan *early return*. Hindari *deep nesting* (`if-else` bertingkat).
   * Gunakan *Result Pattern* dari paket `@chenille/shared` (`Result.ok(data)` atau `Result.err(error)`).

2. **Validasi Input Request:**
   * Setiap request body, query parameter, dan route parameter wajib divalidasi menggunakan skema Zod sebelum diproses oleh controller/service.
   * Return error format standar RFC 7807 (`type`, `title`, `status`, `detail`, `instance`).

3. **Logging & Observabilitas:**
   * Gunakan logger terstruktur Pino (`req.log` atau logger singleton).
   * Dilarang menggunakan `console.log` mentah di lingkungan backend produksi.
   * Catat *contextual metadata* (misal: `userId`, `orderId`, `durationMs`).

4. **Atomic Locking & Integritas Transaksi:**
   * Operasi penambahan stempel dan pencatatan absensi harian wajib menggunakan transaksi database (`prisma.$transaction`) untuk mencegah *race condition* atau duplikasi data (*double-claim*).

---

## 4. Standar Rekayasa Frontend (`apps/web`)

1. **Arsitektur Next.js 15 App Router:**
   * Pisahkan secara tegas antara *Server Components* (RSC) untuk pengambilan data awal dan *Client Components* (`'use client'`) untuk interaktivitas dinamis (state, form, event handler).
   * Gunakan Zustand store untuk manajemen state global (misal: `useCartStore`, `useThemeStore`, `useSettingsStore`).

2. **UI/UX Pro Max & Art Direction Visual (PRD Seksi 21):**
   * **Bespoke Product Showcase:** Bagian Hero Section **DILARANG** menampilkan screenshot website mini di dalam kartu (*website inside a website*). Wajib menampilkan foto fisik resolusi tinggi produk asli buket kawat bulu dengan *floating info badges*.
   * **Standar Aset Ikon:** **DILARANG** menggunakan emoji teks biasa (`🥀`, `✨`) sebagai ikon UI resmi. Wajib menggunakan ikon SVG/Lucide berstandar desain matang.
   * **Aksen Ornamen Tema:** Terapkan aksen bingkai spesifik tema secara dinamis:
     * *Tema A (Pastel):* Polaroid miring + aksen washi tape.
     * *Tema B (Romantic Velvet):* Lengkungan arsitektur klasik (*arch*) + lis champagne gold.
     * *Tema C (Kawaii Sunflower):* Bingkai timbul puffy 3D + stiker lencana membal.

3. **Kepatuhan Matriks Copywriting (PRD Seksi 20):**
   * Bahasa antarmuka (Announcement bar, Hero, CTA, deskripsi produk, empty state, notifikasi WhatsApp) wajib mengambil data dari kamus *Tone of Voice* sesuai tema aktif:
     * *Tema A:* Kalem, ramah, hangat, estetik bersahaja.
     * *Tema B:* Puitis, eksklusif, prestisius, mewah berkelas.
     * *Tema C:* Ceria, seru, gaul, penuh antusiasme sahabat karib.

4. **Aksesibilitas & Performa Motion:**
   * Animasi interaktif (kartu absensi mekar, stempel bercahaya, transisi tema) wajib akselerasi GPU (menggunakan CSS `transform`/`opacity` atau Motion).
   * Wajib menyertakan media query `@media (prefers-reduced-motion: reduce)`.

---

## 5. Standar Paket Shared & Tipe Data (`packages/shared`)

1. **Single Contract Policy:**
   * Semua DTO (Data Transfer Objects), enum, konstanta kampanye, dan response types harus didefinisikan sekali di `packages/shared/src/types`.
   * Backend dan Frontend dilarang menduplikasi definisi tipe secara terpisah (*anti-type fragmentation*).

2. **Build Before Use:**
   * Setiap kali ada penambahan tipe data di `packages/shared`, jalankan `npm run build:shared` agar paket terkompilasi dan dapat dibaca oleh `apps/web` dan `apps/api`.

---

## 6. Protokol Tata Kelola Git & Version Control

1. **Conventional Commit Standard:**
   * Format pesan commit wajib menggunakan standar konvensional:
     * `feat(scope): ...` untuk penambahan fitur baru.
     * `fix(scope): ...` untuk perbaikan bug.
     * `docs(scope): ...` untuk dokumentasi atau PRD.
     * `refactor(scope): ...` untuk restrukturisasi kode tanpa mengubah fungsionalitas.
     * `test(scope): ...` untuk penambahan atau pembaruan pengujian.

2. **Sinkronisasi Berkala ke GitHub:**
   * Setiap fase yang telah tuntas dan diverifikasi harus di-commit dan di-push ke remote repository `origin main` agar riwayat kemajuan proyek tercatat aman di GitHub.

---

## 7. Rangkuman Siklus Kerja Harian (Development Workflow Loop)

```
[BACA PRD.MD & RULES.MD] 
       │
       ▼
[KERJAKAN SUB-TASK FASE] 
       │
       ▼
[VERIFIKASI & TEST KODE] 
       │
       ▼
[BERSIHKAN SCRATCH / JUNK] 
       │
       ▼
[LAPORKAN HASIL KE PENGGUNA + PREVIEW LANGKAH BERIKUTNYA] 
       │
       ▼
[TUNGGU KONFIRMASI USER (HUMAN-IN-THE-LOOP)] 
       │
       ▼
[COMMIT & PUSH KE GITHUB ➔ LANJUT FASE BERIKUTNYA]
```

---
*Peraturan ini bersifat mutlak dan harus dipatuhi oleh seluruh agen dan tim pengembang sepanjang siklus hidup proyek Chenille Flowers Atelier.*
