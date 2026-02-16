import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '../../auth';
import { mockApi } from '../../axios';
import { Breadcrumbs, ConfirmModal, CustomTable, Loader } from '../../components';
import type { Contest, Dificultate, Problem } from '../../types';

interface FormularProblema {
  id?: string;
  contestId: string;
  titlu: string;
  enunt: string;
  punctaj: number;
  dificultate: Dificultate;
  taguri: string;
}

const stareInitiala: FormularProblema = {
  contestId: '',
  titlu: '',
  enunt: '',
  punctaj: 100,
  dificultate: 'mediu',
  taguri: 'array,string',
};

export function AdminProblemsPage() {
  const { token } = useAuth();
  const [concursuri, setConcursuri] = useState<Contest[]>([]);
  const [probleme, setProbleme] = useState<Problem[]>([]);
  const [seIncarca, setSeIncarca] = useState(true);
  const [formular, setFormular] = useState<FormularProblema>(stareInitiala);
  const [idStergere, setIdStergere] = useState<string | null>(null);
  const [jsonImport, setJsonImport] = useState('');

  const editing = useMemo(() => Boolean(formular.id), [formular.id]);

  const loadData = useCallback(async () => {
    if (!token) return;

    try {
      const [dataConcursuri, dataProbleme] = await Promise.all([
        mockApi.adminGetConcursuri(token),
        mockApi.adminGetProbleme(token),
      ]);

      setConcursuri(dataConcursuri);
      setProbleme(dataProbleme);

      setFormular((curent) =>
        !curent.contestId && dataConcursuri.length > 0 ? { ...curent, contestId: dataConcursuri[0].id } : curent,
      );
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut încărca datele.';
      toast.error(mesaj);
    } finally {
      setSeIncarca(false);
    }
  }, [token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const salvaProblema = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    if (!formular.contestId || !formular.titlu || !formular.enunt) {
      toast.error('Completează toate câmpurile obligatorii.');
      return;
    }

    try {
      await mockApi.adminUpsertProblema(token, {
        id: formular.id,
        contestId: formular.contestId,
        titlu: formular.titlu,
        enunt: formular.enunt,
        punctaj: formular.punctaj,
        dificultate: formular.dificultate,
        taguri: formular.taguri
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      });

      toast.success(editing ? 'Problema a fost actualizată.' : 'Problema a fost creată.');
      setFormular((curent) => ({ ...stareInitiala, contestId: curent.contestId || stareInitiala.contestId }));
      await loadData();
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut salva problema.';
      toast.error(mesaj);
    }
  };

  const seteazaEditare = (problema: Problem) => {
    setFormular({
      id: problema.id,
      contestId: problema.contestId,
      titlu: problema.titlu,
      enunt: problema.enunt,
      punctaj: problema.punctaj,
      dificultate: problema.dificultate,
      taguri: problema.taguri.join(','),
    });
  };

  const stergeProblema = async () => {
    if (!token || !idStergere) return;

    try {
      await mockApi.adminStergeProblema(token, idStergere);
      toast.success('Problema a fost ștearsă.');
      setIdStergere(null);
      await loadData();
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut șterge problema.';
      toast.error(mesaj);
    }
  };

  const exportaJSON = () => {
    const continut = JSON.stringify(probleme, null, 2);
    const blob = new Blob([continut], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'probleme-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importaJSON = async () => {
    if (!token) return;

    try {
      const list = JSON.parse(jsonImport) as Problem[];

      for (const item of list) {
        await mockApi.adminUpsertProblema(token, {
          contestId: item.contestId,
          titlu: item.titlu,
          enunt: item.enunt,
          punctaj: item.punctaj,
          dificultate: item.dificultate,
          taguri: item.taguri,
        });
      }

      toast.success('Import finalizat.');
      setJsonImport('');
      await loadData();
    } catch {
      toast.error('JSON invalid sau structură incompatibilă.');
    }
  };

  if (seIncarca) {
    return <Loader text='Încărcăm problemele...' />;
  }

  return (
    <div className='stack-lg'>
      <Breadcrumbs items={[{ label: 'Administrare' }, { label: 'Probleme' }]} />
      <h1>Gestionare probleme</h1>

      <form className='card stack-md' onSubmit={salvaProblema}>
        <h3>{editing ? 'Editare problemă' : 'Creează problemă'}</h3>

        <div className='grid cols-2'>
          <label>
            Concurs
            <select
              value={formular.contestId}
              onChange={(event) => setFormular((curent) => ({ ...curent, contestId: event.target.value }))}
            >
              {concursuri.map((concurs) => (
                <option key={concurs.id} value={concurs.id}>
                  {concurs.titlu}
                </option>
              ))}
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
        </div>

        <label>
          Titlu
          <input
            type='text'
            value={formular.titlu}
            onChange={(event) => setFormular((curent) => ({ ...curent, titlu: event.target.value }))}
          />
        </label>

        <label>
          Enunț
          <textarea
            rows={3}
            value={formular.enunt}
            onChange={(event) => setFormular((curent) => ({ ...curent, enunt: event.target.value }))}
          />
        </label>

        <div className='grid cols-2'>
          <label>
            Punctaj
            <input
              type='number'
              value={formular.punctaj}
              onChange={(event) =>
                setFormular((curent) => ({ ...curent, punctaj: Number(event.target.value) || 0 }))
              }
            />
          </label>

          <label>
            Tag-uri (separate prin virgulă)
            <input
              type='text'
              value={formular.taguri}
              onChange={(event) => setFormular((curent) => ({ ...curent, taguri: event.target.value }))}
            />
          </label>
        </div>

        <div className='row'>
          <button type='submit' className='btn btn-primary'>
            {editing ? 'Actualizează problema' : 'Adaugă problemă'}
          </button>
          {editing ? (
            <button type='button' className='btn btn-ghost' onClick={() => setFormular(stareInitiala)}>
              Anulează editarea
            </button>
          ) : null}
        </div>
      </form>

      <section className='card stack-sm'>
        <div className='section-head'>
          <h3>Import / Export JSON</h3>
          <button type='button' className='btn btn-ghost' onClick={exportaJSON}>
            Exportă JSON
          </button>
        </div>

        <textarea
          rows={6}
          value={jsonImport}
          onChange={(event) => setJsonImport(event.target.value)}
          placeholder='Lipește aici un array JSON de probleme pentru import...'
        />
        <button type='button' className='btn btn-primary' onClick={importaJSON}>
          Importă JSON
        </button>
      </section>

      <CustomTable
        date={probleme}
        coloane={[
          { key: 'titlu', label: 'Titlu', render: (row) => row.titlu },
          { key: 'concurs', label: 'Concurs', render: (row) => row.contestId },
          { key: 'dificultate', label: 'Dificultate', render: (row) => row.dificultate },
          { key: 'punctaj', label: 'Punctaj', render: (row) => row.punctaj },
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
        titlu='Ștergere problemă'
        descriere='Confirmi ștergerea problemei selectate?'
        textConfirmare='Șterge problemă'
        onConfirm={stergeProblema}
        onCancel={() => setIdStergere(null)}
      />
    </div>
  );
}
