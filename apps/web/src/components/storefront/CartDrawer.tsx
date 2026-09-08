'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, MapPin, Truck, Ticket, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useAuthStore } from '@/stores/useAuthStore';
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

  const [inputVoucher, setInputVoucher] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);

    const invoiceNo = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    const selectedMeetup = MOCK_MEETUP_POINTS.find((m) => m.id === selectedCodPointId);

    const newOrder: MockOrder = {
      id: `ord-${Date.now()}`,
      invoiceNumber: invoiceNo,
      customerName: user?.name || 'Siti Anggraini',
      customerPhone: user?.phone || '081298765432',
      customerEmail: user?.email || 'siti.anggraini@student.ui.ac.id',
      customerAvatarEmoji: user?.avatarEmoji || '🌸',
      currentStep: 1, // PAYMENT_CONFIRMED
      stepStatus: 'PAYMENT_CONFIRMED',
      statusLabel: 'Pembayaran Terkonfirmasi',
      statusDescription: 'Pesanan telah berhasil dibuat dan diverifikasi sistem atelier.',
      fulfillmentType,
      meetupPointName: fulfillmentType === 'COD_MEETUP_POINT' ? selectedMeetup?.name : undefined,
      courierName: fulfillmentType === 'COURIER_EXPEDITION' ? 'J&T Express (Biteship Aggregator)' : undefined,
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
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col drawer-slide-in">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-theme-border flex items-center justify-between bg-theme-surface-subtle">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-theme-primary text-white flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-stone-800">Keranjang Belanja</h2>
                <span className="text-[11px] text-stone-500">{items.length} Macam Buket Dipilih</span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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
                          className="text-stone-400 hover:text-theme-primary transition-colors"
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
                            className="p-1 text-stone-600 hover:bg-stone-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1 text-stone-600 hover:bg-rose-50"
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
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
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
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
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
                      className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold"
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
                      <span>Kupon Aktif: <strong>{voucherCode}</strong> (-Rp {discountAmount.toLocaleString('id-ID')})</span>
                      <button type="button" onClick={removeVoucher} className="text-stone-400 hover:text-stone-600">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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

          {/* Footer & Checkout */}
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
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="btn-primary-atelier w-full py-3.5 text-xs sm:text-sm font-extrabold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses Pesanan...</span>
                  </>
                ) : (
                  <>
                    <span>Proses Checkout & Lacak</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
