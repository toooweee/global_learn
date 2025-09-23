import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { trpc } from './trpc.provider';

type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  );

  const utils = trpc.useUtils();

  const loginMutation = trpc.authRouter.login.useMutation();
  const logoutMutation = trpc.authRouter.logout.useMutation();
  const refreshQuery = trpc.authRouter.refresh.useQuery(undefined, {
    enabled: false,
    retry: false,
  });

  const persistToken = useCallback((token: string | null) => {
    setAccessToken(token);
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await loginMutation.mutateAsync({ email, password });
      persistToken(res.accessToken);
      await utils.invalidate();
    },
    [loginMutation, persistToken, utils],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      persistToken(null);
      await utils.invalidate();
    }
  }, [logoutMutation, persistToken, utils]);

  const refresh = useCallback(async () => {
    const res = await refreshQuery.refetch();
    if (res.data?.accessToken) {
      persistToken(res.data.accessToken);
    }
  }, [persistToken, refreshQuery]);

  useEffect(() => {
    if (!accessToken) {
      refresh().catch(() => void 0);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      login,
      logout,
      refresh,
    }),
    [accessToken, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
