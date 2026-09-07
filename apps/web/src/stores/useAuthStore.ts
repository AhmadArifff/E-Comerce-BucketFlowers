'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, UserProfile } from '@chenille/shared';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  switchRole: (role: Role) => void;
  updateAvatarEmoji: (emoji: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  login: (role?: Role) => void;
  logout: () => void;
}

const DEFAULT_MEMBER: UserProfile = {
  id: 'usr-member-01',
  name: 'Siti Anggraini',
  email: 'siti.anggraini@student.ui.ac.id',
  phone: '081298765432',
  role: 'CUSTOMER_MEMBER',
  avatarEmoji: '🌸',
  flowerPoints: 120,
};

const DEFAULT_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  name: 'Ahmad Arif (Owner Atelier)',
  email: 'admin@chenilleatelier.com',
  phone: '081234567890',
  role: 'SUPER_ADMIN',
  avatarEmoji: '👑',
  flowerPoints: 9999,
};

const DEFAULT_FLORIST: UserProfile = {
  id: 'usr-florist-01',
  name: 'Nadia Florist Staff',
  email: 'staff@chenilleatelier.com',
  phone: '085712345678',
  role: 'FLORIST_STAFF',
  avatarEmoji: '🌷',
  flowerPoints: 500,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEFAULT_MEMBER,
      isAuthenticated: true,

      switchRole: (role) => {
        if (role === 'SUPER_ADMIN') set({ user: DEFAULT_ADMIN, isAuthenticated: true });
        else if (role === 'FLORIST_STAFF') set({ user: DEFAULT_FLORIST, isAuthenticated: true });
        else set({ user: DEFAULT_MEMBER, isAuthenticated: true });
      },

      updateAvatarEmoji: (emoji) => {
        set((state) => (state.user ? { user: { ...state.user, avatarEmoji: emoji } } : state));
      },

      updateProfile: (data) => {
        set((state) => (state.user ? { user: { ...state.user, ...data } } : state));
      },

      login: (role = 'CUSTOMER_MEMBER') => {
        if (role === 'SUPER_ADMIN') set({ user: DEFAULT_ADMIN, isAuthenticated: true });
        else if (role === 'FLORIST_STAFF') set({ user: DEFAULT_FLORIST, isAuthenticated: true });
        else set({ user: DEFAULT_MEMBER, isAuthenticated: true });
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'chenille_auth_storage',
    }
  )
);
