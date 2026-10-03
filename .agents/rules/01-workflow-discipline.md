# 01-Workflow Discipline: OODA Loop & Separation of Duty

Dokumen ini mengatur tata tertib proses kerja seluruh agent guna mencegah bias kognitif dan fenomena **Echo-Chamber Hallucination**.

---

## 1. Siklus OODA (Observe -> Orient -> Decide -> Act)

Setiap tugas wajib melalui 4 fase berurutan:
1. **Observe (Pengamatan)**:
   - Baca file yang relevan (`view_file`), periksa skema database PostgreSQL, dan identifikasi seksi [PRD.md](../../PRD.md) yang terkait.
2. **Orient (Orientasi & Analisis)**:
   - Cek `established_constraints` pada `.agents/02-session-state/active-session.json`.
   - Cek apakah bug/solusi serupa sudah pernah tercatat di `.agents/04-case-bank/`.
3. **Decide (Keputusan & Rencana)**:
   - Buat rencana terstruktur (`implementation_plan.md`) sebelum menulis kode jika perubahan melibatkan lebih dari 1 file atau memengaruhi skema database.
4. **Act (Tindakan & Verifikasi)**:
   - Tulis kode menggunakan edit tools presisi (`replace_file_content` / `multi_replace_file_content`).
   - Uji kompilasi TypeScript (`npm run type-check`) dan lakukan tes HTTP/browser.

---

## 2. Separation of Duty (Pemisahan Peran Tegas: No Self-Review)

- **Builder** (`backend-engineer`, `frontend-engineer`) fokus mengeksekusi logika teknis, query database, dan antarmuka.
- **Reviewer** (`qa-engineer`, `tech-critic`) menguji kode secara independen dari kacamata pengujian tepi (*edge-case testing*), integritas data, dan heuristik UX.
- **Prinsip Dasar**: Builder tidak boleh menjadi penilai akhir atas kodenya sendiri. Pernyataan *"kode ini sudah saya cek dan tidak ada bug"* dari builder dianggap **tidak sah** sebelum diverifikasi oleh QA.

---

## 3. Circuit Breaker Pengerjaan Ulang (*Rework Circuit Breaker*)

- Jika suatu fitur atau perbaikan mengalami siklus revisi (Builder $\leftrightarrow$ Reviewer) sebanyak **$\ge$ 3 kali berturut-turut** karena gagal uji atau regresi:
  1. Hentikan eksekusi otomatis seketika (*circuit breaker tripped*).
  2. Buka peran `deadlock-fallback-resolver` untuk memetakan akar penyebab konflik.
  3. Alihkan ke `escalation-gate` untuk meminta klarifikasi atau keputusan desain langsung dari manusia (*Human-in-the-Loop*).
  4. Dilarang melakukan loop revisi tanpa akhir (*infinite looping*) yang menghabiskan token dan mengacaukan riwayat kode.

---

## 4. Single Door Policy & Human-in-the-Loop
- Pengguna hanya perlu memberikan instruksi secara alami tanpa perlu menyebutkan nama-nama agen internal.
- `triage-router` yang mendistribusikan pekerjaan ke sub-agen di balik layar.
- Segala aksi destruktif (menghapus tabel, mengubah skema produksi secara *breaking*, atau hard reset git) wajib meminta konfirmasi pengguna terlebih dahulu.

---

## 5. Protokol Pemisahan Dokumentasi: Fitur Baru vs Perbaikan Bug (*Clean PRD Policy*)

- **Fitur Baru (New Feature)**:
  - Wajib dicatat di `PRD.md` (spesifikasi fungsional, UI/UX, dan model bisnis baru).
  - Wajib dicatat di `.agents/knowledge/prd-index-map.md`, `AGENTS.md`, dan `.agents/02-session-state/active-session.json`.
- **Perbaikan Bug (Bug Fix / Technical Patch)**:
  - **HANYA dicatat di `.agents/`** (`.agents/04-case-bank/cases/`, `.agents/knowledge/bug-cases.md`, dan `active-session.json`).
  - **DILARANG KERAS** menambahkan log penanganan bug teknis atau patching ke dalam `PRD.md` agar `PRD.md` tetap bersih, ramping, dan terstruktur sebagai dokumen produk arsitektural.

---

## 6. Siklus Pengerjaan & Auto-Push GitHub Khusus Proyek Ini (*Autonomous Delivery Protocol*)

> ⚠️ **CATATAN RUANG LINGKUP**: Aturan auto-push ini **HANYA BERLAKU UNTUK PROYEK `E-Comerce-BucketFlowers` INI SAJA**, dan **TIDAK** berlaku untuk proyek-proyek lainnya kecuali jika secara eksplisit diminta oleh pengguna.

Setiap pengerjaan teknis pada proyek ini wajib mengikuti 5 tahap teratur:
0. **Tahap 0: Sinkronisasi Awal Lintas Perangkat (Pre-Development Pull-Rebase)**:
   - Sebelum menganalisis tugas atau menulis rencana, jalankan `git pull --rebase origin main` untuk mengunduh perubahan dari commit rekan tim di perangkat lain.
   - Cek `git log -n 5 --oneline` untuk memverifikasi riwayat commit terkini.
1. **Tahap 1: Review Pra-Pengembangan (Pre-Implementation Plan)**:
   - Agen menganalisis kebutuhan tugas, memvalidasi terhadap PRD dan rules, serta menyusun rencana terstruktur (`implementation_plan.md`).
2. **Tahap 2: Persetujuan Pengguna (User Approval)**:
   - Agen menyajikan rencana kepada pengguna dan menunggu persetujuan (*approval*). Dilarang menulis kode mutasi besar sebelum disetujui.
3. **Tahap 3: Eksekusi Pengembangan & Verifikasi Kualitas**:
   - Builder menulis kode.
   - Reviewer menguji: wajib 0 error kompilasi TypeScript (`npm run type-check`) dan lolos tes fungsional / HTTP endpoint.
4. **Tahap 4: Otomatis Commit, Pull-Rebase, Resolusi Konflik & Push ke GitHub**:
   - **4.1. Commit Lokal**: Stage perubahan (`git add .`) dan buat commit lokal terstruktur (`feat: ...`, `fix: ...`, `docs: ...`).
   - **4.2. Tarik Remote Terbaru (Pull-Rebase)**: Jalankan `git pull --rebase origin main` untuk menyelaraskan commit lokal di atas commit remote terbaru sebelum melakukan push.
   - **4.3. Resolusi Konflik Cerdas & Re-Verifikasi**:
     - Jika terdeteksi konflik merge/rebase: Agen langsung mengidentifikasi file terdampak, membedah marker `<<<<<<< HEAD`, `=======`, `>>>>>>>`, dan menyelesaikannya secara teliti tanpa menghilangkan logika yang sah dari kedua sisi.
     - Lanjutkan rebase (`git add .` dan `git rebase --continue`).
     - Jalankan ulang `npm run type-check` dan tes fungsional untuk memastikan hasil resolusi konflik 100% bebas dari regresi.
   - **4.4. Push Bersih ke Origin**: Eksekusi `git push origin main`. Pastikan working tree bersih.
   - Pengguna tidak perlu lagi meminta push manual secara terpisah.

---

## 7. Arsitektur Hub-and-Spoke Sinkronisasi Pengetahuan dengan Induk `agentic AI`

- **Induk (`..\agentic AI`)**: Pusat pengetahuan master.
- **Anak (`E-Comerce-BucketFlowers`)**: Mengadopsi default dari induk, lalu menyesuaikannya (*customization*) dengan konteks lokal.
- **Sinkronisasi Balik**: Setiap kali child project menyelesaikan bug penting (di `04-case-bank/cases/`) atau melahirkan workflow baru yang bermanfaat universal, artefak tersebut disinkronkan kembali ke `.agents` induk `agentic AI`.
- **Tujuan**: Induk `agentic AI` terus bertambah pintar seiring waktu. Saat proyek baru dibuat di masa depan, proyek tersebut langsung mengadopsi induk yang telah belajar dari seluruh pengalaman proyek-proyek sebelumnya!
