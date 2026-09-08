'use client';

import React, { useState } from 'react';
import { ShoppingBag, CheckCircle2, Scissors, Truck, MapPin, Check, ExternalLink, Printer, Download, Search } from 'lucide-react';
import { useOrderStore, type Order } from '@/stores/useOrderStore';
import { showMagicToast } from '@/lib/magic-motion';

interface OrdersTableProps {
  searchQuery?: string;
  onPrintResi?: (order: Order) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ searchQuery = '', onPrintResi }) => {
  const { orders, updateOrderStep } = useOrderStore();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CRAFTING' | 'SHIPPED' | 'COMPLETED'>('ALL');
  const [internalSearch, setInternalSearch] = useState('');

  const activeSearch = searchQuery || internalSearch;

  const stepButtons = [
    { step: 1, label: '1. Bayar', color: 'hover:bg-blue-50 text-blue-600 border-blue-200' },
    { step: 2, label: '2. Rangkai', color: 'hover:bg-amber-50 text-amber-600 border-amber-200' },
    { step: 3, label: '3. QC Lolos', color: 'hover:bg-purple-50 text-purple-600 border-purple-200' },
    { step: 4, label: '4. Selesai', color: 'hover:bg-emerald-50 text-emerald-600 border-emerald-200' },
  ];

  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter === 'PENDING' && order.currentStep !== 1) return false;
    if (statusFilter === 'CRAFTING' && order.currentStep !== 2) return false;
    if (statusFilter === 'SHIPPED' && order.currentStep !== 3) return false;
    if (statusFilter === 'COMPLETED' && order.currentStep !== 4) return false;

    // Search query filter
    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase();
      const matchInvoice = order.invoiceNumber.toLowerCase().includes(q);
      const matchCustomer = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.toLowerCase().includes(q);
      const matchItem = order.items.some((i) => i.productName.toLowerCase().includes(q));
      return matchInvoice || matchCustomer || matchPhone || matchItem;
    }

    return true;
  });

  const handleExportOrdersCsv = () => {
    showMagicToast('Ekspor Pesanan Berhasil! 📦', 'File Pesanan_Chenille_Atelier.csv berhasil diunduh.', '📄');
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden mb-8">
      {/* Panel Header */}
      <div className="p-5 border-b border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/20">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-stone-800">
            Daftar Transaksi & Progres Live Stepper
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Klik tombol langkah 1 s/d 4 di bawah untuk menguji pembaruan animasi laser beam di portal pelanggan.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportOrdersCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/40 text-emerald-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Pesanan (.csv)</span>
          </button>
          <span className="text-xs font-bold text-rose-600 bg-rose-100/60 px-3 py-1.5 rounded-full">
            {filteredOrders.length} Pesanan
          </span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="px-5 py-3 border-b border-stone-100 bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ALL', label: `Semua (${orders.length})` },
            { id: 'PENDING', label: `Menunggu Rangkai (${orders.filter((o) => o.currentStep === 1).length})` },
            { id: 'CRAFTING', label: `Sedang Dirangkai (${orders.filter((o) => o.currentStep === 2).length})` },
            { id: 'SHIPPED', label: `Siap / Dikirim (${orders.filter((o) => o.currentStep === 3).length})` },
            { id: 'COMPLETED', label: `Selesai (${orders.filter((o) => o.currentStep === 4).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-rose-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick internal search if header search not provided */}
        {!searchQuery && (
          <div className="relative w-full md:w-56">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              placeholder="Filter invoice/nama..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        )}
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
              <th className="py-3.5 px-4 text-center">Aksi Dokumen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-stone-400 font-medium text-xs">
                  Tidak ada pesanan yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
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
                              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all border cursor-pointer ${
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

                    {/* Print Resi AWB */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onPrintResi?.(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-stone-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-stone-700 hover:text-rose-600 text-[10px] font-extrabold transition-all shadow-2xs cursor-pointer active:scale-95"
                        title="Cetak Label Resi Pengiriman AWB"
                      >
                        <Printer className="w-3 h-3 text-rose-600" />
                        <span>Cetak Resi</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
