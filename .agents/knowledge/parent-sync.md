# Knowledge: Hub-and-Spoke Knowledge Sync Protocol

Dokumen ini mendefinisikan protokol sinkronisasi pengetahuan antara **`.agents` Induk (Master)** dan **`.agents` Anak (Child Projects)**.

---

## 1. Arsitektur Hub-and-Spoke

- **Pusat / Induk (`Master Hub`)**:
  - Path Lokal: `C:\Users\ASUS\Documents\Web Dev\improving\agentic AI`
  - Peran: Single Source of Truth arsitektur agen, template peran (`01-roles/`), aturan dasar (`rules/`), pipeline (`03-pipelines/`), dan katalog skill ekosistem.
- **Cabang / Anak (`Child Spoke`)**:
  - Proyek Saat Ini: `c:\Users\ASUS\Documents\Web Dev\improving\E-Comerce-BucketFlowers`
  - Peran: Implementasi nyata berbasis spesifikasi bisnis lokal (PRD buket bunga kawat bulu, tema atelier, dll).

---

## 2. Arah Aliran Pengetahuan (Two-Way Flow)

### A. Downstream (Induk -> Anak / Saat Setup Proyek Baru)
Ketika proyek baru dibuat:
1. Proyek baru menyalin arsitektur dasar dari `agentic AI`:
   - Template peran 4-tier & persona ahli.
   - Aturan mutlak OODA loop, No Self-Review, dan Anti-Slop Delivery Gate.
   - Script session manager dan format case-bank.
2. Proyek baru melakukan kustomisasi lokal sesuai PRD dan stack teknologi spesifik proyek.

### B. Upstream (Anak -> Induk / Saat Solusi Baru Terverifikasi)
Ketika proyek anak menemukan solusi bug yang krusial atau pola kode baru yang elegan:
1. Kasus dicatat di `.agents/04-case-bank/cases/` anak dengan status `VERIFIED`.
2. Pola solusi umum (non-spesifik kredensial) disinkronkan kembali ke `..\agentic AI\04-case-bank\cases\`.
3. Induk mendaftarkan kasus tersebut ke `..\agentic AI\04-case-bank\index.json` dan `..\agentic AI\knowledge\bug-cases.md`.

---

## 3. Manfaat untuk Proyek Baru di Masa Depan
Setiap pelajaran mahal (misal: penanganan parameter casting enum PostgreSQL, kompatibilitas UTF-8 BOM pada Excel, deteksi layout shift mobile) yang telah diselesaikan di proyek anak akan tersimpan permanen di induk.

Saat Anda membuat proyek baru ke-2, ke-3, dan seterusnya:
- Agen pada proyek baru langsung mewarisi seluruh database preseden dari `agentic AI`.
- Agen tidak akan pernah mengulangi bug yang sama yang pernah terjadi di proyek-proyek sebelumnya!
