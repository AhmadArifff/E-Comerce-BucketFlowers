import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
