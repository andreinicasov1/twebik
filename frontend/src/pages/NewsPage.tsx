import { useEffect, useState } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { newsService } from '../services/news.service';
import type { News } from '../types';
import { formatDateTime } from '../utils/format';

export default function NewsPage() {
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsService.list().then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neon-300 mb-1">Noutăți</h1>
      <p className="text-cyber-muted mb-6">Anunțuri și actualizări de la echipa CyberTrain.</p>

      {loading ? <Spinner /> : items.length === 0 ? (
        <div className="cyber-card p-6 text-center text-cyber-muted">Nu există anunțuri publicate.</div>
      ) : (
        <div className="space-y-4">
          {items.map((n) => (
            <article key={n.id} className="cyber-card p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-neon-300">{n.title}</h2>
                <span className="text-xs text-cyber-muted">{formatDateTime(n.createdAt)}</span>
              </div>
              <p className="text-cyber-text whitespace-pre-wrap">{n.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
