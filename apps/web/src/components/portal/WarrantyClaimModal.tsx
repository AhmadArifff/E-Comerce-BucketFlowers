'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Loader2,
  Image as ImageIcon,
  KeyRound,
  Send,
  ShieldAlert,
  Smartphone,
} from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';
import { useAuthStore } from '@/stores/useAuthStore';
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

type VerificationState =
  | 'IDLE'
  | 'CHECKING'
  | 'VERIFIED_MEMBER'
  | 'VERIFIED_GUEST'
  | 'OTP_REQUIRED'
  | 'OTP_SENT'
  | 'INVALID_ORDER'
  | 'ALREADY_CLAIMED';

export const WarrantyClaimModal: React.FC<WarrantyClaimModalProps> = ({
  isOpen,
  onClose,
  defaultInvoice = '',
  customerName = '',
  customerPhone = '',
}) => {
  const { addWarrantyClaim } = useOrderStore();
  const { user } = useAuthStore();

  const [invoiceNumber, setInvoiceNumber] = useState(defaultInvoice || '');
  const [name, setName] = useState(customerName || user?.name || '');
  const [phone, setPhone] = useState(customerPhone || user?.phone || '');
  const [issueCategory, setIssueCategory] = useState<IssueCategory>('TRANSIT_DAMAGE_CRUSHED');
  const [description, setDescription] = useState('');
  const [solutionPreference, setSolutionPreference] = useState<'FREE_REPLACEMENT' | 'REFUND'>('FREE_REPLACEMENT');

  // Ownership verification state
  const [verificationState, setVerificationState] = useState<VerificationState>('IDLE');
  const [orderInfo, setOrderInfo] = useState<{
    orderId: string;
    customerName: string;
    maskedPhone: string;
    userId?: string;
    existingClaim?: any;
  } | null>(null);

  const [guestPhoneInput, setGuestPhoneInput] = useState('');
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

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

  // Sync initial invoice and reset on open
  useEffect(() => {
    if (isOpen) {
      const initial = defaultInvoice || '';
      setInvoiceNumber(initial);
      setName(customerName || user?.name || '');
      setPhone(customerPhone || user?.phone || '');
      setErrorMessage('');
      setOtpError('');
      if (initial.trim()) {
        verifyOrderOwnership(initial.trim());
      } else {
        setVerificationState('IDLE');
        setOrderInfo(null);
      }
    }
  }, [isOpen, defaultInvoice]);

  const verifyOrderOwnership = async (inv: string) => {
    const cleanInv = (inv || '').trim();
    if (!cleanInv) {
      setVerificationState('IDLE');
      setOrderInfo(null);
      return;
    }

    setVerificationState('CHECKING');
    setErrorMessage('');
    setOtpError('');

    try {
      const res = await fetch(`${getApiBase()}/api/v1/warranty/verify-order/${encodeURIComponent(cleanInv)}`);
      const resData = await res.json();

      if (!resData.success || !resData.data) {
        setVerificationState('INVALID_ORDER');
        setErrorMessage(resData.error || 'Nomor invoice pesanan tidak ditemukan di sistem atelier.');
        setOrderInfo(null);
        return;
      }

      const d = resData.data;

      // 1. Check existing active claim
      if (d.existingClaim) {
        setVerificationState('ALREADY_CLAIMED');
        setErrorMessage(
          `Pesanan ${cleanInv} sudah memiliki klaim garansi aktif (${d.existingClaim.id} - status: ${d.existingClaim.status}). Pengajuan klaim ganda tidak diperkenankan.`
        );
        setOrderInfo(d);
        return;
      }

      setOrderInfo(d);

      // 2. Check if logged-in member is the owner
      if (user) {
        const cleanUserPhone = (user.phone || '').replace(/[^0-9]/g, '');
        const cleanOrderPhone = (d.maskedPhone || '').replace(/[^0-9]/g, '');
        const isMemberOwner =
          (user.id && d.userId && user.id === d.userId) ||
          (cleanUserPhone.slice(-4) === cleanOrderPhone.slice(-4));

        if (isMemberOwner) {
          setVerificationState('VERIFIED_MEMBER');
          setName(user.name);
          setPhone(user.phone || '');
          return;
        }
      }

      // 3. Guest / unauthenticated visitor -> Requires WhatsApp OTP
      setVerificationState('OTP_REQUIRED');
      setName(d.customerName || '');
    } catch (err: any) {
      console.warn('Verify order error:', err);
      setVerificationState('INVALID_ORDER');
      setErrorMessage('Koneksi ke server atelier gagal. Silakan coba kembali.');
    }
  };

  const handleSendOtp = async () => {
    const cleanGuestPhone = guestPhoneInput.replace(/[^0-9]/g, '');
    if (cleanGuestPhone.length < 9) {
      setOtpError('Masukkan nomor WhatsApp yang valid (minimal 10 digit).');
      return;
    }

    setIsSendingOtp(true);
    setOtpError('');

    try {
      const res = await fetch(`${getApiBase()}/api/v1/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanGuestPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setVerificationState('OTP_SENT');
        setPhone(cleanGuestPhone);
      } else {
        setOtpError(data.error || 'Gagal mengirim OTP ke nomor tersebut.');
      }
    } catch (e: any) {
      setOtpError('Gagal menghubungi gateway OTP WhatsApp.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanCode = otpCodeInput.trim();
    if (!cleanCode) {
      setOtpError('Masukkan 6 digit kode OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    try {
      const res = await fetch(`${getApiBase()}/api/v1/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone || guestPhoneInput, code: cleanCode }),
      });
      const data = await res.json();
      if (data.success) {
        setVerificationState('VERIFIED_GUEST');
        setPhone(guestPhoneInput.trim());
      } else {
        setOtpError(data.error || 'Kode OTP tidak cocok atau sudah kedaluwarsa.');
      }
    } catch (e: any) {
      setOtpError('Gagal memverifikasi kode OTP.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        setUploadedUrl(localUrl);
      }
    } catch (err: any) {
      setUploadedUrl(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber.trim() || !description.trim()) return;

    const isVerified = verificationState === 'VERIFIED_MEMBER' || verificationState === 'VERIFIED_GUEST';
    if (!isVerified) {
      setErrorMessage('Verifikasi kepemilikan pesanan wajib diselesaikan terlebih dahulu.');
      return;
    }

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
      if (!resData.success) {
        setErrorMessage(resData.error || 'Pengajuan klaim gagal diproses.');
        setIsSubmitting(false);
        return;
      }

      const claimId = resData.data?.id || `claim-${Date.now()}`;

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
      setErrorMessage(err.message || 'Terjadi gangguan saat mengirim klaim garansi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setDescription('');
    setVerificationState('IDLE');
    onClose();
  };

  if (!isOpen) return null;

  const isVerified = verificationState === 'VERIFIED_MEMBER' || verificationState === 'VERIFIED_GUEST';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex min-h-full items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-xl w-full p-6 sm:p-8 z-10 my-auto modal-zoom-in max-h-[90vh] overflow-y-auto">
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
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Terverifikasi Sah
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Inputs: Invoice & Ownership Verification */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                  Nomor Invoice Pesanan *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => {
                      setInvoiceNumber(e.target.value);
                      if (verificationState !== 'IDLE') setVerificationState('IDLE');
                    }}
                    onBlur={() => {
                      if (invoiceNumber.trim()) verifyOrderOwnership(invoiceNumber);
                    }}
                    placeholder="Contoh: INV-20261003-9171"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 text-xs text-stone-800 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => verifyOrderOwnership(invoiceNumber)}
                    disabled={verificationState === 'CHECKING' || !invoiceNumber.trim()}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {verificationState === 'CHECKING' ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                    ) : (
                      'Periksa'
                    )}
                  </button>
                </div>
              </div>

              {/* 🛡️ Ownership Verification Card Status */}
              {verificationState === 'CHECKING' && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                  <span>Memeriksa status pesanan & kepemilikan di database...</span>
                </div>
              )}

              {verificationState === 'VERIFIED_MEMBER' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Terverifikasi Sah:</strong> Anda adalah pemilik pesanan ini (Akun Member: {user?.name}).
                  </span>
                </div>
              )}

              {verificationState === 'VERIFIED_GUEST' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Terverifikasi OTP WhatsApp:</strong> Kepemilikan pesanan telah tervalidasi via nomor {phone}.
                  </span>
                </div>
              )}

              {verificationState === 'OTP_REQUIRED' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Verifikasi Kepemilikan Diperlukan</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Pesanan ini atas nama <strong>{orderInfo?.customerName}</strong> ({orderInfo?.maskedPhone}). Untuk mencegah klaim palsu oleh pihak lain, masukkan nomor WhatsApp lengkap Anda untuk menerima OTP:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nomor WhatsApp (Contoh: 081938851834)"
                      value={guestPhoneInput}
                      onChange={(e) => setGuestPhoneInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || !guestPhoneInput.trim()}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isSendingOtp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Kirim OTP</span>
                    </button>
                  </div>
                  {otpError && <p className="text-rose-600 text-[11px] font-bold">{otpError}</p>}
                </div>
              )}

              {verificationState === 'OTP_SENT' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between font-bold text-amber-800">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Masukkan 6-Digit Kode OTP</span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-normal">Terkirim ke {guestPhoneInput}</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Kode simulasi demo: <strong className="font-mono text-rose-600">123456</strong>
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCodeInput}
                      onChange={(e) => setOtpCodeInput(e.target.value)}
                      className="w-32 px-3 py-2 text-center text-sm font-mono tracking-widest bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp || !otpCodeInput.trim()}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isVerifyingOtp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Verifikasi OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3 py-2 text-stone-500 hover:text-stone-800 text-[11px] underline cursor-pointer"
                    >
                      Kirim Ulang
                    </button>
                  </div>
                  {otpError && <p className="text-rose-600 text-[11px] font-bold">{otpError}</p>}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                  Nama Pemesan
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                  disabled={verificationState === 'VERIFIED_MEMBER'}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 text-xs text-stone-800 disabled:bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                  Nomor WhatsApp Pemesan
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  disabled={verificationState === 'VERIFIED_MEMBER' || verificationState === 'VERIFIED_GUEST'}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 text-xs text-stone-800 font-mono disabled:bg-stone-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                Kategori Masalah Kerusakan *
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
                Deskripsi Kendala & Detail Kerusakan *
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
                    <UploadCloud className="w-4 h-4 text-rose-600" />
                    <span>{isUploading ? 'Sedang Mengunggah...' : 'Pilih Foto / Video dari Perangkat'}</span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5 truncate">
                    Mendukung JPG, PNG, MP4 hingga 20MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Solusi Garansi Pilihan */}
            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1.5">
                Pilihan Solusi Garansi yang Anda Inginkan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSolutionPreference('FREE_REPLACEMENT')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    solutionPreference === 'FREE_REPLACEMENT'
                      ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 shadow-sm'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="text-xs font-black flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Buket Pengganti 100% Baru</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Dirangkai ulang langsung oleh florist atelier tanpa biaya tambahan.
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
                disabled={isSubmitting || isUploading || !isVerified}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-black shadow-md shadow-rose-600/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : !isVerified ? (
                  <span>Verifikasi Kepemilikan Dahulu</span>
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
