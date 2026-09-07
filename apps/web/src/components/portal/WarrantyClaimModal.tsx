'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, UploadCloud, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';
import type { IssueCategory } from '@chenille/shared';

interface WarrantyClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInvoice?: string;
  customerName?: string;
  customerPhone?: string;
}

export const WarrantyClaimModal: React.FC<WarrantyClaimModalProps> = ({
  isOpen,
  onClose,
  defaultInvoice = '',
  customerName = '',
  customerPhone = '',
}) => {
  const { addWarrantyClaim } = useOrderStore();

  const [invoiceNumber, setInvoiceNumber] = useState(defaultInvoice || 'INV-20260907-001');
  const [name, setName] = useState(customerName || 'Siti Anggraini');
  const [phone, setPhone] = useState(customerPhone || '081298765432');
  const [issueCategory, setIssueCategory] = useState<IssueCategory>('TRANSIT_DAMAGE_CRUSHED');
  const [description, setDescription] = useState('');
  const [solutionPreference, setSolutionPreference] = useState<'FREE_REPLACEMENT' | 'REFUND'>('FREE_REPLACEMENT');
  const [photoPreview, setPhotoPreview] = useState<string>(
    'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedClaimId, setSubmittedClaimId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber.trim() || !description.trim()) return;

    const newClaim = addWarrantyClaim({
      invoiceNumber: invoiceNumber.trim(),
      customerName: name.trim(),
      customerPhone: phone.trim(),
      issueCategory,
      description: description.trim(),
      solutionPreference,
      photoProofUrl: photoPreview,
    });

    setSubmittedClaimId(newClaim.id);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-xl w-full p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                Tiket Garansi Berhasil Diterbitkan
              </span>
              <h3 className="text-xl font-black text-stone-800">
                Klaim Garansi Telah Diterima Florist
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                ID Tiket: <strong className="text-rose-600 font-mono">{submittedClaimId}</strong>.
                Tim pengrajin atelier akan memeriksa foto kerusakan dalam waktu maksimal 2 jam kerja. Buket pengganti baru Anda akan segera dijadwalkan untuk dirangkai!
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-left text-xs space-y-2">
              <div className="flex items-center justify-between text-stone-700">
                <span>Nomor Invoice:</span>
                <strong className="font-mono">{invoiceNumber}</strong>
              </div>
              <div className="flex items-center justify-between text-stone-700">
                <span>Solusi Terpilih:</span>
                <strong className="text-emerald-700">
                  {solutionPreference === 'FREE_REPLACEMENT' ? 'Buket Pengganti 100% Baru (Gratis Ongkir)' : 'Pengembalian Dana'}
                </strong>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 active:scale-98 transition-all"
            >
              Kembali ke Portal Pelanggan
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-rose-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                  Komitmen Mutu Atelier Chenille
                </span>
                <h3 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
                  Klaim Garansi 100% Anti-Patah & Ganti Baru
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Jika batang bunga bengkok, kelopak terlepas parah, atau buket hancur selama transit ekspedisi, kami bertanggung jawab penuh menggantinya dengan yang baru secara <strong>GRATIS</strong>.
            </p>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                  Nomor Invoice Pesanan
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Contoh: INV-20260907-001"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 text-xs text-stone-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                  Nomor WhatsApp Aktif
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxxxxx"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 text-xs text-stone-800 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                Kategori Masalah Kerusakan
              </label>
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value as IssueCategory)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 text-xs text-stone-800 bg-white"
              >
                <option value="TRANSIT_DAMAGE_CRUSHED">
                  📦 Bunga Rusak / Tertindih Kurir Ekspedisi (Batang Patah / Gepeng)
                </option>
                <option value="WRONG_PRODUCT_VARIANT">
                  🎨 Salah Warna / Varian Tidak Sesuai Pesanan
                </option>
                <option value="WRONG_GREETING_CARD">
                  💌 Kesalahan Teks Kartu Ucapan Wisuda
                </option>
                <option value="PACKAGE_LOST_EXPEDITION">
                  ⚠️ Paket Hilang / Tidak Tiba di Titik Temu COD
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                Deskripsi Kendala & Detail Kerusakan
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan detail kerusakan yang Anda temui saat membuka paket..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 text-xs text-stone-800"
              />
            </div>

            {/* Upload Foto Bukti Simulasi */}
            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                Bukti Foto Kerusakan / Unboxing
              </label>
              <div className="border-2 border-dashed border-rose-200 rounded-2xl p-3 flex items-center gap-4 bg-rose-50/30">
                <img
                  src={photoPreview}
                  alt="Bukti Kerusakan"
                  className="w-14 h-14 object-cover rounded-xl border border-rose-200 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
                    <UploadCloud className="w-3.5 h-3.5 text-rose-500" />
                    <span>Foto Bukti Terlampir</span>
                  </div>
                  <p className="text-[10px] text-stone-500 truncate">
                    unboxing_flower_broken_proof.jpg (Format PNG, JPG max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Solusi Pilihan */}
            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-2">
                Pilihan Solusi yang Diharapkan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSolutionPreference('FREE_REPLACEMENT')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    solutionPreference === 'FREE_REPLACEMENT'
                      ? 'border-rose-500 bg-rose-50/60 text-rose-900 shadow-sm'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="text-xs font-black flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                    <span>Kirim Buket Baru 100% Gratis</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Dirangkai ulang & dikirim bebas ongkir ke alamat Anda.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSolutionPreference('REFUND')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    solutionPreference === 'REFUND'
                      ? 'border-rose-500 bg-rose-50/60 text-rose-900 shadow-sm'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="text-xs font-black flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Pengembalian Dana Penuh</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Pengembalian saldo via QRIS / transfer bank tanpa ribet.
                  </p>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/20 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Ajukan Klaim Garansi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
