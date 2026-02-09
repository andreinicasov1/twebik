import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/context/auth-context';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: '▣' },
  { to: '/exercises', label: 'Exerciții', icon: '◆' },
  { to: '/clans', label: 'Clanuri', icon: '♖' },
  { to: '/achievements', label: 'Realizări', icon: '★' },
  { to: '/leaderboard', label: 'Clasament', icon: '⇡' },
  { to: '/news', label: 'Noutăți', icon: '✎' },
  { to: '/profile', label: 'Profil', icon: '◉' },
  { to: '/contact', label: 'Contact', icon: '✉' },
];

export function Sidebar() {
  const { isAdmin } = useAuth();
  return (
    <aside className="hidden md:flex md:flex-col w-64 min-h-screen bg-cyber-panel border-r border-cyber-border p-4 gap-1 sticky top-0">
      <div className="text-[10px] uppercase text-cyber-muted mb-2 tracking-widest">Platformă</div>
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          className={({ isActive }) =>
            `cyber-sidebar-item ${isActive ? 'cyber-sidebar-item-active' : ''}`
          }
        >
          <span className="w-5 text-center text-neon-400">{it.icon}</span>
          <span>{it.label}</span>
        </NavLink>
      ))}
      {isAdmin && (
        <>
          <div className="mt-4 text-[10px] uppercase text-cyber-muted mb-2 tracking-widest">Administrare</div>
          <NavLink to="/admin" className={({ isActive }) =>
            `cyber-sidebar-item ${isActive ? 'cyber-sidebar-item-active' : ''}`}>
            <span className="w-5 text-center text-neon-400">⚙</span>
            <span>Admin Panel</span>
          </NavLink>
        </>
      )}
    </aside>
  );
}
