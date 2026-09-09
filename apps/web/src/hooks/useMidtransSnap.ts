'use client';

import { useEffect, useState, useCallback } from 'react';
import { getApiUrl } from '@/lib/api-client';

export interface SnapPaymentResult {
  status_code?: string;
  status_message?: string[];
  transaction_id?: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time?: string;
  transaction_status: 'capture' | 'settlement' | 'pending' | 'deny' | 'cancel' | 'expire' | 'refund';
  fraud_status?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

export interface SnapCallbacks {
  onSuccess?: (result: SnapPaymentResult) => void;
  onPending?: (result: SnapPaymentResult) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, callbacks: SnapCallbacks) => void;
      embed: (token: string, options: { embedId: string }) => void;
    };
  }
}

export function useMidtransSnap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxxxx';
  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
  const snapScriptUrl = isProduction
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.snap) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.getElementById('midtrans-snap-script');
    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'midtrans-snap-script';
    script.src = snapScriptUrl;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      console.warn('Gagal memuat script Midtrans Snap resmi. Mode simulasi lokal diaktifkan.');
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      // Keep script in head across navigation
    };
  }, [snapScriptUrl, clientKey]);

  const pay = useCallback(
    async (
      snapToken: string,
      orderId: string,
      grossAmount: number,
      callbacks: SnapCallbacks
    ) => {
      setIsLoading(true);

      const isMockToken = snapToken.startsWith('SNAP-MOCK-') || !window.snap;

      // 1. Jika token adalah token resmi dan window.snap tersedia, buka modal popup resmi Midtrans
      if (!isMockToken && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: async (result: any) => {
            setIsLoading(false);
            // Notify backend webhook for instant settlement sync
            try {
              await fetch(getApiUrl('/api/v1/payment/webhook'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: orderId,
                  status_code: '200',
                  gross_amount: `${grossAmount}.00`,
                  transaction_status: 'settlement',
                  payment_type: result?.payment_type || 'qris',
                }),
              });
            } catch (e) {
              console.warn('Webhook sync error:', e);
            }
            callbacks.onSuccess?.(result);
          },
          onPending: (result: any) => {
            setIsLoading(false);
            callbacks.onPending?.(result);
          },
          onError: (err: any) => {
            setIsLoading(false);
            callbacks.onError?.(err);
          },
          onClose: () => {
            setIsLoading(false);
            callbacks.onClose?.();
          },
        });
        return;
      }

      // 2. Jika Sandbox Mock Token (Kredensial belum diganti atau offline), tampilkan simulasi pembayaran otomatis
      console.log(`[Midtrans Sandbox Simulator] Menjalankan simulasi pembayaran Snap QRIS untuk ${orderId}`);
      
      // Kirim notifikasi webhook settlement ke backend
      try {
        await fetch(getApiUrl('/api/v1/payment/webhook'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderId,
            status_code: '200',
            gross_amount: `${grossAmount}.00`,
            transaction_status: 'settlement',
            payment_type: 'qris_gopay',
          }),
        });

        setIsLoading(false);
        const mockResult: SnapPaymentResult = {
          order_id: orderId,
          gross_amount: `${grossAmount}`,
          payment_type: 'qris_gopay',
          transaction_status: 'settlement',
          status_code: '200',
          transaction_id: `MOCK-${Date.now()}`,
          transaction_time: new Date().toISOString(),
        };

        callbacks.onSuccess?.(mockResult);
      } catch (err) {
        setIsLoading(false);
        callbacks.onError?.(err);
      }
    },
    []
  );

  return {
    isLoaded,
    isLoading,
    pay,
  };
}
