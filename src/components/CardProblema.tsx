import { Link } from 'react-router-dom';

import type { Problem } from '../types';

interface CardProblemaProps {
  problema: Problem;
}

const eticheteDificultate: Record<Problem['dificultate'], string> = {
  usor: 'Ușor',
  mediu: 'Mediu',
  greu: 'Greu',
};

export function CardProblema({ problema }: CardProblemaProps) {
  return (
    <article className='card problem-card fade-in'>
      <div className='problem-head'>
        <h4>{problema.titlu}</h4>
        <span className='pill pill-soft'>{eticheteDificultate[problema.dificultate]}</span>
      </div>
      <p>{problema.enunt}</p>
      <div className='problem-tags'>
        {problema.taguri.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
      <div className='problem-footer'>
        <strong>{problema.punctaj} puncte</strong>
        <Link to={`/probleme/${problema.id}`} className='btn btn-ghost'>
          Rezolvă
        </Link>
      </div>
    </article>
  );
}
