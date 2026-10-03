import type pg from 'pg';
import { pool } from '../config/database.js';

// ============================================================================
// BOM Material Deduction & Warehouse Inventory Service (PRD Seksi 29 & 31)
// ============================================================================

export interface DeductedMaterial {
  materialId: string;
  materialName: string;
  qtyDeducted: number;
  remainingStock: number;
  minStock: number;
  unit: string;
  isLowStock: boolean;
}

export interface MaterialDeductionResult {
  success: boolean;
  deductedItems: DeductedMaterial[];
  lowStockAlerts: DeductedMaterial[];
  totalDeductionsCount: number;
}

/**
 * Deduct raw materials for an order when crafting begins (Langkah 2: CRAFTING_BOUQUET)
 * Idempotent: Only deducts if is_materials_deducted is false.
 */
export async function deductMaterialsForOrder(
  client: pg.PoolClient | typeof pool,
  orderId: string
): Promise<MaterialDeductionResult> {
  // 1. Check order status and idempotency flag
  const orderRes = await client.query(
    `SELECT id, is_materials_deducted FROM orders WHERE id = $1 LIMIT 1;`,
    [orderId]
  );

  if (orderRes.rows.length === 0) {
    throw new Error(`Pesanan #${orderId} tidak ditemukan.`);
  }

  if (orderRes.rows[0].is_materials_deducted) {
    console.log(`[BOM Service] Pesanan #${orderId} bahan baku sudah pernah dipotong (skip).`);
    return {
      success: true,
      deductedItems: [],
      lowStockAlerts: [],
      totalDeductionsCount: 0,
    };
  }

  // 2. Fetch order items
  const itemsRes = await client.query(
    `SELECT id, product_id, product_name, quantity, custom_specs_json
     FROM order_items
     WHERE order_id = $1;`,
    [orderId]
  );

  const orderItems = itemsRes.rows;
  const deductedItems: DeductedMaterial[] = [];
  const lowStockAlerts: DeductedMaterial[] = [];

  for (const item of orderItems) {
    const itemQty = Number(item.quantity) || 1;

    if (item.product_id) {
      // Catalog Product: Query exact Bill of Materials recipe
      const bomRes = await client.query(
        `SELECT 
           bom.raw_material_id, 
           bom.quantity_needed, 
           rm.name as material_name, 
           rm.stock, 
           rm.min_stock,
           rm.unit
         FROM bill_of_materials bom
         JOIN raw_materials rm ON bom.raw_material_id = rm.id
         WHERE bom.product_id = $1;`,
        [item.product_id]
      );

      for (const bom of bomRes.rows) {
        const totalNeeded = Number(bom.quantity_needed) * itemQty;

        const updateMatRes = await client.query(
          `UPDATE raw_materials
           SET stock = GREATEST(0, stock - $1), updated_at = NOW()
           WHERE id = $2
           RETURNING id, name, stock, min_stock, unit;`,
          [totalNeeded, bom.raw_material_id]
        );

        if (updateMatRes.rows.length > 0) {
          const updated = updateMatRes.rows[0];
          const isLow = Number(updated.stock) <= Number(updated.min_stock);

          const entry: DeductedMaterial = {
            materialId: updated.id,
            materialName: updated.name,
            qtyDeducted: totalNeeded,
            remainingStock: Number(updated.stock),
            minStock: Number(updated.min_stock),
            unit: updated.unit,
            isLowStock: isLow,
          };

          deductedItems.push(entry);

          if (isLow) {
            lowStockAlerts.push(entry);
            console.warn(
              `[BOM Alert] ⚠️ Low Stock: ${updated.name} (${updated.id}) remaining: ${updated.stock} ${updated.unit} (min: ${updated.min_stock})`
            );
          }
        }
      }
    } else if (item.custom_specs_json) {
      // Custom Studio Item: Deduct standard artisanal bouquet components
      // Default: 20 batang kawat bulu, 5 batang kawat no. 18, 1 lembar cellophane, 1 meter pita
      const customSpecs = item.custom_specs_json;
      const flowerColor = (customSpecs.color || '').toLowerCase();

      // Find matching velvet pipe cleaner by color or fallback
      let wireMatId = 'mat-3'; // Default Pastel Pink
      if (flowerColor.includes('burgundy') || flowerColor.includes('merah')) {
        wireMatId = 'mat-1';
      } else if (flowerColor.includes('hijau') || flowerColor.includes('zaitun')) {
        wireMatId = 'mat-2';
      }

      const customBOM = [
        { materialId: wireMatId, qty: 20 * itemQty },
        { materialId: 'mat-4', qty: 5 * itemQty }, // Batang Penyangga
        { materialId: 'mat-5', qty: 1 * itemQty }, // Cellophane
        { materialId: 'mat-7', qty: 1 * itemQty }, // Pita Satin
      ];

      for (const comp of customBOM) {
        const updateMatRes = await client.query(
          `UPDATE raw_materials
           SET stock = GREATEST(0, stock - $1), updated_at = NOW()
           WHERE id = $2
           RETURNING id, name, stock, min_stock, unit;`,
          [comp.qty, comp.materialId]
        );

        if (updateMatRes.rows.length > 0) {
          const updated = updateMatRes.rows[0];
          const isLow = Number(updated.stock) <= Number(updated.min_stock);

          const entry: DeductedMaterial = {
            materialId: updated.id,
            materialName: updated.name,
            qtyDeducted: comp.qty,
            remainingStock: Number(updated.stock),
            minStock: Number(updated.min_stock),
            unit: updated.unit,
            isLowStock: isLow,
          };

          deductedItems.push(entry);

          if (isLow) {
            lowStockAlerts.push(entry);
          }
        }
      }
    }
  }

  // 3. Mark order as materials deducted
  await client.query(
    `UPDATE orders SET is_materials_deducted = true WHERE id = $1;`,
    [orderId]
  );

  console.log(
    `[BOM Service] ✅ Pemotongan bahan baku untuk pesanan #${orderId} selesai: ${deductedItems.length} jenis bahan terpotong.`
  );

  return {
    success: true,
    deductedItems,
    lowStockAlerts,
    totalDeductionsCount: deductedItems.length,
  };
}

/**
 * Restore raw materials when an order is CANCELLED after crafting had started
 */
export async function restoreMaterialsForOrder(
  client: pg.PoolClient | typeof pool,
  orderId: string
): Promise<{ success: boolean; restoredCount: number }> {
  const orderRes = await client.query(
    `SELECT id, is_materials_deducted FROM orders WHERE id = $1 LIMIT 1;`,
    [orderId]
  );

  if (orderRes.rows.length === 0 || !orderRes.rows[0].is_materials_deducted) {
    return { success: true, restoredCount: 0 };
  }

  // 1. Restore catalog items BOM
  const catalogRestoreRes = await client.query(
    `UPDATE raw_materials rm
     SET stock = rm.stock + (bom.quantity_needed * oi.quantity), updated_at = NOW()
     FROM bill_of_materials bom
     JOIN order_items oi ON oi.product_id = bom.product_id
     WHERE oi.order_id = $1 AND rm.id = bom.raw_material_id
     RETURNING rm.id;`,
    [orderId]
  );

  // 2. Mark order is_materials_deducted as false
  await client.query(
    `UPDATE orders SET is_materials_deducted = false WHERE id = $1;`,
    [orderId]
  );

  console.log(
    `[BOM Service] 🔄 Restored raw materials for cancelled order #${orderId} (${catalogRestoreRes.rowCount} materials restored).`
  );

  return {
    success: true,
    restoredCount: catalogRestoreRes.rowCount || 0,
  };
}

/**
 * Get detailed BOM materials breakdown and stock status for an order
 */
export async function getOrderMaterialsBreakdown(
  orderId: string
): Promise<{
  orderId: string;
  isMaterialsDeducted: boolean;
  materials: Array<{
    materialId: string;
    materialName: string;
    qtyRequired: number;
    unit: string;
    currentStock: number;
    minStock: number;
    isStockSufficient: boolean;
  }>;
}> {
  const orderRes = await pool.query(
    `SELECT id, is_materials_deducted FROM orders WHERE id = $1 LIMIT 1;`,
    [orderId]
  );

  if (orderRes.rows.length === 0) {
    throw new Error(`Pesanan #${orderId} tidak ditemukan.`);
  }

  const isDeducted = Boolean(orderRes.rows[0].is_materials_deducted);

  const materialsRes = await pool.query(
    `SELECT 
       rm.id as material_id,
       rm.name as material_name,
       SUM(bom.quantity_needed * oi.quantity)::int as qty_required,
       rm.unit,
       rm.stock as current_stock,
       rm.min_stock
     FROM order_items oi
     JOIN bill_of_materials bom ON oi.product_id = bom.product_id
     JOIN raw_materials rm ON bom.raw_material_id = rm.id
     WHERE oi.order_id = $1
     GROUP BY rm.id, rm.name, rm.unit, rm.stock, rm.min_stock
     ORDER BY rm.name ASC;`,
    [orderId]
  );

  return {
    orderId,
    isMaterialsDeducted: isDeducted,
    materials: materialsRes.rows.map((row) => ({
      materialId: row.material_id,
      materialName: row.material_name,
      qtyRequired: Number(row.qty_required),
      unit: row.unit,
      currentStock: Number(row.current_stock),
      minStock: Number(row.min_stock),
      isStockSufficient: Number(row.current_stock) >= Number(row.qty_required),
    })),
  };
}
