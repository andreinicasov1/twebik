import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { ThemeContext, type TipTema } from './theme-context';

export function ThemeProvider({ children }: PropsWithChildren) {
  const [tema, setTema] = useState<TipTema>(() => {
    const memorata = localStorage.getItem('platforma_tema');
    return memorata === 'luminoasa' ? 'luminoasa' : 'intunecata';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem('platforma_tema', tema);
  }, [tema]);

  const value = useMemo(
    () => ({
      tema,
      toggleTema: () => setTema((curenta) => (curenta === 'intunecata' ? 'luminoasa' : 'intunecata')),
    }),
    [tema],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
