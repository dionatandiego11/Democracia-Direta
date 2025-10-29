import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/state/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const router = useRouter();
  const { token, user, isLoading } = useAuthStore((state) => ({
    token: state.token,
    user: state.user,
    isLoading: state.isLoading
  }));

  useEffect(() => {
    if (!isLoading && (!token || !user)) {
      router.replace('/login');
    }
  }, [isLoading, token, user, router]);

  useEffect(() => {
    if (!isLoading && roles && user && !roles.some((role) => user.roles.includes(role))) {
      router.replace('/login');
    }
  }, [roles, user, isLoading, router]);

  if (!token || !user) {
    return <div>Carregando sessão...</div>;
  }

  if (roles && user && !roles.some((role) => user.roles.includes(role))) {
    return <div>Você não tem permissão para acessar essa área.</div>;
  }

  return <>{children}</>;
}
