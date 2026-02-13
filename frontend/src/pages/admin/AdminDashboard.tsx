import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from '../../components/ui/Spinner';
import { adminService } from '../../services/admin.service';
import type { AdminStats } from '../../types';
import { formatDateTime } from '../../utils/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.stats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return null;

  const cards = [
    { label: 'Utilizatori', value: stats.usersCount, link: '/admin/users' },
    { label: 'Exerciții', value: stats.challengesCount, link: '/admin/challenges' },
    { label: 'Submissions', value: stats.submissionsCount, link: '#' },
  ];

  const sections = [
    { label: 'Exerciții', to: '/admin/challenges', icon: '◆' },
    { label: 'Utilizatori', to: '/admin/users', icon: '◉' },
    { label: 'Clanuri', to: '/admin/clans', icon: '♖' },
    { label: 'Realizări', to: '/admin/achievements', icon: '★' },
    { label: 'Noutăți', to: '/admin/news', icon: '✎' },
    { label: 'Mesaje', to: '/admin/messages', icon: '✉' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neon-300 mb-1">Admin Panel</h1>
      <p className="text-cyber-muted mb-6">Control total asupra platformei.</p>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Link to={c.link} key={c.label} className="cyber-card p-4 hover:border-neon-400">
            <div className="text-xs uppercase text-cyber-muted">{c.label}</div>
            <div className="text-2xl font-bold mt-1 text-neon-300">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-8">
        {sections.map((s) => (
          <Link to={s.to} key={s.to} className="cyber-card p-4 flex items-center gap-3 hover:border-neon-400">
            <span className="text-2xl text-neon-400">{s.icon}</span>
            <span className="font-semibold">{s.label}</span>
          </Link>
        ))}
      </div>

      <div className="cyber-card p-5">
        <h2 className="text-lg font-semibold text-neon-300 mb-3">Activitate recentă globală</h2>
        {stats.recentActivity.length === 0 ? (
          <p className="text-cyber-muted">Nu există activitate.</p>
        ) : (
          <ul className="divide-y divide-cyber-border">
            {stats.recentActivity.map((s) => (
              <li key={s.id} className="py-2 text-sm flex justify-between">
                <span className="text-cyber-text">{s.username || 'Utilizator'} → {s.challengeTitle || `#${s.challengeId}`}</span>
                <span className={s.isCorrect ? 'text-neon-300' : 'text-red-400'}>
                  {s.isCorrect ? 'Corect' : 'Greșit'} · {formatDateTime(s.submittedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
