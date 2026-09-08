import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. KPI Aggregations from Orders
    const kpiSql = `
      SELECT 
        COALESCE(SUM(total_amount), 0)::float as total_revenue,
        COALESCE(SUM(total_hpp_cost), 0)::float as total_hpp,
        COALESCE(SUM(total_amount - total_hpp_cost), 0)::float as net_profit,
        COUNT(*)::int as total_orders
      FROM orders
      WHERE order_status != 'CANCELLED';
    `;
    const kpiRes = await query(kpiSql);
    const kpi = kpiRes.rows[0];

    // 2. Daily PO Slots
    const settingsRes = await query(`SELECT daily_po_limit FROM store_settings LIMIT 1;`);
    const dailyLimit = settingsRes.rows[0]?.daily_po_limit || 25;

    const todayOrdersRes = await query(`
      SELECT COUNT(*)::int as today_count
      FROM orders
      WHERE created_at >= CURRENT_DATE;
    `);
    const todayCount = todayOrdersRes.rows[0]?.today_count || 0;
    const poSlotsRemaining = Math.max(0, dailyLimit - todayCount);

    // 3. Average Rating
    const ratingRes = await query(`SELECT COALESCE(AVG(rating), 5.0)::float as avg_rating FROM products WHERE is_active = true;`);
    const avgRating = Number((ratingRes.rows[0]?.avg_rating || 4.9).toFixed(1));

    // 4. Low stock materials count
    const stockRes = await query(`SELECT COUNT(*)::int as low_stock FROM raw_materials WHERE stock <= min_stock;`);
    const lowStockCount = stockRes.rows[0]?.low_stock || 0;

    // 5. Recent 5 Orders
    const recentOrdersRes = await query(`
      SELECT 
        id, customer_name, customer_phone, total_amount::float as total_amount,
        fulfillment_type, order_status, current_step, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5;
    `);

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          totalRevenue: kpi.total_revenue,
          totalHpp: kpi.total_hpp,
          netProfit: kpi.net_profit,
          profitMargin: kpi.total_revenue > 0 ? Number(((kpi.net_profit / kpi.total_revenue) * 100).toFixed(1)) : 0,
          totalOrders: kpi.total_orders,
          poSlotsRemaining,
          dailyLimit,
          avgRating,
          lowStockCount,
        },
        recentOrders: recentOrdersRes.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard KPIs:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data KPI dashboard.' }, { status: 500 });
  }
}
