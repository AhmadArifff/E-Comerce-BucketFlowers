'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  X, 
  Check, 
  Sparkles, 
  Phone, 
  ShieldCheck, 
  ShoppingBag,
  Info
} from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useChatStore } from '@/stores/useChatStore';
import { showMagicToast } from '@/lib/magic-motion';
import { getApiUrl } from '@/lib/api-client';
import { ATELIER_CONFIG, normalizeWhatsAppNumber } from '@chenille/shared';

export interface CodMeetupPoint {
  id: string;
  name: string;
  full_address: string;
  google_maps_url: string;
  distance_km: number;
  delivery_notes?: string;
  is_free_shipping?: boolean;
  delivery_fee?: number;
}

const FALLBACK_COD_POINTS: CodMeetupPoint[] = [
  {
    id: 'cod-001',
    name: 'Universitas Indonesia (Stasiun UI / Rotunda)',
    full_address: 'Stasiun Kereta UI, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424',
    google_maps_url: 'https://maps.google.com/?q=-6.3628,106.8315',
    distance_km: 2.1,
    delivery_notes: 'Titik temu di Indomaret Point Stasiun UI atau Halte Bikun Rektorat UI',
    is_free_shipping: true,
    delivery_fee: 0,
  },
  {
    id: 'cod-002',
    name: 'Universitas Gunadarma Kampus D Margonda',
    full_address: 'Jl. Margonda Raya No. 100, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424',
    google_maps_url: 'https://maps.google.com/?q=-6.3692,106.8322',
    distance_km: 1.4,
    delivery_notes: 'Titik temu di lobi depan Gedung 1 Kampus D Margonda',
    is_free_shipping: true,
    delivery_fee: 0,
  },
  {
    id: 'cod-003',
    name: 'Margo City Mall Depok (Lobby Starbucks GF)',
    full_address: 'Jl. Margonda Raya No. 358, Kemiri Muka, Beji, Kota Depok, Jawa Barat 16423',
    google_maps_url: 'https://maps.google.com/?q=-6.3732,106.8345',
    distance_km: 1.8,
    delivery_notes: 'Lobby Utama depan Starbucks GF, dekat area drop-off mobil',
    is_free_shipping: true,
    delivery_fee: 0,
  },
  {
    id: 'cod-004',
    name: 'Politeknik Negeri Jakarta (PNJ - Gerbang Utama Kukusan)',
    full_address: 'Kukusan, Beji, Kota Depok, Jawa Barat 16425',
    google_maps_url: 'https://maps.google.com/?q=-6.3601,106.8272',
    distance_km: 2.8,
    delivery_notes: 'Titik temu di gerbang utama / pos satpam PNJ Kukusan',
    is_free_shipping: true,
    delivery_fee: 0,
  },
  {
    id: 'cod-005',
    name: 'Stasiun KRL Pondok Cina (Pintu Timur)',
    full_address: 'Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424',
    google_maps_url: 'https://maps.google.com/?q=-6.3688,106.8336',
    distance_km: 1.6,
    delivery_notes: 'Pintu keluar timur dekat jembatan penyeberangan Margo City',
    is_free_shipping: true,
    delivery_fee: 0,
  },
  {
    id: 'cod-006',
    name: 'Balairung UI / D Mall Depok (Pintu Masuk Utama)',
    full_address: 'Pelataran Balairung UI & Jl. Margonda Raya Kav. 88, Kemiri Muka, Depok 16423',
    google_maps_url: 'https://maps.google.com/?q=-6.3627,106.8315',
    distance_km: 2.2,
    delivery_notes: 'Drop-off pelataran Balairung UI atau lobby pintu masuk utama Margonda',
    is_free_shipping: true,
    delivery_fee: 0,
  },
];

export const CODLocationsModal: React.FC = () => {
  const { isCodModalOpen, openCodModal, closeCodModal } = useChatStore();
  const isOpen = isCodModalOpen;

  const [points, setPoints] = useState<CodMeetupPoint[]>(FALLBACK_COD_POINTS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState<string>('cod-001');

  const { setFulfillmentType, setSelectedCodPointId, setIsCartOpen } = useCartStore();
  const { waNumber } = useSettingsStore();

  const activeWa = waNumber || ATELIER_CONFIG.phone;

  // Global event listener to open this modal from anywhere (Chat chips, buttons, hash)
  useEffect(() => {
    const handleOpen = () => {
      openCodModal();
    };

    window.addEventListener('open-cod-modal', handleOpen);

    // Check hash on mount or hashchange
    const checkHash = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#cod-meetup') {
        openCodModal();
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('open-cod-modal', handleOpen);
      window.removeEventListener('hashchange', checkHash);
    };
  }, [openCodModal]);

  // Fetch real-time points from backend API
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    fetch(getApiUrl('/api/v1/cod-points'))
      .then((r) => r.json())
      .then((res) => {
        if (isMounted && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPoints(res.data);
        }
      })
      .catch((err) => {
        console.warn('Failed to load dynamic COD points, using fallback:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPointAndOrder = (point: CodMeetupPoint) => {
    setSelectedPointId(point.id);
    setFulfillmentType('COD_MEETUP_POINT');
    setSelectedCodPointId(point.id);
    closeCodModal();
    setIsCartOpen(true);

    showMagicToast(
      'Titik COD Dipilih! 🌸',
      `Lokasi serah terima diset ke ${point.name}. Siapkan uang pas saat terima buket.`,
      '🤝'
    );
  };

  const handleClose = () => {
    closeCodModal();
    if (typeof window !== 'undefined' && window.location.hash === '#cod-meetup') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-rose-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cod-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-50 via-pink-50/60 to-white border-b border-rose-100 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Layanan Bebas Ongkir Kampus Depok</span>
            </div>
            <h2 id="cod-modal-title" className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-heading flex items-center gap-2">
              <MapPin className="w-6 h-6 text-rose-600 flex-shrink-0" />
              <span>6 Titik Temu COD Resmi Chenille Florist</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Janjian serah terima langsung di kampus UI, Gunadarma, PNJ, Stasiun, atau Mall. 100% Bebas Ongkir (Radius ≤ 5 KM) & bisa bayar tunai pas di tempat!
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-stone-700 shadow-xs border border-stone-200/80 transition-all cursor-pointer flex-shrink-0"
            aria-label="Tutup popup titik COD"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Strip */}
        <div className="bg-stone-50 px-5 sm:px-6 py-2.5 border-b border-stone-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-4 text-stone-600 font-semibold text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              Gratis Ongkir Radius ≤ 5 KM
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              Garansi Cek Fisik Buket di Tempat
            </span>
          </div>
          <span className="text-[11px] text-stone-400">
            Atelier Origin: Depok (-6.3627, 106.8315)
          </span>
        </div>

        {/* Points Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-stone-50/40">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-stone-200 animate-pulse space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-1/3" />
                  <div className="h-3 bg-stone-100 rounded w-2/3" />
                  <div className="h-8 bg-stone-100 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {points.map((pt, idx) => {
                const isSelected = selectedPointId === pt.id;
                const distance = Number(pt.distance_km || 2.0);
                const isFree = pt.is_free_shipping ?? distance <= 5.0;

                return (
                  <div
                    key={pt.id || idx}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 bg-white ${
                      isSelected 
                        ? 'border-rose-500 shadow-md ring-2 ring-rose-100' 
                        : 'border-stone-200/90 hover:border-rose-300 shadow-xs hover:shadow-sm'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Name & Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <h3 className="text-sm font-bold text-stone-900 leading-snug">
                            {pt.name}
                          </h3>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wider ${
                            isFree
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isFree ? '⚡ Gratis Ongkir' : 'Ongkir Rp 10.000'}
                        </span>
                      </div>

                      {/* Distance */}
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                        <Navigation className="w-3.5 h-3.5 text-stone-400" />
                        <span>Estimasi jarak: ~{distance.toFixed(1)} KM dari Atelier</span>
                      </div>

                      {/* Address */}
                      <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        {pt.full_address}
                      </p>

                      {/* Meeting Spot Tips */}
                      {pt.delivery_notes && (
                        <div className="flex items-start gap-1.5 text-[11px] text-rose-700 bg-rose-50/70 p-2 rounded-lg border border-rose-100">
                          <Info className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                          <span className="font-medium leading-tight">
                            {pt.delivery_notes}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      {pt.google_maps_url && (
                        <a
                          href={pt.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl border border-stone-200 hover:border-stone-300 text-stone-700 hover:text-stone-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Buka titik koordinat di Google Maps"
                        >
                          <MapPin className="w-3.5 h-3.5 text-rose-600" />
                          <span>Peta</span>
                          <ExternalLink className="w-3 h-3 text-stone-400" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleSelectPointAndOrder(pt)}
                        className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs hover:shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Pilih & Lanjut Pesan</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info & WhatsApp Help */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-500 text-center sm:text-left">
            <span className="text-base">🤝</span>
            <span>Staf florist kami akan mengonfirmasi nomor WhatsApp Anda 15-30 menit sebelum jadwal temu.</span>
          </div>

          <a
            href={`https://wa.me/${normalizeWhatsAppNumber(activeWa)}?text=${encodeURIComponent('Halo Florist Chenille Atelier, saya ingin tanya ketersediaan janjian titik temu COD di area kampus Depok...')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-all flex-shrink-0 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chat CS Tanya Titik Lain</span>
          </a>
        </div>
      </div>
    </div>
  );
};
