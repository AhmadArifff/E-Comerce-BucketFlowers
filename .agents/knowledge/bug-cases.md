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
