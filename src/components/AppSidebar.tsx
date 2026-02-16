import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface AppSidebarProps {
  titlu: string;
  items: SidebarItem[];
  deschis: boolean;
  onClose: () => void;
}

export function AppSidebar({ titlu, items, deschis, onClose }: AppSidebarProps) {
  return (
    <aside className={`sidebar ${deschis ? 'open' : ''}`}>
      <div className='sidebar-head'>
        <h3>{titlu}</h3>
        <button type='button' className='icon-btn mobile-only' onClick={onClose} aria-label='Închide meniul'>
          ✕
        </button>
      </div>

      <nav className='sidebar-nav'>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            onClick={onClose}
          >
            <item.icon size={16} /> {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
