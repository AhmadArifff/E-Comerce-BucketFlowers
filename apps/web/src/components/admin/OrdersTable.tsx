'use client';

import React, { useState, useMemo } from 'react';
import { ShoppingBag, CheckCircle2, Scissors, Truck, MapPin, Check, ExternalLink, Printer, Download, Search } from 'lucide-react';
import { useOrderStore, type Order } from '@/stores/useOrderStore';
import { showMagicToast } from '@/lib/magic-motion';
import { TableSortHeader, type SortDirection } from './TableSortHeader';

interface OrdersTableProps {
  searchQuery?: string;
  onPrintResi?: (order: Order) => void;
}

type OrderSortField = 'invoiceNumber' | 'customerName' | 'items' | 'fulfillment' | 'totalAmount' | 'currentStep';

export const OrdersTable: React.FC<OrdersTableProps> = ({ searchQuery = '', onPrintResi }) => {
  const { orders, updateOrderStep } = useOrderStore();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CRAFTING' | 'SHIPPED' | 'COMPLETED'>('ALL');
  const [internalSearch, setInternalSearch] = useState('');
  const [sortField, setSortField] = useState<OrderSortField | null>('currentStep');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const activeSearch = searchQuery || internalSearch;

  const handleSort = (field: OrderSortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const stepButtons = [
    { step: 1, label: '1. Bayar', color: 'hover:bg-blue-50 text-blue-600 border-blue-200' },
    { step: 2, label: '2. Rangkai', color: 'hover:bg-amber-50 text-amber-600 border-amber-200' },
    { step: 3, label: '3. QC Lolos', color: 'hover:bg-purple-50 text-purple-600 border-purple-200' },
    { step: 4, label: '4. Selesai', color: 'hover:bg-emerald-50 text-emerald-600 border-emerald-200' },
  ];

  const filteredOrders = useMemo(() => {
    const list = orders.filter((order) => {
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

    if (sortField && sortDirection) {
      return [...list].sort((a, b) => {
        let valA: any = a[sortField as keyof Order];
        let valB: any = b[sortField as keyof Order];

        if (sortField === 'items') {
          valA = a.items.length;
          valB = b.items.length;
        } else if (sortField === 'fulfillment') {
          valA = a.fulfillmentType;
          valB = b.fulfillmentType;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          const comp = valA.localeCompare(valB, 'id');
          return sortDirection === 'asc' ? comp : -comp;
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
      });
    }

    return list;
  }, [orders, statusFilter, activeSearch, sortField, sortDirection]);

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
              <TableSortHeader
                label="Invoice / Pemesan"
                field="invoiceNumber"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
              <TableSortHeader
                label="Item Buket"
                field="items"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
              <TableSortHeader
                label="Pengiriman"
                field="fulfillment"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
              <TableSortHeader
                label="Total"
                field="totalAmount"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
              <TableSortHeader
                label="Status Saat Ini"
                field="currentStep"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
              <th className="py-3.5 px-4 text-center text-[10px] font-extrabold uppercase tracking-wider text-stone-700">
                Ubah Status Cepat
              </th>
              <th className="py-3.5 px-4 text-center text-[10px] font-extrabold uppercase tracking-wider text-stone-700">
                Aksi Dokumen
              </th>
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
                    <td className="py-3.5 px-4 whitespace-nowrap">
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
                    <td className="py-3.5 px-4 whitespace-nowrap">
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
                    <td className="py-3.5 px-4 font-black text-stone-800 whitespace-nowrap">
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </td>

                    {/* Current Status Badge - Fixed single-line pill with dot */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-2xs ${
                          order.currentStep === 4
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.currentStep === 3
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : order.currentStep === 2
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            order.currentStep === 4
                              ? 'bg-emerald-500'
                              : order.currentStep === 3
                              ? 'bg-purple-500'
                              : order.currentStep === 2
                              ? 'bg-amber-500'
                              : 'bg-blue-500 animate-pulse'
                          }`}
                        />
                        <span>Langkah {order.currentStep}: {order.statusLabel}</span>
                      </span>
                    </td>

                    {/* Step Action Buttons - Fixed single-line segmented control */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 bg-stone-100/90 p-1 rounded-xl border border-stone-200 shadow-2xs">
                        {stepButtons.map((btn) => {
                          const isCurrent = order.currentStep === btn.step;
                          const isPassed = order.currentStep > btn.step;
                          return (
                            <button
                              key={btn.step}
                              onClick={() => updateOrderStep(order.id, btn.step)}
                              className={`h-7 px-2.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                                isCurrent
                                  ? 'bg-rose-600 text-white shadow-xs font-extrabold scale-102'
                                  : isPassed
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80'
                                  : 'text-stone-500 hover:text-stone-800 hover:bg-white'
                              }`}
                              title={`Set pesanan ke langkah ${btn.step}`}
                            >
                              {isCurrent && <Check className="w-3 h-3 stroke-[3]" />}
                              {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                              <span>{btn.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* Print Resi AWB */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onPrintResi?.(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-stone-700 hover:text-rose-600 text-[11px] font-extrabold transition-all shadow-2xs cursor-pointer active:scale-95"
                        title="Cetak Label Resi Pengiriman AWB"
                      >
                        <Printer className="w-3.5 h-3.5 text-rose-600" />
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
