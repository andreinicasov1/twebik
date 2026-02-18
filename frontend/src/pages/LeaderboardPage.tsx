import { useEffect, useState } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { commonService } from '../services/admin.service';
import type { LeaderboardEntry } from '../types';

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    commonService.leaderboard().then(setData).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neon-300 mb-1">Clasament</h1>
      <p className="text-cyber-muted mb-6">Top utilizatori după XP-ul total.</p>

      {loading ? <Spinner /> : (
        <div className="cyber-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cyber-panel2 text-cyber-muted">
              <tr>
                <th className="text-left px-4 py-2">#</th>
                <th className="text-left px-4 py-2">Utilizator</th>
                <th className="text-left px-4 py-2">Clan</th>
                <th className="text-right px-4 py-2">Nivel</th>
                <th className="text-right px-4 py-2">XP</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-cyber-muted">Nu există încă utilizatori.</td></tr>
              ) : data.map((u, i) => (
                <tr key={u.userId} className="border-t border-cyber-border">
                  <td className="px-4 py-2 text-neon-400">{i === 0 ? '🏆' : i + 1}</td>
                  <td className="px-4 py-2 text-cyber-text">{u.username}</td>
                  <td className="px-4 py-2 text-cyber-muted">{u.clanName || '—'}</td>
                  <td className="px-4 py-2 text-right">{u.level}</td>
                  <td className="px-4 py-2 text-right text-neon-300 font-semibold">{u.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
