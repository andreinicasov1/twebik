import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { clansService } from '../../services/clans.service';
import type { Clan } from '../../types';

export default function AdminClans() {
  const [items, setItems] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const load = async () => { setLoading(true); setItems(await clansService.list()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (!name) { toast.error('Nume obligatoriu'); return; }
    await clansService.create({ name, description: desc });
    toast.success('Clan creat');
    setOpen(false); setName(''); setDesc('');
    await load();
  };
  const remove = async (id: number) => {
    if (!confirm('Șterge clanul?')) return;
    await clansService.remove(id);
    toast.success('Șters');
    await load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-neon-300">Gestionare Clanuri</h1>
        <button className="cyber-btn-solid" onClick={() => setOpen(true)}>+ Clan nou</button>
      </div>
      {loading ? <Spinner /> : (
        <div className="cyber-card overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-cyber-panel2 text-cyber-muted">
              <tr>
                <th className="text-left px-4 py-2">Nume</th>
                <th className="text-left px-4 py-2">Descriere</th>
                <th className="text-right px-4 py-2">Membri</th>
                <th className="text-right px-4 py-2">XP</th>
                <th className="text-right px-4 py-2">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-cyber-border">
                  <td className="px-4 py-2 text-cyber-text">{c.name}</td>
                  <td className="px-4 py-2 text-cyber-muted">{c.description || '—'}</td>
                  <td className="px-4 py-2 text-right">{c.memberCount}</td>
                  <td className="px-4 py-2 text-right text-neon-300">{c.totalXp}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => remove(c.id)} className="cyber-btn text-xs py-1 border-red-500/50 text-red-400">Șterge</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-cyber-muted">Niciun clan.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Creează clan">
        <form onSubmit={create} className="space-y-3">
          <div><label className="cyber-label">Nume</label>
            <input className="cyber-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="cyber-label">Descriere</label>
            <textarea className="cyber-input" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="cyber-btn">Anulează</button>
            <button className="cyber-btn-solid">Creează</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
