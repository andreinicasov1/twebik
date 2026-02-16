import { Menu, Shield, UserCircle2 } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

import { useAuth } from '../auth';

interface LinkItem {
  label: string;
  to: string;
}

interface AppNavbarProps {
  links: LinkItem[];
  onMenuClick?: () => void;
}

export function AppNavbar({ links, onMenuClick }: AppNavbarProps) {
  const { user, deconectare } = useAuth();

  return (
    <header className='topbar'>
      <div className='topbar-left'>
        {onMenuClick ? (
          <button className='icon-btn mobile-only' type='button' onClick={onMenuClick} aria-label='Deschide meniul'>
            <Menu size={20} />
          </button>
        ) : null}

        <Link className='brand' to='/'>
          <span className='brand-dot' />
          CodePulse Arena
        </Link>
      </div>

      <nav className='topbar-links'>
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active-link' : '')}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className='topbar-right'>
        {user?.rol === 'admin' ? (
          <Link className='admin-chip' to='/admin'>
            <Shield size={14} /> Administrare
          </Link>
        ) : null}

        {user ? (
          <>
            <Link className='user-chip' to='/profil'>
              <UserCircle2 size={16} /> {user.nickname}
            </Link>
            <button className='btn btn-ghost' type='button' onClick={deconectare}>
              Ieșire
            </button>
          </>
        ) : (
          <>
            <Link to='/autentificare' className='btn btn-ghost'>
              Autentificare
            </Link>
            <Link to='/inregistrare' className='btn btn-primary'>
              Cont nou
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
