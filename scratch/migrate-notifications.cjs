const pg = require('pg');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_configs (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'wa_fonnte_setting',
        is_enabled BOOLEAN NOT NULL DEFAULT false,
        api_key VARCHAR(500),
        sender_device VARCHAR(50) DEFAULT '081234567890',
        event_order_created BOOLEAN NOT NULL DEFAULT true,
        event_crafting_started BOOLEAN NOT NULL DEFAULT true,
        event_quality_check BOOLEAN NOT NULL DEFAULT true,
        event_in_delivery BOOLEAN NOT NULL DEFAULT true,
        event_completed BOOLEAN NOT NULL DEFAULT true,
        event_warranty_submitted BOOLEAN NOT NULL DEFAULT true,
        event_warranty_approved BOOLEAN NOT NULL DEFAULT true,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
    console.log('[OK] notification_configs table created');

    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_logs (
        id VARCHAR(100) PRIMARY KEY,
        order_id VARCHAR(100),
        claim_id VARCHAR(100),
        event_type VARCHAR(50) NOT NULL,
        recipient_phone VARCHAR(50) NOT NULL,
        message_text TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        retry_count INT NOT NULL DEFAULT 0,
        gateway_response TEXT,
        sent_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
    console.log('[OK] notification_logs table created');

    await client.query(`
      INSERT INTO notification_configs (id, is_enabled, api_key, sender_device)
      VALUES ('wa_fonnte_setting', false, NULL, '081234567890')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('[OK] Default notification config seeded');

    console.log('\n=== ALL MIGRATIONS COMPLETE ===');
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}
migrate();
