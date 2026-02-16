import { Award, ChartNoAxesColumn, UserCircle2 } from 'lucide-react';

import type { User } from '../../types';

interface ProfileHeaderSectionProps {
  user: User;
}

export function ProfileHeaderSection({ user }: ProfileHeaderSectionProps) {
  return (
    <section className='card profile-head'>
      <div className='profile-main'>
        <UserCircle2 size={64} />
        <div>
          <h2>{user.nickname}</h2>
          <p>{user.nume}</p>
          <small>{user.email}</small>
        </div>
      </div>

      <div className='profile-stats'>
        <span>
          <ChartNoAxesColumn size={14} /> Rating: {user.rating}
        </span>
        <span>
          <Award size={14} /> Concursuri câștigate: {user.concursuriCastigate}
        </span>
      </div>
    </section>
  );
}
