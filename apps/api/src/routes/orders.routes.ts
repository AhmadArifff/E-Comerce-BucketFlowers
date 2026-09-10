import { Router } from 'express';
import crypto from 'crypto';
import { pool } from '../config/database.js';
import { sendOrderNotification } from '../services/whatsapp.service.js';

const router = Router();

// GET /api/v1/orders
router.get('/', async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const phone = req.query.phone as string | undefined;
    const search = req.query.search as string | undefined;
    const limit = Math.max(1, Math.min(100, parseInt((req.query.limit as string) || '50', 10)));

    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (status && status !== 'ALL') {
      conditions.push(`o.order_status = $${idx}`);
      params.push(status);
      idx++;
    }

    if (phone) {
      conditions.push(`o.customer_phone LIKE $${idx}`);
      params.push(`%${phone}%`);
      idx++;
    }

    if (search) {
      conditions.push(`(o.id ILIKE $${idx} OR o.customer_name ILIKE $${idx} OR o.customer_phone ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        o.id,
        o.id as invoice_number,
        o.customer_name,
        o.customer_phone,
        o.customer_email,
        o.recipient_name,
        o.fulfillment_type,
        o.shipping_address,
        o.cod_meetup_id,
        cod.name as cod_meetup_name,
        cod.full_address as cod_meetup_address,
        cod.google_maps_url as cod_maps_url,
        o.cod_notes,
        o.total_amount::float as total_amount,
        o.discount_amount::float as discount_amount,
        COALESCE(o.points_redeemed, 0) as points_redeemed,
        COALESCE(o.points_earned, 0) as points_earned,
        o.total_hpp_cost::float as total_hpp_cost,
        (o.total_amount - o.total_hpp_cost)::float as net_profit,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.current_step,
        o.courier_name,
        o.tracking_number,
        o.warranty_status,
        o.theme_used,
        o.created_at,
        o.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_name', oi.product_name,
              'price', oi.price::float,
              'raw_cost_hpp', oi.raw_cost_hpp::float,
              'quantity', oi.quantity,
              'subtotal', oi.subtotal::float,
              'custom_specs_json', oi.custom_specs_json
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) as items
      FROM orders o
      LEFT JOIN cod_meetup_points cod ON o.cod_meetup_id = cod.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id, cod.id
      ORDER BY o.created_at DESC
      LIMIT $${idx};
    `;

    params.push(limit);
    const result = await pool.query(sql, params);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('Error listing orders:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data pesanan.' });
  }
});

// GET /api/v1/orders/quota-status
router.get('/quota-status', async (_req, res) => {
  try {
    const settingsRes = await pool.query('SELECT daily_po_limit FROM store_settings LIMIT 1;');
    const dailyLimit = settingsRes.rows[0]?.daily_po_limit || 25;

    const todayOrdersRes = await pool.query(
      `SELECT COUNT(*)::int as count FROM orders WHERE created_at >= CURRENT_DATE AND order_status != 'CANCELLED';`
    );
    const todayCount = todayOrdersRes.rows[0]?.count || 0;
    const poSlotsRemaining = Math.max(0, dailyLimit - todayCount);

    return res.json({
      success: true,
      data: {
        daily_po_limit: dailyLimit,
        today_orders_count: todayCount,
        po_slots_remaining: poSlotsRemaining,
        is_quota_full: poSlotsRemaining === 0,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/orders/track/:phone
router.get('/track/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    const sql = `
      SELECT 
        o.*,
        cod.name as cod_meetup_name,
        cod.full_address as cod_meetup_address,
        cod.google_maps_url as cod_maps_url
      FROM orders o
      LEFT JOIN cod_meetup_points cod ON o.cod_meetup_id = cod.id
      WHERE o.customer_phone LIKE $1 OR o.customer_phone = $2
      ORDER BY o.created_at DESC;
    `;
    const result = await pool.query(sql, [`%${cleanPhone}%`, phone]);

    const ordersWithDetails = await Promise.all(
      result.rows.map(async (order) => {
        const itemsRes = await pool.query('SELECT * FROM order_items WHERE order_id = $1;', [order.id]);
        const histRes = await pool.query(
          'SELECT * FROM order_status_histories WHERE order_id = $1 ORDER BY step_number ASC, created_at ASC;',
          [order.id]
        );
        return {
          ...order,
          items: itemsRes.rows,
          histories: histRes.rows,
        };
      })
    );

    return res.json({ success: true, data: ordersWithDetails });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        o.*,
        cod.name as cod_meetup_name,
        cod.full_address as cod_meetup_address,
        cod.google_maps_url as cod_maps_url,
        cod.distance_km as cod_distance_km
      FROM orders o
      LEFT JOIN cod_meetup_points cod ON o.cod_meetup_id = cod.id
      WHERE o.id = $1
      LIMIT 1;
    `;
    const orderRes = await pool.query(sql, [id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan.' });
    }

    const order = orderRes.rows[0];

    const itemsRes = await pool.query(
      `SELECT id, product_id, product_name, price::float, raw_cost_hpp::float, quantity, subtotal::float, custom_specs_json
       FROM order_items
       WHERE order_id = $1;`,
      [order.id]
    );

    const historiesRes = await pool.query(
      `SELECT id, step_number, status_title, status_desc, photo_proof_url, action_by, created_at
       FROM order_status_histories
       WHERE order_id = $1
       ORDER BY step_number ASC, created_at ASC;`,
      [order.id]
    );

    return res.json({
      success: true,
      data: {
        ...order,
        items: itemsRes.rows,
        histories: historiesRes.rows,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/orders
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      customer_name,
      customer_phone,
      customer_email = '',
      recipient_name,
      fulfillment_type = 'COD_MEETUP_POINT',
      shipping_address = '',
      courier_name = null,
      cod_meetup_id = null,
      cod_notes = '',
      coupon_code = null,
      redeem_points = 0,
      user_id = null,
      payment_method = 'MIDTRANS_SNAP_QRIS',
      theme_used = 'TEMA_A_KOREAN_PASTEL',
      items = [],
    } = req.body;

    if (!customer_name || !customer_phone || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Data pesanan tidak lengkap (nama, nomor telepon, dan item belanja wajib).',
      });
    }

    const cleanCouponCode = coupon_code ? String(coupon_code).trim().toUpperCase() : null;
    const pointsToRedeem = Math.max(0, parseInt(redeem_points || '0', 10));

    // 🔒 Enforce Exclusive Rule: PRD 7.17 (Hanya 1 Kupon ATAU 1 Redeem Poin per order)
    if (cleanCouponCode && pointsToRedeem > 0) {
      return res.status(400).json({
        success: false,
        error: 'Kupon diskon dan Flower Points tidak dapat digunakan bersamaan dalam satu pesanan. Pilih salah satu.',
      });
    }

    if (pointsToRedeem > 0 && (pointsToRedeem < 10 || pointsToRedeem % 10 !== 0)) {
      return res.status(400).json({
        success: false,
        error: 'Penukaran Flower Points harus minimal 10 poin dan kelipatan 10 (10 poin = Rp 5.000).',
      });
    }

    await client.query('BEGIN');

    // 1. Capacity Throttling Check (Daily PO Quota)
    const settingsRes = await client.query('SELECT daily_po_limit FROM store_settings LIMIT 1;');
    const dailyLimit = settingsRes.rows[0]?.daily_po_limit || 25;

    const todayOrdersRes = await client.query(
      `SELECT COUNT(*)::int as count FROM orders WHERE created_at >= CURRENT_DATE AND order_status != 'CANCELLED';`
    );
    const todayCount = todayOrdersRes.rows[0]?.count || 0;

    if (todayCount >= dailyLimit) {
      throw new Error(`Kuota Pre-Order hari ini telah penuh (${todayCount}/${dailyLimit} pesanan). Silakan memesan kembali untuk slot pengiriman besok.`);
    }

    const productIds = items.map((i: any) => i.product_id).filter(Boolean);
    const prodRes = await client.query(
      `SELECT id, name, price, discount_price, raw_cost_hpp, stock, is_active FROM products WHERE id = ANY($1) FOR UPDATE;`,
      [productIds]
    );
    const productMap = new Map<string, any>();
    prodRes.rows.forEach((p) => productMap.set(p.id, p));

    let calculatedSubtotal = 0;
    let calculatedHpp = 0;
    const orderItemsToInsert: any[] = [];

    for (const item of items) {
      const prod = productMap.get(item.product_id);
      if (!prod || !prod.is_active) {
        throw new Error(`Produk dengan ID ${item.product_id} tidak tersedia.`);
      }
      const qty = Math.max(1, parseInt(item.quantity || '1', 10));
      if (prod.stock < qty) {
        throw new Error(`Stok untuk "${prod.name}" tidak mencukupi (sisa ${prod.stock}).`);
      }

      const unitPrice = prod.discount_price ? Number(prod.discount_price) : Number(prod.price);
      const unitHpp = Number(prod.raw_cost_hpp);
      const itemSubtotal = unitPrice * qty;
      const itemHppTotal = unitHpp * qty;

      calculatedSubtotal += itemSubtotal;
      calculatedHpp += itemHppTotal;

      orderItemsToInsert.push({
        product_id: prod.id,
        product_name: prod.name,
        price: unitPrice,
        raw_cost_hpp: unitHpp,
        quantity: qty,
        subtotal: itemSubtotal,
        custom_specs_json: item.custom_specs_json || null,
      });

      // Atomic Inventory Decrement Lock
      const updateStockRes = await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING stock;`,
        [qty, prod.id]
      );
      if (updateStockRes.rowCount === 0) {
        throw new Error(`Stok untuk produk "${prod.name}" tidak mencukupi untuk memenuhi pesanan.`);
      }
    }

    let discountAmount = 0;
    let appliedCouponId: string | null = null;

    if (cleanCouponCode) {
      const coupRes = await client.query(
        `SELECT * FROM coupons WHERE UPPER(code) = $1 AND is_active = true FOR UPDATE;`,
        [cleanCouponCode]
      );
      if (coupRes.rows.length > 0) {
        const coup = coupRes.rows[0];
        if (coup.expires_at && new Date(coup.expires_at).getTime() < Date.now()) {
          throw new Error(`Kupon "${coup.code}" telah kadaluarsa.`);
        }
        if (coup.used_count >= coup.quota) {
          throw new Error(`Kuota kupon "${coup.code}" telah habis.`);
        }
        if (calculatedSubtotal < Number(coup.min_order_amount)) {
          throw new Error(
            `Minimal belanja untuk menggunakan kupon "${coup.code}" adalah Rp ${Number(coup.min_order_amount).toLocaleString('id-ID')}.`
          );
        }
        appliedCouponId = coup.id;
        if (coup.discount_type === 'PERCENTAGE') {
          discountAmount = Math.round((calculatedSubtotal * Number(coup.discount_value)) / 100);
        } else if (coup.discount_type === 'FIXED_AMOUNT') {
          discountAmount = Math.min(calculatedSubtotal, Number(coup.discount_value));
        } else if (coup.discount_type === 'FREE_SHIPPING') {
          discountAmount = Number(coup.discount_value) > 0 ? Number(coup.discount_value) : 15000;
        }
        await client.query(`UPDATE coupons SET used_count = used_count + 1 WHERE id = $1;`, [coup.id]);
      } else {
        throw new Error(`Kupon "${cleanCouponCode}" tidak ditemukan atau sudah tidak aktif.`);
      }
    } else if (pointsToRedeem > 0) {
      // 10 poin = Rp 5.000 (Rp 500 / poin)
      const calculatedPointsDiscount = (pointsToRedeem / 10) * 5000;
      discountAmount = Math.min(calculatedSubtotal, calculatedPointsDiscount);
    }

    const totalAmount = Math.max(0, calculatedSubtotal - discountAmount);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${dateStr}-${randomSuffix}`;

    let validPaymentMethod = 'MIDTRANS_SNAP_QRIS';
    if (payment_method === 'MANUAL_BANK_BCA') validPaymentMethod = 'MANUAL_BANK_BCA';
    else if (payment_method === 'COD_CASH_ON_DELIVERY') validPaymentMethod = 'COD_CASH_ON_DELIVERY';

    let validFulfillment = 'COD_MEETUP_POINT';
    if (fulfillment_type === 'COURIER_EXPEDITION') validFulfillment = 'COURIER_EXPEDITION';

    const insertOrderSql = `
      INSERT INTO orders (
        id, customer_name, customer_phone, customer_email, recipient_name,
        fulfillment_type, shipping_address, courier_name, cod_meetup_id, cod_notes,
        total_amount, discount_amount, coupon_id, points_redeemed, total_hpp_cost,
        payment_method, payment_status, order_status, current_step,
        theme_used, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, 'UNPAID', 'PAYMENT_CONFIRMED', 1,
        $17, NOW(), NOW()
      )
      RETURNING *;
    `;

    const orderRes = await client.query(insertOrderSql, [
      invoiceNumber,
      customer_name,
      customer_phone,
      customer_email,
      recipient_name || customer_name,
      validFulfillment,
      shipping_address || null,
      courier_name || null,
      cod_meetup_id || null,
      cod_notes || null,
      totalAmount,
      discountAmount,
      appliedCouponId,
      pointsToRedeem,
      calculatedHpp,
      validPaymentMethod,
      theme_used,
    ]);

    const newOrder = orderRes.rows[0];

    // Deduct points & record redeem transaction if points were used
    if (pointsToRedeem > 0) {
      let matchedUserId = user_id;
      if (!matchedUserId && customer_phone) {
        const cleanPhone = customer_phone.replace(/[^0-9]/g, '');
        const uRes = await client.query(
          `SELECT id FROM users WHERE phone LIKE $1 OR phone = $2 LIMIT 1;`,
          [`%${cleanPhone}%`, customer_phone]
        );
        if (uRes.rows.length > 0) {
          matchedUserId = uRes.rows[0].id;
        }
      }

      if (matchedUserId) {
        await client.query(
          `UPDATE profiles SET flower_points = GREATEST(0, flower_points - $1) WHERE id = $2;`,
          [pointsToRedeem, matchedUserId]
        );
      }

      const fptId = `fpt-rdm-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      await client.query(
        `INSERT INTO flower_point_transactions (id, user_id, order_id, type, points, description, created_at)
         VALUES ($1, $2, $3, 'REDEEM', $4, $5, NOW());`,
        [
          fptId,
          matchedUserId || customer_phone,
          newOrder.id,
          -pointsToRedeem,
          `Penukaran ${pointsToRedeem} Flower Points untuk diskon Rp ${discountAmount.toLocaleString('id-ID')} pada invoice ${newOrder.id}`,
        ]
      );
    }

    for (const oi of orderItemsToInsert) {
      await client.query(
        `INSERT INTO order_items (
          order_id, product_id, product_name, price, raw_cost_hpp, quantity, subtotal, custom_specs_json
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [
          newOrder.id,
          oi.product_id,
          oi.product_name,
          oi.price,
          oi.raw_cost_hpp,
          oi.quantity,
          oi.subtotal,
          oi.custom_specs_json,
        ]
      );
    }

    await client.query(
      `INSERT INTO order_status_histories (
        order_id, step_number, status_title, status_desc, action_by, created_at
      ) VALUES (
        $1, 1, 'Pembayaran Terkonfirmasi',
        'Pesanan telah terverifikasi dan masuk antrean florist atelier.', 'System', NOW()
      );`,
      [newOrder.id]
    );

    await client.query('COMMIT');

    // 🔔 Fire-and-forget WhatsApp notification (PRD 7.19: ORDER_CREATED)
    sendOrderNotification('ORDER_CREATED', {
      phone: customer_phone,
      invoice: invoiceNumber,
      orderId: newOrder.id,
      leadTime: '1-2 hari kerja',
      portalUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/portal`,
    }).catch(() => {}); // swallow — notification failure must not affect order flow

    let snapToken: string | null = null;
    let redirectUrl: string | null = null;

    if (validPaymentMethod === 'MIDTRANS_SNAP_QRIS') {
      const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxxxx';
      const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
      const SNAP_API_URL = IS_PRODUCTION
        ? 'https://app.midtrans.com/snap/v1/transactions'
        : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
      const isPlaceholderKey = !MIDTRANS_SERVER_KEY || MIDTRANS_SERVER_KEY.includes('xxxx');

      if (!isPlaceholderKey) {
        try {
          const authHeader = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');
          const mtResponse = await fetch(SNAP_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Basic ${authHeader}`,
            },
            body: JSON.stringify({
              transaction_details: {
                order_id: newOrder.id,
                gross_amount: Math.round(totalAmount),
              },
              customer_details: {
                first_name: customer_name,
                phone: customer_phone,
                email: customer_email || `${customer_phone.replace(/\D/g, '')}@chenille-customer.com`,
              },
              item_details: orderItemsToInsert.length > 0 ? orderItemsToInsert.map((it: any) => ({
                id: it.product_id,
                price: Math.round(it.price),
                quantity: it.quantity,
                name: (it.product_name || 'Buket Bunga').slice(0, 50),
              })) : [{ id: newOrder.id, price: Math.round(totalAmount), quantity: 1, name: 'Buket Chenille' }],
            }),
          });
          if (mtResponse.ok) {
            const mtData: any = await mtResponse.json();
            snapToken = mtData.token;
            redirectUrl = mtData.redirect_url;
          }
        } catch (e) {
          console.warn('Midtrans Snap call failed, falling back to mock snap token:', e);
        }
      }

      if (!snapToken) {
        snapToken = `SNAP-MOCK-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
        redirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`;
      }

      try {
        await pool.query(
          `INSERT INTO payment_transactions (
            id, order_id, gateway_type, amount, status, snap_token, payment_url, created_at
          ) VALUES ($1, $2, 'MIDTRANS_SNAP_QRIS', $3, 'UNPAID', $4, $5, NOW())
          ON CONFLICT (id) DO UPDATE SET
            snap_token = EXCLUDED.snap_token,
            payment_url = EXCLUDED.payment_url;`,
          [`TX-${newOrder.id}`, newOrder.id, Math.round(totalAmount), snapToken, redirectUrl]
        );
      } catch (txErr) {
        console.warn('Could not record payment_transactions in orders.routes:', txErr);
      }
    }

    return res.json({
      success: true,
      data: {
        ...newOrder,
        items: orderItemsToInsert,
        snap_token: snapToken,
        redirect_url: redirectUrl,
      },
      message: 'Pesanan berhasil dibuat di database Supabase.',
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    return res.status(400).json({ success: false, error: error.message || 'Gagal membuat pesanan.' });
  } finally {
    client.release();
  }
});

// PATCH /api/v1/orders/:id
router.patch('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { step, current_step, order_status, tracking_number, courier_name, note } = req.body;
    const stepMap: Record<number, { status: string; title: string; desc: string }> = {
      1: {
        status: 'PAYMENT_CONFIRMED',
        title: 'Pembayaran Terkonfirmasi',
        desc: 'Pembayaran telah diverifikasi. Pesanan masuk antrean perangkaian florist atelier.',
      },
      2: {
        status: 'CRAFTING_BOUQUET',
        title: 'Sedang Dirangkai Pengrajin',
        desc: 'Florist ahli atelier sedang merangkai tangkai kawat bulu pesanan Anda dengan penuh ketelitian.',
      },
      3: {
        status: 'QUALITY_CHECK_PASSED',
        title: 'Lolos Quality Check & Siap Kirim',
        desc: 'Buket telah lolos inspeksi kerapian, kelopak simetris, dan pengemasan kardus aman.',
      },
      4: {
        status: 'COMPLETED',
        title: 'Pesanan Selesai / Terkirim',
        desc: 'Buket telah sampai dan diterima dengan kondisi mekar sempurna di tangan pelanggan.',
      },
    };

    const rawStep = step ?? current_step;
    const targetStep = rawStep ? parseInt(rawStep, 10) : null;
    const targetInfo = targetStep && stepMap[targetStep] ? stepMap[targetStep] : null;

    await client.query('BEGIN');

    const updates: string[] = ['updated_at = NOW()'];
    const values: any[] = [];
    let idx = 1;

    if (targetStep) {
      updates.push(`current_step = $${idx}`);
      values.push(targetStep);
      idx++;
    }

    if (targetInfo) {
      updates.push(`order_status = $${idx}`);
      values.push(targetInfo.status);
      idx++;
    } else if (order_status) {
      updates.push(`order_status = $${idx}`);
      values.push(order_status);
      idx++;
    }

    if (tracking_number !== undefined) {
      updates.push(`tracking_number = $${idx}`);
      values.push(tracking_number);
      idx++;
    }

    if (courier_name !== undefined) {
      updates.push(`courier_name = $${idx}`);
      values.push(courier_name);
      idx++;
    }

    values.push(id);
    const updateSql = `
      UPDATE orders
      SET ${updates.join(', ')}
      WHERE id = $${idx}
      RETURNING *;
    `;
    const updateRes = await client.query(updateSql, values);

    if (updateRes.rows.length === 0) {
      throw new Error('Pesanan tidak ditemukan.');
    }

    if (targetInfo) {
      await client.query(
        `INSERT INTO order_status_histories (
          order_id, step_number, status_title, status_desc, action_by, created_at
        ) VALUES ($1, $2, $3, $4, 'Admin', NOW());`,
        [id, targetStep, targetInfo.title, note || targetInfo.desc]
      );
    }

    // Restore stock if cancelled
    if (order_status === 'CANCELLED') {
      const itemsToRestore = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1;', [id]);
      for (const it of itemsToRestore.rows) {
        if (it.product_id) {
          await client.query('UPDATE products SET stock = stock + $1 WHERE id = $2;', [it.quantity, it.product_id]);
        }
      }
    }

    // 🌸 Award Flower Points when Order reaches step 4 (COMPLETED)
    let pointsAwarded = 0;
    if (targetStep === 4) {
      // 1 point per Rp 10.000 (minimum 1 point)
      const earned = Math.max(1, Math.floor(Number(updateRes.rows[0].total_amount) / 10000));
      pointsAwarded = earned;

      // Ensure not double-awarded
      const checkAwarded = await client.query(
        `SELECT id FROM flower_point_transactions WHERE order_id = $1 AND type = 'EARN' LIMIT 1;`,
        [id]
      );

      if (checkAwarded.rows.length === 0) {
        await client.query(`UPDATE orders SET points_earned = $1 WHERE id = $2;`, [earned, id]);

        let targetUserId = updateRes.rows[0].user_id;
        if (!targetUserId && updateRes.rows[0].customer_phone) {
          const cleanPhone = updateRes.rows[0].customer_phone.replace(/[^0-9]/g, '');
          const uRes = await client.query(
            `SELECT id FROM users WHERE phone LIKE $1 OR phone = $2 LIMIT 1;`,
            [`%${cleanPhone}%`, updateRes.rows[0].customer_phone]
          );
          if (uRes.rows.length > 0) {
            targetUserId = uRes.rows[0].id;
          }
        }

        if (targetUserId) {
          await client.query(
            `UPDATE profiles SET flower_points = flower_points + $1 WHERE id = $2;`,
            [earned, targetUserId]
          );
        }

        const earnTxId = `fpt-earn-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
        await client.query(
          `INSERT INTO flower_point_transactions (id, user_id, order_id, type, points, description, created_at)
           VALUES ($1, $2, $3, 'EARN', $4, $5, NOW());`,
          [
            earnTxId,
            targetUserId || updateRes.rows[0].customer_phone || 'guest',
            id,
            earned,
            `Reward +${earned} Flower Points atas pesanan selesai (${id})`,
          ]
        );
      }
    }

    await client.query('COMMIT');

    // 🔔 Fire-and-forget WhatsApp notifications (PRD 7.19: Status Update Events)
    const updatedOrder = updateRes.rows[0];
    const customerPhone = updatedOrder.customer_phone;
    const invoiceId = updatedOrder.id;

    if (customerPhone) {
      // Map step changes to notification events
      if (targetStep === 2) {
        sendOrderNotification('CRAFTING_STARTED', {
          phone: customerPhone,
          invoice: invoiceId,
          orderId: invoiceId,
          etd: 'hari ini',
        }).catch(() => {});
      } else if (targetStep === 3) {
        sendOrderNotification('QUALITY_CHECK', {
          phone: customerPhone,
          invoice: invoiceId,
          orderId: invoiceId,
        }).catch(() => {});
      } else if (targetStep === 4) {
        sendOrderNotification('COMPLETED', {
          phone: customerPhone,
          invoice: invoiceId,
          orderId: invoiceId,
          points: pointsAwarded || 10,
        }).catch(() => {});
      }

      // Tracking number updated = IN_DELIVERY
      if (tracking_number && tracking_number !== updatedOrder.tracking_number) {
        sendOrderNotification('IN_DELIVERY', {
          phone: customerPhone,
          invoice: invoiceId,
          orderId: invoiceId,
          awb: tracking_number,
        }).catch(() => {});
      }
    }

    return res.json({
      success: true,
      data: updatedOrder,
      message: 'Status pesanan berhasil diperbarui.',
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating order:', error);
    return res.status(500).json({ success: false, error: error.message || 'Gagal memperbarui pesanan.' });
  } finally {
    client.release();
  }
});

export default router;
