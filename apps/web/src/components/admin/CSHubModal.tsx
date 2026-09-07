'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Phone, User, Bot, Sparkles } from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';

export const CSHubModal: React.FC = () => {
  const { messages, sendMessage, escalateToWhatsApp } = useChatStore();
  const [replyText, setReplyText] = useState('');

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sendMessage(`[Florist Admin]: ${replyText}`);
    setReplyText('');
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
              Menjawab pesan konsultasi buket langsung di dalam web (mencegah ketergantungan langsung chat WA).
            </p>
          </div>
        </div>

        <button
          onClick={() => escalateToWhatsApp()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Eskalasi ke WhatsApp Pembeli</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[460px]">
        {/* Sessions list (Left 4 cols) */}
        <div className="lg:col-span-4 border border-stone-200 rounded-2xl p-3 bg-stone-50 overflow-y-auto space-y-2">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block px-2">
            Percakapan Aktif
          </span>
          <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-stone-800">Siti Anggraini (UI Depok)</span>
              <span className="text-[10px] text-stone-400">10:01</span>
            </div>
            <p className="text-[11px] text-stone-500 truncate mt-1">
              "apakah bisa ganti warna pita jadi navy?"
            </p>
            <span className="inline-block mt-2 text-[9px] bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full">
              Live Sesi
            </span>
          </div>
        </div>

        {/* Conversation View (Right 8 cols) */}
        <div className="lg:col-span-8 border border-stone-200 rounded-2xl flex flex-col overflow-hidden bg-white">
          <div className="p-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
                SA
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800">Siti Anggraini</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Online di Storefront</span>
              </div>
            </div>
            <span className="text-[10px] text-stone-400">Sesi ID: sess-001</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/30 text-xs">
            {messages.map((msg) => {
              const isCustomer = msg.sender === 'CUSTOMER';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl ${
                      isCustomer
                        ? 'bg-stone-100 text-stone-800 rounded-bl-xs'
                        : 'bg-rose-600 text-white rounded-br-xs shadow-sm'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">
                    {msg.sender === 'BOT' ? '🤖 Bot Otomatis' : msg.sender === 'CUSTOMER' ? '👤 Pembeli' : '🌸 Florist Staff'} • {msg.sentAt}
                  </span>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleReply} className="p-3 border-t border-stone-200 flex gap-2">
            <input
              type="text"
              placeholder="Balas pesan pelanggan sebagai staf florist..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
