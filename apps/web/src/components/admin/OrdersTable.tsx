'use client';

import React from 'react';
import { ShoppingBag, CheckCircle2, Scissors, Truck, MapPin, Check, ExternalLink } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';

export const OrdersTable: React.FC = () => {
  const { orders, updateOrderStep } = useOrderStore();

  const stepButtons = [
    { step: 1, label: '1. Bayar', color: 'hover:bg-blue-50 text-blue-600 border-blue-200' },
    { step: 2, label: '2. Rangkai', color: 'hover:bg-amber-50 text-amber-600 border-amber-200' },
    { step: 3, label: '3. QC Lolos', color: 'hover:bg-purple-50 text-purple-600 border-purple-200' },
    { step: 4, label: '4. Selesai', color: 'hover:bg-emerald-50 text-emerald-600 border-emerald-200' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden mb-8">
      <div className="p-5 border-b border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/20">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-stone-800">
            Daftar Transaksi & Progres Live Stepper
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Klik tombol langkah 1 s/d 4 di bawah untuk menguji pembaruan animasi laser beam di portal pelanggan.
          </p>
        </div>
        <span className="text-xs font-bold text-rose-600 bg-rose-100/60 px-3 py-1 rounded-full self-start sm:self-auto">
          {orders.length} Pesanan Tercatat
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-600">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Invoice / Pemesan</th>
              <th className="py-3.5 px-4">Item Buket</th>
              <th className="py-3.5 px-4">Pengiriman</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Status Saat Ini</th>
              <th className="py-3.5 px-4 text-center">Ubah Status Cepat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((order) => {
              const isCOD = order.fulfillmentType === 'COD_MEETUP_POINT';
              return (
                <tr key={order.id} className="hover:bg-rose-50/30 transition-colors">
                  {/* Invoice & Customer */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                        {order.customerAvatarEmoji || '🌸'}
                      </div>
                      <div>
                        <div className="font-bold text-stone-800">{order.invoiceNumber}</div>
                        <div className="text-[11px] text-stone-500">{order.customerName} ({order.customerPhone})</div>
                      </div>
                    </div>
                  </td>

                  {/* Items */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="truncate font-semibold text-stone-800">
                      {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {order.items.length} macam produk
                    </span>
                  </td>

                  {/* Fulfillment */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {isCOD ? (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                          <span className="font-semibold text-rose-700 truncate max-w-[160px]">
                            {order.meetupPointName || 'COD Depok'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Truck className="w-3.5 h-3.5 text-stone-600 flex-shrink-0" />
                          <span className="font-semibold text-stone-700">
                            {order.courierName || 'Ekspedisi Reguler'}
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 font-black text-stone-800">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </td>

                  {/* Current Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        order.currentStep === 4
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.currentStep === 3
                          ? 'bg-purple-100 text-purple-800'
                          : order.currentStep === 2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      Langkah {order.currentStep}: {order.statusLabel}
                    </span>
                  </td>

                  {/* Step Action Buttons */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-stone-50 p-1 rounded-xl border border-stone-200">
                      {stepButtons.map((btn) => {
                        const isCurrent = order.currentStep === btn.step;
                        return (
                          <button
                            key={btn.step}
                            onClick={() => updateOrderStep(order.id, btn.step)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all border ${
                              isCurrent
                                ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-105'
                                : `bg-white ${btn.color}`
                            }`}
                            title={`Set pesanan ke langkah ${btn.step}`}
                          >
                            {isCurrent && <Check className="w-2.5 h-2.5 inline mr-0.5 stroke-[3]" />}
                            {btn.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
