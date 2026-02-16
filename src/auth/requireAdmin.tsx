import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from './useAuth';
import { Loader } from '../components/Loader';

export function RequireAdmin() {
  const { seIncarca, user } = useAuth();

  if (seIncarca) {
    return <Loader text='Verificăm drepturile de acces...' fullscreen />;
  }

  if (!user) {
    return <Navigate to='/autentificare' replace />;
  }

  if (user.rol !== 'admin') {
    return <Navigate to='/panou' replace />;
  }

  return <Outlet />;
}
