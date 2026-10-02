# Task Review Protocol: 7 Pilar Evaluasi Pra-Pengembangan

Sebelum agen menulis baris kode pertama untuk fitur atau perbaikan apa pun, agen wajib melakukan evaluasi terstruktur berdasarkan 7 pilar berikut:

---

## 7 Pilar Evaluasi

1. **Scope & PRD Alignment**:
   - Seksi [PRD.md](../../PRD.md) mana yang menjadi dasar kebutuhan ini?
   - Apakah ada potensi *scope creep* yang melenceng dari spesifikasi PRD?
2. **Schema & Database Impact**:
   - Apakah perubahan ini memerlukan penambahan kolom atau tabel baru di Supabase PostgreSQL?
   - Apakah kolom baru nullable atau memiliki nilai default yang aman untuk data lama?
3. **Security & RBAC Impact**:
   - Apakah endpoint baru dapat diakses oleh publik (guest) atau membutuhkan otentikasi role `admin` / `customer`?
   - Apakah query rentan terhadap IDOR atau SQL Injection?
4. **Performance & Latency**:
   - Apakah query database menggunakan indeks yang sesuai?
   - Apakah respon payload dibatasi (`LIMIT`, pagination) agar tidak menyebabkan overhead memori?
5. **UI & Accessibility Impact**:
   - Apakah perubahan antarmuka mematuhi rasio kontras WCAG AA $\ge$ 4.5:1?
   - Apakah elemen interaktif dapat diakses via keyboard (Tab / Enter / Space)?
6. **Edge Cases & Failure Modes**:
   - Apa yang terjadi jika koneksi Supabase terputus?
   - Bagaimana tampilan UI jika data kosong (`[]`)?
7. **Rollback & Safety Plan**:
   - Jika perubahan menyebabkan regresi, bagaimana strategi memulihkan kode atau database ke kondisi stabil?

---

## Checklist Output

Hasil review 7 pilar ini wajib tercermin secara singkat pada artefak `implementation_plan.md` sebelum eksekusi teknis dimulai.
