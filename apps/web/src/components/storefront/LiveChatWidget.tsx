'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, MessageSquare, Phone, Bot, CheckCircle } from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';
import { useCartStore } from '@/stores/useCartStore';
import { useThemeStore } from '@/stores/useThemeStore';

export const LiveChatWidget: React.FC = () => {
  const { isOpen, setIsOpen, messages, sendMessage, escalateToWhatsApp } = useChatStore();
  const { isCartOpen } = useCartStore();
  const { theme } = useThemeStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Close live chat if cart drawer is opened to avoid screen overcrowding
  useEffect(() => {
    if (isCartOpen && isOpen) {
      setIsOpen(false);
    }
  }, [isCartOpen, isOpen, setIsOpen]);

  const presetQuestions =
    theme === 'tema-b'
      ? [
          '🌹 Cek Stok Rose Velvet',
          '💌 Box Velvet & Wax Seal',
          '🚗 Kurir Mobil Spesial',
          '✦ Kombinasi Mawar & Lily',
        ]
      : theme === 'tema-c'
      ? [
          '🌻 Mau custom buket karakter lucu!',
          '🎁 Ada kartu ucapan gratis?',
          '🛵 Bisa kirim hari ini juga?',
        ]
      : [
          'Bisa request warna bunga & pita?',
          'Titik temu COD di kampus mana saja?',
          'Berapa lama estimasi buket PO wisuda?',
        ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const getChatTitle = () => {
    if (theme === 'tema-b') return 'Atelier Concierge Service ✦';
    if (theme === 'tema-c') return 'CS Florist Gemas 🌻';
    return 'Asisten Florist Atelier 🌸';
  };

  const getChatSubtitle = () => {
    if (theme === 'tema-b') return 'Online • Rania Azzahra & Atelier Privé';
    if (theme === 'tema-c') return 'Online • Siap Bantu Kamu!';
    return 'Online • Balas Otomatis Cepat';
  };

  const getChatAvatar = () => {
    if (theme === 'tema-b') return '🌹';
    if (theme === 'tema-c') return '🌻';
    return '🌸';
  };

  return (
    <>
      {/* Universal Floating Trigger Button (Always Fixed Bottom Right across Themes) */}
      {!isOpen && !isCartOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="floating-chat-btn group"
          aria-label="Tanya Florist Live Chat"
        >
          <div className="relative flex items-center justify-center">
            {theme === 'tema-b' ? (
              <MessageCircle className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
            ) : (
              <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            )}
            <span className="pulse-green-dot w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 border border-white inline-block" />
          </div>
          <span>
            {theme === 'tema-c' ? 'Chat Florist Gemas' : 'Tanya Florist'}
          </span>
        </button>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="chat-popup-anim fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-3xl shadow-2xl border border-theme-border flex flex-col overflow-hidden max-h-[550px] h-[520px]">
          {/* Header */}
          <div
            className="p-4 text-white flex items-center justify-between shadow-sm"
            style={{
              background:
                theme === 'tema-b'
                  ? 'linear-gradient(135deg, #4A154B 0%, #6B2D5C 100%)'
                  : 'var(--primary)',
              borderBottom: theme === 'tema-b' ? '1px solid #D4AF37' : undefined,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-base border border-white/30">
                <span>{getChatAvatar()}</span>
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight font-heading">{getChatTitle()}</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-white/90">
                  <span className="pulse-green-dot w-2 h-2 rounded-full bg-emerald-300 inline-block" />
                  <span>{getChatSubtitle()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* WhatsApp Escalation Top Banner */}
          <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-xs">
            <span className="text-emerald-800 text-[11px] font-semibold">Butuh respon kilat via WA?</span>
            <button
              onClick={() => escalateToWhatsApp()}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm transition-all"
            >
              <Phone className="w-3 h-3" />
              <span>Buka WhatsApp</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'CUSTOMER';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl ${
                      isUser
                        ? 'bg-theme-primary text-white rounded-br-xs shadow-sm'
                        : 'bg-white text-stone-800 rounded-bl-xs border border-theme-border shadow-sm'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.sentAt}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Questions Chips */}
          <div className="p-2 border-t border-theme-border bg-white flex gap-1.5 overflow-x-auto scrollbar-none">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                className="text-[10px] font-semibold text-theme-primary bg-theme-surface-subtle hover:opacity-90 px-2.5 py-1 rounded-full whitespace-nowrap border border-theme-border transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-theme-border flex gap-2">
            <input
              type="text"
              placeholder="Ketik pertanyaan untuk florist..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary focus:bg-white"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-theme-primary hover:opacity-90 text-white shadow-md transition-all active:scale-90"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
