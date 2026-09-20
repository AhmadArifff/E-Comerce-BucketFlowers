'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Trash2,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Database,
  ArrowRight,
  X,
  Sparkles,
  Info,
  Server,
  Layers,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { getApiUrl } from '@/lib/api-client';
import { showMagicToast } from '@/lib/magic-motion';
import { useAuthStore } from '@/stores/useAuthStore';
import type { GranularResetOptions, GranularResetResponse } from '@chenille/shared';

interface DatabaseStats {
  transactions: { orders: number; payment_transactions: number; order_status_histories: number; total: number };
  complaints: { customer_complaints: number; warranty_claims: number; total: number };
  loyalty: { attendance_logs: number; stamp_cards: number; customer_occasions: number; total: number };
  customers: { customer_members: number };
  catalog: { products: number; raw_materials: number; custom_studio_options: number };
}

interface DatabaseResetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DatabaseResetManager: React.FC<DatabaseResetManagerProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuthStore();
  const currentAdminEmail = user?.email || 'admin@chenilleflowers.com';

  // Modal Multi-stage step:
  // 1: Pre-Flight Informational Alert
  // 2: Granular Selection Modal (Toggles)
  // 3: Double-Confirmation Modal (Type phrase)
  // 4: Progress / Success Report
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(1);

  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Selection Toggles
  const [options, setOptions] = useState<GranularResetOptions>({
    delete_transactions: false,
    delete_logistics: false,
    delete_complaints: false,
    delete_loyalty_data: false,
    delete_customer_accounts: false,
    reset_master_catalog: true,
    delete_complaint_asset_files: false,
    delete_warranty_asset_files: false,
    delete_custom_studio_asset_files: false,
  });

  // Verification Phrase
  const [phraseInput, setPhraseInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<GranularResetResponse['data'] | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch(getApiUrl('/api/v1/admin/database/stats'), {
        headers: { Authorization: 'Bearer admin-token' },
      });
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (err) {
      console.error('Error fetching database stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentStage(1);
      setPhraseInput('');
      setExecutionResult(null);
      fetchStats();
    }
  }, [isOpen, fetchStats]);

  const handleToggle = (key: keyof GranularResetOptions) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Calculate live impact counter
  const calculateImpact = () => {
    if (!stats) return { rows: 0, files: 0 };
    let rows = 0;
    let files = 0;

    if (options.delete_transactions) rows += stats.transactions.total;
    if (options.delete_complaints) rows += stats.complaints.total;
    if (options.delete_loyalty_data) rows += stats.loyalty.total;
    if (options.delete_customer_accounts) rows += stats.customers.customer_members;
    if (options.reset_master_catalog) rows += (stats.catalog.products + stats.catalog.raw_materials + stats.catalog.custom_studio_options);

    if (options.delete_complaint_asset_files) files += 5;
    if (options.delete_warranty_asset_files) files += 3;
    if (options.delete_custom_studio_asset_files) files += 2;

    return { rows, files };
  };

  const impact = calculateImpact();
  const isPhraseValid = phraseInput.trim() === 'RESET-DATABASE-CHENILLE';

  const handleExecuteReset = async () => {
    if (!isPhraseValid) return;
    setIsExecuting(true);

    try {
      const res = await fetch(getApiUrl('/api/v1/admin/database/granular-reset'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin-token',
        },
        body: JSON.stringify({
          verification_phrase: phraseInput.trim(),
          reset_options: options,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setExecutionResult(json.data);
        setCurrentStage(4);
        showMagicToast('Reset Database Berhasil! 🚀', 'Data terpilih telah dibersihkan dan master catalog dipulihkan.', '✨');
        if (onSuccess) onSuccess();
      } else {
        showMagicToast('Gagal Menjalankan Reset', json.error || 'Terjadi kesalahan sistem.', '⚠️');
      }
    } catch (err) {
      console.error('Error executing granular reset:', err);
      showMagicToast('Gagal Menjalankan Reset', 'Tidak dapat menghubungi server API.', '⚠️');
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-rose-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* ================================================================ */}
        {/* TAHAP 1: PRE-FLIGHT SAFETY INFORMATIONAL ALERT */}
        {/* ================================================================ */}
        {currentStage === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black tracking-wider uppercase mb-1">
                  Tahap 1 / 3: Peringatan Bahaya &amp; Informasi Awal
                </div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 leading-tight">
                  Pusat Pemeliharaan &amp; Reset Database Granular
                </h3>
                <p className="text-xs text-stone-500">
                  Mohon baca informasi berikut dengan saksama untuk mencegah kesalahan manusia (*human error*).
                </p>
              </div>
            </div>

            {/* AMBER ALERT BOX */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-3 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Konsekuensi Penghapusan Data:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1.5 text-amber-900/90 text-[11px] leading-relaxed">
                <li>
                  Data yang dipilih akan <strong>dihapus secara permanen</strong> dari server PostgreSQL Supabase dan tidak dapat dipulihkan.
                </li>
                <li>
                  Data pesanan transaksional yang sudah terhubung dengan <strong>Midtrans Snap QRIS</strong> dan nomor resi ekspedisi kurir bernilai tinggi untuk laporan omzet, audit keuangan, serta klaim asuransi barang rusak.
                </li>
                <li>
                  Pada tahap berikutnya, Anda dapat memilih secara mandiri data apa saja yang ingin dihapus atau dipertahankan menggunakan sakelar (*toggles*).
                </li>
              </ul>
            </div>

            {/* ADMIN SELF-PRESERVATION POLICY GUARANTEE */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-emerald-950">Jaminan Keamanan Akun Admin Aktif:</div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Sistem menerapkan <strong>Admin Self-Preservation Policy</strong>. Akun Anda saat ini (
                  <span className="font-mono font-bold text-emerald-900">{currentAdminEmail}</span>
                  ) terkunci otomatis dan <strong>dilarang keras untuk dihapus</strong>, sehingga Anda tidak akan pernah terkunci keluar dari panel admin.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => setCurrentStage(2)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-rose-600 text-white text-xs font-black transition-all shadow-md shadow-stone-900/20 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Buka Menu Seleksi Data</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAHAP 2: MODAL SELEKSI DATA GRANULAR (TOGGLES) */}
        {/* ================================================================ */}
        {currentStage === 2 && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black tracking-wider uppercase mb-1">
                  Tahap 2 / 3: Seleksi Data Granular
                </div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900">
                  Pilih Data yang Ingin Dihapus
                </h3>
                <p className="text-xs text-stone-500">
                  Aktifkan sakelar (*toggle*) hanya untuk data yang benar-benar ingin Anda bersihkan.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SECTION A: DATA TEKS / TABEL DATABASE */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Kelompok Tabel Database (Data Teks)</span>
              </div>

              <div className="space-y-2">
                {/* 1. Transaksi */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-800">
                      Riwayat Transaksi &amp; Finansial Midtrans
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Tabel <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 rounded">orders</code>, <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 rounded">payment_transactions</code>, <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 rounded">order_items</code> ({stats?.transactions.total ?? 0} baris)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_transactions')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                      options.delete_transactions ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs ${
                      options.delete_transactions ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* 2. Logistik */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-800">
                      Riwayat Logistik &amp; Resi Ekspedisi
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Tabel <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 rounded">shipping_orders</code> dan log resi kurir
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_logistics')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                      options.delete_logistics ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs ${
                      options.delete_logistics ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* 3. Komplain & Garansi */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-800">
                      Data Komplain Pelanggan &amp; Klaim Garansi
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Tabel <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 rounded">customer_complaints</code>, <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 rounded">warranty_claims</code> ({stats?.complaints.total ?? 0} baris)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_complaints')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                      options.delete_complaints ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs ${
                      options.delete_complaints ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* 4. Loyalitas & CRM */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-800">
                      Loyalitas Pelanggan (Absensi, Poin, &amp; Momen)
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Tabel <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 rounded">user_attendance_logs</code>, <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 rounded">user_stamp_cards</code> ({stats?.loyalty.total ?? 0} baris)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_loyalty_data')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                      options.delete_loyalty_data ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs ${
                      options.delete_loyalty_data ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* 5. Akun Pelanggan Member */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-800">
                      Akun Pelanggan (*Customer Members*)
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Tabel <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 rounded">users</code> dengan role CUSTOMER_MEMBER ({stats?.customers.customer_members ?? 0} akun)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_customer_accounts')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                      options.delete_customer_accounts ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs ${
                      options.delete_customer_accounts ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* 6. Master Katalog Re-seed */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-800">
                      Reset &amp; Re-seed Master Katalog Produk &amp; BOM
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Mengembalikan 8 buket kanonikal, 9 bahan baku, dan resep HPP ke standar atelier
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('reset_master_catalog')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                      options.reset_master_catalog ? 'bg-indigo-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs ${
                      options.reset_master_catalog ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* 7. AKUN ADMIN AKTIF (LOCKED & DISABLED) */}
                <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <span>Akun Admin Anda ({currentAdminEmail})</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-emerald-200 text-emerald-800 text-[9px] font-black uppercase">
                          Terkunci / Dilindungi
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-700">
                        Admin Self-Preservation Policy: Dilarang dihapus demi stabilitas akses
                      </div>
                    </div>
                  </div>
                  <div className="w-11 h-6 rounded-full bg-emerald-600/40 relative opacity-60 cursor-not-allowed">
                    <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-5.5 shadow-xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: BERKAS FISIK & ASET STORAGE */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Kelompok Berkas Fisik &amp; Aset Gambar (Supabase Storage)</span>
              </div>

              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-800">
                      Berkas Foto Bukti Komplain Pelanggan
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Bucket <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 rounded">complaints-proof</code>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_complaint_asset_files')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                      options.delete_complaint_asset_files ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs ${
                      options.delete_complaint_asset_files ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-800">
                      Berkas Foto Bukti Klaim Garansi 30 Hari
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Bucket <code className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 rounded">warranty-proof</code>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_warranty_asset_files')}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                      options.delete_warranty_asset_files ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs ${
                      options.delete_warranty_asset_files ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* IMPACT SUMMARY COUNTER BAR */}
            <div className="p-4 rounded-2xl bg-stone-900 text-white flex items-center justify-between gap-3 text-xs shadow-md">
              <div className="space-y-0.5">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Ringkasan Dampak Eksekusi:</span>
                </div>
                <div className="text-[11px] text-stone-300">
                  Data yang akan dihapus:{' '}
                  <strong className="text-rose-400 font-mono text-xs">{impact.rows} baris tabel</strong>,{' '}
                  <strong className="text-rose-400 font-mono text-xs">{impact.files} berkas storage</strong>.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCurrentStage(1)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={() => setCurrentStage(3)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-md shadow-rose-600/20 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Lanjut ke Konfirmasi Akhir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAHAP 3: MODAL KONFIRMASI GANDA (CRITICAL DOUBLE-CONFIRMATION) */}
        {/* ================================================================ */}
        {currentStage === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center flex-shrink-0 relative">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black tracking-wider uppercase mb-1">
                  Tahap 3 / 3: Konfirmasi Tingkat Kritis
                </div>
                <h3 className="text-lg sm:text-xl font-black text-rose-900 leading-tight">
                  Ketik Frasa Validasi untuk Mulai Reset
                </h3>
                <p className="text-xs text-stone-500">
                  Untuk meyakinkan bahwa Anda sengaja melakukan operasi ini, ketik frasa di bawah ini:
                </p>
              </div>
            </div>

            {/* INSTRUCTION PHRASE BANNER */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1.5">
              <div className="text-xs text-stone-500 font-medium">Frasa Konfirmasi Persis:</div>
              <div className="text-base sm:text-lg font-mono font-black text-rose-600 tracking-wider select-all bg-white py-1.5 px-3 rounded-xl border border-rose-200 inline-block shadow-2xs">
                RESET-DATABASE-CHENILLE
              </div>
            </div>

            {/* INPUT FIELD */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Ketik ulang frasa di atas:
              </label>
              <input
                type="text"
                value={phraseInput}
                onChange={(e) => setPhraseInput(e.target.value)}
                placeholder="Ketik persis: RESET-DATABASE-CHENILLE"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all focus:outline-none focus:ring-2 ${
                  isPhraseValid
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-900 focus:ring-emerald-500/20'
                    : 'border-stone-300 focus:border-rose-500 focus:ring-rose-500/20 text-stone-900'
                }`}
              />
              {phraseInput.length > 0 && !isPhraseValid && (
                <p className="text-[11px] text-rose-600 font-medium">
                  Frasa belum cocok persis. Perhatikan huruf besar dan tanda hubung (-).
                </p>
              )}
              {isPhraseValid && (
                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Frasa valid! Anda dapat mengeksekusi reset sekarang.</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <button
                type="button"
                disabled={isExecuting}
                onClick={() => setCurrentStage(2)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={!isPhraseValid || isExecuting}
                onClick={handleExecuteReset}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-md shadow-rose-600/20 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengeksekusi Reset...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Permanen Data Terpilih</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAHAP 4: LAPORAN HASIL EKSEKUSI SUKSES */}
        {/* ================================================================ */}
        {currentStage === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-stone-900">
                Reset Database Selesai!
              </h3>
              <p className="text-xs text-stone-500">
                Operasi pemeliharaan database telah berhasil dijalankan dengan aman.
              </p>
            </div>

            {executionResult && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs text-stone-700">
                <div className="font-bold text-stone-900 border-b border-stone-200 pb-1.5 flex items-center justify-between">
                  <span>Tabel &amp; Aset yang Diproses:</span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(executionResult.executed_at).toLocaleTimeString('id-ID')}
                  </span>
                </div>
                <div className="space-y-1 text-[11px] font-mono">
                  {Object.entries(executionResult.tables_affected).map(([tbl, status]) => (
                    <div key={tbl} className="flex justify-between py-0.5">
                      <span className="text-stone-500">{tbl}:</span>
                      <span className="font-bold text-stone-800">{status}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-emerald-700 font-bold">
                  <span>Akun Admin Terlindungi:</span>
                  <span>{executionResult.admin_account_preserved}</span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-rose-600 text-white text-xs font-black transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Tutup &amp; Muat Ulang Halaman
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
