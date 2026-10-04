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

---

## 6. Bug: Validasi Titik Temu COD Tanpa Guard & Mock Kuota Harian Storefront
- **Gejala**:
  1. Pelanggan dapat mengonfirmasi pesanan COD saat titik temu COD di database kosong, menghasilkan order tanpa lokasi serah terima.
  2. `AnnouncementBar` dan `CapacityWidget` menampilkan angka kuota awal fiktif yang saling kontradiktif (12/20 vs 3/25) sebelum data API tiba.
- **Akar Masalah**:
  1. `handleConfirmOrder` di `CartDrawer.tsx` tidak memvalidasi `selectedMeetup?.id` saat metode pengiriman `COD_MEETUP_POINT`.
  2. `AnnouncementBar.tsx` dan `CapacityWidget.tsx` menginisialisasi state dengan hardcoded mock data alih-alih membaca `dailyQuota` dari `useSettingsStore`.
- **Solusi**:
---

## 7. Bug: Chat Action Chips Menutup Tiba-Tiba, Error 404 /lacak-pesanan & Multi-Turn History Desync pada AI Grounding
- **Gejala**:
  1. Di `LiveChatWidget`, mengklik tombol aksi cepat (seperti *"Lihat 6 Titik Temu COD"*, *"Buka Custom Studio"*) hanya menutup jendela obrolan tanpa memunculkan modal/tampilan yang dituju.
  2. Mengklik tombol aksi *"Cek Status Pesanan"* atau membuka link WhatsApp pelacakan memunculkan halaman HTTP 404 Not Found.
  3. Riwayat percakapan chat sebelumnya (multi-turn) tidak tersinkronisasi ke Gemini AI Copilot: AI mengabaikan konteks buket yang ditanyakan pada giliran sebelumnya atau mengulang sapaan pembuka ganda (*double greeting*).
  4. Status riwayat pesanan pelanggan gagal di-grounding akibat error SQL `column "step_name" does not exist`.
  5. Panggilan Gemini menghasilkan HTTP 400 Bad Request jika obrolan diawali pesan bot sambutan (karena `contents[0].role` bernilai `model`).
- **Akar Masalah**:
  1. `CODLocationsModal` hanya di-render lokal dan mendengarkan Custom DOM Event yang rentan unmounted timing; selain itu jendela chat menutupi layar tanpa navigasi responsif.
  2. Rute Next.js App Router `apps/web/src/app/lacak-pesanan/page.tsx` belum dibuat sehingga seluruh deep link pelacakan publik berujung ke 404.
  3. Komponen `GuestTracker` belum menerima prop `initialInvoice` untuk auto-lookup saat dibuka dari deep link URL.
  4. `retrieveGroundingContext` hanya memeriksa pesan tunggal terakhir alih-alih seluruh percakapan multi-turn.
  5. Query `order_status_histories` salah memanggil nama kolom `step_name` & `description` (nama kolom aktual adalah `status_title` & `status_desc`).
  6. Google Gemini API mewajibkan elemen pertama `contents[0]` memiliki `role: 'user'` dan bergantian secara ketat (`user` -> `model` -> `user`).
- **Solusi**:
  1. Pindahkan kontrol modal COD ke Zustand `useChatStore` (`isCodModalOpen`, `openCodModal`, `closeCodModal`) dan render `<CODLocationsModal />` secara universal di `app/layout.tsx`.
  2. Implementasikan halaman pelacakan publik resmi PRD Seksi 34 pada `apps/web/src/app/lacak-pesanan/page.tsx` dengan Hero Banner, Suspense boundary, dan integrasi `GuestTracker`.
  3. Perbarui `GuestTracker` untuk menerima prop `initialInvoice` dan memprioritaskan pengecekan live API Supabase PostgreSQL sebelum fallback ke local state.
  4. Arahkan aksi `TRACK_ORDER` di `ChatInteractiveWidgets.tsx` langsung ke `/lacak-pesanan?inv=${encodeURIComponent(inv)}`.
  5. Koreksi query SQL di `ai-chat-assistant.service.ts` ke `status_title` dan `status_desc`.
  6. Bangun struktur multi-turn native yang memisahkan pesan bot awal ke konteks prompt dan menjamin `contents[0].role === 'user'`, serta urutkan model cascade prioritas aktif (`gemini-3.5-flash-lite`, `gemini-3.6-flash`, `gemini-3.1-flash-lite`).
  7. Diverifikasi secara deterministik via Playwright browser automation (HTTP 200, bebas 404, order Annisa tampil) dan unit test Vitest (84 tests passed).



