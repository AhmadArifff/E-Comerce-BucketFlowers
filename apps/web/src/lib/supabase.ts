import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wpdfxuwhqwvglqoiubfq.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder')
  );
};

/**
 * Singleton Supabase Client for client-side queries, storage uploads, and realtime subscriptions
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Helper to get a public storage URL with local fallback
 * @param bucket 'product-images' | 'raw-material-images' | 'lookbook-reviews' | 'avatars' | 'chat-attachments'
 * @param path File path in storage
 * @param localFallbackPath Local path in /public/images/...
 */
export const getStorageUrlWithFallback = (
  bucket: string,
  path: string | null | undefined,
  localFallbackPath: string
): string => {
  if (!path) return localFallbackPath;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path;
  }
  if (!isSupabaseConfigured()) {
    return localFallbackPath;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl || localFallbackPath;
};
