'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  PackageCheck,
  AlertCircle,
  ArrowRight,
  Phone,
  FileText,
  Lock,
  KeyRound,
  X,
  RotateCw,
  CheckCircle2,
  Sparkles,
  Send,
} from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';
import type { MockOrder } from '@chenille/shared';
import { OrderStepper } from './OrderStepper';
import { getApiUrl } from '@/lib/api-client';
import { showMagicToast } from '@/lib/magic-motion';

export const GuestTracker: React.FC = () => {
  const { findOrderByQuery, updateOrderStep, addNewOrder } = useOrderStore();
  const [query, setQuery] = useState('');
  const [searchedOrders, setSearchedOrders] = useState<MockOrder[]>([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP Verification Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const quickTestInvoices = [
    { id: 'INV-20260907-001', label: 'INV-20260907-001 (Dewi - Langkah 2)' },
    { id: 'INV-20260907-002', label: 'INV-20260907-002 (Budi - COD UI)' },
    { id: '081299281192', label: 'WA 0812-9928-1192 (Dewi / OTP)' },
    { id: '085711223344', label: 'WA 0857-1122-3344 (Budi / OTP)' },
  ];

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const mapDbOrderToMock = (o: any): MockOrder => ({
    id: o.id,
    invoiceNumber: o.id,
    customerName: o.customer_name || 'Pelanggan Chenille',
    customerPhone: o.customer_phone || '',
    customerEmail: o.customer_email || '',
    customerAvatarEmoji: '🌸',
    currentStep: o.current_step || 1,
    stepStatus: o.order_status,
    statusLabel:
      o.current_step === 4
        ? 'Pesanan Selesai'
        : o.current_step === 3
        ? 'Lolos Quality Check'
        : o.current_step === 2
        ? 'Sedang Dirangkai'
        : 'Pembayaran Terkonfirmasi',
    statusDescription:
      o.current_step === 4
        ? 'Buket telah sampai di tangan pelanggan dengan aman.'
        : o.current_step === 3
        ? 'Buket telah lolos inspeksi kerapian dan kelopak simetris.'
        : o.current_step === 2
        ? 'Florist ahli atelier sedang merangkai kawat bulu pesanan Anda.'
        : 'Pembayaran pesanan telah diverifikasi oleh sistem atelier.',
    fulfillmentType: o.fulfillment_type || 'COURIER_EXPEDITION',
    meetupPointName: o.cod_meetup_name,
    courierName: o.courier_name,
    trackingNumber: o.tracking_number,
    deliveryAddress: o.shipping_address,
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    items: (o.items || []).map((it: any) => ({
      productId: it.product_id,
      productName: it.product_name || 'Buket Bunga Chenille',
      productImage: '/images/products/buket-mawar-merah-velvet.jpg',
      quantity: it.quantity,
      unitPrice: it.price,
      subtotal: it.subtotal,
    })),
    subtotalAmount: o.total_amount,
    shippingFee: 0,
    discountAmount: o.discount_amount || 0,
    adminFee: 0,
    flowerPointsEarned: Math.round(o.total_amount * 0.001),
    totalAmount: o.total_amount,
    createdAt: o.created_at || new Date().toISOString(),
    estimatedDelivery: 'Besok, 10:00 WIB',
  });

  const sendOtpRequest = async (phone: string) => {
    try {
      setOtpPhone(phone);
      setOtpError('');
      setOtpCode('');
      setIsOtpModalOpen(true);
      setResendCooldown(60);

      const res = await fetch(getApiUrl('/api/v1/otp/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        showMagicToast('Kode OTP Terkirim 📲', `OTP dikirim ke WhatsApp ${phone}. (Gunakan kode: 123456)`, '✨');
      }
    } catch (e) {
      console.warn('Error sending OTP:', e);
      showMagicToast('Mode Simulasi Aktif', 'Gunakan kode OTP 123456 untuk melanjutkan.', '🔑');
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setOtpError('Masukkan 6 digit kode OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    try {
      const res = await fetch(getApiUrl('/api/v1/otp/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhone, code: otpCode.trim() }),
      });
      const data = await res.json();

      if (!data.success) {
        setOtpError(data.error?.message || 'Kode OTP tidak valid atau kedaluwarsa.');
        setIsVerifyingOtp(false);
        return;
      }

      // OTP Verified successfully! Now fetch orders for this phone number
      showMagicToast('Verifikasi Berhasil! 🔓', 'Menampilkan data pesanan aktif Anda.', '🎉');
      setIsOtpModalOpen(false);

      // Fetch live orders by phone from Postgres API
      try {
        const orderRes = await fetch(getApiUrl(`/api/v1/orders/track/${encodeURIComponent(otpPhone)}`));
        const orderData = await orderRes.json();

        if (orderData.success && orderData.data && orderData.data.length > 0) {
          const mapped = orderData.data.map(mapDbOrderToMock);
          mapped.forEach((mo: MockOrder) => addNewOrder(mo));
          setSearchedOrders(mapped);
          setSelectedOrderIndex(0);
          setHasSearched(true);
          return;
        }
      } catch (err) {
        console.warn('Live track fetch failed, falling back to store:', err);
      }

      // Fallback: check local store by phone
      const localResult = findOrderByQuery(otpPhone);
      if (localResult) {
        setSearchedOrders([localResult]);
      } else {
        setSearchedOrders([]);
      }
      setSelectedOrderIndex(0);
      setHasSearched(true);
    } catch (err: any) {
      setOtpError('Gagal memverifikasi OTP. Pastikan koneksi internet stabil.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    // Check if input is a phone number (e.g. starts with 08, +62, 62, or only numbers)
    const isPhoneNumber = /^(\+?62|08|0)[0-9]{8,13}$/.test(cleanQuery.replace(/[\s-]/g, ''));

    if (isPhoneNumber) {
      // Trigger OTP flow for phone number privacy & security
      sendOtpRequest(cleanQuery);
      return;
    }

    // Direct search by Invoice ID
    setIsLoading(true);
    try {
      // Try local store first
      const local = findOrderByQuery(cleanQuery);
      if (local) {
        setSearchedOrders([local]);
        setSelectedOrderIndex(0);
        setHasSearched(true);
        setIsLoading(false);
        return;
      }

      // Try live API by ID
      const res = await fetch(getApiUrl(`/api/v1/orders/${encodeURIComponent(cleanQuery)}`));
      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        const mapped = mapDbOrderToMock(resJson.data);
        addNewOrder(mapped);
        setSearchedOrders([mapped]);
        setSelectedOrderIndex(0);
        setHasSearched(true);
      } else {
        setSearchedOrders([]);
        setHasSearched(true);
      }
    } catch (err) {
      console.warn('Search order failed:', err);
      setSearchedOrders([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (val: string) => {
    setQuery(val);
    const isPhoneNumber = /^(\+?62|08|0)[0-9]{8,13}$/.test(val.replace(/[\s-]/g, ''));
    if (isPhoneNumber) {
      sendOtpRequest(val);
    } else {
      const result = findOrderByQuery(val);
      if (result) {
        setSearchedOrders([result]);
      } else {
        setSearchedOrders([]);
      }
      setSelectedOrderIndex(0);
      setHasSearched(true);
    }
  };

  const activeSearchedOrder = searchedOrders[selectedOrderIndex] || null;

  const handleStepClick = (step: number) => {
    if (!activeSearchedOrder) return;
    updateOrderStep(activeSearchedOrder.id, step);

    // Sync to backend
    fetch(getApiUrl(`/api/v1/orders/${activeSearchedOrder.id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step }),
    }).catch(() => {});

    setSearchedOrders((prev) =>
      prev.map((ord, idx) =>
        idx === selectedOrderIndex
          ? {
              ...ord,
              currentStep: step,
              statusLabel:
                step === 4
                  ? 'Pesanan Selesai'
                  : step === 3
                  ? 'Lolos Quality Check'
                  : step === 2
                  ? 'Sedang Dirangkai'
                  : 'Pembayaran Terkonfirmasi',
            }
          : ord
      )
    );

    showMagicToast('Status Diperbarui ⚡', `Langkah pesanan kini berada di Tahap ${step}.`, '🌸');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
      <div className="max-w-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 uppercase tracking-wider">
            Skenario 1: Guest Tracking
          </span>
          <span className="text-[11px] text-stone-400 font-medium">Privasi Dilindungi OTP</span>
        </div>
        <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
          Lacak Pesanan Mandiri via Invoice atau WhatsApp
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Pelanggan tanpa akun dapat memantau buket live. Cukup masukkan Nomor Invoice atau Nomor WhatsApp untuk verifikasi OTP aman.
        </p>
      </div>

      {/* Quick Test Invoices & Numbers */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="font-bold text-stone-500 text-[11px]">Uji Coba Cepat (Test Data):</span>
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
            placeholder="No. Invoice (INV-...) atau No. WhatsApp (08...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 text-xs bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Lacak Pesanan</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Search Result View */}
      {hasSearched && (
        <div className="pt-4 border-t border-rose-100">
          {activeSearchedOrder ? (
            <div className="bg-rose-50/40 rounded-3xl p-5 sm:p-6 border border-rose-200/80 space-y-6 animate-in fade-in">
              {/* Order selector pill if multiple orders exist */}
              {searchedOrders.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <span className="text-xs font-bold text-stone-500 whitespace-nowrap">Pilih Pesanan:</span>
                  {searchedOrders.map((ord, idx) => (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrderIndex(idx)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedOrderIndex === idx
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {ord.invoiceNumber}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-rose-600 uppercase tracking-wider">
                      {activeSearchedOrder.invoiceNumber}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full">
                      {activeSearchedOrder.statusLabel}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 font-medium mt-1">
                    Atas Nama: <strong>{activeSearchedOrder.customerName}</strong> ({activeSearchedOrder.customerPhone})
                  </div>
                </div>

                <div className="text-xs text-stone-500">
                  <span>Waktu Pesan: </span>
                  <strong>
                    {new Date(activeSearchedOrder.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </strong>
                </div>
              </div>

              {/* Stepper with Beam Laser & Interactive Node Clicking */}
              <div className="py-2">
                <OrderStepper
                  currentStep={activeSearchedOrder.currentStep}
                  fulfillmentType={activeSearchedOrder.fulfillmentType}
                  meetupPointName={activeSearchedOrder.meetupPointName}
                  courierName={activeSearchedOrder.courierName}
                  onStepClick={handleStepClick}
                />
              </div>

              {/* Status Description Alert */}
              <div className="p-3.5 rounded-2xl bg-white border border-rose-100 flex items-start gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-800">
                    Status Terkini: {activeSearchedOrder.statusLabel}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {activeSearchedOrder.statusDescription}
                  </p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-700">Rincian Buket:</div>
                {activeSearchedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-100 text-xs shadow-2xs">
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

      {/* OTP VERIFICATION MODAL DIALOG */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-800">Verifikasi OTP WhatsApp</h3>
                  <p className="text-[10px] text-stone-400">Keamanan Akses Pesanan Pelanggan</p>
                </div>
              </div>
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="p-1 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone-600">
              <p>
                Kami telah mengirimkan 6 digit kode OTP verifikasi ke nomor WhatsApp{' '}
                <strong className="text-rose-600 font-bold">{otpPhone}</strong>.
              </p>
              <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">Mode Uji Coba Cepat:</span>
                <button
                  type="button"
                  onClick={() => setOtpCode('123456')}
                  className="px-2.5 py-1 bg-white hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl font-bold text-[11px] transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  Gunakan OTP: 123456
                </button>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1.5">
                  Masukkan 6-Digit Kode OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Contoh: 123456"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 px-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-black text-stone-800"
                  autoFocus
                />
                {otpError && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{otpError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Tidak menerima kode?</span>
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={() => sendOtpRequest(otpPhone)}
                  className="text-rose-600 font-bold hover:underline disabled:text-stone-400 disabled:no-underline cursor-pointer"
                >
                  {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim Ulang OTP'}
                </button>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl border border-stone-200 hover:bg-stone-50 font-bold text-xs text-stone-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isVerifyingOtp ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verifikasi & Buka</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
