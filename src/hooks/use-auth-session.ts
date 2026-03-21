import { useCallback, useState } from 'react';
import { useFetch } from './useFetch';
import { authApi } from '@/api/auth/auth';
import type { AuthUser } from '@/api/interfaces/auth';
import type { AxiosError } from 'axios';

export const useAuthSession = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, error, isLoading } = useFetch<AuthUser>({
    key: `authSession-${refreshKey}`,
    enabled: true,
    fetcher: () => authApi.me(),
    onError: (err) => {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          return;
        }
      }
    },
  });

  const refreshSession = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return {
    user: data ?? null,
    isLoading,
    isAuthenticated: !!data,
    refreshSession,
    error,
  };
};
