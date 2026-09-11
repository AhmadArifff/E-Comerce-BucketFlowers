'use client';

import React, { useState } from 'react';
import { KeyRound, X, Check, Lock, ShieldCheck } from 'lucide-react';
import { showMagicToast } from '@/lib/magic-motion';

interface CustomerChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerChangePasswordModal: React.FC<CustomerChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass) {
      showMagicToast('Kata Sandi Wajib Diisi ⚠️', 'Masukkan kata sandi akun saat ini.', '❌');
      return;
    }
    if (newPass.length < 8) {
      showMagicToast('Kata Sandi Kurang Panjang ⚠️', 'Kata sandi baru minimal 8 karakter.', '❌');
      return;
    }
    if (newPass !== confirmPass) {
      showMagicToast('Kata Sandi Tidak Cocok ⚠️', 'Konfirmasi kata sandi baru harus sama persis.', '❌');
      return;
    }

    setOldPass('');
    setNewPass('');
    setConfirmPass('');
    onClose();
    showMagicToast('Kata Sandi Diperbarui! 🔑', 'Kredensial login akun Anda berhasil diubah dengan aman.', '✅');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-800 text-sm">Ganti Kata Sandi Pelanggan</h3>
              <p className="text-[10px] text-stone-400">Lindungi keamanan akun dan riwayat pesanan Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Kata Sandi Saat Ini</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Kata Sandi Baru</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Konfirmasi Kata Sandi Baru</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all"
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
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Perbarui Kata Sandi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
