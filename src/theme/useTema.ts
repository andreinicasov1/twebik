import { useContext } from 'react';

import { ThemeContext } from './theme-context';

export function useTema() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTema trebuie folosit în interiorul ThemeProvider.');
  }

  return context;
}
