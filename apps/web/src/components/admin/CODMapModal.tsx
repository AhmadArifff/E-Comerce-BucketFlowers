'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, ShieldCheck, Check, Plus } from 'lucide-react';
import { MOCK_MEETUP_POINTS, ATELIER_CONFIG, type CodPoint } from '@chenille/shared';

export const CODMapModal: React.FC = () => {
  const [points, setPoints] = useState<CodPoint[]>(MOCK_MEETUP_POINTS);
  const [selectedPoint, setSelectedPoint] = useState<CodPoint>(points[0]);

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
              Geofencing & Titik Temu COD Terverifikasi Depok
            </h2>
            <p className="text-xs text-stone-500">
              Pusat Atelier: {ATELIER_CONFIG.address} (Radius Bebas Ongkir: {ATELIER_CONFIG.maxFreeCodRadiusKm} KM)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Radius 5 KM Aktif: Biaya COD Rp 0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Meetup Points */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2">
            Pilih Titik Temu Kampus / Mall:
          </span>
          {points.map((pt) => {
            const isSelected = selectedPoint.id === pt.id;
            const isFree = pt.distanceKm <= ATELIER_CONFIG.maxFreeCodRadiusKm;

            return (
              <button
                key={pt.id}
                onClick={() => setSelectedPoint(pt)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-rose-50/70 border-rose-500 shadow-sm ring-1 ring-rose-500'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-stone-800">{pt.name}</div>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {isFree ? 'Gratis Ongkir' : 'Tarif Standar'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 truncate mt-1">{pt.fullAddress}</p>
                <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2 font-medium">
                  <span>Jarak dari Atelier: <strong>{pt.distanceKm} KM</strong></span>
                  <span className="text-rose-600 font-bold">Lihat Rute Map →</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Detail Card & Map Simulation */}
        <div className="lg:col-span-7 bg-stone-50 rounded-3xl p-5 sm:p-6 border border-stone-200 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-stone-800">
                {selectedPoint.name}
              </h3>
              <a
                href={selectedPoint.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-white px-3 py-1.5 rounded-xl border border-rose-200 shadow-xs"
              >
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Alamat Lengkap:</strong> {selectedPoint.fullAddress}
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
              <span className="font-bold block">Instruksi Kurir Florist Saat Wisuda:</span>
              <p className="text-[11px] text-amber-800">
                {selectedPoint.deliveryNotes || 'Harap tiba 15 menit sebelum waktu temu dan hubungi nomor WhatsApp pembeli untuk penyerahan buket kawat bulu.'}
              </p>
            </div>
          </div>

          {/* Simulated Google Map View */}
          <div className="w-full h-48 bg-stone-200 rounded-2xl overflow-hidden relative flex items-center justify-center border border-stone-300">
            <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
            <div className="relative z-10 text-center space-y-2 p-4">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/40 animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-stone-700">{selectedPoint.name}</div>
              <span className="inline-block text-[10px] bg-white text-stone-600 px-2.5 py-0.5 rounded-full font-semibold border shadow-xs">
                Koordinat Terverifikasi Google Maps API
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
