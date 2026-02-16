import { useEffect, useMemo, useState } from 'react';

import { mockApi } from '../axios';
import { Breadcrumbs, CardConcurs, EmptyState, FilterBar, Loader, Pagination } from '../components';
import type { Contest, Dificultate, StareConcurs, TipConcurs } from '../types';

const PE_PAGINA = 6;

export function ContestsPage() {
  const [concursuri, setConcursuri] = useState<Contest[]>([]);
  const [seIncarca, setSeIncarca] = useState(true);
  const [cautare, setCautare] = useState('');
  const [stare, setStare] = useState<StareConcurs | 'toate'>('toate');
  const [dificultate, setDificultate] = useState<Dificultate | 'toate'>('toate');
  const [tip, setTip] = useState<TipConcurs | 'toate'>('toate');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await mockApi.getConcursuri();
        if (mounted) {
          setConcursuri(data);
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
  }, []);

  const filtrate = useMemo(
    () =>
      concursuri.filter((item) => {
        const okStare = stare === 'toate' || item.stare === stare;
        const okDificultate = dificultate === 'toate' || item.dificultate === dificultate;
        const okTip = tip === 'toate' || item.tip === tip;
        const query = cautare.trim().toLowerCase();
        const okText =
          query.length === 0 ||
          item.titlu.toLowerCase().includes(query) ||
          item.descriere.toLowerCase().includes(query);

        return okStare && okDificultate && okTip && okText;
      }),
    [cautare, concursuri, dificultate, stare, tip],
  );

  const totalPagini = Math.max(Math.ceil(filtrate.length / PE_PAGINA), 1);

  useEffect(() => {
    setPagina(1);
  }, [cautare, stare, dificultate, tip]);

  const paginat = filtrate.slice((pagina - 1) * PE_PAGINA, pagina * PE_PAGINA);

  if (seIncarca) {
    return <Loader text='Încărcăm concursurile...' />;
  }

  return (
    <div className='stack-lg'>
      <Breadcrumbs items={[{ label: 'Concursuri' }]} />
      <h1>Concursuri</h1>

      <FilterBar
        cautare={cautare}
        stare={stare}
        dificultate={dificultate}
        tip={tip}
        onCautareChange={setCautare}
        onStareChange={setStare}
        onDificultateChange={setDificultate}
        onTipChange={setTip}
      />

      {paginat.length === 0 ? (
        <EmptyState titlu='Niciun concurs găsit' descriere='Ajustează filtrele pentru a vedea rezultate.' />
      ) : (
        <div className='grid cols-3'>
          {paginat.map((concurs) => (
            <CardConcurs key={concurs.id} concurs={concurs} />
          ))}
        </div>
      )}

      <Pagination paginaCurenta={pagina} totalPagini={totalPagini} onPaginaChange={setPagina} />
    </div>
  );
}
