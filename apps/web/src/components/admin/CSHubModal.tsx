'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Phone, User, Bot, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';

export const CSHubModal: React.FC = () => {
  const { 
    adminSessions, 
    activeAdminSessionId, 
    adminSessionMessages, 
    fetchAdminSessions, 
    selectAdminSession, 
    sendMessage, 
    escalateToWhatsApp,
    isLoading 
  } = useChatStore();

  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchAdminSessions();
  }, [fetchAdminSessions]);

  const activeSession = adminSessions.find((s) => s.id === activeAdminSessionId) || adminSessions[0];

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeAdminSessionId) return;

    setIsSending(true);
    try {
      await sendMessage(replyText.trim(), 'FLORIST', activeAdminSessionId);
      setReplyText('');
      // Refresh messages
      await selectAdminSession(activeAdminSessionId);
    } catch (err) {
      console.error('Failed to send florist reply:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
              In-System Customer Service Webchat Hub
            </h2>
            <p className="text-xs text-stone-500">
              Menjawab pesan konsultasi buket langsung di dalam web dengan database live (mencegah ketergantungan langsung chat WA).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchAdminSessions()}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
            title="Muat Ulang Sesi"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-600' : ''}`} />
          </button>
          <button
            onClick={() => escalateToWhatsApp(activeSession?.customer_name)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Eskalasi ke WhatsApp</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[480px]">
        {/* Sessions list (Left 4 cols) */}
        <div className="lg:col-span-4 border border-stone-200 rounded-2xl p-3 bg-stone-50 overflow-y-auto space-y-2">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Percakapan Aktif ({adminSessions.length})
            </span>
          </div>

          {adminSessions.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs">
              Belum ada percakapan aktif dari storefront.
            </div>
          ) : (
            adminSessions.map((session) => {
              const isSelected = session.id === (activeAdminSessionId || activeSession?.id);

              return (
                <div
                  key={session.id}
                  onClick={() => selectAdminSession(session.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-rose-300 shadow-xs ring-1 ring-rose-200'
                      : 'bg-white/70 border-stone-200 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-800 truncate max-w-[170px]">
                      {session.customer_name}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {session.updated_at ? new Date(session.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate mt-1">
                    {session.last_message ? `"${session.last_message}"` : 'Sesi konsultasi baru'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9px] bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full">
                      Live Sesi
                    </span>
                    {session.is_escalated_wa && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Di-WA</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Conversation View (Right 8 cols) */}
        <div className="lg:col-span-8 border border-stone-200 rounded-2xl flex flex-col overflow-hidden bg-white">
          <div className="p-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
                {activeSession?.customer_name?.slice(0, 2).toUpperCase() || 'SA'}
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800">
                  {activeSession?.customer_name || 'Siti Anggraini'}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block">
                  Online di Storefront • {activeSession?.customer_phone || 'Tanpa No. HP'}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">
              ID: {activeSession?.id || 'sess-001'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/30 text-xs">
            {adminSessionMessages.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                Tidak ada riwayat pesan dalam sesi ini.
              </div>
            ) : (
              adminSessionMessages.map((msg) => {
                const isCustomer = msg.sender === 'CUSTOMER';
                const isBot = msg.sender === 'BOT';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isCustomer ? 'items-start' : isBot ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl ${
                        isCustomer
                          ? 'bg-stone-100 text-stone-800 rounded-bl-xs'
                          : isBot
                          ? 'bg-amber-50 text-amber-900 border border-amber-200/60 rounded-bl-xs'
                          : 'bg-rose-600 text-white rounded-br-xs shadow-sm'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 px-1">
                      {isBot ? '🤖 Bot Otomatis' : isCustomer ? '👤 Pembeli' : '🌸 Florist Staff (Anda)'} • {msg.sentAt}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleReply} className="p-3 border-t border-stone-200 flex gap-2">
            <input
              type="text"
              placeholder="Balas pesan pelanggan sebagai staf florist atelier..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={isSending || !activeAdminSessionId}
              className="flex-1 text-xs px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isSending || !replyText.trim() || !activeAdminSessionId}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Mengirim...' : 'Kirim'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
