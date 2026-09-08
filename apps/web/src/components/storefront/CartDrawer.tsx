'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MapPin,
  Truck,
  Ticket,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CreditCard,
  Building,
  Banknote,
  AlertCircle,
  User,
  Phone,
  Mail,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { MOCK_MEETUP_POINTS, type MockOrder } from '@chenille/shared';
import { showMagicToast } from '@/lib/magic-motion';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    fulfillmentType,
    setFulfillmentType,
    selectedCodPointId,
    setSelectedCodPointId,
    voucherCode,
    discountAmount,
    applyVoucher,
    removeVoucher,
    usePoints,
    pointsDiscount,
    togglePoints,
    getSubtotal,
    getShippingFee,
    getGrandTotal,
    clearCart,
  } = useCartStore();

  const { user } = useAuthStore();
  const { addNewOrder } = useOrderStore();
  const { paymentGateways } = useSettingsStore();

  // Step state: CART or CHECKOUT
  const [step, setStep] = useState<'CART' | 'CHECKOUT'>('CART');

  // Voucher state
  const [inputVoucher, setInputVoucher] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Identity Form State (Guest or Logged in Member)
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [codMeetupNotes, setCodMeetupNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Available Payment Gateways from Admin Config
  const activeGateways = [
    paymentGateways.midtrans.isEnabled ? 'midtrans' : null,
    paymentGateways.bcaManual.isEnabled ? 'bcaManual' : null,
    paymentGateways.codCash.isEnabled ? 'codCash' : null,
  ].filter(Boolean) as ('midtrans' | 'bcaManual' | 'codCash')[];

  const [selectedPayment, setSelectedPayment] = useState<'midtrans' | 'bcaManual' | 'codCash'>(
    activeGateways[0] || 'midtrans'
  );

  // Sync user details if logged in
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerPhone) setCustomerPhone(user.phone);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!deliveryAddress && user.address) setDeliveryAddress(user.address);
    }
  }, [user]);

  // Ensure selected payment is one of the active ones
  useEffect(() => {
    if (!activeGateways.includes(selectedPayment) && activeGateways.length > 0) {
      setSelectedPayment(activeGateways[0]);
    }
  }, [paymentGateways]);

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const grandTotal = getGrandTotal();
  const userPoints = user?.flowerPoints ?? 120;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVoucher.trim()) return;
    const res = applyVoucher(inputVoucher);
    if (res.success) {
      setVoucherMsg({ type: 'success', text: res.message });
      setInputVoucher('');
      showMagicToast('Kupon Berhasil! 🎉', res.message, '🏷️');
    } else {
      setVoucherMsg({ type: 'error', text: res.message });
      showMagicToast('Kupon Tidak Valid ⚠️', res.message, '⚠️');
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setFormError(null);
    setStep('CHECKOUT');
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Validation
    if (!customerName.trim()) {
      setFormError('Nama lengkap pemesan wajib diisi.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      setFormError('Nomor WhatsApp / HP aktif wajib diisi minimal 9 digit.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setFormError('Email aktif yang valid wajib diisi untuk bukti pesanan.');
      return;
    }
    if (fulfillmentType === 'COURIER_EXPEDITION' && !deliveryAddress.trim()) {
      setFormError('Alamat lengkap pengiriman kurir wajib diisi.');
      return;
    }

    setFormError(null);
    setIsCheckingOut(true);

    const invoiceNo = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    const selectedMeetup = MOCK_MEETUP_POINTS.find((m) => m.id === selectedCodPointId);

    const paymentStatus: 'PAYMENT_CONFIRMED' | 'WAITING_PAYMENT' | 'PAID_ON_COD' =
      selectedPayment === 'midtrans'
        ? 'PAYMENT_CONFIRMED'
        : selectedPayment === 'codCash'
        ? 'PAID_ON_COD'
        : 'WAITING_PAYMENT';

    const newOrder: MockOrder = {
      id: `ord-${Date.now()}`,
      invoiceNumber: invoiceNo,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      customerAvatarEmoji: user?.avatarEmoji || '🌸',
      currentStep: 1, // PAYMENT_CONFIRMED
      stepStatus: 'PAYMENT_CONFIRMED',
      statusLabel: selectedPayment === 'midtrans' ? 'Pembayaran QRIS Lunas' : 'Menunggu Konfirmasi',
      statusDescription:
        selectedPayment === 'midtrans'
          ? 'Pembayaran via QRIS Midtrans berhasil diverifikasi otomatis oleh atelier.'
          : selectedPayment === 'bcaManual'
          ? 'Transfer BCA Manual tersimpan. Silakan konfirmasi bukti transfer via WhatsApp CS.'
          : 'Pesanan COD tersimpan. Siapkan uang pas saat serah terima di titik temu.',
      fulfillmentType,
      meetupPointName:
        fulfillmentType === 'COD_MEETUP_POINT'
          ? `${selectedMeetup?.name || 'Titik Temu Kampus'} ${codMeetupNotes ? `(${codMeetupNotes})` : ''}`
          : undefined,
      courierName: fulfillmentType === 'COURIER_EXPEDITION' ? 'J&T Express Fragile (Biteship Aggregator)' : undefined,
      trackingNumber:
        fulfillmentType === 'COURIER_EXPEDITION'
          ? `BTE-${Math.floor(10000000 + Math.random() * 90000000)}`
          : undefined,
      deliveryAddress: fulfillmentType === 'COURIER_EXPEDITION' ? deliveryAddress.trim() : undefined,
      paymentMethod: selectedPayment,
      paymentStatus,
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.image,
        quantity: i.quantity,
        unitPrice: i.product.discountPrice ?? i.product.price,
        subtotal: (i.product.discountPrice ?? i.product.price) * i.quantity,
      })),
      subtotalAmount: subtotal,
      shippingFee,
      discountAmount,
      flowerPointsEarned: Math.round(subtotal * 0.001),
      totalAmount: grandTotal,
      createdAt: new Date().toISOString(),
      estimatedDelivery: 'Besok, 10:00 WIB',
    };

    setTimeout(() => {
      addNewOrder(newOrder);
      setIsCartOpen(false);
      setTimeout(() => {
        clearCart();
        setIsCheckingOut(false);
        setStep('CART');
        showMagicToast('Pesanan Berhasil Dibuat! 🌸', `${invoiceNo} siap dipantau langsung di Portal Pelanggan.`, '✨');
        router.push('/portal');
      }, 200);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col drawer-slide-in">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-theme-border flex items-center justify-between bg-theme-surface-subtle">
            <div className="flex items-center gap-2">
              {step === 'CHECKOUT' ? (
                <button
                  type="button"
                  onClick={() => setStep('CART')}
                  className="p-1.5 -ml-1 text-stone-600 hover:text-stone-900 rounded-full hover:bg-white transition-colors cursor-pointer"
                  title="Kembali ke keranjang"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-8 h-8 rounded-full bg-theme-primary text-white flex items-center justify-center shadow-sm">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              )}
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-stone-800">
                  {step === 'CART' ? 'Keranjang Belanja' : 'Checkout & Pembayaran'}
                </h2>
                <span className="text-[11px] text-stone-500">
                  {step === 'CART' ? `${items.length} Macam Buket Dipilih` : 'Isi Data Diri & Pembayaran'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* STEP 1: CART REVIEW */}
          {/* ========================================================================= */}
          {step === 'CART' && (
            <>
              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center mb-3">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-stone-700">Keranjang Masih Kosong</h3>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                      Pilih buket bunga kawat bulu kesukaan Anda di etalase katalog.
                    </p>
                  </div>
                ) : (
                  items.map((item) => {
                    const effectivePrice = item.product.discountPrice ?? item.product.price;
                    return (
                      <div
                        key={item.product.id}
                        className="flex gap-3 p-3 rounded-2xl bg-theme-surface-subtle border border-theme-border"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover border border-theme-border flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-stone-800 truncate">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => {
                                removeItem(item.product.id);
                                showMagicToast('Item Dihapus 🗑️', `${item.product.name} dikeluarkan dari keranjang`, '🗑️');
                              }}
                              className="text-stone-400 hover:text-theme-primary transition-colors cursor-pointer"
                              title="Hapus item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-xs font-black text-theme-primary">
                            Rp {effectivePrice.toLocaleString('id-ID')}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center border border-theme-border bg-white rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="p-1 text-stone-600 hover:bg-stone-100 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-bold text-stone-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="p-1 text-stone-600 hover:bg-rose-50 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs font-bold text-stone-700">
                              Rp {(effectivePrice * item.quantity).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {items.length > 0 && (
                  <div className="space-y-4 pt-2">
                    {/* Fulfillment Selection */}
                    <div className="border border-stone-200 rounded-2xl p-3.5 bg-stone-50/50 space-y-2.5">
                      <div className="text-xs font-bold text-stone-700 flex items-center justify-between">
                        <span>Opsi Pengambilan / Pengiriman:</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                          COD Bebas Ongkir
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFulfillmentType('COD_MEETUP_POINT')}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${
                            fulfillmentType === 'COD_MEETUP_POINT'
                              ? 'border-theme-primary bg-theme-surface-subtle text-theme-primary font-bold shadow-sm ring-1 ring-theme-primary/30'
                              : 'border-stone-200 bg-white text-stone-600'
                          }`}
                        >
                          <MapPin className="w-4 h-4 flex-shrink-0 text-theme-primary mt-0.5" />
                          <div>
                            <div>COD Titik Temu</div>
                            <span className="text-[10px] text-emerald-600 font-bold">Gratis Ongkir</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFulfillmentType('COURIER_EXPEDITION')}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${
                            fulfillmentType === 'COURIER_EXPEDITION'
                              ? 'border-theme-primary bg-theme-surface-subtle text-theme-primary font-bold shadow-sm ring-1 ring-theme-primary/30'
                              : 'border-stone-200 bg-white text-stone-600'
                          }`}
                        >
                          <Truck className="w-4 h-4 flex-shrink-0 text-theme-primary mt-0.5" />
                          <div>
                            <div>Ekspedisi J&T</div>
                            <span className="text-[10px] text-stone-500 font-medium">Rp 15.000</span>
                          </div>
                        </button>
                      </div>

                      {fulfillmentType === 'COD_MEETUP_POINT' && (
                        <div className="pt-1">
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                            Pilih Titik Temu Kampus / Mall Terverifikasi:
                          </label>
                          <select
                            value={selectedCodPointId}
                            onChange={(e) => setSelectedCodPointId(e.target.value)}
                            className="w-full text-xs p-2.5 bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            {MOCK_MEETUP_POINTS.map((pt) => (
                              <option key={pt.id} value={pt.id}>
                                {pt.name} ({pt.distanceKm} KM)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Voucher Code Form */}
                    <form onSubmit={handleApplyVoucher} className="space-y-1.5">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Kode kupon (contoh: WISUDA10K)"
                            value={inputVoucher}
                            onChange={(e) => setInputVoucher(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                          />
                          <Ticket className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                        </div>
                        <button
                          type="submit"
                          className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold cursor-pointer"
                        >
                          Gunakan
                        </button>
                      </div>
                      {voucherMsg && (
                        <div
                          className={`text-[11px] font-semibold px-2 py-1 rounded-lg ${
                            voucherMsg.type === 'success'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {voucherMsg.text}
                        </div>
                      )}
                      {voucherCode && (
                        <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded-xl">
                          <span>
                            Kupon Aktif: <strong>{voucherCode}</strong> (-Rp {discountAmount.toLocaleString('id-ID')})
                          </span>
                          <button
                            type="button"
                            onClick={removeVoucher}
                            className="text-stone-400 hover:text-stone-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </form>

                    {/* Flower Points Redemption */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <div>
                          <span className="font-bold text-amber-900">Flower Points: {userPoints}</span>
                          <div className="text-[10px] text-amber-700">Tukar 50 Poin = Diskon Rp 5.000</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePoints(userPoints)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          usePoints
                            ? 'bg-amber-600 text-white'
                            : 'bg-white text-amber-800 border border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        {usePoints ? 'Digunakan' : 'Gunakan'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer & Checkout Button */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-rose-100 bg-white space-y-3 shadow-lg">
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal Buket</span>
                      <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ongkos Kirim</span>
                      <span className="font-semibold text-emerald-600">
                        {shippingFee === 0 ? 'Gratis (COD)' : `Rp ${shippingFee.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Diskon Voucher</span>
                        <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    {pointsDiscount > 0 && (
                      <div className="flex justify-between text-amber-600 font-semibold">
                        <span>Diskon Flower Points</span>
                        <span>-Rp {pointsDiscount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm sm:text-base font-extrabold text-stone-800 pt-2 border-t border-stone-100">
                      <span>Total Pembayaran</span>
                      <span className="text-theme-primary font-black">
                        Rp {grandTotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="btn-primary-atelier w-full py-3.5 text-xs sm:text-sm font-extrabold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Lanjut ke Data Pemesan & Bayar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: CHECKOUT FORM (GUEST / MEMBER & PAYMENT) */}
          {/* ========================================================================= */}
          {step === 'CHECKOUT' && (
            <form onSubmit={handleConfirmOrder} className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Guest / Member Indicator */}
                {user ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{user.avatarEmoji || '🌸'}</span>
                      <div>
                        <div className="text-xs font-extrabold text-emerald-900">
                          Masuk sebagai Member: {user.name}
                        </div>
                        <span className="text-[10px] text-emerald-700">{user.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Poin Aktif
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-theme-primary flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold text-stone-800">Checkout Instan (Tamu / Guest)</div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Tidak wajib login. Cukup lengkapi data kontak di bawah agar atelier bisa mengonfirmasi pesanan.
                      </p>
                    </div>
                  </div>
                )}

                {/* Form Error Banner */}
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-700 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Contact Identity Inputs */}
                <div className="space-y-3 bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] font-black uppercase text-stone-500 tracking-wider block">
                    1. Data Identitas Pemesan
                  </span>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Nama Lengkap Pemesan <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Siti Anggraini"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="0812-xxxx-xxxx"
                          className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Email Aktif <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="nama@email.com"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address / Meetup Point */}
                <div className="space-y-3 bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] font-black uppercase text-stone-500 tracking-wider block">
                    2. Alamat & Pengantaran ({fulfillmentType === 'COD_MEETUP_POINT' ? 'COD Titik Temu' : 'Ekspedisi J&T'})
                  </span>

                  {fulfillmentType === 'COURIER_EXPEDITION' ? (
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Alamat Lengkap Rumah / Kampus <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Home className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                        <textarea
                          required
                          rows={2}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Jl. Margonda Raya No. 120, RT 02/05, Beji, Depok (Patokan depan gang...)"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-white border border-stone-200 rounded-xl">
                        <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-theme-primary" />
                          <span>
                            {MOCK_MEETUP_POINTS.find((p) => p.id === selectedCodPointId)?.name || 'Titik Temu UI'}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                          Bebas Ongkir ke Lokasi Ini
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-stone-600 block mb-1">
                          Catatan Janji Temu (Opsional):
                        </label>
                        <input
                          type="text"
                          value={codMeetupNotes}
                          onChange={(e) => setCodMeetupNotes(e.target.value)}
                          placeholder="Contoh: Ketemu dekat lobi utama jam 14:00"
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Gateway Options (Active in Admin Settings) */}
                <div className="space-y-2.5 bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-stone-500 tracking-wider">
                      3. Pilih Metode Pembayaran
                    </span>
                    <span className="text-[10px] bg-theme-surface text-theme-primary font-bold px-2 py-0.5 rounded-full">
                      Tersedia: {activeGateways.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* Midtrans Snap QRIS */}
                    {paymentGateways.midtrans.isEnabled && (
                      <label
                        className={`p-3 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                          selectedPayment === 'midtrans'
                            ? 'border-theme-primary bg-theme-surface-subtle ring-1 ring-theme-primary/30 shadow-xs'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={selectedPayment === 'midtrans'}
                            onChange={() => setSelectedPayment('midtrans')}
                            className="mt-1 accent-rose-600"
                          />
                          <div>
                            <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-theme-primary" />
                              <span>Midtrans Snap QRIS & Virtual Account</span>
                            </div>
                            <p className="text-[10px] text-stone-500 mt-0.5">
                              QRIS Nasional, GoPay, ShopeePay, VA BCA, Mandiri, BNI (Otomatis & Realtime).
                            </p>
                            {selectedPayment === 'midtrans' && (
                              <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                Verifikasi Otomatis 24 Jam
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    )}

                    {/* BCA Manual */}
                    {paymentGateways.bcaManual.isEnabled && (
                      <label
                        className={`p-3 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                          selectedPayment === 'bcaManual'
                            ? 'border-theme-primary bg-theme-surface-subtle ring-1 ring-theme-primary/30 shadow-xs'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={selectedPayment === 'bcaManual'}
                            onChange={() => setSelectedPayment('bcaManual')}
                            className="mt-1 accent-rose-600"
                          />
                          <div>
                            <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-blue-600" />
                              <span>Transfer Bank BCA Manual</span>
                            </div>
                            <p className="text-[10px] text-stone-500 mt-0.5">
                              {paymentGateways.bcaManual.accountNumber} a/n {paymentGateways.bcaManual.accountHolder}
                            </p>
                            {selectedPayment === 'bcaManual' && (
                              <div className="mt-1.5 p-2 bg-blue-50 text-blue-800 rounded-lg text-[10px] font-medium">
                                Cabang: {paymentGateways.bcaManual.branch}. Konfirmasi via WhatsApp setelah transfer.
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    )}

                    {/* COD Cash */}
                    {paymentGateways.codCash.isEnabled && fulfillmentType === 'COD_MEETUP_POINT' && (
                      <label
                        className={`p-3 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                          selectedPayment === 'codCash'
                            ? 'border-theme-primary bg-theme-surface-subtle ring-1 ring-theme-primary/30 shadow-xs'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={selectedPayment === 'codCash'}
                            onChange={() => setSelectedPayment('codCash')}
                            className="mt-1 accent-rose-600"
                          />
                          <div>
                            <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                              <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Bayar Tunai Pas Serah Terima (COD)</span>
                            </div>
                            <p className="text-[10px] text-stone-500 mt-0.5">
                              {paymentGateways.codCash.notes}
                            </p>
                          </div>
                        </div>
                      </label>
                    )}

                    {activeGateways.length === 0 && (
                      <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200">
                        Metode pembayaran sedang dalam pemeliharaan admin.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2 Bottom Checkout Action */}
              <div className="p-4 sm:p-5 border-t border-rose-100 bg-white space-y-3 shadow-lg">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Total Pembayaran Akhir:</span>
                  <span className="text-base font-black text-theme-primary">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingOut || activeGateways.length === 0}
                  className="btn-primary-atelier w-full py-3.5 text-xs sm:text-sm font-extrabold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses & Menerbitkan Invoice...</span>
                    </>
                  ) : (
                    <>
                      <span>Konfirmasi Pesanan & Lacak Langsung</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
