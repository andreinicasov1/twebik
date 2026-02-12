import { useEffect, useState } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { achievementsService } from '../services/achievements.service';
import type { Achievement, UserAchievement } from '../types';
import { useAuth } from '../auth/context/auth-context';

export default function AchievementsPage() {
  const { user } = useAuth();
  const [all, setAll] = useState<Achievement[]>([]);
  const [mine, setMine] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([achievementsService.list(), achievementsService.mine()])
      .then(([a, m]) => { setAll(a); setMine(m); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  const unlocked = new Set(mine.map((m) => m.achievementId));
  const xp = user?.xp ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neon-300 mb-1">Realizări</h1>
      <p className="text-cyber-muted mb-6">Deblochează realizări pe măsură ce acumulezi XP.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {all.map((a) => {
          const done = unlocked.has(a.id);
          const progress = Math.min(100, Math.round((xp / a.xpRequired) * 100));
          return (
            <div key={a.id} className={`cyber-card p-4 ${done ? 'border-neon-400' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-2xl ${done ? 'text-neon-300' : 'text-cyber-muted'}`}>★</span>
                <h3 className={`font-semibold ${done ? 'text-neon-300' : 'text-cyber-text'}`}>{a.title}</h3>
              </div>
              <p className="text-xs text-cyber-muted mb-3">{a.description}</p>
              <div className="h-1.5 bg-cyber-panel2 rounded overflow-hidden">
                <div className="h-full bg-neon-400" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-cyber-muted">
                <span>{xp} / {a.xpRequired} XP</span>
                {done && <span className="text-neon-300">Deblocat</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
