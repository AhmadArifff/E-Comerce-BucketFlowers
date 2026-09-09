import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { pool } from '../config/database.js';

const router = Router();

// Configuration
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxxxx';
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const SNAP_API_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

const isPlaceholderKey = !MIDTRANS_SERVER_KEY || MIDTRANS_SERVER_KEY.includes('xxxx');

// POST /api/v1/payment/create
// Creates Snap transaction token for an order
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { order_id } = req.body;
    if (!order_id) {
      return res.status(400).json({ success: false, error: 'order_id wajib disertakan.' });
    }

    // 1. Fetch Order and items
    const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1 LIMIT 1;', [order_id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Pesanan dengan invoice ${order_id} tidak ditemukan.` });
    }
    const order = orderRes.rows[0];

    const itemsRes = await pool.query('SELECT * FROM order_items WHERE order_id = $1;', [order_id]);
    const items = itemsRes.rows;

    const grossAmount = Math.round(parseFloat(order.total_amount));

    let snapToken = '';
    let redirectUrl = '';
    let isMock = false;

    // 2. Request token from Midtrans Snap API (or graceful mock if key is placeholder)
    if (!isPlaceholderKey) {
      try {
        const authHeader = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');
        const midtransPayload = {
          transaction_details: {
            order_id: order.id,
            gross_amount: grossAmount,
          },
          customer_details: {
            first_name: order.customer_name,
            phone: order.customer_phone,
            email: order.customer_email || `${order.customer_phone.replace(/\D/g, '')}@chenille-customer.com`,
          },
          item_details: items.length > 0 ? items.map((it: any) => ({
            id: it.product_id || it.id,
            price: Math.round(parseFloat(it.price)),
            quantity: it.quantity,
            name: (it.product_name || 'Buket Bunga').slice(0, 50),
          })) : [
            {
              id: order.id,
              price: grossAmount,
              quantity: 1,
              name: 'Pesanan Buket Chenille Atelier',
            }
          ],
        };

        const mtResponse = await fetch(SNAP_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Basic ${authHeader}`,
          },
          body: JSON.stringify(midtransPayload),
        });

        if (mtResponse.ok) {
          const mtData: any = await mtResponse.json();
          snapToken = mtData.token;
          redirectUrl = mtData.redirect_url;
        } else {
          const errText = await mtResponse.text();
          console.warn('Midtrans Snap API error, falling back to Sandbox simulation token:', errText);
          isMock = true;
        }
      } catch (callErr) {
        console.warn('Network error calling Midtrans Snap API, using fallback:', callErr);
        isMock = true;
      }
    } else {
      isMock = true;
    }

    // 3. Fallback token generation for local development / testing
    if (!snapToken || isMock) {
      snapToken = `SNAP-MOCK-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      redirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`;
      isMock = true;
    }

    // 4. Record or update transaction in payment_transactions table
    const txId = `TX-${order.id}`;
    await pool.query(
      `INSERT INTO payment_transactions (
        id, order_id, gateway_type, amount, status, snap_token, payment_url, created_at
      ) VALUES ($1, $2, 'MIDTRANS_SNAP_QRIS', $3, 'UNPAID', $4, $5, NOW())
      ON CONFLICT (id) DO UPDATE SET
        snap_token = EXCLUDED.snap_token,
        payment_url = EXCLUDED.payment_url,
        amount = EXCLUDED.amount;`,
      [txId, order.id, grossAmount, snapToken, redirectUrl]
    );

    return res.json({
      success: true,
      data: {
        order_id: order.id,
        gross_amount: grossAmount,
        snap_token: snapToken,
        redirect_url: redirectUrl,
        is_mock: isMock,
        client_key: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxxxx',
      },
      message: isMock
        ? 'Snap token simulasi sandbox berhasil dibuat.'
        : 'Snap token resmi Midtrans berhasil dibuat.',
    });
  } catch (error: any) {
    console.error('Error creating Snap payment:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal membuat sesi pembayaran.' });
  }
});

// POST /api/v1/payment/webhook
// Midtrans notification webhook handler
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = payload;

    if (!order_id) {
      return res.status(400).json({ success: false, error: 'Payload tidak valid: order_id tidak ada.' });
    }

    // 1. Signature Verification (SHA-512)
    if (!isPlaceholderKey && signature_key) {
      const expectedSignature = crypto
        .createHash('sha512')
        .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
        .digest('hex');

      if (expectedSignature !== signature_key) {
        console.error('Invalid signature key from Midtrans webhook:', { expected: expectedSignature, received: signature_key });
        return res.status(403).json({ success: false, error: 'Signature key tidak cocok.' });
      }
    }

    // 2. Fetch order
    const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1 LIMIT 1;', [order_id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Order ${order_id} tidak ditemukan.` });
    }
    const order = orderRes.rows[0];

    // 3. Idempotency Check: Don't process if already settled
    if (order.payment_status === 'SETTLEMENT') {
      return res.json({ success: true, message: 'Pesanan sudah berstatus SETTLEMENT (Idempotent).' });
    }

    // 4. Map Midtrans transaction_status to internal status
    let newPaymentStatus = order.payment_status;
    let newOrderStatus = order.order_status;
    let currentStep = order.current_step;
    let statusDesc = '';

    if (transaction_status === 'capture') {
      if (fraud_status === 'challenge') {
        newPaymentStatus = 'UNPAID';
        statusDesc = 'Pembayaran terdeteksi memerlukan review fraud manual.';
      } else if (fraud_status === 'accept') {
        newPaymentStatus = 'SETTLEMENT';
        newOrderStatus = 'PAYMENT_CONFIRMED';
        currentStep = 1;
        statusDesc = `Pembayaran kartu kredit lunas terkonfirmasi Midtrans (${payment_type || 'credit_card'}).`;
      }
    } else if (transaction_status === 'settlement') {
      newPaymentStatus = 'SETTLEMENT';
      newOrderStatus = 'PAYMENT_CONFIRMED';
      currentStep = 1;
      statusDesc = `Pembayaran lunas via ${payment_type || 'QRIS / VA'} terkonfirmasi Midtrans.`;
    } else if (transaction_status === 'expire') {
      newPaymentStatus = 'EXPIRED';
      newOrderStatus = 'CANCELLED';
      statusDesc = 'Batas waktu pembayaran telah kadaluarsa.';
    } else if (['cancel', 'deny'].includes(transaction_status)) {
      newPaymentStatus = 'FAILED';
      newOrderStatus = 'CANCELLED';
      statusDesc = `Pembayaran ${transaction_status} (dibatalkan/ditolak).`;
    } else if (transaction_status === 'pending') {
      newPaymentStatus = 'UNPAID';
      statusDesc = `Menunggu pembayaran ${payment_type || 'QRIS / VA'}.`;
    }

    // 5. Update Order in DB
    await pool.query(
      `UPDATE orders 
       SET payment_status = $1, order_status = $2, current_step = $3, updated_at = NOW() 
       WHERE id = $4;`,
      [newPaymentStatus, newOrderStatus, currentStep, order_id]
    );

    // 6. Update PaymentTransaction record
    const isSettlement = newPaymentStatus === 'SETTLEMENT';
    await pool.query(
      `UPDATE payment_transactions 
       SET status = $1, paid_at = CASE WHEN $2 = true THEN NOW() ELSE paid_at END, raw_webhook_payload = $3
       WHERE order_id = $4;`,
      [newPaymentStatus, isSettlement, JSON.stringify(payload), order_id]
    );

    // 7. Insert status history if changed
    if (statusDesc) {
      await pool.query(
        `INSERT INTO order_status_histories (
          order_id, step_number, status_title, status_desc, action_by, created_at
        ) VALUES ($1, $2, $3, $4, 'Midtrans Webhook', NOW());`,
        [order_id, currentStep, newPaymentStatus === 'SETTLEMENT' ? 'Pembayaran Lunas' : 'Update Pembayaran', statusDesc]
      );
    }

    console.log(`[Midtrans Webhook] Order ${order_id} updated: ${newPaymentStatus} (${transaction_status})`);

    return res.json({
      success: true,
      message: 'Status pesanan berhasil diperbarui oleh notifikasi Midtrans.',
      order_id,
      payment_status: newPaymentStatus,
      order_status: newOrderStatus,
    });
  } catch (error: any) {
    console.error('Error handling Midtrans webhook:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal memproses webhook.' });
  }
});

// GET /api/v1/payment/:orderId/status
router.get('/:orderId/status', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const txRes = await pool.query('SELECT * FROM payment_transactions WHERE order_id = $1 LIMIT 1;', [orderId]);
    const orderRes = await pool.query('SELECT payment_status, order_status, current_step FROM orders WHERE id = $1 LIMIT 1;', [orderId]);

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan.' });
    }

    return res.json({
      success: true,
      data: {
        order_id: orderId,
        order: orderRes.rows[0],
        transaction: txRes.rows[0] || null,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
