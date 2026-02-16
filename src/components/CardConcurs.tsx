import { CalendarClock, Flag, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Contest } from '../types';
import { formatDate } from '../utils';

interface CardConcursProps {
  concurs: Contest;
}

const eticheteStare: Record<Contest['stare'], string> = {
  activ: 'Activ',
  in_curand: 'În curând',
  terminat: 'Terminat',
};

const eticheteDificultate: Record<Contest['dificultate'], string> = {
  usor: 'Ușor',
  mediu: 'Mediu',
  greu: 'Greu',
};

const eticheteTip: Record<Contest['tip'], string> = {
  individual: 'Individual',
  echipe: 'Echipe',
};

export function CardConcurs({ concurs }: CardConcursProps) {
  return (
    <article className='card contest-card fade-in'>
      <div className='contest-head'>
        <h3>{concurs.titlu}</h3>
        <span className={`pill pill-${concurs.stare}`}>{eticheteStare[concurs.stare]}</span>
      </div>

      <p>{concurs.descriere}</p>

      <div className='contest-meta'>
        <span>
          <Flag size={14} /> {eticheteDificultate[concurs.dificultate]}
        </span>
        <span>
          <Trophy size={14} /> {eticheteTip[concurs.tip]}
        </span>
        <span>
          <CalendarClock size={14} /> {formatDate(concurs.startLa)}
        </span>
      </div>

      <Link to={`/concursuri/${concurs.id}`} className='btn btn-primary'>
        Vezi detalii
      </Link>
    </article>
  );
}
