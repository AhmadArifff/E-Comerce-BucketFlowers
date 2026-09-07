'use client';

import React from 'react';
import { Sparkles, Ticket, Copy, Check, Gift } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export const PointsAndVouchers: React.FC = () => {
  const { user } = useAuthStore();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const vouchers = [
    {
      code: 'WISUDA10K',
      title: 'Voucher Potongan Wisuda',
      discount: 'Rp 10.000',
      minSpend: 'Min. Belanja Rp 100.000',
      badge: 'Spesial Kampus',
    },
    {
      code: 'KOREANPASTEL',
      title: 'Diskon Pastel Korea Lovers',
      discount: 'Rp 15.000',
      minSpend: 'Min. Belanja Rp 150.000',
      badge: 'Edisi Terbatas',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {/* Flower Points Card */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/15 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" />
            <span className="text-xs font-black uppercase tracking-wider text-yellow-100">
              Flower Points Rewards
            </span>
          </div>
          <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full font-bold">
            Loyalty Tier 1
          </span>
        </div>

        <div>
          <div className="text-3xl sm:text-4xl font-black tracking-tight">
            {(user?.flowerPoints ?? 120).toLocaleString('id-ID')} Poin
          </div>
          <p className="text-xs text-yellow-100 mt-1">
            Dapat ditukarkan langsung saat checkout untuk potongan harga buket kawat bulu berikutnya.
          </p>
        </div>

        <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs text-yellow-100">
          <span>Setiap Rp 100.000 belanja = +100 Poin</span>
          <span className="font-bold text-white">1 Poin = Rp 100</span>
        </div>
      </div>

      {/* Available Vouchers Card */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-stone-800">
              Voucher Diskon Siap Pakai
            </h3>
          </div>
          <span className="text-[11px] text-stone-400 font-semibold">{vouchers.length} Kupon Tersedia</span>
        </div>

        <div className="space-y-2.5">
          {vouchers.map((v) => (
            <div
              key={v.code}
              className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-800">{v.title}</span>
                  <span className="text-[9px] bg-rose-100 text-rose-700 font-extrabold px-1.5 py-0.5 rounded-full">
                    {v.badge}
                  </span>
                </div>
                <div className="text-rose-600 font-extrabold mt-0.5">{v.discount}</div>
                <span className="text-[10px] text-stone-400">{v.minSpend}</span>
              </div>

              <button
                onClick={() => handleCopy(v.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs shadow-sm transition-all"
              >
                {copiedCode === v.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
