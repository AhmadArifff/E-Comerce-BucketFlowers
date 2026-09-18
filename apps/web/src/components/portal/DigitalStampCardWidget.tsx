'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Award, Sparkles, Gift, Check, Clock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { getApiUrl } from '@/lib/api-client';
import { showMagicToast, spawnSparkles } from '@/lib/magic-motion';

export const DigitalStampCardWidget: React.FC = () => {
  const { user } = useAuthStore();
  const phone = user?.phone || '081938851834';

  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [cardData, setCardData] = useState<{
    id?: string;
    stamps_collected: number;
    target_stamps: number;
    card_status: 'ACTIVE' | 'COMPLETED' | 'REDEEMED' | 'EXPIRED';
    min_spend_per_stamp: number;
    expires_at?: string;
    is_eligible_for_reward: boolean;
  }>({
    stamps_collected: 0,
    target_stamps: 5,
    card_status: 'ACTIVE',
    min_spend_per_stamp: 50000,
    is_eligible_for_reward: false,
  });

  const fetchCard = useCallback(async () => {
    if (!phone) return;
    try {
      setIsLoading(true);
      const res = await fetch(getApiUrl(`/api/v1/loyalty/stamps/my-card?phone=${encodeURIComponent(phone)}`));
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const card = json.data.card;
          setCardData({
            id: card?.id,
            stamps_collected: Number(card?.stamps_collected || 0),
            target_stamps: Number(card?.target_stamps || 5),
            card_status: card?.card_status || 'ACTIVE',
            min_spend_per_stamp: Number(json.data.min_spend_per_stamp || 50000),
            expires_at: card?.expires_at,
            is_eligible_for_reward: Boolean(json.data.is_eligible_for_reward),
          });
        }
      }
    } catch (e) {
      console.warn('[DigitalStampCardWidget fetchCard error]', e);
    } finally {
      setIsLoading(false);
    }
  }, [phone]);

  useEffect(() => {
    fetchCard();
  }, [fetchCard]);

  const handleClaimReward = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardData.id || isClaiming) return;
    setIsClaiming(true);

    const rect = e.currentTarget.getBoundingClientRect();
    spawnSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    try {
      const res = await fetch(getApiUrl('/api/v1/loyalty/stamps/claim-reward'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: cardData.id }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setCardData((prev) => ({
          ...prev,
          card_status: 'REDEEMED',
          is_eligible_for_reward: false,
        }));

        showMagicToast(
          'Hadiah Kartu Stamp Berhasil Diklaim! 🎁',
          'Voucher Buket Gratis telah aktif dan otomatis dipasangkan pada pesanan berikutnya!',
          '💐'
        );
      } else {
        throw new Error(json.error || 'Gagal mengklaim reward stamp.');
      }
    } catch (err: any) {
      showMagicToast('Gagal Klaim Reward', err.message || 'Silakan coba lagi.', '⚠️');
    } finally {
      setIsClaiming(false);
    }
  };

  const slotsCount = cardData.target_stamps || 5;

  return (
    <div className="bg-gradient-to-br from-stone-900 via-purple-950 to-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-purple-950/20 space-y-6 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-52 h-52 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-40 h-40 bg-pink-600/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-purple-800/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black tracking-tight text-purple-100">
                Kartu Stamp Belanja Digital
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-200 border border-purple-400/30">
                {cardData.card_status === 'REDEEMED'
                  ? 'Hadiah Sudah Diklaim'
                  : cardData.card_status === 'COMPLETED'
                  ? 'Siap Klaim'
                  : 'Aktif'}
              </span>
            </div>
            <p className="text-xs text-purple-200/70">
              Kumpulkan {slotsCount} cap belanja untuk mendapatkan hadiah buket eksklusif gratis!
            </p>
          </div>
        </div>

        <div className="text-right text-xs text-purple-200/80">
          <span className="text-[11px] block">Progres Cap:</span>
          <strong className="text-base text-amber-300 font-black">
            {cardData.stamps_collected} / {slotsCount} Stamp
          </strong>
        </div>
      </div>

      {/* Physical Stamp Grid Visualizer */}
      <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm space-y-3">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: slotsCount }).map((_, idx) => {
            const isStamped = idx < cardData.stamps_collected;
            const isLast = idx === slotsCount - 1;

            return (
              <div
                key={idx}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all ${
                  isStamped
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-lg shadow-amber-400/20 scale-102'
                    : isLast
                    ? 'border-dashed border-pink-400 bg-pink-500/10 text-pink-300'
                    : 'border-white/20 bg-white/5 text-purple-300/40'
                }`}
              >
                {isStamped ? (
                  <>
                    <span className="text-xl sm:text-2xl animate-in zoom-in">🌸</span>
                    <span className="text-[9px] font-black uppercase text-amber-200 mt-0.5">Cap #{idx + 1}</span>
                  </>
                ) : isLast ? (
                  <>
                    <Gift className="w-5 h-5 text-pink-400 animate-bounce" />
                    <span className="text-[8px] font-black uppercase text-pink-300 mt-0.5">Reward!</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-black text-white/30">#{idx + 1}</span>
                    <span className="text-[8px] text-white/20">Cap</span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-purple-200/80 pt-1">
          <span>Syarat: Min. belanja Rp {cardData.min_spend_per_stamp.toLocaleString('id-ID')} / order</span>
          {cardData.expires_at && (
            <span className="flex items-center gap-1 text-purple-300">
              <Clock className="w-3 h-3" />
              <span>Berlaku s/d {new Date(cardData.expires_at).toLocaleDateString('id-ID')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Claim Action or Motivation */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-xs text-purple-200/90">
          {cardData.card_status === 'REDEEMED' ? (
            <span className="text-emerald-400 font-bold">
              ✅ Selamat! Anda telah menukarkan reward kartu stamp ini.
            </span>
          ) : cardData.is_eligible_for_reward ? (
            <span className="text-amber-300 font-extrabold flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Kartu stamp penuh! Klik tombol di samping untuk klaim buket gratis Anda.</span>
            </span>
          ) : (
            <span>
              Tersisa <strong className="text-amber-300">{Math.max(0, slotsCount - cardData.stamps_collected)} cap</strong> belanja lagi menuju hadiah buket gratis!
            </span>
          )}
        </div>

        {cardData.is_eligible_for_reward && cardData.card_status !== 'REDEEMED' && (
          <button
            type="button"
            onClick={handleClaimReward}
            disabled={isClaiming || isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Gift className="w-4 h-4 animate-bounce" />
            <span>{isClaiming ? 'Mengklaim...' : 'Klaim Hadiah Buket Gratis!'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DigitalStampCardWidget;
