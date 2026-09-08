'use client';

import React, { useState, useMemo } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Search, AlertCircle, ExternalLink, Sparkles, Star, MessageSquare } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';
import type { WarrantyStatus } from '@chenille/shared';
import { TableSortHeader, type SortDirection } from './TableSortHeader';
import { DateRangeFilter, type DateRange } from './DateRangeFilter';

export const WarrantyClaimsTable: React.FC = () => {
  const { warrantyClaims, updateWarrantyClaimStatus } = useOrderStore();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: '',
    presetLabel: 'Semua Waktu',
  });

  type ClaimSortField = 'id' | 'customerName' | 'issueCategory' | 'solutionPreference' | 'status' | 'createdAt';
  const [sortField, setSortField] = useState<ClaimSortField | null>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: ClaimSortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredClaims = useMemo(() => {
    const list = warrantyClaims.filter((c) => {
      if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;

      // Date Range Filter
      if (dateRange.startDate) {
        const claimDate = c.createdAt.slice(0, 10);
        if (claimDate < dateRange.startDate) return false;
      }
      if (dateRange.endDate) {
        const claimDate = c.createdAt.slice(0, 10);
        if (claimDate > dateRange.endDate) return false;
      }

      return true;
    });

    if (!sortField || !sortDirection) return list;

    return [...list].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        const cmp = valA.localeCompare(valB, 'id');
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      return sortDirection === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }, [warrantyClaims, filterStatus, dateRange, sortField, sortDirection]);

  // Mock Customer Reviews for Rating Section
  const allCustomerReviews = useMemo(() => [
    {
      id: 'rev-01',
      customer: 'Siti Rahmadani',
      rating: 5,
      date: '2026-09-07T11:00:00Z',
      product: 'Buket Tulip Pink Korean Aesthetic',
      comment: 'Bagus banget bunganya fluffy tebal, wrap kardusnya kokoh dan ada penyangga! Wisuda jadi makin berkesan 🌸',
    },
    {
      id: 'rev-02',
      customer: 'Budi Wicaksono',
      rating: 5,
      date: '2026-09-06T14:20:00Z',
      product: 'Buket Sunflower Graduation Bear',
      comment: 'Boneka toganya lucu, kawat bulu kelopaknya rapi simetris. Pengiriman J&T aman sampai tujuan.',
    },
    {
      id: 'rev-03',
      customer: 'Clarissa Angela',
      rating: 5,
      date: '2026-09-04T09:15:00Z',
      product: 'Royal Amethyst Lavender Crown',
      comment: 'Warna ungu pastelnya aesthetic sekali! Sangat cocok untuk kado sidang skripsi sahabat.',
    },
    {
      id: 'rev-04',
      customer: 'Nadia Rahmawati',
      rating: 4,
      date: '2026-09-02T16:40:00Z',
      product: 'Buket Tulip Pink Korean Aesthetic',
      comment: 'Bunga bagus, kemarin sempat agak tertekan sedikit tapi langsung dibantu CS ramah & solutif!',
    },
    {
      id: 'rev-05',
      customer: 'Dimas Kurniawan',
      rating: 5,
      date: '2026-08-29T10:00:00Z',
      product: 'Single Stem Rose Burgundy Deluxe',
      comment: 'Mawar kawat bulu awet tanpa air, pacar saya suka banget. Packaging kardusnya aesthetic premium.',
    },
  ], []);

  const filteredReviews = useMemo(() => {
    return allCustomerReviews.filter((r) => {
      if (dateRange.startDate) {
        const rDate = r.date.slice(0, 10);
        if (rDate < dateRange.startDate) return false;
      }
      if (dateRange.endDate) {
        const rDate = r.date.slice(0, 10);
        if (rDate > dateRange.endDate) return false;
      }
      return true;
    });
  }, [allCustomerReviews, dateRange]);

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
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
              Pusat Pelayanan Komplain & Rating Kepuasan 100% Anti-Patah
            </h2>
            <p className="text-xs text-stone-500">
              Verifikasi klaim bunga rusak dari pembeli dan evaluasi ulasan kepuasan pelanggan secara berkala.
            </p>
          </div>
        </div>

        {/* Toolbar: Date Range + Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0 self-start xl:self-auto">
          <DateRangeFilter value={dateRange} onChange={setDateRange} align="right" />
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
            {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED_REPLACE'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
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
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Tiket (Periode Ini)</span>
          <span className="text-xl font-black text-stone-800">{sortedAndFilteredClaims.length}</span>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Menunggu Review</span>
          <span className="text-xl font-black text-amber-800">
            {sortedAndFilteredClaims.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length}
          </span>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Ganti Baru Disetujui</span>
          <span className="text-xl font-black text-emerald-800">
            {sortedAndFilteredClaims.filter((c) => c.status === 'APPROVED_REPLACE').length}
          </span>
        </div>
        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Rating CSAT Toko</span>
          <div className="flex items-center gap-1">
            <span className="text-xl font-black text-rose-800">4.9</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
            <span className="text-[11px] text-stone-500 font-bold ml-1">(98% Puas)</span>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-600">
          <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
            <tr>
              <TableSortHeader
                label="ID & No. Invoice"
                field="id"
                currentField={sortField}
                direction={sortDirection}
                onSort={(f) => handleSort(f as ClaimSortField)}
                className="py-3 px-4"
              />
              <TableSortHeader
                label="Tanggal"
                field="createdAt"
                currentField={sortField}
                direction={sortDirection}
                onSort={(f) => handleSort(f as ClaimSortField)}
                className="py-3 px-4"
              />
              <TableSortHeader
                label="Pelanggan"
                field="customerName"
                currentField={sortField}
                direction={sortDirection}
                onSort={(f) => handleSort(f as ClaimSortField)}
                className="py-3 px-4"
              />
              <TableSortHeader
                label="Kategori Kerusakan"
                field="issueCategory"
                currentField={sortField}
                direction={sortDirection}
                onSort={(f) => handleSort(f as ClaimSortField)}
                className="py-3 px-4"
              />
              <th className="py-3 px-4">Foto Bukti</th>
              <TableSortHeader
                label="Solusi Pilihan"
                field="solutionPreference"
                currentField={sortField}
                direction={sortDirection}
                onSort={(f) => handleSort(f as ClaimSortField)}
                className="py-3 px-4"
              />
              <TableSortHeader
                label="Status Klaim"
                field="status"
                currentField={sortField}
                direction={sortDirection}
                onSort={(f) => handleSort(f as ClaimSortField)}
                className="py-3 px-4"
              />
              <th className="py-3 px-4 text-right">Aksi Verifikasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {sortedAndFilteredClaims.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-stone-400 font-medium">
                  Tidak ada tiket klaim yang sesuai dengan rentang tanggal dan filter status ini.
                </td>
              </tr>
            ) : (
              sortedAndFilteredClaims.map((claim) => {
                const badge = getStatusBadge(claim.status);

                return (
                  <tr key={claim.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-extrabold text-stone-800">{claim.id}</div>
                      <div className="text-[11px] text-rose-600 font-bold">{claim.invoiceNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-stone-700 text-xs">
                        {new Date(claim.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {new Date(claim.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} WIB
                      </div>
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

      {/* Customer Ratings & CSAT Section */}
      <div className="mt-8 pt-6 border-t border-rose-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <h3 className="text-sm sm:text-base font-extrabold text-stone-800">
                Ulasan & Rating Kepuasan Pelanggan (CSAT)
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Ulasan terverifikasi dari pembeli setelah menerima buket mekar sempurna.
            </p>
          </div>
          <div className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            {filteredReviews.length} Ulasan Ditemukan
          </div>
        </div>

        {/* Rating Breakdown & Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-rose-50/40 rounded-2xl p-4 border border-rose-100 flex flex-col justify-center items-center text-center">
            <div className="text-4xl font-black text-stone-800">4.9</div>
            <div className="flex items-center gap-1 my-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <div className="text-xs font-bold text-emerald-700">98.4% Pelanggan Puas</div>
            <div className="text-[10px] text-stone-400 mt-0.5">Berdasarkan 142 Ulasan Terverifikasi</div>
          </div>

          <div className="md:col-span-2 space-y-3">
            {filteredReviews.length === 0 ? (
              <div className="p-6 text-center text-stone-400 text-xs bg-stone-50 rounded-2xl border border-stone-200">
                Tidak ada ulasan pelanggan pada rentang tanggal ini.
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <div key={rev.id} className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-200/80 space-y-1.5 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-stone-800">{rev.customer}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                        Terverifikasi
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 font-medium">
                      {new Date(rev.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400 font-bold ml-1">• {rev.product}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
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
