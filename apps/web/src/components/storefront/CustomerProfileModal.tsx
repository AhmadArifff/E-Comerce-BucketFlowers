'use client';

import React, { useState, useEffect } from 'react';
import { User, X, Mail, Phone, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { showMagicToast } from '@/lib/magic-motion';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showMagicToast('Nama Lengkap Wajib Diisi ⚠️', 'Mohon masukkan nama akun Anda.', '❌');
      return;
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    onClose();
    showMagicToast('Profil Diperbarui! 👤', 'Data akun pelanggan Anda berhasil disimpan.', '✨');
  };

  const initials = user.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-800 text-sm">Profil Pelanggan & Akun</h3>
              <p className="text-[10px] text-stone-400">Kelola identitas dan alamat pengiriman pesanan Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Badge Card */}
        <div className="flex items-center gap-3 p-3.5 bg-rose-50/40 rounded-2xl border border-rose-100/80">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-lg font-black shadow-sm shadow-rose-500/20 flex-shrink-0">
            {user.avatarEmoji || initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-black text-stone-800 text-sm truncate">{user.name}</div>
            <div className="text-[11px] text-stone-500 truncate">{user.email}</div>
            <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200">
              {user.role === 'SUPER_ADMIN' ? '👑 Super Admin' : '🌸 Member Atelier Aktif'}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Ahmad Arif"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Nomor WhatsApp / HP</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081298765432"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Alamat Pengiriman Utama</label>
            <div className="relative">
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jalan, No. Rumah, Patokan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
