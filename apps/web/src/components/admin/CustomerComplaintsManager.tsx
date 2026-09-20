'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Phone,
  Gift,
  HelpCircle,
  Eye,
  X,
  FileCheck,
  TrendingDown,
  Percent,
} from 'lucide-react';
import { getApiUrl } from '@/lib/api-client';
import { showMagicToast } from '@/lib/magic-motion';
import { WarrantyClaimsTable } from './WarrantyClaimsTable';
import type {
  CustomerComplaint,
  ComplaintCategory,
  ComplaintSeverity,
  ComplaintStatus,
  ComplaintCompensation,
  ComplaintMetrics,
} from '@chenille/shared';

const CATEGORY_LABELS: Record<ComplaintCategory, { label: string; color: string }> = {
  KETERLAMBATAN_PENGIRIMAN: { label: 'Keterlambatan Kurir', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  KERUSAKAN_BUNGA: { label: 'Kerusakan Bunga', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  KETIDAKSESUAIAN_PESANAN: { label: 'Pesanan Tidak Sesuai', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  PELAYANAN_FLORIST: { label: 'Pelayanan Florist', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  LAINNYA: { label: 'Lainnya', color: 'bg-stone-100 text-stone-800 border-stone-200' },
};

const SEVERITY_LABELS: Record<ComplaintSeverity, { label: string; badge: string }> = {
  LOW: { label: 'Rendah (Minor)', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  MEDIUM: { label: 'Sedang', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  HIGH: { label: 'Tinggi (Urgent)', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  CRITICAL: { label: 'Kritis (Darurat)', badge: 'bg-rose-100 text-rose-800 border-rose-300 font-bold' },
};

const STATUS_LABELS: Record<ComplaintStatus, { label: string; badge: string }> = {
  SUBMITTED: { label: 'Diajukan Baru', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  UNDER_REVIEW: { label: 'Sedang Ditinjau', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  RESOLVED: { label: 'Terselesaikan', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'Ditolak', badge: 'bg-stone-100 text-stone-600 border-stone-200' },
};

export const CustomerComplaintsManager: React.FC = () => {
  const [subTab, setSubTab] = useState<'COMPLAINTS' | 'WARRANTY'>('COMPLAINTS');
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([]);
  const [metrics, setMetrics] = useState<ComplaintMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected complaint for resolution modal
  const [selectedComplaint, setSelectedComplaint] = useState<CustomerComplaint | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form states for resolution
  const [editStatus, setEditStatus] = useState<ComplaintStatus>('SUBMITTED');
  const [editSeverity, setEditSeverity] = useState<ComplaintSeverity>('MEDIUM');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editCompensation, setEditCompensation] = useState<ComplaintCompensation>('NONE');
  const [editAmount, setEditAmount] = useState<number>(0);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl('/api/v1/complaints/admin/metrics'), {
        headers: { Authorization: 'Bearer admin-token' },
      });
      const json = await res.json();
      if (json.success) {
        setMetrics(json.data);
      }
    } catch (err) {
      console.error('Error fetching complaint metrics:', err);
    }
  }, []);

  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      if (filterCategory !== 'ALL') params.append('category', filterCategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(getApiUrl(`/api/v1/complaints/admin/list?${params.toString()}`), {
        headers: { Authorization: 'Bearer admin-token' },
      });
      const json = await res.json();
      if (json.success) {
        setComplaints(json.data.complaints || []);
      }
    } catch (err) {
      console.error('Error fetching complaints list:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, filterCategory, searchQuery]);

  useEffect(() => {
    fetchMetrics();
    fetchComplaints();
  }, [fetchMetrics, fetchComplaints]);

  const handleOpenDetail = (complaint: CustomerComplaint) => {
    setSelectedComplaint(complaint);
    setEditStatus(complaint.status);
    setEditSeverity(complaint.severity);
    setEditNotes(complaint.resolution_notes || '');
    setEditCompensation(complaint.compensation_type || 'NONE');
    setEditAmount(Number(complaint.compensation_amount) || 0);
  };

  const handleSaveResolution = async () => {
    if (!selectedComplaint) return;
    setIsUpdating(true);

    try {
      const res = await fetch(getApiUrl(`/api/v1/complaints/admin/${selectedComplaint.id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin-token',
        },
        body: JSON.stringify({
          status: editStatus,
          severity: editSeverity,
          resolution_notes: editNotes,
          compensation_type: editCompensation,
          compensation_amount: editAmount,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showMagicToast('Evaluasi Berhasil Disimpan! 🌸', 'Status komplain dan resolusi telah diperbarui.', '✨');
        setSelectedComplaint(null);
        fetchComplaints();
        fetchMetrics();
      } else {
        showMagicToast('Gagal Menyimpan', json.error || 'Terjadi kesalahan sistem.', '⚠️');
      }
    } catch (err) {
      console.error('Error updating complaint resolution:', err);
      showMagicToast('Gagal Menyimpan', 'Tidak dapat menghubungi server API.', '⚠️');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 admin-view-fade">
      {/* 1. SUB-NAV TABS: EVALUASI KOMPLAIN VS KLAIM GARANSI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>Pusat Evaluasi Kualitas & Layanan Pelanggan</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pantau kepuasan pembeli, evaluasi kerapian buket kawat bulu, dan kelola kompensasi pelanggan (PRD Seksi 30).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSubTab('COMPLAINTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'COMPLAINTS'
                ? 'bg-white text-rose-600 shadow-xs border border-rose-100'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Komplain Pelanggan</span>
            {metrics?.pending_complaints ? (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {metrics.pending_complaints}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setSubTab('WARRANTY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'WARRANTY'
                ? 'bg-white text-rose-600 shadow-xs border border-rose-100'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Klaim Garansi 30 Hari</span>
          </button>
        </div>
      </div>

      {subTab === 'WARRANTY' ? (
        <WarrantyClaimsTable />
      ) : (
        <>
          {/* 2. KPI METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Keluhan</span>
                <MessageSquare className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-stone-900">
                {metrics?.total_complaints ?? 0}
              </div>
              <div className="text-xs text-stone-500 flex items-center gap-1.5">
                <span className="text-amber-600 font-bold">{metrics?.pending_complaints ?? 0} Menunggu</span>
                <span>•</span>
                <span className="text-emerald-600 font-bold">{metrics?.resolved_complaints ?? 0} Selesai</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Complaint Rate (%)</span>
                <Percent className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-stone-900 flex items-baseline gap-2">
                <span>{metrics?.complaint_rate_pct ?? 0}%</span>
                <span className="text-xs font-normal text-stone-400">Target &lt; 1.5%</span>
              </div>
              <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Standar mutu atelier terkendali</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Rata-rata Resolusi (MTTR)</span>
                <Clock className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-stone-900 flex items-baseline gap-2">
                <span>{metrics?.mttr_hours ?? 0} Jam</span>
                <span className="text-xs font-normal text-stone-400">Target &lt; 24 Jam</span>
              </div>
              <div className="text-xs text-indigo-600 font-medium">
                Kecepatan respon tim florist
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">Kategori Terbanyak</span>
                <TrendingDown className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-sm font-black text-stone-800 line-clamp-1">
                {metrics?.category_breakdown
                  ? Object.entries(metrics.category_breakdown).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace(/_/g, ' ') || 'Belum Ada'
                  : 'N/A'}
              </div>
              <div className="text-xs text-stone-500">
                Fokus evaluasi QC packing & kurir
              </div>
            </div>
          </div>

          {/* 3. PARETO CATEGORY BREAKDOWN PILLS */}
          {metrics?.category_breakdown && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-stone-700 mr-2 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-stone-500" />
                <span>Distribusi Kategori Evaluasi:</span>
              </span>
              {Object.entries(metrics.category_breakdown).map(([cat, count]) => (
                <div
                  key={cat}
                  className="px-3 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center gap-2 shadow-2xs"
                >
                  <span className="font-medium text-[11px]">{CATEGORY_LABELS[cat as ComplaintCategory]?.label || cat}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-900 font-black text-[10px]">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 4. FILTER & SEARCH TOOLBAR */}
          <div className="p-4 rounded-3xl bg-white border border-rose-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, WhatsApp, order..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-stone-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="ALL">Semua Status</option>
                <option value="SUBMITTED">Diajukan Baru</option>
                <option value="UNDER_REVIEW">Sedang Ditinjau</option>
                <option value="RESOLVED">Terselesaikan</option>
                <option value="REJECTED">Ditolak</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-stone-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="KETERLAMBATAN_PENGIRIMAN">Keterlambatan Kurir</option>
                <option value="KERUSAKAN_BUNGA">Kerusakan Bunga</option>
                <option value="KETIDAKSESUAIAN_PESANAN">Pesanan Tidak Sesuai</option>
                <option value="PELAYANAN_FLORIST">Pelayanan Florist</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                fetchComplaints();
                fetchMetrics();
              }}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all cursor-pointer shadow-2xs self-end md:self-auto disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>

          {/* 5. TABLE OF COMPLAINTS */}
          <div className="bg-white rounded-3xl border border-rose-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50/80 text-[11px] uppercase tracking-wider text-stone-400 font-bold border-b border-stone-100">
                  <tr>
                    <th className="py-3.5 px-4">Tanggal & ID</th>
                    <th className="py-3.5 px-4">Pelanggan</th>
                    <th className="py-3.5 px-4">Kategori & Keparahan</th>
                    <th className="py-3.5 px-4">Keluhan</th>
                    <th className="py-3.5 px-4">Bukti Foto</th>
                    <th className="py-3.5 px-4">Status & Kompensasi</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
                        <span>Memuat data evaluasi komplain...</span>
                      </td>
                    </tr>
                  ) : complaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-400">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                        <div className="font-bold text-stone-700">Tidak ada komplain ditemukan.</div>
                        <div className="text-xs text-stone-400 mt-0.5">Semua pesanan berjalan dengan baik sesuai standar mutu.</div>
                      </td>
                    </tr>
                  ) : (
                    complaints.map((c) => {
                      const catInfo = CATEGORY_LABELS[c.complaint_category] || CATEGORY_LABELS.LAINNYA;
                      const sevInfo = SEVERITY_LABELS[c.severity] || SEVERITY_LABELS.MEDIUM;
                      const statInfo = STATUS_LABELS[c.status] || STATUS_LABELS.SUBMITTED;

                      return (
                        <tr key={c.id} className="hover:bg-rose-50/20 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                            <div>{new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            <div className="text-[10px] text-stone-400 truncate max-w-[90px]">{c.id}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900">{c.customer_name}</div>
                            <a
                              href={`https://wa.me/${c.customer_phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-2.5 h-2.5" />
                              <span>{c.customer_phone}</span>
                            </a>
                            {c.order_id && (
                              <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
                                Order: {c.order_id}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 space-y-1">
                            <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${catInfo.color}`}>
                              {catInfo.label}
                            </span>
                            <div>
                              <span className={`inline-block px-2 py-0.2 rounded-md text-[9px] font-semibold border ${sevInfo.badge}`}>
                                {sevInfo.label}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="line-clamp-2 text-xs text-stone-700">{c.description}</p>
                            {c.resolution_notes && (
                              <p className="text-[10px] text-emerald-700 italic mt-1 line-clamp-1">
                                Resolusi: {c.resolution_notes}
                              </p>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {c.evidence_photo_url ? (
                              <button
                                type="button"
                                onClick={() => setPhotoPreviewUrl(c.evidence_photo_url || null)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                <Eye className="w-3 h-3 text-rose-500" />
                                <span>Lihat Foto</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-stone-400 italic">Tanpa foto</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 space-y-1">
                            <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${statInfo.badge}`}>
                              {statInfo.label}
                            </span>
                            {c.compensation_type && c.compensation_type !== 'NONE' && (
                              <div className="text-[10px] font-bold text-purple-700 flex items-center gap-1">
                                <Gift className="w-2.5 h-2.5" />
                                <span>{c.compensation_type.replace(/_/g, ' ')}</span>
                                {Number(c.compensation_amount) > 0 && (
                                  <span>(Rp {Number(c.compensation_amount).toLocaleString('id-ID')})</span>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(c)}
                              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                            >
                              Tindak Lanjut
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* MODAL 1: TINDAK LANJUT & RESOLUSI KOMPLAIN */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-rose-100 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900">
                    Tindak Lanjut Evaluasi Komplain
                  </h3>
                  <p className="text-xs text-stone-500">
                    ID: <span className="font-mono">{selectedComplaint.id}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DETAIL SUMMARY */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-700">
              <div className="flex justify-between">
                <span className="text-stone-400">Pelanggan:</span>
                <span className="font-bold text-stone-900">{selectedComplaint.customer_name} ({selectedComplaint.customer_phone})</span>
              </div>
              {selectedComplaint.order_id && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Order ID:</span>
                  <span className="font-mono font-semibold">{selectedComplaint.order_id}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-400">Kategori:</span>
                <span className="font-bold text-rose-700">{CATEGORY_LABELS[selectedComplaint.complaint_category]?.label}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">Deskripsi Keluhan:</span>
                <p className="p-2.5 rounded-xl bg-white border border-stone-200/80 text-stone-800 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>
              {selectedComplaint.evidence_photo_url && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setPhotoPreviewUrl(selectedComplaint.evidence_photo_url || null)}
                    className="text-xs text-rose-600 hover:underline font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka Foto Bukti Kerusakan Fisik Buket</span>
                  </button>
                </div>
              )}
            </div>

            {/* FORM RESOLUSI */}
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Status Penanganan</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ComplaintStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 font-medium focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="SUBMITTED">Diajukan Baru</option>
                    <option value="UNDER_REVIEW">Sedang Ditinjau</option>
                    <option value="RESOLVED">Terselesaikan (Resolved)</option>
                    <option value="REJECTED">Ditolak (Rejected)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tingkat Keparahan</label>
                  <select
                    value={editSeverity}
                    onChange={(e) => setEditSeverity(e.target.value as ComplaintSeverity)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 font-medium focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="LOW">Rendah (Minor)</option>
                    <option value="MEDIUM">Sedang</option>
                    <option value="HIGH">Tinggi (Urgent)</option>
                    <option value="CRITICAL">Kritis (Darurat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Catatan Tindakan Staf Florist</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Tuliskan tindakan perbaikan yang dilakukan (misal: Menghubungi via WA, mengirimkan bunga pengganti)..."
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Bentuk Kompensasi</label>
                  <select
                    value={editCompensation}
                    onChange={(e) => setEditCompensation(e.target.value as ComplaintCompensation)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 font-medium focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="NONE">Tanpa Kompensasi</option>
                    <option value="VOUCHER_DISCOUNT">Voucher Diskon Toko</option>
                    <option value="REPLACEMENT_BOUQUET">Buket Pengganti Gratis</option>
                    <option value="REFUND">Pengembalian Dana (Refund)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nominal Kompensasi (Rp)</label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                    disabled={editCompensation === 'NONE'}
                    placeholder="Contoh: 25000"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 disabled:bg-stone-100 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <a
                href={`https://wa.me/${selectedComplaint.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo Kak ${selectedComplaint.customer_name}, kami dari Chenille Flowers Atelier ingin menindaklanjuti keluhan terkait pesanan buket bunga kawat bulu Anda.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hubungi WA</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleSaveResolution}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-md shadow-rose-600/20 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Evaluasi</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FOTO BUKTI BUKET FULL PREVIEW */}
      {photoPreviewUrl && (
        <div className="fixed inset-0 z-60 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-4 max-w-lg w-full border border-rose-100 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Foto Bukti Keluhan Pelanggan</span>
              <button
                type="button"
                onClick={() => setPhotoPreviewUrl(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-stone-100 max-h-[70vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreviewUrl}
                alt="Bukti Kerusakan Buket"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
