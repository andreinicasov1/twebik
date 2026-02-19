import { useEffect, useState } from 'react';
import { commonService } from '../services/admin.service';

// Health check inițial — verifică disponibilitatea backend-ului la pornire.
// Dacă eșuează, interceptorul axios va redirecta utilizatorul la /500.
export function HealthCheck() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    commonService.health().then(() => setOk(true)).catch(() => setOk(false));
  }, []);

  if (ok !== false) return null;
  return null; // Redirect-ul este gestionat de axios-context
}
