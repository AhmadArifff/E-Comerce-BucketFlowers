# 40-Security & RBAC Standards

Dokumen ini mendefinisikan standar keamanan siber, otorisasi peran pengguna (*Role-Based Access Control*), dan sanitasi input.

---

## 1. Hirarki Peran Pengguna (RBAC)

1. **Guest / Public**:
   - Akses: Lihat katalog publik, kalkulator custom studio, lacak pesanan publik (`/lacak-pesanan`), input keranjang belanja, checkout WA.
2. **Member / Registered Customer**:
   - Akses: Riwayat pesanan akun, kartu stempel loyalty (`user_stamp_cards`), absensi harian (`user_attendance_logs`), pengingat momen (`customer_occasions`), tiket klaim garansi & komplain.
3. **Staff / Admin**:
   - Akses: Manajemen pesanan toko (`/admin`), perubahan status pesanan, stok bahan baku, manajemen katalog buket, dan respon live chat.
4. **Super Admin**:
   - Akses penuh: Ekspor laporan keuangan bulanan, manajemen kredensial admin, pengaturan gateway pembayaran, dan mode pemeliharaan toko (*Maintenance Mode*).

---

## 2. Pencegahan Kerentanan Umum (OWASP Top 10)

1. **SQL Injection**:
   - Wajib menggunakan parameterized queries (`$1, $2, ...`) pada setiap pemanggilan query PostgreSQL via library `pg`.
   - Dilarang keras melakukan string concatenation `query('SELECT * FROM users WHERE id = ' + id)`.
2. **IDOR (Insecure Direct Object References)**:
   - Saat pembeli mengakses detail pesanan, tiket komplain, atau profil beralamat, backend wajib memverifikasi bahwa `user_id` pemilik data cocok dengan `req.user.id` dari token JWT (kecuali role adalah `admin`).
3. **Rate Limiting & Anti-Bruteforce**:
   - Seluruh endpoint otentikasi (`/api/v1/auth/login`, `/api/v1/auth/register`) dan pencarian publik wajib diproteksi oleh middleware `rateLimiter` Express.
