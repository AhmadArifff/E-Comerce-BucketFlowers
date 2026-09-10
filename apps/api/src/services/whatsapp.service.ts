import { pool } from '../config/database.js';

// =====================================================================
// WhatsApp Notification Service via Fonnte API Gateway
// PRD 7.19: Automated WA notifications with exponential backoff retry
// =====================================================================

/**
 * Notification event types matching PRD 7.19 specification
 */
export type NotificationEventType =
  | 'ORDER_CREATED'
  | 'CRAFTING_STARTED'
  | 'QUALITY_CHECK'
  | 'IN_DELIVERY'
  | 'COMPLETED'
  | 'WARRANTY_SUBMITTED'
  | 'WARRANTY_APPROVED';

/**
 * Data payload for notification template rendering
 */
export interface NotificationPayload {
  phone: string;
  invoice?: string;
  orderId?: string;
  claimId?: string;
  leadTime?: string;
  etd?: string;
  photoUrl?: string;
  awb?: string;
  trackingUrl?: string;
  points?: number;
  portalUrl?: string;
}

/**
 * Notification config from database
 */
interface NotificationConfig {
  is_enabled: boolean;
  api_key: string | null;
  sender_device: string;
  event_order_created: boolean;
  event_crafting_started: boolean;
  event_quality_check: boolean;
  event_in_delivery: boolean;
  event_completed: boolean;
  event_warranty_submitted: boolean;
  event_warranty_approved: boolean;
}

// Retry intervals in milliseconds (PRD 7.19: 30s, 2min, 10min)
const RETRY_DELAYS = [30_000, 120_000, 600_000];
const MAX_RETRIES = 3;

const PORTAL_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Get notification message template for a given event
 */
function getMessageTemplate(event: NotificationEventType, data: NotificationPayload): string {
  const portalUrl = data.portalUrl || `${PORTAL_BASE_URL}/portal`;

  switch (event) {
    case 'ORDER_CREATED':
      return `🌸 Pesanan #${data.invoice || data.orderId} berhasil! Buketmu sedang disiapkan pengrajin. Estimasi: ${data.leadTime || '1-2 hari kerja'}. Track: ${portalUrl}`;

    case 'CRAFTING_STARTED':
      return `✂️ Buket #${data.invoice || data.orderId} sedang dirangkai dengan penuh cinta oleh pengrajin kami! Estimasi selesai: ${data.etd || 'hari ini'}`;

    case 'QUALITY_CHECK':
      return `✅ Buketmu sudah selesai & lolos QC!${data.photoUrl ? ` Foto buketmu: ${data.photoUrl}.` : ''} Menunggu pengiriman.`;

    case 'IN_DELIVERY':
      return `🚚 Buket #${data.invoice || data.orderId} sedang dalam perjalanan! Resi: ${data.awb || '-'}.${data.trackingUrl ? ` Track kurir: ${data.trackingUrl}` : ''}`;

    case 'COMPLETED':
      return `🎉 Buket sudah sampai! Semoga momen wisudamu berkesan.${data.points ? ` Kamu dapat +${data.points} Flower Points!` : ''} 💐`;

    case 'WARRANTY_SUBMITTED':
      return `📋 Klaim garansi #${data.claimId} diterima. Tim kami akan meninjau dalam 1x24 jam kerja.`;

    case 'WARRANTY_APPROVED':
      return `✅ Klaim disetujui! Buket pengganti baru sedang dirangkai & akan dikirim GRATIS.${data.awb ? ` Resi: ${data.awb}` : ''}`;

    default:
      return `📢 Notifikasi dari Aesthetic Chenille Flowers Atelier — Pesanan #${data.invoice || data.orderId}`;
  }
}

/**
 * Map event type to the corresponding config toggle column
 */
function isEventEnabled(config: NotificationConfig, event: NotificationEventType): boolean {
  const eventMap: Record<NotificationEventType, keyof NotificationConfig> = {
    ORDER_CREATED: 'event_order_created',
    CRAFTING_STARTED: 'event_crafting_started',
    QUALITY_CHECK: 'event_quality_check',
    IN_DELIVERY: 'event_in_delivery',
    COMPLETED: 'event_completed',
    WARRANTY_SUBMITTED: 'event_warranty_submitted',
    WARRANTY_APPROVED: 'event_warranty_approved',
  };
  return config[eventMap[event]] as boolean;
}

/**
 * Load notification config from database (with fallback to .env)
 */
async function getNotificationConfig(): Promise<NotificationConfig> {
  try {
    const res = await pool.query('SELECT * FROM notification_configs WHERE id = $1 LIMIT 1;', ['wa_fonnte_setting']);
    if (res.rows.length > 0) {
      return res.rows[0] as NotificationConfig;
    }
  } catch (err) {
    console.warn('[WA Service] Could not load notification config from DB, using .env fallback:', err);
  }

  // Fallback to .env values
  return {
    is_enabled: false,
    api_key: process.env.WA_GATEWAY_API_KEY || null,
    sender_device: process.env.WA_SENDER_DEVICE || '081234567890',
    event_order_created: true,
    event_crafting_started: true,
    event_quality_check: true,
    event_in_delivery: true,
    event_completed: true,
    event_warranty_submitted: true,
    event_warranty_approved: true,
  };
}

/**
 * Check if API key is a real key (not placeholder)
 */
function isValidApiKey(key: string | null): boolean {
  if (!key) return false;
  if (key.includes('xxxx')) return false;
  if (key.length < 10) return false;
  return true;
}

/**
 * Send a single WhatsApp message via Fonnte API
 */
async function callFonnteApi(
  apiKey: string,
  phone: string,
  message: string,
  senderDevice?: string
): Promise<{ success: boolean; response: string }> {
  const gatewayUrl = process.env.WA_GATEWAY_URL || 'https://api.fonnte.com/send';

  try {
    const response = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: phone,
        message: message,
        ...(senderDevice ? { device: senderDevice } : {}),
      }),
    });

    const data = await response.json() as any;
    const isSuccess = response.ok && (data.status === true || data.status === 'true');

    return {
      success: isSuccess,
      response: JSON.stringify(data),
    };
  } catch (error: any) {
    return {
      success: false,
      response: `Network error: ${error.message}`,
    };
  }
}

/**
 * Log notification attempt to database
 */
async function logNotification(
  logId: string,
  orderId: string | null,
  claimId: string | null,
  eventType: string,
  phone: string,
  message: string,
  status: 'PENDING' | 'SENT' | 'FAILED' | 'SIMULATED',
  retryCount: number,
  gatewayResponse: string | null,
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO notification_logs (id, order_id, claim_id, event_type, recipient_phone, message_text, status, retry_count, gateway_response, sent_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       ON CONFLICT (id) DO UPDATE SET
         status = EXCLUDED.status,
         retry_count = EXCLUDED.retry_count,
         gateway_response = EXCLUDED.gateway_response,
         sent_at = EXCLUDED.sent_at;`,
      [
        logId,
        orderId || null,
        claimId || null,
        eventType,
        phone,
        message,
        status,
        retryCount,
        gatewayResponse,
        status === 'SENT' || status === 'SIMULATED' ? new Date() : null,
      ]
    );
  } catch (err) {
    console.warn('[WA Service] Failed to log notification:', err);
  }
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send WhatsApp notification with exponential backoff retry (PRD 7.19)
 * This function is fire-and-forget — it should be called without await
 * to prevent blocking the HTTP response.
 */
async function sendWithRetry(
  apiKey: string,
  phone: string,
  message: string,
  logId: string,
  orderId: string | null,
  claimId: string | null,
  eventType: string,
  senderDevice?: string,
): Promise<void> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const result = await callFonnteApi(apiKey, phone, message, senderDevice);

    if (result.success) {
      await logNotification(logId, orderId, claimId, eventType, phone, message, 'SENT', attempt, result.response);
      console.log(`[WA Service] ✅ Notification sent: ${eventType} → ${phone} (attempt ${attempt + 1})`);
      return;
    }

    console.warn(`[WA Service] ⚠️ Attempt ${attempt + 1}/${MAX_RETRIES} failed for ${eventType} → ${phone}: ${result.response}`);

    // Log intermediate failure
    await logNotification(logId, orderId, claimId, eventType, phone, message, 'PENDING', attempt + 1, result.response);

    // Wait before retry (exponential backoff)
    if (attempt < MAX_RETRIES - 1) {
      const delay = RETRY_DELAYS[attempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
      console.log(`[WA Service] Retrying in ${delay / 1000}s...`);
      await sleep(delay);
    }
  }

  // All retries exhausted — mark as FAILED
  await logNotification(logId, orderId, claimId, eventType, phone, message, 'FAILED', MAX_RETRIES, 'All retry attempts exhausted');
  console.error(`[WA Service] ❌ FAILED after ${MAX_RETRIES} retries: ${eventType} → ${phone}`);
}

/**
 * Main entry point: Send order/warranty notification
 * Called from routes as fire-and-forget (no await needed)
 */
export async function sendOrderNotification(
  event: NotificationEventType,
  data: NotificationPayload
): Promise<void> {
  try {
    const config = await getNotificationConfig();

    // Check if notifications are globally enabled
    if (!config.is_enabled) {
      console.log(`[WA Service] Notifications disabled globally. Skipping ${event} for ${data.phone}`);
      return;
    }

    // Check if this specific event type is enabled
    if (!isEventEnabled(config, event)) {
      console.log(`[WA Service] Event ${event} is disabled. Skipping notification for ${data.phone}`);
      return;
    }

    const message = getMessageTemplate(event, data);
    const logId = `notif-${event.toLowerCase()}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Simulation mode if no valid API key
    if (!isValidApiKey(config.api_key)) {
      console.log(`[WA Service] 🧪 SIMULATION MODE — Would send to ${data.phone}:`);
      console.log(`[WA Service] 📱 Message: ${message}`);
      await logNotification(
        logId,
        data.orderId || data.invoice || null,
        data.claimId || null,
        event,
        data.phone,
        message,
        'SIMULATED',
        0,
        'Simulation mode: API key not configured or placeholder'
      );
      return;
    }

    // Fire-and-forget: send with retry in background
    sendWithRetry(
      config.api_key!,
      data.phone,
      message,
      logId,
      data.orderId || data.invoice || null,
      data.claimId || null,
      event,
      config.sender_device,
    ).catch((err) => {
      console.error(`[WA Service] Unhandled error in sendWithRetry:`, err);
    });

  } catch (err) {
    console.error(`[WA Service] Error initiating notification ${event}:`, err);
  }
}

/**
 * Test WhatsApp connection by sending a test message
 * Used by admin settings panel
 */
export async function testWhatsAppConnection(
  apiKey?: string,
  targetPhone?: string,
  senderDevice?: string,
): Promise<{ success: boolean; mode: string; message: string; response?: string }> {
  const config = await getNotificationConfig();
  const key = apiKey || config.api_key;
  const phone = targetPhone || config.sender_device || '081234567890';

  if (!isValidApiKey(key)) {
    return {
      success: true,
      mode: 'simulation',
      message: `Mode Simulasi aktif. API Key Fonnte belum dikonfigurasi. Pesan WA akan dicatat di log tanpa pengiriman ke gateway.`,
    };
  }

  const testMessage = `🧪 Tes koneksi WhatsApp berhasil!\n\nIni adalah pesan uji coba dari Aesthetic Chenille Flowers Atelier.\nTimestamp: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

  const result = await callFonnteApi(key!, phone, testMessage, senderDevice || config.sender_device);

  if (result.success) {
    return {
      success: true,
      mode: 'live',
      message: `Koneksi Fonnte berhasil! Pesan tes terkirim ke ${phone}.`,
      response: result.response,
    };
  }

  return {
    success: false,
    mode: 'live',
    message: `Gagal mengirim pesan tes ke ${phone}. Periksa API Key dan device WhatsApp di dashboard Fonnte.`,
    response: result.response,
  };
}
