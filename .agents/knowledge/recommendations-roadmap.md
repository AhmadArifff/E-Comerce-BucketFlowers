# Roadmap Rekomendasi Pengembangan Lanjutan (.agents Knowledge)

> **Dokumen Panduan Pengembangan Lintas Perangkat**: Dokumen ini mencatat 5 pilar rekomendasi strategis dan teknis yang telah diverifikasi dan disiapkan agar developer atau agen pada perangkat/sesi lain dapat langsung melanjutkan pengerjaannya secara modular tanpa kehilangan konteks.

---

## 1. Prioritas 1: Form Ulasan Bintang & Foto Pembeli Pasca-Pesanan Selesai [COMPLETED - VERIFIED PASS]
*Terkait: PRD Seksi 12 (Ulasan Foto Pembeli & Rating Bintang) & Seksi 14 (Gamifikasi Poin) | Tabel: `reviews`, `profiles`, `flower_point_transactions` | Storage: `product-images`*

### Status: SELESAI & TERVERIFIKASI
- **Frontend**:
  - `apps/web/src/components/portal/OrderReviewModal.tsx`: Modal interaktif rating bintang 1-5, dropzone upload foto buket asli, textarea ulasan jujur, reward callout (+25 Flower Points), dan feedback toast.
  - `apps/web/src/app/portal/page.tsx`: Tombol *"Beri Ulasan Buket 🌸"* aktif otomatis pada kartu pesanan yang telah selesai (`currentStep === 4`), terintegrasi dengan pengecekan status pesanan.
  - `apps/web/src/components/storefront/LookbookSection.tsx`: Menampilkan galeri foto ulasan pembeli nyata dari database via `GET /api/v1/reviews/approved`.
- **Backend**:
  - `apps/api/src/routes/reviews.routes.ts`:
    - `POST /api/v1/reviews`: Validasi pesanan selesai (`COMPLETED` / `current_step >= 4`), guard anti-ulasan duplikat (1 invoice = 1 review), simpan ke tabel `reviews`, dan reward +25 Flower Points otomatis.
    - `POST /api/v1/reviews/upload-photo`: Endpoint Multer unggah foto bukti buket pembeli ke Supabase Storage.
    - `GET /api/v1/reviews/approved`: Endpoint publik kurasi ulasan untuk etalase storefront.
    - `GET /api/v1/reviews/order/:orderId`: Cek apakah pesanan telah diulas.
  - `apps/api/src/routes/index.ts`: Mendaftarkan route `/reviews`.
- **Verifikasi Kualitas**:
  - TypeScript Compilation: `turbo run type-check` 100% lolos (0 error).
  - Test Suite: `npm run test --workspace=@chenille/api` 125/125 passing (100%).

---

## 2. Prioritas 2: Otomasi Pengingat Momen Spesial WhatsApp H-7 (Cron Scheduler) [COMPLETED - VERIFIED PASS]
*Terkait: PRD Seksi 17 & 23 | Tabel: `customer_occasions`, `notification_configs`, `notification_logs` | Service: `whatsapp.service.ts`, `scheduler.service.ts`*

### Status: SELESAI & TERVERIFIKASI
- **Backend**:
  - `apps/api/src/services/whatsapp.service.ts`:
    - Event `OCCASION_REMINDER` ditambahkan ke `NotificationEventType` dan `NotificationConfig`.
    - Template WhatsApp hangat personal dengan perhitungan hari tersisa (`daysRemaining`), tanggal ramah, dan tautan katalog atelier.
    - Fallback otomatis ke mode simulasi aman di `notification_logs` jika Fonnte API Key belum diisi.
  - `apps/api/src/services/scheduler.service.ts`:
    - Service background scheduler berkala (interval teratur setiap 6 jam) dan pemindaian startup.
    - Fungsi kanonikal `scanAndDispatchOccasionReminders(daysAhead: number = 7)` dengan pembaruan otomatis kolom `is_reminded` dan `reminded_at`.
  - `apps/api/src/routes/occasions.routes.ts`:
    - `POST /api/v1/occasions/scan-reminders`: Endpoint pemindaian momen rentang H-0 s/d H-`days_ahead` (default 7 hari).
    - `POST /api/v1/occasions/:id/send-reminder-now`: Endpoint on-demand kirim notifikasi WhatsApp seketika untuk 1 momen tertentu.
  - `apps/api/src/routes/admin.routes.ts`:
    - Dukungan konfigurasi `event_occasion_reminder` di settings notifications (`PATCH` & `GET /settings/all`).
    - `POST /api/v1/admin/settings/notifications/scan-occasions`: Endpoint pemicu pemindaian manual dari dashboard admin.
  - `apps/api/src/server.ts`:
    - Inisialisasi `initScheduler()` otomatis saat server aktif.
- **Frontend**:
  - `apps/web/src/stores/useSettingsStore.ts`:
    - Menambahkan `occasionReminder: boolean` pada interface dan state default `NotificationConfig.events`.
  - `apps/web/src/components/portal/OccasionCalendarWidget.tsx`:
    - Badge status pengingat WhatsApp: `✅ WA Terkirim` berserta tanggal pengiriman jika sudah diingatkan.
    - Tombol aksi interaktif on-demand: `🔔 Kirim WA Sekarang` untuk momen yang belum diingatkan.
  - `apps/web/src/components/admin/AdminViews.tsx`:
    - Kontrol event trigger `Occasion Reminder (H-7)` (total 8/8 event aktif).
    - Tombol aksi instan admin: `⚡ Scan Momen Hari Ini (H-7)` dengan feedback toast.
- **Verifikasi Kualitas**:
  - `apps/api/tests/integration/occasions.api.test.ts`: 7/7 test lolos (100%).
  - Total test suite `@chenille/api`: 21 test files, 132/132 tests lolos (100%).
  - TypeScript Compilation: `turbo run type-check` 0 error across all packages.

---

## 3. Prioritas 3: Pemotongan Bahan Baku Otomatis Resep BOM saat Perakitan Dimulai [COMPLETED - VERIFIED PASS]
*Terkait: PRD Seksi 29 & 31 | Tabel: `raw_materials`, `bill_of_materials`, `orders`, `order_items`*

### Implementasi Lengkap (Commit `feat(bom)`):
- **Database Schema**:
  - Menambahkan kolom `orders.is_materials_deducted BOOLEAN DEFAULT false` sebagai *idempotency guard* untuk mencegah pemotongan ganda saat pembaruan status berulang.
- **Backend Service & Routing**:
  - `apps/api/src/services/bom.service.ts`:
    - `deductMaterialsForOrder(client, orderId)`: Menghitung kebutuhan bahan baku katalog via `bill_of_materials` dan item kustom studio via `custom_specs_json`, memotong stok fisik di `raw_materials` secara atomik (`GREATEST(0, stock - qty)`), mendeteksi *Low Stock Alert* (`stock <= min_stock`), dan menandai `is_materials_deducted = true`.
    - `restoreMaterialsForOrder(client, orderId)`: Mengembalikan seluruh stok bahan baku ke gudang jika pesanan dibatalkan (`CANCELLED`) dan mereset `is_materials_deducted = false`.
    - `getOrderMaterialsBreakdown(orderId)`: Endpoint inspeksi komposisi bahan dan ketersediaan stok fisik gudang.
  - `apps/api/src/routes/orders.routes.ts`:
    - Terintegrasi pada hook `PATCH /api/v1/orders/:id` saat pesanan memasuki `targetStep >= 2` (`CRAFTING_BOUQUET`).
    - Terintegrasi pada hook pembatalan `order_status === 'CANCELLED'`.
    - Menambahkan endpoint publik/admin `GET /api/v1/orders/:id/materials`.
- **Frontend Store & UI Feedback**:
  - `apps/web/src/stores/useSettingsStore.ts`: Menambahkan aksi `fetchRawMaterials()` untuk menyinkronkan status stok bahan baku real-time ke UI admin.
  - `apps/web/src/components/admin/OrdersTable.tsx`: Menampilkan toast feedback sukses pemotongan bahan baku BOM dan peringatan dini *Low Stock Alert* saat admin memajukan pesanan ke tahap perakitan.
  - `apps/web/src/components/admin/BOMCalculatorModal.tsx`: Memanggil `fetchRawMaterials()` saat modal terbuka untuk menampilkan angka stok fisik teranyar.
- **Verifikasi Kualitas**:
  - `apps/api/tests/integration/bom-deduction.api.test.ts`: 6/6 test lolos (100% pass) memvalidasi pemotongan bertahap, idempotensi, inspeksi endpoint, dan restorasi pembatalan.
  - Total test suite backend: 22 test files, 138/138 tests lolos (100%).
  - TypeScript Compilation: `turbo run type-check` 0 error across all packages.

---

## 4. Prioritas 4: Peningkatan Konversi Penjualan (Direct WA Ordering & Social Proof) [COMPLETED - VERIFIED PASS]
*Terkait: PRD Seksi 1 & 3 | Komponen: `ProductDetailModal.tsx`, `CartDrawer.tsx`, `ProductCard.tsx`, `whatsapp-order.ts`*

### Implementasi Lengkap (Commit `feat(storefront)`):
- **Shared WhatsApp Order Formatter (`packages/shared/src/utils/whatsapp-order.ts`)**:
  - `normalizeWhatsAppNumber`: Normalisasi nomor HP Indonesia (08... / +62...) ke format internasional `62...`.
  - `formatDirectProductWhatsAppUrl`: Memformat pesan pesanan buket tunggal lengkap dengan nama buket, seri kategori, harga satuan, total kuantitas, catatan kartu ucapan kustom, dan status kesiapan (Ready Stock vs Pre-Order).
  - `formatCartWhatsAppUrl`: Memformat rincian seluruh isi keranjang belanja, rincian subtotal, diskon kupon/poin, total pembayaran, serta metode pengambilan COD titik temu gratis ongkir.
- **Product Detail Modal (`apps/web/src/components/storefront/ProductDetailModal.tsx`)**:
  - Social proof banner dinamis: `"🔥 [N] orang sedang melihat buket ini hari ini"`.
  - Indikator kesiapan & urgensi: `"⚡ Ready Stock (Siap Kirim / COD)"` vs `"⏳ Pre-Order (~N Hari Kerja)"` serta badge peringatan stok menipis `"🚨 Sisa N buket siap rangkai!"` jika stok $\le$ 5.
  - Tombol CTA *"Pesan Langsung via WhatsApp"* yang membuka deep-link pemesanan langsung ke nomor atelier.
- **Product Card (`apps/web/src/components/storefront/ProductCard.tsx`)**:
  - Penambahan badge urgensi stok menipis `"🚨 Sisa N slot!"` jika `product.stock <= 5`.
  - Refinement indikator view counter dengan ikon mata kontras tinggi (`[N] dilihat`).
- **Cart Drawer (`apps/web/src/components/storefront/CartDrawer.tsx`)**:
  - Penambahan tombol alternatif *"Order Cepat via WhatsApp"* di Langkah 1 Keranjang yang memformat seluruh ringkasan keranjang belanja untuk dikirim ke WhatsApp florist.
- **Verifikasi Kualitas**:
  - Unit test `apps/api/tests/unit/whatsapp-order.test.ts`: 7/7 tests lolos (100% pass).
  - Total test suite backend: 23 test files, 145/145 tests lolos (100% pass).
  - TypeScript Compilation: `turbo run type-check` 0 error across all packages.

---

## 5. Prioritas 5: Optimasi Performa Mobile & Resiliensi Error Boundary
*Terkait: PRD Seksi 38 & 41 | Komponen: `apps/web/src/`*

### Spesifikasi Teknis Implementasi
1. **Migrasi `next/image`**:
   - Ganti elemen `<img>` pada etalase produk dengan komponen `Image` dari `next/image`.
   - Manfaatkan WebP/AVIF otomatis dan lazy-loading native untuk menghemat kuota mobile mahasiswa.
2. **Third-Party API Graceful Degradation**:
   - Bungkus komponen pemanggilan kurir Biteship dan Midtrans dengan fallback lokal (transfer bank BCA dan COD) jika koneksi API pihak ketiga mengalami *timeout*.
