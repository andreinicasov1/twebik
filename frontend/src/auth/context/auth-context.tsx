import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { axiosInstance } from '../../axios/axios-instance';
import { ENDPOINTS } from '../../axios/endpoints';
import { CONFIG } from '../../global-config';
import type { UserProfile, AuthResponse } from '../../types';

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  setUser: (u: UserProfile | null) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const raw = localStorage.getItem(CONFIG.userKey);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(CONFIG.tokenKey));
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const t = localStorage.getItem(CONFIG.tokenKey);
      if (!t) { setUser(null); setToken(null); return; }
      const { data } = await axiosInstance.get<UserProfile>(ENDPOINTS.auth.me);
      setUser(data);
      localStorage.setItem(CONFIG.userKey, JSON.stringify(data));
    } catch {
      // invalid token
      localStorage.removeItem(CONFIG.tokenKey);
      localStorage.removeItem(CONFIG.userKey);
      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const { data } = await axiosInstance.post<AuthResponse>(ENDPOINTS.auth.login, { email, password });
    localStorage.setItem(CONFIG.tokenKey, data.token);
    localStorage.setItem(CONFIG.userKey, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (username: string, email: string, password: string) => {
    const { data } = await axiosInstance.post<AuthResponse>(ENDPOINTS.auth.register, {
      username, email, password,
    });
    // Login automat imediat după înregistrare (fără confirmare email)
    localStorage.setItem(CONFIG.tokenKey, data.token);
    localStorage.setItem(CONFIG.userKey, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem(CONFIG.tokenKey);
    localStorage.removeItem(CONFIG.userKey);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, register, logout, refresh, setUser,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth trebuie folosit în AuthProvider');
  return ctx;
}
