# Protokol Kolaborasi Multi-Perangkat & Multi-Developer (.agents Knowledge)

> **Panduan Mutlak Pengembangan Lintas Device**: Dokumen ini mengatur tata cara kerja ketika proyek dikembangkan oleh beberapa developer atau agen AI dari perangkat yang berbeda (laptop, PC kantor, cloud environment) agar tidak terjadi konflik commit (*merge conflict*), penimpaan kode (*overwriting*), atau hilangnya konteks pekerjaan.

---

## 1. Aturan Emas: Wajib `git pull --rebase` Sebelum Memulai Pengerjaan

Setiap kali seorang developer atau agen AI memulai sesi baru atau berpindah ke perangkat lain, **Langkah Pertama yang WAJIB Dijalankan Sebelum Menulis Kode Apapun** adalah:

```bash
git pull --rebase origin main
```

### Mengapa Ini Wajib?
1. **Melihat Perubahan dari Developer/Device Lain**:
   - Developer lain mungkin telah melakukan commit perbaikan bug, update data, atau penambahan fitur baru di `origin/main`.
   - Mengambil commit terbaru terlebih dahulu mencegah Anda bekerja di atas basis kode yang basi (*stale code*).
2. **Menjaga Riwayat Git Tetap Bersih & Lurus (*Linear History*)**:
   - Penggunaan flag `--rebase` memastikan commit lokal baru Anda akan diletakkan di puncak riwayat (*top of branch*), sehingga tidak menghasilkan commit merge yang berantakan (`Merge branch 'main' of ...`).
3. **Inspeksi Commit Terkini**:
   - Setelah menjalankan pull, cek ringkasan commit terbaru menggunakan:
     ```bash
     git log -n 5 --oneline
     ```
   - Baca pesan commit untuk memahami apa yang baru saja diselesaikan oleh rekan tim.

---

## 2. Peta Memori Proyek: Membaca State dari `.agents`

Agar developer di perangkat lain tidak perlu bingung mencari tahu status proyek:
1. **Buka `.agents/02-session-state/active-session.json`**:
   - Cek `completed_milestones` untuk melihat fitur yang sudah selesai dan terverifikasi.
   - Cek `established_constraints` untuk melihat aturan arsitektural yang sudah dikunci (misal: Zero-Dummy Policy, Anti-Slop Copywriting, Enum Casting).
2. **Buka `.agents/knowledge/recommendations-roadmap.md`**:
   - Di sini tersimpan 5 prioritas pengembangan lanjutan yang siap dieksekusi secara berurutan:
     1. Form Ulasan Bintang & Foto Pembeli Pasca-Pesanan Selesai (`product_reviews`)
     2. Otomasi Pengingat Momen Spesial WhatsApp H-7 (Cron Scheduler)
     3. Pemotongan Bahan Baku Otomatis Resep BOM saat Perakitan Dimulai
     4. Peningkatan Konversi (Direct WA Order & Social Proof Badges)
     5. Optimasi Mobile & Error Boundary
3. **Buka `AGENTS.md`**:
   - Mengacu pada 42 Seksi PRD Fast-Index dan 4-tier peran agent.

---

## 3. Resolusi Konflik Cerdas (Jika Terjadi Konflik Git)

Jika saat melakukan `git pull --rebase origin main` terdeteksi adanya konflik:
1. **Deteksi Berkas Terdampak**:
   - Git akan memberitahu berkas mana yang mengalami konflik (`CONFLICT (content): Merge conflict in ...`).
2. **Pembedahan Marker Git**:
   - Buka berkas yang konflik dan periksa penanda:
     ```text
     <<<<<<< HEAD
     Kode dari remote / commit sebelumnya
     =======
     Kode dari perubahan lokal Anda
     >>>>>>> commit-hash
     ```
3. **Penggabungan Bijak**:
   - Gabungkan logika bisnis yang sah dari kedua belah pihak. Jangan menghapus perbaikan yang baru saja ditambahkan oleh developer lain tanpa alasan yang jelas.
4. **Verifikasi Kompilasi**:
   - Jalankan pemeriksaan tipe:
     ```bash
     npm run type-check
     ```
   - Pastikan **0 error**.
5. **Lanjutkan Rebase**:
   ```bash
   git add .
   git rebase --continue
   ```

---

## 4. Siklus Pengerjaan Lengkap Setiap Sesi (Checklist Developer)

```text
[Langkah 0]  git pull --rebase origin main  (Ambil perubahan developer lain)
     │
     ▼
[Langkah 1]  Baca .agents/02-session-state/active-session.json & roadmap
     │
     ▼
[Langkah 2]  Buat rencana pengerjaan (implementation_plan.md) jika task besar
     │
     ▼
[Langkah 3]  Tulis kode (Builder) & Verifikasi QA (npm run type-check: 0 error)
     │
     ▼
[Langkah 4]  git add . && git commit -m "feat/fix/docs: ..."
     │
     ▼
[Langkah 5]  git pull --rebase origin main (Sinkronisasi akhir sebelum push)
     │
     ▼
[Langkah 6]  git push origin main (Push bersih ke remote repository)
```

Dengan mematuhi protokol ini di seluruh perangkat, pengembangan aplikasi Chenille Atelier Florist akan selalu sinkron, bebas konflik, dan memiliki dokumentasi yang terjaga rapi!
