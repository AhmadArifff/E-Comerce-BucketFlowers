'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LiveChatMessage } from '@chenille/shared';
import { getApiUrl } from '@/lib/api-client';

export interface ChatSessionSummary {
  id: string;
  customer_name: string;
  customer_phone?: string;
  is_escalated_wa: boolean;
  is_active: boolean;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface ChatState {
  isOpen: boolean;
  sessionId: string | null;
  customerName: string;
  customerPhone?: string;
  messages: LiveChatMessage[];
  adminSessions: ChatSessionSummary[];
  activeAdminSessionId: string | null;
  adminSessionMessages: LiveChatMessage[];
  isLoading: boolean;

  setIsOpen: (isOpen: boolean) => void;
  syncSessionIdentity: (customerName: string, customerPhone?: string) => Promise<void>;
  initClientSession: (customerName?: string, customerPhone?: string) => Promise<string>;
  fetchClientMessages: () => Promise<void>;
  sendMessage: (text: string, sender?: 'CUSTOMER' | 'FLORIST' | 'ADMIN', targetSessionId?: string) => Promise<void>;
  escalateToWhatsApp: (productContext?: string) => Promise<void>;
  fetchAdminSessions: (silent?: boolean) => Promise<void>;
  selectAdminSession: (sessionId: string) => Promise<void>;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      sessionId: null,
      customerName: 'Tamu Chenille',
      customerPhone: undefined,
      messages: [],
      adminSessions: [],
      activeAdminSessionId: null,
      adminSessionMessages: [],
      isLoading: false,

      setIsOpen: (isOpen) => set({ isOpen }),

      syncSessionIdentity: async (name: string, phone?: string) => {
        if (!name) return;
        const changed = name !== get().customerName || phone !== get().customerPhone;
        if (changed) {
          set({ customerName: name, customerPhone: phone });
        }

        const currentId = get().sessionId;
        if (currentId) {
          try {
            await fetch(getApiUrl(`/api/v1/chat/session/${currentId}`), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customer_name: name,
                customer_phone: phone,
              }),
            });
          } catch (e) {
            console.warn('Could not sync session identity:', e);
          }
        }
      },

      initClientSession: async (customerName, customerPhone) => {
        const name = customerName || get().customerName || 'Tamu Chenille';
        const phone = customerPhone || get().customerPhone;
        const currentId = get().sessionId;

        if (currentId) {
          // Sync existing session with current customer name
          try {
            await fetch(getApiUrl(`/api/v1/chat/session/${currentId}`), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customer_name: name,
                customer_phone: phone,
              }),
            });
          } catch (e) {
            console.warn('Could not verify existing session:', e);
          }
          return currentId;
        }

        try {
          const res = await fetch(getApiUrl('/api/v1/chat/session'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer_name: name,
              customer_phone: phone,
            }),
          });
          const data = await res.json();
          if (data.success && data.data?.id) {
            set({ sessionId: data.data.id, customerName: name, customerPhone: phone });
            return data.data.id;
          }
        } catch (e) {
          console.warn('Could not create server chat session, using local session:', e);
        }

        const fallbackId = `client-sess-${Date.now()}`;
        set({ sessionId: fallbackId, customerName: name, customerPhone: phone });
        return fallbackId;
      },

      fetchClientMessages: async () => {
        const currentId = get().sessionId;
        if (!currentId) return;

        try {
          const res = await fetch(getApiUrl(`/api/v1/chat/messages/${currentId}`));
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            const formatted: LiveChatMessage[] = data.data.map((m: any) => ({
              id: m.id,
              sessionId: m.session_id,
              sender: m.sender === 'CUSTOMER' ? 'CUSTOMER' : m.sender === 'BOT' ? 'BOT' : 'FLORIST_ADMIN',
              text: m.text,
              sentAt: new Date(m.sent_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            }));

            const currentMsgs = get().messages;
            const hasNew = formatted.length !== currentMsgs.length || 
              (formatted.length > 0 && formatted[formatted.length - 1].id !== currentMsgs[currentMsgs.length - 1]?.id);

            if (hasNew) {
              set({ messages: formatted });
            }
          }
        } catch (e) {
          // Ignore polling errors
        }
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
          const res = await fetch(getApiUrl('/api/v1/chat/message'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: activeSession,
              text: clean,
              sender: sender,
              customer_name: get().customerName,
              customer_phone: get().customerPhone,
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

          // If florist replied, trigger admin session list refresh
          if (sender === 'FLORIST' || sender === 'ADMIN') {
            get().fetchAdminSessions();
          }
        } catch (e) {
          console.warn('Chat API message failed:', e);
        }
      },

      escalateToWhatsApp: async (productContext) => {
        const phone = '6281299281192';
        const currentSession = get().sessionId;

        if (currentSession) {
          try {
            await fetch(getApiUrl('/api/v1/chat/escalate'), {
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

      fetchAdminSessions: async (silent = false) => {
        if (!silent) set({ isLoading: true });
        try {
          const res = await fetch(getApiUrl('/api/v1/chat/sessions'));
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            set({ adminSessions: data.data });

            // Automatically select first session if none active or current is not in list
            const currentActive = get().activeAdminSessionId;
            const exists = data.data.some((s: any) => s.id === currentActive);
            if ((!currentActive || !exists) && data.data.length > 0) {
              get().selectAdminSession(data.data[0].id);
            } else if (data.data.length === 0) {
              set({ activeAdminSessionId: null, adminSessionMessages: [] });
            }
          }
        } catch (e) {
          console.warn('Could not fetch admin chat sessions:', e);
        } finally {
          if (!silent) set({ isLoading: false });
        }
      },

      selectAdminSession: async (sessionId: string) => {
        if (get().activeAdminSessionId !== sessionId) {
          set({ activeAdminSessionId: sessionId });
        }
        try {
          const res = await fetch(getApiUrl(`/api/v1/chat/messages/${sessionId}`));
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const formatted: LiveChatMessage[] = data.data.map((m: any) => ({
              id: m.id,
              sessionId: m.session_id,
              sender: m.sender === 'CUSTOMER' ? 'CUSTOMER' : m.sender === 'BOT' ? 'BOT' : 'FLORIST_ADMIN',
              text: m.text,
              sentAt: new Date(m.sent_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            }));

            const currentMsgs = get().adminSessionMessages;
            const hasNew = formatted.length !== currentMsgs.length || 
              (formatted.length > 0 && formatted[formatted.length - 1].id !== currentMsgs[currentMsgs.length - 1]?.id);

            if (hasNew) {
              set({ adminSessionMessages: formatted });
            }
          }
        } catch (e) {
          console.warn('Could not fetch session messages:', e);
        }
      },

      clearChat: () => set({ messages: [] }),
    }),
    {
      name: 'chenille_chat_storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        customerName: state.customerName,
        customerPhone: state.customerPhone,
        messages: state.messages,
      }),
    }
  )
);
