'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, UserProfile } from '@chenille/shared';
import { getApiUrl } from '@/lib/api-client';
import { useUserAuditStore } from './useUserAuditStore';

export type LogoutReason = 'MANUAL' | 'TIMEOUT_15MIN' | 'FORCE_LOGOUT_ADMIN';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  lastActivity: number | null;
  lastLogoutReason: LogoutReason | null;
  recordActivity: () => void;
  switchRole: (role: Role) => void;
  updateAvatarEmoji: (emoji: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  login: (role?: Role, customProfile?: Partial<UserProfile>) => void;
  logout: (reason?: LogoutReason) => void;
}

export const DEFAULT_MEMBER: UserProfile = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  name: 'Annisa Larasati (Member Mahasiswi UI)',
  email: 'nisa.mahasiswi@gmail.com',
  phone: '081938851834',
  role: 'CUSTOMER_MEMBER',
  avatarEmoji: '🌸',
  flowerPoints: 350,
};

export const DEFAULT_ADMIN: UserProfile = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'Ahmad Arif (Owner Atelier)',
  email: 'ahmad@chenilleatelier.com',
  phone: '081234567890',
  role: 'SUPER_ADMIN',
  avatarEmoji: '👑',
  flowerPoints: 1500,
};

export const DEFAULT_FLORIST: UserProfile = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  name: 'Dewi Sartika (Head Florist)',
  email: 'florist.dewi@chenilleatelier.com',
  phone: '081345678901',
  role: 'FLORIST_STAFF',
  avatarEmoji: '🌷',
  flowerPoints: 400,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Strict Security: Default visitor is GUEST (No auto-login as Ahmad/Anyone)
      user: null,
      isAuthenticated: false,
      lastActivity: null,
      lastLogoutReason: null,

      recordActivity: () => {
        const now = Date.now();
        set({ lastActivity: now });
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('chenille_last_activity', now.toString());
          } catch (e) {}
        }
      },

      switchRole: (role) => {
        const now = Date.now();
        let targetUser: UserProfile;
        if (role === 'SUPER_ADMIN') targetUser = DEFAULT_ADMIN;
        else if (role === 'FLORIST_STAFF') targetUser = DEFAULT_FLORIST;
        else targetUser = DEFAULT_MEMBER;

        set({ user: targetUser, isAuthenticated: true, lastActivity: now, lastLogoutReason: null });
        if (typeof window !== 'undefined') {
          localStorage.setItem('chenille_last_activity', now.toString());
          try {
            localStorage.setItem('chenille_user_session_sync', now.toString());
          } catch (e) {}

          fetch(getApiUrl('/api/v1/auth/login-activity'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: targetUser.id }),
          }).catch(() => {});
        }

        useUserAuditStore.getState().updateUserOnlineStatus(targetUser.id, true);
        useUserAuditStore.getState().recordAuditLog({
          userId: targetUser.id,
          userName: targetUser.name,
          userRole: targetUser.role,
          eventType: 'LOGIN_SUCCESS',
          device: typeof navigator !== 'undefined' ? `${navigator.platform || 'PC'} • Browser` : 'Web Browser',
          ipAddress: '180.252.164.21 (Depok)',
          notes: `Beralih peran menjadi ${targetUser.role} via selector akun.`,
        });
      },

      updateAvatarEmoji: (emoji) => {
        set((state) => (state.user ? { user: { ...state.user, avatarEmoji: emoji } } : state));
      },

      updateProfile: (data) => {
        set((state) => (state.user ? { user: { ...state.user, ...data } } : state));
      },

      login: (role = 'CUSTOMER_MEMBER', customProfile) => {
        const now = Date.now();
        let targetUser: UserProfile;
        if (role === 'SUPER_ADMIN') targetUser = DEFAULT_ADMIN;
        else if (role === 'FLORIST_STAFF') targetUser = DEFAULT_FLORIST;
        else targetUser = DEFAULT_MEMBER;

        if (customProfile) {
          targetUser = { ...targetUser, ...customProfile };
        }

        set({
          user: targetUser,
          isAuthenticated: true,
          lastActivity: now,
          lastLogoutReason: null,
        });

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('chenille_last_activity', now.toString());
          } catch (e) {}
        }

        // Record to User Session Audit Log Stream
        useUserAuditStore.getState().updateUserOnlineStatus(targetUser.id, true);
        useUserAuditStore.getState().recordAuditLog({
          userId: targetUser.id,
          userName: targetUser.name,
          userRole: targetUser.role,
          eventType: 'LOGIN_SUCCESS',
          device: typeof navigator !== 'undefined' ? `${navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop'} (${navigator.userAgent.split(' ')[0]})` : 'Browser',
          ipAddress: '180.252.164.21 (Depok)',
          notes: `Login berhasil sebagai ${targetUser.role}. Sesi 15 menit aktif dimulai.`,
        });

        // Sync online status to Supabase PostgreSQL & Broadcast cross-tab sync
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('chenille_user_session_sync', now.toString());
          } catch (e) {}

          fetch(getApiUrl('/api/v1/auth/login-activity'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: targetUser.id }),
          }).catch(() => {});
        }
      },

      logout: (reason = 'MANUAL') => {
        const currentUser = get().user;
        const now = Date.now();

        if (currentUser) {
          useUserAuditStore.getState().updateUserOnlineStatus(currentUser.id, false);
          useUserAuditStore.getState().recordAuditLog({
            userId: currentUser.id,
            userName: currentUser.name,
            userRole: currentUser.role,
            eventType: reason === 'TIMEOUT_15MIN' ? 'LOGOUT_TIMEOUT_15MIN' : reason === 'FORCE_LOGOUT_ADMIN' ? 'FORCE_LOGOUT_ADMIN' : 'LOGOUT_MANUAL',
            device: typeof navigator !== 'undefined' ? `${navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop'}` : 'Browser',
            ipAddress: '180.252.164.21 (Depok)',
            notes:
              reason === 'TIMEOUT_15MIN'
                ? 'Sesi ditutup otomatis oleh sistem setelah 15 menit tanpa aktivitas interaksi mouse/keyboard.'
                : reason === 'FORCE_LOGOUT_ADMIN'
                ? 'Sesi diputuskan paksa oleh Admin dari panel pengawasan pengguna.'
                : 'Pengguna melakukan logout manual secara aman.',
            sessionDurationMinutes: get().lastActivity ? Math.round((now - (get().lastActivity || now)) / 60000) : 0,
          });

          // Notify Supabase backend that user is offline
          if (typeof window !== 'undefined') {
            fetch(getApiUrl('/api/v1/auth/logout-activity'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: currentUser.id }),
            }).catch(() => {});
          }
        }

        set({
          user: null,
          isAuthenticated: false,
          lastActivity: null,
          lastLogoutReason: reason,
        });

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('chenille_user_session_sync', now.toString());
            localStorage.removeItem('chenille_last_activity');
          } catch (e) {}
        }
      },
    }),
    {
      name: 'chenille_auth_storage',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const now = Date.now();
        const maxInactive = 15 * 60 * 1000;
        // Inactivity Check: Auto-expire session if lastActivity is older than 15 minutes or missing
        if (!state.lastActivity || now - state.lastActivity > maxInactive) {
          state.user = null;
          state.isAuthenticated = false;
          state.lastActivity = null;
          state.lastLogoutReason = 'TIMEOUT_15MIN';
        }
      },
    }
  )
);
