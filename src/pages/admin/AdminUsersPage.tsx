import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '../../auth';
import { mockApi } from '../../axios';
import { Breadcrumbs, CustomTable, Loader } from '../../components';
import type { User } from '../../types';

const etichetaRol = (rol: User['rol']) => (rol === 'admin' ? 'administrator' : 'utilizator');

export function AdminUsersPage() {
  const { token } = useAuth();
  const [utilizatori, setUtilizatori] = useState<User[]>([]);
  const [seIncarca, setSeIncarca] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);
  const [ratingNou, setRatingNou] = useState('');

  const loadUtilizatori = useCallback(async () => {
    if (!token) return;

    try {
      const data = await mockApi.adminGetUtilizatori(token);
      setUtilizatori(data);
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut încărca utilizatorii.';
      toast.error(mesaj);
    } finally {
      setSeIncarca(false);
    }
  }, [token]);

  useEffect(() => {
    void loadUtilizatori();
  }, [loadUtilizatori]);

  const schimbaRol = async (user: User) => {
    if (!token) return;

    const rolNou = user.rol === 'admin' ? 'user' : 'admin';

    try {
      await mockApi.adminSetRol(token, user.id, rolNou);
      toast.success(`Rolul pentru ${user.nickname} a fost actualizat.`);
      await loadUtilizatori();
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut schimba rolul.';
      toast.error(mesaj);
    }
  };

  const toggleBan = async (user: User) => {
    if (!token) return;

    try {
      await mockApi.adminSetBan(token, user.id, !user.esteBanat);
      toast.success(user.esteBanat ? 'Utilizator deblocat.' : 'Utilizator banat.');
      await loadUtilizatori();
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Acțiunea de moderare a eșuat.';
      toast.error(mesaj);
    }
  };

  const resetareParola = async (user: User) => {
    if (!token) return;

    try {
      await mockApi.adminResetareParola(token, user.id);
      toast.success(`Parola a fost resetată pentru ${user.nickname} (temporar: Reset123!).`);
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Resetarea parolei a eșuat.';
      toast.error(mesaj);
    }
  };

  const aplicaRating = async () => {
    if (!token || !selected) return;

    const valoare = Number(ratingNou);
    if (!Number.isFinite(valoare) || valoare < 0) {
      toast.error('Introdu un rating valid.');
      return;
    }

    try {
      await mockApi.adminAjusteazaRating(token, selected.id, valoare);
      toast.success('Rating actualizat.');
      setSelected(null);
      setRatingNou('');
      await loadUtilizatori();
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut ajusta ratingul.';
      toast.error(mesaj);
    }
  };

  if (seIncarca) {
    return <Loader text='Încărcăm utilizatorii...' />;
  }

  return (
    <div className='stack-lg'>
      <Breadcrumbs items={[{ label: 'Administrare' }, { label: 'Utilizatori' }]} />
      <h1>Gestionare utilizatori</h1>

      <CustomTable
        date={utilizatori}
        coloane={[
          {
            key: 'profil',
            label: 'Profil',
            render: (row) => (
              <button type='button' className='btn btn-ghost' onClick={() => setSelected(row)}>
                {row.nickname}
              </button>
            ),
          },
          { key: 'email', label: 'Email', render: (row) => row.email },
          {
            key: 'rol',
            label: 'Rol',
            render: (row) => <span className='pill pill-soft'>{etichetaRol(row.rol)}</span>,
          },
          {
            key: 'rating',
            label: 'Rating',
            render: (row) => row.rating,
          },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (row.esteBanat ? 'Banat' : 'Activ'),
          },
          {
            key: 'actiuni',
            label: 'Acțiuni',
            render: (row) => (
              <div className='table-actions'>
                <button type='button' className='btn btn-ghost' onClick={() => schimbaRol(row)}>
                  Rol {row.rol === 'admin' ? 'utilizator' : 'administrator'}
                </button>
                <button type='button' className='btn btn-ghost' onClick={() => toggleBan(row)}>
                  {row.esteBanat ? 'Deblochează' : 'Ban'}
                </button>
                <button type='button' className='btn btn-ghost' onClick={() => resetareParola(row)}>
                  Reset parolă
                </button>
              </div>
            ),
          },
        ]}
      />

      {selected ? (
        <section className='card stack-sm'>
          <h3>Profil + activitate: {selected.nickname}</h3>
          <p>Email: {selected.email}</p>
          <p>Insigne: {selected.insigne.join(', ') || 'Nicio insignă'}</p>
          <p>Concursuri câștigate: {selected.concursuriCastigate}</p>

          <div className='row'>
            <input
              type='number'
              value={ratingNou}
              onChange={(event) => setRatingNou(event.target.value)}
              placeholder='Rating nou'
            />
            <button type='button' className='btn btn-primary' onClick={aplicaRating}>
              Ajustează rating
            </button>
            <button type='button' className='btn btn-ghost' onClick={() => setSelected(null)}>
              Închide
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
