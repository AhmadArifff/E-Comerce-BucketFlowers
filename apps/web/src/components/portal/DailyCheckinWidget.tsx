'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Calendar, Flame, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { getApiUrl } from '@/lib/api-client';
import { showMagicToast, spawnSparkles } from '@/lib/magic-motion';

export const DailyCheckinWidget: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const phone = user?.phone || '081938851834';

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    already_checked_in: boolean;
    current_streak: number;
    streak_target: number;
    daily_reward_points: number;
    flower_points: number;
  }>({
    already_checked_in: false,
    current_streak: 0,
    streak_target: 7,
    daily_reward_points: 5,
    flower_points: user?.flowerPoints || 350,
  });

  // Fetch live attendance status from backend
  const fetchStatus = useCallback(async () => {
    if (!phone) return;
    try {
      setIsLoading(true);
      const res = await fetch(getApiUrl(`/api/v1/loyalty/attendance/status?phone=${encodeURIComponent(phone)}`));
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStatus({
            already_checked_in: Boolean(json.data.already_checked_in),
            current_streak: Number(json.data.current_streak || 0),
            streak_target: Number(json.data.streak_target || 7),
            daily_reward_points: Number(json.data.daily_reward_points || 5),
            flower_points: Number(json.data.flower_points ?? user?.flowerPoints ?? 350),
          });
          if (json.data.flower_points !== undefined && json.data.flower_points !== user?.flowerPoints) {
            updateProfile({ flowerPoints: json.data.flower_points });
          }
        }
      }
    } catch (e) {
      console.warn('[DailyCheckinWidget fetchStatus error]', e);
    } finally {
      setIsLoading(false);
    }
  }, [phone, updateProfile, user?.flowerPoints]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Handle daily check-in
  const handleCheckIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isSubmitting || status.already_checked_in) return;
    setIsSubmitting(true);

    const rect = e.currentTarget.getBoundingClientRect();
    spawnSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    try {
      const res = await fetch(getApiUrl('/api/v1/loyalty/attendance/check-in'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        const earned = json.data?.points_earned || status.daily_reward_points;
        const newStreak = json.data?.current_streak || status.current_streak + 1;
        const totalPoints = json.data?.current_points;

        if (totalPoints !== undefined) {
          updateProfile({ flowerPoints: totalPoints });
        }

        setStatus((prev) => ({
          ...prev,
          already_checked_in: true,
          current_streak: newStreak,
          flower_points: totalPoints ?? prev.flower_points + earned,
        }));

        showMagicToast(
          'Presensi Harian Berhasil! 🌸',
          `+${earned} Flower Points telah ditambahkan ke akun Anda. Streak: ${newStreak} Hari!`,
          '✨'
        );
      } else {
        throw new Error(json.error || 'Presensi gagal.');
      }
    } catch (err: any) {
      showMagicToast('Presensi Gagal', err.message || 'Silakan coba lagi.', '⚠️');
    } finally {
      setIsSubmitting(false);
    }
  };

  const streakProgressPct = Math.min(
    100,
    Math.round((status.current_streak / (status.streak_target || 7)) * 100)
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-sm space-y-5 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-amber-100/40 to-rose-100/30 blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-stone-800 flex items-center gap-2">
              <span>Presensi Harian Berhadiah</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Daily Check-in
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Klaim Flower Points setiap hari & kumpulkan streak berturut-turut untuk diskon spesial.
            </p>
          </div>
        </div>

        {/* Streak Flame Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 font-extrabold text-xs self-start sm:self-auto shadow-2xs">
          <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
          <span>Streak: {status.current_streak} Hari</span>
        </div>
      </div>

      {/* Streak Target Progress Bar */}
      <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-700 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Target Streak Hadiah ({status.current_streak}/{status.streak_target} Hari)</span>
          </span>
          <span className="font-black text-rose-600">{streakProgressPct}%</span>
        </div>

        <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-500"
            style={{ width: `${streakProgressPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
          <span>Hari 1</span>
          <span>{status.current_streak >= status.streak_target ? '🎉 Target Tercapai!' : `Tersisa ${Math.max(0, status.streak_target - status.current_streak)} hari lagi`}</span>
          <span>Hari {status.streak_target}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="text-xs text-stone-600">
          Reward Hari Ini: <strong className="text-amber-600 font-black">+{status.daily_reward_points} Flower Points</strong>
        </div>

        {status.already_checked_in ? (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Sudah Presensi Hari Ini! Sampai jumpa besok 👋</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={isSubmitting || isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Memproses Presensi...' : `Klaim Presensi (+${status.daily_reward_points} Poin)`}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyCheckinWidget;
