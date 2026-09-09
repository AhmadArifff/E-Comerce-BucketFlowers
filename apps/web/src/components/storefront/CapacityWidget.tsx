'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';
import { getApiUrl } from '@/lib/api-client';

interface QuotaData {
  daily_po_limit: number;
  today_orders_count: number;
  po_slots_remaining: number;
  is_quota_full: boolean;
}

export const CapacityWidget: React.FC = () => {
  const [quota, setQuota] = useState<QuotaData>({
    daily_po_limit: 25,
    today_orders_count: 3,
    po_slots_remaining: 22,
    is_quota_full: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchQuotaStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(getApiUrl('/api/v1/orders/quota-status'));
      const json = await res.json();
      if (json.success && json.data) {
        setQuota(json.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.warn('Could not fetch live quota, using cached state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotaStatus();
    // Poll every 45 seconds to keep slot indicator live
    const interval = setInterval(fetchQuotaStatus, 45000);
    return () => clearInterval(interval);
  }, [fetchQuotaStatus]);

  const currentSlots = quota.today_orders_count;
  const maxSlots = quota.daily_po_limit;
  const remaining = quota.po_slots_remaining;
  const percentage = Math.min(100, Math.round((currentSlots / Math.max(1, maxSlots)) * 100));

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
      quota.is_quota_full
        ? 'bg-amber-50/70 border-amber-300'
        : 'bg-theme-surface-subtle border-theme-border'
    }`}>
      <div className="flex items-center gap-3.5 w-full sm:w-auto">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
          quota.is_quota_full ? 'bg-amber-600 text-white' : 'bg-theme-primary text-white'
        }`}>
          {quota.is_quota_full ? <AlertCircle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs sm:text-sm font-extrabold text-stone-800">
              Kapasitas Produksi Harian Atelier (Capacity Throttling)
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs flex items-center gap-1 ${
              quota.is_quota_full
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-white text-theme-primary border-theme-border'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${quota.is_quota_full ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              Live DB Quota
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            {quota.is_quota_full
              ? `Slot PO hari ini telah habis (${currentSlots}/${maxSlots}). Pre-order berikutnya dijadwalkan buka pukul 00:00 WIB.`
              : `Atelier membatasi ${maxSlots} buket PO/hari agar setiap tangkai kawat bulu dirangkai presisi oleh florist pengrajin.`}
          </p>
        </div>
      </div>

      <div className="w-full sm:w-64 flex-shrink-0 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-stone-600 flex items-center gap-1">
            <span>Terisi {currentSlots} / {maxSlots}</span>
            <button
              onClick={fetchQuotaStatus}
              disabled={isLoading}
              title="Perbarui kuota langsung"
              className="p-1 hover:bg-stone-200/50 rounded-md transition-colors text-stone-400 hover:text-stone-700"
            >
              <RotateCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-theme-primary' : ''}`} />
            </button>
          </span>
          <span className={quota.is_quota_full || remaining <= 5 ? 'text-amber-600 font-extrabold' : 'text-emerald-600 font-extrabold'}>
            {quota.is_quota_full ? 'Slot Penuh' : `Sisa ${remaining} Slot Hari Ini`}
          </span>
        </div>
        <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              quota.is_quota_full ? 'bg-amber-500' : 'bg-theme-primary'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
