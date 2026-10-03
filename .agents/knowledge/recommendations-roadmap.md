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

## 2. Prioritas 2: Otomasi Pengingat Momen Spesial WhatsApp H-7 (Cron Scheduler)
*Terkait: PRD Seksi 17 & 23 | Tabel: `customer_occasions`, `notification_configs` | Service: `whatsapp.service.ts`*

### Latar Belakang & Masalah
- Pelanggan dapat mencatat kalender tanggal wisuda/sidang/ulang tahun teman di Portal (`customer_occasions`), dan API CRUD sudah aktif.
- Namun, belum ada *scheduler* atau *cron job* yang otomatis memindai momen H-7 dan memicu notifikasi WhatsApp via Fonnte Gateway.

### Spesifikasi Teknis Implementasi
1. **Backend Route (`apps/api/src/routes/occasions.routes.ts`)**:
   - Buat endpoint `POST /api/v1/occasions/scan-reminders` (dapat dilindungi oleh `x-cron-secret` atau admin token).
   - Query:
     ```sql
     SELECT id, user_phone, user_name, recipient_name, occasion_title, event_date
     FROM customer_occasions
     WHERE is_reminded = false 
       AND event_date::date = (CURRENT_DATE + INTERVAL '7 days');
     ```
   - Pemicu WhatsApp: Kirim template pesan ramah:
     > *"Halo Kak [user_name]! 🌸 Mengingatkan 7 hari lagi hari [occasion_title] untuk [recipient_name] nih. Mau kami amankan slot perakitan buket kawat bulunya lebih awal agar tenang dan tidak kehabisan kuota harian? Klik di sini untuk pesan: https://chenille-atelier.com"*
   - Update: Set `is_reminded = true` setelah pesan terkirim.

---

## 3. Prioritas 3: Pemotongan Bahan Baku Otomatis Resep BOM saat Perakitan Dimulai
*Terkait: PRD Seksi 29 & 31 | Tabel: `raw_materials`, `bill_of_materials`, `order_items`*

### Latar Belakang & Masalah
- Saat checkout, sistem hanya memotong stok produk jadi (`products.stock`).
- Stok bahan mentah (`raw_materials`: kawat bulu, batang kawat, cellophane, pita) belum terpotong otomatis, sehingga perhitungan sisa bahan baku gudang harus dicatat manual.

### Spesifikasi Teknis Implementasi
1. **Backend Event (`apps/api/src/routes/orders.routes.ts`)**:
   - Saat admin atau florist mengubah status pesanan ke **Langkah 2: Sedang Dirangkai (`CRAFTING_STARTED`)**:
   - Query seluruh item pesanan: ambil `product_id` dan `quantity`.
   - Untuk setiap produk, cari komposisi di `bill_of_materials` dan potong stok di `raw_materials`:
     ```sql
     UPDATE raw_materials rm
     SET stock = stock - (bom.qty_needed * $1)
     FROM bill_of_materials bom
     WHERE bom.material_id = rm.id AND bom.product_id = $2;
     ```
   - Cek jika `stock <= min_stock`, picu log *Low Stock Alert* di dashboard admin.

---

## 4. Prioritas 4: Peningkatan Konversi Penjualan (Direct WA Ordering & Social Proof)
*Terkait: PRD Seksi 1 & 3 | Komponen: `ProductDetailModal.tsx`, `CartDrawer.tsx`*

### Spesifikasi Teknis Implementasi
1. **Tombol "Tanya / Pesan Langsung via WhatsApp"**:
   - Tambahkan tombol di samping tombol *Tambah ke Keranjang* pada [ProductDetailModal.tsx](../../apps/web/src/components/storefront/ProductDetailModal.tsx).
   - Link membuka `https://wa.me/{waNumber}?text=...` dengan teks rapi berisi nama buket, harga, dan link gambar produk.
2. **Micro-Badge Social Proof Dinamis**:
   - Menampilkan indikator minat beli di bawah foto produk:
     - *"🔥 [N] orang melihat buket ini hari ini"* (membaca `products.view_count`).
     - *"⏳ Estimasi pengerjaan: [po_lead_days] hari kerja (Siap untuk wisuda weekend)"*.

---

## 5. Prioritas 5: Optimasi Performa Mobile & Resiliensi Error Boundary
*Terkait: PRD Seksi 38 & 41 | Komponen: `apps/web/src/`*

### Spesifikasi Teknis Implementasi
1. **Migrasi `next/image`**:
   - Ganti elemen `<img>` pada etalase produk dengan komponen `Image` dari `next/image`.
   - Manfaatkan WebP/AVIF otomatis dan lazy-loading native untuk menghemat kuota mobile mahasiswa.
2. **Third-Party API Graceful Degradation**:
   - Bungkus komponen pemanggilan kurir Biteship dan Midtrans dengan fallback lokal (transfer bank BCA dan COD) jika koneksi API pihak ketiga mengalami *timeout*.
