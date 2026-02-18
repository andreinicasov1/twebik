import { useEffect, useState } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { achievementsService } from '../services/achievements.service';
import type { UserAchievement } from '../types';
import { useAuth } from '../auth/context/auth-context';
import { formatDate } from '../utils/format';

export default function ProfilePage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    achievementsService.mine().then(setAchievements).finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neon-300 mb-1">Profilul meu</h1>
      <p className="text-cyber-muted mb-6">Detalii cont, progres și realizări.</p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="cyber-card p-5 md:col-span-1">
          <div className="w-20 h-20 rounded-full bg-neon-500/10 border-2 border-neon-400 flex items-center justify-center text-3xl text-neon-300 mx-auto mb-3 shadow-neon">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-neon-300">{user.username}</div>
            <div className="text-xs text-cyber-muted">{user.email}</div>
            <span className="cyber-badge mt-2 inline-block">{user.rank}</span>
          </div>
        </div>
        <div className="cyber-card p-5 md:col-span-2 grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-cyber-muted uppercase">XP</div>
            <div className="text-2xl text-neon-300 font-bold">{user.xp}</div>
          </div>
          <div>
            <div className="text-xs text-cyber-muted uppercase">Nivel</div>
            <div className="text-2xl text-neon-300 font-bold">{user.level}</div>
          </div>
          <div>
            <div className="text-xs text-cyber-muted uppercase">Rol</div>
            <div className="text-2xl text-neon-300 font-bold capitalize">{user.role}</div>
          </div>
          <div className="col-span-3">
            <div className="text-xs text-cyber-muted uppercase">Clan</div>
            <div className="text-lg text-cyber-text">{user.clanName || 'Niciunul'}</div>
          </div>
        </div>
      </div>

      <div className="cyber-card p-5">
        <h2 className="text-lg font-semibold text-neon-300 mb-3">Realizări deblocate</h2>
        {loading ? <Spinner /> : achievements.length === 0 ? (
          <p className="text-cyber-muted">Nu ai deblocat nicio realizare. Rezolvă exerciții pentru a câștiga!</p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <li key={a.id} className="flex gap-3 p-3 rounded border border-neon-500/20 bg-neon-500/5">
                <div className="text-2xl text-neon-300">★</div>
                <div>
                  <div className="font-semibold text-cyber-text">{a.title}</div>
                  <div className="text-xs text-cyber-muted">{a.description}</div>
                  <div className="text-[10px] text-neon-400 mt-1">Deblocat: {formatDate(a.unlockedAt)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
