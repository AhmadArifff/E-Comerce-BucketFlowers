import { describe, it, expect } from 'vitest';
import {
  extractInvoiceNumber,
  cleanCustomerName,
  sanitizeDraftReply,
  generateAiChatDraft,
  retrieveGroundingContext,
  generateDeterministicFallback,
  buildSystemInstruction,
  extractInteractiveMetadata,
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

    it('should not repeat opening greeting when conversation is already ongoing (Single Greeting Rule)', () => {
      const fakeCtx = {
        customerName: 'Annisa',
        storeInfo: { store_name: 'Chenille', is_maintenance: false },
        sourcesUsed: [],
      };

      // Turn 2+ (already greeted)
      const followUpReply = generateDeterministicFallback('kalau barang rusak apakah bisa claim?', fakeCtx, true);
      expect(followUpReply).not.toContain('Terima kasih sudah menghubungi Chenille Atelier Florist Depok');
      expect(followUpReply).toContain('Garansi Anti-Patah');
      expect(followUpReply).toContain('foto bukti');
      expect(followUpReply).toContain('?'); // Proactive closing question
    });

    it('should provide informative warranty response when customer asks about broken/damage claim', () => {
      const fakeCtx = {
        customerName: 'Budi',
        storeInfo: { store_name: 'Chenille', is_maintenance: false },
        sourcesUsed: [],
      };

      const reply = generateDeterministicFallback('bisa garansi ga kalau rusak di jalan?', fakeCtx, true);
      expect(reply).toContain('Garansi Anti-Patah & Rusak Pengiriman 100%');
      expect(reply).toMatch(/(😊|🙏|🥰)/);
      expect(reply).not.toContain('🌸');
    });

    it('should provide custom studio response with proactive closing when asked about colors/wrapping', () => {
      const fakeCtx = {
        customerName: 'Siti',
        storeInfo: { store_name: 'Chenille', is_maintenance: false },
        sourcesUsed: [],
      };

      const reply = generateDeterministicFallback('mau tanya kustom warna buket kawat bulu', fakeCtx, true);
      expect(reply).toContain('Custom Studio');
      expect(reply).toContain('warna kawat bulu');
      expect(reply).toContain('?');
      expect(reply).toMatch(/(😊|🥰)/);
    });

    it('should configure system instruction with single greeting rule and persona DNA', () => {
      const instructionWithGreeting = buildSystemInstruction(true);
      expect(instructionWithGreeting).toContain('DILARANG KERAS MENGULANG SALAM PEMBUKA FORMAL 2 KALI');
      expect(instructionWithGreeting).toContain('PROACTIVE CLOSING');
      expect(instructionWithGreeting).toContain('GARANSI ANTI-PATAH & RUSAK PENGIRIMAN 100%');

      const instructionFirstMessage = buildSystemInstruction(false);
      expect(instructionFirstMessage).toContain('PERCAKAPAN BARU DIMULAI');
    });

    it('should include interactive action tags in deterministic fallback for studio and tracking', () => {
      const fakeCtx = {
        customerName: 'Annisa',
        storeInfo: { store_name: 'Chenille', is_maintenance: false },
        sourcesUsed: [],
        order: {
          id: 'INV-20261003-9171',
          invoice_number: 'INV-20261003-9171',
          customer_name: 'Annisa',
          current_step: 2,
          step_title: 'Sedang Dirangkai',
          order_status: 'PROCESSING',
          delivery_method: 'COURIER_EXPEDITION',
          items_summary: 'Buket Mawar',
          total_amount: 150000,
          created_at: '2026-10-03',
        },
      };

      const reply = generateDeterministicFallback('cek status pesanan saya min', fakeCtx, true);
      expect(reply).toContain('[[action:TRACK_ORDER?inv=INV-20261003-9171|Cek Status Pesanan]]');
    });
  });

  describe('extractInteractiveMetadata (Parser Tag Aksi & Kartu Produk)', () => {
    it('should extract product tags and match with context product details', () => {
      const rawText = 'Silakan pilih buket ini kak:\n[[product:prod-01|Buket Karakter Wisuda Ber-toga]]\nAda yang mau ditanyakan lagi kak? 😊';
      const mockProducts = [
        {
          id: 'prod-01',
          name: 'Buket Karakter Wisuda Ber-toga',
          price: 175000,
          is_ready_stock: true,
          stock: 10,
          po_lead_days: 1,
          image_url: 'https://example.com/flower.jpg',
        },
      ];

      const { recommendedProducts, suggestedActions } = extractInteractiveMetadata(rawText, mockProducts);
      expect(recommendedProducts).toHaveLength(1);
      expect(recommendedProducts[0].id).toBe('prod-01');
      expect(recommendedProducts[0].name).toBe('Buket Karakter Wisuda Ber-toga');
      expect(recommendedProducts[0].price).toBe(175000);
      expect(recommendedProducts[0].image_url).toBe('https://example.com/flower.jpg');
      expect(suggestedActions).toHaveLength(0);
    });

    it('should extract action tags with parameters and labels', () => {
      const rawText = 'Kakak bisa cek statusnya:\n[[action:TRACK_ORDER?inv=INV-20261003-9171|Cek Status Pesanan]]\n[[action:OPEN_STUDIO|Buka Custom Studio]]';
      const { suggestedActions } = extractInteractiveMetadata(rawText);

      expect(suggestedActions).toHaveLength(2);
      expect(suggestedActions[0].type).toBe('TRACK_ORDER');
      expect(suggestedActions[0].label).toBe('Cek Status Pesanan');
      expect(suggestedActions[0].params?.inv).toBe('INV-20261003-9171');

      expect(suggestedActions[1].type).toBe('OPEN_STUDIO');
      expect(suggestedActions[1].label).toBe('Buka Custom Studio');
    });
  });
});
