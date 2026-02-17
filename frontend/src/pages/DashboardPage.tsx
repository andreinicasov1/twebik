import { useEffect, useState } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { commonService } from '../services/admin.service';
import { formatDateTime } from '../utils/format';
import type { DashboardStats } from '../types';
import { useAuth } from '../auth/context/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    commonService.dashboard().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return null;

  const cards = [
    { label: 'XP Total', value: stats.xp, accent: 'text-neon-300' },
    { label: 'Nivel', value: stats.level, accent: 'text-neon-300' },
    { label: 'Exerciții rezolvate', value: stats.completed, accent: 'text-neon-300' },
    { label: 'Rank', value: user?.rank ?? '—', accent: 'text-neon-300' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neon-300 mb-1">Bun venit, {user?.username}</h1>
      <p className="text-cyber-muted mb-6">Iată o privire de ansamblu a progresului tău.</p>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="cyber-card p-4">
            <div className="text-xs uppercase text-cyber-muted">{c.label}</div>
            <div className={`text-2xl font-bold mt-1 ${c.accent}`}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="cyber-card p-5">
        <h2 className="text-lg font-semibold text-neon-300 mb-3">Activitate recentă</h2>
        {stats.recentActivity.length === 0 ? (
          <p className="text-cyber-muted">Nu ai activitate recentă. Încearcă un exercițiu!</p>
        ) : (
          <ul className="divide-y divide-cyber-border">
            {stats.recentActivity.map((s) => (
              <li key={s.id} className="py-2 flex items-center justify-between text-sm">
                <div>
                  <span className="text-cyber-text">{s.challengeTitle ?? `Exercițiu #${s.challengeId}`}</span>
                  <span className="ml-2 text-xs text-cyber-muted">{formatDateTime(s.submittedAt)}</span>
                </div>
                <span className={s.isCorrect ? 'text-neon-300' : 'text-red-400'}>
                  {s.isCorrect ? '✓ Corect' : '✗ Greșit'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
