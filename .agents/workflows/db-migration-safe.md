# Safe Database Migration Workflow: Modifikasi Skema Produksi

Panduan aman untuk melakukan penambahan kolom atau modifikasi skema pada basis data produksi Supabase PostgreSQL tanpa downtime atau kehilangan data (*backward compatible*).

---

## 4 Aturan Migrasi Aman

1. **Never Drop Column Directly**:
   - Dilarang menjalankan `ALTER TABLE ... DROP COLUMN` sebelum kode yang mengakses kolom tersebut sudah dipastikan tidak ada di frontend maupun backend.
2. **Always Nullable or Has Safe Default**:
   - Saat menambahkan kolom baru (`ALTER TABLE ... ADD COLUMN`), kolom **WAJIB** `NULLABLE` atau memiliki nilai `DEFAULT` yang valid (misal `DEFAULT false` untuk boolean, `DEFAULT 0` untuk angka, atau `DEFAULT NOW()` untuk timestamp).
   - Menambahkan kolom `NOT NULL` tanpa `DEFAULT` pada tabel berisi data akan menyebabkan eksekusi migrasi gagal dan aplikasi error (*crash*).
3. **Enum Extension Safety**:
   - Untuk menambahkan nilai enum baru di PostgreSQL:
     ```sql
     ALTER TYPE nama_enum ADD VALUE IF NOT EXISTS 'NILAI_BARU';
     ```
4. **Audit Foreign Key Constraints**:
   - Pastikan relasi foreign key memiliki action yang tepat (`ON DELETE CASCADE` untuk data turunan item, atau `ON DELETE RESTRICT` untuk master bahan baku).
