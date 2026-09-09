'use client';

import React, { useState, useRef } from 'react';
import { X, ShieldCheck, UploadCloud, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';
import type { IssueCategory } from '@chenille/shared';

interface WarrantyClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInvoice?: string;
  customerName?: string;
  customerPhone?: string;
}

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  }
  return 'http://localhost:4000';
};

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
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedClaimId, setSubmittedClaimId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPhotoPreview(localUrl);
    setIsUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('proof', file);

      const res = await fetch(`${getApiBase()}/api/v1/warranty/upload-proof`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setUploadedUrl(data.data.url);
      } else {
        console.warn('Upload API responded with error, using local preview url:', data.error);
        setUploadedUrl(localUrl);
      }
    } catch (err: any) {
      console.warn('Network upload failed, falling back to local image URL:', err);
      setUploadedUrl(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const finalProofUrl = uploadedUrl || photoPreview;

    try {
      // 1. Submit to backend API
      const res = await fetch(`${getApiBase()}/api/v1/warranty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: invoiceNumber.trim(),
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          issue_category: issueCategory,
          description: description.trim(),
          solution_preference: solutionPreference,
          photo_proof_url: finalProofUrl,
        }),
      });

      const resData = await res.json();
      let claimId = `claim-${Date.now()}`;
      if (resData.success && resData.data?.id) {
        claimId = resData.data.id;
      }

      // 2. Sync with local Zustand store
      addWarrantyClaim({
        invoiceNumber: invoiceNumber.trim(),
        customerName: name.trim(),
        customerPhone: phone.trim(),
        issueCategory,
        description: description.trim(),
        solutionPreference,
        photoProofUrl: finalProofUrl,
      });

      setSubmittedClaimId(claimId);
      setIsSubmitted(true);
    } catch (err: any) {
      console.warn('Backend warranty submission error, saving locally:', err);
      const newClaim = addWarrantyClaim({
        invoiceNumber: invoiceNumber.trim(),
        customerName: name.trim(),
        customerPhone: phone.trim(),
        issueCategory,
        description: description.trim(),
        solutionPreference,
        photoProofUrl: finalProofUrl,
      });
      setSubmittedClaimId(newClaim.id);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex min-h-full items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-xl w-full p-6 sm:p-8 z-10 my-auto modal-zoom-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4 auth-fade-in">
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
              <div className="flex items-center justify-between text-stone-700">
                <span>Status Verifikasi:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                  Menunggu Review Florist
                </span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 active:scale-98 transition-all cursor-pointer"
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

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
                {errorMessage}
              </div>
            )}

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

            {/* Upload Foto Bukti Nyata */}
            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                Bukti Foto Kerusakan / Video Unboxing
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-2xl p-3 flex items-center gap-4 bg-rose-50/30 hover:bg-rose-50/50 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Bukti Kerusakan"
                    className="w-14 h-14 object-cover rounded-xl border border-rose-200 shadow-sm"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-white">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                    <UploadCloud className="w-4 h-4 text-rose-500" />
                    <span>{isUploading ? 'Mengunggah ke Cloud...' : 'Pilih Foto / Video Bukti'}</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5 truncate">
                    Klik untuk memilih file dari galeri ponsel / komputer (PNG, JPG, MP4 max 10MB)
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
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
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
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
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
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-black shadow-md shadow-rose-600/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Ajukan Klaim Garansi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
