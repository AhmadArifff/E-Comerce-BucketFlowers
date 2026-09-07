'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Search, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';
import type { WarrantyStatus } from '@chenille/shared';

export const WarrantyClaimsTable: React.FC = () => {
  const { warrantyClaims, updateWarrantyClaimStatus } = useOrderStore();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredClaims = warrantyClaims.filter((c) => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  const getStatusBadge = (status: WarrantyStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return { label: 'Diajukan Pembeli', bg: 'bg-amber-100 text-amber-800' };
      case 'UNDER_REVIEW':
        return { label: 'Sedang Diperiksa', bg: 'bg-blue-100 text-blue-800' };
      case 'APPROVED_REPLACE':
        return { label: 'Disetujui: Ganti Baru', bg: 'bg-emerald-100 text-emerald-800' };
      case 'REJECTED':
        return { label: 'Ditolak', bg: 'bg-rose-100 text-rose-800' };
      case 'RESOLVED':
        return { label: 'Selesai Diganti', bg: 'bg-stone-100 text-stone-800' };
      default:
        return { label: status, bg: 'bg-stone-100 text-stone-700' };
    }
  };

  const getIssueLabel = (issue: string) => {
    switch (issue) {
      case 'TRANSIT_DAMAGE_CRUSHED':
        return '📦 Rusak / Tertindih Kurir';
      case 'WRONG_PRODUCT_VARIANT':
        return '🎨 Varian Salah Kirim';
      case 'WRONG_GREETING_CARD':
        return '💌 Kartu Ucapan Keliru';
      case 'PACKAGE_LOST_EXPEDITION':
        return '⚠️ Paket Hilang Ekspedisi';
      default:
        return issue;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
              Pusat Pelayanan Komplain & Garansi 100% Anti-Patah
            </h2>
            <p className="text-xs text-stone-500">
              Verifikasi klaim bunga rusak dari pembeli dan terbitkan jadwal perangkaian buket pengganti baru.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200 self-start sm:self-auto">
          {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED_REPLACE'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                filterStatus === status
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {status === 'ALL' ? 'Semua' : status === 'SUBMITTED' ? 'Diajukan' : status === 'UNDER_REVIEW' ? 'Ditinjau' : 'Disetujui'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Tiket</span>
          <span className="text-xl font-black text-stone-800">{warrantyClaims.length}</span>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Menunggu Review</span>
          <span className="text-xl font-black text-amber-800">
            {warrantyClaims.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length}
          </span>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Ganti Baru Disetujui</span>
          <span className="text-xl font-black text-emerald-800">
            {warrantyClaims.filter((c) => c.status === 'APPROVED_REPLACE').length}
          </span>
        </div>
        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Garansi Kepuasan</span>
          <span className="text-xl font-black text-rose-800">100% Garansi</span>
        </div>
      </div>

      {/* Claims Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-600">
          <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
            <tr>
              <th className="py-3 px-4">ID & No. Invoice</th>
              <th className="py-3 px-4">Pelanggan</th>
              <th className="py-3 px-4">Kategori Kerusakan</th>
              <th className="py-3 px-4">Foto Bukti</th>
              <th className="py-3 px-4">Solusi Pilihan</th>
              <th className="py-3 px-4">Status Klaim</th>
              <th className="py-3 px-4 text-right">Aksi Verifikasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredClaims.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-stone-400">
                  Tidak ada tiket klaim dengan status ini.
                </td>
              </tr>
            ) : (
              filteredClaims.map((claim) => {
                const badge = getStatusBadge(claim.status);

                return (
                  <tr key={claim.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-extrabold text-stone-800">{claim.id}</div>
                      <div className="text-[11px] text-rose-600 font-bold">{claim.invoiceNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-stone-800">{claim.customerName}</div>
                      <div className="text-[10px] text-stone-400">{claim.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-700">{getIssueLabel(claim.issueCategory)}</div>
                      <p className="text-[10px] text-stone-500 line-clamp-1 max-w-xs">{claim.description}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {claim.photoProofUrl ? (
                        <button
                          onClick={() => setSelectedPhoto(claim.photoProofUrl || null)}
                          className="relative group rounded-xl overflow-hidden border border-rose-200 block"
                        >
                          <img
                            src={claim.photoProofUrl}
                            alt="Bukti Rusak"
                            className="w-10 h-10 object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        </button>
                      ) : (
                        <span className="text-stone-400 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-stone-700">
                        {claim.solutionPreference === 'FREE_REPLACEMENT' ? '🌸 Ganti Baru 100%' : '💰 Refund Dana'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {claim.status === 'SUBMITTED' || claim.status === 'UNDER_REVIEW' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              updateWarrantyClaimStatus(
                                claim.id,
                                'APPROVED_REPLACE',
                                'Klaim disetujui oleh Lead Florist. Penjadwalan buket pengganti telah dibuat otomatis.'
                              )
                            }
                            title="Setujui & Buat Pesanan Pengganti"
                            className="p-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              updateWarrantyClaimStatus(
                                claim.id,
                                'REJECTED',
                                'Foto tidak menunjukkan kerusakan permanen pada struktur kawat bulu.'
                              )
                            }
                            title="Tolak Klaim"
                            className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-stone-400 font-bold">Terverifikasi</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-stone-900/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-3 shadow-2xl overflow-hidden">
            <img src={selectedPhoto} alt="Bukti Pembesar" className="w-full h-auto rounded-2xl object-cover" />
            <div className="p-3 text-center text-xs text-stone-600 font-bold">
              Foto Bukti Kerusakan Pelanggan • Klik di luar untuk menutup
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
