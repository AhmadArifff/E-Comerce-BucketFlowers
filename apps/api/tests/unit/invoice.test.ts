import { describe, it, expect } from 'vitest';
import {
  generateInvoiceNumber,
  isValidInvoiceNumber,
  parseInvoiceDate,
} from '../../src/lib/invoice.js';

describe('Invoice Generator & Validator Unit Tests (PRD 7.5 & 14.1)', () => {
  it('should generate an invoice matching standard format INV-YYYYMMDD-XXXX', () => {
    const fixedDate = new Date(2026, 8, 7); // September 7, 2026
    const invoice = generateInvoiceNumber(fixedDate);

    expect(invoice).toMatch(/^INV-20260907-\d{4}$/);
    expect(isValidInvoiceNumber(invoice)).toBe(true);
  });

  it('should parse the embedded date from an invoice number', () => {
    const invoice = 'INV-20260907-4589';
    const parsedDate = parseInvoiceDate(invoice);

    expect(parsedDate).not.toBeNull();
    expect(parsedDate?.getFullYear()).toBe(2026);
    expect(parsedDate?.getMonth()).toBe(8); // 8 is September in 0-indexed months
    expect(parsedDate?.getDate()).toBe(7);
  });

  it('should accept legacy format INV/20260907/FLW-0001', () => {
    const legacyInvoice = 'INV/20260907/FLW-0001';
    expect(isValidInvoiceNumber(legacyInvoice)).toBe(true);

    const parsed = parseInvoiceDate(legacyInvoice);
    expect(parsed).not.toBeNull();
    expect(parsed?.getFullYear()).toBe(2026);
  });

  it('should reject invalid invoice strings', () => {
    expect(isValidInvoiceNumber('')).toBe(false);
    expect(isValidInvoiceNumber('ORDER-12345')).toBe(false);
    expect(isValidInvoiceNumber('INV-2026-0001')).toBe(false);
    expect(isValidInvoiceNumber('INV-ABCDEFGH-1234')).toBe(false);
  });

  it('should generate distinct invoices across multiple calls', () => {
    const invoices = new Set<string>();
    const count = 500;

    for (let i = 0; i < count; i++) {
      invoices.add(generateInvoiceNumber());
    }

    // With 4 digits random suffix (9000 possibilities), 500 samples should have high uniqueness
    expect(invoices.size).toBeGreaterThan(450);
  });
});
