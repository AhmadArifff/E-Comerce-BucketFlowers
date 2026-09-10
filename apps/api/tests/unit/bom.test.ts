import { describe, it, expect } from 'vitest';
import { calculateBOM, type BomMaterial } from '../../src/lib/bom.js';

describe('BOM Calculator Unit Tests (PRD 7.4 & 14.1)', () => {
  const standardRecipe: BomMaterial[] = [
    { material: 'Batang Kawat Bulu Burgundy (6mm)', qty: 36, unit: 'Batang', pricePerUnit: 350 }, // 12,600
    { material: 'Batang Kawat Bulu Hijau Zaitun (6mm)', qty: 12, unit: 'Batang', pricePerUnit: 350 }, // 4,200
    { material: 'Kawat Batang Penyangga Hijau No. 18', qty: 12, unit: 'Batang', pricePerUnit: 500 }, // 6,000
    { material: 'Cellophane Korean Matte Maroon Gold', qty: 2, unit: 'Lembar', pricePerUnit: 4500 }, // 9,000
    { material: 'Pita Satin Burgundy Mewah 2.5cm', qty: 1.5, unit: 'Meter', pricePerUnit: 2200 }, // 3,300
    { material: 'Boneka Wisuda Ber-toga 10cm', qty: 1, unit: 'Pcs', pricePerUnit: 7400 }, // 7,400
  ];
  // Total HPP = 12600 + 4200 + 6000 + 9000 + 3300 + 7400 = 42,500

  it('should accurately calculate total HPP from multi-item raw materials', () => {
    const sellingPrice = 119000;
    const result = calculateBOM(standardRecipe, sellingPrice);

    expect(result.totalHpp).toBe(42500);
    expect(result.sellingPrice).toBe(119000);
    expect(result.grossProfit).toBe(76500); // 119,000 - 42,500
    expect(result.marginPercent).toBe(64); // round((76500 / 119000) * 100) = 64%
    expect(result.isPriceBelowHpp).toBe(false);
    expect(result.itemCount).toBe(6);
  });

  it('should handle fractional quantities accurately (e.g. 1.5 meter ribbon)', () => {
    const singleRecipe: BomMaterial[] = [
      { material: 'Pita Satin Premium', qty: 1.5, unit: 'Meter', pricePerUnit: 2200 },
    ];
    const result = calculateBOM(singleRecipe, 10000);

    expect(result.totalHpp).toBe(3300);
    expect(result.grossProfit).toBe(6700);
    expect(result.marginPercent).toBe(67);
  });

  it('should handle empty recipe edge case (0 items)', () => {
    const result = calculateBOM([], 95000);

    expect(result.totalHpp).toBe(0);
    expect(result.sellingPrice).toBe(95000);
    expect(result.grossProfit).toBe(95000);
    expect(result.marginPercent).toBe(100);
    expect(result.isPriceBelowHpp).toBe(false);
    expect(result.itemCount).toBe(0);
  });

  it('should detect when selling price is below HPP (loss warning)', () => {
    const sellingPrice = 35000; // below 42,500 HPP
    const result = calculateBOM(standardRecipe, sellingPrice);

    expect(result.totalHpp).toBe(42500);
    expect(result.grossProfit).toBe(-7500);
    expect(result.marginPercent).toBe(-21);
    expect(result.isPriceBelowHpp).toBe(true);
  });

  it('should handle zero selling price gracefully without NaN division', () => {
    const result = calculateBOM(standardRecipe, 0);

    expect(result.totalHpp).toBe(42500);
    expect(result.sellingPrice).toBe(0);
    expect(result.grossProfit).toBe(-42500);
    expect(result.marginPercent).toBe(-100);
    expect(result.isPriceBelowHpp).toBe(true);
  });
});
