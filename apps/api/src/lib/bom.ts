export interface BomMaterial {
  material: string;
  qty: number;
  unit: string;
  pricePerUnit: number;
}

export interface BomCalculationResult {
  totalHpp: number;
  sellingPrice: number;
  grossProfit: number;
  marginPercent: number;
  isPriceBelowHpp: boolean;
  itemCount: number;
}

/**
 * Calculates Bill of Materials (BOM), HPP, gross profit, and margin percentage.
 * Complies with PRD Section 7.4 & 14.1.
 */
export function calculateBOM(
  materials: BomMaterial[],
  sellingPrice: number
): BomCalculationResult {
  const totalHpp = (materials || []).reduce((sum, item) => {
    const qty = Math.max(0, Number(item.qty) || 0);
    const price = Math.max(0, Number(item.pricePerUnit) || 0);
    return sum + qty * price;
  }, 0);

  const price = Math.max(0, Number(sellingPrice) || 0);
  const grossProfit = price - totalHpp;
  const marginPercent = price > 0 ? Math.round((grossProfit / price) * 100) : (totalHpp > 0 ? -100 : 0);
  const isPriceBelowHpp = price < totalHpp;

  return {
    totalHpp: Math.round(totalHpp),
    sellingPrice: price,
    grossProfit: Math.round(grossProfit),
    marginPercent,
    isPriceBelowHpp,
    itemCount: materials?.length || 0,
  };
}
