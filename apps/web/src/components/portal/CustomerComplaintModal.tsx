'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  ShieldAlert,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCw,
  Image as ImageIcon,
  MessageSquare,
  Clock,
  Send,
  HelpCircle,
} from 'lucide-react';
import { getApiUrl } from '@/lib/api-client';
import { showMagicToast } from '@/lib/magic-motion';
import type { ComplaintCategory, ComplaintSeverity } from '@chenille/shared';

interface CustomerComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInvoice?: string;
  customerName?: string;
  customerPhone?: string;
}

const CATEGORY_OPTIONS: { id: ComplaintCategory; label: string; desc: string }[] = [
  {
    id: 'KETERLAMBATAN_PENGIRIMAN',
    label: 'Keterlambatan Pengiriman',
    desc: 'Buket bunga terlambat sampai dari perkiraan jadwal acara.',
  },
  {
    id: 'KERUSAKAN_BUNGA',
    label: 'Kerusakan Bunga / Wrapping',
    desc: 'Kawat bulu penyok, kelopak patah, atau kertas wrapping lecek.',
  },
  {
    id: 'KETIDAKSESUAIAN_PESANAN',
    label: 'Pesanan Tidak Sesuai',
    desc: 'Warna, jenis bunga, atau isi kartu ucapan tidak sesuai pesanan.',
  },
  {
    id: 'PELAYANAN_FLORIST',
    label: 'Pelayanan Florist / CS',
    desc: 'Respon customer service lambat atau kurang ramah saat konsultasi.',
  },
  {
    id: 'LAINNYA',
    label: 'Kendala Lainnya',
    desc: 'Hal lain di luar kategori di atas yang ingin Anda sampaikan.',
  },
];

const SEVERITY_OPTIONS: { id: ComplaintSeverity; label: string; note: string }[] = [
  { id: 'LOW', label: 'Rendah (Minor)', note: 'Buket masih bisa digunakan dengan sedikit penyesuaian' },
  { id: 'MEDIUM', label: 'Sedang', note: 'Mengurangi keindahan buket secara nyata' },
  { id: 'HIGH', label: 'Tinggi (Urgent)', note: 'Buket tidak layak dipakai untuk acara' },
  { id: 'CRITICAL', label: 'Kritis (Darurat)', note: 'Acara berlangsung hari ini / pengiriman gagal total' },
];

export const CustomerComplaintModal: React.FC<CustomerComplaintModalProps> = ({
  isOpen,
  onClose,
  defaultInvoice = '',
  customerName = '',
  customerPhone = '',
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState(defaultInvoice || '');
  const [name, setName] = useState(customerName || '');
  const [phone, setPhone] = useState(customerPhone || '');
  const [category, setCategory] = useState<ComplaintCategory>('KERUSAKAN_BUNGA');
  const [severity, setSeverity] = useState<ComplaintSeverity>('MEDIUM');
  const [description, setDescription] = useState('');

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedCode, setSubmittedCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

      const res = await fetch(getApiUrl('/api/v1/complaints/upload-proof'), {
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
      console.warn('Upload API responded with error, using local preview url:', err);
      setUploadedUrl(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber.trim() || !name.trim() || !phone.trim() || !description.trim()) {
      setErrorMessage('Mohon lengkapi seluruh formulir yang bertanda bintang (*).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch(getApiUrl('/api/v1/complaints'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: invoiceNumber.trim(),
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          category,
          severity,
          description: description.trim(),
          proof_url: uploadedUrl || photoPreview || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedCode(data.data?.complaint_code || `CMP-${Date.now()}`);
        setIsSubmitted(true);
        showMagicToast(
          'Keluhan Diterima 🙏',
          'Atelier Chenille berkomitmen menyelesaikan kendala Anda maksimal 1x24 jam.',
          '✨'
        );
      } else {
        setErrorMessage(data.error?.message || 'Gagal mengirim pengajuan keluhan. Silakan coba lagi.');
      }
    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      setErrorMessage('Gagal menghubungi server atelier. Silakan periksa koneksi internet Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const waSupportLink = `https://wa.me/6281298765432?text=${encodeURIComponent(
    `Halo Customer Care Atelier Chenille, saya telah mengajukan evaluasi keluhan dengan Nomor Tiket: ${submittedCode} untuk Pesanan: ${invoiceNumber}. Mohon bantuannya.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-6 my-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-2xs flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                Pusat Evaluasi Pelanggan & Komplain
              </h2>
              <p className="text-xs text-stone-500">
                Atelier Chenille mengutamakan kepuasan Anda. Sampaikan kendala untuk evaluasi pelayanan kami.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          /* SUCCESS SCREEN */
          <div className="space-y-6 text-center py-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-stone-900">Keluhan Anda Telah Diterima</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Terima kasih telah memberikan masukan berharga. Tim Quality Assurance Atelier Chenille akan meninjau keluhan Anda dan memberikan solusi dalam waktu maksimal <strong>1x24 jam</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200">
                <span className="text-stone-500">Nomor Tiket Keluhan:</span>
                <span className="font-mono font-black text-stone-900 text-sm">{submittedCode}</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200">
                <span className="text-stone-500">Nomor Invoice:</span>
                <span className="font-semibold text-stone-800">{invoiceNumber}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Kategori:</span>
                <span className="font-semibold text-amber-700">
                  {CATEGORY_OPTIONS.find((c) => c.id === category)?.label}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={waSupportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hubungi CS via WhatsApp Segera</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-stone-200 hover:bg-stone-50 font-bold text-xs text-stone-600 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          /* FORM SUBMISSION */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Invoice & Contact Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Nomor Invoice *
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="INV-20260907-001"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Nama Pemesan *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Nomor WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Complaint Category */}
            <div>
              <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1.5">
                Kategori Kendala *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      category === cat.id
                        ? 'bg-rose-50/80 border-rose-300 text-stone-900 shadow-2xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{cat.label}</span>
                      {category === cat.id && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">{cat.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1.5">
                Tingkat Urgensi / Keparahan *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SEVERITY_OPTIONS.map((sev) => (
                  <button
                    type="button"
                    key={sev.id}
                    onClick={() => setSeverity(sev.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      severity === sev.id
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs ring-1 ring-amber-300'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 text-xs'
                    }`}
                  >
                    <div className="text-xs font-bold">{sev.label}</div>
                    <div className="text-[9px] text-stone-400 mt-0.5 truncate">{sev.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                Rincian Penjelasan Keluhan *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan kendala yang Anda alami secara detail (misal: kurir terlambat 3 jam dari waktu janji temu, bunga warna ungu kawat bulu kelopaknya lepas, dsb)..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all leading-relaxed"
              />
            </div>

            {/* Photo Proof Upload */}
            <div>
              <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                Foto Bukti Kendala (Opsional tapi Direkomendasikan)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  {isUploading ? (
                    <RotateCw className="w-4 h-4 animate-spin text-rose-600" />
                  ) : (
                    <UploadCloud className="w-4 h-4 text-stone-500" />
                  )}
                  <span>{isUploading ? 'Mengunggah Foto...' : 'Unggah Foto Bukti'}</span>
                </button>

                {photoPreview && (
                  <div className="flex items-center gap-2">
                    <img
                      src={photoPreview}
                      alt="Bukti Komplain"
                      className="w-10 h-10 rounded-xl object-cover border border-stone-200 shadow-2xs"
                    />
                    <span className="text-[11px] text-emerald-600 font-bold">✓ Foto terpilih</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notice */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-2.5 text-[11px] text-stone-600">
              <Clock className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
              <span>
                Setiap keluhan akan dievaluasi langsung oleh tim florist dan manajemen atelier. Kompensasi (voucher diskon, pengiriman ulang, atau refund) akan diproses sesuai kesepakatan resolusi.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-xs text-stone-600 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Mengirimkan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pengajuan Keluhan ⚡</span>
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
