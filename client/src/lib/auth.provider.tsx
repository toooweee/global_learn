import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { trpc } from './trpc.provider';

type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  role: 'ADMIN' | 'USER' | 'CLIENT_ADMIN' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  );
  const [role, setRole] = useState<'ADMIN' | 'USER' | 'CLIENT_ADMIN' | null>(
    typeof window !== 'undefined' ? ((localStorage.getItem('role') as any) ?? null) : null,
  );

  const utils = trpc.useUtils();

  const loginMutation = trpc.authRouter.login.useMutation();
  const logoutMutation = trpc.authRouter.logout.useMutation();
  const refreshQuery = trpc.authRouter.refresh.useQuery(undefined, {
    enabled: false,
    retry: false,
  });
  const meQuery = trpc.usersRouter.me.useQuery(undefined, { enabled: false, retry: false });

  const persistToken = useCallback((token: string | null) => {
    setAccessToken(token);
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, []);

  const persistRole = useCallback((nextRole: 'ADMIN' | 'USER' | 'CLIENT_ADMIN' | null) => {
    setRole(nextRole);
    if (typeof window === 'undefined') return;
    if (nextRole) localStorage.setItem('role', nextRole);
    else localStorage.removeItem('role');
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await loginMutation.mutateAsync({ email, password });
      persistToken(res.accessToken);
      await utils.invalidate();
      const me = await meQuery.refetch();
      persistRole((me.data as any)?.role ?? null);
    },
    [loginMutation, persistToken, persistRole, utils, meQuery],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      persistToken(null);
      persistRole(null);
      await utils.invalidate();
      if (typeof window !== 'undefined') {
        window.location.assign('/login');
      }
    }
  }, [logoutMutation, persistToken, persistRole, utils]);

  const refresh = useCallback(async () => {
    const res = await refreshQuery.refetch();
    if (res.data?.accessToken) {
      persistToken(res.data.accessToken);
    }
    const me = await meQuery.refetch();
    setRole((me.data as any)?.role ?? null);
  }, [persistToken, refreshQuery, meQuery]);

  useEffect(() => {
    if (!accessToken) {
      refresh().catch(() => void 0);
    } else {
      meQuery
        .refetch()
        .then((res) => persistRole((res.data as any)?.role ?? null))
        .catch(() => persistRole(null));
    }
  }, [accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      role,
      login,
      logout,
      refresh,
    }),
    [accessToken, role, login, logout, refresh],
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
