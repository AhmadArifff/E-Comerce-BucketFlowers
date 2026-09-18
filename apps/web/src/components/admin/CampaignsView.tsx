'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Gift,
  Sparkles,
  Award,
  Truck,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  ChevronRight,
  Flame,
  Calendar,
  Layers,
  MapPin,
  Tag,
  Eye,
  Info,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { getApiUrl } from '@/lib/api-client';
import { showMagicToast } from '@/lib/magic-motion';

export interface CampaignConfigData {
  id: string;
  attendance_enabled: boolean;
  daily_points_reward: number;
  streak_days_target: number;
  streak_reward_type: string;
  streak_reward_value: number;
  reset_streak_on_miss: boolean;
  stamp_card_enabled: boolean;
  stamp_target_count: number;
  min_spend_per_stamp: number;
  stamp_reward_type: string;
  stamp_reward_product_id: string | null;
  stamp_expiry_days: number;
  cod_promo_enabled: boolean;
  cod_max_radius_km: number;
  cod_subsidy_type: 'FREE_100' | 'DISCOUNT_50' | 'CUSTOM_PERCENT' | 'FLAT_AMOUNT';
  cod_subsidy_value: number;
  cod_min_spend: number;
  cod_promo_banner_text: string;
  updated_at?: string;
}

export interface CampaignAnalyticsData {
  checkins_today: number;
  active_stamp_cards: number;
  completed_stamp_cards: number;
  redeemed_stamp_cards: number;
  zero_hit_searches_count: number;
}

export interface ZeroHitKeywordItem {
  keyword: string;
  frequency: number;
  last_searched_at: string;
}

export interface FunnelStepItem {
  step_number: number;
  step_name: string;
  session_count: number;
  drop_off_rate?: number;
}

export interface CatalogProductOption {
  id: string;
  name: string;
  price: number;
  category?: string;
}

const DEFAULT_CAMPAIGN: CampaignConfigData = {
  id: 'ATELIER_CAMPAIGN_DEFAULT',
  attendance_enabled: true,
  daily_points_reward: 5,
  streak_days_target: 7,
  streak_reward_type: 'DISCOUNT_PERCENT',
  streak_reward_value: 15,
  reset_streak_on_miss: true,
  stamp_card_enabled: true,
  stamp_target_count: 5,
  min_spend_per_stamp: 50000,
  stamp_reward_type: 'FREE_PRODUCT',
  stamp_reward_product_id: null,
  stamp_expiry_days: 90,
  cod_promo_enabled: true,
  cod_max_radius_km: 5.0,
  cod_subsidy_type: 'FREE_100',
  cod_subsidy_value: 100,
  cod_min_spend: 75000,
  cod_promo_banner_text: '🎉 Promo Mahasiswa Depok: Gratis COD Radius 5 KM Kampus UI minimal belanja Rp 75.000!',
};

export const CampaignsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'LOYALTY' | 'COD_RADIUS' | 'TELEMETRY'>('LOYALTY');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Form & Analytics States
  const [config, setConfig] = useState<CampaignConfigData>(DEFAULT_CAMPAIGN);
  const [analytics, setAnalytics] = useState<CampaignAnalyticsData>({
    checkins_today: 0,
    active_stamp_cards: 0,
    completed_stamp_cards: 0,
    redeemed_stamp_cards: 0,
    zero_hit_searches_count: 0,
  });
  const [zeroHitKeywords, setZeroHitKeywords] = useState<ZeroHitKeywordItem[]>([]);
  const [funnelSteps, setFunnelSteps] = useState<FunnelStepItem[]>([]);
  const [products, setProducts] = useState<CatalogProductOption[]>([]);

  // 1. Fetch All Campaign Data & Analytics
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1.1 Active Campaign Config
      const configRes = await fetch(getApiUrl('/api/v1/campaigns'));
      if (configRes.ok) {
        const json = await configRes.json();
        if (json.success && json.data) {
          setConfig({
            ...DEFAULT_CAMPAIGN,
            ...json.data,
            cod_max_radius_km: Number(json.data.cod_max_radius_km ?? 5.0),
            cod_min_spend: Number(json.data.cod_min_spend ?? 75000),
            min_spend_per_stamp: Number(json.data.min_spend_per_stamp ?? 50000),
            daily_points_reward: Number(json.data.daily_points_reward ?? 5),
            streak_days_target: Number(json.data.streak_days_target ?? 7),
            streak_reward_value: Number(json.data.streak_reward_value ?? 15),
            stamp_target_count: Number(json.data.stamp_target_count ?? 5),
            stamp_expiry_days: Number(json.data.stamp_expiry_days ?? 90),
            cod_subsidy_value: Number(json.data.cod_subsidy_value ?? 100),
          });
        }
      }

      // 1.2 Campaign Analytics
      const analyticsRes = await fetch(getApiUrl('/api/v1/campaigns/analytics'));
      if (analyticsRes.ok) {
        const json = await analyticsRes.json();
        if (json.success && json.data) {
          setAnalytics(json.data);
        }
      }

      // 1.3 Zero-Hit Keywords
      const zeroHitsRes = await fetch(getApiUrl('/api/v1/telemetry/zero-hit-keywords'));
      if (zeroHitsRes.ok) {
        const json = await zeroHitsRes.json();
        if (json.success && Array.isArray(json.data)) {
          setZeroHitKeywords(json.data);
        }
      }

      // 1.4 Custom Studio Funnel
      const funnelRes = await fetch(getApiUrl('/api/v1/telemetry/funnel-analytics'));
      if (funnelRes.ok) {
        const json = await funnelRes.json();
        if (json.success && Array.isArray(json.data)) {
          setFunnelSteps(json.data);
        }
      }

      // 1.5 Products List for Stamp Reward Dropdown
      const prodRes = await fetch(getApiUrl('/api/v1/products?limit=50'));
      if (prodRes.ok) {
        const json = await prodRes.json();
        if (json.success && json.data?.products) {
          setProducts(
            json.data.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: Number(p.price),
              category: p.category,
            }))
          );
        }
      }

      setLastRefreshed(new Date());
    } catch (error) {
      console.warn('[CampaignsView loadData Error]', error);
      showMagicToast('Gagal Memuat Data', 'Pastikan server backend aktif.', '⚠️');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 2. Save Updated Campaign Configuration
  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const payload = {
        attendance_enabled: Boolean(config.attendance_enabled),
        daily_points_reward: Number(config.daily_points_reward),
        streak_days_target: Number(config.streak_days_target),
        streak_reward_type: config.streak_reward_type,
        streak_reward_value: Number(config.streak_reward_value),
        reset_streak_on_miss: Boolean(config.reset_streak_on_miss),
        stamp_card_enabled: Boolean(config.stamp_card_enabled),
        stamp_target_count: Number(config.stamp_target_count),
        min_spend_per_stamp: Number(config.min_spend_per_stamp),
        stamp_reward_type: config.stamp_reward_type,
        stamp_reward_product_id: config.stamp_reward_product_id || null,
        stamp_expiry_days: Number(config.stamp_expiry_days),
        cod_promo_enabled: Boolean(config.cod_promo_enabled),
        cod_max_radius_km: Number(config.cod_max_radius_km),
        cod_subsidy_type: config.cod_subsidy_type,
        cod_subsidy_value: Number(config.cod_subsidy_value),
        cod_min_spend: Number(config.cod_min_spend),
        cod_promo_banner_text: config.cod_promo_banner_text,
      };

      const res = await fetch(getApiUrl('/api/v1/campaigns/admin'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showMagicToast(
          'Kampanye Berhasil Disimpan 🎯',
          'Aturan loyalitas presensi, kartu stamp, dan subsidi COD telah diperbarui ke database.',
          '✨'
        );
        loadData();
      } else {
        throw new Error(json.error || 'Gagal menyimpan perubahan kampanye.');
      }
    } catch (error: any) {
      console.error('[handleSaveConfig Error]', error);
      showMagicToast('Gagal Menyimpan', error.message || 'Terjadi kesalahan sistem.', '❌');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Gift className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-stone-800 tracking-tight">
              Pusat Kampanye, Loyalitas & Telemetri
            </h2>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 tracking-wider">
              PRD v2.5 Live
            </span>
          </div>
          <p className="text-xs text-stone-500 max-w-2xl">
            Kelola gamifikasi presensi harian, kartu stamp digital, promo radius COD Depok, dan pantau pencarian katalog yang belum terpenuhi.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            title="Muat ulang data live dari database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sinkronisasi</span>
          </button>

          <button
            type="button"
            onClick={handleSaveConfig}
            disabled={isSaving || isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-700 hover:to-pink-700 text-xs font-black shadow-sm shadow-rose-600/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Presensi Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-800 mt-2">
            {analytics.checkins_today.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-1">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Member Aktif Check-in</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Kartu Stamp Berjalan</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-800 mt-2">
            {analytics.active_stamp_cards.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] font-semibold text-stone-400 mt-1">
            Sedang mengumpulkan stamp
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Reward Stamp Tercapai</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-800 mt-2">
            {(analytics.completed_stamp_cards + analytics.redeemed_stamp_cards).toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">
            {analytics.redeemed_stamp_cards} Sudah Diklaim Pembeli
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Pencarian Nihil Hasil</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-800 mt-2">
            {analytics.zero_hit_searches_count.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] font-bold text-rose-600 mt-1">
            Kata Kunci Belum Ada di Etalase
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex border-b border-stone-200 bg-white rounded-2xl px-3 pt-3 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveSubTab('LOYALTY')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'LOYALTY'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Loyalitas & Presensi (Gamifikasi)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('COD_RADIUS')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'COD_RADIUS'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Subsidi Ongkir COD Radius</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('TELEMETRY')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'TELEMETRY'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Telemetri & Kata Kunci Nihil</span>
          {zeroHitKeywords.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">
              {zeroHitKeywords.length}
            </span>
          )}
        </button>
      </div>

      {/* 4. Tab 1: LOYALTY & GAMIFICATION */}
      {activeSubTab === 'LOYALTY' && (
        <div className="space-y-6">
          {/* Sub-Modul 1: Daily Attendance */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-stone-800">
                    Presensi Harian Berhadiah (Daily Attendance)
                  </h3>
                </div>
                <p className="text-xs text-stone-500">
                  Memberikan Flower Points setiap login/check-in harian dan bonus spesial jika mencapai target streak beruntun.
                </p>
              </div>

              {/* Attendance Toggle */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.attendance_enabled}
                  onChange={(e) => setConfig({ ...config, attendance_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                <span className="ml-3 text-xs font-bold text-stone-700">
                  {config.attendance_enabled ? 'Program Aktif' : 'Nonaktif'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Daily Points */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Poin Harian per Check-in
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={config.daily_points_reward}
                    onChange={(e) =>
                      setConfig({ ...config, daily_points_reward: Math.max(1, parseInt(e.target.value) || 1) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">
                    Flower Points
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Poin langsung masuk ke profil member setiap kali tombol Check-in ditekan.
                </p>
              </div>

              {/* Streak Days Target */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Target Hari Beruntun (Streak)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={config.streak_days_target}
                    onChange={(e) =>
                      setConfig({ ...config, streak_days_target: Math.max(2, parseInt(e.target.value) || 7) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">
                    Hari
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Jumlah hari berturut-turut yang wajib dicapai untuk klaim hadiah streak.
                </p>
              </div>

              {/* Streak Reward Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Jenis Hadiah Streak
                </label>
                <select
                  value={config.streak_reward_type}
                  onChange={(e) => setConfig({ ...config, streak_reward_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
                >
                  <option value="DISCOUNT_PERCENT">Voucher Diskon Persentase (%)</option>
                  <option value="DISCOUNT_FLAT">Potongan Nominal Tunai (Rp)</option>
                  <option value="BONUS_POINTS">Tambahan Bonus Flower Points</option>
                  <option value="FREE_GREETING_CARD">Gratis Kartu Ucapan Akrilik</option>
                </select>
                <p className="text-[10px] text-stone-400">
                  Bentuk apresiasi setelah pelanggan konsisten hadir.
                </p>
              </div>

              {/* Streak Reward Value */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Nilai Hadiah Streak
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={config.streak_reward_value}
                    onChange={(e) =>
                      setConfig({ ...config, streak_reward_value: Math.max(1, parseFloat(e.target.value) || 0) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">
                    {config.streak_reward_type === 'DISCOUNT_PERCENT' ? '%' : 'Nilai'}
                  </span>
                </div>
              </div>

              {/* Reset Streak Toggle */}
              <div className="space-y-1.5 md:col-span-2 flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                <div>
                  <div className="text-xs font-bold text-stone-800">
                    Reset Streak Jika Terlewat 1 Hari
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Jika diaktifkan, pengguna yang melewatkan 1 hari kalender akan kembali ke Hari 1.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.reset_streak_on_miss}
                    onChange={(e) => setConfig({ ...config, reset_streak_on_miss: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>
            </div>

            {/* Micro Simulation Banner */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
              <span className="text-lg">💡</span>
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>Simulasi Customer:</strong> Setiap check-in member mendapat{' '}
                <strong>{config.daily_points_reward} Poin</strong>. Jika check-in beruntun{' '}
                <strong>{config.streak_days_target} hari berturut-turut</strong>, mereka berhak klaim reward streak{' '}
                <strong>
                  {config.streak_reward_type === 'DISCOUNT_PERCENT'
                    ? `Diskon ${config.streak_reward_value}%`
                    : config.streak_reward_type === 'DISCOUNT_FLAT'
                    ? `Potongan Rp ${config.streak_reward_value.toLocaleString('id-ID')}`
                    : `${config.streak_reward_type}`}
                </strong>
                !
              </p>
            </div>
          </div>

          {/* Sub-Modul 2: Digital Stamp Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                    <Award className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-stone-800">
                    Kartu Stamp Belanja Digital (Loyalty Stamp Card)
                  </h3>
                </div>
                <p className="text-xs text-stone-500">
                  Pembeli mengumpulkan 1 cap bunga setiap menyelesaikan pesanan dengan nilai belanja tertentu.
                </p>
              </div>

              {/* Stamp Card Toggle */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.stamp_card_enabled}
                  onChange={(e) => setConfig({ ...config, stamp_card_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                <span className="ml-3 text-xs font-bold text-stone-700">
                  {config.stamp_card_enabled ? 'Program Aktif' : 'Nonaktif'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Stamp Target Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Target Jumlah Cap Stamp
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={config.stamp_target_count}
                    onChange={(e) =>
                      setConfig({ ...config, stamp_target_count: Math.max(3, parseInt(e.target.value) || 5) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">
                    Cap Bunga
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Jumlah cap yang dibutuhkan untuk menyelesaikan 1 kartu penuh (standar: 5 stamp).
                </p>
              </div>

              {/* Min Spend Per Stamp */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Minimal Belanja per Stamp
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="5000"
                    value={config.min_spend_per_stamp}
                    onChange={(e) =>
                      setConfig({ ...config, min_spend_per_stamp: Math.max(10000, parseFloat(e.target.value) || 0) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">
                    IDR (Rp)
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Hanya pesanan yang bernilai sama atau lebih besar yang mendapatkan 1 cap stamp.
                </p>
              </div>

              {/* Stamp Expiry Days */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Masa Berlaku Kartu
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={config.stamp_expiry_days}
                    onChange={(e) =>
                      setConfig({ ...config, stamp_expiry_days: Math.max(30, parseInt(e.target.value) || 90) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">
                    Hari
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Jangka waktu kartu stamp sebelum reset (standar: 90 hari / 3 bulan).
                </p>
              </div>

              {/* Stamp Reward Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Bentuk Reward Kartu Penuh
                </label>
                <select
                  value={config.stamp_reward_type}
                  onChange={(e) => setConfig({ ...config, stamp_reward_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
                >
                  <option value="FREE_PRODUCT">Buket / Aksesoris Gratis</option>
                  <option value="DISCOUNT_VOUCHER">Voucher Diskon Spesial</option>
                  <option value="EXCLUSIVE_PACKAGING">Gratis Upgrade Hardbox & Pita Satin</option>
                </select>
              </div>

              {/* Stamp Reward Product Dropdown */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-stone-700">
                  Produk Hadiah dari Katalog Etalase
                </label>
                <select
                  value={config.stamp_reward_product_id || ''}
                  onChange={(e) =>
                    setConfig({ ...config, stamp_reward_product_id: e.target.value || null })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
                >
                  <option value="">-- Pilih Produk Buket / Hadiah Chenille --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Rp {p.price.toLocaleString('id-ID')}) {p.category ? `[${p.category}]` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-stone-400">
                  Produk yang akan otomatis dikirim / diberikan saat pembeli menukarkan kartu stamp penuh.
                </p>
              </div>
            </div>

            {/* Visual Interactive Stamp Card Preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-900 via-stone-900 to-purple-950 text-white shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-black tracking-wider uppercase text-purple-200">
                    Atelier Chenille • Loyalty Stamp Card
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  Preview Tampilan Pelanggan
                </span>
              </div>

              <div className="flex items-center justify-around py-3 gap-2 flex-wrap">
                {Array.from({ length: config.stamp_target_count }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                      idx < 3
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-md shadow-amber-400/20'
                        : 'border-stone-700 bg-stone-800/60 text-stone-500'
                    }`}
                  >
                    <span className="text-base">{idx < 3 ? '🌸' : idx + 1}</span>
                    <span className="text-[9px] font-black">{idx < 3 ? 'Cap' : `#${idx + 1}`}</span>
                  </div>
                ))}

                <div className="w-14 h-12 rounded-2xl border-2 border-dashed border-pink-400 bg-pink-500/20 flex flex-col items-center justify-center text-pink-300">
                  <Gift className="w-5 h-5 animate-bounce" />
                  <span className="text-[8px] font-black uppercase tracking-tighter">Reward!</span>
                </div>
              </div>

              <div className="text-center text-[11px] text-purple-200 font-medium">
                Kumpulkan {config.stamp_target_count} cap belanja (min. Rp {config.min_spend_per_stamp.toLocaleString('id-ID')} per order) untuk klaim hadiah!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: DYNAMIC COD RADIUS & GEOFENCING */}
      {activeSubTab === 'COD_RADIUS' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Truck className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-stone-800">
                  Promo Subsidi Ongkir COD Radius Depok
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                Otomatis memberikan potongan ongkir pada metode Cash on Delivery jika lokasi titik temu dalam radius geofencing kampus UI.
              </p>
            </div>

            {/* COD Promo Toggle */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={config.cod_promo_enabled}
                onChange={(e) => setConfig({ ...config, cod_promo_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-3 text-xs font-bold text-stone-700">
                {config.cod_promo_enabled ? 'Promo Aktif' : 'Nonaktif'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Radius KM & Threshold */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Batas Radius Maksimal Subsidi (KM)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="20"
                    value={config.cod_max_radius_km}
                    onChange={(e) =>
                      setConfig({ ...config, cod_max_radius_km: Math.max(0.5, parseFloat(e.target.value) || 5.0) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">
                    Kilometer (KM)
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Dihitung via formula Haversine dari titik atelier (-6.3627, 106.8315) ke titik temu pelanggan.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Ambang Minimal Belanja untuk Subsidi
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="5000"
                    value={config.cod_min_spend}
                    onChange={(e) =>
                      setConfig({ ...config, cod_min_spend: Math.max(0, parseFloat(e.target.value) || 0) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">
                    IDR (Rp)
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Jika keranjang belum mencapai angka ini, cart drawer menampilkan pesan &quot;Beli Rp X lagi untuk gratis ongkir COD&quot;.
                </p>
              </div>
            </div>

            {/* Subsidy Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700">
                Jenis Skema Subsidi Ongkir
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'FREE_100',
                    title: 'Gratis Ongkir 100%',
                    desc: 'Bebas biaya antar penuh dalam radius',
                  },
                  {
                    id: 'DISCOUNT_50',
                    title: 'Subsidi 50%',
                    desc: 'Potongan 50% tarif kurir COD',
                  },
                  {
                    id: 'CUSTOM_PERCENT',
                    title: 'Persentase Kustom',
                    desc: 'Tentukan % diskon fleksibel',
                  },
                  {
                    id: 'FLAT_AMOUNT',
                    title: 'Potongan Flat (Rp)',
                    desc: 'Potong nominal ongkir tertentu',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setConfig({ ...config, cod_subsidy_type: item.id as any })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      config.cod_subsidy_type === item.id
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div className="font-extrabold text-xs text-stone-800">{item.title}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>

              {(config.cod_subsidy_type === 'CUSTOM_PERCENT' || config.cod_subsidy_type === 'FLAT_AMOUNT') && (
                <div className="pt-2">
                  <label className="text-xs font-bold text-stone-700">
                    {config.cod_subsidy_type === 'CUSTOM_PERCENT' ? 'Persentase Diskon (%)' : 'Nominal Potongan Ongkir (Rp)'}
                  </label>
                  <input
                    type="number"
                    value={config.cod_subsidy_value}
                    onChange={(e) =>
                      setConfig({ ...config, cod_subsidy_value: Math.max(0, parseFloat(e.target.value) || 0) })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Banner Text Area & Live Preview */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="text-xs font-bold text-stone-700">
              Teks Promosi Mikro-Copy (Storefront Banner)
            </label>
            <textarea
              rows={2}
              value={config.cod_promo_banner_text}
              onChange={(e) => setConfig({ ...config, cod_promo_banner_text: e.target.value })}
              placeholder="Contoh: Promo Spesial Mahasiswa Depok: Bebas Ongkir COD Radius 5 KM UI..."
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <p className="text-[10px] text-stone-400">
              Teks ini ditampilkan pada top banner toko, drawer keranjang, dan dialog konfirmasi COD.
            </p>

            {/* Live Mockup Storefront Banner */}
            <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 flex-shrink-0 animate-pulse" />
                <span className="text-xs font-extrabold tracking-tight">
                  {config.cod_promo_banner_text || 'Promo Aktif COD Radius'}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 hidden sm:inline-block">
                Preview Live Banner
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab 3: TELEMETRY & ZERO-HIT SEARCHES */}
      {activeSubTab === 'TELEMETRY' && (
        <div className="space-y-6">
          {/* Section A: Zero-Hit Keywords Table */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                    <Search className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-stone-800">
                    Pencarian Pengunjung Nihil Hasil (Zero-Hit Searches)
                  </h3>
                </div>
                <p className="text-xs text-stone-500">
                  Kata kunci yang sering dicari pembeli namun belum tersedia di katalog buket. Potensi varian produk laris baru!
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black">
                {zeroHitKeywords.length} Kata Kunci
              </span>
            </div>

            {zeroHitKeywords.length === 0 ? (
              <div className="p-8 text-center text-stone-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <div className="text-xs font-bold text-stone-700">Semua Pencarian Menemukan Produk!</div>
                <div className="text-[11px]">Belum ada data pencarian pengunjung yang menghasilkan 0 produk.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-black border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Kata Kunci Pencarian</th>
                      <th className="py-2.5 px-3 text-center">Frekuensi Dicari</th>
                      <th className="py-2.5 px-3">Pencarian Terakhir</th>
                      <th className="py-2.5 px-3">Rekomendasi Tindakan Florist</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                    {zeroHitKeywords.map((item, idx) => (
                      <tr key={idx} className="hover:bg-rose-50/40 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-stone-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-extrabold text-stone-900">
                          &quot;{item.keyword}&quot;
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                            {item.frequency}x dicari
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-stone-500 text-[11px]">
                          {item.last_searched_at
                            ? new Date(item.last_searched_at).toLocaleString('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })
                            : '-'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/70">
                            <Sparkles className="w-3 h-3 text-purple-500" />
                            Buat Produk / Tambah Tag &quot;{item.keyword}&quot;
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section B: Custom Studio 4-Step Drop-Off Funnel */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                    <BarChart3 className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-stone-800">
                    Funnel Konversi Custom Studio (4 Langkah)
                  </h3>
                </div>
                <p className="text-xs text-stone-500">
                  Pantau di langkah mana pengunjung berhenti saat merakit buket bunga kawat bulu secara kustom.
                </p>
              </div>
            </div>

            {/* Stepper Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { step: 1, title: 'Langkah 1: Bentuk Bunga', desc: 'Mawar, Tulip, Lily, Daisy' },
                { step: 2, title: 'Langkah 2: Warna Kawat', desc: 'Pilihan palet benang chenille' },
                { step: 3, title: 'Langkah 3: Wrapping & Pita', desc: 'Kain premium & pita satin' },
                { step: 4, title: 'Langkah 4: Add to Cart', desc: 'Selesai merakit & siap checkout' },
              ].map((st) => {
                const found = funnelSteps.find((f) => f.step_number === st.step);
                const count = found?.session_count ?? 0;
                const dropOff = found?.drop_off_rate ?? 0;

                return (
                  <div
                    key={st.step}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-purple-700 px-2 py-0.5 rounded-full bg-purple-100">
                        Step {st.step}
                      </span>
                      {dropOff > 0 && (
                        <span className="text-[10px] font-bold text-rose-600">
                          -{dropOff}% drop-off
                        </span>
                      )}
                    </div>
                    <div className="font-extrabold text-xs text-stone-800">{st.title}</div>
                    <div className="text-[11px] text-stone-400">{st.desc}</div>
                    <div className="pt-2 border-t border-stone-200/80 flex items-baseline justify-between">
                      <span className="text-xs text-stone-500">Sesi Aktif:</span>
                      <span className="text-lg font-black text-stone-900">{count.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer Timestamp */}
      <div className="text-right text-[11px] text-stone-400">
        Terakhir disinkronisasi: {lastRefreshed.toLocaleTimeString('id-ID')} • Terhubung langsung ke PostgreSQL Supabase
      </div>
    </div>
  );
};

export default CampaignsView;
