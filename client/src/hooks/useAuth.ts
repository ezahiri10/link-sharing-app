import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { trpc } from '../lib/trpc';

export function useAuth() {
  const navigate = useNavigate();
  
  const { data: user, isLoading, error } = trpc.user.me.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (error?.data?.code === 'UNAUTHORIZED') {
      localStorage.removeItem('sessionId');
      navigate({ to: '/login' });
    }
  }, [error, navigate]);

  return { user, isLoading };
}
