import type { MockOrder } from '@/stores/useOrderStore';

/**
 * Download CSV file with UTF-8 BOM (\uFEFF) for seamless Microsoft Excel and Google Sheets compatibility.
 * Prevents corrupted characters when opening in Indonesian / international Excel locale.
 */
export function downloadCsvWithBom(
  filename: string,
  headers: string[],
  rows: (string | number)[][],
  footerRow?: (string | number)[]
): void {
  if (typeof window === 'undefined') return;

  const BOM = '\uFEFF';
  const escapeCsv = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headerLine = headers.map(escapeCsv).join(',');
  const rowLines = rows.map((r) => r.map(escapeCsv).join(','));
  const lines = [headerLine, ...rowLines];
  if (footerRow && footerRow.length > 0) {
    lines.push(footerRow.map(escapeCsv).join(','));
  }

  const csvContent = BOM + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Export detailed list of orders to UTF-8 BOM CSV matching PRD Section 5 and GUIDE.md TC-ADM-18.
 */
export function exportOrdersToCsv(orders: MockOrder[], filenameSuffix?: string): boolean {
  if (!orders || orders.length === 0) {
    return false;
  }

  const headers = [
    'NO INVOICE',
    'TANGGAL',
    'NAMA PELANGGAN',
    'NO TELEPON',
    'DETAIL BUKET BUNGA',
    'LOGISTIK / COD',
    'STATUS BAYAR',
    'HPP BAHAN MENTAH (RP)',
    'HARGA JUAL (RP)',
    'LABA BERSIH (RP)',
    'MARGIN (%)',
    'STATUS PENGERJAAN',
  ];

  let totalOmzet = 0;
  let totalHpp = 0;

  const rows = orders.map((o) => {
    const omzet = o.totalAmount || 0;
    // Estimated / actual HPP based on BOM ratio (~42%) or subtotal
    const hpp = Math.round(omzet * 0.42);
    const netProfit = Math.max(0, omzet - hpp);
    const marginPct = omzet > 0 ? ((netProfit / omzet) * 100).toFixed(1) : '0.0';

    totalOmzet += omzet;
    totalHpp += hpp;

    const dateStr = o.createdAt
      ? new Date(o.createdAt).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '-';

    const itemsSummary = Array.isArray(o.items) && o.items.length > 0
      ? o.items.map((it) => `${it.quantity}x ${it.productName}`).join('; ')
      : '1x Buket Bunga Custom';

    const fulfillmentSummary =
      o.fulfillmentType === 'COD_MEETUP_POINT'
        ? `COD (${o.meetupPointName || 'Titik Temu'})`
        : `Kurir (${o.courierName || 'Ekspedisi'}${o.trackingNumber ? ` - Resi: ${o.trackingNumber}` : ''})`;

    return [
      o.invoiceNumber || o.id,
      dateStr,
      o.customerName || 'Pelanggan Atelier',
      o.customerPhone || '-',
      itemsSummary,
      fulfillmentSummary,
      o.paymentStatus || (o.currentStep >= 1 ? 'LUNAS' : 'MENUNGGU'),
      hpp,
      omzet,
      netProfit,
      `${marginPct}%`,
      o.statusLabel || 'Dalam Proses',
    ];
  });

  const totalLaba = Math.max(0, totalOmzet - totalHpp);
  const totalMarginPct = totalOmzet > 0 ? ((totalLaba / totalOmzet) * 100).toFixed(1) : '0.0';

  const footerRow = [
    'TOTAL KESELURUHAN',
    `${orders.length} Pesanan`,
    '',
    '',
    '',
    '',
    '',
    totalHpp,
    totalOmzet,
    totalLaba,
    `${totalMarginPct}%`,
    '',
  ];

  const dateTag = new Date().toISOString().slice(0, 10);
  const cleanSuffix = filenameSuffix ? `_${filenameSuffix.replace(/\s+/g, '_')}` : '';
  const filename = `Laporan_Pesanan_Chenille_${dateTag}${cleanSuffix}.csv`;

  downloadCsvWithBom(filename, headers, rows, footerRow);
  return true;
}

/**
 * Export monthly financial summary reports to UTF-8 BOM CSV.
 */
export function exportMonthlySummaryToCsv(
  reportsData: Array<{
    period: string;
    orders: number;
    omzetNum: number;
    hppNum: number;
    netNum: number;
    margin: string;
  }>,
  filenameSuffix?: string
): boolean {
  if (!reportsData || reportsData.length === 0) {
    return false;
  }

  const headers = [
    'PERIODE BULAN',
    'JUMLAH PESANAN',
    'OMZET BRUTO (RP)',
    'TOTAL HPP BAHAN (RP)',
    'ESTIMASI PACKING (RP)',
    'LABA BERSIH (RP)',
    'MARGIN (%)',
  ];

  let sumOrders = 0;
  let sumOmzet = 0;
  let sumHpp = 0;
  let sumNet = 0;

  const rows = reportsData.map((r) => {
    sumOrders += r.orders;
    sumOmzet += r.omzetNum;
    sumHpp += r.hppNum;
    sumNet += r.netNum;
    const packing = Math.round(r.omzetNum * 0.048);

    return [
      r.period,
      `${r.orders} Buket`,
      r.omzetNum,
      r.hppNum,
      packing,
      r.netNum,
      r.margin,
    ];
  });

  const overallMargin = sumOmzet > 0 ? `${((sumNet / sumOmzet) * 100).toFixed(1)}%` : '0.0%';

  const footerRow = [
    'TOTAL KESELURUHAN',
    `${sumOrders} Buket`,
    sumOmzet,
    sumHpp,
    Math.round(sumOmzet * 0.048),
    sumNet,
    overallMargin,
  ];

  const dateTag = new Date().toISOString().slice(0, 10);
  const cleanSuffix = filenameSuffix ? `_${filenameSuffix.replace(/\s+/g, '_')}` : '';
  const filename = `Laporan_Keuangan_Chenille_${dateTag}${cleanSuffix}.csv`;

  downloadCsvWithBom(filename, headers, rows, footerRow);
  return true;
}
