'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MessageSquare, Send, Phone, RefreshCw, CheckCircle2, BellRing, Sparkles, Wand2, Copy } from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';
import { showMagicToast } from '@/lib/magic-motion';
import { parseInteractiveChat, formatChatForWhatsApp } from '@/lib/chat-interactive-parser';
import { ChatProductCard, ChatActionChips } from '@/components/storefront/ChatInteractiveWidgets';

// Tiny inline notification sound (base64-encoded short beep)
const playNotificationSound = () => {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRl9vT19teleVBRgAAABEYXRhAQACABAAZGF0YUFvT19AAIA/AACAP2FvT19AAIA/AACAP2FvT19AAIA/');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch {
    // Ignore audio errors in SSR or restricted environments
  }
};

export const CSHubModal: React.FC = () => {
  const { 
    adminSessions, 
    activeAdminSessionId, 
    adminSessionMessages, 
    fetchAdminSessions, 
    selectAdminSession, 
    sendMessage, 
    escalateToWhatsApp,
    generateAiDraft,
    isGeneratingAiDraft,
    isLoading 
  } = useChatStore();

  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [aiDraftInfo, setAiDraftInfo] = useState<{
    isSimulation: boolean;
    sourcesUsed: string[];
    orderRef?: string | null;
    modelUsed?: string;
  } | null>(null);

  const interactivePreview = useMemo(() => parseInteractiveChat(replyText), [replyText]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevTotalUnreadRef = useRef(0);
  const prevMsgCountRef = useRef(0);

  // Poll for real-time updates
  useEffect(() => {
    fetchAdminSessions();

    const interval = setInterval(() => {
      fetchAdminSessions(true);
      const currentActive = useChatStore.getState().activeAdminSessionId;
      if (currentActive) {
        selectAdminSession(currentActive);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchAdminSessions, selectAdminSession]);

  // Compute total unread count
  const totalUnread = adminSessions.reduce((sum, s) => sum + (s.unread_count || 0), 0);

  // Play notification sound when new unread messages arrive
  useEffect(() => {
    if (totalUnread > prevTotalUnreadRef.current && prevTotalUnreadRef.current >= 0) {
      playNotificationSound();
    }
    prevTotalUnreadRef.current = totalUnread;
  }, [totalUnread]);

  // Auto-scroll to bottom when new messages appear in active conversation
  useEffect(() => {
    if (adminSessionMessages.length > prevMsgCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMsgCountRef.current = adminSessionMessages.length;
  }, [adminSessionMessages.length]);

  const activeSession = adminSessions.find((s) => s.id === activeAdminSessionId) || (adminSessions.length > 0 ? adminSessions[0] : null);

  const handleGenerateAiDraft = async () => {
    const targetId = activeAdminSessionId || activeSession?.id;
    if (!targetId) return;

    // Find the last message sent by CUSTOMER to ground the reply
    const lastCustMsg = [...adminSessionMessages]
      .reverse()
      .find((m) => m.sender === 'CUSTOMER');

    const res = await generateAiDraft(targetId, lastCustMsg?.text);
    if (res.success && res.data) {
      setReplyText(res.data.draftText);
      setAiDraftInfo({
        isSimulation: res.data.isSimulation,
        sourcesUsed: res.data.sourcesUsed,
        orderRef: res.data.orderRef,
        modelUsed: res.data.modelUsed,
      });

      if (res.data.isSimulation) {
        showMagicToast('Draf AI Dibuat! 💡', 'Draf cerdas dibuat berbasis fakta database (Mode Grounded).', '✨');
      } else {
        const activeModel = res.data.modelUsed || 'Gemini 3.5 Flash';
        showMagicToast('Draf Gemini AI Siap! ✨', `Draf balasan cerdas diracik oleh ${activeModel}.`, '🌸');
      }
    } else {
      showMagicToast('Gagal Menghasilkan Draf ⚠️', res.error || 'Silakan coba lagi.', '❌');
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = activeAdminSessionId || activeSession?.id;
    if (!replyText.trim() || !targetId) return;

    setIsSending(true);
    try {
      await sendMessage(replyText.trim(), 'FLORIST', targetId);
      setReplyText('');
      setAiDraftInfo(null);
      await selectAdminSession(targetId);
      // Refresh sessions to update unread count after staff reply
      await fetchAdminSessions(true);
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
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm relative">
            <MessageSquare className="w-5 h-5" />
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center px-1 shadow-sm animate-pulse">
                {totalUnread}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
              In-System Customer Service Webchat Hub
            </h2>
            <p className="text-xs text-stone-500">
              {totalUnread > 0 ? (
                <>
                  <span className="text-red-600 font-bold">{totalUnread} pesan pelanggan belum dibalas</span>
                  {' • '}
                  <span>{adminSessions.length} percakapan aktif</span>
                </>
              ) : (
                <>Menjawab pesan konsultasi buket langsung di dalam web • {adminSessions.length} percakapan aktif</>
              )}
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
            disabled={!activeSession}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
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
            {totalUnread > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-600">
                <BellRing className="w-3 h-3 animate-bounce" />
                {totalUnread} belum dibalas
              </span>
            )}
          </div>

          {adminSessions.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs">
              Belum ada percakapan aktif dari storefront.
            </div>
          ) : (
            adminSessions.map((session) => {
              const isSelected = session.id === (activeAdminSessionId || activeSession?.id);
              const hasUnread = (session.unread_count || 0) > 0;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    selectAdminSession(session.id);
                    setAiDraftInfo(null);
                    setReplyText('');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-rose-300 shadow-xs ring-1 ring-rose-200'
                      : hasUnread
                      ? 'bg-red-50/60 border-red-200 hover:bg-red-50 hover:border-red-300'
                      : 'bg-white/70 border-stone-200 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`font-bold text-xs truncate max-w-[130px] ${hasUnread ? 'text-stone-900' : 'text-stone-800'}`}>
                        {session.customer_name}
                      </span>
                      {hasUnread && (
                        <span className="min-w-[20px] h-[20px] rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center px-1 flex-shrink-0 shadow-sm">
                          {session.unread_count}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 flex-shrink-0">
                      {session.updated_at ? new Date(session.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className={`text-[11px] truncate mt-1 ${hasUnread ? 'text-stone-700 font-semibold' : 'text-stone-500'}`}>
                    {session.last_message ? `"${session.last_message}"` : 'Sesi konsultasi baru'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {hasUnread ? (
                      <span className="text-[9px] bg-red-100 text-red-700 font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                        Menunggu Balasan
                      </span>
                    ) : (
                      <span className="text-[9px] bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full">
                        Live Sesi
                      </span>
                    )}
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
          {!activeSession ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-stone-50/40">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mb-4 shadow-xs">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-stone-700">Belum Ada Sesi Percakapan Terpilih</h3>
              <p className="text-xs text-stone-400 max-w-sm mt-1.5 leading-relaxed">
                Belum ada percakapan aktif dari storefront. Sesi obrolan pelanggan (seperti konsultasi buket atau tanya stok) akan otomatis muncul di sini dan tersinkronisasi secara real-time.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold relative">
                    {activeSession.customer_name?.slice(0, 2).toUpperCase() || 'CU'}
                    {(activeSession.unread_count || 0) > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-800">
                      {activeSession.customer_name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      Online di Storefront • {activeSession.customer_phone || 'Tanpa No. HP'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(activeSession.unread_count || 0) > 0 && (
                    <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                      {activeSession.unread_count} belum dibalas
                    </span>
                  )}
                  <span className="text-[10px] text-stone-400 font-mono">
                    ID: {activeSession.id}
                  </span>
                </div>
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
                    const parsed = parseInteractiveChat(msg.text);

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isCustomer ? 'items-start' : isBot ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl ${
                            isCustomer
                              ? 'bg-stone-100 text-stone-800 rounded-bl-xs'
                              : isBot
                              ? 'bg-amber-50 text-amber-900 border border-amber-200/60 rounded-bl-xs'
                              : 'bg-rose-600 text-white rounded-br-xs shadow-sm'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{parsed.cleanText || msg.text}</p>

                          {/* Render interactive product cards in admin chat */}
                          {parsed.products.length > 0 && (
                            <div className="space-y-1.5 mt-2">
                              {parsed.products.map((prod) => (
                                <ChatProductCard
                                  key={prod.id}
                                  productId={prod.id}
                                  productName={prod.name}
                                />
                              ))}
                            </div>
                          )}

                          {/* Render interactive action chips in admin chat */}
                          {parsed.actions.length > 0 && (
                            <div className="mt-2">
                              <ChatActionChips actions={parsed.actions} />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 mt-1 px-1">
                          {isBot ? '🤖 Bot Sapaan' : isCustomer ? '👤 Pembeli' : '🌸 Florist Staff (Anda)'} • {msg.sentAt}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* AI Grounding Source Info Banner */}
              {aiDraftInfo && (
                <div className="mx-3 mt-2 px-3.5 py-2 bg-gradient-to-r from-purple-50 via-indigo-50 to-rose-50 border border-purple-200/80 rounded-xl text-[11px] flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0 text-purple-700 font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                      {aiDraftInfo.isSimulation ? 'Draf Grounded Database' : 'Draf Gemini AI'}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-stone-600 truncate">
                      {aiDraftInfo.orderRef ? (
                        <strong className="text-stone-800">Inv: {aiDraftInfo.orderRef} • </strong>
                      ) : null}
                      Sumber: {aiDraftInfo.sourcesUsed.join(', ') || 'Basis Toko'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiDraftInfo(null)}
                    className="text-stone-400 hover:text-stone-700 text-xs px-1 cursor-pointer"
                    title="Tutup ringkasan sumber"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Reply Form with AI Copilot Action Bar */}
              <form onSubmit={handleReply} className="p-3 border-t border-stone-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateAiDraft}
                    disabled={isGeneratingAiDraft || !activeSession}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 disabled:opacity-50 text-white font-bold text-[11px] shadow-sm active:scale-95 transition-all cursor-pointer"
                    title="Buat draf rekomendasi balasan berbasis fakta database nyata menggunakan Gemini AI"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAiDraft ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingAiDraft ? 'Gemini meracik draf...' : '✨ Draf Balasan AI (Gemini)'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {replyText && (
                      <button
                        type="button"
                        onClick={() => {
                          setReplyText('');
                          setAiDraftInfo(null);
                        }}
                        className="text-[11px] text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Bersihkan Draf
                      </button>
                    )}
                    <span className="text-[10px] text-stone-400 hidden sm:inline">
                      Review manual sebelum kirim
                    </span>
                  </div>
                </div>

                {/* Interactive Action Preview in Admin Draft */}
                {interactivePreview && (interactivePreview.products.length > 0 || interactivePreview.actions.length > 0) && (
                  <div className="p-2.5 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-1.5 text-[11px] animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                        Elemen Interaktif Terlampir di Pesan:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const formatted = formatChatForWhatsApp(replyText);
                          navigator.clipboard.writeText(formatted);
                          showMagicToast('Format WA Disalin! 📋', 'Teks dan tautan interaktif siap dipaste ke WhatsApp.', '✨');
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                        title="Salin pesan dengan link langsung untuk WhatsApp"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin Format WA</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {interactivePreview.products.map((p, idx) => (
                        <span
                          key={`admin-prod-${idx}`}
                          className="inline-flex items-center gap-1 bg-white border border-rose-200 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px] shadow-xs"
                        >
                          🌸 Buket: {p.name}
                        </span>
                      ))}
                      {interactivePreview.actions.map((a, idx) => (
                        <span
                          key={`admin-act-${idx}`}
                          className="inline-flex items-center gap-1 bg-white border border-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-full text-[10px] shadow-xs"
                        >
                          ⚡ Tombol: {a.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 items-end">
                  <textarea
                    rows={2}
                    placeholder="Tinjau atau edit draf balasan di sini sebelum dikirim ke pelanggan..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleReply(e);
                      }
                    }}
                    disabled={isSending || !activeSession}
                    className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white resize-none leading-relaxed transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !replyText.trim() || !activeSession}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer h-[42px] self-end"
                    title="Kirim balasan yang telah ditinjau"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Mengirim...' : 'Kirim'}</span>
                  </button>
                </div>
              </form>

            </>
          )}
        </div>
      </div>
    </div>
  );
};
