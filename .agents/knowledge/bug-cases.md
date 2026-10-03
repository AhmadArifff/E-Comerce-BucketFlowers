# Knowledge: Known Bug Cases & Resolutions

Daftar kendala masa lalu dan solusi yang telah diverifikasi pada sistem E-Commerce Bucket Flowers Chenille Atelier:

---

## 1. Bug: Inconsistent types deduced for parameter $1 (PostgreSQL Enum)
- **Gejala**: Saat menjalankan `UPDATE procurement_orders SET status = $1 ... CASE WHEN $1 = 'ARRIVED'`, query gagal dengan pesan `inconsistent types deduced for parameter $1`.
- **Akar Masalah**: PostgreSQL tidak tahu apakah `$1` adalah enum `procurement_status` atau string biasa.
- **Solusi**: Berikan type casting eksplisit di parameterized query:
  ```sql
  SET status = $1::procurement_status,
      is_stock_added = $2,
      actual_arrival = CASE WHEN $1::text = 'ARRIVED' THEN NOW() ELSE actual_arrival END
  WHERE id = $3;
  ```

---

## 2. Bug: BOM Recipe & raw_cost_hpp Drift
- **Gejala**: Admin mengubah resep di modal BOM, namun harga HPP modal di dashboard pesanan tidak berubah.
- **Akar Masalah**: Modal hanya mengupdate state in-memory tanpa mengirim panggilan transaksional ke database.
- **Solusi**: Buat endpoint `PUT /api/v1/products/:id/bom` yang secara transaksional menyimpan baris ke `bill_of_materials` dan secara otomatis memperbarui `products.raw_cost_hpp = totalHpp`.

---

## 3. Bug: CSV Mojibake di Microsoft Excel
- **Gejala**: File CSV yang diunduh dari browser menampilkan karakter rusak saat dibuka di Excel Windows.
- **Akar Masalah**: Excel berasumsi file CSV tanpa tanda byte pengenal menggunakan encoding ANSI lokal.
- **Solusi**: Tambahkan byte UTF-8 BOM (`\uFEFF`) di awal blob CSV:
  ```ts
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  ```

---

## 4. Bug: Gagal Checkout Buket Custom Studio & Kebocoran Pesanan saat Maintenance Mode
- **Gejala**:
  1. Pelanggan mendesain buket kustom di studio, namun saat checkout gagal dengan error `Produk dengan ID custom-... tidak tersedia`.
  2. Saat toko diatur ke mode istirahat produksi (`is_maintenance_mode = true`), pesanan langsung via API masih bisa masuk ke database.
- **Akar Masalah**:
  1. `orders.routes.ts` mewajibkan seluruh item berasal dari tabel `products`, padahal buket kustom bersifat dinamis dan hanya ada di sesi pengguna.
  2. `POST /api/v1/orders` tidak membaca `is_maintenance_mode` dari `store_settings`.
- **Solusi**:
  1. Di `CartDrawer.tsx`, sertakan metadata produk kustom (`product_name`, `price`, `raw_cost_hpp`, `custom_specs_json`) dan kirim `product_id: null`.
  2. Di backend `orders.routes.ts`, pisahkan perlakuan buket kustom: bypass pencarian di tabel `products` dan simpan langsung ke `order_items` dengan `product_id: null` serta `custom_specs_json` terisi.
  3. Di `orders.routes.ts`, periksa `is_maintenance_mode` di awal transaksi dan tolak pesanan dengan status `403` jika studio sedang libur.

---

## 5. Bug: Diskoneksi Data Pengaturan Toko ke Storefront & Copywriting AI Slop
- **Gejala**:
  1. Perubahan alamat studio, nama toko, WhatsApp, dan kuota PO harian di menu Pengaturan Toko Admin tidak terefleksi di Footer dan Navbar landing page.
  2. CartDrawer memaksakan titik COD dummy saat admin mengosongkan/menonaktifkan titik temu COD di database.
  3. Kategori filter di landing page statis hardcoded sehingga produk berkategori baru tidak dapat difilter.
  4. Teks copywriting pada tema A, B, C terasa kaku, dingin, penuh klise AI slop, dan minim empati mahasiswa kampus Depok.
- **Akar Masalah**:
  1. `Footer.tsx` mengimpor objek statis `ATELIER_CONFIG` alih-alih `useSettingsStore`.
  2. `Navbar.tsx` tidak membaca `storeName` dari pengaturan toko.
  3. `CartDrawer.tsx` mengeksekusi fallback dummy saat data array COD kosong dari API.
  4. `CategoryFilter.tsx` mengunci 6 kategori statis tanpa membaca kategori unik produk database.
  5. `theme-copy.ts` berisi teks template bot dengan kata-kata abstrak tanpa realitas lapangan.
- **Solusi**:
  1. Hubungkan `Footer.tsx` dan `Navbar.tsx` ke `useSettingsStore` dengan fallback cerdas.
  2. Tambahkan `isCodLoaded` pada `CartDrawer.tsx` agar menghormati kondisi array kosong dari database.
  3. Berikan prop `availableCategories` pada `CategoryFilter.tsx` yang mengekstrak seluruh kategori unik produk.
  4. Perbarui `THEME_COPY_MATRIX` di `theme-copy.ts` dengan menyuntikkan kehangatan, empati nyata, humor mahasiswa pejuang skripsi/wisuda Depok (UI, Gunadarma, PNJ), dan 100% bebas tanda em dash (R-02).


