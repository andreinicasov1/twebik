import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from '../components/ui/Spinner';
import { challengesService } from '../services/challenges.service';
import type { Challenge } from '../types';
import { difficultyColor, difficultyLabel } from '../utils/format';

const CATEGORIES = ['Toate', 'Securitate Web', 'Securitate Rețea', 'Criptografie'];

export default function ExercisesPage() {
  const [all, setAll] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('Toate');
  const [q, setQ] = useState('');

  useEffect(() => {
    challengesService.list().then(setAll).finally(() => setLoading(false));
  }, []);

  const list = useMemo(() => {
    return all.filter((c) =>
      (cat === 'Toate' || c.category === cat) &&
      (q === '' || c.title.toLowerCase().includes(q.toLowerCase()))
    );
  }, [all, cat, q]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neon-300 mb-1">Exerciții</h1>
      <p className="text-cyber-muted mb-6">Alege o categorie și rezolvă provocări pentru a câștiga XP.</p>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1 rounded border text-sm ${cat === c
              ? 'border-neon-400 text-neon-300 bg-neon-500/10'
              : 'border-cyber-border text-cyber-muted hover:text-neon-300'}`}
          >{c}</button>
        ))}
        <input
          className="cyber-input max-w-xs ml-auto"
          placeholder="Caută exercițiu..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? <Spinner /> : (
        list.length === 0 ? (
          <div className="cyber-card p-6 text-center text-cyber-muted">Nu există exerciții pentru acest filtru.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((c) => (
              <Link to={`/exercises/${c.id}`} key={c.id}
                className="cyber-card p-4 hover:border-neon-400 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="cyber-badge">{c.category}</span>
                  <span className={`text-xs border rounded px-2 py-0.5 ${difficultyColor(c.difficulty)}`}>
                    {difficultyLabel(c.difficulty)}
                  </span>
                </div>
                <h3 className="text-neon-300 font-semibold mb-1">{c.title}</h3>
                <p className="text-sm text-cyber-muted line-clamp-2">{c.description}</p>
                <div className="mt-3 text-xs text-neon-400">+{c.xpReward} XP</div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
