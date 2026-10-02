# 50-Excel & Financial Reports Standards (PRD Seksi 5 & 25)

Dokumen ini mendefinisikan standar teknis ekspor laporan spreadsheet Excel (.xlsx) dan CSV pada sistem E-Commerce Bucket Flowers.

---

## 1. Kompatibilitas Excel & Encoding Standar UTF-8 BOM

- Setiap ekspor file CSV yang dihasilkan oleh browser **WAJIB** menyertakan Byte Order Mark UTF-8:
  ```ts
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  ```
- **Rasional**: Tanpa byte `\uFEFF`, Microsoft Excel di Windows akan membuka berkas dengan encoding ANSI, yang menyebabkan karakter Rupiah (Rp), aksen, dan teks khusus menjadi rusak (*mojibake*).

---

## 2. Struktur Kolom Laporan Penjualan Kanonikal

Sesuai spesifikasi [PRD.md Seksi 5](../../PRD.md) & [GUIDE.md TC-ADM-18](../../GUIDE.md), urutan kolom laporan pesanan:
1. `NO INVOICE` (contoh: `INV-20260901-001`)
2. `TANGGAL PEMESANAN` (format: `YYYY-MM-DD HH:mm`)
3. `NAMA PELANGGAN`
4. `NO TELEPON / WA`
5. `DETAIL BUKET BUNGA` (deskripsi item + kuantitas)
6. `METODE PENGIRIMAN` (J&T Express, SiCepat, atau COD Margonda)
7. `STATUS PEMBAYARAN` (LUNAS / MENUNGGU_VERIFIKASI)
8. `HPP BAHAN MENTAH (RP)` (dihitung dari akumulasi resep `bill_of_materials`)
9. `HARGA JUAL (RP)` (total harga jual buket)
10. `LABA KOTOR (RP)` (`HARGA JUAL` - `HPP`)
11. `MARGIN (%)` (persentase margin keuntungan: `(LABA KOTOR / HARGA JUAL) * 100`)
12. `STATUS PENGERJAAN FLORIST` (SELESAI / PROSES_CRAFTING)

---

## 3. Rumus Finansial Dashboard Akuntansi

1. **Omset Kotor (Gross Revenue)**: Total nilai pesanan dengan status pembayaran `PAID` / `SETTLED`.
2. **Total HPP Bahan Baku**: Akumulasi biaya modal kawat bulu, wrapping, pita, boneka, dan lem tembak yang terpakai pada pesanan lunas.
3. **Laba Bersih Toko**: `Omset Kotor - Total HPP Bahan Baku - Biaya Operasional / Kerugian Scrap Bahan Afkir`.
