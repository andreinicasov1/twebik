import type { Dificultate, StareConcurs, TipConcurs } from '../types';

interface FilterBarProps {
  cautare: string;
  stare: StareConcurs | 'toate';
  dificultate: Dificultate | 'toate';
  tip: TipConcurs | 'toate';
  onCautareChange: (valoare: string) => void;
  onStareChange: (valoare: StareConcurs | 'toate') => void;
  onDificultateChange: (valoare: Dificultate | 'toate') => void;
  onTipChange: (valoare: TipConcurs | 'toate') => void;
}

export function FilterBar({
  cautare,
  stare,
  dificultate,
  tip,
  onCautareChange,
  onStareChange,
  onDificultateChange,
  onTipChange,
}: FilterBarProps) {
  return (
    <div className='filter-bar'>
      <input
        type='search'
        placeholder='Caută concurs după titlu sau descriere...'
        value={cautare}
        onChange={(event) => onCautareChange(event.target.value)}
      />

      <select value={stare} onChange={(event) => onStareChange(event.target.value as StareConcurs | 'toate')}>
        <option value='toate'>Toate stările</option>
        <option value='activ'>Activ</option>
        <option value='in_curand'>În curând</option>
        <option value='terminat'>Terminat</option>
      </select>

      <select
        value={dificultate}
        onChange={(event) => onDificultateChange(event.target.value as Dificultate | 'toate')}
      >
        <option value='toate'>Toate dificultățile</option>
        <option value='usor'>Ușor</option>
        <option value='mediu'>Mediu</option>
        <option value='greu'>Greu</option>
      </select>

      <select value={tip} onChange={(event) => onTipChange(event.target.value as TipConcurs | 'toate')}>
        <option value='toate'>Toate tipurile</option>
        <option value='individual'>Individual</option>
        <option value='echipe'>Echipe</option>
      </select>
    </div>
  );
}
