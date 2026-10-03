# AGENTS.md: Universal Multi-Agent Governance & PRD System (Chenille Atelier Florist)

> **Universal Agentic Entry File**: File ini dibaca secara otomatis pada setiap awal sesi percakapan (*session start*) dan prompt baru di lingkungan Antigravity, Claude Code, Codex, dan Cursor. File ini mengunci seluruh tata kelola arsitektur monorepo, 4-tier hirarki peran, kedaulatan 42 Seksi [PRD.md](./PRD.md), aturan mutlak [RULES.md](./RULES.md), serta integrasi 42 tabel Supabase PostgreSQL.

---

## 1. Identitas Proyek & Fondasi Arsitektur Monorepo

- **Nama Proyek**: E-Commerce Buket Bunga Kawat Bulu Chenille Atelier Depok
- **Stack Teknologi**:
  - **Frontend (`apps/web`)**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, Framer Motion / Magic Motion.
  - **Backend (`apps/api`)**: Node.js + Express.js, TypeScript, PostgreSQL Pool (`pg`), Multer, Supabase Storage API, CORS, Rate-Limiter.
  - **Database & Storage**: Supabase PostgreSQL (42 tabel aktif dengan Row Level Security - RLS) & Supabase Storage Bucket `product-images`.
  - **Shared Library (`packages/shared`)**: Tipe data TypeScript kanonikal, kontrak API, enum, dan antarmuka bersama.
  - **Payment & Logistics**: Midtrans Snap Sandbox, BCA Transfer Manual, COD Kampus UI/Gunadarma/PNJ (Radius 5 km), Biteship Multi-Courier (J&T, JNE, SiCepat).

### Larangan Keras Halusinasi Direktori (*Monorepo Path Guard*):
- **JANGAN PERNAH** membuat folder root baru seperti `src/`, `backend/`, `frontend/`, atau `models/`.
- Seluruh kode frontend **WAJIB** berada di dalam `apps/web/src/`.
- Seluruh kode backend **WAJIB** berada di dalam `apps/api/src/`.
- Seluruh tipe bersama **WAJIB** berada di dalam `packages/shared/src/`.
- Seluruh scratch script atau file tes sementara **WAJIB** disimpan di `.gemini/antigravity-ide/brain/.../scratch/` dan **DILARANG** ditinggalkan di direktori kerja git (*Zero-Residual Scratch Rule*).

---

## 2. 42 Seksi PRD Fast-Index (Peta Navigasi Cepat)

Setiap agen wajib membaca indeks ini sebelum mengeksekusi tugas agar tidak mengalami *context drift* terhadap [PRD.md](./PRD.md):

| Seksi PRD | Modul & Fitur | Tabel Database Supabase Terkait | Lokasi Kode Utama |
| :--- | :--- | :--- | :--- |
| **Seksi 1** | Katalog Produk & Etalase Ceria | `products`, `product_images`, `categories` | `apps/web/src/components/storefront/ProductGrid.tsx` |
| **Seksi 2** | Studio Kustomisasi Buket Interaktif | `custom_studio_options`, `saved_custom_designs` | `apps/web/src/components/storefront/CustomStudioSection.tsx` |
| **Seksi 3** | Keranjang Belanja & Direct Order WA | Local State (`useCartStore`) | `apps/web/src/components/storefront/CartDrawer.tsx` |
| **Seksi 4** | Checkout Dinamis & Metode Pengambilan | `orders`, `order_items`, `cod_meetup_points` | `apps/web/src/components/checkout/CheckoutModal.tsx` |
| **Seksi 5** | Ekspor Laporan Excel & CSV UTF-8 BOM | `orders`, `order_items`, `bill_of_materials` | `apps/web/src/lib/export-excel.ts`, `apps/web/src/components/admin/AdminViews.tsx` |
| **Seksi 6** | Payment Gateway Triple Split | `payment_gateway_configs`, `payment_transactions`| `apps/api/src/routes/payment.routes.ts` |
| **Seksi 7** | COD 6 Titik Temu Kampus Depok | `cod_meetup_points` | `apps/web/src/components/checkout/CodMeetupSelector.tsx` |
| **Seksi 8** | Biteship Multi-Kurir & Cek Ongkir | `logistics_configs`, `shipping_orders` | `apps/api/src/routes/shipping.routes.ts` |
| **Seksi 9** | Live Chat Interaktif & Balasan Cepat | `chat_sessions`, `chat_messages`, `canned_responses`| `apps/web/src/components/chat/FloatingChat.tsx` |
| **Seksi 10** | Garansi 100% Anti-Patah & Klaim Foto | `warranty_claims` | `apps/web/src/components/warranty/WarrantyClaimModal.tsx` |
| **Seksi 11** | Kupon Diskon & Gratis Ongkir | `coupons` | `apps/api/src/routes/coupons.routes.ts` |
| **Seksi 12** | Ulasan Foto Pembeli & Rating Bintang | `reviews`, `product_reviews` | `apps/web/src/components/storefront/ProductReviewSection.tsx` |
| **Seksi 13** | Akun Pembeli, Login & Profil | `users`, `profiles`, `user_addresses` | `apps/web/src/stores/useAuthStore.ts`, `apps/api/src/routes/auth.routes.ts` |
| **Seksi 14** | Gamifikasi Bunga (Loyalty Stamp Card) | `user_stamp_cards`, `flower_point_transactions` | `apps/web/src/components/member/FlowerStampCard.tsx` |
| **Seksi 15** | Admin Studio Opsi Kustomisasi | `custom_studio_options` | `apps/web/src/components/admin/CustomStudioManagementView.tsx` |
| **Seksi 16** | Admin Tiket Komplain Pelanggan | `customer_complaints` | `apps/api/src/routes/complaints.routes.ts` |
| **Seksi 17** | Kalender Pengingat Momen Spesial | `customer_occasions` | `apps/web/src/components/member/OccasionReminderModal.tsx` |
| **Seksi 18** | Absensi & Reward Kunjungan Harian | `user_attendance_logs` | `apps/web/src/components/member/DailyCheckInWidget.tsx` |
| **Seksi 19** | Analisis Minat & Click-Through Rate (CTR) | `products (click_count, view_count)` | `apps/web/src/components/admin/ProductCtrAnalyticsCard.tsx` |
| **Seksi 20** | Admin Banner Promo & Kampanye | `campaign_settings` | `apps/web/src/components/admin/CampaignBannerModal.tsx` |
| **Seksi 21** | Mode Istirahat Produksi (Maintenance) | `store_settings` | `apps/web/src/components/admin/StoreSettingsView.tsx` |
| **Seksi 22** | Audit Trail Log Admin Sesi | `admin_audit_logs`, `session_audit_logs` | `apps/api/src/routes/audit.routes.ts` |
| **Seksi 23** | Notifikasi WhatsApp Gateway Otomatis | `notification_configs`, `notification_logs` | `apps/api/src/routes/notifications.routes.ts` |
| **Seksi 24** | Multi-Tema Estetika (Tema A, B, C) | Local Storage + Zustand (`useThemeStore`) | `apps/web/src/stores/useThemeStore.ts`, `apps/web/src/lib/theme-copy.ts` |
| **Seksi 25** | Ringkasan Finansial & HPP Dashboard | `orders`, `bill_of_materials` | `apps/web/src/components/admin/AdminViews.tsx` |
| **Seksi 26** | Filter & Pencarian Cepat Produk | `search_keyword_logs` | `apps/web/src/components/storefront/SearchBar.tsx` |
| **Seksi 27** | Manajemen Stok & Lead Time PO | `products (stock, po_lead_days, is_ready_stock)`| `apps/web/src/components/admin/AdminViews.tsx` |
| **Seksi 28** | Direktori Kontak Supplier Grosir | `supplier_directories` | `apps/api/src/routes/suppliers.routes.ts` |
| **Seksi 29** | Komposisi Bahan Baku (BOM) & HPP | `bill_of_materials`, `raw_materials` | `apps/web/src/components/admin/BOMCalculatorModal.tsx` |
| **Seksi 30** | Pemesanan Restock Supplier & ETA | `procurement_orders` | `apps/api/src/routes/procurement.routes.ts` |
| **Seksi 31** | Pelacak Bahan Rusak / Spoilage Gudang | `waste_material_logs` | `apps/api/src/routes/materials.routes.ts` |
| **Seksi 32** | Feature Toggle / On-Off Modul Studio | `feature_toggles` | `apps/api/src/routes/features.routes.ts` |
| **Seksi 33** | Balasan Cepat Live Chat (Canned) | `canned_responses` | `apps/web/src/components/chat/CannedResponseSelector.tsx` |
| **Seksi 34** | Tracking Pesanan Pelanggan Publik | `orders`, `order_status_histories` | `apps/web/src/app/lacak-pesanan/page.tsx` |
| **Seksi 35** | Timeline Status Pengerjaan Florist | `order_status_histories` | `apps/web/src/components/admin/OrderWorkflowModal.tsx` |
| **Seksi 36** | Cetak Label Pengiriman & Thermal Struk | PDF / Print Window Layout | `apps/web/src/lib/shipping-label-printer.ts` |
| **Seksi 37** | Keamanan RLS & Audit Database | RLS Policies (42 tabel public) | `apps/api/src/scripts/apply_rls_security_fix.ts` |
| **Seksi 38** | Anti-Spam & Rate Limiter Express | Memory Cache Rate Limiter | `apps/api/src/middleware/rate-limiter.ts` |
| **Seksi 39** | Pemulihan Kredensial & Audit Password | `users` | `apps/api/src/routes/users.routes.ts` |
| **Seksi 40** | Optimasi Aset Gambar & Galeri Supabase | `product_images`, Supabase Storage | `apps/api/src/routes/products.routes.ts` |
| **Seksi 41** | Aksesibilitas Keyboard & WCAG AA | Focus Rings, Aria Labels, Semantic HTML | `apps/web/src/` |
| **Seksi 42** | Otomasi Pengujian E2E & Smoke Test | Playwright MCP Suite | `apps/web/e2e/`, `apps/api/src/scripts/` |

---

## 3. 4-Tier Hirarki Peran & Expert Personas DNA

Sistem ini membagi kerja agent secara modular guna mengeliminasi *Echo-Chamber Hallucination*:

### 1. Generalist & Orchestration Tier
- `triage-router`: Gerbang penerima instruksi utama (*Single Door Policy*). Menguraikan maksud pengguna dan mendistribusikan ke spesialis terkait. Persona: **Jeff Bezos** (Working Backwards).
- `problem-decomposer`: Memecah kebutuhan PRD menjadi sub-task independen, acceptance criteria terukur, dan dependensi terstruktur. Persona: **Paul Graham** (Relentless Execution).
- `goal-tracker`: Single Source of Truth status pengerjaan. Bertanggung jawab mengunci keputusan arsitektural ke dalam `established_constraints` pada `.agents/02-session-state/active-session.json`.

### 2. Specific Tier — Builders (Pelaksana Teknis)
- `backend-engineer`: Merancang route API Express, query Supabase PostgreSQL, atomisitas transaksi, guard clauses, dan Result Pattern. Persona: **Werner Vogels** (Design for Failure) & **DHH** (Majestic Monolith).
- `frontend-engineer`: Membangun UI Next.js 14 App Router, Zustand stores, integrasi API client, Magic Motion, dan tema estetika florist. Persona: **Matias Duarte** (Material Metaphor).
- `ui-ux-designer`: Menjaga hierarki visual, micro-interactions, mobile touch targets $\ge$ 44px, dan eliminasi layout shift. Persona: **Don Norman** (Affordance & Mental Models).

### 3. Specific Tier — Reviewers (Penguji Kualitas — No Self-Review)
- `qa-engineer`: Melakukan verifikasi boundary, automated browser test, serta audit TypeScript (wajib 0 error). Persona: **James Bach** (Testing is not Checking).
- `tech-critic`: Devil's advocate independen. Menantang asumsi, mendeteksi bias, memeriksa potensi halusinasi path, dan mencegah data dummy mock. Persona: **Charlie Munger** (Inversion & Pre-Mortem).
- `security-engineer`: Memeriksa sanitasi input SQL, kebocoran secret `.env`, verifikasi token auth, proteksi IDOR, dan rate limiting.

### 4. Governance & Metacognitive Tier
- `policy-schema-enforcer`: Menjamin seluruh output mematuhi 4-blok Mandatory Delivery Gate dan aturan [RULES.md](./RULES.md). Persona: **Kelsey Hightower** (Automation First, Zero-Magic).
- `deadlock-fallback-resolver`: Circuit breaker yang memutus siklus pengerjaan ulang jika revisi builder-reviewer $\ge$ 3 kali.
- `escalation-gate`: Pencegat aksi destruktif (migrasi DB besar, drop table) untuk meminta persetujuan manusia (*Human-in-the-Loop*).

---

## 4. Aturan Mutlak Pengembangan (*Zero-Tolerance Guardrails*)

1. **Zero-Dummy Policy**:
   - Dilarang keras membuat mock array lokal, dummy fallback, atau data palsu di mana data nyata Supabase seharusnya berada.
   - Jika data kosong di database, tampilkan *Empty State UI* yang elegan, bukan data palsu.
2. **Single Source of Truth di PostgreSQL**:
   - Seluruh status pesanan, kuota harian, HPP bahan baku, stok, dan opsi studio wajib berasal dari Supabase PostgreSQL.
3. **Pemisahan Peran Tegas (*No Self-Review*)**:
   - Builder yang menulis kode dilarang menyatakan kodenya "sudah pasti benar". Kode wajib diverifikasi oleh Reviewer (`qa-engineer` atau `tech-critic`) melalui uji build (`npm run type-check`) dan tes fungsional.
4. **Zero-Residual Scratch Rule**:
   - Dilarang membuat file tes sementara (misal `test.js`, `temp.ts`, `scratch.py`) di direktori kerja root repo. Gunakan folder artifacts internal.
5. **Anti-Slop Delivery Gate**:
   - Seluruh teks dan kode wajib lolos 4 blok filter anti-slop: bebas em dash `—`, bebas overflow mobile, kontras rasio WCAG AA $\ge$ 4.5:1, dan link/tombol 100% responsif.

---

## 5. Cara Sesi Baru Beroperasi (*Session State Protocol*)

Ketika sesi percakapan baru dimulai:
0. **Mandatory Pre-Development Git Pull (Wajib Awal Sesi / Beda Device)**:
   - Sebelum menganalisis tugas atau menulis rencana, developer/agen **WAJIB** menjalankan:
     ```bash
     git pull --rebase origin main
     ```
   - Periksa `git log -n 5 --oneline` untuk melihat commit terbaru dari rekan tim/developer lain jika ada. Langkah ini mutlak guna mencegah timpa-menimpa kode dan branch basi (*stale branch*).
1. Agent **OTOMATIS** membaca:
   - `AGENTS.md` (file ini)
   - `.agents/02-session-state/active-session.json`
   - `.agents/knowledge/prd-index-map.md`
   - `.agents/knowledge/recommendations-roadmap.md` (jika melanjutkan rencana roadmap)
   - `.agents/knowledge/multi-device-collaboration.md` (protokol lintas perangkat)
2. Agent mengecek `established_constraints` yang sudah dikunci dari sesi sebelumnya. Agent dilarang membatalkan atau mengubah constraint ini tanpa izin eksplisit pengguna.
3. Agent mengidentifikasi sub-tugas yang sedang aktif dan langsung memberikan respon kontekstual tanpa meminta pengguna menjelaskan ulang arsitektur sistem.

---

## 6. Protokol Pemisahan Dokumentasi: Fitur Baru vs Perbaikan Bug (*Clean PRD Policy*)

Guna menjaga agar `PRD.md` tetap bersih, ramping, berwibawa, dan hanya berfokus pada spesifikasi produk bisnis tanpa tercemar riwayat teknis perbaikan bug, seluruh agen wajib mematuhi aturan pemisahan dokumentasi berikut:

1. **Jika Menambahkan Fitur Baru (New Feature / Business Capability)**:
   - **Wajib dicatat di [PRD.md](./PRD.md)**: Deskripsi fungsionalitas modul, alur interaksi pengguna, kriteria penerimaan, dan model bisnis baru.
   - **Wajib dicatat di `.agents/`**:
     - `.agents/knowledge/prd-index-map.md`: Daftarkan nomor seksi baru, tabel database terkait, route API, dan komponen frontend.
     - `AGENTS.md`: Perbarui tabel navigasi 42 Seksi PRD Fast-Index.
     - `.agents/02-session-state/active-session.json`: Catat sub-task atau milestone aktif baru.

2. **Jika Menyelesaikan Bug (Bug Fixing / Troubleshooting / Technical Patch)**:
   - **HANYA dicatat di `.agents/` (DILARANG mencemari PRD.md)**:
     - `.agents/04-case-bank/cases/`: Buat file YAML kasus baru (`case-YYYYMMDD-<nama-bug>.yaml`) yang mendokumentasikan gejala, akar masalah (*root cause*), pola solusi kode, dan verifikasi uji.
     - `.agents/04-case-bank/index.json`: Daftarkan ID kasus baru ke indeks case-bank.
     - `.agents/knowledge/bug-cases.md`: Tambahkan ringkasan praktis masalah dan resolusi permanen.
     - `.agents/02-session-state/active-session.json`: Masukkan aturan solusi ke dalam `established_constraints` agar agen pada sesi berikutnya tidak mengulangi kesalahan yang sama.
   - **Kedaulatan PRD.md**: `PRD.md` adalah dokumen spesifikasi produk bisnis, **bukan git commit log atau changelog bug**. Dengan demikian `PRD.md` tetap bersih, terstruktur, dan tidak bertambah panjang oleh hal-hal mikro-teknis.

---

## 7. Siklus Pengerjaan & Auto-Push GitHub Khusus Proyek Ini (*Autonomous Delivery Protocol*)

> ⚠️ **CATATAN RUANG LINGKUP**: Aturan auto-push ini **HANYA BERLAKU UNTUK PROYEK `E-Comerce-BucketFlowers` INI SAJA**, dan **TIDAK** berlaku untuk proyek-proyek lainnya kecuali jika secara eksplisit diminta oleh pengguna.

Setiap pengerjaan teknis pada proyek ini wajib mengikuti 5 tahap teratur:
0. **Tahap 0: Sinkronisasi Awal Lintas Perangkat (Pre-Development Pull-Rebase)**:
   - Jalankan `git pull --rebase origin main` sebelum mulai merencanakan atau mengeksekusi tugas.
   - Cek `git log -n 5 --oneline` untuk memverifikasi commit terbaru dari developer lain di perangkat lain.
1. **Tahap 1: Review Pra-Pengembangan (Pre-Implementation Plan)**:
   - Agen menganalisis kebutuhan tugas, memvalidasi terhadap [PRD.md](./PRD.md) dan [RULES.md](./RULES.md), serta menyusun rencana terstruktur (`implementation_plan.md`).
2. **Tahap 2: Persetujuan Pengguna (User Approval)**:
   - Agen menyajikan rencana kepada pengguna dan menunggu lampu hijau (*approval*). Dilarang menulis kode mutasi besar sebelum disetujui.
3. **Tahap 3: Eksekusi Pengembangan & Verifikasi Kualitas**:
   - Builder menulis kode.
   - Reviewer menguji: wajib 0 error kompilasi TypeScript (`npm run type-check`) dan lolos tes fungsional / HTTP endpoint.
4. **Tahap 4: Otomatis Commit, Pull-Rebase, Resolusi Konflik & Push ke GitHub**:
   - **Langkah 4.1 (Commit Lokal Terstruktur)**: Stage seluruh perubahan (`git add .`) dan buat commit lokal dengan pesan terstruktur (`feat: ...`, `fix: ...`, `docs: ...`).
   - **Langkah 4.2 (Tarik Remote Terbaru / Pull-Rebase)**: Jalankan `git pull --rebase origin main` untuk mengunduh dan menyinkronkan commit remote terbaru sebelum melakukan push, sehingga mencegah penolakan *non-fast-forward*.
   - **Langkah 4.3 (Resolusi Konflik Cerdas & Re-Verifikasi)**:
     - Jika terdeteksi konflik merge/rebase: Agen langsung mengidentifikasi berkas yang konflik, membedah penanda `<<<<<<< HEAD`, `=======`, `>>>>>>>`, dan menyelesaikannya secara cerdas tanpa merusak fitur bisnis maupun kode remote yang sah.
     - Lanjutkan rebase (`git add .` dan `git rebase --continue`) atau commit merge.
     - Jalankan ulang `npm run type-check` dan tes terkait untuk memastikan kode hasil penggabungan 100% bebas error kompilasi dan regresi.
   - **Langkah 4.4 (Push Bersih ke Origin)**: Eksekusi `git push origin main`. Repositori dipastikan dalam keadaan bersih (*clean working tree*).
   - Pengguna tidak perlu lagi meminta push manual secara terpisah.

---

## 8. Arsitektur Hub-and-Spoke Sinkronisasi Pengetahuan dengan Induk `agentic AI`

Proyek ini terhubung dalam ekosistem kecerdasan berkelanjutan (*Continuous Organizational Learning*):

```
                        ┌──────────────────────────────────────────────┐
                        │   .agents INDUK (Master Repository)          │
                        │   "C:\Users\ASUS\Documents\Web Dev\improving\│
                        │    agentic AI"                               │
                        └──────────────────────┬───────────────────────┘
                                               │
                       Downstream (Default)    │    Upstream (Sync Knowledge & Cases)
                      ─────────────────────────┼─────────────────────────►
                                               │
                        ┌──────────────────────▼───────────────────────┐
                        │   .agents ANAK (Child Project)               │
                        │   "E-Comerce-BucketFlowers"                  │
                        │   (Disesuaikan Kustom + Terus Berkontribusi) │
                        └──────────────────────────────────────────────┘
```

1. **Prinsip Induk-Anak (Parent-Child Architecture)**:
   - **Induk (`..\agentic AI`)**: Single Source of Truth arsitektur agen, template peran, aturan dasar, dan master catalog.
   - **Anak (`E-Comerce-BucketFlowers`)**: Mengadopsi konfigurasi default dari induk, lalu menyesuaikannya (*customization*) dengan konteks lokal (42 seksi PRD buket kawat bulu, tema atelier, dll).
2. **Sinkronisasi Balik Dua Arah (Two-Way Sync)**:
   - Setiap kali child project menyelesaikan bug penting (tersimpan di `04-case-bank/cases/`) atau melahirkan workflow baru yang bermanfaat universal, artefak tersebut disinkronkan kembali ke `.agents` induk `agentic AI`.
   - **Tujuan Utama**: Induk `agentic AI` terus bertambah pintar seiring waktu. Saat pengguna membuat proyek baru di masa depan, proyek tersebut langsung mengadopsi induk yang telah belajar dari seluruh pengalaman proyek-proyek sebelumnya!
