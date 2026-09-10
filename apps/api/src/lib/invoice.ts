/**
 * Invoice Generator & Validator
 * Standard: INV-YYYYMMDD-XXXX (4-digit random suffix or sequence)
 * Timezone: Asia/Jakarta (WIB) / ISO Date
 */

export function generateInvoiceNumber(date: Date = new Date()): string {
  // Format YYYYMMDD in WIB (UTC+7) or local
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `INV-${dateStr}-${randomSuffix}`;
}

export function isValidInvoiceNumber(invoice: string): boolean {
  if (!invoice || typeof invoice !== 'string') return false;
  // Accepts standard: INV-YYYYMMDD-XXXX or legacy INV/YYYYMMDD/FLW-XXXX
  return /^INV-\d{8}-\d{4}$/.test(invoice) || /^INV\/\d{8}\/[\w-]+$/.test(invoice);
}

export function parseInvoiceDate(invoice: string): Date | null {
  if (!isValidInvoiceNumber(invoice)) return null;
  const match = invoice.match(/INV[-/](\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}
