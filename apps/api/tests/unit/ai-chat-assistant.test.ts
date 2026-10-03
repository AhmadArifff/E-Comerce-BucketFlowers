import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  extractInvoiceNumber,
  generateAiChatDraft,
  retrieveGroundingContext,
} from '../../src/services/ai-chat-assistant.service.js';
import { pool } from '../../src/config/database.js';

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

  describe('retrieveGroundingContext', () => {
    it('should retrieve store settings and fallback gracefully if database has minimal data', async () => {
      const ctx = await retrieveGroundingContext('test-session-nonexistent', 'Halo mau tanya');
      expect(ctx).toBeDefined();
      expect(ctx.storeInfo).toBeDefined();
      expect(ctx.storeInfo.store_name).toContain('Chenille');
      expect(Array.isArray(ctx.sourcesUsed)).toBe(true);
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
    it('should return a high-quality deterministic grounded draft when API key is unconfigured', async () => {
      // Ensure test environment uses simulation
      const originalKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      const draftResult = await generateAiChatDraft('test-session-demo', 'Bisa COD di mana saja kak?');

      expect(draftResult).toBeDefined();
      expect(draftResult.draftText).toBeTruthy();
      expect(draftResult.draftText).toContain('🌸');
      expect(draftResult.isSimulation).toBe(true);
      expect(draftResult.modelUsed).toContain('Simulation Mode');
      expect(Array.isArray(draftResult.sourcesUsed)).toBe(true);

      // Restore key
      process.env.GEMINI_API_KEY = originalKey;
    });

    it('should generate personalized order reply if invoice is detected', async () => {
      const draftResult = await generateAiChatDraft(
        'test-session-order',
        'Cek pesanan INV-20261003-999 kak'
      );

      expect(draftResult).toBeDefined();
      expect(typeof draftResult.draftText).toBe('string');
      expect(draftResult.draftText.length).toBeGreaterThan(20);
    });
  });
});
