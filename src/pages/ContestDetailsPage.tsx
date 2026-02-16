import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useAuth } from '../auth';
import { mockApi } from '../axios';
import { Breadcrumbs, CardProblema, EmptyState, Loader } from '../components';
import type { Contest, Problem } from '../types';
import { formatDate, formatDuration } from '../utils';

export function ContestDetailsPage() {
  const { contestId = '' } = useParams();
  const { user } = useAuth();

  const [concurs, setConcurs] = useState<Contest | null>(null);
  const [probleme, setProbleme] = useState<Problem[]>([]);
  const [seIncarca, setSeIncarca] = useState(true);
  const [acum, setAcum] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setAcum(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [dataConcurs, dataProbleme] = await Promise.all([
          mockApi.getConcursDupaId(contestId),
          mockApi.getProblemeConcurs(contestId),
        ]);

        if (mounted) {
          setConcurs(dataConcurs);
          setProbleme(dataProbleme);
        }
      } catch {
        if (mounted) {
          setConcurs(null);
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
  }, [contestId]);

  const countdown = useMemo(() => {
    if (!concurs) return '00:00:00';

    const acumLocal = acum;
    const start = new Date(concurs.startLa).getTime();
    const final = new Date(concurs.finalLa).getTime();

    if (acumLocal < start) return formatDuration(start - acumLocal);
    if (acumLocal <= final) return formatDuration(final - acumLocal);
    return 'Finalizat';
  }, [acum, concurs]);

  const handleParticipa = async () => {
    if (!user || !concurs) return;

    try {
      await mockApi.participaLaConcurs(user.id, concurs.id);
      toast.success('Înscriere confirmată. Succes în concurs!');
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu te-am putut înscrie.';
      toast.error(mesaj);
    }
  };

  if (seIncarca) {
    return <Loader text='Încărcăm detaliile concursului...' />;
  }

  if (!concurs) {
    return <EmptyState titlu='Concurs indisponibil' descriere='Concursul căutat nu mai există.' />;
  }

  return (
    <div className='stack-lg'>
      <Breadcrumbs items={[{ label: 'Concursuri', to: '/concursuri' }, { label: concurs.titlu }]} />

      <section className='card stack-md fade-in'>
        <div className='section-head'>
          <h1>{concurs.titlu}</h1>
          <span className='pill pill-soft'>Timp rămas: {countdown}</span>
        </div>

        <p>{concurs.descriere}</p>

        <div className='grid cols-3'>
          <article className='inner-card'>
            <h4>Start</h4>
            <p>{formatDate(concurs.startLa)}</p>
          </article>
          <article className='inner-card'>
            <h4>Final</h4>
            <p>{formatDate(concurs.finalLa)}</p>
          </article>
          <article className='inner-card'>
            <h4>Participanți</h4>
            <p>{concurs.participanti}</p>
          </article>
        </div>

        <div className='stack-sm'>
          <h3>Reguli</h3>
          <ul className='simple-list'>
            {concurs.reguli.map((regula) => (
              <li key={regula}>{regula}</li>
            ))}
          </ul>
        </div>

        <div className='row'>
          <button type='button' className='btn btn-primary' onClick={handleParticipa}>
            Participă
          </button>
          <Link to={`/clasament?concurs=${concurs.id}`} className='btn btn-ghost'>
            Vezi clasamentul concursului
          </Link>
        </div>
      </section>

      <section className='stack-md'>
        <h2>Problemele concursului</h2>
        <div className='grid cols-2'>
          {probleme.map((problema) => (
            <CardProblema key={problema.id} problema={problema} />
          ))}
        </div>
      </section>
    </div>
  );
}
