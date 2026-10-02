# 20-Database Supabase: PostgreSQL Conventions & Rules

Dokumen ini mendefinisikan standar manajemen basis data Supabase PostgreSQL (42 tabel aktif) untuk proyek E-Commerce Bucket Flowers.

---

## 1. 42 Tabel PostgreSQL Kanonikal

1. `products`: Katalog buket bunga kawat bulu (harga, diskon, stok, lead time PO, click counter, rating).
2. `product_images`: Galeri multi-foto per produk (is_primary, sort_order).
3. `categories`: Kategori buket (Bouquet Wisuda, Single Flower, Mini Pot, Flower Box).
4. `custom_studio_options`: 25 opsi kustomisasi (7 kategori: flower, color, wrapping, ribbon, box, seal, addon).
5. `saved_custom_designs`: Desain buket rakitan pelanggan.
6. `bill_of_materials`: Resep komposisi bahan buket (relasi `product_id` ke `raw_material_id`, qty, subtotal).
7. `raw_materials`: Inventori bahan mentah studio (kawat bulu, kertas wrapping, pita, boneka, floral foam).
8. `procurement_orders`: Pesanan restock supplier grosir, status ETA, dan penambahan stok atomik.
9. `waste_material_logs`: Catatan bahan baku rusak / afkir / spoilage gudang.
10. `supplier_directories`: Kontak & katalog supplier grosir bahan florist.
11. `orders`: Pesanan masuk (invoice, customer, total, status pesanan, status pembayaran, shipping).
12. `order_items`: Rincian item produk atau custom buket per pesanan.
13. `order_status_histories`: Timeline jejak status florist (CREATED, CRAFTING, QUALITY_CHECK, READY, COMPLETED).
14. `shipping_orders`: Rincian resi & ongkir kurir Biteship / kurir toko.
15. `cod_meetup_points`: 6 titik temu COD area Margonda Depok & kampus (UI, Gunadarma, PNJ).
16. `payment_transactions`: Log transaksi pembayaran (Midtrans, Transfer BCA, COD).
17. `payment_gateway_configs`: Konfigurasi on/off & kredensial Midtrans, BCA, COD.
18. `users`: Akun pengguna (email, password hash, role).
19. `profiles`: Profil member (nama, nomor telepon, alamat, poin bunga).
20. `user_addresses`: Buku alamat tersimpan pelanggan.
21. `user_stamp_cards`: Gamifikasi kartu stempel belanja (loyalty reward).
22. `flower_point_transactions`: Riwayat perolehan & penukaran poin bunga member.
23. `user_attendance_logs`: Log absensi check-in harian aplikasi member.
24. `user_event_logs`: Catatan aktivitas event interaksi pengguna.
25. `customer_complaints`: Tiket pengaduan & klaim pelanggan dengan lampiran foto.
26. `warranty_claims`: Klaim garansi 100% anti-patah 24 jam setelah pesanan diterima.
27. `customer_occasions`: Pengingat momen spesial pelanggan (ulang tahun, wisuda, anniversary).
28. `reviews` & `product_reviews`: Ulasan ulasan bintang 1-5 dan testimoni foto asli pembeli.
29. `chat_sessions`: Sesi percakapan live chat pembeli dengan florist.
30. `chat_messages`: Isi pesan live chat teks & gambar.
31. `canned_responses`: Template balasan cepat pesan live chat.
32. `coupons`: Voucher diskon nominal, persentase, dan gratis ongkir.
33. `campaign_settings`: Pengaturan promo banner hero & pop-up diskon.
34. `store_settings`: Profil toko, nomor WhatsApp, kuota pesanan harian, dan maintenance mode.
35. `logistics_configs`: Pengaturan kurir aktif, origin address, dan API key Biteship.
36. `notification_configs`: Konfigurasi pengiriman notifikasi WhatsApp gateway.
37. `notification_logs`: Riwayat pesan WhatsApp yang terkirim ke pelanggan.
38. `feature_toggles`: Fitur on/off modul studio tanpa deploy ulang.
39. `admin_audit_logs`: Rekam jejak aktivitas mutasi data oleh admin.
40. `session_audit_logs`: Log login & token session admin/pengguna.
41. `search_keyword_logs`: Log kata kunci pencarian pelanggan untuk riset tren.
42. `migration_history`: Riwayat eksekusi migrasi skema database.

---

## 2. Aturan Query & Pengetikan Enum PostgreSQL

1. **Parameter Casting Enum**:
   - Jika kolom database menggunakan tipe enum (misal `procurement_status`, `raw_category`, `waste_reason`), gunakan casting eksplisit di query PostgreSQL parameterized:
   ```sql
   UPDATE procurement_orders 
   SET status = $1::procurement_status, 
       is_stock_added = $2, 
       actual_arrival = CASE WHEN $1::text = 'ARRIVED' THEN NOW() ELSE actual_arrival END
   WHERE id = $3;
   ```
   - Hindari error `inconsistent types deduced for parameter $1`.
2. **Kalkulasi Numerik & Subtotal**:
   - Gunakan tipe `NUMERIC` untuk mata uang Rupiah dan subtotal agar tidak terjadi pembulatan floating-point (*precision loss*).
   - Cast ke `::float` saat `SELECT` jika payload dikonsumsi sebagai number di JavaScript JSON.
3. **Pemberlakuan Row Level Security (RLS)**:
   - Seluruh 42 tabel wajib memiliki `ENABLE ROW LEVEL SECURITY`.
   - Backend Express terhubung menggunakan connection pool PostgreSQL pooler yang memiliki kredensial resmi.
