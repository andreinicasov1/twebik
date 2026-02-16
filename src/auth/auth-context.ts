import { createContext } from 'react';

import type { AuthState, LimbajProgramare, User } from '../types';

export interface InputInregistrare {
  nume: string;
  nickname: string;
  email: string;
  parola: string;
  tara?: string;
  limbajPreferat?: LimbajProgramare;
}

export interface AuthContextValue extends AuthState {
  autentificare: (email: string, parola: string) => Promise<void>;
  inregistrare: (payload: InputInregistrare) => Promise<void>;
  resetareParola: (email: string) => Promise<string>;
  deconectare: () => void;
  refreshUtilizator: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
