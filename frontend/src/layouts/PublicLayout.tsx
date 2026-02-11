import { Outlet } from 'react-router-dom';
import { Topbar } from '../components/layout/Topbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-cyber-border py-4 text-center text-xs text-cyber-muted">
        © {new Date().getFullYear()} CyberTrain — platformă educațională
      </footer>
    </div>
  );
}
