'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LiveChatMessage } from '@chenille/shared';
import { MOCK_CHAT_HISTORY } from '@chenille/shared';

interface ChatState {
  isOpen: boolean;
  messages: LiveChatMessage[];
  setIsOpen: (isOpen: boolean) => void;
  sendMessage: (text: string) => void;
  escalateToWhatsApp: (productContext?: string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      messages: MOCK_CHAT_HISTORY,

      setIsOpen: (isOpen) => set({ isOpen }),

      sendMessage: (text) => {
        const clean = text.trim();
        if (!clean) return;

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const userMsg: LiveChatMessage = {
          id: `msg-${Date.now()}`,
          sessionId: 'client-sess-live',
          sender: 'CUSTOMER',
          text: clean,
          sentAt: timeStr,
        };

        set((state) => ({ messages: [...state.messages, userMsg] }));

        // Automated Florist Assistant reply
        setTimeout(() => {
          let botReplyText = 'Terima kasih telah bertanya! Florist kami siap merangkai pesanan buket kustom Anda. Jika butuh konsultasi cepat tentang warna almamater atau deadline wisuda, Anda juga bisa langsung klik tombol "Konsultasi WhatsApp" di atas ya kak! 🌸';

          const lower = clean.toLowerCase();
          if (lower.includes('cod') || lower.includes('titik temu')) {
            botReplyText = 'Untuk COD gratis ongkir bisa di area Stasiun UI, Kampus D Margonda, Margo City, dan PNJ. Staf kami akan menunggu di titik temu resmi pada jadwal yang disepakati 📍';
          } else if (lower.includes('harga') || lower.includes('biaya') || lower.includes('diskon')) {
            botReplyText = 'Harga buket mulai dari Rp 45.000 (Mini Pot) hingga Rp 195.000 (Deluxe). Gunakan kode promo WISUDA10K di keranjang untuk potongan Rp 10.000! 🎟️';
          } else if (lower.includes('po') || lower.includes('berapa lama') || lower.includes('kapan')) {
            botReplyText = 'Produk ready stock siap kirim hari ini / besok! Untuk buket Pre-Order wisuda butuh 1-2 hari perangkaian teliti oleh artisan kami ✨';
          }

          const botMsg: LiveChatMessage = {
            id: `msg-bot-${Date.now()}`,
            sessionId: 'client-sess-live',
            sender: 'BOT',
            text: botReplyText,
            sentAt: `${now.getHours().toString().padStart(2, '0')}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`,
          };

          set((state) => ({ messages: [...state.messages, botMsg] }));
        }, 800);
      },

      escalateToWhatsApp: (productContext) => {
        const phone = '6281234567890';
        const msg = productContext
          ? `Halo Florist Atelier Chenille Flowers! Saya ingin konsultasi kustomisasi untuk produk: ${productContext}. Mohon infonya ya kak.`
          : 'Halo Florist Atelier Chenille Flowers! Saya ingin konsultasi buket bunga kawat bulu kustom.';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        if (typeof window !== 'undefined') {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      },

      clearChat: () => set({ messages: MOCK_CHAT_HISTORY }),
    }),
    {
      name: 'chenille_chat_storage',
    }
  )
);
