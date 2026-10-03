# Roadmap Rekomendasi Pengembangan Lanjutan (.agents Knowledge)

> **Dokumen Panduan Pengembangan Lintas Perangkat**: Dokumen ini mencatat 5 pilar rekomendasi strategis dan teknis yang telah diverifikasi dan disiapkan agar developer atau agen pada perangkat/sesi lain dapat langsung melanjutkan pengerjaannya secara modular tanpa kehilangan konteks.

---

## 1. Prioritas 1: Form Ulasan Bintang & Foto Pembeli Pasca-Pesanan Selesai
*Terkait: PRD Seksi 12 (Ulasan Foto Pembeli & Rating Bintang) | Tabel: `product_reviews`, `reviews` | Storage: `lookbook-reviews`*

### Latar Belakang & Masalah
- Pelanggan yang telah menerima pesanan di Portal Pelanggan (`/portal` atau `/lacak-pesanan` pada `current_step === 4`) belum memiliki antarmuka interaktif untuk memberikan rating bintang 1-5, komentar teks, dan unggah foto buket asli.
- Akibatnya, tabel `product_reviews` di database belum terisi secara organik dari pembeli nyata.

### Spesifikasi Teknis Implementasi
1. **Frontend (`apps/web/src/components/portal/OrderReviewModal.tsx`)**:
   - Tampilkan tombol *"Beri Ulasan & Foto Buket 🌸"* pada kartu pesanan yang berstatus selesai (`COMPLETED`).
   - Modal input: Rating bintang 1-5, textarea ulasan jujur, dropzone unggah foto buket asli (maksimal 2MB, WebP/JPEG/PNG).
   - Simpan foto ke Supabase Storage bucket `lookbook-reviews` dan kirim payload ke endpoint API review.
2. **Backend (`apps/api/src/routes/products.routes.ts`)**:
   - `POST /api/v1/products/reviews`: Menerima `order_id`, `product_id`, `rating`, `comment`, `photo_url`, dan `customer_name`.
   - Validasi: Pastikan pesanan benar-benar berstatus `COMPLETED` dan belum pernah diulas oleh invoice yang sama (*single review per order*).
   - `GET /api/v1/products/reviews/approved`: Mengembalikan daftar ulasan yang telah diverifikasi untuk ditampilkan di `LookbookSection.tsx` dan etalase landing page.

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
