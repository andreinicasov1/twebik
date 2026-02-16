import { Gauge, Medal, Trophy, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AppNavbar, AppSidebar } from '../components';

const linkuriTop = [
  { label: 'Acasă', to: '/' },
  { label: 'Concursuri', to: '/concursuri' },
  { label: 'Clasament', to: '/clasament' },
];

const itemeSidebar = [
  { label: 'Panou', to: '/panou', icon: Gauge },
  { label: 'Concursuri', to: '/concursuri', icon: Trophy },
  { label: 'Clasament', to: '/clasament', icon: Medal },
  { label: 'Profil', to: '/profil', icon: UserRound },
];

export function UserLayout() {
  const [deschis, setDeschis] = useState(false);

  return (
    <div className='app-shell'>
      <AppNavbar links={linkuriTop} onMenuClick={() => setDeschis(true)} />
      <div className='layout-body'>
        <AppSidebar titlu='Navigare utilizator' items={itemeSidebar} deschis={deschis} onClose={() => setDeschis(false)} />
        <main className='main-content'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
