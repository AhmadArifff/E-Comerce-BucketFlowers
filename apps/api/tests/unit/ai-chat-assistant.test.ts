import { describe, it, expect } from 'vitest';
import {
  extractInvoiceNumber,
  cleanCustomerName,
  sanitizeDraftReply,
  generateAiChatDraft,
  retrieveGroundingContext,
} from '../../src/services/ai-chat-assistant.service.js';

describe('AI Chat Assistant Service (Gemini CS Copilot)', () => {
  describe('extractInvoiceNumber', () => {
    it('should extract canonical invoice format (INV-YYYYMMDD-XXX)', () => {
      const invoice = extractInvoiceNumber('Halo min, status INV-20261003-001 gimana ya?');
      expect(invoice).toBe('INV-20261003-001');
    });

    it('should handle lowercase invoice numbers and uppercase them', () => {
      const invoice = extractInvoiceNumber('Tolong cek inv-20261003-045 dong');
      expect(invoice).toBe('INV-20261003-045');
    });

    it('should return null when no invoice is present', () => {
      const invoice = extractInvoiceNumber('Buket mawar ungu ready stock gak min?');
      expect(invoice).toBeNull();
    });

    it('should return null for empty or undefined input', () => {
      expect(extractInvoiceNumber('')).toBeNull();
      expect(extractInvoiceNumber(undefined as any)).toBeNull();
    });
  });

  describe('cleanCustomerName (Sanitasi Nama Pelanggan)', () => {
    it('should clean bracketed role labels like (Member Mahasiswi UI) and return first name', () => {
      const name = cleanCustomerName('Annisa Larasati (Member Mahasiswi UI)');
      expect(name).toBe('Annisa');
    });

    it('should clean bracketed labels like (Tamu Toko)', () => {
      const name = cleanCustomerName('Fajar Nugraha (Alumni FTUI)');
      expect(name).toBe('Fajar');
    });

    it('should handle plain single name properly', () => {
      const name = cleanCustomerName('Budi');
      expect(name).toBe('Budi');
    });

    it('should remove repeated Kak prefix', () => {
      const name = cleanCustomerName('Kak Sasa');
      expect(name).toBe('Sasa');
    });

    it('should fallback to Kak if name is empty', () => {
      expect(cleanCustomerName('')).toBe('Kak');
      expect(cleanCustomerName(undefined)).toBe('Kak');
    });
  });

  describe('sanitizeDraftReply (Aturan Face Emoticons & Pembersihan Karakter)', () => {
    it('should strip unwanted non-face emojis (flowers, lightning, sparkles, alarm)', () => {
      const input = 'Halo Annisa! 🌸 Terima kasih ✨ Buket Ready Stock ⚡ Segera pesan 🚨';
      const output = sanitizeDraftReply(input);
      expect(output).not.toContain('🌸');
      expect(output).not.toContain('✨');
      expect(output).not.toContain('⚡');
      expect(output).not.toContain('🚨');
    });

    it('should preserve friendly human face emoticons (😊, 🥰, 🙏, 👋)', () => {
      const input = 'Halo Kak Annisa 😊 Nanti staf kami kabari ya kak 🙏 Terima kasih 🥰';
      const output = sanitizeDraftReply(input);
      expect(output).toContain('😊');
      expect(output).toContain('🙏');
      expect(output).toContain('🥰');
    });

    it('should convert robotic bullet points (•) into clean dashes (-)', () => {
      const input = '• Buket Mawar (Rp 100.000)\n• Buket Matahari (Rp 85.000)';
      const output = sanitizeDraftReply(input);
      expect(output).toContain('- Buket Mawar');
      expect(output).toContain('- Buket Matahari');
      expect(output).not.toContain('•');
    });
  });

  describe('retrieveGroundingContext', () => {
    it('should retrieve store settings and clean customer name', async () => {
      const ctx = await retrieveGroundingContext('test-session-nonexistent', 'Halo mau tanya');
      expect(ctx).toBeDefined();
      expect(ctx.storeInfo).toBeDefined();
      expect(ctx.storeInfo.store_name).toContain('Chenille');
      expect(Array.isArray(ctx.sourcesUsed)).toBe(true);
      expect(ctx.customerName).not.toContain('(Member');
    });

    it('should identify COD query and populate COD points if available', async () => {
      const ctx = await retrieveGroundingContext('test-session-cod', 'Bisa COD di kampus UI Depok gak?');
      expect(ctx).toBeDefined();
      expect(Array.isArray(ctx.codPoints)).toBe(true);
    });

    it('should identify product query and search products table', async () => {
      const ctx = await retrieveGroundingContext('test-session-prod', 'Ada buket ready stock dan harganya berapa?');
      expect(ctx).toBeDefined();
      expect(Array.isArray(ctx.products)).toBe(true);
    });
  });

  describe('generateAiChatDraft (Simulation & Fallback Mode)', () => {
    it('should return a high-quality draft using ONLY face emoticons and no flower/lightning symbols', async () => {
      const originalKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      const draftResult = await generateAiChatDraft('test-session-demo', 'Bisa COD di mana saja kak?');

      expect(draftResult).toBeDefined();
      expect(draftResult.draftText).toBeTruthy();
      // Must contain friendly face emoticons
      expect(draftResult.draftText).toMatch(/(😊|🙏|🥰|🤗|👋)/);
      // Must NOT contain flower or lightning symbols
      expect(draftResult.draftText).not.toContain('🌸');
      expect(draftResult.draftText).not.toContain('💐');
      expect(draftResult.draftText).not.toContain('⚡');
      expect(draftResult.draftText).not.toContain('•');
      expect(draftResult.isSimulation).toBe(true);

      process.env.GEMINI_API_KEY = originalKey;
    });

    it('should generate personalized order reply with face emoticon if invoice is detected', async () => {
      const draftResult = await generateAiChatDraft(
        'test-session-order',
        'Cek pesanan INV-20261003-999 kak'
      );

      expect(draftResult).toBeDefined();
      expect(typeof draftResult.draftText).toBe('string');
      expect(draftResult.draftText).toMatch(/(😊|🙏|🥰|🤗|👋)/);
      expect(draftResult.draftText).not.toContain('🌸');
    });
  });
});
