import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { newsService } from '../../services/news.service';
import type { News } from '../../types';
import { formatDateTime } from '../../utils/format';

const empty = { title: '', content: '' };

export default function AdminNews() {
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => { setLoading(true); setItems(await newsService.list()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (n: News) => { setEditId(n.id); setForm({ title: n.title, content: n.content }); setOpen(true); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (editId == null) await newsService.create(form);
    else await newsService.update(editId, form);
    toast.success('Salvat'); setOpen(false); await load();
  };
  const remove = async (id: number) => {
    if (!confirm('Șterge?')) return;
    await newsService.remove(id);
    toast.success('Șters'); await load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-neon-300">Gestionare Noutăți</h1>
        <button className="cyber-btn-solid" onClick={openNew}>+ Postare nouă</button>
      </div>
      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n.id} className="cyber-card p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-neon-300 font-semibold">{n.title}</h3>
                  <div className="text-xs text-cyber-muted">{formatDateTime(n.createdAt)}</div>
                  <p className="text-sm text-cyber-text mt-2 whitespace-pre-wrap">{n.content}</p>
                </div>
                <div className="shrink-0 space-x-2">
                  <button onClick={() => openEdit(n)} className="cyber-btn text-xs py-1">Editează</button>
                  <button onClick={() => remove(n.id)} className="cyber-btn text-xs py-1 border-red-500/50 text-red-400">Șterge</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="cyber-card p-6 text-center text-cyber-muted">Nu există postări.</div>}
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Editează' : 'Postare nouă'}>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="cyber-label">Titlu</label>
            <input className="cyber-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="cyber-label">Conținut</label>
            <textarea className="cyber-input min-h-[140px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="cyber-btn">Anulează</button>
            <button className="cyber-btn-solid">Salvează</button></div>
        </form>
      </Modal>
    </div>
  );
}
