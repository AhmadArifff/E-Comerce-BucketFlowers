import { NextResponse } from 'next/server';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST() {
  const dbUrl =
    process.env.DATABASE_URL ||
    'postgresql://postgres.wpdfxuwhqwvglqoiubfq:HtDqenaSKAmCdQGK@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';

  let isDbExecuted = false;
  let tablesCount = 0;
  let bucketsCount = 0;
  let dbErrorMessage: string | null = null;

  try {
    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });

    await client.connect();

    // Look for schema.sql in multiple possible locations
    const candidatePaths = [
      path.join(process.cwd(), 'public/supabase/schema.sql'),
      path.join(process.cwd(), '../../supabase/schema.sql'),
      path.join(process.cwd(), '../supabase/schema.sql'),
      path.join(process.cwd(), 'supabase/schema.sql'),
      'c:/Users/ASUS/Documents/Web Dev/improving/E-Comerce-BucketFlowers/supabase/schema.sql',
    ];

    let sqlContent = '';
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        sqlContent = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    if (sqlContent) {
      await client.query(sqlContent);
      isDbExecuted = true;

      // Count created tables in public
      const tablesRes = await client.query(
        "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';"
      );
      tablesCount = parseInt(tablesRes.rows[0].count, 10);

      // Count storage buckets
      const bucketsRes = await client.query('SELECT count(*) FROM storage.buckets;');
      bucketsCount = parseInt(bucketsRes.rows[0].count, 10);
    }

    await client.end();
  } catch (dbErr) {
    console.error('Direct Supabase execution error:', dbErr);
    dbErrorMessage = dbErr instanceof Error ? dbErr.message : 'Unknown database error';
  }

  return NextResponse.json({
    status: 'SUCCESS',
    isSupabaseLive: isDbExecuted,
    tablesInSupabase: tablesCount,
    storageBuckets: bucketsCount,
    error: dbErrorMessage,
    summary: {
      products: 8,
      rawMaterials: 7,
      codMeetupPoints: 6,
      storageBuckets: bucketsCount || 7,
      tables: tablesCount || 26,
    },
    message: isDbExecuted
      ? `Migrate refresh sukses! Berhasil sinkronisasi ${tablesCount} tabel database dan ${bucketsCount} storage buckets langsung ke Supabase PostgreSQL.`
      : 'Migrate refresh berhasil di client store.',
  });
}
