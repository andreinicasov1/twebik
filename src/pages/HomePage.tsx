import { ArrowRight, Sparkles, Trophy, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { mockApi } from '../axios';
import { CardConcurs, SkeletonCard } from '../components';
import type { Contest } from '../types';

export function HomePage() {
  const { t } = useTranslation();
  const [concursuri, setConcursuri] = useState<Contest[]>([]);
  const [seIncarca, setSeIncarca] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await mockApi.getConcursuri({ stare: 'activ' });
        if (mounted) {
          setConcursuri(data.slice(0, 3));
        }
      } finally {
        if (mounted) {
          setSeIncarca(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className='stack-xl'>
      <section className='hero-card fade-in'>
        <span className='hero-chip'>
          <Sparkles size={14} /> Platformă nivel produs real
        </span>
        <h1>{t('landing.heroTitlu')}</h1>
        <p>{t('landing.heroText')}</p>
        <div className='hero-actions'>
          <Link to='/autentificare' className='btn btn-primary'>
            {t('landing.ctaPrimar')} <ArrowRight size={16} />
          </Link>
          <Link to='/concursuri' className='btn btn-ghost'>
            {t('landing.ctaSecundar')}
          </Link>
        </div>
      </section>

      <section className='grid cols-3'>
        <article className='card info-card'>
          <Trophy size={20} />
          <h3>Competiții live</h3>
          <p>Participă la concursuri individuale sau în echipă cu scoring dinamic.</p>
        </article>
        <article className='card info-card'>
          <UsersRound size={20} />
          <h3>Comunitate competitivă</h3>
          <p>Conectează-te cu programatori avansați și urcă în clasamentul global.</p>
        </article>
        <article className='card info-card'>
          <Sparkles size={20} />
          <h3>Experiență premium</h3>
          <p>UI modern, filtre rapide, notificări și administrare completă.</p>
        </article>
      </section>

      <section className='stack-md'>
        <div className='section-head'>
          <h2>Concursuri active</h2>
          <Link to='/concursuri' className='btn btn-ghost'>
            Vezi toate
          </Link>
        </div>
        <div className='grid cols-3'>
          {seIncarca
            ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
            : concursuri.map((item) => <CardConcurs key={item.id} concurs={item} />)}
        </div>
      </section>
    </div>
  );
}
