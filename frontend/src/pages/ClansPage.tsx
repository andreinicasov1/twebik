import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { clansService } from '../services/clans.service';
import type { Clan, ClanLeaderboardEntry } from '../types';
import { useAuth } from '../auth/context/auth-context';

export default function ClansPage() {
  const { user, refresh } = useAuth();
  const [clans, setClans] = useState<Clan[]>([]);
  const [board, setBoard] = useState<ClanLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const load = async () => {
    setLoading(true);
    const [c, b] = await Promise.all([clansService.list(), clansService.leaderboard()]);
    setClans(c); setBoard(b);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name) { toast.error('Numele este obligatoriu'); return; }
    await clansService.create({ name, description: desc });
    toast.success('Clan creat');
    setOpenCreate(false); setName(''); setDesc('');
    await load();
  };

  const onJoin = async (id: number) => {
    await clansService.join(id);
    toast.success('Te-ai alăturat clanului');
    await refresh(); await load();
  };

  const onLeave = async () => {
    await clansService.leave();
    toast.success('Ai părăsit clanul');
    await refresh(); await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neon-300 mb-1">Clanuri</h1>
          <p className="text-cyber-muted">Creează sau alătură-te unui clan pentru provocări de grup.</p>
        </div>
        <div className="flex gap-2">
          {user?.clanId ? (
            <button onClick={onLeave} className="cyber-btn">Părăsește clanul</button>
          ) : (
            <button onClick={() => setOpenCreate(true)} className="cyber-btn-solid">Creează clan</button>
          )}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
            {clans.map((c) => (
              <div key={c.id} className="cyber-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-neon-300 font-semibold">{c.name}</h3>
                  <span className="text-xs text-cyber-muted">{c.memberCount} membri</span>
                </div>
                <p className="text-sm text-cyber-muted mb-3">{c.description || 'Fără descriere'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neon-400">{c.totalXp} XP total</span>
                  {user && !user.clanId && (
                    <button onClick={() => onJoin(c.id)} className="cyber-btn text-xs py-1">Alătură-te</button>
                  )}
                  {user?.clanId === c.id && (
                    <span className="cyber-badge">Clanul tău</span>
                  )}
                </div>
              </div>
            ))}
            {clans.length === 0 && (
              <div className="col-span-full cyber-card p-6 text-center text-cyber-muted">
                Nu există încă niciun clan. Creează unul!
              </div>
            )}
          </div>

          <div className="cyber-card p-4 h-fit">
            <h3 className="text-neon-300 font-semibold mb-3">Top clanuri</h3>
            <ol className="space-y-2 text-sm">
              {board.length === 0 ? <li className="text-cyber-muted">—</li> : board.map((b, i) => (
                <li key={b.clanId} className="flex items-center justify-between">
                  <span><span className="text-neon-400 mr-2">#{i + 1}</span>{b.name}</span>
                  <span className="text-neon-300 font-semibold">{b.totalXp} XP</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="Creează clan">
        <form onSubmit={onCreate} className="space-y-3">
          <div>
            <label className="cyber-label">Nume clan</label>
            <input className="cyber-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="cyber-label">Descriere</label>
            <textarea className="cyber-input" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpenCreate(false)} className="cyber-btn">Anulează</button>
            <button type="submit" className="cyber-btn-solid">Creează</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
