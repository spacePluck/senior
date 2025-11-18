import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'vip-user-storage',
    }
  )
);
