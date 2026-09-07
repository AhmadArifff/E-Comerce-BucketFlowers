'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { MemberHeader } from '@/components/portal/MemberHeader';
import { OrderStepper } from '@/components/portal/OrderStepper';
import { GuestTracker } from '@/components/portal/GuestTracker';
import { PointsAndVouchers } from '@/components/portal/PointsAndVouchers';
import { useOrderStore } from '@/stores/useOrderStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Package, Clock, ShieldCheck, MapPin, Truck, ChevronRight, Sparkles } from 'lucide-react';

export default function CustomerPortalPage() {
  const [activeTab, setActiveTab] = useState<'MEMBER' | 'GUEST'>('MEMBER');
  const [searchQuery, setSearchQuery] = useState('');
  const { orders, activeOrderId, setActiveOrderId } = useOrderStore();
  const { user } = useAuthStore();

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  return (
    <div className="flex-1 flex flex-col">
      <AnnouncementBar />
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Portal Mode Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">
              Portal Pelanggan Chenille Atelier
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight">
              Pelacakan Pesanan & Akun Member
            </h1>
          </div>

          <div className="flex p-1 bg-stone-100 rounded-2xl border border-stone-200">
            <button
              onClick={() => setActiveTab('MEMBER')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'MEMBER'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Member Hub ({user?.name ? user.name.split(' ')[0] : 'Siti'})
            </button>
            <button
              onClick={() => setActiveTab('GUEST')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'GUEST'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Lacak Tamu (Guest)
            </button>
          </div>
        </div>

        {activeTab === 'GUEST' ? (
          <GuestTracker />
        ) : (
          <div className="space-y-8 animate-in fade-in">
            {/* Member Profile Header */}
            <MemberHeader />

            {/* Active Order Stepper Card */}
            {activeOrder && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
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
                    <strong className="text-stone-800">{activeOrder.estimatedDelivery}</strong>
                  </div>
                </div>

                {/* 4-Step Animated Stepper with Magic Beam Laser */}
                <div className="py-3">
                  <OrderStepper
                    currentStep={activeOrder.currentStep}
                    fulfillmentType={activeOrder.fulfillmentType}
                    meetupPointName={activeOrder.meetupPointName}
                    courierName={activeOrder.courierName}
                  />
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
                          <MapPin className="w-4 h-4 text-rose-600" />
                          <span>Titik Temu COD: {activeOrder.meetupPointName}</span>
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4 text-rose-600" />
                          <span>Kurir: {activeOrder.courierName} (Resi: {activeOrder.trackingNumber || 'Dalam Proses'})</span>
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
              </div>
            )}

            {/* Loyalty Points & Vouchers */}
            <PointsAndVouchers />

            {/* Order History Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-stone-800">
                  Riwayat Pesanan Saya
                </h3>
                <span className="text-xs text-stone-400">{orders.length} Pesanan</span>
              </div>

              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setActiveOrderId(ord.id)}
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
                          Langkah {ord.currentStep}/4
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
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
