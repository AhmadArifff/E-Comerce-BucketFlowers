/**
 * WhatsApp Order & Formatting Utility (PRD Seksi 1 & 3)
 * Menstandarkan URL pemesanan langsung WhatsApp dan deep-link konfirmasi keranjang.
 */

export interface DirectProductWhatsAppParams {
  waNumber: string;
  productName: string;
  category?: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  greetingCardText?: string;
  isReadyStock?: boolean;
  poLeadDays?: number;
}

export interface CartWhatsAppItem {
  name: string;
  price: number;
  quantity: number;
  customSpecs?: string;
}

export interface CartWhatsAppParams {
  waNumber: string;
  items: CartWhatsAppItem[];
  subtotal: number;
  grandTotal: number;
  discountAmount?: number;
  pointsDiscount?: number;
  fulfillmentType: 'COD_MEETUP_POINT' | 'COURIER_EXPEDITION' | string;
  meetupPointName?: string;
  customerName?: string;
}

/**
 * Normalisasi nomor HP Indonesia ke format internasional WA (628...)
 */
export function normalizeWhatsAppNumber(rawPhone: string): string {
  if (!rawPhone) return '6281298317721';
  let cleaned = rawPhone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

/**
 * Membuat link WhatsApp untuk pemesanan langsung 1 produk dari detail modal
 */
export function formatDirectProductWhatsAppUrl(params: DirectProductWhatsAppParams): string {
  const cleanPhone = normalizeWhatsAppNumber(params.waNumber);
  const activePrice = params.discountPrice ?? params.price;
  const totalPrice = activePrice * params.quantity;

  const lines = [
    'Halo Atelier Chenille Flowers! 🌸',
    'Saya ingin memesan langsung buket kawat bulu dengan rincian berikut:',
    '',
    `• Buket: ${params.productName}${params.category ? ` (${params.category})` : ''}`,
    `• Jumlah: ${params.quantity} buket`,
    `• Harga Satuan: Rp ${activePrice.toLocaleString('id-ID')}`,
    `• Total Estimasi: Rp ${totalPrice.toLocaleString('id-ID')}`,
  ];

  if (params.greetingCardText && params.greetingCardText.trim()) {
    lines.push(`• Kartu Ucapan: "${params.greetingCardText.trim()}"`);
  }

  if (params.isReadyStock) {
    lines.push('• Status: Ready Stock (Siap Kirim / COD)');
  } else if (params.poLeadDays) {
    lines.push(`• Status: Pre-Order (~${params.poLeadDays} Hari Kerja)`);
  }

  lines.push('');
  lines.push('Apakah slot perakitan untuk buket ini masih tersedia hari ini? Terima kasih! ✨');

  const text = lines.join('\n');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Membuat link WhatsApp untuk pemesanan cepat dari seluruh isi keranjang
 */
export function formatCartWhatsAppUrl(params: CartWhatsAppParams): string {
  const cleanPhone = normalizeWhatsAppNumber(params.waNumber);
  const lines = [
    'Halo Florist Atelier Chenille! 🌸',
    params.customerName
      ? `Saya ${params.customerName} ingin mengonfirmasi pesanan keranjang belanja:`
      : 'Saya ingin mengonfirmasi pesanan keranjang belanja:',
    '',
    '📋 DAFTAR BUKET:',
  ];

  params.items.forEach((item, idx) => {
    lines.push(`${idx + 1}. ${item.name} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`);
    if (item.customSpecs) {
      lines.push(`   Catatan/Spesifikasi: ${item.customSpecs}`);
    }
  });

  lines.push('');
  lines.push(`• Subtotal: Rp ${params.subtotal.toLocaleString('id-ID')}`);
  if (params.discountAmount && params.discountAmount > 0) {
    lines.push(`• Diskon Kupon: -Rp ${params.discountAmount.toLocaleString('id-ID')}`);
  }
  if (params.pointsDiscount && params.pointsDiscount > 0) {
    lines.push(`• Diskon Flower Points: -Rp ${params.pointsDiscount.toLocaleString('id-ID')}`);
  }
  lines.push(`• Total Pembayaran: Rp ${params.grandTotal.toLocaleString('id-ID')}`);

  if (params.fulfillmentType === 'COD_MEETUP_POINT') {
    lines.push(`• Metode: COD Bebas Ongkir ${params.meetupPointName ? `(${params.meetupPointName})` : ''}`);
  } else {
    lines.push('• Metode: Kurir Ekspedisi Reguler');
  }

  lines.push('');
  lines.push('Mohon bantuannya untuk memproses dan konfirmasi nomor rekening/titik temu ya kak. Terima kasih! 💐');

  const text = lines.join('\n');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
