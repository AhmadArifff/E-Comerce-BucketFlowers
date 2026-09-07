'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ShieldCheck, HeartHandshake } from 'lucide-react';
import { MOCK_FAQS } from '@chenille/shared';
import { useChatStore } from '@/stores/useChatStore';

export const FAQAccordion: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const { setIsOpen: openChat } = useChatStore();

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'FLOWER_CARE':
        return { label: 'Perawatan Bunga', color: 'bg-rose-100 text-rose-700' };
      case 'COD_RULES':
        return { label: 'Titik Temu COD', color: 'bg-blue-100 text-blue-700' };
      case 'PO_SCHEDULE':
        return { label: 'Custom & Wisuda', color: 'bg-amber-100 text-amber-700' };
      case 'INVOICE_LOST':
        return { label: 'Garansi 100%', color: 'bg-emerald-100 text-emerald-700' };
      default:
        return { label: 'Umum', color: 'bg-stone-100 text-stone-700' };
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white/70 backdrop-blur-sm border-t border-rose-100/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pusat Edukasi & Bantuan Pelanggan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-800 tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">
            Pelajari segala hal mengenai keunggulan buket bunga kawat bulu atelier kami, tata cara janjian COD kampus, dan jaminan garansi 100% anti-patah.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {MOCK_FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const badge = getCategoryBadge(faq.category);

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-rose-300 bg-rose-50/30 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-rose-200'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                    <h3 className="text-xs sm:text-sm font-extrabold text-stone-800 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-rose-100 text-rose-600' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-rose-100/50 animate-in fade-in duration-150">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Chat Support Card */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-sm shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-stone-800">
                Punya pertanyaan khusus seputar buket custom?
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Konsultasikan langsung dengan asisten web atelier kami secara interaktif.
              </p>
            </div>
          </div>

          <button
            onClick={() => openChat(true)}
            className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mulai Live Web Chat</span>
          </button>
        </div>
      </div>
    </section>
  );
};
