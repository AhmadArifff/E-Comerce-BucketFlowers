'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';
import { ChenilleBrandEmblem } from '@/components/common/ChenilleBrandEmblem';
import { ATELIER_CONFIG } from '@chenille/shared';
import { useSettingsStore } from '@/stores/useSettingsStore';

export const Footer: React.FC = () => {
  const { storeName, tagline, studioAddress, waNumber, dailyQuota, maxCodRadiusKm } = useSettingsStore();

  const activeStoreName = storeName || ATELIER_CONFIG.name;
  const activeAddress = studioAddress || ATELIER_CONFIG.address;
  const activePhone = waNumber || ATELIER_CONFIG.phone;
  const activeDailyLimit = dailyQuota || ATELIER_CONFIG.dailyPoLimit;
  const activeCodRadius = maxCodRadiusKm || 5;

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <ChenilleBrandEmblem className="w-8 h-8 rounded-lg shrink-0" />
              <span className="font-extrabold text-base text-white tracking-tight font-heading">
                {activeStoreName}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {tagline || 'Atelier kerajinan tangan buket bunga berbahan kawat bulu (pipe cleaner) estetik di Depok. Melayani pemesanan wisuda kampus, sidang skripsi, dan hari spesial.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-theme-primary font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garansi 100% Anti-Layu & Ramah Lingkungan</span>
            </div>
          </div>

          {/* Col 2: Atelier & COD Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Atelier & Titik Temu</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-theme-primary flex-shrink-0 mt-0.5" />
                <span>{activeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-theme-primary flex-shrink-0" />
                <span>WhatsApp: {activePhone}</span>
              </div>
              <p className="text-[11px] text-stone-500 pt-1">
                COD Gratis Ongkir Radius {activeCodRadius} KM: Stasiun UI, Gundar Margonda, Margo City, PNJ.
              </p>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigasi Cepat</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-theme-primary transition-colors">
                  Katalog Etalase Toko
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-theme-primary transition-colors">
                  Portal Pelanggan & Lacak Pesanan
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-theme-primary transition-colors">
                  Masuk Akun Member / Florist
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-rose-400 transition-colors">
                  Admin Operations Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Operational Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Jam Operasional</h4>
            <div className="text-xs space-y-1 text-stone-400">
              <div className="flex justify-between">
                <span>Senin - Jumat:</span>
                <span className="text-stone-200">08.00 - 20.00 WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Sabtu - Minggu (Wisuda):</span>
                <span className="text-stone-200">07.00 - 21.00 WIB</span>
              </div>
              <div className="pt-2 text-[11px] text-stone-500">
                Pemesanan Pre-Order dibuka setiap hari dengan batasan kapasitas harian {activeDailyLimit} slot.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <div>
            © {new Date().getFullYear()} {activeStoreName}. Seluruh Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>oleh Pengrajin Bunga Kawat Bulu Depok</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
