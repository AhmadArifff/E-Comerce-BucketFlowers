'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Shield, User, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, switchRole } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('siti.anggraini@student.ui.ac.id');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(user?.role || 'CUSTOMER_MEMBER');
      setIsLoading(false);
      if (user?.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else {
        router.push('/portal');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/60 via-pink-50/30 to-amber-50/40 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Etalase Toko</span>
        </Link>

        {/* Theme pill indicator */}
        <div className="flex gap-1 bg-white p-1 rounded-full border border-rose-100 shadow-xs text-xs font-bold">
          <button
            onClick={() => setTheme('tema-a')}
            className={`px-2.5 py-0.5 rounded-full ${theme === 'tema-a' ? 'bg-rose-600 text-white' : 'text-stone-500'}`}
          >
            Pastel
          </button>
          <button
            onClick={() => setTheme('tema-b')}
            className={`px-2.5 py-0.5 rounded-full ${theme === 'tema-b' ? 'bg-rose-900 text-white' : 'text-stone-500'}`}
          >
            Velvet
          </button>
          <button
            onClick={() => setTheme('tema-c')}
            className={`px-2.5 py-0.5 rounded-full ${theme === 'tema-c' ? 'bg-orange-600 text-white' : 'text-stone-500'}`}
          >
            Kawaii
          </button>
        </div>
      </div>

      {/* Auth Card Container */}
      <div className="max-w-md w-full mx-auto my-8 bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-md shadow-rose-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight">
            {mode === 'LOGIN' ? 'Masuk ke Akun Atelier' : 'Daftar Member Baru'}
          </h1>
          <p className="text-xs text-stone-500">
            {mode === 'LOGIN'
              ? 'Akses pelacakan pesanan live, voucher wisuda, & Flower Points.'
              : 'Dapatkan 50 Flower Points gratis untuk pendaftaran member pertama!'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-stone-100 rounded-2xl">
          <button
            onClick={() => setMode('LOGIN')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'LOGIN' ? 'bg-white text-rose-600 shadow-xs' : 'text-stone-500'
            }`}
          >
            Masuk Akun
          </button>
          <button
            onClick={() => setMode('REGISTER')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'REGISTER' ? 'bg-white text-rose-600 shadow-xs' : 'text-stone-500'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Quick Role Switcher for Demo / Pair Programming */}
        <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-2">
          <div className="text-[11px] font-bold text-rose-800 flex items-center justify-between">
            <span>Uji Peran Akun Instan (Demo RBAC):</span>
            <span className="text-[9px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded-full font-black">
              Pilih Cepat
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                switchRole('CUSTOMER_MEMBER');
                setEmail('siti.anggraini@student.ui.ac.id');
              }}
              className={`p-2 rounded-xl text-[11px] font-bold transition-all ${
                user?.role === 'CUSTOMER_MEMBER'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              🌸 Member
            </button>
            <button
              type="button"
              onClick={() => {
                switchRole('FLORIST_STAFF');
                setEmail('staff@chenilleatelier.com');
              }}
              className={`p-2 rounded-xl text-[11px] font-bold transition-all ${
                user?.role === 'FLORIST_STAFF'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              🌷 Florist
            </button>
            <button
              type="button"
              onClick={() => {
                switchRole('SUPER_ADMIN');
                setEmail('admin@chenilleatelier.com');
              }}
              className={`p-2 rounded-xl text-[11px] font-bold transition-all ${
                user?.role === 'SUPER_ADMIN'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              👑 Owner
            </button>
          </div>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">
              Email atau No. WhatsApp
            </label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-stone-400 hover:text-stone-600 absolute right-3 top-2.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'LOGIN' ? 'Masuk Sekarang' : 'Daftar & Dapatkan Poin'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-[11px] text-stone-400">
        © {new Date().getFullYear()} Aesthetic Chenille Flowers Atelier. Sistem Autentikasi Terenkripsi.
      </div>
    </div>
  );
}
