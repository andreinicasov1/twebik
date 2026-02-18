import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div>
        <div className="text-7xl font-bold text-neon-300">404</div>
        <p className="text-cyber-muted mt-2 mb-6">Pagina căutată nu există.</p>
        <Link to="/" className="cyber-btn-solid">Înapoi acasă</Link>
      </div>
    </div>
  );
}
