import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { mockApi } from '../axios';
import type { AuthState } from '../types';
import { clearAuth, getToken, saveAuth } from '../utils';
import { AuthContext, type InputInregistrare } from './auth-context';

export function AuthProvider({ children }: PropsWithChildren) {
  const tokenInitial = getToken();

  const [state, setState] = useState<AuthState>({
    token: tokenInitial,
    user: null,
    esteAutentificat: false,
    seIncarca: Boolean(tokenInitial),
  });

  useEffect(() => {
    if (!tokenInitial) {
      return;
    }

    let mounted = true;

    const verificaSesiune = async () => {
      try {
        const user = await mockApi.getUtilizatorCurent(tokenInitial);

        if (mounted) {
          setState({ token: tokenInitial, user, esteAutentificat: true, seIncarca: false });
        }
      } catch {
        clearAuth();

        if (mounted) {
          setState({ token: null, user: null, esteAutentificat: false, seIncarca: false });
        }
      }
    };

    void verificaSesiune();

    return () => {
      mounted = false;
    };
  }, [tokenInitial]);

  const autentificare = useCallback(async (email: string, parola: string) => {
    const { token, user } = await mockApi.autentificare({ email, parola });

    saveAuth(token, user.id);
    setState({ token, user, esteAutentificat: true, seIncarca: false });
  }, []);

  const inregistrare = useCallback(async (payload: InputInregistrare) => {
    const { token, user } = await mockApi.inregistrare(payload);

    saveAuth(token, user.id);
    setState({ token, user, esteAutentificat: true, seIncarca: false });
  }, []);

  const resetareParola = useCallback(async (email: string) => {
    const rezultat = await mockApi.resetareParola(email);
    return rezultat.mesaj;
  }, []);

  const deconectare = useCallback(() => {
    clearAuth();
    setState({ token: null, user: null, esteAutentificat: false, seIncarca: false });
  }, []);

  const refreshUtilizator = useCallback(async () => {
    const token = state.token;
    if (!token) return null;

    try {
      const user = await mockApi.getUtilizatorCurent(token);
      setState((curent) => ({ ...curent, user }));
      return user;
    } catch {
      deconectare();
      return null;
    }
  }, [deconectare, state.token]);

  const value = useMemo(
    () => ({
      ...state,
      autentificare,
      inregistrare,
      resetareParola,
      deconectare,
      refreshUtilizator,
    }),
    [autentificare, deconectare, inregistrare, refreshUtilizator, resetareParola, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
