import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wpdfxuwhqwvglqoiubfq.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const DEFAULT_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';

const isPlaceholderKey = !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('xxxx');

const supabase = !isPlaceholderKey
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Local fallback uploads directory: apps/web/public/images/uploads
const localUploadsDir = path.resolve(__dirname, '../../../../apps/web/public/images/uploads');

function ensureLocalDirExists() {
  if (!fs.existsSync(localUploadsDir)) {
    try {
      fs.mkdirSync(localUploadsDir, { recursive: true });
    } catch (e) {
      console.warn('Could not create local upload dir:', e);
    }
  }
}

export interface UploadResult {
  url: string;
  filename: string;
  storageProvider: 'supabase' | 'local';
}

/**
 * Upload buffer to Supabase Storage, with graceful fallback to local public folder
 */
export async function uploadProductImage(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  productSlug = 'bouquet',
  bucket = DEFAULT_BUCKET
): Promise<UploadResult> {
  const ext = path.extname(originalName) || '.webp';
  const cleanSlug = productSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const filename = `${cleanSlug}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}${ext}`;

  // 1. Try Supabase Storage if configured
  if (supabase) {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filename, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filename);
        return {
          url: publicUrlData.publicUrl,
          filename,
          storageProvider: 'supabase',
        };
      } else {
        console.warn('Supabase storage upload error, falling back to local file:', error?.message);
      }
    } catch (uploadErr) {
      console.warn('Supabase storage network failure, falling back to local storage:', uploadErr);
    }
  }

  // 2. Local Fallback in apps/web/public/images/uploads/
  ensureLocalDirExists();
  const targetFilePath = path.join(localUploadsDir, filename);
  fs.writeFileSync(targetFilePath, fileBuffer);

  return {
    url: `/images/uploads/${filename}`,
    filename,
    storageProvider: 'local',
  };
}

/**
 * Delete image from Supabase Storage or local folder
 */
export async function deleteProductImage(filename: string, bucket = DEFAULT_BUCKET): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.storage.from(bucket).remove([filename]);
    } catch (e) {
      console.warn('Supabase image removal error:', e);
    }
  }

  // Also remove local file if present
  try {
    const localPath = path.join(localUploadsDir, filename);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  } catch (e) {
    // Ignore error
  }

  return true;
}

/**
 * Sync all 8 canonical bouquet images from apps/web/public/images/products to Supabase Storage
 */
export async function syncCanonicalBouquetImagesToStorage(): Promise<{
  syncedCount: number;
  urls: Record<string, string>;
  isStorageConfigured: boolean;
}> {
  const productsDir = path.resolve(__dirname, '../../../../apps/web/public/images/products');
  const urls: Record<string, string> = {};
  let syncedCount = 0;

  if (!fs.existsSync(productsDir)) {
    return { syncedCount: 0, urls, isStorageConfigured: Boolean(supabase) };
  }

  const files = fs
    .readdirSync(productsDir)
    .filter((f) => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'));

  for (const file of files) {
    const filePath = path.join(productsDir, file);
    const fileBuffer = fs.readFileSync(filePath);

    // If Supabase is configured and not placeholder key
    if (supabase) {
      try {
        const { data, error } = await supabase.storage.from(DEFAULT_BUCKET).upload(file, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

        if (!error && data) {
          const { data: pubData } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(file);
          urls[file] = pubData.publicUrl;
          syncedCount++;

          // Auto-sync database image_url to Supabase CDN URL
          try {
            const baseSlug = file.replace(/\.(jpg|png|webp)$/i, '');
            await pool.query(
              `UPDATE products SET image_url = $1, updated_at = NOW() WHERE image_url LIKE $2 OR slug = $3`,
              [pubData.publicUrl, `%${file}%`, baseSlug]
            );
          } catch (dbErr) {
            console.warn(`Could not update database image_url for ${file}:`, dbErr);
          }

          continue;
        }
      } catch (e) {
        console.warn(`Could not upload ${file} to Supabase storage:`, e);
      }
    }

    // Fallback to local path
    urls[file] = `/images/products/${file}`;
  }

  return {
    syncedCount,
    urls,
    isStorageConfigured: Boolean(supabase),
  };
}
