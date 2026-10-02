# 00-Core Guardrails: Zero-Tolerance Policies

Dokumen ini mendefinisikan aturan mutlak yang tidak boleh dilanggar oleh peran AI mana pun di dalam proyek **E-Commerce Bucket Flowers Chenille Atelier**.

---

## 1. Zero-Dummy Policy
- **Larangan Keras**: Dilarang menggunakan mock data, hardcoded array palsu, placeholder data fiktif (seperti `const orders = [...]` atau nama pelanggan bohong), kecuali jika secara eksplisit pengguna memintanya untuk unit testing terisolasi.
- **Kondisi Data Kosong**: Jika database mengembalikan array kosong `[]`, UI wajib merender komponen **Empty State** yang informatif dan elegan dengan ajakan bertindak (CTA), bukan menampilkan data tiruan.
- **Single Source of Truth**: Seluruh data dinamis (produk, stok, pesanan, bahan baku HPP, opsi studio kustom, kupon, ulasan, komplain) wajib dibaca dan disimpan ke Supabase PostgreSQL.

---

## 2. Monorepo Path Guarantee (Anti-Root Hallucination)
Proyek ini mengadopsi monorepo npm workspaces:
- **Frontend Web App**: `apps/web/src/`
  - Halaman & Routing: `apps/web/src/app/`
  - Komponen: `apps/web/src/components/`
  - State Stores: `apps/web/src/stores/`
  - Utilitas & Helper: `apps/web/src/lib/`
- **Backend API**: `apps/api/src/`
  - Routing: `apps/api/src/routes/`
  - Database & Pool: `apps/api/src/config/database.ts`
  - Middleware: `apps/api/src/middleware/`
- **Shared Package**: `packages/shared/src/`
  - Model, Interface, Enum: `packages/shared/src/types/`
- **LARANGAN**: Dilarang membuat folder baru seperti `/models`, `/backend`, `/frontend`, `/server` di root repository.

---

## 3. Strict 0 TypeScript Compile Errors
- Setiap perubahan kode wajib melewati validasi kompilasi `npm run type-check`.
- Seluruh 3 package (`@chenille/shared`, `@chenille/api`, `chenille-flowers-web`) wajib lulus 100% tanpa error (`TS2322`, `TS2339`, `TS7006`).
- Dilarang membungkam type checker dengan `// @ts-ignore` atau casting serampangan `as any` jika ada tipe yang dapat didefinisikan secara presisi.

---

## 4. Zero-Residual Scratch Rule
- Semua file pengujian sementara, skrip diagnosa database, atau helper scratch wajib diletakkan di `.gemini/antigravity-ide/brain/.../scratch/`.
- Dilarang meninggalkan file scratch atau script uji coba sementara di folder root atau git tracked folders.

---

## 5. Secret & Credential Isolation
- Kredensial sensitif (`SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `JWT_SECRET`, `MIDTRANS_SERVER_KEY`, `BITESHIP_API_KEY`) hanya boleh dibaca dari file `.env`.
- Dilarang keras menaruh string kredensial secara *hardcoded* di dalam source code commit git.
