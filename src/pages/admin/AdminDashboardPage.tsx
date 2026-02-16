import { useEffect, useState } from 'react';

import { useAuth } from '../../auth';
import { mockApi } from '../../axios';
import { Breadcrumbs, EmptyState, Loader } from '../../components';
import { AdminStatsSection } from '../../sections';

interface StatisticiAdmin {
  numarUtilizatori: number;
  concursuriActive: number;
  trimiteriAzi: number;
  raportariDeschise: number;
}

export function AdminDashboardPage() {
  const { token } = useAuth();
  const [statistici, setStatistici] = useState<StatisticiAdmin | null>(null);
  const [seIncarca, setSeIncarca] = useState(true);

  useEffect(() => {
    if (!token) return;

    let mounted = true;

    const load = async () => {
      try {
        const data = await mockApi.adminGetStatistici(token);
        if (mounted) {
          setStatistici(data);
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
  }, [token]);

  if (seIncarca) {
    return <Loader text='Încărcăm datele panoului de administrare...' />;
  }

  if (!statistici) {
    return <EmptyState titlu='Date indisponibile' descriere='Nu am putut încărca statisticile de administrare.' />;
  }

  return (
    <div className='stack-lg'>
      <Breadcrumbs items={[{ label: 'Administrare' }, { label: 'Panou general' }]} />
      <h1>Panou general</h1>
      <AdminStatsSection {...statistici} />

      <section className='grid cols-2'>
        <article className='card'>
          <h3>Indicatori platformă</h3>
          <ul className='simple-list'>
            <li>Rată de participare: 78%</li>
            <li>Timp mediu evaluare: 2.3 secunde</li>
            <li>Utilizatori noi săptămâna aceasta: 42</li>
            <li>Concursuri planificate luna aceasta: 9</li>
          </ul>
        </article>

        <article className='card'>
          <h3>Alerte rapide</h3>
          <ul className='simple-list'>
            <li>2 raportări noi necesită validare manuală.</li>
            <li>1 concurs începe în mai puțin de 24 de ore.</li>
            <li>Sistemul mock rulează fără erori critice.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
