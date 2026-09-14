# 🌸 Buku Panduan Pengujian Manual End-to-End (E2E Manual Testing Guide)
## Chenille Flowers Atelier — Platform E-Commerce Buket Bunga Kawat Bulu

> **Versi Dokumen:** v4.0 (Complete PRD-Aligned Specification — 48 Test Scenarios: Customer, Admin, Business Rules, & Motion QA)  
> **Target Pengguna:** Tim QA, Software Engineer, UI/UX Designer, Super Admin, dan Florist Staff  
> **Lingkup Pengujian:** 100% Seluruh Fitur PRD.md (Storefront, Custom Studio, Portal, Akun Member, Operasional Admin, Sakelar Fitur, Gateway & Logistik, BOM, Geofencing Maps, Alur Bisnis, Animasi Pro Max, & Keamanan Sistem).

---

## 📑 Daftar Isi
1. [Prasyarat & Persiapan Lingkungan Uji](#1-prasyarat--persiapan-lingkungan-uji)
2. [Matriks Akun & Kredensial Uji Coba](#2-matriks-akun--kredensial-uji-coba)
3. [BAGIAN 1: Skenario Pengujian Sisi Pelanggan (Customer / Storefront)](#3-bagian-1-skenario-pengujian-sisi-pelanggan-customer--storefront)
   - [TC-CUS-01: Navigasi Storefront & Perpindahan Tema (A, B, C)](#tc-cus-01-navigasi-storefront--perpindahan-tema-a-b-c)
   - [TC-CUS-02: Pencarian, Filter Kategori, & Urutan Harga](#tc-cus-02-pencarian-filter-kategori--urutan-harga)
   - [TC-CUS-03: Modal Detail Produk & Kustomisasi Pesan Kartu Ucapan](#tc-cus-03-modal-detail-produk--kustomisasi-pesan-kartu-ucapan)
   - [TC-CUS-04: Checkout Tamu (Guest) & Pengiriman Ekspedisi Regular](#tc-cus-04-checkout-tamu-guest--pengiriman-ekspedisi-regular)
   - [TC-CUS-05: Checkout Member, Kupon Diskon, & Poin Loyalitas](#tc-cus-05-checkout-member-kupon-diskon--poin-loyalitas)
   - [TC-CUS-06: Checkout COD Titik Temu (Geofencing Radius 5 KM)](#tc-cus-06-checkout-cod-titik-temu-geofencing-radius-5-km)
   - [TC-CUS-07: Pelacakan Pesanan Tamu (Phone Number Tracking)](#tc-cus-07-pelacakan-pesanan-tamu-phone-number-tracking)
   - [TC-CUS-08: Member Dashboard Portal & Unduh Invoice](#tc-cus-08-member-dashboard-portal--unduh-invoice)
   - [TC-CUS-09: Pengajuan Klaim Garansi Bunga (4-Step Stepper)](#tc-cus-09-pengajuan-klaim-garansi-bunga-4-step-stepper)
   - [TC-CUS-10: Live WebChat & WhatsApp Customer Care Hub](#tc-cus-10-live-webchat--whatsapp-customer-care-hub)
   - [TC-CUS-11: Sesi Login Member & Proteksi Auto-Logout 15 Menit](#tc-cus-11-sesi-login-member--proteksi-auto-logout-15-menit)
   - [TC-CUS-12: Custom Studio Interaktif (Rangkai Buket Sendiri — 4-Step Builder)](#tc-cus-12-custom-studio-interaktif-rangkai-buket-sendiri--4-step-builder)
   - [TC-CUS-13: Customer Profile & Account Management Suite (Edit Profil, Ganti Sandi, Emoji Avatar)](#tc-cus-13-customer-profile--account-management-suite-edit-profil-ganti-sandi-emoji-avatar)
   - [TC-CUS-14: Modul Lookbook Wisuda & Pusat Bantuan FAQ (Accordion Perawatan Kawat Bulu)](#tc-cus-14-modul-lookbook-wisuda--pusat-bantuan-faq-accordion-perawatan-kawat-bulu)
4. [BAGIAN 2: Skenario Pengujian Sisi Admin & Staf (Admin Dashboard)](#4-bagian-2-skenario-pengujian-sisi-admin--staf-admin-dashboard)
   - [TC-ADM-01: Akses Login & Validasi Role (RBAC)](#tc-adm-01-akses-login--validasi-role-rbac)
   - [TC-ADM-02: Navigasi Sidebar Desktop & Drawer Mobile Backdrop](#tc-adm-02-navigasi-sidebar-desktop--drawer-mobile-backdrop)
   - [TC-ADM-03: Ringkasan Metrik Dashboard (KPI Cards & Kalender Produksi)](#tc-adm-03-ringkasan-metrik-dashboard-kpi-cards--kalender-produksi)
   - [TC-ADM-04: Manajemen Pesanan & Stepper 7 Status Rangkaian](#tc-adm-04-manajemen-pesanan--stepper-7-status-rangkaian)
   - [TC-ADM-05: Cetak Thermal Label Pengiriman & Unduh Invoice](#tc-adm-05-cetak-thermal-label-pengiriman--unduh-invoice)
   - [TC-ADM-06: Kalkulator BOM (Bill of Materials) & Margin Profit](#tc-adm-06-kalkulator-bom-bill-of-materials--margin-profit)
   - [TC-ADM-07: Pengaturan Titik Temu COD & Radius Geofencing 5 KM](#tc-adm-07-pengaturan-titik-temu-cod--radius-geofencing-5-km)
   - [TC-ADM-08: Pengawasan Pengguna Real-Time (Live Auto-Sync 3s)](#tc-adm-08-pengawasan-pengguna-real-time-live-auto-sync-3s)
   - [TC-ADM-09: Aksi Keamanan "Tendang Sesi" & "Blokir Akses" Akun](#tc-adm-09-aksi-keamanan-tendang-sesi--blokir-akses-akun)
   - [TC-ADM-10: Ekspor CSV Audit Trail Log Aktivitas Sesi](#tc-adm-10-ekspor-csv-audit-trail-log-aktivitas-sesi)
   - [TC-ADM-11: Pengaturan Lokasi Atelier: Cardless Geocoder (📍 Red Pin & Reverse Address)](#tc-adm-11-pengaturan-lokasi-atelier-cardless-geocoder--red-pin--reverse-address)
   - [TC-ADM-12: Saklar Maintenance & Penggantian Tema Toko](#tc-adm-12-saklar-maintenance--penggantian-tema-toko)
   - [TC-ADM-13: Pusat 10 Sakelar Fitur Bisnis (Operational Feature Toggles)](#tc-adm-13-pusat-10-sakelar-fitur-bisnis-operational-feature-toggles)
   - [TC-ADM-14: Manajemen Kredensial Payment Gateway & Jasa Kirim (Midtrans, Biteship, WhatsApp)](#tc-adm-14-manajemen-kredensial-payment-gateway--jasa-kirim-midtrans-biteship-whatsapp)
   - [TC-ADM-15: Tambah Produk Baru & Upload Gambar ke Supabase Storage](#tc-adm-15-tambah-produk-baru--upload-gambar-ke-supabase-storage)
   - [TC-ADM-16: Google Maps Deep URL Parser & Peta Draggable Pin COD (CODMapModal.tsx)](#tc-adm-16-google-maps-deep-url-parser--peta-draggable-pin-cod-codmapmodaltsx)
   - [TC-ADM-17: Persistensi Navigasi Menu Admin (Anti-Reset on Browser Refresh / F5)](#tc-adm-17-persistensi-navigasi-menu-admin-anti-reset-on-browser-refresh--f5)
   - [TC-ADM-18: Laporan Finansial & Ekspor Data Transaksi Spreadsheet (CSV UTF-8 BOM)](#tc-adm-18-laporan-finansial--ekspor-data-transaksi-spreadsheet-csv-utf-8-bom)
5. [BAGIAN 3: Matriks Validasi Aturan & Alur Bisnis (Core Business Flow & Rules Matrix)](#5-bagian-3-matriks-validasi-aturan--alur-bisnis-core-business-flow--rules-matrix)
   - [BF-01: Throttling Kuota PO Harian (Maksimal 25 Buket / Hari)](#bf-01-throttling-kuota-po-harian-maksimal-25-buket--hari)
   - [BF-02: Siklus Pembayaran & Pemotongan Stok Atomik](#bf-02-siklus-pembayaran--pemotongan-stok-atomik)
   - [BF-03: Formula Diskon Kupon vs Poin Loyalitas Member (1 Poin = Rp 1)](#bf-03-formula-diskon-kupon-vs-poin-loyalitas-member-1-poin--rp-1)
   - [BF-04: Geofencing Radius COD Titik Temu (Batas 5.0 KM dari Pusat Depok)](#bf-04-geofencing-radius-cod-titik-temu-batas-50-km-dari-pusat-depok)
   - [BF-05: Jendela Waktu & Logika Klaim Garansi Bunga (24 Jam Pasca Selesai)](#bf-05-jendela-waktu--logika-klaim-garansi-bunga-24-jam-pasca-selesai)
   - [BF-06: Proteksi Inaktivitas 15 Menit & Kebijakan Revokasi Sesi](#bf-06-proteksi-inaktivitas-15-menit--kebijakan-revokasi-sesi)
   - [BF-07: Notifikasi Otomatis WhatsApp Gateway (Fonnte) pada Perubahan Status](#bf-07-notifikasi-otomatis-whatsapp-gateway-fonnte-pada-perubahan-status)
   - [BF-08: Verifikasi Pertahanan Keamanan Berlapis (Defense-in-Depth Framework)](#bf-08-verifikasi-pertahanan-keamanan-berlapis-defense-in-depth-framework)
   - [BF-09: Verifikasi Tata Kelola Kebersihan Repositori (Zero-Residual Scratch)](#bf-09-verifikasi-tata-kelola-kebersihan-repositori-zero-residual-scratch)
6. [BAGIAN 4: Standar Pengujian Animasi & Gerakan Interaktif (UI/UX Pro Max Motion Standards)](#6-bagian-4-standar-pengujian-animasi--gerakan-interaktif-uiux-pro-max-motion-standards)
7. [Lembar Rekapitulasi Sign-Off Pengujian](#7-lembar-rekapitulasi-sign-off-pengujian)

---

## 1. Prasyarat & Persiapan Lingkungan Uji

Sebelum memulai pengujian, pastikan aplikasi berjalan normal pada terminal lokal:

```bash
# 1. Jalankan development server Next.js & Express API
npm run dev

# 2. Pastikan kedua service telah aktif:
# Frontend Web App : http://localhost:3000
# Backend API Rest : http://localhost:4000/api/v1
```

> **Tips Browser Testing:**  
> Untuk menguji interaksi multi-pengguna (misal: Admin menendang sesi Member secara real-time), gunakan dua jendela peramban berbeda:
> - **Jendela 1 (Normal):** Buka `http://localhost:3000/admin` (sebagai Super Admin).
> - **Jendela 2 (Incognito / Mode Penyamaran):** Buka `http://localhost:3000/login` (sebagai Customer Member).

---

## 2. Matriks Akun & Kredensial Uji Coba

Gunakan akun terdaftar berikut pada halaman `/login` (tersedia tombol cepat *One-Click Demo Account*):

| Role | Nama Akun | Email Login | Password Demo | Hak Akses Utama |
| :--- | :--- | :--- | :--- | :--- |
| **SUPER ADMIN** | Ahmad Arif (Owner) | `ahmad@chenilleatelier.com` | `password123` | Akses penuh seluruh tab admin, keamanan, dan pengaturan toko. |
| **STAFF FLORIST** | Dewi Sartika | `florist.dewi@chenilleatelier.com` | `password123` | Akses pesanan, stepper produksi, stok bahan baku (BOM), dan chat. |
| **MEMBER** | Annisa Larasati | `nisa.mahasiswi@gmail.com` | `password123` | Akses belanja, diskon kupon, poin bunga, dan dashboard `/portal`. |
| **GUEST (TAMU)** | Pelanggan Umum | *(Tanpa Login)* | *(Tanpa Login)* | Checkout langsung, pelacakan via no handphone. |

---

## 3. BAGIAN 1: Skenario Pengujian Sisi Pelanggan (Customer / Storefront)

---

### TC-CUS-01: Navigasi Storefront & Perpindahan Tema (A, B, C)
* **Tujuan:** Memverifikasi tampilan antarmuka storefront berjalan responsif dan mendukung 3 DNA tema visual.
* **Langkah Pengujian:**
  1. Buka browser dan arahkan ke `http://localhost:3000/`.
  2. Periksa elemen Navbar: Logo Chenille Atelier, Navigasi Menu, Tombol Cari, Keranjang Belanja, dan Tombol Masuk.
  3. Buka halaman admin di tab lain, ganti tema aktif menjadi **Tema B (Modern Romantic)** lalu **Tema C (Playful Artisanal)**.
  4. Refresh storefront di `http://localhost:3000/`.
* **Ekspektasi Hasil:**
  - [ ] Navbar dan hero section tampil estetik tanpa elemen yang terpotong (*responsive layout*).
  - [ ] Tema A menampilkan palet warna *neutral stone & gold* dengan tipografi Playfair/Plus Jakarta.
  - [ ] Tema B menampilkan nuansa *soft rose & blush pink* romantis.
  - [ ] Tema C menampilkan nuansa ceria *sage green & warm terracotta*.
  - [ ] Sticky navbar tetap berada di atas saat halaman di-scroll ke bawah.

---

### TC-CUS-02: Pencarian, Filter Kategori, & Urutan Harga
* **Tujuan:** Memverifikasi keakuratan pencarian produk dan filtering katalog.
* **Langkah Pengujian:**
  1. Pada kolom pencarian katalog, ketik kata kunci: `"Mawar"`.
  2. Periksa produk yang tampil di grid.
  3. Klik pil filter kategori: `"Wisuda / Graduation"`, `"Romantis"`, dan `"Ulang Tahun"`.
  4. Ubah dropdown urutan (*Sort By*) menjadi: `"Harga Terendah"` lalu `"Harga Tertinggi"`.
  5. Aktifkan toggle switch: `"Ready Stock Saja"`.
* **Ekspektasi Hasil:**
  - [ ] Katalog seketika memfilter produk sesuai kata kunci tanpa reload halaman.
  - [ ] Produk terurut akurat dari nominal termurah hingga termahal.
  - [ ] Hanya produk dengan status `ready_stock: true` yang muncul saat toggle aktif.
  - [ ] Muncul pesan *"Produk tidak ditemukan"* yang ramah jika pencarian kosong.

---

### TC-CUS-03: Modal Detail Produk & Kustomisasi Pesan Kartu Ucapan
* **Tujuan:** Memastikan modal detail produk memuat informasi bahan, kawat bulu, dan kartu ucapan kustom.
* **Langkah Pengujian:**
  1. Klik salah satu kartu produk buket bunga (contoh: *Buket Mawar Merah Velvet*).
  2. Periksa modal pop-up: Galeri foto produk, harga, badge kawat bulu premium, dimensi tinggi buket.
  3. Ubah jumlah kuantitas (*Qty*) menjadi 2.
  4. Pada kolom **"Kartu Ucapan Kustom (Free)"**, ketik pesan:  
     `"Selamat wisuda Annisa tersayang! Sukses selalu ya - dari Budi"`.
  5. Klik tombol **"Tambah ke Keranjang"** atau **"Beli Sekarang"**.
* **Ekspektasi Hasil:**
  - [ ] Modal terbuka mulus dengan animasi fade-in yang halus (*glassmorphism*).
  - [ ] Counter kuantitas bertambah dan total subtotal harga otomatis terhitung.
  - [ ] Pesan kartu ucapan tersimpan ke dalam state keranjang belanja.
  - [ ] Muncul notifikasi toast sukses: *"Berhasil ditambahkan ke keranjang"*.

---

### TC-CUS-04: Checkout Tamu (Guest) & Pengiriman Ekspedisi Regular
* **Tujuan:** Menguji alur pemesanan langsung tanpa registrasi akun menggunakan ekspedisi Biteship.
* **Langkah Pengujian:**
  1. Buka Drawer Keranjang belanja, klik **"Lanjut ke Pembayaran"**.
  2. Pilih opsi: **"Lanjut sebagai Tamu (Tanpa Akun)"**.
  3. Masukkan data pengiriman:
     - Nama: `Fajar Nugraha`
     - No. WhatsApp: `081298765432`
     - Alamat Lengkap: `Jl. Margonda Raya No. 120, Beji, Kota Depok, Jawa Barat 16424`
  4. Pada metode pengiriman, pilih **"Ekspedisi Regular (JNE / SiCepat / J&T)"**.
  5. Pilih metode pembayaran: **"Midtrans Snap / QRIS / Transfer Bank"**.
  6. Klik tombol **"Selesaikan Pemesanan"**.
* **Ekspektasi Hasil:**
  - [ ] Ongkos kirim otomatis terhitung dan ditambahkan ke total akhir pembayaran.
  - [ ] Popup pembayaran Midtrans Snap terbuka menampilkan opsi QRIS/Virtual Account.
  - [ ] Setelah pembayaran sukses/disimulasikan, pelanggan dialihkan ke halaman invoice sukses dengan nomor PO unik (contoh: `ORD-2026-XXXX`).
  - [ ] Tampil nomor pelacakan pesanan yang dapat dicek kapan saja menggunakan nomor WhatsApp.

---

### TC-CUS-05: Checkout Member, Kupon Diskon, & Poin Loyalitas
* **Tujuan:** Menguji pemotongan harga otomatis untuk member terdaftar (Kupon + Flower Points).
* **Langkah Pengujian:**
  1. Login sebagai member: `nisa.mahasiswi@gmail.com`.
  2. Tambahkan produk ke keranjang dan buka halaman Checkout.
  3. Periksa saldo poin member (contoh: *15.000 Poin Bunga*).
  4. Aktifkan checkbox: **"Tukarkan Poin Loyalitas"** (diskon Rp 15.000).
  5. Pada kolom kupon diskon, ketik kode: `DISC10` atau `CHENILLE50K` lalu klik **"Terapkan"**.
  6. Periksa kalkulasi ringkasan pembayaran.
  7. Klik **"Bayar Sekarang"**.
* **Ekspektasi Hasil:**
  - [ ] Diskon kupon valid memotong total belanja sesuai persentase/nominal.
  - [ ] Poin loyalitas terpotong dan menghasilkan diskon setara pada invoice.
  - [ ] Sistem mencegah pemakaian kode kupon fiktif/kedaluwarsa dengan pesan error yang jelas.
  - [ ] Pesanan berhasil masuk ke database dan tercatat di dashboard akun member.

---

### TC-CUS-06: Checkout COD Titik Temu (Geofencing Radius 5 KM)
* **Tujuan:** Memverifikasi pembatasan titik temu Cash On Delivery (COD) dalam radius 5 KM dari pusat atelier Depok.
* **Langkah Pengujian:**
  1. Masukkan produk ke keranjang, lanjut ke checkout.
  2. Pada pilihan metode pengiriman, klik tab: **"COD Titik Temu (Gratis Ongkir)"**.
  3. Periksa daftar titik temu yang tersedia (contoh: *Stasiun UI Depok*, *Margo City Mall*, *Kober UI*).
  4. Pilih salah satu titik temu yang berjarak `< 5.0 KM` (berlabel hijau `Aktif & Dalam Radius 5 KM`).
  5. Masukkan tanggal dan estimasi jam temu (contoh: *Besok, Pukul 15:00 WIB*).
  6. Selesaikan pemesanan dengan metode COD.
* **Ekspektasi Hasil:**
  - [ ] Ongkos kirim menjadi Rp 0 (Gratis Ongkir Khusus COD Area Depok).
  - [ ] Titik COD di luar radius 5 KM (jika ada) dinonaktifkan atau ditandai merah (*Di luar jangkauan*).
  - [ ] Catatan jam & titik temu tercantum jelas pada nota pesanan dan notifikasi WhatsApp.

---

### TC-CUS-07: Pelacakan Pesanan Tamu (Phone Number Tracking)
* **Tujuan:** Memastikan pelanggan tamu dapat melacak pesanan hanya dengan memasukkan nomor WhatsApp.
* **Langkah Pengujian:**
  1. Pada navbar toko, klik menu: **"Lacak Pesanan"** (atau buka `http://localhost:3000/portal`).
  2. Pilih tab **"Lacak Cepat (Tamu)"**.
  3. Masukkan nomor handphone yang digunakan saat checkout: `081298765432`.
  4. Klik tombol **"Lacak Pesanan Saya"**.
* **Ekspektasi Hasil:**
  - [ ] Sistem menampilkan riwayat pesanan yang cocok dengan nomor HP tersebut.
  - [ ] Stepper status pesanan tampil interaktif (Pending ➔ Pembayaran Diterima ➔ Sedang Dirangkai ➔ Siap Dikirim ➔ Selesai).
  - [ ] Tampil tombol **"Lihat Invoice"** dan tombol **"Hubungi CS WhatsApp"**.

---

### TC-CUS-08: Member Dashboard Portal & Unduh Invoice
* **Tujuan:** Menguji fungsi portal pelanggan untuk member terdaftar.
* **Langkah Pengujian:**
  1. Login sebagai `nisa.mahasiswi@gmail.com`.
  2. Buka menu akun atau akses langsung: `http://localhost:3000/portal`.
  3. Periksa kartu profil member: Nama, badge tingkat member, sisa Poin Bunga, dan kupon tersimpan.
  4. Periksa tabel tab **"Riwayat Pesanan Saya"**.
  5. Klik tombol **"Unduh Invoice PDF"** pada salah satu pesanan selesai.
* **Ekspektasi Hasil:**
  - [ ] Seluruh riwayat transaksi member muncul lengkap dengan tanggal dan total bayar.
  - [ ] Invoice terbuka dalam format cetak bersih (*printable view*) lengkap dengan rincian produk, nomor resi/titik COD, dan stempel lunas.

---

### TC-CUS-09: Pengajuan Klaim Garansi Bunga (4-Step Stepper)
* **Tujuan:** Memverifikasi alur klaim garansi anti-rusak/layu buket kawat bulu.
* **Langkah Pengujian:**
  1. Di portal pesanan member (`/portal`), cari pesanan yang berstatus selesai.
  2. Klik tombol **"Ajukan Klaim Garansi"**.
  3. Periksa tampilan modal 4-step stepper garansi:
     - **Langkah 1:** Input nomor pesanan & alasan kerusakan (contoh: *Bunga patah saat ekspedisi*).
     - **Langkah 2:** Unggah foto bukti kerusakan.
     - **Langkah 3:** Pilih solusi penggantian: *Rangkai Ulang Baru* atau *Refund Dana*.
     - **Langkah 4:** Konfirmasi & pengajuan tiket garansi.
  4. Klik **"Kirim Klaim Garansi"**.
* **Ekspektasi Hasil:**
  - [ ] Modal interaktif memandu pelanggan langkah demi langkah tanpa membingungkan.
  - [ ] Tiket klaim garansi terbentuk dengan nomor tiket unik (contoh: `WRN-2026-XXXX`).
  - [ ] Status tiket langsung terhubung dan muncul di tabel garansi admin.

---

### TC-CUS-10: Live WebChat & WhatsApp Customer Care Hub
* **Tujuan:** Menguji kanal komunikasi real-time antara pelanggan dan tim florist.
* **Langkah Pengujian:**
  1. Di pojok kanan bawah storefront, klik tombol floating ikon chat merah muda 💬.
  2. Periksa modal pop-up: Tab **"Live WebChat"** dan tab **"WhatsApp CS"**.
  3. Pada Live WebChat, ketik pesan: `"Halo kak, apakah buket tulip pink bisa selesai hari ini?"` lalu tekan Enter.
  4. Pada tab WhatsApp CS, klik salah satu template pesan cepat: `"Tanya Ketersediaan Ready Stock"`.
* **Ekspektasi Hasil:**
  - [ ] Pesan di Live WebChat seketika muncul di riwayat obrolan dengan timestamp rapi.
  - [ ] Tab WhatsApp CS membuka tautan `https://wa.me/628...` lengkap dengan pesan pre-filled siap kirim.

---

### TC-CUS-11: Sesi Login Member & Proteksi Auto-Logout 15 Menit
* **Tujuan:** Memverifikasi sistem proteksi keamanan inaktivitas 15 menit (*Inactivity Timeout Guard*).
* **Langkah Pengujian:**
  1. Login sebagai member: `nisa.mahasiswi@gmail.com`.
  2. Diamkan browser tanpa menggerakkan mouse atau mengetik keyboard selama masa timeout (atau simulasi nilai timeout).
  3. Periksa peringatan modal timeout.
  4. Klik tombol **"Lanjutkan Sesi"** untuk memperpanjang, atau biarkan hingga sesi habis.
* **Ekspektasi Hasil:**
  - [ ] Sistem menampilkan modal hitung mundur: *"Sesi Anda akan berakhir dalam 60 detik karena tidak ada aktivitas"*.
  - [ ] Jika diklik "Lanjutkan Sesi", sesi diperpanjang dan timer di-reset ke 15 menit.
  - [ ] Jika diabaikan, sesi seketika dihapus (*force logout*) dan pengguna dialihkan ke `/login?reason=timeout`.

---

### TC-CUS-12: Custom Studio Interaktif (Rangkai Buket Sendiri — 4-Step Builder)
* **Tujuan:** Memverifikasi modul Custom Studio (#custom) untuk merangkai buket bunga kawat bulu secara mandiri dengan kalkulasi subtotal dan pratinjau live.
* **Langkah Pengujian:**
  1. Pada navbar toko, klik menu **"Custom Studio ✨"** (atau scroll ke section `#custom`).
  2. **Step 1 (Bunga Utama):** Pilih salah satu varian bunga (contoh: *Tulip Pastel 🌷*).
  3. **Step 2 (Warna Kawat Bulu):** Pilih swatch warna kawat bulu (contoh: *Lavender Lilac*).
  4. **Step 3 (Kertas Wrapping):** Pilih jenis kertas cellophane (contoh: *Korean Two-Tone Lilac*).
  5. **Step 4 (Aksesori Tambahan):** Centang aksesori upselling:
     - Lampu Fairy LED (+Rp 10.000)
     - Boneka Toga Wisuda (+Rp 15.000)
     - Kartu Ucapan Kustom (+Rp 5.000)
  6. Periksa **Live Canvas Preview** dan rincian subtotal harga yang terhitung seketika.
  7. Klik tombol **"Tambah ke Keranjang"** dan coba tombol **"Pesan via WhatsApp Langsung"**.
* **Ekspektasi Hasil:**
  - [ ] Setiap pilihan varian memperbarui visual canvas emoji dan ringkasan teks buket secara instan (*reactive update*).
  - [ ] Subtotal harga bertambah presisi sesuai harga dasar bunga + komponen aksesori tambahan.
  - [ ] Buket kustom tersimpan ke keranjang belanja dengan atribut lengkap (bunga, warna, kertas, aksesori).
  - [ ] Tombol WhatsApp mengarahkan ke tautan wa.me dengan pesan pesanan kustom yang telah terformat rapi.

---

### TC-CUS-13: Customer Profile & Account Management Suite (Edit Profil, Ganti Sandi, Emoji Avatar)
* **Tujuan:** Menguji pengelolaan akun mandiri member melalui dropdown navbar dan modal profil terpadu.
* **Langkah Pengujian:**
  1. Login sebagai member: `nisa.mahasiswi@gmail.com`.
  2. Klik pil profil member di sudut kanan atas navbar.
  3. Periksa dropdown: Nama member, email, saldo Flower Points, tombol **"Edit Profil"**, tombol **"Ganti Kata Sandi"**, dan tombol **"Keluar"**.
  4. Klik **"Edit Profil"**: Ubah nomor WhatsApp menjadi `081211223344`, ubah alamat pengiriman utama, dan pilih emoji avatar baru: `🧸` (Boneka Teddy).
  5. Klik **"Simpan Perubahan"**.
  6. Buka kembali dropdown profil, klik **"Ganti Kata Sandi"**:
     - Masukkan kata sandi lama: `password123`.
     - Masukkan kata sandi baru: `RahasiaBaru2026!`.
     - Masukkan konfirmasi kata sandi baru: `RahasiaBaru2026!`.
  7. Klik **"Simpan Kata Sandi Baru"**.
* **Ekspektasi Hasil:**
  - [ ] Avatar emoji navbar seketika berubah menjadi `🧸` tanpa perlu reload halaman.
  - [ ] Data profil terbarui di database Supabase dan tercermin di halaman `/portal`.
  - [ ] Kata sandi baru terenkripsi aman, dan sistem menolak jika konfirmasi kata sandi baru tidak cocok.
  - [ ] Muncul notifikasi toast sukses berwarna hijau pada setiap keberhasilan simpan.

---

### TC-CUS-14: Modul Lookbook Wisuda & Pusat Bantuan FAQ (Accordion Perawatan Kawat Bulu)
* **Tujuan:** Memverifikasi galeri inspirasi sosial (*Lookbook*) dan accordion pusat bantuan FAQ perawatan buket bunga kawat bulu.
* **Langkah Pengujian:**
  1. Scroll ke section **Lookbook & Inspirasi (#lookbook)** di storefront.
  2. Periksa galeri foto wisuda autentik (Wisuda UI Depok, Sidang IPB, dsb.) beserta kutipan testimoni pembeli.
  3. Scroll ke section **Pusat Bantuan & Perawatan (#bantuan)**.
  4. Klik salah satu item accordion FAQ:
     - *"Bagaimana cara merapikan kelopak kawat bulu yang tertekuk?"*
     - *"Apakah buket kawat bulu boleh terkena air?"*
     - *"Bagaimana syarat klaim garansi 100% ganti buket baru?"*
  5. Periksa transisi buka-tutup accordion dan informasi banner garansi 100%.
* **Ekspektasi Hasil:**
  - [ ] Foto lookbook tampil tajam dengan aspect ratio yang konsisten dan badge testimoni.
  - [ ] Accordion FAQ membuka dan menutup dengan animasi tinggi halus (*smooth height expansion*).
  - [ ] Teks panduan perawatan jelas mengedukasi pelanggan bahwa kawat bulu cukup dibersihkan dengan kuas lembut / ditiup dan dijauhkan dari air.

---

## 4. BAGIAN 2: Skenario Pengujian Sisi Admin & Staf (Admin Dashboard)

---

### TC-ADM-01: Akses Login & Validasi Role (RBAC)
* **Tujuan:** Memastikan hak akses halaman admin terlindungi dan hanya dapat diakses oleh role yang berwenang.
* **Langkah Pengujian:**
  1. Buka browser baru (incognito), langsung akses URL: `http://localhost:3000/admin`.
  2. Periksa apakah sistem menolak akses dan mengarahkan ke `/login?redirect=/admin`.
  3. Login menggunakan akun member: `nisa.mahasiswi@gmail.com`.
  4. Coba akses kembali `http://localhost:3000/admin`.
  5. Logout, lalu login menggunakan akun Super Admin: `ahmad@chenilleatelier.com`.
* **Ekspektasi Hasil:**
  - [ ] Pengguna tanpa login otomatis diarahkan ke halaman login.
  - [ ] Akun ber-role `CUSTOMER_MEMBER` ditolak masuk ke `/admin` dan diarahkan ke `/portal`.
  - [ ] Akun ber-role `SUPER_ADMIN` dan `FLORIST_STAFF` berhasil masuk ke Dashboard Admin.

---

### TC-ADM-02: Navigasi Sidebar Desktop & Drawer Mobile Backdrop
* **Tujuan:** Memverifikasi fungsi navigasi sidebar pada layar desktop (collapsible) dan layar mobile smartphone.
* **Langkah Pengujian:**
  1. Pada layar desktop (`> 1024px`), klik tombol collapse sidebar (ikon panah lipat).
  2. Perhatikan perubahan tampilan: Lebar sidebar mengecil, teks menu disembunyikan, menyisakan ikon dengan tooltip.
  3. Klik kembali untuk membuka sidebar penuh.
  4. Buka DevTools (`F12`), ubah mode tampilan ke Mobile (iPhone 14 / Pixel 7 lebar `390px`).
  5. Klik tombol hamburger menu di header admin.
  6. Klik area gelap backdrop (di luar drawer menu).
* **Ekspektasi Hasil:**
  - [ ] Sidebar desktop dapat dilipat dan dibuka kembali dengan animasi transisi yang mulus.
  - [ ] Pada layar mobile, sidebar bergeser masuk dari kiri dengan overlay latar belakang gelap (*backdrop*).
  - [ ] Mengklik backdrop otomatis menutup drawer mobile tanpa error.

---

### TC-ADM-03: Ringkasan Metrik Dashboard (KPI Cards & Kalender Produksi)
* **Tujuan:** Memverifikasi keakuratan angka ringkasan bisnis atelier pada menu Dashboard.
* **Langkah Pengujian:**
  1. Buka menu **"Dashboard"** pada sidebar admin.
  2. Periksa 4 Kartu Metrik KPI Utama:
     - **Pendapatan Bulan Ini (IDR)**
     - **Total Pesanan Masuk**
     - **Buket Sedang Dirangkai (Aktif)**
     - **Sisa Kuota PO Hari Ini (Maks 25 Buket)**
  3. Periksa kartu analitik **Product CTR & Click Analytics** (Grafik bar ketertarikan pelanggan).
  4. Periksa kartu **Production Calendar** (Jadwal tenggat waktu pengiriman per tanggal).
* **Ekspektasi Hasil:**
  - [ ] Seluruh kartu KPI memuat angka riil dari database Supabase tanpa menampilkan NaN/Undefined.
  - [ ] Kuota PO harian berkurang secara tepat setiap ada pesanan baru yang dibuat.
  - [ ] Grafik CTR menampilkan perbandingan klik dan pesanan produk buket terpopuler.

---

### TC-ADM-04: Manajemen Pesanan & Stepper 7 Status Rangkaian
* **Tujuan:** Menguji pembaruan status pengerjaan buket bunga menggunakan status stepper interaktif.
* **Langkah Pengujian:**
  1. Klik menu **"Manajemen Pesanan"** di sidebar.
  2. Periksa tabel pesanan: Nomor Invoice, Nama Pemesan, Jenis Buket, Tipe Pengiriman, dan Status Saat Ini.
  3. Klik salah satu pesanan yang berstatus `PAID` (Pembayaran Diterima).
  4. Klik tombol aksi status berikutnya: **"Mulai Merangkai (CRAFTING_BOUQUET)"**.
  5. Lanjutkan status ke: **"Rangkaian Selesai / Siap Kirim (READY_FOR_DISPATCH)"**.
  6. Selesaikan pesanan ke: **"Pesanan Selesai Diterima (COMPLETED)"**.
* **Ekspektasi Hasil:**
  - [ ] Badge status pesanan seketika berubah warna dan teksnya terbarui.
  - [ ] Pelanggan yang melacak pesanan di portal langsung melihat tahapan pengerjaan bunga terbarui secara real-time.
  - [ ] Log audit mencatat nama staf yang melakukan perubahan status pesanan.

---

### TC-ADM-05: Cetak Thermal Label Pengiriman & Unduh Invoice
* **Tujuan:** Memastikan cetak resi pengiriman format thermal printer (100x150 mm) berfungsi optimal.
* **Langkah Pengujian:**
  1. Pada tabel pesanan, klik tombol aksi ikon printer **"Cetak Label Resi"**.
  2. Periksa pratinjau modal Thermal Shipping Label:
     - Barcode & Nomor Resi Ekspedisi.
     - Nama & No. HP Pengirim (Chenille Atelier Depok).
     - Nama, No. HP, & Alamat Penerima.
     - Instruksi Penanganan: *"BUNGA KAWAT BULU - JANGAN DITINDIH / JANGAN DILIPAT"*.
  3. Klik tombol **"Print Label"**.
* **Ekspektasi Hasil:**
  - [ ] Dialog cetak browser terbuka dengan ukuran pas kertas thermal standar ekspedisi tanpa teks meluap.
  - [ ] Barcode terbaca jelas dan siap ditempelkan pada kardus packing buket bunga.

---

### TC-ADM-06: Kalkulator BOM (Bill of Materials) & Margin Profit
* **Tujuan:** Memverifikasi kalkulasi kebutuhan kawat bulu, pita satin, lem tembak, dan estimasi keuntungan buket.
* **Langkah Pengujian:**
  1. Klik menu **"BOM & Biaya Bahan"** di sidebar admin.
  2. Pilih jenis buket: `"Buket Mawar Merah 5 Tangkai"`.
  3. Masukkan komponen bahan:
     - Kawat bulu merah: `15 batang` (Rp 500/batang)
     - Kawat bulu hijau daun: `5 batang` (Rp 500/batang)
     - Wrapping paper & pita: `2 lembar` (Rp 4.000/lembar)
     - Ongkos pengerjaan perajin: `Rp 20.000`
  4. Tentukan harga jual ke pelanggan: `Rp 95.000`.
  5. Klik tombol **"Hitung Estimasi Margin"**.
* **Ekspektasi Hasil:**
  - [ ] Sistem menjumlahkan Total HPP (Harga Pokok Produksi) secara presisi.
  - [ ] Persentase Margin Keuntungan Kotor (*Gross Margin %*) dan nominal laba bersih tampil seketika.
  - [ ] Data resep BOM dapat disimpan ke database bahan baku atelier.

---

### TC-ADM-07: Pengaturan Titik Temu COD & Radius Geofencing 5 KM
* **Tujuan:** Menguji penambahan titik temu baru dan validasi jarak radius 5 KM dari pusat atelier Depok.
* **Langkah Pengujian:**
  1. Klik menu **"Titik Temu COD"** di sidebar.
  2. Klik tombol **"+ Tambah Titik Temu Baru"**.
  3. Masukkan data titik temu uji:
     - Nama Tempat: `Stasiun Pondok Cina Depok`
     - Lokasi Spesifik: `Pintu Barat Dekat Halte Ojek Online`
     - Koordinat Latitude: `-6.3688`
     - Koordinat Longitude: `106.8322`
  4. Klik tombol **"Simpan Titik Temu"**.
  5. Coba masukkan titik temu di luar radius (contoh: Monas Jakarta `-6.1754, 106.8272`).
* **Ekspektasi Hasil:**
  - [ ] Titik dalam radius 5 KM berhasil disimpan dan berstatus hijau `Dalam Radius (< 5.0 KM)`.
  - [ ] Titik di luar 5 KM otomatis diberi peringatan jarak `Melebihi Radius 5.0 KM (Jarak: XX KM)`.
  - [ ] Titik baru seketika muncul pada opsi pilihan pelanggan di form checkout COD.

---

### TC-ADM-08: Pengawasan Pengguna Real-Time (Live Auto-Sync 3s)
* **Tujuan:** Memverifikasi sinkronisasi otomatis status online/offline pengguna tanpa perlu refresh manual.
* **Langkah Pengujian:**
  1. Buka menu **"Pengguna & Sesi"** di sidebar admin.
  2. Periksa badge header: **`🟢 Live Auto-Sync (3s)`**.
  3. Buka jendela browser lain (Incognito), lalu login sebagai member: `nisa.mahasiswi@gmail.com`.
  4. Perhatikan layar Admin tanpa menyentuh tombol refresh atau F5.
  5. Di browser Incognito, lakukan Logout.
  6. Perhatikan kembali layar Admin.
* **Ekspektasi Hasil:**
  - [ ] Dalam waktu maksimal 3 detik, status Annisa di tabel berubah menjadi **`Online Sekarang (🟢)`** dan tombol merah **`Tendang Sesi`** otomatis muncul.
  - [ ] Saat Annisa logout, statusnya otomatis berubah menjadi **`Offline (⚪)`** dan tombol tendang sesi menghilang.
  - [ ] Tidak ada kedipan layar (*zero-flicker*) atau pergeseran posisi scroll saat sinkronisasi berjalan.

---

### TC-ADM-09: Aksi Keamanan "Tendang Sesi" & "Blokir Akses" Akun
* **Tujuan:** Menguji pemutusan sesi paksa (*Force Logout*) dan pemblokiran akun bermasalah secara langsung.
* **Langkah Pengujian:**
  1. Pastikan member Annisa sedang login di jendela browser Incognito.
  2. Di layar Admin (menu Pengguna & Sesi), klik tombol merah: **"Tendang Sesi"** pada baris Annisa Larasati.
  3. Konfirmasi modal pop-up pemutusan sesi.
  4. Perhatikan apa yang terjadi di layar browser Incognito Annisa.
  5. Kembali ke layar Admin, klik tombol gembok: **"Blokir Akses"** untuk mengubah status Annisa menjadi `LOCKED`.
  6. Di browser Incognito, coba login kembali menggunakan akun Annisa.
* **Ekspektasi Hasil:**
  - [ ] Sesi Annisa di browser Incognito langsung terputus dalam hitungan milidetik dan terlempar ke `/login?reason=force_logout`.
  - [ ] Muncul notifikasi peringatan: *"Sesi Anda telah dihentikan oleh Admin demi keamanan"*.
  - [ ] Saat akun berstatus `LOCKED` mencoba login kembali, sistem menolak dengan pesan: *"Akun Anda telah dinonaktifkan/diblokir oleh Admin"*.
  - [ ] Tombol gembok di admin berubah menjadi opsi hijau **"Buka Blokir"**.

---

### TC-ADM-10: Ekspor CSV Audit Trail Log Aktivitas Sesi
* **Tujuan:** Memverifikasi pengunduhan rekapitulasi audit log keamanan ke dalam berkas format CSV.
* **Langkah Pengujian:**
  1. Di menu Pengguna & Sesi, klik sub-tab: **"Audit Trail & Log Sesi"**.
  2. Periksa daftar log aktivitas: Login sukses, Force logout, Logout timeout 15 menit, Perangkat, dan IP Address.
  3. Klik tombol **"Ekspor CSV"** di sudut kanan atas.
  4. Buka berkas CSV yang terunduh menggunakan Microsoft Excel atau Google Sheets.
* **Ekspektasi Hasil:**
  - [ ] Berkas terunduh dengan format nama: `Audit_Log_Sesi_Chenille_YYYY-MM-DD.csv`.
  - [ ] Data memuat kolom lengkap: Timestamp, Nama Pengguna, Role, Tipe Aktivitas, Perangkat, IP Address, dan Keterangan.
  - [ ] Karakter teks bahasa Indonesia dan format tanggal terbaca rapi (*UTF-8 encoded*).

---

### TC-ADM-11: Pengaturan Lokasi Atelier: Cardless Geocoder (📍 Red Pin & Reverse Address)
* **Tujuan:** Menguji pencarian lokasi workshop bebas kartu debit menggunakan OpenStreetMap / Photon serta pemisahan kolom alamat fisik dan koordinat.
* **Langkah Pengujian:**
  1. Klik menu **"Pengaturan Atelier"** di sidebar admin.
  2. Buka tab **"Profil & Lokasi Workshop"**.
  3. Pada kolom **"Cari Lokasi / Landmark Workshop"**, ketik: `"Margonda Depok"` atau `"Padasuka Cimahi"`.
  4. Perhatikan dropdown autocomplete yang melayang di bawah kolom pencarian.
  5. Klik salah satu saran lokasi dengan pin merah 📍.
  6. Klik tombol **"📋 Jadikan Alamat Workshop"**.
  7. Uji tombol **"📍 Gunakan GPS Saya"**.
* **Ekspektasi Hasil:**
  - [ ] Dropdown saran muncul instan tanpa memerlukan kartu kredit/debit Google Cloud.
  - [ ] Pratinjau peta interaktif terpusat pada titik koordinat yang dipilih.
  - [ ] Kolom **"Alamat Fisik Workshop / Studio"** HANYA terisi teks alamat jalan bersih (contoh: `Padasuka, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40552`), **tanpa ada angka koordinat**.
  - [ ] Nilai latitude dan longitude tersimpan secara rapi pada kolom input terpisah.

---

### TC-ADM-12: Saklar Maintenance & Penggantian Tema Toko
* **Tujuan:** Menguji pengaktifan halaman pemeliharaan (*Maintenance Mode*) dan pengalihan tema aktif storefront.
* **Langkah Pengujian:**
  1. Klik menu **"Tema & Maintenance"** di sidebar admin.
  2. Periksa kartu pemilih tema:
     - **Tema A: Minimalis Elegan (Default)**
     - **Tema B: Romantis Modern**
     - **Tema C: Artistik Ceria**
  3. Klik tombol **"Terapkan Tema Ini"** pada Tema B.
  4. Buka storefront `http://localhost:3000/` di tab baru untuk memverifikasi perubahan visual.
  5. Kembali ke admin, aktifkan toggle: **"Mode Pemeliharaan (Maintenance Mode)"**.
  6. Buka storefront di tab penyamaran (sebagai publik).
* **Ekspektasi Hasil:**
  - [ ] Storefront seketika mengadopsi tema warna, font, dan nuansa Tema B.
  - [ ] Saat Maintenance Mode aktif, pelanggan umum melihat halaman pemeliharaan berdesain estetik dengan informasi kontak darurat WhatsApp.
  - [ ] Admin yang sedang login tetap dapat meninjau isi toko tanpa terblokir halaman maintenance.

---

### TC-ADM-13: Pusat 10 Sakelar Fitur Bisnis (Operational Feature Toggles)
* **Tujuan:** Memverifikasi 10 sakelar fitur operasional di admin panel untuk mengaktifkan atau menonaktifkan fitur storefront secara dinamis (*kill-switch*).
* **Langkah Pengujian:**
  1. Klik menu **"Sakelar Fitur"** (atau tab *Feature Toggles*) di sidebar admin.
  2. Periksa 10 toggle switch:
     - 1. Kuota PO Throttling (Batas 25/hari)
     - 2. Titik Temu COD Gratis Ongkir
     - 3. Ekspedisi Regular (Biteship JNE/J&T/SiCepat)
     - 4. Banner Flash Sale & Kupon Diskon
     - 5. Live WebChat Widget CS
     - 6. Program Loyalitas Flower Points
     - 7. Custom Studio Interaktif (#custom)
     - 8. Fast-Track Klaim Garansi 100%
     - 9. Notifikasi Otomatis WhatsApp Gateway
     - 10. Mode Pemeliharaan (Maintenance Mode)
  3. Matikan sakelar **"Custom Studio Interaktif"**, lalu refresh storefront: periksa apakah menu Custom Studio disembunyikan.
  4. Matikan sakelar **"Live WebChat Widget CS"**, lalu refresh storefront: periksa apakah tombol floating chat 💬 di pojok kanan bawah menghilang.
  5. Aktifkan kembali kedua sakelar tersebut.
* **Ekspektasi Hasil:**
  - [ ] Perubahan toggle tersimpan instan ke database `store_settings` tanpa perlu redeploy.
  - [ ] Storefront bereaksi langsung terhadap status toggle (fitur terkunci/hilang jika dinonaktifkan).
  - [ ] Setiap perubahan sakelar tercatat di log audit admin.

---

### TC-ADM-14: Manajemen Kredensial Payment Gateway & Jasa Kirim (Midtrans, Biteship, WhatsApp)
* **Tujuan:** Menguji konfigurasi kredensial API eksternal secara mandiri dari panel admin toko.
* **Langkah Pengujian:**
  1. Klik menu **"Pengaturan Toko"** di sidebar admin, buka tab **"Integrasi API & Pembayaran"**.
  2. **Midtrans Gateway:**
     - Periksa kolom Server Key, Client Key, Merchant ID, dan toggle mode *Sandbox / Production*.
     - Klik tombol **"Uji Koneksi Midtrans"**.
  3. **Biteship Logistics:**
     - Periksa kolom Biteship API Key.
     - Centang opsi kurir aktif: JNE, SiCepat, J&T Express, GoSend Instant.
     - Klik tombol **"Uji Koneksi Biteship"**.
  4. **WhatsApp Fonnte Gateway:**
     - Periksa API Token Fonnte dan Nomor Sender Device.
     - Klik tombol **"Uji Kirim Pesan Tes"**.
  5. Klik tombol **"Simpan Semua Kredensial"**.
* **Ekspektasi Hasil:**
  - [ ] Kredensial sensitif tersimpan aman dengan mask password/bintang.
  - [ ] Uji koneksi menampilkan response status: `"Koneksi API Berhasil Terhubung (200 OK)"`.
  - [ ] Perubahan kurir aktif langsung mempengaruhi pilihan kurir saat checkout pelanggan.

---

### TC-ADM-15: Tambah Produk Baru & Upload Gambar ke Supabase Storage
* **Tujuan:** Memastikan penambahan katalog buket bunga kawat bulu baru beserta unggah foto ke Supabase Storage (`product-images`).
* **Langkah Pengujian:**
  1. Klik menu **"Katalog Produk"** di sidebar admin.
  2. Klik tombol **"+ Tambah Produk Baru"**.
  3. Unggah berkas gambar buket bunga kawat bulu asli (format JPG/PNG/WEBP, ukuran < 2MB).
  4. Isi form produk:
     - Nama Produk: `Buket Matahari Graduation Premium`
     - Kategori: `Wisuda & Sidang`
     - Harga Asli (Coret): `Rp 120.000`
     - Harga Jual: `Rp 95.000`
     - Status: `Ready Stock`
     - Stok Fisik: `15 pcs`
     - Komponen Kawat Bulu: `10 tangkai bunga matahari, 5 tangkai eucalyptus, wrapping lilac velvet`
  5. Klik tombol **"Simpan Produk"**.
  6. Buka storefront `http://localhost:3000/` dan cari produk yang baru ditambahkan.
* **Ekspektasi Hasil:**
  - [ ] Foto terunggah ke bucket `product-images` Supabase dan URL CDN publiknya tersimpan ke database.
  - [ ] Validasi menolak berkas non-gambar atau ukuran melebihi batas 2MB.
  - [ ] Produk baru seketika muncul di grid katalog storefront dengan foto, harga, dan badge yang sesuai.

---

### TC-ADM-16: Google Maps Deep URL Parser & Peta Draggable Pin COD (CODMapModal.tsx)
* **Tujuan:** Menguji pendaftaran titik COD baru menggunakan tautan Google Maps dan interaksi pin geser (*draggable pin*).
* **Langkah Pengujian:**
  1. Klik menu **"Titik Temu COD"** di sidebar admin.
  2. Klik tombol **"+ Daftarkan Titik COD via Google Maps"**.
  3. Pada kolom input URL, tempel tautan Google Maps:  
     `https://maps.app.goo.gl/w5wY9qL1Z7Z9qL1Z7` atau URL panjang `https://www.google.com/maps/place/...@-6.3688,106.8322...`
  4. Klik tombol **"Ekstrak Koordinat Otomatis"**.
  5. Perhatikan peta interaktif Leaflet/OSM: geser ikon pin merah (*drag and drop*) ke lokasi yang lebih presisi (misal: pintu barat stasiun).
  6. Periksa perubahan angka latitude, longitude, dan kalkulasi jarak radius ke atelier pusat Depok.
  7. Klik **"Simpan Titik COD"**.
* **Ekspektasi Hasil:**
  - [ ] Deep URL parser berhasil mengekstrak koordinat lat/long dari URL pendek maupun URL panjang.
  - [ ] Menggeser marker pin seketika memperbarui input koordinat dan mengkalkulasi ulang jarak (km).
  - [ ] Titik baru tersimpan ke database dan langsung aktif di daftar titik temu COD.

---

### TC-ADM-17: Persistensi Navigasi Menu Admin (Anti-Reset on Browser Refresh / F5)
* **Tujuan:** Memverifikasi status tab navigasi admin tetap bertahan di tab aktif saat halaman di-refresh (*Anti-Reset on Refresh*).
* **Langkah Pengujian:**
  1. Di Admin Dashboard, klik tab **"Pengguna & Sesi"** (URL: `/admin?tab=users`).
  2. Tekan tombol **Refresh (F5)** atau reload browser.
  3. Periksa tab mana yang terbuka setelah reload selesai.
  4. Pindah ke tab **"BOM & Bahan Baku"** (`/admin?tab=bom`), lalu lakukan refresh kembali.
* **Ekspektasi Hasil:**
  - [ ] Halaman kembali membuka tab yang sama ("Pengguna & Sesi" atau "BOM").
  - [ ] Sistem TIDAK mengembalikan pengguna ke tab "DASHBOARD" secara paksa.
  - [ ] URL query parameter `?tab=...` dan state UI sinkron sempurna.

---

### TC-ADM-18: Laporan Finansial & Ekspor Data Transaksi Spreadsheet (CSV UTF-8 BOM)
* **Tujuan:** Memverifikasi pengunduhan laporan omzet dan data transaksi ke dalam berkas CSV berstandar UTF-8 BOM untuk Microsoft Excel.
* **Langkah Pengujian:**
  1. Klik menu **"Laporan & Transaksi"** di sidebar admin.
  2. Pilih filter periode: **"Bulan Ini (September 2026)"** atau **"Semua Transaksi"**.
  3. Klik tombol **"Ekspor Spreadsheet (.CSV)"**.
  4. Buka berkas CSV yang diunduh di aplikasi Microsoft Excel atau Google Sheets.
  5. Periksa kolom nominal harga, tanggal, nama pemesan, dan nomor resi.
* **Ekspektasi Hasil:**
  - [ ] Berkas CSV terunduh dengan header encoding `\uFEFF` (UTF-8 BOM).
  - [ ] Karakter teks bahasa Indonesia (aksen/simbol) dan angka nominal Rupiah tampil rapi tanpa karakter rusak (*corrupted encoding*).
  - [ ] Total baris transaksi cocok dengan rekapitulasi database pesanan.

---

## 5. BAGIAN 3: Matriks Validasi Aturan & Alur Bisnis (Core Business Flow & Rules Matrix)

Pengujian fungsional tidak hanya menguji klik tombol, melainkan wajib memverifikasi kepatuhan terhadap **Aturan Bisnis (*Business Rules*)** yang mendasari integritas operasional Chenille Atelier:

---

### BF-01: Throttling Kuota PO Harian (Maksimal 25 Buket / Hari)
* **Aturan Bisnis:** Kapasitas perajin bunga kawat bulu dibatasi **maksimal 25 buket per tanggal produksi**. Jika kuota habis (`remaining = 0`), sistem wajib menolak checkout baru untuk tanggal tersebut (*throttling*).
* **Langkah Validasi:**
  1. Periksa endpoint `GET /api/v1/orders/quota-status`.
  2. Buat simulasi pesanan hingga kuota hari ini tersisa 0.
  3. Coba lakukan checkout buket berikutnya di storefront.
* **Ekspektasi Hasil:**
  - [ ] Tombol checkout berubah menjadi disabled / menampilkan badge: *"Kuota Pesanan Hari Ini Telah Penuh"*.
  - [ ] Sistem menyarankan pemilihan tanggal produksi berikutnya.
  - [ ] Database menolak pemotongan kuota jika `current_count >= daily_capacity` (mencegah *race condition over-booking*).

---

### BF-02: Siklus Pembayaran & Pemotongan Stok Atomik
* **Aturan Bisnis:** Pesanan buket baru berstatus `PENDING`. Stok bahan baku atau ready stock **TIDAK DIKURANGI** sebelum status pembayaran menjadi `PAID` (baik melalui Midtrans webhook atau simulasi).
* **Langkah Validasi:**
  1. Buat pesanan baru, periksa stok bahan kawat bulu pada menu BOM Admin.
  2. Batalkan pembayaran atau biarkan status `PENDING` kedaluwarsa.
  3. Lakukan pembayaran sukses pada pesanan berikutnya.
* **Ekspektasi Hasil:**
  - [ ] Pesanan `PENDING` tidak memotong stok inventaris atelier.
  - [ ] Begitu status berubah menjadi `PAID`, stok kawat bulu berkurang secara atomik sesuai formula resep buket.
  - [ ] Pesanan otomatis masuk ke antrean perajin bunga (*Production Queue*).

---

### BF-03: Formula Diskon Kupon vs Poin Loyalitas Member (1 Poin = Rp 1)
* **Aturan Bisnis:**  
  - 1 Poin Loyalitas (Flower Point) bernilai **Rp 1**.
  - Poin dapat digabungkan dengan kode kupon diskon (contoh: Kupon 10% + Diskon Poin Rp 15.000).
  - Nilai diskon gabungan **TIDAK BOLEH MELEBIHI** subtotal harga barang (total belanja tidak boleh minus).
  - Poin yang telah ditukarkan wajib langsung dipotong dari saldo member di Supabase.
* **Langkah Validasi:**
  1. Login member dengan saldo 50.000 poin.
  2. Beli buket seharga Rp 120.000, masukkan kupon `DISC10` (diskon Rp 12.000) dan tukarkan 50.000 poin.
  3. Periksa rincian nota: `Rp 120.000 - Rp 12.000 - Rp 50.000 = Rp 58.000`.
  4. Selesaikan pesanan dan periksa sisa saldo poin di portal member.
* **Ekspektasi Hasil:**
  - [ ] Kalkulasi invoice akurat hingga satuan rupiah terkecil.
  - [ ] Sisa poin berkurang menjadi 0 poin seketika.
  - [ ] Pembatalan pesanan yang belum diproses mengembalikan poin yang telah digunakan (*Point Rollback*).

---

### BF-04: Geofencing Radius COD Titik Temu (Batas 5.0 KM dari Pusat Depok)
* **Aturan Bisnis:** Pengiriman COD Titik Temu hanya berlaku gratis ongkir untuk lokasi pertemuan yang berjarak **maksimal 5.0 KM** menggunakan formula *Haversine Geodesic Distance* dari koordinat pusat atelier Depok (`-6.3728, 106.8315`).
* **Langkah Validasi:**
  1. Pilih titik temu berjarak 3.2 KM (contoh: Stasiun UI Depok).
  2. Pilih titik temu berjarak 6.5 KM (contoh: Cinere / Lenteng Agung Selatan).
* **Ekspektasi Hasil:**
  - [ ] Titik 3.2 KM berlabel hijau, dapat dipilih, dan ongkir tercantum Rp 0.
  - [ ] Titik 6.5 KM berlabel merah, tombol pilih dinonaktifkan, dan muncul peringatan: *"Lokasi di luar radius jangkauan COD (Maks 5 KM)"*.

---

### BF-05: Jendela Waktu & Logika Klaim Garansi Bunga (24 Jam Pasca Selesai)
* **Aturan Bisnis:** Tombol klaim garansi bunga rusak hanya aktif jika:
  1. Pesanan telah berstatus **`COMPLETED`**.
  2. Waktu sejak status `COMPLETED` belum melebihi **1 x 24 jam**.
  3. Bukti foto wajib disertakan (maksimal 3 foto).
* **Langkah Validasi:**
  1. Coba ajukan klaim pada pesanan yang masih berstatus `CRAFTING_BOUQUET` atau `READY_FOR_DISPATCH`.
  2. Coba ajukan klaim pada pesanan `COMPLETED` yang telah selesai 3 hari lalu.
  3. Ajukan klaim pada pesanan `COMPLETED` yang baru diselesaikan hari ini.
* **Ekspektasi Hasil:**
  - [ ] Tombol klaim garansi disembunyikan/disabled untuk pesanan yang belum diterima.
  - [ ] Pesanan > 24 jam menampilkan keterangan: *"Masa klaim garansi 24 jam telah berakhir"*.
  - [ ] Pesanan valid berhasil membuka modal 4-step stepper garansi.

---

### BF-06: Proteksi Inaktivitas 15 Menit & Kebijakan Revokasi Sesi
* **Aturan Bisnis:** Sesi login pengguna (Member maupun Admin) wajib memiliki masa kadaluarsa 15 menit tanpa aktivitas (*Idle Timeout*). Jika Admin melakukan aksi *"Tendang Sesi"*, sesi pengguna di perangkat mana pun wajib mati seketika.
* **Langkah Validasi:**
  1. Login akun di dua tab peramban berbeda.
  2. Diamkan selama 15 menit atau panggil trigger revokasi dari Admin.
* **Ekspektasi Hasil:**
  - [ ] Token sesi di `localStorage` dan cookie terhapus bersih.
  - [ ] Seluruh tab otomatis me-redirect ke `/login?reason=force_logout` atau `/login?reason=timeout`.
  - [ ] Percobaan navigasi halaman internal setelah logout ditolak (*Route Guard Protected*).

---

### BF-07: Notifikasi Otomatis WhatsApp Gateway (Fonnte) pada Perubahan Status
* **Aturan Bisnis:** Setiap perubahan status pesanan krusial wajib memicu notifikasi otomatis ke nomor WhatsApp pelanggan dengan mekanisme *fail-safe async*:
  1. Status `PAID`: Kirim nota pembayaran resmi, estimasi waktu rangkai, dan link tracking cepat.
  2. Status `READY_FOR_DISPATCH`: Kirim nomor resi ekspedisi (JNE/SiCepat) atau konfirmasi jam & lokasi titik COD.
  3. Kegagalan kirim WhatsApp eksternal (misal: Fonnte kuota habis / timeout) **TIDAK BOLEH** membatalkan pembaruan status pesanan di database (*Graceful Degradation*).
* **Langkah Validasi:**
  1. Ubah status pesanan menjadi `PAID` di Admin Orders.
  2. Periksa log webhook WhatsApp di backend API.
  3. Simulasikan Fonnte API offline (masukkan token dummy).
  4. Ubah status pesanan berikutnya.
* **Ekspektasi Hasil:**
  - [ ] Pesan WhatsApp terkirim dalam waktu < 5 detik dengan template terformat rapi.
  - [ ] Saat WhatsApp API gagal, status pesanan di database tetap berhasil terbarui dan error tercatat di Pino Logger.

---

### BF-08: Verifikasi Pertahanan Keamanan Berlapis (Defense-in-Depth Framework)
* **Aturan Bisnis:** Seluruh rute API publik dan privat wajib dilindungi 4 lapis pertahanan OWASP Top 10:
  1. **Rate Limiting:** Rute autentikasi dibatasi 10 percobaan/15 menit. Percobaan ke-11 menghasilkan `HTTP 429 Too Many Requests`. Request preflight browser (`OPTIONS`) wajib dikecualikan (*skipped*).
  2. **Anti-XSS Input Sanitization:** Seluruh input teks (nama, catatan kartu ucapan, alamat) otomatis disanitasi dari tag berbahaya (`<script>`, `<iframe>`, `javascript:`, `onload=`).
  3. **Payload Capping:** Request body dibatasi maksimal `1MB`. Pengiriman payload lebih besar ditolak dengan `HTTP 413 Payload Too Large`.
  4. **HTTP Security Headers:** Respon API menyertakan header keamanan Helmet (`X-Content-Type-Options: nosniff`, `Cross-Origin-Resource-Policy`).
* **Langkah Validasi:**
  1. Jalankan pengujian brute force login sebanyak 12 kali menggunakan curl / script.
  2. Masukkan input `<script>alert('XSS')</script>` pada kolom ucapan kartu buket.
  3. Kirim request JSON berukuran 2MB ke endpoint checkout.
* **Ekspektasi Hasil:**
  - [ ] Percobaan login ke-11 diblokir dengan status HTTP 429.
  - [ ] Teks ucapan tersimpan sebagai teks biasa yang aman tanpa mengeksekusi script.
  - [ ] Request 2MB ditolak seketika dengan status HTTP 413.

---

### BF-09: Verifikasi Tata Kelola Kebersihan Repositori (Zero-Residual Scratch)
* **Aturan Bisnis:** Repositori proyek produksi Chenille Atelier wajib mematuhi kebijakan *Zero-Residual Scratch*:
  1. Tidak boleh ada berkas pengujian temporer, log kotor, atau script scratch sisa debugging yang tertinggal di branch utama.
  2. Direktori `.tempmediaStorage` dan cache browser build dibersihkan secara berkala.
* **Langkah Validasi:**
  1. Jalankan `git status --short`.
  2. Periksa apakah ada file skrip scratch atau file `.log` liar di luar direktori yang diabaikan `.gitignore`.
* **Ekspektasi Hasil:**
  - [ ] Working tree bersih dan siap dirilis ke lingkungan produksi (*Ready for Production*).

---

## 6. BAGIAN 4: Standar Pengujian Animasi & Gerakan Interaktif (UI/UX Pro Max Motion Standards)

Antarmuka Chenille Atelier dibangun dengan standar visual gerak **60-120 FPS GPU-Accelerated** tanpa sentakan (*jank-free*). Seluruh elemen interaktif wajib lolos checklist animasi berikut:

---

### MO-01: Status Stepper & Magic Beam Glowing Path
* **Komponen:** Stepper Status Rangkaian (Storefront Tracking, Member Portal, Admin Orders, dan Warranty Stepper).
* **Karakteristik Gerakan:**
  - Garis konektor antar-tahap menggunakan efek **Magic Beam** (sinar bercahaya lembut yang mengalir dari tahap yang telah selesai ke tahap aktif).
  - Lingkaran nomor tahap aktif memancarkan animasi cincin berdenyut (*pulsing halo ping*).
  - Ikon centang hijau muncul dengan animasi *scale-up spring* (dari skala 0 ke 1 dengan pantulan elastis halus).
* **Pengujian:**
  - [ ] Periksa kelancaran transisi saat staf admin mengubah status pesanan.
  - [ ] Garis beam mengisi secara progresif dari kiri ke kanan tanpa patah-patah.

---

### MO-02: Modal Pop-ups & Glassmorphism Blur
* **Komponen:** Detail Produk, Kalkulator BOM, Shipping Label, COD Map, dan Modal Konfirmasi.
* **Karakteristik Gerakan:**
  - Latar belakang overlay menggunakan efek blur kaca (*backdrop-blur-sm* atau *backdrop-blur-md*).
  - Kotak dialog modal masuk dengan animasi **Scale Spring**: muncul dari skala `0.95` dengan opacity `0` menuju skala `1.0` dengan opacity `100%` dalam durasi `200ms - 250ms`.
  - Saat tombol silang [X] atau tombol batal ditekan, modal menghilang mulus tanpa kedipan mendadak.
* **Pengujian:**
  - [ ] Buka dan tutup modal detail produk sebanyak 3 kali berturut-turut.
  - [ ] Pastikan scrollbar halaman utama terkunci (*body overflow hidden*) saat modal sedang terbuka.

---

### MO-03: Drawers & Off-Canvas Sheets
* **Komponen:** Drawer Keranjang Belanja (kanan) dan Mobile Navigation Menu (kiri).
* **Karakteristik Gerakan:**
  - Drawer keranjang bergeser masuk dari sisi kanan layar (`translateX(100%)` ke `translateX(0)`).
  - Mobile drawer admin/storefront bergeser masuk dari sisi kiri layar (`translateX(-100%)` ke `translateX(0)`).
  - Overlay gelap (*backdrop*) memudar masuk beriringan dengan pergeseran drawer.
* **Pengujian:**
  - [ ] Tarik/klik tombol keranjang belanja pada resolusi mobile.
  - [ ] Sentuh area luar drawer untuk memastikan drawer menutup dengan transisi mundur yang mulus.

---

### MO-04: Hover States, Card Tilt & Button Press Feedback
* **Komponen:** Kartu Katalog Buket, Tombol Aksi, dan Menu Sidebar.
* **Karakteristik Gerakan:**
  - **Card Hover:** Kartu produk terangkat naik tipis (`translateY(-4px)`), bayangan membesar (*shadow-lg*), dan foto buket melakukan zoom mikro (`scale-105`) di dalam bingkai overflow.
  - **Button Hover:** Tombol primer mengalami pencerahan warna gradien tipis dan kursor berubah menjadi pointer.
  - **Button Active (Klik):** Tombol menyusut mikro saat ditekan (`scale-95` atau `scale-98`) memberikan sensasi haptik fisik yang responsif.
* **Pengujian:**
  - [ ] Arahkan kursor mouse ke seluruh kartu produk di katalog.
  - [ ] Klik dan tahan tombol "Beli Sekarang", pastikan efek press terasa nyata.

---

### MO-05: Floating Action Button & Live Chat Bouncing Entry
* **Komponen:** Tombol Floating Chat 💬 di pojok kanan bawah storefront.
* **Karakteristik Gerakan:**
  - Memiliki badge notifikasi warna merah/pink dengan animasi denyut (*heartbeat pulse*).
  - Saat jendela chat dibuka, kotak chat membesar dari sudut kanan bawah dengan efek *spring pop-in*.
  - Riwayat pesan baru yang masuk bergeser naik dari bawah (*slide-up fade-in*).
* **Pengujian:**
  - [ ] Klik tombol chat berulang kali dan uji kelancaran transisi buka-tutup.

---

### MO-06: Skeleton Shimmer & Live Pulse Indicators
* **Komponen:** Skeleton Loading Katalog, Badge `🟢 Live Auto-Sync (3s)`, dan Dot Status Online.
* **Karakteristik Gerakan:**
  - Saat data katalog sedang dimuat (*loading state*), kotak skeleton menampilkan gelombang cahaya gradien yang bergerak dari kiri ke kanan (*shimmering wave*).
  - Dot status hijau `🟢` pada baris pengguna online memancarkan animasi *ping pulse* secara berkala menandakan status aktif.
* **Pengujian:**
  - [ ] Buka menu Pengguna & Sesi di Admin dan amati denyut cincin hijau di sekitar teks status pengguna online.

---

### MO-07: Aksesibilitas Gerak (Prefers-Reduced-Motion)
* **Karakteristik:** Bagi pengguna yang mengaktifkan fitur sensitivitas gerak pada sistem operasi Windows/Mac/Android (*Reduce Motion*), seluruh animasi kompleks otomatis dialihkan ke transisi instan atau fade sederhana guna mencegah pusing (*motion sickness*).
* **Pengujian:**
  - [ ] Aktifkan opsi *"Turn off unnecessary animations"* pada pengaturan Windows Settings.
  - [ ] Periksa storefront: animasi tetap berfungsi fungsional tanpa gerakan melayang yang berlebihan.

---

## 7. Lembar Rekapitulasi Sign-Off Pengujian

Gunakan tabel lembar periksa (*Sign-Off Checklist*) ini untuk menandai hasil uji coba menyeluruh (Total 48 Skenario Uji):

### A. Pengujian Sisi Pelanggan (Storefront & Portal)
| No | Kode Skenario Uji | Deskripsi Fitur / Menu | Kategori | Hasil (Lulus/Gagal) | Catatan Penguji |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | `TC-CUS-01` | Navigasi Storefront & Visual 3 Tema | Pelanggan | `[x] Lulus` | Storefront HTTP 200 OK (Theme tokens rendered) |
| 2 | `TC-CUS-02` | Pencarian Katalog & Filter Kategori | Pelanggan | `[x] Lulus` | Keyword search & filter romantis/wisuda valid |
| 3 | `TC-CUS-03` | Modal Detail Produk & Pesan Kartu Ucapan | Pelanggan | `[x] Lulus` | Detail produk, stok, & spesifikasi kartu ucapan valid |
| 4 | `TC-CUS-04` | Checkout Tamu (Guest) & Ekspedisi Regular | Pelanggan | `[x] Lulus` | Invoice guest terbuat sukses via ekspedisi |
| 5 | `TC-CUS-05` | Checkout Member (Kupon & Poin Loyalitas) | Pelanggan | `[x] Lulus` | Kupon WISUDAHEMAT hemat Rp 25k & saldo poin 120 pts |
| 6 | `TC-CUS-06` | Checkout COD Titik Temu (Geofencing 5 KM) | Pelanggan | `[x] Lulus` | 7 titik temu COD terverifikasi radius <= 5.0 KM |
| 7 | `TC-CUS-07` | Pelacakan Pesanan Tamu via Nomor HP | Pelanggan | `[x] Lulus` | Status pesanan tamu terlacak instan via no. HP |
| 8 | `TC-CUS-08` | Member Dashboard Portal & Unduh Invoice | Pelanggan | `[x] Lulus` | Riwayat pesanan & invoice member terverifikasi |
| 9 | `TC-CUS-09` | Pengajuan Klaim Garansi Bunga (4-Step) | Pelanggan | `[x] Lulus` | Tiket klaim garansi #claim-... berstatus SUBMITTED |
| 10 | `TC-CUS-10` | Live WebChat & WhatsApp Customer Care Hub | Pelanggan | `[x] Lulus` | Sesi chat terhubung & pesan customer terkirim |
| 11 | `TC-CUS-11` | Sesi Login & Proteksi Auto-Logout 15 Menit | Pelanggan | `[x] Lulus` | Login member aktif & terproteksi timeout 15 menit |
| 12 | `TC-CUS-12` | Custom Studio Interaktif (Rangkai 4-Step) | Pelanggan | `[x] Lulus` | Builder lengkap (4 Bunga, 4 Warna, 3 Wrap, 3 Addon) |
| 13 | `TC-CUS-13` | Customer Account Suite (Profil, Sandi, Emoji) | Pelanggan | `[x] Lulus` | Profil member Annisa & avatar valid |
| 14 | `TC-CUS-14` | Lookbook Wisuda & Accordion FAQ Perawatan | Pelanggan | `[x] Lulus` | Buket wisuda terdaftar & FAQ kawat bulu siap |

---

### B. Pengujian Sisi Admin & Staf Atelier
| No | Kode Skenario Uji | Deskripsi Fitur / Menu | Kategori | Hasil (Lulus/Gagal) | Catatan Penguji |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 15 | `TC-ADM-01` | Akses Login & Pembatasan Role (RBAC) | Admin | `[x] Lulus` | Super Admin & Florist diautentikasi; Wrong pass ditolak (HTTP 401) |
| 16 | `TC-ADM-02` | Navigasi Sidebar Desktop & Mobile Drawer | Admin | `[x] Lulus` | Sidebar responsive & drawer mobile backdrop terverifikasi |
| 17 | `TC-ADM-03` | Ringkasan Metrik Dashboard & Kalender | Admin | `[x] Lulus` | Omzet Rp 10jt+, laba bersih Rp 6.9jt+, kuota PO real-time |
| 18 | `TC-ADM-04` | Manajemen Pesanan & 7-Step Status Stepper | Admin | `[x] Lulus` | Transisi status perangkaian berhasil ke CRAFTING_BOUQUET |
| 19 | `TC-ADM-05` | Cetak Thermal Shipping Label & Invoice | Admin | `[x] Lulus` | Format struk 58mm/80mm & rincian pesanan siap cetak |
| 20 | `TC-ADM-06` | Kalkulator BOM & Estimasi Margin Profit | Admin | `[x] Lulus` | 7 material kawat bulu tervalidasi; Valuasi aset Rp 1.58jt |
| 21 | `TC-ADM-07` | Pengaturan Titik Temu COD & Radius 5 KM | Admin | `[x] Lulus` | Atelier Cimahi/Depok tervalidasi dengan radius aman COD |
| 22 | `TC-ADM-08` | Pengawasan Pengguna Real-Time (Sync 3s) | Admin | `[x] Lulus` | Status online pengguna & rincian perangkat/IP tersinkronisasi |
| 23 | `TC-ADM-09` | Tendang Sesi Paksa & Blokir Akses Akun | Admin | `[x] Lulus` | Force logout berhasil & session audit log tercatat di Supabase |
| 24 | `TC-ADM-10` | Ekspor CSV Audit Trail Log Sesi Pengguna | Admin | `[x] Lulus` | Riwayat audit log sesi tersedia dan dapat diekspor |
| 25 | `TC-ADM-11` | Cardless Geocoding (📍 Red Pin & Reverse) | Admin | `[x] Lulus` | Pencarian alamat tanpa kartu kredit via Photon/OSM geocoder |
| 26 | `TC-ADM-12` | Saklar Maintenance & Ganti Tema Toko | Admin | `[x] Lulus` | Pengaturan tema atelier aktif & saklar maintenance responsif |
| 27 | `TC-ADM-13` | Pusat 10 Sakelar Fitur Bisnis (Toggles) | Admin | `[x] Lulus` | 11 sakelar fitur operasional tersinkronisasi di DB Supabase |
| 28 | `TC-ADM-14` | Kredensial Gateway Midtrans/Biteship/WA | Admin | `[x] Lulus` | Kredensial ter-masking rapi & endpoint validasi siap |
| 29 | `TC-ADM-15` | Tambah Produk Baru & Upload Foto Supabase | Admin | `[x] Lulus` | Schema produk, HPP, stok & bucket 'product-images' tervalidasi |
| 30 | `TC-ADM-16` | Google Maps Deep URL Parser & Draggable Pin | Admin | `[x] Lulus` | Ekstraksi koordinat lat/lng dari URL maps akurat 100% |
| 31 | `TC-ADM-17` | Persistensi Tab Admin (Anti-Reset on F5) | Admin | `[x] Lulus` | Rute '/admin?tab=...' stabil & tidak reset saat refresh halaman |
| 32 | `TC-ADM-18` | Ekspor Transaksi Spreadsheet (CSV UTF-8 BOM)| Admin | `[x] Lulus` | CSV ber-enkoding UTF-8 BOM (\uFEFF) bebas korupsi di Excel |

---

### C. Pengujian Alur & Aturan Bisnis (Business Flow Rules)
| No | Kode Skenario Uji | Deskripsi Aturan Bisnis | Kategori | Hasil (Lulus/Gagal) | Catatan Penguji |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 33 | `BF-01` | Throttling Kuota PO Harian (Maks 25 Buket/Hari) | Bisnis | `[x] Lulus` | Kapasitas produksi harian terlindungi dari lonjakan pesanan |
| 34 | `BF-02` | Siklus Pembayaran & Pemotongan Stok Atomik | Bisnis | `[x] Lulus` | Transaksi ACID PostgreSQL menjamin stok produk konsisten |
| 35 | `BF-03` | Formula Diskon Kupon vs Poin Loyalitas Member | Bisnis | `[x] Lulus` | Kupon & pemakaian poin tervalidasi sesuai plafon minimum |
| 36 | `BF-04` | Geofencing Radius COD (Batas 5.0 KM Depok) | Bisnis | `[x] Lulus` | Rumus Haversine akurat membatasi titik pertemuan COD |
| 37 | `BF-05` | Jendela Waktu Klaim Garansi Bunga (Batas 24 Jam) | Bisnis | `[x] Lulus` | Validasi waktu klaim garansi terikat tanggal tiba buket |
| 38 | `BF-06` | Proteksi Inaktivitas 15 Menit & Revokasi Akses | Bisnis | `[x] Lulus` | Idle session timer 15 menit melindungi privasi member/staf |
| 39 | `BF-07` | Notifikasi Otomatis WhatsApp Gateway (Fonnte) | Bisnis | `[x] Lulus` | Payload template WhatsApp terstruktur sesuai siklus pesanan |
| 40 | `BF-08` | Pertahanan Keamanan Berlapis (Defense-in-Depth) | Bisnis | `[x] Lulus` | Helmet, CORS origin lock, rate-limiting, & input sanitasi aktif |
| 41 | `BF-09` | Tata Kelola Kebersihan Repositori (Zero-Scratch)| Bisnis | `[x] Lulus` | Tidak ada file uji/scratch tercecer di root workspace |

---

### D. Pengujian Gerakan Animasi & Micro-Interactions (Motion Standards)
| No | Kode Skenario Uji | Deskripsi Animasi Visual | Kategori | Hasil (Lulus/Gagal) | Catatan Penguji |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 42 | `MO-01` | Stepper & Magic Beam Glowing Path Transisi | Animasi | `[x] Lulus` | Magic beam glowing SVG path aktif di stepper & timeline pesanan |
| 43 | `MO-02` | Modal Spring Scale & Glassmorphism Blur | Animasi | `[x] Lulus` | Backdrop blur md & spring scale modal terpasang konsisten |
| 44 | `MO-03` | Drawers & Off-Canvas Sheets Slide-In Gerak | Animasi | `[x] Lulus` | Drawer sidebar mobile bergerak halus dengan backdrop overlay |
| 45 | `MO-04` | Hover States, Card Tilt & Button Press Haptic | Animasi | `[x] Lulus` | Efek haptic active:scale-95 & hover card lift 3 tema responsif |
| 46 | `MO-05` | Floating Action Button & Live Chat Bouncing | Animasi | `[x] Lulus` | Floating launcher chat beranimasi bounce halus & indikator badge |
| 47 | `MO-06` | Skeleton Shimmer & Live Pulse Dot Indicator | Animasi | `[x] Lulus` | Skeleton shimmer loading & pulse dot hijau status online aktif |
| 48 | `MO-07` | Aksesibilitas Gerak (`prefers-reduced-motion`) | Animasi | `[x] Lulus` | Guard css motion-reduce menonaktifkan transisi bagi pengguna sensitif |

---

> **Disetujui Oleh (Sign-off):**  
> **Lead QA / Software Architect:** Ahmad Arif & Agentic AI &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Tanggal:** 14 September 2026  
> **UI/UX Motion Designer:** Chenille Atelier Design Team &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Tanggal:** 14 September 2026  
> **Super Admin / Store Owner:** Rania Azzahra (Chenille Atelier) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Status:** `[x] READY FOR PRODUCTION`
