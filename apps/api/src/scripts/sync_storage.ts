import 'dotenv/config';
import { syncCanonicalBouquetImagesToStorage } from '../services/storage.service.js';
import { pool } from '../config/database.js';

async function main() {
  console.log('🖼️  [Chenille Storage Sync] Memulai sinkronisasi gambar produk ke Supabase Storage CDN...');
  
  const hasKey = Boolean(
    (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('xxxx')) ||
    (process.env.SUPABASE_ANON_KEY && !process.env.SUPABASE_ANON_KEY.includes('xxxx'))
  );

  if (!hasKey) {
    console.log(`
⚠️  [Perhatian: API Key Supabase Storage Masih Berupa Placeholder]
Untuk mengunggah gambar ke Supabase Storage S3 Bucket (product-images):
1. Buka Supabase Dashboard Anda: https://supabase.com/dashboard/project/wpdfxuwhqwvglqoiubfq/settings/api
2. Salin "anon public" key atau "service_role" key.
3. Tempelkan ke berkas .env pada root atau apps/api/.env:
   SUPABASE_ANON_KEY="eyJhbGci..."
4. Jalankan kembali perintah ini:
   npm run storage:sync --workspace=@chenille/api
`);
  }

  const result = await syncCanonicalBouquetImagesToStorage();
  console.log('----------------------------------------------------');
  console.log(`Status Storage Terkonfigurasi: ${result.isStorageConfigured ? '✅ Ya' : '❌ Tidak (Menggunakan Path Lokal)'}`);
  console.log(`Jumlah Gambar Berhasil Diunggah ke Supabase: ${result.syncedCount}`);
  console.log('Daftar URL Gambar Produk Terkini:');
  for (const [file, url] of Object.entries(result.urls)) {
    console.log(` - ${file}: ${url}`);
  }
  console.log('----------------------------------------------------');

  await pool.end();
}

main().catch(console.error);
