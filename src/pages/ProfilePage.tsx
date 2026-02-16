import { useEffect, useState } from 'react';

import { useAuth } from '../auth';
import { mockApi } from '../axios';
import { Breadcrumbs, EmptyState, Loader } from '../components';
import { ProfileHeaderSection } from '../sections';
import type { Contest, Submission, User } from '../types';
import { formatDate } from '../utils';

interface ProfileData {
  user: User;
  istoricConcursuri: Contest[];
  istoricTrimiteri: Submission[];
}

export function ProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [seIncarca, setSeIncarca] = useState(true);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const load = async () => {
      try {
        const rezultat = await mockApi.getProfil(user.id);
        if (mounted) {
          setData(rezultat);
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
    return <Loader text='Încărcăm profilul tău...' />;
  }

  if (!data) {
    return <EmptyState titlu='Profil indisponibil' descriere='Nu am putut încărca profilul utilizatorului.' />;
  }

  return (
    <div className='stack-lg'>
      <Breadcrumbs items={[{ label: 'Profil' }]} />
      <ProfileHeaderSection user={data.user} />

      <section className='grid cols-2'>
        <article className='card'>
          <h3>Insigne</h3>
          {data.user.insigne.length === 0 ? (
            <p className='muted'>Nu există insigne.</p>
          ) : (
            <div className='badge-list'>
              {data.user.insigne.map((insigna) => (
                <span key={insigna} className='badge-chip'>
                  {insigna}
                </span>
              ))}
            </div>
          )}
        </article>

        <article className='card'>
          <h3>Statistici rapide</h3>
          <ul className='simple-list'>
            <li>Poziție globală: #{data.user.clasamentGlobal}</li>
            <li>Puncte totale: {data.user.puncteTotale}</li>
            <li>Concursuri câștigate: {data.user.concursuriCastigate}</li>
            <li>Țară: {data.user.tara ?? 'Nespecificată'}</li>
            <li>Limbaj preferat: {data.user.limbajPreferat ?? 'Nespecificat'}</li>
          </ul>
        </article>
      </section>

      <section className='card'>
        <h3>Istoric concursuri</h3>
        {data.istoricConcursuri.length === 0 ? (
          <p className='muted'>Nu ai participat încă la concursuri.</p>
        ) : (
          <div className='table-wrap'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Concurs</th>
                  <th>Stare</th>
                  <th>Data start</th>
                </tr>
              </thead>
              <tbody>
                {data.istoricConcursuri.map((item) => (
                  <tr key={item.id}>
                    <td>{item.titlu}</td>
                    <td>{item.stare === 'in_curand' ? 'În curând' : item.stare === 'activ' ? 'Activ' : 'Terminat'}</td>
                    <td>{formatDate(item.startLa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className='card'>
        <h3>Ultimele trimiteri</h3>
        {data.istoricTrimiteri.length === 0 ? (
          <p className='muted'>Nu există trimiteri.</p>
        ) : (
          <div className='table-wrap'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Problemă</th>
                  <th>Rezultat</th>
                  <th>Punctaj</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {data.istoricTrimiteri.slice(0, 8).map((item) => (
                  <tr key={item.id}>
                    <td>{item.problemId}</td>
                    <td>
                      {item.rezultat === 'acceptat'
                        ? 'Acceptat'
                        : item.rezultat === 'gresit'
                          ? 'Greșit'
                          : 'Timp depășit'}
                    </td>
                    <td>{item.scor}</td>
                    <td>{formatDate(item.trimisLa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
