'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, Trash2, Heart, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { getApiUrl } from '@/lib/api-client';
import { showMagicToast } from '@/lib/magic-motion';

export interface OccasionItem {
  id: string;
  user_phone: string;
  user_name: string;
  recipient_name: string;
  occasion_title: string;
  event_date: string;
  notes?: string | null;
  is_reminded?: boolean;
}

const OCCASION_PRESETS = [
  'Wisuda Sarjana / Diploma',
  'Ulang Tahun',
  'Anniversary / Hari Jadian',
  'Sidang Skripsi / Yudisium',
  'Hari Ibu / Hari Guru',
  'Valentine / Momen Kasih Sayang',
  'Lainnya',
];

export const OccasionCalendarWidget: React.FC = () => {
  const { user } = useAuthStore();
  const phone = user?.phone || '081938851834';
  const userName = user?.name || 'Pelanggan Chenille';

  const [occasions, setOccasions] = useState<OccasionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [recipientName, setRecipientName] = useState('');
  const [occasionTitle, setOccasionTitle] = useState(OCCASION_PRESETS[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');

  const fetchOccasions = useCallback(async () => {
    if (!phone) return;
    try {
      setIsLoading(true);
      const res = await fetch(getApiUrl(`/api/v1/occasions?phone=${encodeURIComponent(phone)}`));
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setOccasions(json.data);
        }
      }
    } catch (e) {
      console.warn('[OccasionCalendarWidget fetch error]', e);
    } finally {
      setIsLoading(false);
    }
  }, [phone]);

  useEffect(() => {
    fetchOccasions();
  }, [fetchOccasions]);

  const handleAddOccasion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !eventDate) {
      showMagicToast('Lengkapi Data', 'Nama penerima dan tanggal momen wajib diisi.', '⚠️');
      return;
    }

    const finalTitle = occasionTitle === 'Lainnya' && customTitle ? customTitle : occasionTitle;
    setIsAdding(true);

    try {
      const res = await fetch(getApiUrl('/api/v1/occasions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_phone: phone,
          user_name: userName,
          recipient_name: recipientName,
          occasion_title: finalTitle,
          event_date: eventDate,
          notes: notes || null,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showMagicToast(
          'Momen Spesial Disimpan! 🗓️',
          `Pengingat untuk ${recipientName} (${finalTitle}) berhasil dijadwalkan. Florist akan mengirim notifikasi H-3!`,
          '🌸'
        );
        setShowAddForm(false);
        setRecipientName('');
        setCustomTitle('');
        setNotes('');
        setEventDate('');
        fetchOccasions();
      } else {
        throw new Error(json.error || 'Gagal menyimpan momen spesial.');
      }
    } catch (err: any) {
      showMagicToast('Gagal Menyimpan', err.message || 'Silakan coba lagi.', '⚠️');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteOccasion = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/v1/occasions/${id}?phone=${encodeURIComponent(phone)}`), {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showMagicToast('Momen Dihapus', 'Jadwal pengingat telah dihapus dari kalender Anda.', '🗑️');
        fetchOccasions();
      }
    } catch (e) {
      console.warn('Could not delete occasion:', e);
    }
  };

  const calculateDaysLeft = (targetDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-stone-800">
                Kalender Momen Kasih & Wisuda (Occasions)
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                {occasions.length} Momen
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Catat hari wisuda teman, ulang tahun pasangan & keluarga agar tidak terlewat memesan buket H-3.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Tutup Form' : 'Tambah Momen'}</span>
        </button>
      </div>

      {/* Add Occasion Form */}
      {showAddForm && (
        <form onSubmit={handleAddOccasion} className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-4 animate-in fade-in">
          <div className="font-extrabold text-xs text-stone-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Jadwalkan Momen Kasih Baru</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Recipient */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-700">Nama Penerima / Teman</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Contoh: Dinda / Ibu / Kak Aris"
                required
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
              />
            </div>

            {/* Event Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-700">Tanggal Acara / Wisuda</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
              />
            </div>

            {/* Occasion Title Preset */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-700">Jenis Perayaan</label>
              <select
                value={occasionTitle}
                onChange={(e) => setOccasionTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-rose-500/20 focus:outline-none cursor-pointer"
              >
                {OCCASION_PRESETS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom title if preset is Lainnya */}
            {occasionTitle === 'Lainnya' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700">Nama Acara Kustom</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Misal: Perpisahan Magang"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] font-bold text-stone-700">Catatan Khusus Florist (Opsional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Warna kesukaan ungu pastel, ingin buket tulip 5 tangkai"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isAdding}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm shadow-rose-600/25 cursor-pointer disabled:opacity-50"
            >
              {isAdding ? 'Menyimpan...' : 'Simpan Momen'}
            </button>
          </div>
        </form>
      )}

      {/* Occasions List */}
      {occasions.length === 0 ? (
        <div className="p-8 text-center text-stone-400 space-y-2 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <Calendar className="w-8 h-8 mx-auto text-stone-300" />
          <div className="text-xs font-bold text-stone-700">Belum Ada Momen Spesial Tersimpan</div>
          <div className="text-[11px] max-w-sm mx-auto">
            Klik &ldquo;Tambah Momen&rdquo; untuk mendaftarkan jadwal wisuda teman atau ulang tahun orang tercinta.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {occasions.map((item) => {
            const daysLeft = calculateDaysLeft(item.event_date);
            const isUrgent = daysLeft >= 0 && daysLeft <= 7;
            const isPast = daysLeft < 0;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isUrgent
                    ? 'border-rose-300 bg-rose-50/40 shadow-xs'
                    : 'border-stone-200 bg-stone-50/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-stone-800 truncate">
                      {item.recipient_name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteOccasion(item.id)}
                      className="p-1 text-stone-300 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Hapus Momen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] font-bold text-rose-700">{item.occasion_title}</div>

                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      {new Date(item.event_date).toLocaleDateString('id-ID', {
                        dateStyle: 'medium',
                      })}
                    </span>
                  </div>

                  {item.notes && (
                    <div className="text-[10px] text-stone-500 bg-white/80 p-2 rounded-xl border border-stone-200/60 mt-1 italic">
                      &ldquo;{item.notes}&rdquo;
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isPast
                        ? 'bg-stone-200 text-stone-600'
                        : isUrgent
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isPast ? 'Selesai' : daysLeft === 0 ? 'Hari Ini! 🌸' : `H-${daysLeft} (${daysLeft} Hari Lagi)`}
                  </span>

                  {isUrgent && (
                    <span className="text-[10px] font-extrabold text-rose-600">
                      Rekomendasi PO H-3!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OccasionCalendarWidget;
