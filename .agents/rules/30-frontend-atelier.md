# 30-Frontend Atelier: UI/UX Pro Max, Themes & Motion Standards

Dokumen ini mendefinisikan standar visual, interaksi, dan aksesibilitas untuk antarmuka pembeli (*Storefront*) dan panel pengelola (*Admin Dashboard*).

---

## 1. Tri-Tema Estetika Toko Bunga (PRD Seksi 24)

Aplikasi memiliki 3 tema estetika yang dapat dipilih pengguna secara instan melalui switch tema:
1. **Tema A: Romantic Velvet Floral (Default)**:
   - Warna Primer: Rose Soft Pink (`#F43F5E`, `#FB7185`, `#FFF1F2`).
   - Suasana: Romantis, manis, lembut, hangat, ideal untuk buket wisuda & hadiah kekasih.
2. **Tema B: Fresh Garden Botanical**:
   - Warna Primer: Matcha Sage Green (`#10B981`, `#059669`, `#ECFDF5`).
   - Suasana: Alami, segar, menenangkan, modern estetik ala cafe Korea.
3. **Tema C: Midnight Luxury Elegance**:
   - Warna Primer: Midnight Maroon / Gold (`#881337`, `#BE123C`, `#FFFBEB`).
   - Suasana: Mewah, berkelas, premium, eksklusif untuk perayaan wisuda terhormat.

Setiap komponen yang menampilkan aksen visual wajib membaca state dari `useThemeStore()` dan utilitas `getThemeCopy(theme)` untuk konsistensi microcopy & warna.

---

## 2. Standar Anti-Slop Visual & UI (R-01 s.d R-38)

1. **Bebas Em Dash `—`**: Dilarang keras menggunakan tanda sambung em dash `—` pada judul, tombol, atau teks promosi (Gunakan titik dua `:`, tanda hubung pendek `-`, atau tanda kurung).
2. **Zero Horizontal Overflow Mobile**:
   - Seluruh kontainer wajib responsif. Gunakan `max-w-full`, `overflow-x-hidden`, dan wrapping pada tag/badge.
   - Tabel administrasi wajib dibungkus `<div className="overflow-x-auto">` dengan padding aman.
3. **Tap Target Ramah Jari**: Seluruh tombol, link, dan opsi pilihan wajib memiliki tinggi minimal 44px di tampilan mobile.
4. **Kontras Rasio WCAG AA**:
   - Teks normal wajib memiliki rasio kontras $\ge$ 4.5:1 terhadap background.
   - Teks besar/bold wajib memiliki rasio kontras $\ge$ 3:1.
   - Dilarang menempatkan teks abu-abu terang di atas background putih.

---

## 3. Micro-Animations & Magic Motion

1. **Fly to Cart Animation**: Saat produk atau buket kustom ditambahkan ke keranjang, picu animasi parabola terbang menuju ikon keranjang belanja menggunakan `flyToCart(originElement, targetElement)`.
2. **Magic Toast**: Notifikasi pop-up harus menggunakan `showMagicToast(title, description, icon)` yang ramah dan bersahabat.
3. **Modal Transitions**: Modal checkout, preview resep BOM, dan dialog konfirmasi wajib memiliki animasi spring fade-in dan backdrop blur (`backdrop-blur-sm`).
