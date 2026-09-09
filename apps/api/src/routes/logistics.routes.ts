import { Router, Request, Response } from 'express';
import { pool } from '../config/database.js';
import crypto from 'crypto';

const router = Router();

// Atelier Origin Defaults (Jl. Margonda Raya No. 108 Depok)
const ATELIER_ORIGIN = {
  name: 'Aesthetic Chenille Flowers Atelier',
  phone: '081234567890',
  address: 'Jl. Margonda Raya No. 108, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424',
  postal_code: 16424,
  latitude: -6.3728,
  longitude: 106.8315,
};

// Courier Service Options Interface
export interface CourierRateOption {
  courier_name: string;
  courier_code: string;
  courier_service_name: string;
  courier_service_code: string;
  duration: string;
  shipment_fee: number;
  etd: string;
  type: 'instant' | 'sameday' | 'regular' | 'next_day';
}

// POST /api/v1/logistics/rates
// Calculate multi-courier delivery rates (Biteship API with resilient fallback)
router.post('/rates', async (req: Request, res: Response) => {
  try {
    const {
      destination_postal_code,
      destination_latitude,
      destination_longitude,
      destination_address,
      items,
      couriers = 'jne,jnt,sicepat,gosend,grab',
    } = req.body;

    const apiKey = process.env.BITESHIP_API_KEY;

    // If Biteship API key is available and not a placeholder, call official Biteship API
    if (apiKey && apiKey !== 'biteship_test_key_placeholder' && !apiKey.startsWith('mock_')) {
      try {
        const biteshipRes = await fetch('https://api.biteship.com/v1/rates/couriers', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin_postal_code: ATELIER_ORIGIN.postal_code,
            origin_latitude: ATELIER_ORIGIN.latitude,
            origin_longitude: ATELIER_ORIGIN.longitude,
            destination_postal_code: destination_postal_code || 16424,
            destination_latitude: destination_latitude || -6.3688,
            destination_longitude: destination_longitude || 106.8336,
            couriers,
            items: items || [
              {
                name: 'Buket Bunga Kawat Bulu',
                description: 'Buket bunga kerajinan velvet kawat bulu terlindung kardus tebal',
                value: 150000,
                weight: 500, // 500 grams
                quantity: 1,
              },
            ],
          }),
        });

        const biteshipData = await biteshipRes.json();
        if (biteshipData.success && biteshipData.pricing?.length > 0) {
          const rates: CourierRateOption[] = biteshipData.pricing.map((p: any) => ({
            courier_name: p.courier_name,
            courier_code: p.courier_code,
            courier_service_name: p.courier_service_name,
            courier_service_code: p.courier_service_code,
            duration: p.duration,
            shipment_fee: p.price,
            etd: p.duration,
            type: p.type || 'regular',
          }));

          return res.json({
            success: true,
            data: rates,
            origin: ATELIER_ORIGIN,
            is_live_api: true,
          });
        }
      } catch (apiError) {
        console.warn('[Biteship API] Live rate fetch failed, activating resilient simulator:', apiError);
      }
    }

    // Resilient Fallback Simulator (JNE, J&T, SiCepat, GoSend, Grab)
    const fallbackRates: CourierRateOption[] = [
      {
        courier_name: 'JNE Express',
        courier_code: 'jne',
        courier_service_name: 'JNE Reguler (REG)',
        courier_service_code: 'reg',
        duration: '1-2 Hari',
        shipment_fee: 11000,
        etd: 'Besok, 10:00 - 17:00 WIB',
        type: 'regular',
      },
      {
        courier_name: 'J&T Express',
        courier_code: 'jnt',
        courier_service_name: 'J&T Standard (EZ)',
        courier_service_code: 'ez',
        duration: '1-2 Hari',
        shipment_fee: 12000,
        etd: 'Besok, 09:00 - 18:00 WIB',
        type: 'regular',
      },
      {
        courier_name: 'SiCepat Ekspres',
        courier_code: 'sicepat',
        courier_service_name: 'SiCepat BEST (Besok Sampai)',
        courier_service_code: 'best',
        duration: '1 Hari',
        shipment_fee: 14000,
        etd: 'Besok Pagi, 09:00 - 12:00 WIB',
        type: 'next_day',
      },
      {
        courier_name: 'GoSend Sameday',
        courier_code: 'gosend',
        courier_service_name: 'GoSend Sameday Courier',
        courier_service_code: 'sameday',
        duration: '6-8 Jam',
        shipment_fee: 19000,
        etd: 'Hari Ini, 14:00 - 18:00 WIB',
        type: 'sameday',
      },
      {
        courier_name: 'GoSend Instant',
        courier_code: 'gosend',
        courier_service_name: 'GoSend Instant Delivery (Motor)',
        courier_service_code: 'instant',
        duration: '1-2 Jam',
        shipment_fee: 28000,
        etd: 'Hari Ini, 1-2 Jam Setelah Rangkai',
        type: 'instant',
      },
    ];

    return res.json({
      success: true,
      data: fallbackRates,
      origin: ATELIER_ORIGIN,
      is_live_api: false,
      message: 'Tarif dihitung berdasarkan titik asal Atelier Margonda Depok.',
    });
  } catch (error: any) {
    console.error('Error fetching logistics rates:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal menghitung tarif kurir.' });
  }
});

// POST /api/v1/logistics/orders
// Create dispatch shipment order and generate airway bill
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const {
      order_id,
      courier_company = 'JNE',
      courier_type = 'REG',
      delivery_notes,
    } = req.body;

    if (!order_id) {
      return res.status(400).json({ success: false, error: 'Order ID wajib disertakan.' });
    }

    // Check order in database
    const orderRes = await pool.query(`SELECT * FROM orders WHERE id = $1;`, [order_id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan.' });
    }
    const order = orderRes.rows[0];

    // Generate Airway Bill / Waybill Number
    const waybillId = `BITESHIP-${Date.now().toString().slice(-6)}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const courierDisplayName = `${courier_company.toUpperCase()} ${courier_type.toUpperCase()}`;

    // Update order in Supabase PostgreSQL
    await pool.query(
      `UPDATE orders
       SET courier_name = $1,
           tracking_number = $2,
           order_status = 'READY_FOR_DISPATCH',
           current_step = 3,
           updated_at = NOW()
       WHERE id = $3;`,
      [courierDisplayName, waybillId, order_id]
    );

    // Record in status histories
    const histId = crypto.randomUUID();
    await pool.query(
      `INSERT INTO order_status_histories (id, order_id, step_number, status_title, status_desc, action_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW());`,
      [
        histId,
        order_id,
        3,
        'Siap Dijemput Kurir',
        `Paket siap dijemput oleh kurir ${courierDisplayName}. No. Resi: ${waybillId}`,
        'SYSTEM_LOGISTICS',
      ]
    );

    return res.json({
      success: true,
      data: {
        order_id,
        tracking_number: waybillId,
        courier_name: courierDisplayName,
        order_status: 'READY_FOR_DISPATCH',
        current_step: 3,
        waybill_id: waybillId,
        shipping_label_url: `https://chenille-flowers.com/label/${waybillId}`,
        estimated_pickup: 'Hari ini, 13:00 - 15:00 WIB',
      },
      message: `Surat jalan dan nomor resi ${waybillId} berhasil dibuat!`,
    });
  } catch (error: any) {
    console.error('Error creating logistics order:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal membuat pesanan kurir.' });
  }
});

// POST /api/v1/logistics/webhook
// Biteship Courier Status Webhook Listener
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const {
      order_id,
      courier_tracking_id,
      status,
      cash_on_delivery,
      courier_name,
      note,
    } = req.body;

    console.log(`[Biteship Webhook] Received update for ${order_id || courier_tracking_id}: ${status}`);

    if (!order_id && !courier_tracking_id) {
      return res.status(400).json({ success: false, error: 'Order ID atau tracking ID tidak ada.' });
    }

    // Find order by ID or tracking number
    const checkSql = order_id
      ? `SELECT * FROM orders WHERE id = $1;`
      : `SELECT * FROM orders WHERE tracking_number = $1;`;
    const checkRes = await pool.query(checkSql, [order_id || courier_tracking_id]);

    if (checkRes.rows.length === 0) {
      console.warn(`[Biteship Webhook] Order not found for webhook event.`);
      return res.status(200).json({ success: true, message: 'Webhook diterima tetapi pesanan tidak ditemukan di DB.' });
    }

    const order = checkRes.rows[0];
    let newOrderStatus = order.order_status;
    let newCurrentStep = order.current_step;
    let statusNote = note || `Update status kurir: ${status}`;

    // Map Biteship status
    switch (status) {
      case 'allocated':
      case 'picking_up':
        newOrderStatus = 'READY_FOR_DISPATCH';
        newCurrentStep = 3;
        statusNote = 'Kurir telah ditugaskan dan sedang menuju atelier untuk penjemputan paket buket.';
        break;
      case 'picked':
      case 'dropping_off':
        newOrderStatus = 'ON_DELIVERY_EXPEDITION';
        newCurrentStep = 4;
        statusNote = 'Paket buket telah dibawa oleh kurir dan dalam perjalanan menuju alamat pelanggan.';
        break;
      case 'delivered':
        newOrderStatus = 'COMPLETED';
        newCurrentStep = 4;
        statusNote = 'Paket buket telah berhasil diserahkan kepada pelanggan dalam keadaan aman.';
        break;
      case 'cancelled':
      case 'rejected':
        newOrderStatus = 'CANCELLED';
        statusNote = 'Pengiriman kurir dibatalkan / gagal diantar.';
        break;
    }

    // Update orders table
    await pool.query(
      `UPDATE orders
       SET order_status = $1,
           current_step = $2,
           updated_at = NOW()
       WHERE id = $3;`,
      [newOrderStatus, newCurrentStep, order.id]
    );

    // Record status history
    const histId = crypto.randomUUID();
    await pool.query(
      `INSERT INTO order_status_histories (id, order_id, step_number, status_title, status_desc, action_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW());`,
      [histId, order.id, newCurrentStep, newOrderStatus, statusNote, 'BITESHIP_WEBHOOK']
    );

    return res.json({
      success: true,
      data: {
        order_id: order.id,
        new_status: newOrderStatus,
        current_step: newCurrentStep,
      },
      message: 'Webhook Biteship berhasil diproses.',
    });
  } catch (error: any) {
    console.error('Error processing Biteship webhook:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/logistics/track/:trackingNumber
// Track shipment timeline checkpoints
router.get('/track/:trackingNumber', async (req: Request, res: Response) => {
  try {
    const { trackingNumber } = req.params;

    // Check order in DB
    const orderRes = await pool.query(`SELECT * FROM orders WHERE tracking_number = $1 OR id = $1;`, [trackingNumber]);
    const order = orderRes.rows[0] || null;

    // Simulated / Live Checkpoints
    const checkpoints = [
      {
        time: order?.created_at || 'Hari ini, 09:30 WIB',
        title: 'Pesanan Dibuat & Terverifikasi',
        description: 'Atelier Chenille telah mengonfirmasi pembayaran dan merangkai buket pesanan.',
        status: 'COMPLETED',
      },
      {
        time: 'Hari ini, 11:45 WIB',
        title: 'Quality Check Selesai & Paket Dikemas',
        description: 'Buket telah lolos inspeksi kerapian dan dimasukkan ke kardus tebal pelindung.',
        status: 'COMPLETED',
      },
      {
        time: 'Hari ini, 13:15 WIB',
        title: 'Diserahkan ke Kurir Ekspedisi',
        description: `Paket diserahkan ke ${order?.courier_name || 'JNE Reguler'}. No. Resi: ${order?.tracking_number || trackingNumber}`,
        status: order?.current_step >= 3 ? 'COMPLETED' : 'CURRENT',
      },
      {
        time: 'Estimasi Besok, 10:00 WIB',
        title: 'Dalam Perjalanan Menuju Penerima',
        description: `Menuju alamat: ${order?.shipping_address || 'Alamat Penerima'}`,
        status: order?.current_step >= 4 ? 'COMPLETED' : 'PENDING',
      },
    ];

    return res.json({
      success: true,
      data: {
        tracking_number: trackingNumber,
        courier_name: order?.courier_name || 'JNE Express',
        order_id: order?.id,
        current_status: order?.order_status || 'ON_DELIVERY_EXPEDITION',
        current_step: order?.current_step || 4,
        checkpoints,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
