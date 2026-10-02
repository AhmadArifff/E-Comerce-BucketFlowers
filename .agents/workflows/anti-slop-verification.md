# Anti-Slop Verification Protocol: Mandatory Delivery Gate

Sebelum deliverable atau respon akhir diserahkan kepada pengguna, agen wajib memverifikasi ketiadaan cacat AI generik melalui laporan 4-blok:

---

## 4-Blok Mandatory Delivery Gate

### Blok 1: Hard Gate (Mutlak)
- [ ] **Bebas Em Dash `—` (R-02)**: Tidak ada penggunaan tanda sambung em dash pada judul, subtitle, tombol, atau pesan toast.
- [ ] **Bebas Horizontal Overflow Mobile (R-03)**: Tidak ada elemen yang bocor melebihi lebar layar pada viewport 375px (iPhone) dan 768px (iPad).
- [ ] **Data Riil Tanpa Fiktif (R-17 & R-18)**: Seluruh angka statistik, nama produk, testimoni, dan harga berasal langsung dari Supabase PostgreSQL.
- [ ] **Tanpa Tombol/Link Mati (R-26)**: Seluruh tombol interaktif memicu aksi nyata (buka modal, kirim API, salin teks, atau navigasi).
- [ ] **Kontras WCAG AA (R-25)**: Rasio kontras teks terhadap latar belakang $\ge$ 4.5:1 untuk teks normal dan $\ge$ 3:1 untuk teks tebal/besar.
- [ ] **Navigasi Keyboard (R-32)**: Elemen form dan modal dapat ditutup dengan tombol `Escape` dan dapat difokuskan dengan tombol `Tab`.

### Blok 2: Purpose-Gate
- [ ] Setiap efek visual (gradasi, bayangan, aksen glow, animasi transisi) memiliki alasan hierarki visual yang jelas untuk memandu mata pengguna, bukan sekadar dekorasi acak.

### Blok 3: Liveliness
- [ ] Komposisi desain bervariasi sesuai identitas brand florist Chenille Atelier. Terdapat elemen pembeda (aksen kelopak bunga, pita satin, confetti saat pesanan berhasil).

### Blok 4: Craftsmanship
- [ ] Desain berdaya tahan di semua state: *Loading Skeleton*, *Empty State*, *Data State*, dan *Error State*.
