import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from './useAuth';
import { Loader } from '../components/Loader';

export function RequireAuth() {
  const { esteAutentificat, seIncarca } = useAuth();
  const locatie = useLocation();

  if (seIncarca) {
    return <Loader text='Verificăm sesiunea...' fullscreen />;
  }

  if (!esteAutentificat) {
    return <Navigate to='/autentificare' replace state={{ from: locatie.pathname }} />;
  }

  return <Outlet />;
}
