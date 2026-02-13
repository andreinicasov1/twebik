import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/ui/Spinner';
import { contactService } from '../../services/contact.service';
import type { ContactMessage } from '../../types';
import { formatDateTime } from '../../utils/format';

export default function AdminMessages() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); setItems(await contactService.list()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const mark = async (id: number) => {
    await contactService.markResolved(id);
    toast.success('Marcat rezolvat'); await load();
  };
  const remove = async (id: number) => {
    if (!confirm('Șterge?')) return;
    await contactService.remove(id);
    toast.success('Șters'); await load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neon-300 mb-6">Mesaje Utilizatori</h1>
      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="cyber-card p-4">
              <div className="flex justify-between flex-wrap gap-2">
                <div>
                  <div className="text-cyber-text font-semibold">{m.name} <span className="text-cyber-muted text-xs">({m.email})</span></div>
                  <div className="text-xs text-cyber-muted">{formatDateTime(m.createdAt)}</div>
                </div>
                <span className={`cyber-badge ${m.status === 'rezolvat' ? '' : 'text-yellow-300 border-yellow-500/40'}`}>
                  {m.status}
                </span>
              </div>
              <p className="mt-3 text-cyber-text whitespace-pre-wrap">{m.message}</p>
              <div className="mt-3 flex gap-2">
                {m.status !== 'rezolvat' && (
                  <button onClick={() => mark(m.id)} className="cyber-btn text-xs py-1">Marchează rezolvat</button>
                )}
                <button onClick={() => remove(m.id)} className="cyber-btn text-xs py-1 border-red-500/50 text-red-400">Șterge</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="cyber-card p-6 text-center text-cyber-muted">Niciun mesaj.</div>}
        </div>
      )}
    </div>
  );
}
