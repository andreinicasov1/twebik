import { createContext } from 'react';

export type TipTema = 'intunecata' | 'luminoasa';

export interface ThemeContextValue {
  tema: TipTema;
  toggleTema: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
