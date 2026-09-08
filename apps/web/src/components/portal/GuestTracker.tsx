'use client';

import React, { useState } from 'react';
import { Search, PackageCheck, AlertCircle, ArrowRight, Phone, FileText } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';
import type { MockOrder } from '@chenille/shared';
import { OrderStepper } from './OrderStepper';

export const GuestTracker: React.FC = () => {
  const { findOrderByQuery, updateOrderStep } = useOrderStore();
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<MockOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const quickTestInvoices = [
    { id: 'INV-20260907-001', label: 'INV-20260907-001 (Dewi - Langkah 2)' },
    { id: 'INV-20260907-002', label: 'INV-20260907-002 (Budi - COD UI)' },
    { id: 'INV-20260907-003', label: 'INV-20260907-003 (Siti - Selesai)' },
    { id: '081299281192', label: 'WA 0812-9928-1192' },
  ];

  const handleQuickSelect = (val: string) => {
    setQuery(val);
    const result = findOrderByQuery(val);
    setSearchedOrder(result);
    setHasSearched(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const result = findOrderByQuery(query);
    setSearchedOrder(result);
    setHasSearched(true);
  };

  const handleStepClick = (step: number) => {
    if (!searchedOrder) return;
    updateOrderStep(searchedOrder.id, step);
    const updated = findOrderByQuery(searchedOrder.id);
    if (updated) {
      setSearchedOrder(updated);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
      <div className="max-w-xl">
        <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
          Lacak Pesanan Cepat (Guest Tracking)
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Tidak perlu login! Cukup masukkan Nomor Invoice atau Nomor WhatsApp saat pemesanan.
        </p>
      </div>

      {/* Quick Test Invoices Pills */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="font-bold text-stone-500 text-[11px]">Coba Langsung (Uji Coba):</span>
        {quickTestInvoices.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => handleQuickSelect(q.id)}
            className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
          >
            {q.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 max-w-xl">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Masukkan No. Invoice atau WhatsApp (0812...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 text-xs bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Lacak Live</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Search Result */}
      {hasSearched && (
        <div className="pt-4 border-t border-rose-100">
          {searchedOrder ? (
            <div className="bg-rose-50/40 rounded-3xl p-5 sm:p-6 border border-rose-200/80 space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-rose-600 uppercase tracking-wider">
                      {searchedOrder.invoiceNumber}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full">
                      {searchedOrder.statusLabel}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 font-medium mt-1">
                    Atas Nama: <strong>{searchedOrder.customerName}</strong> ({searchedOrder.customerPhone})
                  </div>
                </div>

                <div className="text-xs text-stone-500">
                  <span>Waktu Pesan: </span>
                  <strong>{new Date(searchedOrder.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</strong>
                </div>
              </div>

              {/* Stepper with Beam Laser & Interactive Node Clicking */}
              <div className="py-2">
                <OrderStepper
                  currentStep={searchedOrder.currentStep}
                  fulfillmentType={searchedOrder.fulfillmentType}
                  meetupPointName={searchedOrder.meetupPointName}
                  courierName={searchedOrder.courierName}
                  onStepClick={handleStepClick}
                />
              </div>

              {/* Status Description Alert */}
              <div className="p-3.5 rounded-2xl bg-white border border-rose-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-800">
                    Status Terkini: {searchedOrder.statusLabel}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {searchedOrder.statusDescription}
                  </p>
                </div>
              </div>

              {/* Items Summary in this order */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-700">Rincian Buket:</div>
                {searchedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-100 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-stone-800">{item.productName}</div>
                        <span className="text-[10px] text-stone-400">Qty: {item.quantity} x Rp {item.unitPrice.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-stone-800">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-stone-50 rounded-2xl text-center text-xs text-stone-500">
              <AlertCircle className="w-6 h-6 text-stone-400 mx-auto mb-2" />
              <span>Pesanan dengan nomor <strong>"{query}"</strong> tidak ditemukan. Pastikan nomor invoice atau WhatsApp Anda benar.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
