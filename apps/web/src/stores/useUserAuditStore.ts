'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '@chenille/shared';

export interface UserSessionItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarEmoji: string;
  status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED';
  isOnline: boolean;
  lastActiveText: string;
  lastActiveTimestamp: number;
  currentDevice: string;
  ipAddress: string;
  totalOrders?: number;
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
  recordAuditLog: (log: Omit<SessionAuditLog, 'id' | 'timestamp'>) => void;
  updateUserOnlineStatus: (userId: string, isOnline: boolean, device?: string) => void;
  forceLogoutUser: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;
  resetPasswordRequest: (userId: string) => void;
}

const INITIAL_USERS: UserSessionItem[] = [
  {
    id: 'usr-admin-01',
    name: 'Ahmad Arif (Owner Atelier)',
    email: 'ahmad@chenilleatelier.com',
    phone: '081234567890',
    role: 'SUPER_ADMIN',
    avatarEmoji: '👑',
    status: 'ACTIVE',
    isOnline: false,
    lastActiveText: '35 menit lalu',
    lastActiveTimestamp: Date.now() - 35 * 60 * 1000,
    currentDevice: 'Windows 11 • Chrome 128',
    ipAddress: '180.252.164.21 (Depok)',
  },
  {
    id: 'usr-admin-02',
    name: 'Rania Azzahra (Super Admin)',
    email: 'admin@chenilleatelier.com',
    phone: '081198765432',
    role: 'SUPER_ADMIN',
    avatarEmoji: '👑',
    status: 'ACTIVE',
    isOnline: true,
    lastActiveText: 'Online Sekarang',
    lastActiveTimestamp: Date.now() - 2 * 60 * 1000,
    currentDevice: 'macOS Sonoma • Safari 17',
    ipAddress: '182.2.140.88 (Jakarta)',
  },
  {
    id: 'usr-florist-01',
    name: 'Nadia Florist Staff',
    email: 'staff@chenilleatelier.com',
    phone: '085712345678',
    role: 'FLORIST_STAFF',
    avatarEmoji: '🌷',
    status: 'ACTIVE',
    isOnline: true,
    lastActiveText: 'Online Sekarang',
    lastActiveTimestamp: Date.now() - 4 * 60 * 1000,
    currentDevice: 'Android 14 • Chrome Mobile',
    ipAddress: '114.124.200.12 (Depok)',
  },
  {
    id: 'usr-member-01',
    name: 'Sarah Amalia (Member Gold)',
    email: 'sarah.amalia@gmail.com',
    phone: '081298317721',
    role: 'CUSTOMER_MEMBER',
    avatarEmoji: '🌸',
    status: 'ACTIVE',
    isOnline: false,
    lastActiveText: '18 menit lalu (Auto-logout)',
    lastActiveTimestamp: Date.now() - 18 * 60 * 1000,
    currentDevice: 'iPhone 15 • Safari Mobile',
    ipAddress: '36.85.12.94 (Bandung)',
    totalOrders: 12,
  },
  {
    id: 'usr-member-02',
    name: 'Siti Anggraini (Member Silver)',
    email: 'siti.anggraini@student.ui.ac.id',
    phone: '081298765432',
    role: 'CUSTOMER_MEMBER',
    avatarEmoji: '✨',
    status: 'ACTIVE',
    isOnline: false,
    lastActiveText: '2 jam lalu',
    lastActiveTimestamp: Date.now() - 120 * 60 * 1000,
    currentDevice: 'Windows 10 • Edge 126',
    ipAddress: '103.247.21.5 (Depok)',
    totalOrders: 5,
  },
  {
    id: 'usr-member-03',
    name: 'Dimas Wicaksono',
    email: 'dimas.w@yahoo.co.id',
    phone: '081399887766',
    role: 'CUSTOMER_MEMBER',
    avatarEmoji: '🌿',
    status: 'ACTIVE',
    isOnline: false,
    lastActiveText: 'Kemarin, 16:45',
    lastActiveTimestamp: Date.now() - 1440 * 60 * 1000,
    currentDevice: 'Xiaomi HyperOS • Chrome',
    ipAddress: '180.245.99.10 (Cimahi)',
    totalOrders: 2,
  },
];

const INITIAL_LOGS: SessionAuditLog[] = [
  {
    id: 'log-001',
    timestamp: '13 Sep 2026, 08:08:12',
    userId: 'usr-member-01',
    userName: 'Sarah Amalia (Member Gold)',
    userRole: 'CUSTOMER_MEMBER',
    eventType: 'LOGOUT_TIMEOUT_15MIN',
    device: 'iPhone 15 • Safari Mobile',
    ipAddress: '36.85.12.94',
    notes: 'Sesi otomatis dikeluarkan oleh sistem karena tidak ada interaksi mouse/touch selama 15 menit.',
    sessionDurationMinutes: 15,
  },
  {
    id: 'log-002',
    timestamp: '13 Sep 2026, 07:53:10',
    userId: 'usr-member-01',
    userName: 'Sarah Amalia (Member Gold)',
    userRole: 'CUSTOMER_MEMBER',
    eventType: 'LOGIN_SUCCESS',
    device: 'iPhone 15 • Safari Mobile',
    ipAddress: '36.85.12.94',
    notes: 'Login berhasil via nomor WhatsApp dan OTP.',
  },
  {
    id: 'log-003',
    timestamp: '13 Sep 2026, 07:45:00',
    userId: 'usr-admin-02',
    userName: 'Rania Azzahra (Super Admin)',
    userRole: 'SUPER_ADMIN',
    eventType: 'LOGIN_SUCCESS',
    device: 'macOS Sonoma • Safari 17',
    ipAddress: '182.2.140.88',
    notes: 'Login admin berhasil. Membuka panel operasional atelier.',
  },
  {
    id: 'log-004',
    timestamp: '13 Sep 2026, 07:30:15',
    userId: 'usr-admin-01',
    userName: 'Ahmad Arif (Owner Atelier)',
    userRole: 'SUPER_ADMIN',
    eventType: 'LOGOUT_MANUAL',
    device: 'Windows 11 • Chrome 128',
    ipAddress: '180.252.164.21',
    notes: 'Admin mengklik tombol Logout akun secara manual.',
    sessionDurationMinutes: 42,
  },
  {
    id: 'log-005',
    timestamp: '13 Sep 2026, 06:48:15',
    userId: 'usr-admin-01',
    userName: 'Ahmad Arif (Owner Atelier)',
    userRole: 'SUPER_ADMIN',
    eventType: 'LOGIN_SUCCESS',
    device: 'Windows 11 • Chrome 128',
    ipAddress: '180.252.164.21',
    notes: 'Login pemilik toko untuk review pesanan pagi.',
  },
];

export const useUserAuditStore = create<UserAuditState>()(
  persist(
    (set) => ({
      users: INITIAL_USERS,
      auditLogs: INITIAL_LOGS,

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

        set((state) => ({
          auditLogs: [newLog, ...state.auditLogs].slice(0, 100), // keep latest 100 logs
        }));
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

      forceLogoutUser: (userId) => {
        set((state) => {
          const target = state.users.find((u) => u.id === userId);
          const updatedUsers = state.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  isOnline: false,
                  lastActiveText: 'Dikeluarkan paksa oleh Admin',
                  lastActiveTimestamp: Date.now(),
                }
              : u
          );

          const forceLog: SessionAuditLog = {
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
            eventType: 'FORCE_LOGOUT_ADMIN',
            device: target?.currentDevice || 'Unknown Device',
            ipAddress: target?.ipAddress || '127.0.0.1',
            notes: 'Sesi di-revoke secara paksa oleh Super Admin dari panel Pengguna (Pola admin-sunjaya).',
          };

          return {
            users: updatedUsers,
            auditLogs: [forceLog, ...state.auditLogs],
          };
        });
      },

      toggleUserStatus: (userId) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  status: u.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE',
                  isOnline: u.status === 'ACTIVE' ? false : u.isOnline,
                }
              : u
          ),
        }));
      },

      resetPasswordRequest: (userId) => {
        set((state) => {
          const target = state.users.find((u) => u.id === userId);
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
          return {
            auditLogs: [resetLog, ...state.auditLogs],
          };
        });
      },
    }),
    {
      name: 'chenille_user_audit_storage',
    }
  )
);
