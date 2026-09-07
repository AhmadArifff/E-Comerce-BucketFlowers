'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Crown,
  CheckCircle2,
  AlertCircle,
  Bell,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore, type ThemeId } from '@/stores/useThemeStore';

interface ThemeMeta {
  icon: string;
  name: string;
  sub: string;
  badge: string;
  title: string;
  desc: string;
  quote: string;
  author: string;
  showcaseBg: string;
  patternColor: string;
  accentText: string;
  badgeBg: string;
  cardBg: string;
  borderColor: string;
  titleFont: string;
}

const THEME_METADATA: Record<ThemeId, ThemeMeta> = {
  'tema-a': {
    icon: '🌸',
    name: 'Korean Pastel',
    sub: 'Korean Pastel Atelier',
    badge: '✨ Handcrafted Velvet Art',
    title: 'Keindahan Buket yang Bertahan Selamanya.',
    desc: 'Masuk untuk memantau proses perangkaian buket kawat bulu pastel Anda secara real-time, mengumpulkan Flower Points, dan menikmati kemudahan belanja.',
    quote:
      '"Buket tulip kawat bulu pastelnya rapi banget dan bunganya awet selamanya tanpa takut layu pas wisuda! Customer service responsif banget."',
    author: 'Sarah Amalia — Wisudawan UI 2026',
    showcaseBg: 'from-rose-100/90 via-pink-50/70 to-rose-50/40 text-stone-800',
    patternColor: '#FECDD3',
    accentText: 'text-rose-600',
    badgeBg: 'bg-white border-rose-200 text-rose-600',
    cardBg: 'bg-white border-rose-100 text-stone-800',
    borderColor: 'border-rose-100',
    titleFont: 'font-heading-a',
  },
  'tema-b': {
    icon: '🌹',
    name: 'Modern Romantic',
    sub: 'Modern Romantic & Editorial',
    badge: '✦ Haute Florist Atelier Privé',
    title: 'Kemewahan Abadi dalam Setiap Kelopak Beludru.',
    desc: 'Akses eksklusif koleksi Modern Romantic velvet buket, konsultasi concierge pribadi, serta pemesanan hadiah anniversary dan wisuda mewah.',
    quote:
      '"Kombinasi velvet rose burgundy dan wax seal monogram emasnya luar biasa mewah. Kado anniversary paling berkesan."',
    author: 'Valerie & Adrian — Jakarta',
    showcaseBg: 'from-[#2D1427] via-[#1F0D1B] to-[#140911] text-[#FDF4E3]',
    patternColor: 'rgba(212, 175, 55, 0.25)',
    accentText: 'text-amber-400',
    badgeBg: 'bg-rose-950/80 border-amber-500/40 text-amber-300',
    cardBg: 'bg-[#22101E] border-[#4A203E] text-[#FDF4E3]',
    borderColor: 'border-[#4A203E]',
    titleFont: 'font-heading-b',
  },
  'tema-c': {
    icon: '🍭',
    name: 'Playful Kawaii',
    sub: 'Playful Pastel & Kawaii Dream',
    badge: '🎉 Super Cute Handcrafted Flowers',
    title: 'Rangkaian Karakter Gemas Penuh Keceriaan!',
    desc: 'Bikin buket kawat bulu beruang toga, karakter kartun, dan permen pastel favoritmu! Lacak kiriman paket lucu kamu langsung dari dasbor.',
    quote:
      '"Boneka beruang toga wisudanya gemes bangettt! Bikin temen-temen satu angkatan pada nanyain pesen di mana."',
    author: 'Nabila Putri — Kampus Depok',
    showcaseBg: 'from-[#FFEBF0] via-[#FFF5F7] to-[#FEF9C3] text-stone-800',
    patternColor: '#FFCCD5',
    accentText: 'text-pink-600',
    badgeBg: 'bg-white border-pink-200 text-pink-600',
    cardBg: 'bg-white border-pink-100 text-stone-800',
    borderColor: 'border-pink-100',
    titleFont: 'font-heading-c',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('081298317721');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    desc: string;
    type: 'info' | 'success' | 'warning';
  } | null>(null);

  // Sync data-theme attribute on client
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showToast = (title: string, desc: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToast({ show: true, title, desc, type });
    setTimeout(() => {
      setToast((prev) => (prev?.title === title ? null : prev));
    }, 3500);
  };

  const handleThemeChange = (newTheme: ThemeId) => {
    setTheme(newTheme);
  };

  const quickFillMember = () => {
    setMode('LOGIN');
    setEmailOrPhone('081298317721');
    setPassword('password123');
    showToast('Kredensial Member Diisi', 'Akun Sarah Amalia (Member Pelanggan Gold) siap login.', 'info');
  };

  const quickFillAdmin = () => {
    setMode('LOGIN');
    setEmailOrPhone('admin@chenilleatelier.com');
    setPassword('adminsecret2026');
    showToast('Kredensial Admin Diisi', 'Akun Rania Azzahra (Super Admin Florist) siap login.', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const identifier = emailOrPhone.trim();

    if (mode === 'REGISTER') {
      const name = fullName.trim() || 'Pelanggan Baru';
      showToast('Pendaftaran Berhasil! 🎉', `Selamat datang ${name}, akun member berhasil dibuat.`, 'success');
      login('CUSTOMER_MEMBER');
      setTimeout(() => {
        setIsLoading(false);
        router.push('/portal');
      }, 1000);
      return;
    }

    // Check if Admin or Member
    const isAdmin =
      identifier.toLowerCase().includes('admin') ||
      identifier.toLowerCase().includes('rania') ||
      identifier.toLowerCase().includes('staff');

    if (isAdmin) {
      showToast('Login Super Admin Berhasil', 'Mengarahkan ke Dashboard Operasional Atelier...', 'success');
      login('SUPER_ADMIN');
      setTimeout(() => {
        setIsLoading(false);
        router.push('/admin');
      }, 800);
    } else {
      showToast('Login Member Berhasil', 'Selamat datang Kak Sarah Amalia! Membuka portal pelanggan...', 'success');
      login('CUSTOMER_MEMBER');
      setTimeout(() => {
        setIsLoading(false);
        router.push('/portal');
      }, 800);
    }
  };

  const currentMeta = THEME_METADATA[theme] || THEME_METADATA['tema-a'];

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text-main flex flex-col transition-colors duration-300">
      {/* TOP BAR WITH THEME PRESET SWITCHER */}
      <header className="px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-theme-border bg-theme-surface sticky top-0 z-50 shadow-2xs">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-theme-text-main hover:text-theme-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Etalase Toko</span>
        </Link>

        {/* THEME PRESET SWITCHER PILLS */}
        <div className="flex items-center gap-1.5 p-1 bg-theme-surface-subtle border border-theme-border rounded-full">
          <button
            type="button"
            onClick={() => handleThemeChange('tema-a')}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              theme === 'tema-a'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-theme-text-muted hover:text-theme-text-main'
            }`}
          >
            <span>🌸</span>
            <span className="hidden sm:inline">Korean Pastel</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('tema-b')}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              theme === 'tema-b'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'text-theme-text-muted hover:text-theme-text-main'
            }`}
          >
            <span>🌹</span>
            <span className="hidden sm:inline">Modern Romantic</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('tema-c')}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              theme === 'tema-c'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-theme-text-muted hover:text-theme-text-main'
            }`}
          >
            <span>🍭</span>
            <span className="hidden sm:inline">Playful Kawaii</span>
          </button>
        </div>
      </header>

      {/* MAIN AUTH CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full bg-theme-surface border border-theme-border rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] min-h-[600px] transition-all duration-300">
          {/* LEFT COLUMN: BRAND VISUAL SHOWCASE */}
          <div
            className={`hidden lg:flex p-8 sm:p-10 flex-col justify-between border-b lg:border-b-0 lg:border-r border-theme-border relative bg-gradient-to-br ${currentMeta.showcaseBg} overflow-hidden`}
          >
            {/* Pattern Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: `radial-gradient(${currentMeta.patternColor} 1.5px, transparent 1.5px)`,
                backgroundSize: '16px 16px',
              }}
            />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              {/* Top Brand Header */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-sm text-2xl flex items-center justify-center shadow-md border border-theme-border">
                  {currentMeta.icon}
                </div>
                <div>
                  <div className="font-extrabold text-base tracking-tight text-current">
                    Chenille Flowers
                  </div>
                  <div className={`text-[11px] font-bold uppercase tracking-wider ${currentMeta.accentText}`}>
                    {currentMeta.sub}
                  </div>
                </div>
              </div>

              {/* Showcase Hero Body */}
              <div className="my-auto space-y-3.5">
                <div className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border shadow-xs ${currentMeta.badgeBg}`}>
                  <span>{currentMeta.badge}</span>
                </div>

                <h2 className={`text-2xl sm:text-3xl font-black leading-tight tracking-tight ${currentMeta.titleFont}`}>
                  {currentMeta.title}
                </h2>

                <p className="text-xs sm:text-sm opacity-90 leading-relaxed max-w-md">
                  {currentMeta.desc}
                </p>
              </div>

              {/* Testimonial Quote Card */}
              <div className={`p-4 rounded-2xl border shadow-sm ${currentMeta.cardBg}`}>
                <p className="text-xs italic leading-relaxed">
                  {currentMeta.quote}
                </p>
                <div className={`mt-2 flex items-center gap-1.5 text-xs font-bold ${currentMeta.accentText}`}>
                  <span>⭐️⭐️⭐️⭐️⭐️</span>
                  <span>{currentMeta.author}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE FORM */}
          <div className="p-6 sm:p-10 flex flex-col justify-center bg-theme-surface">
            {/* TABS: MASUK vs DAFTAR */}
            <div className="flex p-1 bg-theme-surface-subtle border border-theme-border rounded-full mb-6">
              <button
                type="button"
                onClick={() => setMode('LOGIN')}
                className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all ${
                  mode === 'LOGIN'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-theme-text-muted hover:text-theme-text-main'
                }`}
              >
                Masuk (Login)
              </button>

              <button
                type="button"
                onClick={() => setMode('REGISTER')}
                className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all ${
                  mode === 'REGISTER'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-theme-text-muted hover:text-theme-text-main'
                }`}
              >
                Daftar Akun Baru
              </button>
            </div>

            {/* Form Title & Subtitle */}
            <div className="mb-5">
              <h3 className="text-xl sm:text-2xl font-black text-theme-text-main tracking-tight">
                {mode === 'LOGIN' ? 'Selamat Datang Kembali 👋' : 'Daftar Akun Member 🌸'}
              </h3>
              <p className="text-xs text-theme-text-muted mt-1">
                {mode === 'LOGIN'
                  ? 'Silakan masuk ke akun member atau panel pengrajin Anda.'
                  : 'Dapatkan 500 Flower Points selamat datang & simpan riwayat pesanan.'}
              </p>
            </div>

            {/* 1-CLICK DEMO SHORTCUTS */}
            <div className="p-3.5 bg-theme-surface-subtle border border-dashed border-theme-primary/30 rounded-2xl mb-5 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-theme-primary uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                <span>Akses Cepat Pengujian Demo:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={quickFillMember}
                  className="flex items-center gap-2 p-2 bg-theme-surface hover:bg-theme-surface-subtle border border-theme-border rounded-xl text-xs font-bold text-theme-text-main hover:border-theme-primary hover:text-theme-primary transition-all active:scale-98 text-left"
                >
                  <span>🌸</span>
                  <span className="truncate">Member Pelanggan (Sarah)</span>
                </button>
                <button
                  type="button"
                  onClick={quickFillAdmin}
                  className="flex items-center gap-2 p-2 bg-theme-surface hover:bg-theme-surface-subtle border border-theme-border rounded-xl text-xs font-bold text-theme-text-main hover:border-theme-primary hover:text-theme-primary transition-all active:scale-98 text-left"
                >
                  <span>👑</span>
                  <span className="truncate">Super Admin (Rania)</span>
                </button>
              </div>
            </div>

            {/* AUTH FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field only in Register mode */}
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-bold text-theme-text-main mb-1.5">
                    Nama Lengkap:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-theme-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Sarah Amalia"
                      required={mode === 'REGISTER'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text-main text-xs font-medium focus:outline-none focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/10 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email / Phone Field */}
              <div>
                <label className="block text-xs font-bold text-theme-text-main mb-1.5">
                  Email atau Nomor WhatsApp:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-theme-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="081298317721 atau email@anda.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text-main text-xs font-medium focus:outline-none focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/10 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-theme-text-main mb-1.5">
                  Kata Sandi:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-theme-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text-main text-xs font-medium focus:outline-none focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-text-main p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options: Remember Me & Forgot Password */}
              {mode === 'LOGIN' && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-theme-text-muted cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-theme-border text-theme-primary focus:ring-theme-primary/20"
                    />
                    <span>Ingat saya di perangkat ini</span>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        'Reset Password',
                        'Tautan pemulihan kata sandi telah dikirimkan via WhatsApp.',
                        'info'
                      )
                    }
                    className="text-theme-primary font-bold hover:underline"
                  >
                    Lupa Sandi?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{mode === 'LOGIN' ? 'Masuk Sekarang' : 'Daftar Akun Baru'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toast.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <Bell className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div className="text-xs">
            <div className="font-extrabold">{toast.title}</div>
            <div className="text-stone-300 text-[11px] mt-0.5">{toast.desc}</div>
          </div>
        </div>
      )}
    </div>
  );
}
