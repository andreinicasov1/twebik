import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { mockApi } from '../axios';
import { Breadcrumbs, Loader, Pagination } from '../components';
import { LeaderboardTableSection } from '../sections';
import type { Contest, LeaderboardRow } from '../types';

const PE_PAGINA = 8;

export function LeaderboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [concursuri, setConcursuri] = useState<Contest[]>([]);
  const [seIncarca, setSeIncarca] = useState(true);
  const [query, setQuery] = useState('');
  const [pagina, setPagina] = useState(1);

  const concursSelectat = searchParams.get('concurs') ?? 'global';

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const dataConcursuri = await mockApi.getConcursuri();
        const dataClasament =
          concursSelectat === 'global'
            ? await mockApi.getClasamentGlobal()
            : await mockApi.getClasamentConcurs(concursSelectat);

        if (mounted) {
          setConcursuri(dataConcursuri);
          setRows(dataClasament);
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
  }, [concursSelectat]);

  const filtrate = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return rows;

    return rows.filter((item) => item.nickname.toLowerCase().includes(text));
  }, [query, rows]);

  const totalPagini = Math.max(Math.ceil(filtrate.length / PE_PAGINA), 1);
  const paginat = filtrate.slice((pagina - 1) * PE_PAGINA, pagina * PE_PAGINA);

  useEffect(() => {
    setPagina(1);
  }, [query, concursSelectat]);

  if (seIncarca) {
    return <Loader text='Încărcăm clasamentul...' />;
  }

  return (
    <div className='stack-lg'>
      <Breadcrumbs items={[{ label: 'Clasament' }]} />

      <div className='section-head'>
        <h1>Clasament</h1>
      </div>

      <div className='filter-bar'>
        <input
          type='search'
          placeholder='Caută după pseudonim...'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <select
          value={concursSelectat}
          onChange={(event) => {
            setSearchParams(event.target.value === 'global' ? {} : { concurs: event.target.value });
          }}
        >
          <option value='global'>Clasament global</option>
          {concursuri.map((concurs) => (
            <option key={concurs.id} value={concurs.id}>
              {concurs.titlu}
            </option>
          ))}
        </select>
      </div>

      <LeaderboardTableSection rows={paginat} />
      <Pagination paginaCurenta={pagina} totalPagini={totalPagini} onPaginaChange={setPagina} />
    </div>
  );
}
