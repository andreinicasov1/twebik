import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '../../auth';
import { mockApi } from '../../axios';
import { Breadcrumbs, CustomTable, Loader } from '../../components';
import type { Raportare } from '../../types';
import { formatDate } from '../../utils';

export function AdminReportsPage() {
  const { token } = useAuth();
  const [raportari, setRaportari] = useState<Raportare[]>([]);
  const [seIncarca, setSeIncarca] = useState(true);

  const loadRaportari = useCallback(async () => {
    if (!token) return;

    try {
      const data = await mockApi.adminGetRaportari(token);
      setRaportari(data);
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut încărca raportările.';
      toast.error(mesaj);
    } finally {
      setSeIncarca(false);
    }
  }, [token]);

  useEffect(() => {
    void loadRaportari();
  }, [loadRaportari]);

  const actualizeazaStatus = async (reportId: string, status: Raportare['status']) => {
    if (!token) return;

    try {
      await mockApi.adminSetStatusRaportare(token, reportId, status);
      toast.success('Status raportare actualizat.');
      await loadRaportari();
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut modifica raportarea.';
      toast.error(mesaj);
    }
  };

  if (seIncarca) {
    return <Loader text='Încărcăm raportările...' />;
  }

  return (
    <div className='stack-lg'>
      <Breadcrumbs items={[{ label: 'Administrare' }, { label: 'Raportări' }]} />
      <h1>Moderare raportări</h1>

      <CustomTable
        date={raportari}
        coloane={[
          { key: 'tip', label: 'Tip', render: (row) => row.tip },
          { key: 'raportatDe', label: 'Raportat de', render: (row) => row.raportatDe },
          { key: 'tinta', label: 'Țintă', render: (row) => row.tinta },
          { key: 'motiv', label: 'Motiv', render: (row) => row.motiv },
          { key: 'data', label: 'Data', render: (row) => formatDate(row.creatLa) },
          { key: 'status', label: 'Status', render: (row) => row.status },
          {
            key: 'actiuni',
            label: 'Acțiuni',
            render: (row) => (
              <div className='table-actions'>
                <button type='button' className='btn btn-ghost' onClick={() => actualizeazaStatus(row.id, 'in_analiza')}>
                  Avertizare
                </button>
                <button type='button' className='btn btn-ghost' onClick={() => actualizeazaStatus(row.id, 'rezolvat')}>
                  Marchează rezolvat
                </button>
                <button type='button' className='btn btn-danger' onClick={() => actualizeazaStatus(row.id, 'rezolvat')}>
                  Șterge conținut
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
