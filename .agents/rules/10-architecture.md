# 10-Architecture: Monorepo Standards & Design Patterns

Dokumen ini mendefinisikan arsitektur teknis monorepo dan pola desain standar proyek E-Commerce Bucket Flowers Chenille Atelier.

---

## 1. Arsitektur Monorepo Workspaces

```
E-Comerce-BucketFlowers/
├── apps/
│   ├── web/                     # Next.js 14 App Router (Storefront & Admin Dashboard)
│   └── api/                     # Node.js + Express REST API Server (Port 4000)
├── packages/
│   └── shared/                  # Canonical Types, Interfaces, Enums (@chenille/shared)
├── package.json                 # Monorepo root workspaces config
└── tsconfig.base.json           # Shared TypeScript compiler options
```

---

## 2. Pola Desain Backend (`apps/api`)

1. **Guard Clause & Early Return**:
   - Validasi parameter di baris paling awal fungsi.
   - Hindari nested if-else yang dalam (*arrow antipattern*).
   ```ts
   if (!id) {
     return res.status(400).json({ success: false, error: 'ID produk wajib diisi.' });
   }
   ```
2. **Result Pattern**:
   - Setiap endpoint REST API Express wajib mengembalikan struktur JSON konsisten:
   ```ts
   // Sukses:
   { success: true, data: result, message?: string }

   // Gagal:
   { success: false, error: 'Pesan kesalahan human-readable.' }
   ```
3. **Database Transaction Safety**:
   - Seluruh mutasi yang memengaruhi lebih dari 1 tabel (misalnya pesanan + pengurangan stok, atau penerimaan restock PO + penambahan stok bahan baku) **WAJIB** dibungkus transaksi `BEGIN ... COMMIT` dengan blok `ROLLBACK` pada klausul `catch`.

---

## 3. Pola Desain Frontend (`apps/web`)

1. **Single Source of API Configuration**:
   - Seluruh panggilan HTTP wajib menggunakan helper `getApiUrl(endpoint)` dari `@/lib/api-client`.
   - Dilarang keras menulis hardcoded string `http://localhost:4000` di dalam komponen React.
2. **State Management Berbasis Zustand**:
   - `useCartStore`: Menyimpan keranjang belanja & kustomisasi buket.
   - `useAuthStore`: Menyimpan sesi token login pelanggan & profil.
   - `useThemeStore`: Menyimpan preferensi tema (Tema A, B, C) dengan sinkronisasi local storage.
   - `useOrderStore`: Menyimpan state pesanan admin secara reaktif.
   - `useSettingsStore`: Menyimpan konfigurasi studio, gateway pembayaran, logistik, kupon, dan master inventori.
3. **Client vs Server Components**:
   - Gunakan `'use client';` hanya pada komponen yang membutuhkan hooks React (`useState`, `useEffect`, `useRouter`, Zustand).
   - Pastikan hydration safety (`mounted` check) saat membaca state lokal/storage agar tidak terjadi hydration mismatch warning.
