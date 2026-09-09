'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LiveChatMessage } from '@chenille/shared';
import { MOCK_CHAT_HISTORY } from '@chenille/shared';

export interface ChatSessionSummary {
  id: string;
  customer_name: string;
  customer_phone?: string;
  is_escalated_wa: boolean;
  is_active: boolean;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
}

interface ChatState {
  isOpen: boolean;
  sessionId: string | null;
  messages: LiveChatMessage[];
  adminSessions: ChatSessionSummary[];
  activeAdminSessionId: string | null;
  adminSessionMessages: LiveChatMessage[];
  isLoading: boolean;

  setIsOpen: (isOpen: boolean) => void;
  initClientSession: (customerName?: string, customerPhone?: string) => Promise<string>;
  sendMessage: (text: string, sender?: 'CUSTOMER' | 'FLORIST' | 'ADMIN', targetSessionId?: string) => Promise<void>;
  escalateToWhatsApp: (productContext?: string) => Promise<void>;
  fetchAdminSessions: () => Promise<void>;
  selectAdminSession: (sessionId: string) => Promise<void>;
  clearChat: () => void;
}

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  }
  return 'http://localhost:4000';
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      sessionId: null,
      messages: MOCK_CHAT_HISTORY,
      adminSessions: [],
      activeAdminSessionId: null,
      adminSessionMessages: [],
      isLoading: false,

      setIsOpen: (isOpen) => set({ isOpen }),

      initClientSession: async (customerName = 'Tamu Chenille', customerPhone) => {
        const currentId = get().sessionId;
        if (currentId) return currentId;

        try {
          const res = await fetch(`${getApiBase()}/api/v1/chat/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer_name: customerName,
              customer_phone: customerPhone,
            }),
          });
          const data = await res.json();
          if (data.success && data.data?.id) {
            set({ sessionId: data.data.id });
            return data.data.id;
          }
        } catch (e) {
          console.warn('Could not create server chat session, using local session:', e);
        }

        const fallbackId = `client-sess-${Date.now()}`;
        set({ sessionId: fallbackId });
        return fallbackId;
      },

      sendMessage: async (text, sender = 'CUSTOMER', targetSessionId) => {
        const clean = text.trim();
        if (!clean) return;

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Determine session id
        let activeSession = targetSessionId;
        if (!activeSession) {
          activeSession = get().sessionId || (await get().initClientSession());
        }

        const newMsg: LiveChatMessage = {
          id: `msg-${Date.now()}`,
          sessionId: activeSession,
          sender: sender === 'FLORIST' || sender === 'ADMIN' ? 'FLORIST_ADMIN' : 'CUSTOMER',
          text: clean,
          sentAt: timeStr,
        };

        // Optimistically update UI
        if (targetSessionId && (sender === 'FLORIST' || sender === 'ADMIN')) {
          set((state) => ({
            adminSessionMessages: [...state.adminSessionMessages, newMsg],
          }));
        } else {
          set((state) => ({
            messages: [...state.messages, newMsg],
          }));
        }

        // Send to backend
        try {
          const res = await fetch(`${getApiBase()}/api/v1/chat/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: activeSession,
              text: clean,
              sender: sender,
            }),
          });

          const resData = await res.json();
          if (resData.success && resData.data?.botReply) {
            const bot = resData.data.botReply;
            const botMsg: LiveChatMessage = {
              id: bot.id || `bot-${Date.now()}`,
              sessionId: activeSession,
              sender: 'BOT',
              text: bot.text,
              sentAt: `${now.getHours().toString().padStart(2, '0')}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`,
            };

            set((state) => ({
              messages: [...state.messages, botMsg],
            }));
          }
        } catch (e) {
          console.warn('Chat API message failed, using client fallback bot:', e);

          // Fallback client auto-responder if offline
          if (sender === 'CUSTOMER') {
            setTimeout(() => {
              let botReplyText = 'Terima kasih telah bertanya! Florist kami siap merangkai pesanan buket kustom Anda. Silakan klik tombol "Buka WhatsApp" untuk respon kilat 🌸.';
              const lower = clean.toLowerCase();
              if (lower.includes('cod') || lower.includes('titik temu')) {
                botReplyText = 'Untuk COD gratis ongkir bisa di Gerbatama UI, Kampus D Gunadarma, Stasiun Pondok Cina, dan Margo City 📍';
              } else if (lower.includes('harga') || lower.includes('diskon')) {
                botReplyText = 'Harga mulai Rp 45.000. Gunakan kode promo WISUDA10K di keranjang untuk diskon Rp 10.000! 🎟️';
              } else if (lower.includes('garansi') || lower.includes('patah')) {
                botReplyText = 'Semua buket dilindungi Garansi 100% Anti-Patah & Ganti Baru Gratis Ongkir jika rusak di perjalanan ekspedisi 🛡️';
              }

              const botMsg: LiveChatMessage = {
                id: `msg-bot-${Date.now()}`,
                sessionId: activeSession,
                sender: 'BOT',
                text: botReplyText,
                sentAt: `${now.getHours().toString().padStart(2, '0')}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`,
              };

              set((state) => ({ messages: [...state.messages, botMsg] }));
            }, 600);
          }
        }
      },

      escalateToWhatsApp: async (productContext) => {
        const phone = '6281299281192';
        const currentSession = get().sessionId;

        if (currentSession) {
          try {
            await fetch(`${getApiBase()}/api/v1/chat/escalate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ session_id: currentSession }),
            });
          } catch (e) {
            // Ignore failure
          }
        }

        const msg = productContext
          ? `Halo Florist Atelier Chenille Flowers! Saya ingin konsultasi kustomisasi untuk produk: ${productContext}. (Sesi Web: ${currentSession || '-'})`
          : `Halo Florist Atelier Chenille Flowers! Saya ingin konsultasi buket bunga kawat bulu kustom wisuda. (Sesi Web: ${currentSession || '-'})`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        if (typeof window !== 'undefined') {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      },

      fetchAdminSessions: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${getApiBase()}/api/v1/chat/sessions`);
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            set({ adminSessions: data.data });

            // Automatically select first session if none active
            if (!get().activeAdminSessionId && data.data.length > 0) {
              get().selectAdminSession(data.data[0].id);
            }
          }
        } catch (e) {
          console.warn('Could not fetch admin chat sessions:', e);
        } finally {
          set({ isLoading: false });
        }
      },

      selectAdminSession: async (sessionId: string) => {
        set({ activeAdminSessionId: sessionId });
        try {
          const res = await fetch(`${getApiBase()}/api/v1/chat/messages/${sessionId}`);
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const formatted: LiveChatMessage[] = data.data.map((m: any) => ({
              id: m.id,
              sessionId: m.session_id,
              sender: m.sender === 'CUSTOMER' ? 'CUSTOMER' : m.sender === 'BOT' ? 'BOT' : 'FLORIST_ADMIN',
              text: m.text,
              sentAt: new Date(m.sent_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            }));
            set({ adminSessionMessages: formatted });
          }
        } catch (e) {
          console.warn('Could not fetch session messages:', e);
        }
      },

      clearChat: () => set({ messages: MOCK_CHAT_HISTORY }),
    }),
    {
      name: 'chenille_chat_storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        messages: state.messages,
      }),
    }
  )
);
