import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Spinner } from '../components/ui/Spinner';
import { challengesService } from '../services/challenges.service';
import type { Challenge } from '../types';
import { difficultyColor, difficultyLabel } from '../utils/format';
import { useAuth } from '../auth/context/auth-context';

export default function ExerciseDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { refresh } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    challengesService.byId(id).then(setItem).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!item) return (
    <div className="cyber-card p-6 text-center text-cyber-muted">
      Exercițiul nu a fost găsit. <Link to="/exercises" className="cyber-link">Înapoi</Link>
    </div>
  );

  const submit = async () => {
    if (!answer.trim()) { toast.error('Introdu un răspuns'); return; }
    try {
      setSubmitting(true);
      const result = await challengesService.submit(item.id, answer.trim());
      if (result.isCorrect) {
        toast.success(`Răspuns corect! +${result.xpGained} XP`);
        await refresh();
        navigate('/exercises');
      } else {
        toast.error(result.message || 'Răspuns greșit. Încearcă din nou.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link to="/exercises" className="cyber-link text-sm">← Înapoi la exerciții</Link>
      <div className="cyber-card p-6 mt-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className="cyber-badge">{item.category}</span>
          <span className={`text-xs border rounded px-2 py-0.5 ${difficultyColor(item.difficulty)}`}>
            {difficultyLabel(item.difficulty)}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-neon-300 mb-2">{item.title}</h1>
        <p className="text-cyber-text whitespace-pre-wrap leading-relaxed">{item.description}</p>
        <div className="mt-3 text-xs text-neon-400">Recompensă: +{item.xpReward} XP</div>
      </div>

      <div className="cyber-card p-6 mt-4">
        <label className="cyber-label">Răspunsul tău</label>
        <input className="cyber-input mb-3" value={answer} onChange={(e) => setAnswer(e.target.value)}
               placeholder="Scrie răspunsul aici..." />
        <button onClick={submit} disabled={submitting} className="cyber-btn-solid">
          {submitting ? 'Se trimite...' : 'Trimite răspuns'}
        </button>
      </div>
    </div>
  );
}
