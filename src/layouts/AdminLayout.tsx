import { Flag, LayoutDashboard, Shield, UsersRound, Wrench } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AppNavbar, AppSidebar } from '../components';

const linkuriTop = [
  { label: 'Panou', to: '/admin' },
  { label: 'Utilizatori', to: '/admin/utilizatori' },
  { label: 'Concursuri', to: '/admin/concursuri' },
  { label: 'Probleme', to: '/admin/probleme' },
  { label: 'Raportări', to: '/admin/raportari' },
];

const itemeSidebar = [
  { label: 'Panou general', to: '/admin', icon: LayoutDashboard },
  { label: 'Gestionare utilizatori', to: '/admin/utilizatori', icon: UsersRound },
  { label: 'Gestionare concursuri', to: '/admin/concursuri', icon: Shield },
  { label: 'Gestionare probleme', to: '/admin/probleme', icon: Wrench },
  { label: 'Moderare raportări', to: '/admin/raportari', icon: Flag },
];

export function AdminLayout() {
  const [deschis, setDeschis] = useState(false);

  return (
    <div className='app-shell'>
      <AppNavbar links={linkuriTop} onMenuClick={() => setDeschis(true)} />
      <div className='layout-body'>
        <AppSidebar titlu='Panou administrare' items={itemeSidebar} deschis={deschis} onClose={() => setDeschis(false)} />
        <main className='main-content'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
