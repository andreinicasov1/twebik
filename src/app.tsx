import { MoonStar, SunMedium } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './auth';
import { AppRoutes } from './routes';
import { ThemeProvider, useTema } from './theme';

function ButonTema() {
  const { tema, toggleTema } = useTema();

  return (
    <button
      type='button'
      className='theme-toggle'
      onClick={toggleTema}
      aria-label='Schimbă tema vizuală'
      title='Schimbă tema'
    >
      {tema === 'intunecata' ? <SunMedium size={16} /> : <MoonStar size={16} />}
    </button>
  );
}

function Aplicatie() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ButonTema />
          <AppRoutes />
        </BrowserRouter>
        <Toaster
          position='top-right'
          toastOptions={{
            style: {
              background: 'var(--surface-2)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-soft)',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default Aplicatie;
