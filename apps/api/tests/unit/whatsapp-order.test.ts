import { describe, it, expect } from 'vitest';
import {
  normalizeWhatsAppNumber,
  formatDirectProductWhatsAppUrl,
  formatCartWhatsAppUrl,
} from '@chenille/shared';

describe('WhatsApp Order & Deep-Link Formatter Unit Tests (PRD Seksi 1 & 3)', () => {
  describe('normalizeWhatsAppNumber', () => {
    it('should convert local 08 prefix to international 62 format', () => {
      expect(normalizeWhatsAppNumber('081298317799')).toBe('6281298317799');
      expect(normalizeWhatsAppNumber('0812-3456-7890')).toBe('6281234567890');
    });

    it('should handle +62 prefix and special characters', () => {
      expect(normalizeWhatsAppNumber('+62 812-9831-7799')).toBe('6281298317799');
    });

    it('should keep existing 62 prefix unchanged', () => {
      expect(normalizeWhatsAppNumber('6281298317799')).toBe('6281298317799');
    });

    it('should provide fallback atelier phone if empty', () => {
      expect(normalizeWhatsAppNumber('')).toBe('6281298317721');
    });
  });

  describe('formatDirectProductWhatsAppUrl', () => {
    it('should generate a valid wa.me URL containing product name, qty, and price', () => {
      const url = formatDirectProductWhatsAppUrl({
        waNumber: '081298317799',
        productName: 'Buket Mawar Burgundy Velvet Wisuda',
        category: 'Wisuda & Sidang',
        price: 165000,
        discountPrice: 149000,
        quantity: 2,
        greetingCardText: 'Selamat Wisuda Sarah Amalia, S.Psi!',
        isReadyStock: true,
      });

      expect(url).toMatch(/^https:\/\/wa\.me\/6281298317799\?text=/);
      const decodedText = decodeURIComponent(url.replace('https://wa.me/6281298317799?text=', ''));

      expect(decodedText).toContain('Buket Mawar Burgundy Velvet Wisuda');
      expect(decodedText).toContain('2 buket');
      expect(decodedText).toContain('Rp 149.000');
      expect(decodedText).toContain('Rp 298.000');
      expect(decodedText).toContain('Selamat Wisuda Sarah Amalia, S.Psi!');
      expect(decodedText).toContain('Ready Stock');
    });

    it('should show Pre-Order lead time when product is not ready stock', () => {
      const url = formatDirectProductWhatsAppUrl({
        waNumber: '081298317799',
        productName: 'Buket Karakter Wisuda Ber-toga',
        price: 175000,
        quantity: 1,
        isReadyStock: false,
        poLeadDays: 3,
      });

      const decodedText = decodeURIComponent(url.replace('https://wa.me/6281298317799?text=', ''));
      expect(decodedText).toContain('Pre-Order (~3 Hari Kerja)');
    });
  });

  describe('formatCartWhatsAppUrl', () => {
    it('should generate a complete cart breakdown with COD meetup point', () => {
      const url = formatCartWhatsAppUrl({
        waNumber: '081298317799',
        customerName: 'Annisa Larasati',
        items: [
          { name: 'Buket Tulip Pastel Pink', price: 145000, quantity: 1 },
          { name: 'Buket Mawar Merah', price: 155000, quantity: 2 },
        ],
        subtotal: 455000,
        grandTotal: 435000,
        discountAmount: 20000,
        fulfillmentType: 'COD_MEETUP_POINT',
        meetupPointName: 'Stasiun Pondok Cina UI',
      });

      expect(url).toMatch(/^https:\/\/wa\.me\/6281298317799\?text=/);
      const decodedText = decodeURIComponent(url.replace('https://wa.me/6281298317799?text=', ''));

      expect(decodedText).toContain('Annisa Larasati');
      expect(decodedText).toContain('1. Buket Tulip Pastel Pink (1x) - Rp 145.000');
      expect(decodedText).toContain('2. Buket Mawar Merah (2x) - Rp 310.000');
      expect(decodedText).toContain('Diskon Kupon: -Rp 20.000');
      expect(decodedText).toContain('Total Pembayaran: Rp 435.000');
      expect(decodedText).toContain('COD Bebas Ongkir (Stasiun Pondok Cina UI)');
    });
  });
});
