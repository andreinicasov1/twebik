import { BellRing, ChartSpline, Trophy } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { CardStat } from '../../components';
import type { Notificare } from '../../types';
import { formatDate } from '../../utils';

interface UserDashboardSectionProps {
  rating: number;
  pozitie: number;
  active: number;
  inCurand: number;
  rezultate: number;
  notificari: Notificare[];
}

const evolutieDemo = [
  { luna: 'Oct', rating: 1480 },
  { luna: 'Noi', rating: 1540 },
  { luna: 'Dec', rating: 1600 },
  { luna: 'Ian', rating: 1715 },
  { luna: 'Feb', rating: 1820 },
];

export function UserDashboardSection({ rating, pozitie, active, inCurand, rezultate, notificari }: UserDashboardSectionProps) {
  return (
    <section className='stack-lg'>
      <div className='grid cols-3'>
        <CardStat titlu='Rating curent' valoare={rating} descriere='Creștere față de luna trecută' icon={<ChartSpline />} />
        <CardStat titlu='Poziție globală' valoare={`#${pozitie}`} descriere='Clasamentul general al platformei' icon={<Trophy />} />
        <CardStat titlu='Rezultatele mele' valoare={rezultate} descriere='Trimiteri înregistrate' icon={<BellRing />} />
      </div>

      <div className='grid cols-2'>
        <article className='card chart-card'>
          <h3>Evoluția ratingului</h3>
          <div className='chart-box'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={evolutieDemo}>
                <defs>
                  <linearGradient id='gradientRating' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#36D1FF' stopOpacity={0.9} />
                    <stop offset='100%' stopColor='#36D1FF' stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey='luna' stroke='#95a2c6' />
                <YAxis stroke='#95a2c6' />
                <Tooltip />
                <Area dataKey='rating' stroke='#36D1FF' fill='url(#gradientRating)' strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className='chart-footer'>
            <span>Concursuri active: {active}</span>
            <span>În curând: {inCurand}</span>
          </div>
        </article>

        <article className='card'>
          <h3>Notificări recente</h3>
          {notificari.length === 0 ? (
            <p className='muted'>Nu ai notificări noi.</p>
          ) : (
            <ul className='notification-list'>
              {notificari.map((item) => (
                <li key={item.id}>
                  <p>{item.mesaj}</p>
                  <small>{formatDate(item.creatLa)}</small>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
