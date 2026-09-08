'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { LiveChatWidget } from '@/components/storefront/LiveChatWidget';
import { MemberHeader } from '@/components/portal/MemberHeader';
import { OrderStepper } from '@/components/portal/OrderStepper';
import { GuestTracker } from '@/components/portal/GuestTracker';
import { PointsAndVouchers } from '@/components/portal/PointsAndVouchers';
import { WarrantyClaimModal } from '@/components/portal/WarrantyClaimModal';
import { useOrderStore } from '@/stores/useOrderStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { showMagicToast } from '@/lib/magic-motion';
import { MOCK_PRODUCTS, MOCK_MEETUP_POINTS, type MockOrder } from '@chenille/shared';
import {
  Package,
  Clock,
  ShieldCheck,
  MapPin,
  Truck,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Plus,
  Check,
  RotateCw,
  X,
  FileText,
  Search,
} from 'lucide-react';

export default function CustomerPortalPage() {
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'MEMBER' | 'GUEST'>('MEMBER');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [isCreateTestOrderOpen, setIsCreateTestOrderOpen] = useState(false);

  // New Test Order Form State
  const [testBouquetId, setTestBouquetId] = useState(MOCK_PRODUCTS[0]?.id || 'prod-01');
  const [testCustomerName, setTestCustomerName] = useState('Siti Anggraini');
  const [testCustomerPhone, setTestCustomerPhone] = useState('0812-9876-5432');
  const [testFulfillment, setTestFulfillment] = useState<'COD_MEETUP_POINT' | 'COURIER_EXPEDITION'>('COD_MEETUP_POINT');
  const [testMeetupId, setTestMeetupId] = useState(MOCK_MEETUP_POINTS[0]?.id || 'cod-01');

  const { orders, activeOrderId, setActiveOrderId, updateOrderStep, addNewOrder, warrantyClaims } = useOrderStore();
  const { user } = useAuthStore();

  // Sync data-theme attribute on client mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  // Navigation handler from Navbar when on Portal
  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'tracking') {
      const el = document.getElementById('portal-order-tracker');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (sectionId === 'bantuan') {
      setIsWarrantyOpen(true);
    } else {
      window.location.href = sectionId === 'home' ? '/' : `/#${sectionId}`;
    }
  };

  // Quick Step Advance / Test Handler
  const handleStepAdvance = (step: number) => {
    if (!activeOrder) return;
    updateOrderStep(activeOrder.id, step);
    const stepNames: Record<number, string> = {
      1: 'Pembayaran Terkonfirmasi',
      2: 'Sedang Dirangkai Pengrajin',
      3: 'Quality Check Lolos',
      4: activeOrder.fulfillmentType === 'COD_MEETUP_POINT' ? 'Siap di Titik Temu COD' : 'Dalam Pengiriman Kurir',
    };
    showMagicToast(
      'Status Diperbarui! ⚡',
      `${activeOrder.invoiceNumber} sekarang di Langkah ${step} (${stepNames[step] || ''}).`,
      '🚀'
    );
  };

  // Handle Create New Test Order
  const handleCreateTestOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenProduct = MOCK_PRODUCTS.find((p) => p.id === testBouquetId) || MOCK_PRODUCTS[0];
    const chosenMeetup = MOCK_MEETUP_POINTS.find((m) => m.id === testMeetupId) || MOCK_MEETUP_POINTS[0];
    const price = chosenProduct.discountPrice ?? chosenProduct.price;
    const invNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const newMock: MockOrder = {
      id: `ord-${Date.now()}`,
      invoiceNumber: invNumber,
      customerName: testCustomerName.trim() || 'Pelanggan Uji Coba',
      customerPhone: testCustomerPhone.trim() || '0812-9988-7711',
      customerEmail: 'customer.test@chenille.com',
      customerAvatarEmoji: '🌸',
      currentStep: 1,
      stepStatus: 'PAYMENT_CONFIRMED',
      statusLabel: 'Pembayaran Terkonfirmasi',
      statusDescription: 'Pesanan uji coba berhasil dibuat. Menunggu antrean florist perangkai kawat bulu.',
      fulfillmentType: testFulfillment,
      meetupPointName: testFulfillment === 'COD_MEETUP_POINT' ? chosenMeetup.name : undefined,
      courierName: testFulfillment === 'COURIER_EXPEDITION' ? 'J&T Express Fragile' : undefined,
      trackingNumber: testFulfillment === 'COURIER_EXPEDITION' ? `BTE-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
      items: [
        {
          productId: chosenProduct.id,
          productName: chosenProduct.name,
          productImage: chosenProduct.image,
          quantity: 1,
          unitPrice: price,
          subtotal: price,
        },
      ],
      subtotalAmount: price,
      shippingFee: 0,
      discountAmount: 0,
      flowerPointsEarned: Math.floor(price / 1000),
      totalAmount: price,
      createdAt: new Date().toISOString(),
      estimatedDelivery: 'Besok, 10:00 WIB',
    };

    addNewOrder(newMock);
    setIsCreateTestOrderOpen(false);
    setActiveTab('MEMBER');
    showMagicToast('Pesanan Uji Coba Dibuat! 🌸', `${newMock.invoiceNumber} berhasil ditambahkan dan aktif dipantau.`, '✨');
  };

  // Filtered orders for order history
  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchInvoice = ord.invoiceNumber.toLowerCase().includes(q);
    const matchCustomer = ord.customerName.toLowerCase().includes(q);
    const matchItem = ord.items.some((i) => i.productName.toLowerCase().includes(q));
    return matchInvoice || matchCustomer || matchItem;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-stone-50/50">
      <AnnouncementBar />
      <Navbar
        activeSection="tracking"
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Portal Mode Switcher & Quick Test Action */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">
              Portal Pelanggan Chenille Atelier
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight">
              Pelacakan Pesanan & Akun Member
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsCreateTestOrderOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
              title="Buat pesanan simulasi baru untuk pengujian"
            >
              <Plus className="w-4 h-4" />
              <span>+ Uji Coba Pesanan Baru</span>
            </button>

            <div className="flex p-1 bg-stone-100 rounded-2xl border border-stone-200">
              <button
                onClick={() => setActiveTab('MEMBER')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'MEMBER'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Member Hub ({user?.name ? user.name.split(' ')[0] : 'Siti'})
              </button>
              <button
                onClick={() => setActiveTab('GUEST')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'GUEST'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Lacak Tamu (Guest)
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'GUEST' ? (
          <GuestTracker />
        ) : (
          <div className="space-y-8 animate-in fade-in">
            {/* Member Profile Header */}
            <MemberHeader />

            {/* ORDER SWITCHER PILL BAR FOR TESTING */}
            <div className="bg-white rounded-2xl p-3.5 border border-rose-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-stone-700 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-rose-600" />
                  <span>Pilih Pesanan untuk Dipantau / Diuji:</span>
                </span>
                <span className="text-[11px] text-stone-400 font-medium">
                  {orders.length} Pesanan Tersedia
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {orders.map((ord) => {
                  const isSelected = activeOrderId === ord.id;
                  return (
                    <button
                      key={ord.id}
                      onClick={() => setActiveOrderId(ord.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-xs scale-102'
                          : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-rose-50 hover:border-rose-200'
                      }`}
                    >
                      <span>{ord.invoiceNumber}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                          isSelected ? 'bg-white text-rose-700' : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        Langkah {ord.currentStep}/4
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Order Stepper Card */}
            {activeOrder && (
              <div id="portal-order-tracker" className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-rose-600 uppercase tracking-wider">
                        {activeOrder.invoiceNumber}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                        {activeOrder.statusLabel}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-stone-800 mt-1">
                      Pesanan Sedang Dipantau Langsung
                    </h3>
                  </div>

                  <div className="text-xs text-stone-500 text-left sm:text-right">
                    <span>Estimasi Sampai: </span>
                    <strong className="text-stone-800">{activeOrder.estimatedDelivery || 'Besok'}</strong>
                  </div>
                </div>

                {/* 4-Step Animated Stepper with Interactive Node Clicking */}
                <div className="py-3">
                  <OrderStepper
                    currentStep={activeOrder.currentStep}
                    fulfillmentType={activeOrder.fulfillmentType}
                    meetupPointName={activeOrder.meetupPointName}
                    courierName={activeOrder.courierName}
                    onStepClick={handleStepAdvance}
                  />
                </div>

                {/* INTERACTIVE STEPPER CONTROL TOOLBAR FOR IMMEDIATE TESTING */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-black uppercase text-stone-600 tracking-wider block">
                      ⚡ Simulator Cepat Status (Uji Animasi Langsung):
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      Klik tombol langkah untuk melihat laser beam & teks status bergerak:
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { step: 1, label: '1. Bayar' },
                      { step: 2, label: '2. Rangkai' },
                      { step: 3, label: '3. QC Lolos' },
                      { step: 4, label: '4. Siap/Kirim' },
                    ].map((btn) => {
                      const isCurrent = activeOrder.currentStep === btn.step;
                      return (
                        <button
                          key={btn.step}
                          onClick={() => handleStepAdvance(btn.step)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                            isCurrent
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs scale-105'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-rose-50 hover:border-rose-300'
                          }`}
                          title={`Uji coba: Set pesanan ke langkah ${btn.step}`}
                        >
                          {isCurrent && <Check className="w-3 h-3 inline mr-1 stroke-[3]" />}
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Explanation Card */}
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-800">
                      Informasi Progres Terkini: {activeOrder.statusLabel}
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                      {activeOrder.statusDescription}
                    </p>
                  </div>
                </div>

                {/* Order Items & Fulfillment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      Metode Penyerahan Buket
                    </span>
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                      {activeOrder.fulfillmentType === 'COD_MEETUP_POINT' ? (
                        <>
                          <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <span>Titik Temu COD: {activeOrder.meetupPointName || 'Stasiun UI Depok'}</span>
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <span>Kurir: {activeOrder.courierName || 'J&T Express Fragile'} (Resi: {activeOrder.trackingNumber || 'Dalam Proses'})</span>
                        </>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold block">
                      Bebas Ongkir Terverifikasi Geofencing
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      Rincian Pembayaran
                    </span>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-stone-600">Total Transaksi:</span>
                      <span className="text-rose-600 font-black">
                        Rp {activeOrder.totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400">
                      Mendapatkan +{activeOrder.flowerPointsEarned} Flower Points
                    </div>
                  </div>
                </div>

                {/* 100% Warranty Claim Guarantee Action Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-rose-600 flex items-center justify-center shadow-sm shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-stone-800">
                        Garansi 100% Anti-Patah & Ganti Baru
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Bunga bengkok atau tertindih kurir saat unboxing? Kami ganti 100% baru tanpa dipungut biaya!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsWarrantyOpen(true)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm shadow-rose-600/20 active:scale-95 transition-all shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    Klaim Garansi 100%
                  </button>
                </div>
              </div>
            )}

            {/* Warranty Claims List (if any) */}
            {warrantyClaims.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-rose-600" />
                    <h3 className="text-base font-extrabold text-stone-800">
                      Tiket Klaim Garansi Saya
                    </h3>
                  </div>
                  <span className="text-xs text-rose-600 font-bold">{warrantyClaims.length} Tiket Diajukan</span>
                </div>

                <div className="space-y-3">
                  {warrantyClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-stone-800">{claim.id}</span>
                          <span className="text-[11px] font-bold text-rose-600 font-mono">({claim.invoiceNumber})</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            claim.status === 'APPROVED_REPLACE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : claim.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {claim.status === 'APPROVED_REPLACE'
                              ? 'Disetujui: Ganti Baru 100%'
                              : claim.status === 'REJECTED'
                              ? 'Ditolak'
                              : 'Sedang Diverifikasi Florist'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600">{claim.description}</p>
                        {claim.adminNote && (
                          <div className="text-[11px] text-stone-500 italic bg-white p-2 rounded-xl border border-stone-200 mt-1">
                            Catatan Atelier: &ldquo;{claim.adminNote}&rdquo;
                          </div>
                        )}
                      </div>

                      <div className="text-right text-[11px] text-stone-400">
                        {new Date(claim.createdAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loyalty Points & Vouchers */}
            <PointsAndVouchers />

            {/* Order History Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-stone-800">
                    Riwayat Pesanan Saya
                  </h3>
                  <p className="text-xs text-stone-500">
                    Klik pesanan di bawah untuk melihat progres dan animasi pelacakan langsung.
                  </p>
                </div>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  {filteredOrders.length} Pesanan Ditemukan
                </span>
              </div>

              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-400 font-medium">
                    Tidak ada pesanan yang sesuai dengan pencarian.
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setActiveOrderId(ord.id);
                        const el = document.getElementById('portal-order-tracker');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                        activeOrderId === ord.id
                          ? 'bg-rose-50/50 border-rose-500 shadow-sm ring-1 ring-rose-400'
                          : 'bg-stone-50/50 border-stone-200 hover:bg-rose-50/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-stone-800">
                            {ord.invoiceNumber}
                          </span>
                          <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                            Langkah {ord.currentStep}/4: {ord.statusLabel}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                        <div className="text-left sm:text-right">
                          <div className="font-black text-rose-600">
                            Rp {ord.totalAmount.toLocaleString('id-ID')}
                          </div>
                          <span className="text-[10px] text-stone-400">
                            {new Date(ord.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CREATE TEST ORDER MODAL */}
      {isCreateTestOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-stone-800 text-sm">Buat Pesanan Uji Coba Baru</h3>
              </div>
              <button
                onClick={() => setIsCreateTestOrderOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTestOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Pilih Produk Buket</label>
                <select
                  value={testBouquetId}
                  onChange={(e) => setTestBouquetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
                >
                  {MOCK_PRODUCTS.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} - Rp {(prod.discountPrice ?? prod.price).toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nama Pemesan</label>
                  <input
                    type="text"
                    required
                    value={testCustomerName}
                    onChange={(e) => setTestCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={testCustomerPhone}
                    onChange={(e) => setTestCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Metode Pengiriman</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTestFulfillment('COD_MEETUP_POINT')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      testFulfillment === 'COD_MEETUP_POINT'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-2xs'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    📍 COD Titik Temu UI
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestFulfillment('COURIER_EXPEDITION')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      testFulfillment === 'COURIER_EXPEDITION'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-2xs'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    🚚 Kurir J&T Fragile
                  </button>
                </div>
              </div>

              {testFulfillment === 'COD_MEETUP_POINT' && (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Pilih Titik Temu Kampus</label>
                  <select
                    value={testMeetupId}
                    onChange={(e) => setTestMeetupId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white"
                  >
                    {MOCK_MEETUP_POINTS.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.name} ({pt.distanceKm} km dari atelier)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateTestOrderOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  Buat & Lacak Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warranty Modal */}
      <WarrantyClaimModal
        isOpen={isWarrantyOpen}
        onClose={() => setIsWarrantyOpen(false)}
        defaultInvoice={activeOrder?.invoiceNumber}
        customerName={user?.name}
        customerPhone={user?.phone}
      />

      {/* Cart Drawer for Full E-Commerce Flow */}
      <CartDrawer />

      {/* Live Chat Concierge Widget */}
      <LiveChatWidget />

      <Footer />
    </div>
  );
}
