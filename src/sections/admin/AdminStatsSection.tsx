import { BellRing, Send, ShieldCheck, Users } from 'lucide-react';

import { CardStat } from '../../components';

interface AdminStatsSectionProps {
  numarUtilizatori: number;
  concursuriActive: number;
  trimiteriAzi: number;
  raportariDeschise: number;
}

export function AdminStatsSection({
  numarUtilizatori,
  concursuriActive,
  trimiteriAzi,
  raportariDeschise,
}: AdminStatsSectionProps) {
  return (
    <section className='grid cols-4'>
      <CardStat titlu='Utilizatori' valoare={numarUtilizatori} icon={<Users />} />
      <CardStat titlu='Concursuri active' valoare={concursuriActive} icon={<ShieldCheck />} />
      <CardStat titlu='Trimiteri azi' valoare={trimiteriAzi} icon={<Send />} />
      <CardStat titlu='Raportări deschise' valoare={raportariDeschise} icon={<BellRing />} />
    </section>
  );
}
