import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { challengesService } from '../../services/challenges.service';
import { clansService } from '../../services/clans.service';
import type { Challenge, ChallengeAdmin, Clan } from '../../types';

const CATS = ['Securitate Web', 'Securitate Rețea', 'Criptografie'];
const DIFFS: Array<'usor' | 'mediu' | 'greu'> = ['usor', 'mediu', 'greu'];

type Form = Omit<ChallengeAdmin, 'id'>;
const empty: Form = {
  title: '', description: '', category: CATS[0], difficulty: 'usor',
  correctAnswer: '', xpReward: 50, clanId: null, isClanOnly: false,
};

export default function AdminChallenges() {
  const [items, setItems] = useState<Challenge[]>([]);
  const [clans, setClans] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(empty);

  const load = async () => {
    setLoading(true);
    const [c, cls] = await Promise.all([challengesService.list(), clansService.list()]);
    setItems(c); setClans(cls); setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (c: Challenge) => {
    setEditId(c.id);
    setForm({ ...(c as ChallengeAdmin), correctAnswer: (c as any).correctAnswer ?? '' });
    setOpen(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editId == null) {
        await challengesService.create(form);
        toast.success('Exercițiu creat');
      } else {
        await challengesService.update(editId, form);
        toast.success('Exercițiu actualizat');
      }
      setOpen(false);
      await load();
    } catch { /* toast via interceptor */ }
  };

  const remove = async (id: number) => {
    if (!confirm('Sigur ștergi exercițiul?')) return;
    await challengesService.remove(id);
    toast.success('Șters');
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-neon-300">Gestionare Exerciții</h1>
        <button onClick={openNew} className="cyber-btn-solid">+ Adaugă exercițiu</button>
      </div>

      {loading ? <Spinner /> : (
        <div className="cyber-card overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-cyber-panel2 text-cyber-muted">
              <tr>
                <th className="text-left px-4 py-2">Titlu</th>
                <th className="text-left px-4 py-2">Categorie</th>
                <th className="text-left px-4 py-2">Dificultate</th>
                <th className="text-right px-4 py-2">XP</th>
                <th className="text-left px-4 py-2">Clan</th>
                <th className="text-right px-4 py-2">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-cyber-border">
                  <td className="px-4 py-2 text-cyber-text">{c.title}</td>
                  <td className="px-4 py-2 text-cyber-muted">{c.category}</td>
                  <td className="px-4 py-2 text-cyber-muted">{c.difficulty}</td>
                  <td className="px-4 py-2 text-right text-neon-300">{c.xpReward}</td>
                  <td className="px-4 py-2 text-cyber-muted">{c.clanId ? clans.find(x => x.id === c.clanId)?.name : '—'}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button onClick={() => openEdit(c)} className="cyber-btn text-xs py-1">Editează</button>
                    <button onClick={() => remove(c.id)} className="cyber-btn text-xs py-1 border-red-500/50 text-red-400">Șterge</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-cyber-muted">Niciun exercițiu.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Editează exercițiu' : 'Exercițiu nou'}>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="cyber-label">Titlu</label>
            <input className="cyber-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="cyber-label">Descriere</label>
            <textarea className="cyber-input min-h-[90px]" value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="cyber-label">Categorie</label>
              <select className="cyber-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="cyber-label">Dificultate</label>
              <select className="cyber-input" value={form.difficulty}
                      onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}>
                {DIFFS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="cyber-label">Răspuns corect</label>
              <input className="cyber-input" value={form.correctAnswer}
                     onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} />
            </div>
            <div>
              <label className="cyber-label">XP</label>
              <input type="number" className="cyber-input" value={form.xpReward}
                     onChange={(e) => setForm({ ...form, xpReward: Number(e.target.value) })} />
            </div>
            <div>
              <label className="cyber-label">Clan (opțional)</label>
              <select className="cyber-input" value={form.clanId ?? ''}
                      onChange={(e) => setForm({ ...form, clanId: e.target.value ? Number(e.target.value) : null })}>
                <option value="">— Fără —</option>
                {clans.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-cyber-text">
                <input type="checkbox" checked={form.isClanOnly}
                       onChange={(e) => setForm({ ...form, isClanOnly: e.target.checked })} />
                Doar pentru clan
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="cyber-btn">Anulează</button>
            <button type="submit" className="cyber-btn-solid">Salvează</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
