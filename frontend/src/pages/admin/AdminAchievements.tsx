import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { achievementsService } from '../../services/achievements.service';
import type { Achievement } from '../../types';

const empty = { title: '', description: '', xpRequired: 100 };

export default function AdminAchievements() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => { setLoading(true); setItems(await achievementsService.list()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (a: Achievement) => { setEditId(a.id); setForm({ title: a.title, description: a.description, xpRequired: a.xpRequired }); setOpen(true); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (editId == null) await achievementsService.create(form);
    else await achievementsService.update(editId, form);
    toast.success('Salvat');
    setOpen(false);
    await load();
  };
  const remove = async (id: number) => {
    if (!confirm('Șterge?')) return;
    await achievementsService.remove(id);
    toast.success('Șters'); await load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-neon-300">Gestionare Realizări</h1>
        <button className="cyber-btn-solid" onClick={openNew}>+ Realizare nouă</button>
      </div>
      {loading ? <Spinner /> : (
        <div className="cyber-card overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-cyber-panel2 text-cyber-muted">
              <tr>
                <th className="text-left px-4 py-2">Titlu</th>
                <th className="text-left px-4 py-2">Descriere</th>
                <th className="text-right px-4 py-2">XP cerut</th>
                <th className="text-right px-4 py-2">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-t border-cyber-border">
                  <td className="px-4 py-2">{a.title}</td>
                  <td className="px-4 py-2 text-cyber-muted">{a.description}</td>
                  <td className="px-4 py-2 text-right text-neon-300">{a.xpRequired}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button onClick={() => openEdit(a)} className="cyber-btn text-xs py-1">Editează</button>
                    <button onClick={() => remove(a.id)} className="cyber-btn text-xs py-1 border-red-500/50 text-red-400">Șterge</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-cyber-muted">—</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Editează' : 'Realizare nouă'}>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="cyber-label">Titlu</label>
            <input className="cyber-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="cyber-label">Descriere</label>
            <textarea className="cyber-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><label className="cyber-label">XP necesar</label>
            <input type="number" className="cyber-input" value={form.xpRequired} onChange={(e) => setForm({ ...form, xpRequired: Number(e.target.value) })} /></div>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="cyber-btn">Anulează</button>
            <button className="cyber-btn-solid">Salvează</button></div>
        </form>
      </Modal>
    </div>
  );
}
