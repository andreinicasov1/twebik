import { useEffect, useState } from 'react';

import { useAuth } from '../auth';
import { mockApi } from '../axios';
import { Breadcrumbs, CardConcurs, EmptyState, Loader } from '../components';
import { UserDashboardSection } from '../sections';
import type { Contest, Notificare } from '../types';

interface DashboardData {
  rating: number;
  pozitie: number;
  active: number;
  inCurand: number;
  rezultate: number;
  concursuriRecente: Contest[];
}

export function UserDashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [notificari, setNotificari] = useState<Notificare[]>([]);
  const [seIncarca, setSeIncarca] = useState(true);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const load = async () => {
      try {
        const [dataDashboard, dataNotificari] = await Promise.all([
          mockApi.getDashboardUtilizator(user.id),
          mockApi.getNotificari(user.id),
        ]);

        if (mounted) {
          setDashboard(dataDashboard);
          setNotificari(dataNotificari);
        }
      } finally {
        if (mounted) {
          setSeIncarca(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [user]);

  if (seIncarca) {
    return <Loader text='Încărcăm panoul tău personal...' />;
  }

  if (!dashboard) {
    return <EmptyState titlu='Date indisponibile' descriere='Nu am putut încărca datele panoului utilizator.' />;
  }

  return (
    <div className='stack-lg'>
      <Breadcrumbs items={[{ label: 'Panou' }]} />
      <h1>Panou utilizator</h1>

      <UserDashboardSection {...dashboard} notificari={notificari} />

      <section className='stack-md'>
        <div className='section-head'>
          <h2>Concursuri recente</h2>
        </div>

        {dashboard.concursuriRecente.length === 0 ? (
          <EmptyState titlu='Nu ai activitate recentă' descriere='Participă la un concurs pentru a vedea progresul aici.' />
        ) : (
          <div className='grid cols-2'>
            {dashboard.concursuriRecente.map((item) => (
              <CardConcurs key={item.id} concurs={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
