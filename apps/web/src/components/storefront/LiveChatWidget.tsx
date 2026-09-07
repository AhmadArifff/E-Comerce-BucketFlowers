'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, MessageSquare, Phone, Bot, CheckCircle } from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';

export const LiveChatWidget: React.FC = () => {
  const { isOpen, setIsOpen, messages, sendMessage, escalateToWhatsApp } = useChatStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
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

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xl shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all group"
          aria-label="Tanya Florist Live Chat"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 border-2 border-rose-600 animate-pulse" />
          </div>
          <span className="hidden sm:inline">Tanya Florist</span>
        </button>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-3xl shadow-2xl border border-rose-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[550px] h-[520px]">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">Asisten Florist Atelier 🌸</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-rose-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Online • Balas Otomatis Cepat</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
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
                        ? 'bg-rose-600 text-white rounded-br-xs shadow-sm'
                        : 'bg-white text-stone-800 rounded-bl-xs border border-rose-100 shadow-sm'
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
          <div className="p-2 border-t border-rose-100 bg-white flex gap-1.5 overflow-x-auto scrollbar-none">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                className="text-[10px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full whitespace-nowrap border border-rose-200 transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-rose-100 flex gap-2">
            <input
              type="text"
              placeholder="Ketik pertanyaan untuk florist..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all active:scale-90"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
