import { ReactNode, useEffect } from 'react';
import { useAuthStore } from './authStore';

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return <>{children}</>;
}
