import { useAuthStore } from '@/state/authStore';

export function useAuth() {
  const { token, user, login, logout, isLoading, error } = useAuthStore((state) => ({
    token: state.token,
    user: state.user,
    login: state.login,
    logout: state.logout,
    isLoading: state.isLoading,
    error: state.error
  }));

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
    isLoading,
    error
  };
}
