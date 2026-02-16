import { Outlet } from 'react-router-dom';

import { AppNavbar } from '../components';

const linkuriPublice = [
  { label: 'Acasă', to: '/' },
  { label: 'Concursuri', to: '/concursuri' },
  { label: 'Clasament', to: '/clasament' },
];

export function PublicLayout() {
  return (
    <div className='app-shell'>
      <AppNavbar links={linkuriPublice} />
      <main className='main-content public-content'>
        <Outlet />
      </main>
    </div>
  );
}
