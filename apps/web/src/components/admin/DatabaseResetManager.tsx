'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Terminal,
  Copy,
  Check,
  CornerDownRight,
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

interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  tag: string;
  tagClass: string;
  message: string;
  status: string;
  statusClass: string;
}

type Stage = 1 | 2 | 3 | 'executing' | 4;

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
  // 'executing': Real-Time DevOps Telemetry Console & Progress Streamer
  // 4: Progress / Success Report
  const [currentStage, setCurrentStage] = useState<Stage>(1);

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

  // Telemetry Console State
  const [logs, setLogs] = useState<TelemetryLogEntry[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('');
  const [isExecutionComplete, setIsExecutionComplete] = useState(false);
  const [hasExecutionError, setHasExecutionError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Pre-Activation Toggle Confirmation Modal State
  const [pendingToggle, setPendingToggle] = useState<{
    key: keyof GranularResetOptions;
    title: string;
    description: string;
    countWarning?: string;
  } | null>(null);
  const [isSyncingStorage, setIsSyncingStorage] = useState(false);

  const TABLE_HUMAN_LABELS: Record<string, string> = {
    orders: 'Pesanan Masuk',
    order_items: 'Rincian Buket Belanja',
    payment_transactions: 'Bukti Pembayaran Pelanggan',
    order_status_history: 'Histori Status Pesanan',
    shipping_orders: 'Pengiriman & Resi Ekspedisi',
    customer_complaints: 'Komplain Pelanggan',
    complaint_resolutions: 'Penyelesaian Komplain',
    warranty_claims: 'Klaim Garansi 30 Hari',
    user_attendance_logs: 'Absensi Harian Member',
    user_stamp_cards: 'Kartu Stempel Belanja',
    user_stamp_card_history: 'Histori Stempel Member',
    customer_occasions: 'Pengingat Momen Spesial',
    users: 'Akun Member Pelanggan',
    products: 'Katalog Buket Bunga',
    raw_materials: 'Bahan Baku Kawat Bulu',
    product_recipes: 'Resep Modal Bahan Baku (HPP)',
    custom_studio_requests: 'Konsultasi Custom Studio',
    'complaints-proof': 'Foto Bukti Komplain (Penyimpanan Online)',
    'warranty-proof': 'Foto Bukti Garansi (Penyimpanan Online)',
    'custom-studio': 'Foto Referensi Studio (Penyimpanan Online)',
  };

  const TOGGLE_METADATA: Record<
    keyof GranularResetOptions,
    {
      title: string;
      description: string;
      countWarning?: (stats: DatabaseStats | null) => string;
    }
  > = {
    delete_transactions: {
      title: 'Riwayat Pesanan & Transaksi Pembayaran Toko',
      description:
        'Mengaktifkan opsi ini akan menghapus seluruh catatan pesanan masuk, rincian produk yang dibeli, serta bukti pembayaran pelanggan. Dampak: Laporan omzet dan pembukuan bulanan toko akan di-reset ke nol.',
      countWarning: (s) =>
        `${s?.transactions.total ?? 0} catatan pesanan akan dibersihkan. Laporan omzet dan pembukuan toko akan kembali kosong!`,
    },
    delete_logistics: {
      title: 'Riwayat Pengiriman & Resi Kurir Ekspedisi',
      description:
        'Mengaktifkan opsi ini akan menghapus nomor resi paket kurir (seperti JNE, SiCepat, J&T) dan histori pengiriman barang. Dampak: Pembeli tidak dapat lagi melacak status paket lama dari website.',
      countWarning: () => 'Nomor resi dan riwayat serah terima kurir ekspedisi akan dibersihkan.',
    },
    delete_complaints: {
      title: 'Catatan Komplain Pelanggan & Klaim Garansi',
      description:
        'Mengaktifkan opsi ini akan menghapus rekaman keluhan pembeli terkait kondisi bunga dan pengajuan klaim garansi 30 hari. Dampak: Riwayat evaluasi kualitas layanan toko akan dibersihkan.',
      countWarning: (s) => `${s?.complaints.total ?? 0} tiket keluhan dan klaim garansi pelanggan akan dihapus.`,
    },
    delete_loyalty_data: {
      title: 'Poin Hadiah, Kartu Stempel & Pengingat Momen Spesial',
      description:
        'Mengaktifkan opsi ini akan menghapus saldo poin reward, kartu stempel belanja, dan catatan tanggal ulang tahun/wisuda pelanggan. Dampak: Seluruh poin dan stempel belanja pelanggan akan kembali ke nol.',
      countWarning: (s) => `${s?.loyalty.total ?? 0} data poin dan kartu stempel pelanggan akan di-reset ke nol.`,
    },
    delete_customer_accounts: {
      title: 'Daftar Akun Member Pelanggan Terdaftar',
      description:
        'Mengaktifkan opsi ini akan menghapus akun login para pembeli toko. Dampak: Pembeli harus mendaftar akun baru jika ingin belanja kembali di website. (Akun Admin Anda tetap aman & terlindungi).',
      countWarning: (s) => `${s?.customers.customer_members ?? 0} akun member pembeli akan dihapus permanen.`,
    },
    reset_master_catalog: {
      title: 'Kembalikan Katalog Produk & Perhitungan Modal ke Standar Awal',
      description:
        'Mengaktifkan opsi ini akan mengatur ulang daftar buket bunga, harga jual, stok, dan resep modal bahan baku ke 8 model buket resmi Atelier Chenille.',
      countWarning: (s) =>
        `${(s?.catalog.products ?? 0) + (s?.catalog.raw_materials ?? 0)} produk buket dan bahan baku akan dikembalikan ke data katalog standar atelier.`,
    },
    delete_complaint_asset_files: {
      title: 'Foto Bukti Kendala & Kerusakan dari Pembeli',
      description:
        'Mengaktifkan opsi ini akan menghapus file foto buket rusak atau kemasan penyok yang dikirimkan pembeli saat menyampaikan keluhan dari penyimpanan online.',
    },
    delete_warranty_asset_files: {
      title: 'Foto Bukti Unboxing Klaim Garansi 30 Hari',
      description:
        'Mengaktifkan opsi ini akan menghapus file foto unboxing yang diunggah pembeli saat mengajukan klaim garansi buket baru dari penyimpanan online.',
    },
    delete_custom_studio_asset_files: {
      title: 'Foto Referensi Desain Buket dari Pelanggan',
      description:
        'Mengaktifkan opsi ini akan menghapus file gambar bunga referensi yang diunggah pelanggan saat berkonsultasi untuk buket kustom dari penyimpanan online.',
    },
  };

  // Auto-scroll to latest log
  useEffect(() => {
    if (currentStage === 'executing' && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, currentStage]);

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] ${l.tag} ${l.message} ${l.status}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
      setLogs([]);
      setProgressPercent(0);
      setCurrentStepText('');
      setIsExecutionComplete(false);
      setHasExecutionError(false);
      setPendingToggle(null);
      fetchStats();
    }
  }, [isOpen, fetchStats]);

  const handleToggle = (key: keyof GranularResetOptions) => {
    const isCurrentlyOn = options[key];
    if (isCurrentlyOn) {
      // Turning OFF is safe -> immediately turn off
      setOptions((prev) => ({
        ...prev,
        [key]: false,
      }));
    } else {
      // Turning ON requires user confirmation
      const meta = TOGGLE_METADATA[key];
      setPendingToggle({
        key,
        title: meta.title,
        description: meta.description,
        countWarning: meta.countWarning ? meta.countWarning(stats) : undefined,
      });
    }
  };

  const handleConfirmToggleOn = () => {
    if (pendingToggle) {
      setOptions((prev) => ({
        ...prev,
        [pendingToggle.key]: true,
      }));
      setPendingToggle(null);
    }
  };

  const handleCancelToggleOn = () => {
    setPendingToggle(null);
  };

  const handleManualStorageSync = async () => {
    setIsSyncingStorage(true);
    try {
      const res = await fetch(getApiUrl('/api/v1/admin/database/sync-storage'), {
        method: 'POST',
        headers: { Authorization: 'Bearer admin-token' },
      });
      const json = await res.json();
      if (json.success) {
        if (json.data.isStorageConfigured) {
          showMagicToast(
            'Sinkronisasi Storage Sukses! ☁️',
            `${json.data.syncedCount} gambar kanonikal berhasil diunggah ke Supabase Storage.`,
            '✅'
          );
        } else {
          showMagicToast(
            'Supabase Key Masih Placeholder ⚠️',
            'SUPABASE_ANON_KEY masih berupa placeholder (...xxxxxxxxx...). Gambar disajikan dari jalur statis lokal (/images/products/).',
            'ℹ️'
          );
        }
      } else {
        showMagicToast('Gagal Sinkronisasi Storage', json.error || 'Terjadi kesalahan sistem.', '⚠️');
      }
    } catch (err) {
      console.error('Error syncing storage:', err);
      showMagicToast('Gagal Sinkronisasi Storage', 'Tidak dapat menghubungi server API.', '⚠️');
    } finally {
      setIsSyncingStorage(false);
    }
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
    setCurrentStage('executing');
    setLogs([]);
    setProgressPercent(5);
    setCurrentStepText('Inisialisasi koneksi & verifikasi hak akses Super Admin...');
    setIsExecutionComplete(false);
    setHasExecutionError(false);

    // Build the planned steps based on active toggles
    const plannedSteps: Array<{
      tag: string;
      tagClass: string;
      message: string;
      status: string;
      statusClass: string;
      progress: number;
      stepText: string;
    }> = [
      {
        tag: '[AUTH]',
        tagClass: 'text-cyan-400 bg-cyan-950/80 border-cyan-800/80',
        message: 'Memverifikasi identitas Super Admin & validitas sesi otentikasi...',
        status: '[OK]',
        statusClass: 'text-emerald-400 font-bold',
        progress: 12,
        stepText: 'Verifikasi otentikasi & hak akses sistem',
      },
      {
        tag: '[GUARD]',
        tagClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80',
        message: `Admin Self-Preservation Guard: Mengunci akun aktif (${currentAdminEmail})...`,
        status: '[PRESERVED]',
        statusClass: 'text-emerald-400 font-bold',
        progress: 22,
        stepText: 'Proteksi integritas akun admin aktif',
      },
      {
        tag: '[SAFETY]',
        tagClass: 'text-indigo-400 bg-indigo-950/80 border-indigo-800/80',
        message: 'Validasi frasa verifikasi keamanan: "RESET-DATABASE-CHENILLE"...',
        status: '[PASSED]',
        statusClass: 'text-emerald-400 font-bold',
        progress: 32,
        stepText: 'Pengecekan frasa verifikasi ganda',
      },
      {
        tag: '[DB]',
        tagClass: 'text-blue-400 bg-blue-950/80 border-blue-800/80',
        message: 'Membuka pool koneksi & transaksi atomik PostgreSQL (BEGIN TRANSACTION)...',
        status: '[ACTIVE]',
        statusClass: 'text-cyan-400 font-bold',
        progress: 42,
        stepText: 'Inisialisasi transaksi database atomik',
      },
    ];

    if (options.delete_transactions) {
      plannedSteps.push({
        tag: '[PURGE]',
        tagClass: 'text-rose-400 bg-rose-950/80 border-rose-800/80',
        message: 'Membersihkan tabel transaksi: orders, order_items, payment_transactions...',
        status: '[PURGED]',
        statusClass: 'text-rose-300 font-bold',
        progress: 50,
        stepText: 'Pembersihan data riwayat transaksi & finansial',
      });
    }

    if (options.delete_logistics) {
      plannedSteps.push({
        tag: '[PURGE]',
        tagClass: 'text-rose-400 bg-rose-950/80 border-rose-800/80',
        message: 'Membersihkan tabel logistik: shipping_orders dan log resi ekspedisi kurir...',
        status: '[PURGED]',
        statusClass: 'text-rose-300 font-bold',
        progress: 56,
        stepText: 'Pembersihan data riwayat logistik & resi',
      });
    }

    if (options.delete_complaints) {
      plannedSteps.push({
        tag: '[PURGE]',
        tagClass: 'text-rose-400 bg-rose-950/80 border-rose-800/80',
        message: 'Membersihkan tabel evaluasi: customer_complaints, warranty_claims...',
        status: '[PURGED]',
        statusClass: 'text-rose-300 font-bold',
        progress: 62,
        stepText: 'Pembersihan data keluhan & klaim garansi',
      });
    }

    if (options.delete_loyalty_data) {
      plannedSteps.push({
        tag: '[PURGE]',
        tagClass: 'text-rose-400 bg-rose-950/80 border-rose-800/80',
        message: 'Membersihkan tabel loyalitas: user_attendance_logs, user_stamp_cards...',
        status: '[PURGED]',
        statusClass: 'text-rose-300 font-bold',
        progress: 68,
        stepText: 'Pembersihan log loyalitas & kartu stempel',
      });
    }

    if (options.delete_customer_accounts) {
      plannedSteps.push({
        tag: '[PURGE]',
        tagClass: 'text-rose-400 bg-rose-950/80 border-rose-800/80',
        message: 'Membersihkan akun pengguna pelanggan (role: CUSTOMER_MEMBER)...',
        status: '[DELETED]',
        statusClass: 'text-rose-300 font-bold',
        progress: 74,
        stepText: 'Pembersihan akun pelanggan terdaftar',
      });
    }

    if (options.reset_master_catalog) {
      plannedSteps.push(
        {
          tag: '[SEED]',
          tagClass: 'text-amber-400 bg-amber-950/80 border-amber-800/80',
          message: 'Menginisialisasi ulang 5 Kategori Kanonikal Atelier Chenille...',
          status: '[SEEDED]',
          statusClass: 'text-amber-300 font-bold',
          progress: 80,
          stepText: 'Re-seeding kategori kanonikal produk',
        },
        {
          tag: '[SEED]',
          tagClass: 'text-amber-400 bg-amber-950/80 border-amber-800/80',
          message: 'Menghitung ulang HPP & BOM 9 Bahan Baku Kawat Bulu murni...',
          status: '[CALCULATED]',
          statusClass: 'text-amber-300 font-bold',
          progress: 85,
          stepText: 'Kalkulasi HPP & komposisi bahan mentah',
        },
        {
          tag: '[SEED]',
          tagClass: 'text-amber-400 bg-amber-950/80 border-amber-800/80',
          message: 'Mendaftarkan 8 Produk Buket Kanonikal kawat bulu standar atelier...',
          status: '[RESTORED]',
          statusClass: 'text-amber-300 font-bold',
          progress: 89,
          stepText: 'Pendaftaran katalog 8 buket kanonikal',
        },
        {
          tag: '[STORAGE]',
          tagClass: 'text-purple-400 bg-purple-950/80 border-purple-800/80',
          message: 'Sinkronisasi berkas gambar fisik kanonikal ke bucket "product-images"...',
          status: '[SYNCED]',
          statusClass: 'text-purple-300 font-bold',
          progress: 93,
          stepText: 'Sinkronisasi aset gambar ke Supabase Storage',
        }
      );
    }

    if (options.delete_complaint_asset_files || options.delete_warranty_asset_files || options.delete_custom_studio_asset_files) {
      plannedSteps.push({
        tag: '[STORAGE]',
        tagClass: 'text-purple-400 bg-purple-950/80 border-purple-800/80',
        message: 'Membersihkan berkas lampiran foto di storage bucket terpilih...',
        status: '[PURGED]',
        statusClass: 'text-purple-300 font-bold',
        progress: 95,
        stepText: 'Pembersihan berkas bukti pada storage bucket',
      });
    }

    plannedSteps.push(
      {
        tag: '[DB]',
        tagClass: 'text-blue-400 bg-blue-950/80 border-blue-800/80',
        message: 'Menyimpan transaksi PostgreSQL secara permanen (COMMIT TRANSACTION)...',
        status: '[COMMITTED]',
        statusClass: 'text-emerald-400 font-bold',
        progress: 97,
        stepText: 'Komit transaksi atomik database',
      },
      {
        tag: '[AUDIT]',
        tagClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80',
        message: 'Mencatat riwayat pemeliharaan ke tabel admin_audit_logs...',
        status: '[LOGGED]',
        statusClass: 'text-emerald-400 font-bold',
        progress: 99,
        stepText: 'Pencatatan audit log administrator',
      },
      {
        tag: '[DONE]',
        tagClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80',
        message: 'Reset database granular selesai dengan sukses tanpa regresi!',
        status: '[SUCCESS]',
        statusClass: 'text-emerald-300 font-black',
        progress: 100,
        stepText: 'Operasi pemeliharaan database selesai 100%',
      }
    );

    // Concurrently start the real API call
    const apiPromise = fetch(getApiUrl('/api/v1/admin/database/granular-reset'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer admin-token',
      },
      body: JSON.stringify({
        verification_phrase: phraseInput.trim(),
        reset_options: options,
      }),
    }).then((res) => res.json());

    // Stream the steps with staggered micro-delay
    try {
      for (let i = 0; i < plannedSteps.length; i++) {
        const step = plannedSteps[i];
        await new Promise((resolve) => setTimeout(resolve, 240));

        const now = new Date();
        const timestamp =
          now.toTimeString().split(' ')[0] +
          '.' +
          String(now.getMilliseconds()).padStart(3, '0');

        setLogs((prev) => [
          ...prev,
          {
            id: `log-${i}-${Date.now()}`,
            timestamp,
            tag: step.tag,
            tagClass: step.tagClass,
            message: step.message,
            status: step.status,
            statusClass: step.statusClass,
          },
        ]);
        setProgressPercent(step.progress);
        setCurrentStepText(step.stepText);
      }

      // Await backend API response
      const json = await apiPromise;
      if (json.success) {
        setExecutionResult(json.data);
        setIsExecutionComplete(true);
        showMagicToast('Reset Database Berhasil! 🚀', 'Data terpilih telah dibersihkan dan master catalog dipulihkan.', '✨');
        if (onSuccess) onSuccess();
      } else {
        setHasExecutionError(true);
        const now = new Date();
        const timestamp =
          now.toTimeString().split(' ')[0] +
          '.' +
          String(now.getMilliseconds()).padStart(3, '0');

        setLogs((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            timestamp,
            tag: '[ERROR]',
            tagClass: 'text-rose-400 bg-rose-950/80 border-rose-800/80',
            message: `Gagal: ${json.error || 'Terjadi kesalahan sistem'} (ROLLBACK)`,
            status: '[FAILED]',
            statusClass: 'text-rose-400 font-black',
          },
        ]);
        setCurrentStepText('Terjadi kesalahan - Transaksi dibatalkan (ROLLBACK)');
        showMagicToast('Gagal Menjalankan Reset', json.error || 'Terjadi kesalahan sistem.', '⚠️');
      }
    } catch (err: any) {
      console.error('Error executing granular reset:', err);
      setHasExecutionError(true);
      const now = new Date();
      const timestamp =
        now.toTimeString().split(' ')[0] +
        '.' +
        String(now.getMilliseconds()).padStart(3, '0');

      setLogs((prev) => [
        ...prev,
        {
          id: `err-net-${Date.now()}`,
          timestamp,
          tag: '[ERROR]',
          tagClass: 'text-rose-400 bg-rose-950/80 border-rose-800/80',
          message: 'Tidak dapat menghubungi server API - Transaksi dibatalkan',
          status: '[ABORTED]',
          statusClass: 'text-rose-400 font-black',
        },
      ]);
      setCurrentStepText('Koneksi terputus ke server API');
      showMagicToast('Gagal Menjalankan Reset', 'Tidak dapat menghubungi server API.', '⚠️');
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-rose-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* ================================================================ */}
        {/* TAHAP 1: PRE-FLIGHT SAFETY INFORMATIONAL ALERT */}
        {/* ================================================================ */}
        {currentStage === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
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
                <span>Konsekuensi Pembersihan Data Toko:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1.5 text-amber-900/90 text-[11px] leading-relaxed">
                <li>
                  Data yang dipilih akan <strong>dihapus secara permanen</strong> dari sistem toko online dan tidak dapat dibatalkan atau dipulihkan kembali.
                </li>
                <li>
                  Data pesanan pembeli yang sudah terhubung dengan <strong>pembayaran QRIS</strong> dan nomor resi kurir sangat berguna untuk laporan omzet bulanan, pembukuan keuangan toko, serta bukti klaim asuransi paket.
                </li>
                <li>
                  Pada tahap berikutnya, Anda dapat memilih secara mandiri data apa saja yang ingin dibersihkan atau dipertahankan menggunakan sakelar (*toggle*).
                </li>
              </ul>
            </div>

            {/* ADMIN SELF-PRESERVATION POLICY GUARANTEE */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="font-bold text-emerald-950">Jaminan Keamanan Akun Admin Anda:</div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Sistem otomatis mengamankan akun admin Anda saat ini (
                  <span className="font-mono font-bold text-emerald-900">{currentAdminEmail}</span>
                  ). Akun ini <strong>terkunci dan tidak akan pernah terhapus</strong>, sehingga Anda selalu dapat masuk dan mengelola toko ini dengan aman setelah proses pembersihan selesai.
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
                <span>Buka Pilihan Data</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAHAP 2: MODAL SELEKSI DATA GRANULAR (TOGGLES) */}
        {/* ================================================================ */}
        {currentStage === 2 && (
          <div className="p-5 sm:p-7 space-y-5 max-h-[85vh] overflow-y-auto overflow-x-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black tracking-wider uppercase mb-1">
                  Tahap 2 / 3: Seleksi Data Granular
                </div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900">
                  Pilih Data Aktivitas Toko yang Ingin Dibersihkan
                </h3>
                <p className="text-xs text-stone-500">
                  Aktifkan sakelar (*toggle*) hanya untuk data yang benar-benar ingin Anda kosongkan dari sistem toko.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors flex-shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SECTION A: DATA AKTIVITAS TOKO */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Pilihan Data Aktivitas Toko yang Ingin Dibersihkan</span>
              </div>

              <div className="space-y-2">
                {/* 1. Transaksi */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-800">
                      Riwayat Pesanan &amp; Transaksi Pembayaran Toko
                    </div>
                    <div className="text-[11px] text-stone-500 leading-relaxed">
                      Menghapus catatan pesanan masuk, rincian produk buket yang dibeli, serta bukti pembayaran ({stats?.transactions.total ?? 0} pesanan terdata). <strong className="text-stone-700">Dampak:</strong> Laporan omzet dan pembukuan bulanan toko akan di-reset ke nol.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_transactions')}
                    className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${
                      options.delete_transactions ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 left-0.5 shadow-xs ${
                      options.delete_transactions ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 2. Logistik */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-800">
                      Riwayat Pengiriman &amp; Resi Kurir Ekspedisi
                    </div>
                    <div className="text-[11px] text-stone-500 leading-relaxed">
                      Menghapus nomor resi pengiriman kurir (seperti JNE, SiCepat, J&amp;T) dan histori antar paket. <strong className="text-stone-700">Dampak:</strong> Pembeli tidak dapat lagi melacak status paket lama dari website toko.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_logistics')}
                    className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${
                      options.delete_logistics ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 left-0.5 shadow-xs ${
                      options.delete_logistics ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 3. Komplain & Garansi */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-800">
                      Catatan Komplain Pelanggan &amp; Klaim Garansi
                    </div>
                    <div className="text-[11px] text-stone-500 leading-relaxed">
                      Menghapus rekaman keluhan pembeli terkait kondisi bunga dan pengajuan klaim garansi 30 hari ({stats?.complaints.total ?? 0} catatan terdata). <strong className="text-stone-700">Dampak:</strong> Riwayat keluhan kualitas layanan toko akan dibersihkan.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_complaints')}
                    className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${
                      options.delete_complaints ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 left-0.5 shadow-xs ${
                      options.delete_complaints ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 4. Loyalitas & CRM */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-800">
                      Poin Hadiah, Kartu Stempel &amp; Pengingat Momen Spesial
                    </div>
                    <div className="text-[11px] text-stone-500 leading-relaxed">
                      Menghapus saldo poin reward pelanggan, kartu stempel belanja, dan catatan tanggal ulang tahun/wisuda ({stats?.loyalty.total ?? 0} catatan terdata). <strong className="text-stone-700">Dampak:</strong> Saldo poin seluruh member pembeli akan kembali ke nol.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_loyalty_data')}
                    className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${
                      options.delete_loyalty_data ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 left-0.5 shadow-xs ${
                      options.delete_loyalty_data ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 5. Akun Pelanggan Member */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-800">
                      Daftar Akun Member Pelanggan Terdaftar
                    </div>
                    <div className="text-[11px] text-stone-500 leading-relaxed">
                      Menghapus akun login para pembeli ({stats?.customers.customer_members ?? 0} akun member terdaftar). <strong className="text-stone-700">Dampak:</strong> Pembeli harus mendaftar akun baru jika ingin belanja kembali. (Akun Admin Anda tetap aman &amp; terlindungi).
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_customer_accounts')}
                    className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${
                      options.delete_customer_accounts ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 left-0.5 shadow-xs ${
                      options.delete_customer_accounts ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 6. Master Katalog Re-seed */}
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-800">
                      Kembalikan Katalog Produk &amp; Perhitungan Modal ke Standar Awal
                    </div>
                    <div className="text-[11px] text-stone-500 leading-relaxed">
                      Mengatur ulang daftar buket bunga, harga jual, stok, dan resep modal bahan baku ke 8 model buket resmi Atelier Chenille.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('reset_master_catalog')}
                    className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${
                      options.reset_master_catalog ? 'bg-indigo-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 left-0.5 shadow-xs ${
                      options.reset_master_catalog ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 7. AKUN ADMIN AKTIF (LOCKED & DISABLED) */}
                <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                    <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-emerald-950 flex flex-wrap items-center gap-1.5">
                        <span className="truncate">Akun Admin Utama Toko Anda ({currentAdminEmail})</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-200 text-emerald-800 text-[9px] font-black uppercase shrink-0">
                          AMAN / DILINDUNGI
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-700 leading-tight mt-0.5">
                        Akun login Anda dikunci otomatis agar Anda selalu dapat mengakses dan mengelola toko ini setelah proses pembersihan selesai.
                      </div>
                    </div>
                  </div>
                  <div className="w-11 h-6 rounded-full bg-emerald-600/40 relative opacity-60 cursor-not-allowed flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5 translate-x-5 shadow-xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: BERKAS FOTO & LAMPIRAN PEMBELI DI PENYIMPANAN ONLINE */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Berkas Foto &amp; Lampiran Pembeli di Penyimpanan Online</span>
              </div>

              {/* STORAGE SYNC STATUS & ACTION BAR */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-950">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    <span>Penyimpanan Foto Produk di Server Cloud (Online)</span>
                  </div>
                  <div className="text-[11px] text-indigo-800/80 leading-relaxed">
                    Menyimpan foto katalog buket di server internet agar website toko online dapat menampilkan foto bunga secara cepat dan jernih kepada calon pembeli.
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isSyncingStorage}
                  onClick={handleManualStorageSync}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
                >
                  {isSyncingStorage ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Mengunggah Foto ke Server Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Sinkronkan Foto Produk ke Server Cloud</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-800">
                      Foto Bukti Kendala &amp; Kerusakan dari Pembeli
                    </div>
                    <div className="text-[11px] text-stone-500 leading-relaxed">
                      Menghapus file foto buket rusak atau kemasan penyok yang dikirimkan pembeli saat menyampaikan keluhan dari penyimpanan online toko.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_complaint_asset_files')}
                    className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${
                      options.delete_complaint_asset_files ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 left-0.5 shadow-xs ${
                      options.delete_complaint_asset_files ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-800">
                      Foto Bukti Unboxing Klaim Garansi 30 Hari
                    </div>
                    <div className="text-[11px] text-stone-500 leading-relaxed">
                      Menghapus file foto unboxing yang diunggah pembeli saat mengajukan klaim garansi buket baru dari penyimpanan online toko.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('delete_warranty_asset_files')}
                    className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${
                      options.delete_warranty_asset_files ? 'bg-rose-600' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 left-0.5 shadow-xs ${
                      options.delete_warranty_asset_files ? 'translate-x-5' : 'translate-x-0'
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
                  <span>Ringkasan Dampak Pembersihan:</span>
                </div>
                <div className="text-[11px] text-stone-300">
                  Data yang akan dibersihkan:{' '}
                  <strong className="text-rose-400 font-mono text-xs">{impact.rows} catatan data toko</strong>,{' '}
                  <strong className="text-rose-400 font-mono text-xs">{impact.files} berkas foto pembeli</strong>.
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
        {/* TAHAP EXECUTING: DEVOPS TELEMETRY CONSOLE & LOG STREAMER */}
        {/* ================================================================ */}
        {currentStage === 'executing' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* TERMINAL HEADER BAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                {/* macOS Traffic lights */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-xs" />
                  <div className="w-3 h-3 rounded-full bg-amber-400 shadow-xs" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-stone-500" />
                  <span className="font-mono text-xs font-bold text-stone-700">
                    chenille-db-engine ~ granular-reset.sh
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                {isExecutionComplete ? (
                  <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Transaksi Sukses (100%)</span>
                  </div>
                ) : hasExecutionError ? (
                  <div className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Gagal (Rollback)</span>
                  </div>
                ) : (
                  <div className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                    <span>Mengeksekusi ({progressPercent}%)</span>
                  </div>
                )}
              </div>
            </div>

            {/* ANIMATED PROGRESS BAR & STEP TRACKER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{currentStepText}</span>
                </span>
                <span className="font-mono font-black text-indigo-600">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    hasExecutionError
                      ? 'bg-rose-600'
                      : isExecutionComplete
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-rose-500 via-indigo-600 to-emerald-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* DARK TERMINAL CONSOLE STREAM BOX */}
            <div className="rounded-2xl bg-stone-950 border border-stone-800 p-4 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800/80 text-[11px] text-stone-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">●</span>
                  <span>Console Stream Output</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLogs}
                  className="px-2 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin Log</span>
                    </>
                  )}
                </button>
              </div>

              {/* LOG LINES */}
              <div className="font-mono text-[11px] leading-relaxed space-y-1.5 max-h-64 sm:max-h-72 overflow-y-auto pr-1 select-text">
                {logs.length === 0 && (
                  <div className="text-stone-600 italic py-4 text-center">
                    Menginisialisasi kanal telemetri database...
                  </div>
                )}
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 animate-in fade-in-50 duration-150">
                    <span className="text-stone-500 select-none shrink-0 font-mono text-[10px]">
                      [{log.timestamp}]
                    </span>
                    <span className={`px-1.5 py-0.2 rounded border text-[9px] font-black shrink-0 ${log.tagClass}`}>
                      {log.tag}
                    </span>
                    <span className="text-stone-300 flex-1 min-w-0 break-words">
                      {log.message}
                    </span>
                    <span className={`shrink-0 text-[10px] ${log.statusClass}`}>
                      {log.status}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>

              {/* TERMINAL PROMPT FOOTER */}
              <div className="pt-2 mt-2 border-t border-stone-800/80 flex items-center gap-2 font-mono text-[11px] text-stone-500">
                <CornerDownRight className="w-3.5 h-3.5 text-stone-600" />
                <span className="text-emerald-500/80">chenille@db-worker</span>
                <span className="text-stone-600">:</span>
                <span className="text-cyan-500/80">~/maintenance</span>
                <span className="text-stone-600">$</span>
                <span className="w-2 h-3.5 bg-emerald-400 animate-pulse inline-block" />
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              {hasExecutionError ? (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentStage(2)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all cursor-pointer"
                  >
                    Kembali ke Pilihan Opsi
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </>
              ) : isExecutionComplete ? (
                <>
                  <button
                    type="button"
                    onClick={handleCopyLogs}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Seluruh Log</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStage(4)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span>Lihat Ringkasan Hasil</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="text-[11px] text-stone-500 italic flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-500" />
                  <span>Harap jangan menutup jendela atau menyegarkan halaman saat transaksi sedang berjalan...</span>
                </div>
              )}
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
                  <span>Ringkasan Data yang Diproses:</span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(executionResult.executed_at).toLocaleTimeString('id-ID')}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  {Object.entries(executionResult.tables_affected).map(([tbl, status]) => (
                    <div key={tbl} className="flex justify-between items-center py-0.5">
                      <span className="text-stone-600 font-medium">{TABLE_HUMAN_LABELS[tbl] || tbl}:</span>
                      <span className="font-bold text-stone-900 font-mono text-[10px] bg-stone-100 px-1.5 py-0.5 rounded">{status}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-emerald-700 font-bold">
                  <span>Akun Admin Anda Tetap Aman:</span>
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

      {/* ================================================================ */}
      {/* PRE-ACTIVATION CONFIRMATION MODAL (DESTRUCTIVE TOGGLE GUARD) */}
      {/* ================================================================ */}
      {pendingToggle && (
        <div className="fixed inset-0 z-60 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full border border-rose-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="inline-block px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[9px] font-black uppercase tracking-wider">
                  Konfirmasi Pengaktifan Opsi
                </div>
                <h4 className="text-sm font-bold text-stone-900 leading-tight">
                  {pendingToggle.title}
                </h4>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/70 text-xs text-rose-900 space-y-2">
              <p className="leading-relaxed">
                {pendingToggle.description}
              </p>
              {pendingToggle.countWarning && (
                <div className="pt-1.5 border-t border-rose-200 text-[11px] font-semibold text-rose-800 flex items-start gap-1.5">
                  <span className="font-bold">⚠️</span>
                  <span>{pendingToggle.countWarning}</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-stone-500 italic">
              Data ini akan dimasukkan ke dalam daftar data yang <strong>dihapus permanen</strong> saat Anda menekan tombol konfirmasi akhir di Tahap 3.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={handleCancelToggleOn}
                className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all cursor-pointer"
              >
                Batal / Jangan Aktifkan
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleOn}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Ya, Aktifkan Pilihan Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

