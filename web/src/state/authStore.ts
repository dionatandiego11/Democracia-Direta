import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { login as loginRequest, logout as logoutRequest, fetchCurrentUser } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { token } = await loginRequest(email, password);
          set({ token });
          await get().bootstrap();
        } catch (error: any) {
          set({ error: error?.message ?? 'Falha ao autenticar' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      logout: async () => {
        const token = get().token;
        set({ token: null, user: null });
        if (token) {
          await logoutRequest(token);
        }
      },
      bootstrap: async () => {
        const token = get().token;
        if (!token) return;
        set({ isLoading: true });
        try {
          const user = await fetchCurrentUser(token);
          set({ user });
        } catch (error: any) {
          set({ token: null, user: null, error: error?.message ?? 'Sessão expirada' });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (noopStorage as Storage)))
    }
  )
);
