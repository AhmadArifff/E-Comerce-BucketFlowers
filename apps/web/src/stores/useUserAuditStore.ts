'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '@chenille/shared';
import { getApiUrl } from '@/lib/api-client';

export interface UserSessionItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarEmoji: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED';
  isOnline: boolean;
  lastActiveText: string;
  lastActiveTimestamp: number;
  currentDevice: string;
  ipAddress: string;
  totalOrders?: number;
  flowerPoints?: number;
}

export interface SessionAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: Role;
  eventType:
    | 'LOGIN_SUCCESS'
    | 'LOGOUT_MANUAL'
    | 'LOGOUT_TIMEOUT_15MIN'
    | 'FORCE_LOGOUT_ADMIN'
    | 'LOGIN_FAILED';
  device: string;
  ipAddress: string;
  notes: string;
  sessionDurationMinutes?: number;
}

interface UserAuditState {
  users: UserSessionItem[];
  auditLogs: SessionAuditLog[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  recordAuditLog: (log: Omit<SessionAuditLog, 'id' | 'timestamp'>) => void;
  updateUserOnlineStatus: (userId: string, isOnline: boolean, device?: string) => void;
  forceLogoutUser: (userId: string) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
  resetPasswordRequest: (userId: string) => void;
}

export const useUserAuditStore = create<UserAuditState>()(
  persist(
    (set, get) => ({
      users: [],
      auditLogs: [],
      isLoading: false,

      fetchUsers: async () => {
        try {
          set({ isLoading: true });
          const res = await fetch(getApiUrl('/api/v1/admin/users'));
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            set({ users: json.data, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (err) {
          console.error('[UserAuditStore] Gagal memuat pengguna dari Supabase:', err);
          set({ isLoading: false });
        }
      },

      fetchAuditLogs: async () => {
        try {
          const res = await fetch(getApiUrl('/api/v1/admin/users/audit-logs'));
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            set({ auditLogs: json.data });
          }
        } catch (err) {
          console.error('[UserAuditStore] Gagal memuat log audit dari Supabase:', err);
        }
      },

      recordAuditLog: (log) => {
        const newLog: SessionAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(new Date()),
          ...log,
        };

        // Optimistic update
        set((state) => ({
          auditLogs: [newLog, ...state.auditLogs].slice(0, 100),
        }));

        // Persist to Supabase backend asynchronously
        fetch(getApiUrl('/api/v1/admin/users/audit-logs'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log),
        }).catch((err) => {
          console.warn('[UserAuditStore] Gagal menyimpan log audit ke Supabase:', err);
        });
      },

      updateUserOnlineStatus: (userId, isOnline, device) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  isOnline,
                  lastActiveText: isOnline ? 'Online Sekarang' : 'Baru saja',
                  lastActiveTimestamp: Date.now(),
                  ...(device ? { currentDevice: device } : {}),
                }
              : u
          ),
        }));
      },

      forceLogoutUser: async (userId) => {
        // 1. Broadcast force logout event to localStorage for other tabs
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              'chenille_force_logout_event',
              JSON.stringify({ userId, timestamp: Date.now() })
            );
          } catch (e) {}
        }

        // 2. Optimistic update in table
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  isOnline: false,
                  lastActiveText: 'Dikeluarkan paksa oleh Admin',
                  lastActiveTimestamp: Date.now(),
                }
              : u
          ),
        }));

        // 3. If target user is the currently active user on this window, terminate session immediately
        if (typeof window !== 'undefined') {
          try {
            const rawAuth = localStorage.getItem('chenille_auth_storage');
            if (rawAuth) {
              const parsed = JSON.parse(rawAuth);
              if (parsed?.state?.user?.id === userId) {
                localStorage.removeItem('chenille_auth_storage');
                localStorage.removeItem('chenille_last_activity');
                window.location.href = '/login?reason=force_logout';
                return;
              }
            }
          } catch (e) {}
        }

        try {
          await fetch(getApiUrl(`/api/v1/admin/users/${userId}/force-logout`), {
            method: 'POST',
          });
          // Refresh logs from Supabase
          get().fetchAuditLogs();
        } catch (err) {
          console.error('[UserAuditStore] Gagal force logout di Supabase:', err);
        }
      },

      toggleUserStatus: async (userId) => {
        const target = get().users.find((u) => u.id === userId);
        if (!target) return;
        const nextStatus = target.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';

        // Optimistic update
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  status: nextStatus,
                  isOnline: nextStatus === 'ACTIVE' ? u.isOnline : false,
                }
              : u
          ),
        }));

        try {
          await fetch(getApiUrl(`/api/v1/admin/users/${userId}/status`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: nextStatus }),
          });
        } catch (err) {
          console.error('[UserAuditStore] Gagal toggle status di Supabase:', err);
        }
      },

      resetPasswordRequest: (userId) => {
        const target = get().users.find((u) => u.id === userId);
        const resetLog: SessionAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(new Date()),
          userId,
          userName: target?.name || 'Pengguna',
          userRole: target?.role || 'CUSTOMER_MEMBER',
          eventType: 'LOGIN_FAILED',
          device: target?.currentDevice || 'System Admin Panel',
          ipAddress: 'Internal System',
          notes: `Admin memicu link reset kata sandi ke nomor WhatsApp ${target?.phone || '-'}.`,
        };

        set((state) => ({
          auditLogs: [resetLog, ...state.auditLogs],
        }));

        // Persist to Supabase
        fetch(getApiUrl('/api/v1/admin/users/audit-logs'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            userName: target?.name || 'Pengguna',
            userRole: target?.role || 'CUSTOMER_MEMBER',
            eventType: 'LOGIN_FAILED',
            device: target?.currentDevice || 'System Admin Panel',
            ipAddress: 'Internal System',
            notes: `Admin memicu link reset kata sandi ke nomor WhatsApp ${target?.phone || '-'}.`,
          }),
        }).catch(() => {});
      },
    }),
    {
      name: 'chenille_user_audit_storage',
    }
  )
);
