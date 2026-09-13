'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { showMagicToast } from '@/lib/magic-motion';
import { Clock, ShieldAlert, LogIn, X } from 'lucide-react';

const TIMEOUT_MS = 15 * 60 * 1000; // 15 Menit (PRD Standard)
const WARNING_THRESHOLD_MS = 60 * 1000; // 1 Menit peringatan sebelum auto-logout

export const SessionTimeoutWatcher: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, lastActivity, recordActivity, logout } = useAuthStore();

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(60);

  const lastEventThrottleRef = useRef<number>(0);

  // Throttled User Activity Listener (Resets the 15-Minute Inactivity Timer)
  const handleUserActivity = useCallback(() => {
    const now = Date.now();
    // Throttle to avoid excessive re-renders (at most once every 4 seconds)
    if (now - lastEventThrottleRef.current > 4000) {
      lastEventThrottleRef.current = now;
      if (isAuthenticated) {
        recordActivity();
        if (showWarningToast) {
          setShowWarningToast(false);
        }
      }
    }
  }, [isAuthenticated, recordActivity, showWarningToast]);

  // Bind DOM Event Listeners for User Interaction
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserActivity);
      });
    };
  }, [isAuthenticated, handleUserActivity]);

  // Periodic Inactivity Checker (Runs every 2.5 seconds)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const interval = setInterval(() => {
      const now = Date.now();
      let effectiveLastActivity = lastActivity;

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('chenille_last_activity');
        if (stored) {
          const parsed = parseInt(stored, 10);
          if (!isNaN(parsed) && parsed > (effectiveLastActivity || 0)) {
            effectiveLastActivity = parsed;
          }
        }
      }

      if (!effectiveLastActivity) return;

      const elapsed = now - effectiveLastActivity;
      const timeLeft = TIMEOUT_MS - elapsed;

      // 1. Trigger Auto-Logout if 15 Minutes Inactive
      if (elapsed >= TIMEOUT_MS) {
        setShowWarningToast(false);
        setShowTimeoutModal(true);
        logout('TIMEOUT_15MIN');

        showMagicToast(
          'Sesi Berakhir (15 Menit) ⏳',
          'Anda otomatis logout demi keamanan data karena 15 menit tidak ada interaksi.',
          '🔒'
        );

        // If inside protected admin panel, redirect to login
        if (pathname?.startsWith('/admin')) {
          router.push('/login?reason=timeout');
        }
      }
      // 2. Trigger Warning Prompt if less than 60 seconds remain
      else if (timeLeft <= WARNING_THRESHOLD_MS && timeLeft > 0) {
        setRemainingSeconds(Math.max(1, Math.ceil(timeLeft / 1000)));
        setShowWarningToast(true);
      } else {
        if (showWarningToast) {
          setShowWarningToast(false);
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, lastActivity, logout, pathname, router, showWarningToast]);

  const handleKeepAlive = () => {
    recordActivity();
    setShowWarningToast(false);
    showMagicToast('Sesi Diperpanjang ✨', 'Waktu interaksi 15 menit telah diperbarui.', '⏱️');
  };

  return (
    <>
      {/* 1. WARNING BANNER: 60 SECONDS BEFORE 15-MIN TIMEOUT */}
      {showWarningToast && isAuthenticated && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce max-w-sm bg-stone-900/95 backdrop-blur-md text-white border-2 border-amber-400 p-4 rounded-2xl shadow-2xl flex items-start gap-3.5">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl flex-shrink-0">
            <Clock className="w-5 h-5 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-amber-300">Peringatan Tidak Aktif</h4>
            <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
              Sesi Anda akan otomatis keluar dalam{' '}
              <strong className="text-amber-400 font-mono text-xs">{remainingSeconds} detik</strong>{' '}
              karena tidak ada aktivitas.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handleKeepAlive}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-extrabold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Tetap Masuk (Perpanjang)
              </button>
              <button
                onClick={() => setShowWarningToast(false)}
                className="p-1 text-stone-400 hover:text-white"
                title="Tutup pemberitahuan"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. AUTO-LOGOUT MODAL: WHEN 15 MINUTES ELAPSE */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 text-center relative overflow-hidden animate-in zoom-in-95">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500" />

            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner mb-4">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-stone-900">Sesi Berakhir (15 Menit)</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Sistem telah mengakhiri sesi login Anda secara otomatis demi melindungi privasi dan keamanan akun karena tidak ada aktivitas interaksi selama 15 menit.
            </p>

            <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 font-mono flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Auto-Logout Inactivity Protection Active</span>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowTimeoutModal(false);
                  router.push('/login');
                }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Kembali ke Akun</span>
              </button>

              <button
                onClick={() => setShowTimeoutModal(false)}
                className="w-full py-2 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              >
                Lanjut sebagai Tamu (Tutup)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
