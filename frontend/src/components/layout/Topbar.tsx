import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/auth-context';
import { Logo } from '../ui/Logo';

export function Topbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-cyber-panel/80 backdrop-blur border-b border-cyber-border">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo />
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <span className="hidden sm:inline text-sm text-cyber-muted">
                <span className="cyber-badge mr-2">{user.rank}</span>
                {user.username} · <span className="text-neon-300">{user.xp} XP</span>
              </span>
              <button onClick={handleLogout} className="cyber-btn">Deconectare</button>
            </>
          ) : (
            <>
              <Link to="/login" className="cyber-btn">Autentificare</Link>
              <Link to="/register" className="cyber-btn-solid">Înregistrare</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
