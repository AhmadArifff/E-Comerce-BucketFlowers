'use client';

import React, { useState } from 'react';
import { User, Sparkles, Edit3, Shield, Award } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { ProfileModal } from './ProfileModal';

export const MemberHeader: React.FC = () => {
  const { user, switchRole } = useAuthStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-500/15 relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform">
                {user.avatarEmoji || '🌸'}
              </div>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="absolute -bottom-1 -right-1 bg-white text-rose-600 p-1.5 rounded-full shadow-md hover:bg-rose-50 transition-all"
                title="Ganti Avatar Emoji"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{user.name}</h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                  {user.role === 'SUPER_ADMIN' ? 'Owner / Super Admin' : user.role === 'FLORIST_STAFF' ? 'Florist Staff' : 'Customer Member'}
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium">{user.email} • {user.phone}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] text-white/90">
                <span className="flex items-center gap-1 font-semibold">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Member Prioritas Atelier</span>
                </span>
                <span>•</span>
                <span className="font-semibold">Bebas Biaya Ambil COD UI Depok</span>
              </div>
            </div>
          </div>

          {/* Flower Points Badge & Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="bg-white/15 backdrop-blur-md border border-white/30 px-5 py-3 rounded-2xl text-center flex-1 sm:flex-none">
              <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold mb-0.5">
                <Sparkles className="w-4 h-4" />
                <span>Saldo Flower Points</span>
              </div>
              <div className="text-2xl font-black tracking-tight">
                {user.flowerPoints.toLocaleString('id-ID')}
              </div>
              <span className="text-[10px] text-rose-100 block">Setara diskon Rp {(user.flowerPoints * 100).toLocaleString('id-ID')}</span>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil</span>
            </button>
          </div>
        </div>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};
