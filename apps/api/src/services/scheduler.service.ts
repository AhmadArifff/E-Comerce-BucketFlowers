import { pool } from '../config/database.js';
import { sendOrderNotification } from './whatsapp.service.js';

// ============================================================================
// Periodic Scheduler & Occasion Reminder Engine (PRD Seksi 17 & 23)
// ============================================================================

export interface OccasionReminderResult {
  id: string;
  user_phone: string;
  user_name: string;
  recipient_name: string;
  occasion_title: string;
  event_date: string;
  days_remaining: number;
  reminded_at: string;
}

/**
 * Scan database for upcoming customer occasions within daysAhead (default: 7)
 * and trigger WhatsApp notifications for those not yet reminded.
 */
export async function scanAndDispatchOccasionReminders(
  daysAhead: number = 7
): Promise<OccasionReminderResult[]> {
  const safeDays = Math.max(1, Math.min(daysAhead, 30));
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  // 1. Query occasions within the date window that haven't been reminded
  const query = `
    SELECT id, user_phone, user_name, recipient_name, occasion_title, event_date, notes, is_reminded
    FROM customer_occasions
    WHERE is_reminded = false
      AND event_date::date >= CURRENT_DATE
      AND event_date::date <= (CURRENT_DATE + ($1 || ' days')::interval)::date
    ORDER BY event_date ASC;
  `;

  const res = await pool.query(query, [safeDays]);
  const rows = res.rows;
  const dispatched: OccasionReminderResult[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const row of rows) {
    try {
      const targetDate = new Date(row.event_date);
      const eventDay = new Date(targetDate);
      eventDay.setHours(0, 0, 0, 0);
      const diffTime = eventDay.getTime() - today.getTime();
      const daysRemaining = Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));

      const formattedDate = targetDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      // 2. Dispatch WhatsApp Notification
      await sendOrderNotification('OCCASION_REMINDER', {
        phone: row.user_phone,
        userName: row.user_name || 'Pelanggan',
        recipientName: row.recipient_name || 'Orang Tersayang',
        occasionTitle: row.occasion_title || 'Momen Spesial',
        eventDate: formattedDate,
        daysRemaining: daysRemaining,
        catalogUrl: frontendUrl,
        occasionId: row.id,
      });

      // 3. Mark occasion as reminded in DB
      const updateRes = await pool.query(
        `UPDATE customer_occasions
         SET is_reminded = true, reminded_at = NOW()
         WHERE id = $1
         RETURNING reminded_at;`,
        [row.id]
      );

      const remindedAt = updateRes.rows[0]?.reminded_at || new Date().toISOString();

      dispatched.push({
        id: row.id,
        user_phone: row.user_phone,
        user_name: row.user_name,
        recipient_name: row.recipient_name,
        occasion_title: row.occasion_title,
        event_date: row.event_date,
        days_remaining: daysRemaining,
        reminded_at: remindedAt,
      });

      console.log(
        `[Scheduler] 🌸 Occasion Reminder dispatched for ${row.user_phone} (${row.occasion_title} - ${daysRemaining} days left)`
      );
    } catch (err) {
      console.error(`[Scheduler] Error dispatching reminder for occasion ${row.id}:`, err);
    }
  }

  return dispatched;
}

// Global timer reference for clean teardowns
let schedulerIntervalId: NodeJS.Timeout | null = null;

// Default interval: 6 hours (21,600,000 ms)
const SCAN_INTERVAL_MS = 6 * 60 * 60 * 1000;

/**
 * Initialize background scheduler (skipped in test mode)
 */
export function initScheduler(): void {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (schedulerIntervalId) {
    return; // Already initialized
  }

  console.log('[Scheduler] ⏰ Starting Occasion Reminder background scheduler (runs every 6h)');

  // Run initial scan 10 seconds after server startup
  setTimeout(() => {
    scanAndDispatchOccasionReminders(7).catch((err) => {
      console.warn('[Scheduler] Initial startup scan warning:', err);
    });
  }, 10_000);

  // Set recurring interval
  schedulerIntervalId = setInterval(() => {
    scanAndDispatchOccasionReminders(7).catch((err) => {
      console.error('[Scheduler] Periodic scan failed:', err);
    });
  }, SCAN_INTERVAL_MS);
}

/**
 * Stop scheduler on shutdown
 */
export function stopScheduler(): void {
  if (schedulerIntervalId) {
    clearInterval(schedulerIntervalId);
    schedulerIntervalId = null;
    console.log('[Scheduler] 🛑 Occasion Reminder background scheduler stopped');
  }
}
