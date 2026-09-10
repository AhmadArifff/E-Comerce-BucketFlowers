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
  ExternalLink,
} from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { getApiUrl } from '@/lib/api-client';
import { useMidtransSnap } from '@/hooks/useMidtransSnap';
import { MOCK_MEETUP_POINTS, type MockOrder } from '@chenille/shared';
import { showMagicToast } from '@/lib/magic-motion';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const { pay: payWithMidtrans } = useMidtransSnap();
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
    selectedCourier,
    setSelectedCourier,
    voucherCode,
    discountAmount,
    applyVoucher,
    setVoucherDiscount,
    removeVoucher,
    usePoints,
    pointsDiscount,
    redeemPointsAmount,
    setRedeemPointsAmount,
    togglePoints,
    getSubtotal,
    getShippingFee,
    getGrandTotal,
    clearCart,
  } = useCartStore();

  const { user } = useAuthStore();
  const { addNewOrder } = useOrderStore();
  const { paymentGateways, codPoints, logisticsConfig } = useSettingsStore();
  const [dbCodPoints, setDbCodPoints] = useState<any[]>([]);
  const [courierOptions, setCourierOptions] = useState<any[]>([]);
  const [isLoadingCouriers, setIsLoadingCouriers] = useState(false);

  // Fetch active COD points from Postgres API
  useEffect(() => {
    fetch(getApiUrl('/api/v1/cod-points'))
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.length > 0) {
          setDbCodPoints(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch live courier rates from Biteship Logistics API
  useEffect(() => {
    if (fulfillmentType === 'COURIER_EXPEDITION' && courierOptions.length === 0) {
      setIsLoadingCouriers(true);
      const activeCouriersStr = logisticsConfig?.activeCouriers
        ? Object.entries(logisticsConfig.activeCouriers)
            .filter(([_, active]) => active)
            .map(([code]) => code)
            .join(',')
        : 'jne,jnt,sicepat,gosend';

      fetch(getApiUrl('/api/v1/logistics/rates'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_postal_code: 16424,
          couriers: activeCouriersStr || 'jne,jnt,sicepat,gosend',
        }),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data?.length > 0) {
            setCourierOptions(res.data);
            if (!selectedCourier) {
              setSelectedCourier(res.data[0]);
            }
          }
        })
        .catch((err) => console.warn('Could not fetch courier rates:', err))
        .finally(() => setIsLoadingCouriers(false));
    }
  }, [fulfillmentType, courierOptions.length, selectedCourier, setSelectedCourier, logisticsConfig]);

  const activeMeetupPoints =
    dbCodPoints.length > 0
      ? dbCodPoints
      : codPoints && codPoints.length > 0
      ? codPoints
      : MOCK_MEETUP_POINTS;

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

  // Configurable Admin Fee based on selected payment gateway
  const selectedAdminFee =
    selectedPayment === 'midtrans'
      ? (paymentGateways.midtrans?.adminFee ?? 0)
      : selectedPayment === 'bcaManual'
      ? (paymentGateways.bcaManual?.adminFee ?? 0)
      : (paymentGateways.codCash?.adminFee ?? 0);

  const finalGrandTotal = grandTotal + selectedAdminFee;

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVoucher.trim()) return;

    try {
      const res = await fetch(getApiUrl('/api/v1/coupons/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputVoucher.trim(), subtotal }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setVoucherMsg({ type: 'success', text: data.message });
        setVoucherDiscount(data.data.code, data.data.discountAmount);
        setInputVoucher('');
        showMagicToast('Kupon Berhasil! 🎉', data.message, '🏷️');
      } else {
        setVoucherMsg({ type: 'error', text: data.error || 'Kupon tidak valid.' });
        showMagicToast('Kupon Tidak Valid ⚠️', data.error || 'Kupon tidak valid.', '⚠️');
      }
    } catch {
      const res = applyVoucher(inputVoucher);
      if (res.success) {
        setVoucherMsg({ type: 'success', text: res.message });
        setInputVoucher('');
        showMagicToast('Kupon Berhasil! 🎉', res.message, '🏷️');
      } else {
        setVoucherMsg({ type: 'error', text: res.message });
        showMagicToast('Kupon Tidak Valid ⚠️', res.message, '⚠️');
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setFormError(null);
    setStep('CHECKOUT');
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
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

    const selectedMeetup = activeMeetupPoints.find((m) => m.id === selectedCodPointId) || activeMeetupPoints[0];

    const paymentStatus: 'PAYMENT_CONFIRMED' | 'WAITING_PAYMENT' | 'PAID_ON_COD' =
      selectedPayment === 'midtrans'
        ? 'PAYMENT_CONFIRMED'
        : selectedPayment === 'codCash'
        ? 'PAID_ON_COD'
        : 'WAITING_PAYMENT';

    const orderPayload = {
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail.trim(),
      recipient_name: customerName.trim(),
      fulfillment_type: fulfillmentType,
      shipping_address: fulfillmentType === 'COURIER_EXPEDITION' ? deliveryAddress.trim() : null,
      courier_name:
        fulfillmentType === 'COURIER_EXPEDITION'
          ? (selectedCourier ? `${selectedCourier.courier_name} (${selectedCourier.courier_service_name})` : 'JNE Express Reguler')
          : null,
      cod_meetup_id: fulfillmentType === 'COD_MEETUP_POINT' ? selectedMeetup?.id || null : null,
      cod_notes: codMeetupNotes || null,
      coupon_code: voucherCode || null,
      redeem_points: usePoints ? redeemPointsAmount : 0,
      user_id: user?.id || null,
      payment_method:
        selectedPayment === 'bcaManual'
          ? 'MANUAL_BANK_BCA'
          : selectedPayment === 'codCash'
          ? 'COD_CASH_ON_DELIVERY'
          : 'MIDTRANS_SNAP_QRIS',
      theme_used: 'TEMA_A_KOREAN_PASTEL',
      items: items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
      })),
    };

    try {
      const res = await fetch(getApiUrl('/api/v1/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();

      if (!data.success) {
        setIsCheckingOut(false);
        setFormError(data.error || 'Gagal membuat pesanan.');
        showMagicToast('Gagal Checkout ⚠️', data.error || 'Stok tidak mencukupi.', '⚠️');
        return;
      }

      const savedOrder = data.data;
      const invoiceNo = savedOrder.id;

      const newOrder: MockOrder = {
        id: invoiceNo,
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
            ? 'Pembayaran via QRIS Midtrans berhasil diverifikasi otomatis di database Supabase.'
            : selectedPayment === 'bcaManual'
            ? 'Transfer BCA Manual tersimpan di Supabase. Silakan konfirmasi bukti via WhatsApp CS.'
            : 'Pesanan COD tersimpan di Supabase. Siapkan uang pas saat serah terima di titik temu.',
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
        discountAmount: discountAmount + pointsDiscount,
        adminFee: selectedAdminFee,
        flowerPointsEarned: Math.max(1, Math.floor(subtotal / 10000)),
        totalAmount: finalGrandTotal,
        createdAt: new Date().toISOString(),
        estimatedDelivery: 'Besok, 10:00 WIB',
      };

      // Handle Midtrans Snap Payment Gateway
      if (selectedPayment === 'midtrans' && savedOrder.snap_token) {
        payWithMidtrans(savedOrder.snap_token, invoiceNo, finalGrandTotal, {
          onSuccess: (result) => {
            addNewOrder({
              ...newOrder,
              paymentStatus: 'PAYMENT_CONFIRMED',
              statusLabel: 'Pembayaran QRIS Lunas',
              statusDescription: `Pembayaran lunas terkonfirmasi Midtrans (${result.payment_type || 'QRIS'}).`,
            });
            setIsCartOpen(false);
            clearCart();
            setIsCheckingOut(false);
            setStep('CART');
            showMagicToast('Pembayaran Midtrans Berhasil! 🌸', `Invoice ${invoiceNo} berhasil diverifikasi.`, '✨');
            router.push(`/portal?invoice=${invoiceNo}`);
          },
          onPending: () => {
            addNewOrder(newOrder);
            setIsCartOpen(false);
            clearCart();
            setIsCheckingOut(false);
            setStep('CART');
            showMagicToast('Menunggu Pembayaran ⏳', `Silakan selesaikan tagihan untuk ${invoiceNo}.`, '⏳');
            router.push(`/portal?invoice=${invoiceNo}`);
          },
          onError: () => {
            setIsCheckingOut(false);
            showMagicToast('Pembayaran Gagal ⚠️', 'Transaksi dibatalkan atau waktu habis.', '⚠️');
          },
          onClose: () => {
            setIsCheckingOut(false);
            showMagicToast('Jendela Ditutup', 'Pembayaran Midtrans belum selesai.', 'ℹ️');
          },
        });
        return;
      }

      addNewOrder(newOrder);
      setIsCartOpen(false);
      clearCart();
      setIsCheckingOut(false);
      setStep('CART');
      showMagicToast('Pesanan Berhasil Disimpan di Supabase! 🌸', `${invoiceNo} siap dipantau langsung di Portal Pelanggan.`, '✨');
      router.push(`/portal?invoice=${invoiceNo}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setIsCheckingOut(false);
      setFormError('Koneksi ke backend terputus. Silakan coba lagi.');
    }
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
                            <div>Ekspedisi Kurir</div>
                            <span className="text-[10px] text-stone-500 font-medium">
                              {selectedCourier ? `Rp ${selectedCourier.shipment_fee.toLocaleString('id-ID')}` : 'Mulai Rp 11.000'}
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* Biteship Multi-Courier Rates Selector */}
                      {fulfillmentType === 'COURIER_EXPEDITION' && (
                        <div className="pt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-semibold text-stone-600 block">
                              Pilih Layanan Ekspedisi (Biteship API):
                            </label>
                            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                              Asal: Margonda Depok
                            </span>
                          </div>

                          {isLoadingCouriers ? (
                            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-center text-xs text-stone-500 animate-pulse">
                              <span>Menghitung tarif kurir Biteship...</span>
                            </div>
                          ) : (
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                              {courierOptions.map((c: any, idx: number) => {
                                const isSelected =
                                  selectedCourier?.courier_code === c.courier_code &&
                                  selectedCourier?.courier_service_code === c.courier_service_code;
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => setSelectedCourier(c)}
                                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                                      isSelected
                                        ? 'border-theme-primary bg-theme-surface-subtle text-theme-primary shadow-xs ring-1 ring-theme-primary/30 font-bold'
                                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                          isSelected
                                            ? 'border-theme-primary bg-theme-primary text-white'
                                            : 'border-stone-300'
                                        }`}
                                      >
                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                      </div>
                                      <div>
                                        <div className="font-bold text-stone-800">{c.courier_name}</div>
                                        <div className="text-[10px] text-stone-500">
                                          {c.courier_service_name} • {c.duration}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-extrabold text-stone-900">
                                        Rp {c.shipment_fee.toLocaleString('id-ID')}
                                      </div>
                                      <div className="text-[9px] text-emerald-600 font-bold">{c.etd}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* COD Meetup Points Selector */}
                      {fulfillmentType === 'COD_MEETUP_POINT' && (
                        <div className="pt-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-semibold text-stone-600 block">
                              Pilih Titik Temu Kampus / Mall Terverifikasi:
                            </label>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Radius ≤ 5 KM Bebas Ongkir
                            </span>
                          </div>
                          <select
                            value={selectedCodPointId}
                            onChange={(e) => setSelectedCodPointId(e.target.value)}
                            className="w-full text-xs p-2.5 bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                          >
                            {activeMeetupPoints.map((pt) => (
                              <option key={pt.id} value={pt.id}>
                                {pt.name} ({pt.distanceKm || pt.distance_km} KM • {Number(pt.distanceKm || pt.distance_km) <= 5 ? 'Gratis Ongkir' : 'Ongkir Rp 10.000'})
                              </option>
                            ))}
                          </select>

                          {/* Detail & Direct Link Google Maps */}
                          {(() => {
                            const curPt = activeMeetupPoints.find((p) => p.id === selectedCodPointId) || activeMeetupPoints[0];
                            if (!curPt) return null;
                            const distance = Number(curPt.distanceKm || curPt.distance_km || 2.5);
                            return (
                              <div className="p-2.5 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-extrabold text-stone-800 text-[11px] flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                                    <span>{curPt.name}</span>
                                  </span>
                                  <a
                                    href={curPt.googleMapsUrl || curPt.google_maps_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] font-bold text-rose-600 hover:text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1 shadow-2xs hover:bg-rose-50 transition-colors flex-shrink-0"
                                  >
                                    <span>Buka Google Maps</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </div>
                                <p className="text-[10.5px] text-stone-600 leading-tight">
                                  {curPt.fullAddress || curPt.full_address}
                                </p>
                                <div className="flex items-center justify-between text-[10px] pt-0.5">
                                  <span className="text-stone-500">
                                    Jarak dari Atelier: <strong>{distance} KM</strong>
                                  </span>
                                  <span className={`font-bold px-1.5 py-0.2 rounded ${distance <= 5 ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'}`}>
                                    {distance <= 5 ? '✓ Gratis Ongkir' : '+Rp 10.000'}
                                  </span>
                                </div>
                                {(curPt.deliveryNotes || curPt.delivery_notes) && (
                                  <p className="text-[10px] text-stone-500 italic">
                                    💡 {curPt.deliveryNotes || curPt.delivery_notes}
                                  </p>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Voucher Code Form */}
                    <div className="space-y-2">
                      <form onSubmit={handleApplyVoucher} className="space-y-1.5">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder={usePoints ? "Hapus poin untuk pakai kupon" : "Kode kupon (contoh: WISUDAHEMAT)"}
                              value={inputVoucher}
                              onChange={(e) => setInputVoucher(e.target.value)}
                              disabled={usePoints}
                              className={`w-full pl-8 pr-3 py-2 text-xs uppercase border rounded-xl focus:outline-none transition-all ${
                                usePoints
                                  ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                                  : 'bg-white border-rose-200 focus:ring-2 focus:ring-rose-500'
                              }`}
                            />
                            <Ticket className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                          </div>
                          <button
                            type="submit"
                            disabled={usePoints || !inputVoucher.trim()}
                            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Gunakan
                          </button>
                        </div>
                        {usePoints && (
                          <div className="text-[10px] text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 flex-shrink-0 text-amber-600" />
                            <span>Flower Points aktif. Sesuai aturan, 1 order hanya bisa memakai kupon ATAU poin.</span>
                          </div>
                        )}
                        {voucherMsg && (
                          <div
                            className={`text-[11px] font-semibold px-2 py-1 rounded-lg ${
                              voucherMsg.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {voucherMsg.text}
                          </div>
                        )}
                        {voucherCode && (
                          <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl">
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4 text-emerald-600" />
                              <span>
                                Kupon Aktif: <strong>{voucherCode}</strong> (-Rp {discountAmount.toLocaleString('id-ID')})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={removeVoucher}
                              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="Hapus kupon"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </form>

                      {/* Flower Points Redemption Card */}
                      <div
                        className={`p-3 rounded-2xl border transition-all ${
                          voucherCode
                            ? 'bg-stone-50 border-stone-200 opacity-80'
                            : usePoints
                            ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-300 shadow-xs'
                            : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-amber-950 text-xs">Chenille Flower Points</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-200/80 text-amber-900">
                                  Saldo: {userPoints} Poin
                                </span>
                              </div>
                              <div className="text-[10px] text-amber-800/80 mt-0.5 font-medium">
                                Kurs Loyalty: 10 Poin = Diskon Rp 5.000 (Min. 10 Poin)
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={Boolean(voucherCode) || userPoints < 10}
                            onClick={() => togglePoints(userPoints)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              usePoints
                                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                                : voucherCode || userPoints < 10
                                ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                                : 'bg-white text-amber-800 border border-amber-300 hover:bg-amber-100 shadow-xs'
                            }`}
                          >
                            {usePoints ? 'Aktif ✓' : 'Tukar Poin'}
                          </button>
                        </div>

                        {/* If voucher is active, inform user about exclusive rule */}
                        {voucherCode && (
                          <div className="mt-2 text-[10px] text-stone-600 bg-stone-100 px-2.5 py-1.5 rounded-lg border border-stone-200 flex items-center justify-between">
                            <span>Kupon <strong>{voucherCode}</strong> aktif. Hapus kupon untuk menukar poin.</span>
                            <button
                              type="button"
                              onClick={() => {
                                removeVoucher();
                                togglePoints(userPoints);
                              }}
                              className="text-theme-primary font-bold hover:underline ml-2 flex-shrink-0"
                            >
                              Ganti ke Poin
                            </button>
                          </div>
                        )}

                        {/* Points Selector / Steppers when Points is active */}
                        {usePoints && (
                          <div className="mt-3 pt-2.5 border-t border-amber-200 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-amber-900">Poin Ditukar:</span>
                              <span className="font-black text-amber-900 bg-white px-2 py-0.5 rounded-md border border-amber-300 shadow-2xs">
                                {redeemPointsAmount} Poin = -Rp {pointsDiscount.toLocaleString('id-ID')}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                              {[10, 20, 30, 40, 50, 100]
                                .filter((pts) => pts <= userPoints && pts * 500 <= subtotal)
                                .map((pts) => (
                                  <button
                                    key={pts}
                                    type="button"
                                    onClick={() => setRedeemPointsAmount(pts, userPoints)}
                                    className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                                      redeemPointsAmount === pts
                                        ? 'bg-amber-700 text-white shadow-xs'
                                        : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'
                                    }`}
                                  >
                                    {pts} Poin (-Rp {(pts * 500).toLocaleString('id-ID')})
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer & Checkout Button */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-rose-100 bg-white space-y-3 shadow-lg">
                  {/* Loyalty Points Earned Preview Banner */}
                  <div className="flex items-center justify-between text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Bonus Loyalty Order Ini:
                    </span>
                    <span className="font-black text-amber-900">
                      +{Math.max(1, Math.floor(subtotal / 10000))} Flower Points 🌸
                    </span>
                  </div>

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
                        <span>Diskon Kupon ({voucherCode})</span>
                        <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    {pointsDiscount > 0 && (
                      <div className="flex justify-between text-amber-600 font-semibold">
                        <span>Diskon Flower Points ({redeemPointsAmount} Poin)</span>
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
                        <div className="text-xs font-bold text-stone-800 flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-theme-primary flex-shrink-0" />
                            <span className="truncate">
                              {activeMeetupPoints.find((p) => p.id === selectedCodPointId)?.name || 'Titik Temu UI'}
                            </span>
                          </div>
                          <a
                            href={activeMeetupPoints.find((p) => p.id === selectedCodPointId)?.googleMapsUrl || 'https://maps.google.com/?q=Margonda+Raya+Depok'}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5 hover:underline flex-shrink-0"
                          >
                            <span>Maps</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
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
                            <div className="text-xs font-black text-stone-800 flex items-center gap-1.5 flex-wrap">
                              <CreditCard className="w-3.5 h-3.5 text-theme-primary" />
                              <span>Midtrans Snap QRIS & Virtual Account</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-stone-100 text-stone-700">
                                {paymentGateways.midtrans.adminFee > 0
                                  ? `+ Fee Rp ${paymentGateways.midtrans.adminFee.toLocaleString('id-ID')}`
                                  : 'Bebas Admin'}
                              </span>
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
                            <div className="text-xs font-black text-stone-800 flex items-center gap-1.5 flex-wrap">
                              <Building className="w-3.5 h-3.5 text-blue-600" />
                              <span>Transfer Bank BCA Manual</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700">
                                {paymentGateways.bcaManual.adminFee > 0
                                  ? `+ Fee Rp ${paymentGateways.bcaManual.adminFee.toLocaleString('id-ID')}`
                                  : 'Bebas Admin'}
                              </span>
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
                            <div className="text-xs font-black text-stone-800 flex items-center gap-1.5 flex-wrap">
                              <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Bayar Tunai Pas Serah Terima (COD)</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700">
                                {paymentGateways.codCash.adminFee > 0
                                  ? `+ Fee Rp ${paymentGateways.codCash.adminFee.toLocaleString('id-ID')}`
                                  : 'Bebas Admin'}
                              </span>
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
                <div className="space-y-1 pb-1 border-b border-stone-100 text-xs text-stone-600">
                  <div className="flex justify-between items-center">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-stone-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  {shippingFee > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Ongkir:</span>
                      <span className="font-semibold text-stone-800">Rp {shippingFee.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span>Kupon Diskon:</span>
                      <span className="font-semibold">- Rp {discountAmount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {selectedAdminFee > 0 && (
                    <div className="flex justify-between items-center text-rose-700 font-medium">
                      <span>Biaya Admin / Layanan ({selectedPayment === 'midtrans' ? 'Midtrans' : selectedPayment === 'bcaManual' ? 'BCA' : 'COD'}):</span>
                      <span className="font-bold">+ Rp {selectedAdminFee.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500 font-medium">Total Pembayaran Akhir:</span>
                  <span className="text-base font-black text-theme-primary">
                    Rp {finalGrandTotal.toLocaleString('id-ID')}
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
