import { createContext, useContext, useEffect, useMemo, useRef, ReactNode } from 'react';
import { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { axiosInstance } from './axios-instance';
import { CONFIG } from '../global-config';

interface AxiosContextValue {
  api: AxiosInstance;
}

const AxiosContext = createContext<AxiosContextValue | null>(null);

export function AxiosProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const reqInterceptorRef = useRef<number | null>(null);
  const resInterceptorRef = useRef<number | null>(null);

  useEffect(() => {
    reqInterceptorRef.current = axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(CONFIG.tokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    resInterceptorRef.current = axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<any>) => {
        const status = error.response?.status;
        if (!error.response) {
          // Backend inaccesibil => redirect la pagina 500
          navigate('/500', { replace: true });
          return Promise.reject(error);
        }
        if (status === 401) {
          localStorage.removeItem(CONFIG.tokenKey);
          localStorage.removeItem(CONFIG.userKey);
          toast.error('Sesiune expirată. Reconectează-te.');
          navigate('/login', { replace: true });
        } else if (status === 403) {
          toast.error('Acces interzis');
        } else if (status && status >= 500) {
          navigate('/500', { replace: true });
        } else {
          const msg = (error.response.data as any)?.message || 'A apărut o eroare';
          toast.error(msg);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      if (reqInterceptorRef.current !== null) axiosInstance.interceptors.request.eject(reqInterceptorRef.current);
      if (resInterceptorRef.current !== null) axiosInstance.interceptors.response.eject(resInterceptorRef.current);
    };
  }, [navigate]);

  const value = useMemo(() => ({ api: axiosInstance }), []);

  return <AxiosContext.Provider value={value}>{children}</AxiosContext.Provider>;
}

export function useAxios() {
  const ctx = useContext(AxiosContext);
  if (!ctx) throw new Error('useAxios trebuie folosit în AxiosProvider');
  return ctx.api;
}
