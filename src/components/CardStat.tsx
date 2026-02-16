import type { ReactNode } from 'react';

interface CardStatProps {
  titlu: string;
  valoare: string | number;
  descriere?: string;
  icon?: ReactNode;
}

export function CardStat({ titlu, valoare, descriere, icon }: CardStatProps) {
  return (
    <article className='card stat-card fade-in'>
      <div className='stat-head'>
        <span>{titlu}</span>
        {icon ? <span className='stat-icon'>{icon}</span> : null}
      </div>
      <h3>{valoare}</h3>
      {descriere ? <p>{descriere}</p> : null}
    </article>
  );
}
