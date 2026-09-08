import { NextRequest, NextResponse } from 'next/server';
import { transaction, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const phone = searchParams.get('phone');
    const search = searchParams.get('search');
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '50', 10)));

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
    const res = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: res.rows,
    });
  } catch (error) {
    console.error('Error listing orders:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data pesanan.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_phone,
      customer_email = '',
      recipient_name,
      fulfillment_type = 'COD_MEETUP_POINT',
      shipping_address = '',
      cod_meetup_id = null,
      cod_notes = '',
      coupon_code = null,
      payment_method = 'MIDTRANS_SNAP_QRIS',
      theme_used = 'TEMA_A_KOREAN_PASTEL',
      items = [],
    } = body;

    if (!customer_name || !customer_phone || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Data pesanan tidak lengkap (nama, nomor telepon, dan item belanja wajib).' },
        { status: 400 }
      );
    }

    // Atomic transaction: lock products, verify & decrement stock, calculate totals, insert order & items
    const createdOrder = await transaction(async (client) => {
      const productIds = items.map((i: any) => i.product_id).filter(Boolean);

      // 1. Lock products with FOR UPDATE
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

        // Decrement stock
        await client.query(`UPDATE products SET stock = stock - $1 WHERE id = $2;`, [qty, prod.id]);
      }

      // 2. Validate coupon if provided
      let discountAmount = 0;
      let appliedCouponId: string | null = null;

      if (coupon_code) {
        const coupRes = await client.query(
          `SELECT * FROM coupons WHERE code = $1 AND is_active = true FOR UPDATE;`,
          [coupon_code.toUpperCase().trim()]
        );
        if (coupRes.rows.length > 0) {
          const coup = coupRes.rows[0];
          if (coup.used_count < coup.quota && calculatedSubtotal >= Number(coup.min_order_amount)) {
            appliedCouponId = coup.id;
            if (coup.discount_type === 'PERCENTAGE') {
              discountAmount = Math.round((calculatedSubtotal * Number(coup.discount_value)) / 100);
            } else if (coup.discount_type === 'FIXED_AMOUNT') {
              discountAmount = Math.min(calculatedSubtotal, Number(coup.discount_value));
            } else if (coup.discount_type === 'FREE_SHIPPING') {
              discountAmount = 15000;
            }
            await client.query(`UPDATE coupons SET used_count = used_count + 1 WHERE id = $1;`, [coup.id]);
          }
        }
      }

      const totalAmount = Math.max(0, calculatedSubtotal - discountAmount);

      // 3. Generate unique order invoice
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const invoiceNumber = `INV-${dateStr}-${randomSuffix}`;

      // Map payment gateway enum
      let validPaymentMethod = 'MIDTRANS_SNAP_QRIS';
      if (payment_method === 'MANUAL_BANK_BCA') validPaymentMethod = 'MANUAL_BANK_BCA';
      else if (payment_method === 'COD_CASH_ON_DELIVERY') validPaymentMethod = 'COD_CASH_ON_DELIVERY';

      let validFulfillment = 'COD_MEETUP_POINT';
      if (fulfillment_type === 'COURIER_EXPEDITION') validFulfillment = 'COURIER_EXPEDITION';

      // 4. Insert Order
      const insertOrderSql = `
        INSERT INTO orders (
          id, customer_name, customer_phone, customer_email, recipient_name,
          fulfillment_type, shipping_address, cod_meetup_id, cod_notes,
          total_amount, discount_amount, coupon_id, total_hpp_cost,
          payment_method, payment_status, order_status, current_step,
          theme_used, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12, $13,
          $14, 'UNPAID', 'PAYMENT_CONFIRMED', 1,
          $15, NOW(), NOW()
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
        cod_meetup_id || null,
        cod_notes || null,
        totalAmount,
        discountAmount,
        appliedCouponId,
        calculatedHpp,
        validPaymentMethod,
        theme_used,
      ]);

      const newOrder = orderRes.rows[0];

      // 5. Insert Order Items
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

      // 6. Insert Initial Step History
      await client.query(
        `INSERT INTO order_status_histories (
          order_id, step_number, status_title, status_desc, action_by, created_at
        ) VALUES (
          $1, 1, 'Pembayaran Terkonfirmasi',
          'Pesanan telah terverifikasi dan masuk antrean florist atelier.', 'System', NOW()
        );`,
        [newOrder.id]
      );

      return {
        ...newOrder,
        items: orderItemsToInsert,
      };
    });

    return NextResponse.json({
      success: true,
      data: createdOrder,
      message: 'Pesanan berhasil dibuat di database Supabase.',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Gagal membuat pesanan.' },
      { status: 400 }
    );
  }
}
