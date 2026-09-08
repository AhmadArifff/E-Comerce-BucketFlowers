import { Pool, PoolClient, QueryResultRow } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.wpdfxuwhqwvglqoiubfq:HtDqenaSKAmCdQGK@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1';

// Global singleton pool for Next.js hot reload in development
const globalForDb = global as unknown as { dbPool?: Pool };

export const pool =
  globalForDb.dbPool ||
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbPool = pool;
}

export interface DbResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

/**
 * Execute a parameterized query against Supabase PostgreSQL
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params: any[] = []
): Promise<{ rows: T[]; rowCount: number | null }> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`[DB Slow Query] ${text.slice(0, 100)}... (${duration}ms)`);
    }
    return res;
  } catch (error) {
    console.error('[DB Query Error]', { text: text.slice(0, 120), params, error });
    throw error;
  }
}

/**
 * Execute a transaction block with automatic BEGIN, COMMIT, and ROLLBACK
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[DB Transaction Error - Rolled Back]', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Helper to safely sanitize error responses for clients
 */
export function formatErrorResponse(err: unknown, defaultMessage = 'Internal Server Error'): {
  success: false;
  error: string;
} {
  const message = err instanceof Error ? err.message : defaultMessage;
  return {
    success: false,
    error: message,
  };
}
