'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Star,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  Heart,
  Award,
} from 'lucide-react';
import { getApiUrl } from '@/lib/api-client';
import { showMagicToast } from '@/lib/magic-motion';

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  customerName?: string;
  productName?: string;
  productId?: string;
  onSuccess?: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Kurang Memuaskan 😞',
  2: 'Cukup Baik 🙂',
  3: 'Bagus & Rapi 😊',
  4: 'Sangat Cantik & Suka Banget! 🥰',
  5: 'Sempurna! Fluffy & Bikin Terharu! 💖✨',
};

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  isOpen,
  onClose,
  orderId,
  customerName = '',
  productName = 'Buket Bunga Kawat Bulu',
  productId,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [name, setName] = useState<string>(customerName);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [pointsAwarded, setPointsAwarded] = useState<number>(25);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Hanya berkas gambar (JPG, PNG, WEBP) yang dapat diunggah.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Ukuran file maksimal 5 MB.');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPhotoPreview(localUrl);
    setIsUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch(getApiUrl('/api/v1/reviews/upload-photo'), {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.photo_url) {
        setUploadedUrl(data.photo_url);
        showMagicToast('Foto Terunggah! 📸', 'Foto buket berhasil disiapkan untuk ulasan.', '✨');
      } else {
        setErrorMessage(data.error || 'Gagal mengunggah foto. Anda tetap dapat mengirim ulasan tanpa foto.');
      }
    } catch {
      setErrorMessage('Koneksi upload foto gagal. Ulasan tetap dapat dikirim tanpa foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage('Mohon tulis ulasan pengalaman Anda tentang buket ini.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch(getApiUrl('/api/v1/reviews'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          product_id: productId || null,
          rating,
          comment: comment.trim(),
          photo_url: uploadedUrl || null,
          customer_name: name.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        setPointsAwarded(data.pointsAwarded || 25);
        showMagicToast(
          'Ulasan Terkirim! 🌟',
          `Terima kasih! Bonus +${data.pointsAwarded || 25} Flower Points telah ditambahkan.`,
          '🌸'
        );
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(data.error || 'Gagal mengirim ulasan. Silakan coba beberapa saat lagi.');
      }
    } catch {
      setErrorMessage('Terjadi gangguan koneksi jaringan saat mengirim ulasan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setComment('');
    setPhotoPreview(null);
    setUploadedUrl('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 transition-all duration-300 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-rose-100 flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="p-6 border-b border-rose-100/80 bg-gradient-to-r from-rose-50/60 via-white to-pink-50/40 relative">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-all cursor-pointer hover:bg-stone-50"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
              <Star className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight font-heading">
                Ulasan Buket & Bintang
              </h2>
              <p className="text-xs text-stone-500">
                Invoice: <strong className="text-rose-600">{orderId}</strong> • {productName}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-stone-900">
                  Ulasan Berhasil Dikirim! 🌸
                </h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Terima kasih atas apresiasinya. Ulasan dan foto buketmu sangat berarti untuk mendukung karya pengrajin Chenille Atelier Depok.
                </p>
              </div>

              {pointsAwarded > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black shadow-2xs">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>+{pointsAwarded} Flower Points Telah Dikreditkan ke Akunmu</span>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Tutup & Kembali ke Portal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* STAR RATING PICKER */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-center space-y-2">
                <label className="text-xs font-extrabold text-stone-700 block uppercase tracking-wider">
                  Beri Kepuasan Kerapian Buket:
                </label>
                
                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeVal = hoverRating || rating;
                    const isFilled = star <= activeVal;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-2xl sm:text-3xl transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-extrabold text-rose-600 transition-all h-4">
                  {RATING_LABELS[hoverRating || rating]}
                </div>
              </div>

              {/* CUSTOMER NAME INPUT */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Nama Anda (Ditampilkan di Ulasan Publik):
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Putri Aulia (Wisudawan UI)"
                  className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-stone-800"
                />
              </div>

              {/* REVIEW TEXTAREA */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Komentar Ulasan Jujur: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan pengalamanmu... Apakah kawat bulunya fluffy dan tebal? Apakah warnanya cocok untuk foto wisuda di kampus? Apakah bunganya awet sampai ke tangan bestie?"
                  className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed text-stone-800 resize-none font-normal"
                  required
                />
              </div>

              {/* PHOTO UPLOAD DROPZONE */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">
                  Unggah Foto Buket Asli (Opsional tapi Sangat Direkomendasikan):
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-rose-200 bg-stone-50 flex items-center justify-center max-h-48 group">
                    <img
                      src={photoPreview}
                      alt="Preview Buket Anda"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-stone-900 rounded-xl text-xs font-bold shadow-md hover:bg-stone-100"
                      >
                        Ganti Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setUploadedUrl('');
                        }}
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-700"
                      >
                        Hapus
                      </button>
                    </div>

                    {isUploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center gap-2 text-xs font-bold text-rose-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengunggah foto buket...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/30 hover:bg-rose-50/60 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="w-9 h-9 mx-auto rounded-xl bg-white border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-extrabold text-stone-800">
                      Klik untuk Unggah Foto Buketmu
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Format JPG, PNG, atau WEBP (Maksimal 5 MB). Foto akan ditampilkan di galeri lookbook!
                    </p>
                  </div>
                )}
              </div>

              {/* REWARD POINTS CALLOUT */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
                <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Bonus Komunitas:</strong> Dapatkan <strong>+25 Flower Points</strong> secara instan untuk diskon pesanan buket berikutnya!
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim Ulasan...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Kirim Ulasan Bintang 🌸</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
