import { pool } from '../config/database.js';

async function runOptimization() {
  console.log('=== DATABASE INDEX OPTIMIZATION & TEST ORDER CLEANUP ===\n');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Clean up test orders (keeping Annisa Larasati orders: INV-20261003-9171 & INV-20261003-7504)
    const testOrderIds = [
      'INV-20261004-1262',
      'INV-20261004-3432',
      'INV-20261004-3685',
      'INV-20261003-7331',
    ];

    console.log('1. Cleaning up 4 test orders:', testOrderIds);
    await client.query('DELETE FROM payment_transactions WHERE order_id = ANY($1)', [testOrderIds]);
    await client.query('DELETE FROM order_status_histories WHERE order_id = ANY($1)', [testOrderIds]);
    await client.query('DELETE FROM order_items WHERE order_id = ANY($1)', [testOrderIds]);
    const deleteOrdersRes = await client.query('DELETE FROM orders WHERE id = ANY($1) RETURNING id', [testOrderIds]);
    console.log(`   Deleted ${deleteOrdersRes.rowCount} test orders successfully.`);

    // 2. Create high-impact B-Tree indexes on unindexed Foreign Keys & High-Frequency Query Paths
    console.log('\n2. Creating High-Performance Foreign Key & Composite Indexes...');

    const indexes = [
      { name: 'idx_order_status_histories_order_id', sql: 'CREATE INDEX IF NOT EXISTS idx_order_status_histories_order_id ON public.order_status_histories(order_id);' },
      { name: 'idx_order_items_product_id', sql: 'CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);' },
      { name: 'idx_orders_user_id', sql: 'CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);' },
      { name: 'idx_orders_cod_meetup_id', sql: 'CREATE INDEX IF NOT EXISTS idx_orders_cod_meetup_id ON public.orders(cod_meetup_id);' },
      { name: 'idx_orders_coupon_id', sql: 'CREATE INDEX IF NOT EXISTS idx_orders_coupon_id ON public.orders(coupon_id);' },
      { name: 'idx_product_images_product_id', sql: 'CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);' },
      { name: 'idx_bill_of_materials_product_id', sql: 'CREATE INDEX IF NOT EXISTS idx_bill_of_materials_product_id ON public.bill_of_materials(product_id);' },
      { name: 'idx_bill_of_materials_raw_mat', sql: 'CREATE INDEX IF NOT EXISTS idx_bill_of_materials_raw_mat ON public.bill_of_materials(raw_material_id);' },
      { name: 'idx_reviews_product_id', sql: 'CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);' },
      { name: 'idx_reviews_order_id', sql: 'CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON public.reviews(order_id);' },
      { name: 'idx_reviews_user_id', sql: 'CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);' },
      { name: 'idx_chat_messages_session_sent', sql: 'CREATE INDEX IF NOT EXISTS idx_chat_messages_session_sent ON public.chat_messages(session_id, sent_at DESC);' },
      { name: 'idx_chat_sessions_user_id', sql: 'CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);' },
      { name: 'idx_payment_transactions_order_id', sql: 'CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON public.payment_transactions(order_id);' },
      { name: 'idx_procurement_material', sql: 'CREATE INDEX IF NOT EXISTS idx_procurement_material ON public.procurement_orders(material_id);' },
      { name: 'idx_procurement_supplier', sql: 'CREATE INDEX IF NOT EXISTS idx_procurement_supplier ON public.procurement_orders(supplier_id);' },
    ];

    for (const idx of indexes) {
      await client.query(idx.sql);
      console.log(`   ✓ Created / Verified: ${idx.name}`);
    }

    await client.query('COMMIT');
    console.log('\nTransaction committed successfully.');

    // 3. Analyze tables for optimizer statistics update
    console.log('\n3. Updating Query Planner Statistics (ANALYZE)...');
    await client.query('ANALYZE orders;');
    await client.query('ANALYZE order_items;');
    await client.query('ANALYZE order_status_histories;');
    await client.query('ANALYZE chat_messages;');
    await client.query('ANALYZE products;');
    await client.query('ANALYZE bill_of_materials;');
    console.log('   ✓ Query planner statistics updated.');

    // 4. Verify remaining orders
    const remainingOrders = await client.query('SELECT id, customer_name, total_amount, order_status, current_step FROM orders ORDER BY created_at ASC;');
    console.log('\n4. Remaining Active Orders in Database:');
    console.table(remainingOrders.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Optimization failed, rolled back:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runOptimization().catch((e) => {
  console.error(e);
  process.exit(1);
});
