import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '../../auth';
import { mockApi } from '../../axios';
import { Breadcrumbs, ConfirmModal, CustomTable, Loader } from '../../components';
import type { Contest, Dificultate, StareConcurs } from '../../types';
import { formatDate } from '../../utils';

interface FormularConcurs {
  id?: string;
  titlu: string;
  descriere: string;
  stare: StareConcurs;
  dificultate: Dificultate;
  tip: 'individual' | 'echipe';
  startLa: string;
  finalLa: string;
}

const stareGoala: FormularConcurs = {
  titlu: '',
  descriere: '',
  stare: 'in_curand',
  dificultate: 'mediu',
  tip: 'individual',
  startLa: '2026-02-25T10:00',
  finalLa: '2026-02-25T14:00',
};

export function AdminContestsPage() {
  const { token } = useAuth();
  const [concursuri, setConcursuri] = useState<Contest[]>([]);
  const [seIncarca, setSeIncarca] = useState(true);
  const [formular, setFormular] = useState<FormularConcurs>(stareGoala);
  const [idStergere, setIdStergere] = useState<string | null>(null);

  const editing = useMemo(() => Boolean(formular.id), [formular.id]);

  const loadConcursuri = useCallback(async () => {
    if (!token) return;

    try {
      const data = await mockApi.adminGetConcursuri(token);
      setConcursuri(data);
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut încărca concursurile.';
      toast.error(mesaj);
    } finally {
      setSeIncarca(false);
    }
  }, [token]);

  useEffect(() => {
    void loadConcursuri();
  }, [loadConcursuri]);

  const salvaConcurs = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    if (!formular.titlu || !formular.descriere) {
      toast.error('Completează titlul și descrierea concursului.');
      return;
    }

    try {
      await mockApi.adminUpsertConcurs(token, {
        ...formular,
        startLa: new Date(formular.startLa).toISOString(),
        finalLa: new Date(formular.finalLa).toISOString(),
      });
      toast.success(editing ? 'Concurs actualizat.' : 'Concurs creat.');
      setFormular(stareGoala);
      await loadConcursuri();
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut salva concursul.';
      toast.error(mesaj);
    }
  };

  const seteazaEditare = (concurs: Contest) => {
    setFormular({
      id: concurs.id,
      titlu: concurs.titlu,
      descriere: concurs.descriere,
      stare: concurs.stare,
      dificultate: concurs.dificultate,
      tip: concurs.tip,
      startLa: concurs.startLa.slice(0, 16),
      finalLa: concurs.finalLa.slice(0, 16),
    });
  };

  const stergeConcurs = async () => {
    if (!token || !idStergere) return;

    try {
      await mockApi.adminStergeConcurs(token, idStergere);
      toast.success('Concurs șters.');
      setIdStergere(null);
      await loadConcursuri();
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut șterge concursul.';
      toast.error(mesaj);
    }
  };

  if (seIncarca) {
    return <Loader text='Încărcăm concursurile pentru administrare...' />;
  }

  return (
    <div className='stack-lg'>
      <Breadcrumbs items={[{ label: 'Administrare' }, { label: 'Concursuri' }]} />
      <h1>Gestionare concursuri</h1>

      <form className='card stack-md' onSubmit={salvaConcurs}>
        <h3>{editing ? 'Editare concurs' : 'Creează concurs nou'}</h3>

        <div className='grid cols-2'>
          <label>
            Titlu
            <input
              type='text'
              value={formular.titlu}
              onChange={(event) => setFormular((curent) => ({ ...curent, titlu: event.target.value }))}
            />
          </label>

          <label>
            Tip
            <select
              value={formular.tip}
              onChange={(event) =>
                setFormular((curent) => ({ ...curent, tip: event.target.value as FormularConcurs['tip'] }))
              }
            >
              <option value='individual'>Individual</option>
              <option value='echipe'>Echipe</option>
            </select>
          </label>
        </div>

        <label>
          Descriere
          <textarea
            rows={3}
            value={formular.descriere}
            onChange={(event) => setFormular((curent) => ({ ...curent, descriere: event.target.value }))}
          />
        </label>

        <div className='grid cols-4'>
          <label>
            Stare
            <select
              value={formular.stare}
              onChange={(event) =>
                setFormular((curent) => ({ ...curent, stare: event.target.value as StareConcurs }))
              }
            >
              <option value='activ'>Activ</option>
              <option value='in_curand'>În curând</option>
              <option value='terminat'>Terminat</option>
            </select>
          </label>

          <label>
            Dificultate
            <select
              value={formular.dificultate}
              onChange={(event) =>
                setFormular((curent) => ({ ...curent, dificultate: event.target.value as Dificultate }))
              }
            >
              <option value='usor'>Ușor</option>
              <option value='mediu'>Mediu</option>
              <option value='greu'>Greu</option>
            </select>
          </label>

          <label>
            Start
            <input
              type='datetime-local'
              value={formular.startLa}
              onChange={(event) => setFormular((curent) => ({ ...curent, startLa: event.target.value }))}
            />
          </label>

          <label>
            Final
            <input
              type='datetime-local'
              value={formular.finalLa}
              onChange={(event) => setFormular((curent) => ({ ...curent, finalLa: event.target.value }))}
            />
          </label>
        </div>

        <div className='row'>
          <button type='submit' className='btn btn-primary'>
            {editing ? 'Actualizează concursul' : 'Creează concurs'}
          </button>
          {editing ? (
            <button type='button' className='btn btn-ghost' onClick={() => setFormular(stareGoala)}>
              Anulează editarea
            </button>
          ) : null}
        </div>
      </form>

      <CustomTable
        date={concursuri}
        coloane={[
          { key: 'titlu', label: 'Titlu', render: (row) => row.titlu },
          { key: 'stare', label: 'Stare', render: (row) => row.stare },
          { key: 'dificultate', label: 'Dificultate', render: (row) => row.dificultate },
          { key: 'tip', label: 'Tip', render: (row) => row.tip },
          { key: 'start', label: 'Start', render: (row) => formatDate(row.startLa) },
          {
            key: 'actiuni',
            label: 'Acțiuni',
            render: (row) => (
              <div className='table-actions'>
                <button type='button' className='btn btn-ghost' onClick={() => seteazaEditare(row)}>
                  Editează
                </button>
                <button type='button' className='btn btn-danger' onClick={() => setIdStergere(row.id)}>
                  Șterge
                </button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmModal
        deschis={Boolean(idStergere)}
        titlu='Ștergere concurs'
        descriere='Ești sigur că vrei să ștergi acest concurs? Acțiunea va elimina și problemele asociate.'
        textConfirmare='Șterge concurs'
        onConfirm={stergeConcurs}
        onCancel={() => setIdStergere(null)}
      />
    </div>
  );
}
