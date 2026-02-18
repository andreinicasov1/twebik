import { Link } from 'react-router-dom';

export default function ServerErrorPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div>
        <div className="text-7xl font-bold text-red-400">500</div>
        <p className="text-cyber-muted mt-2 mb-1">Serverul backend nu răspunde.</p>
        <p className="text-cyber-muted text-sm mb-6">
          Verifică dacă API-ul .NET rulează la <span className="text-neon-300">{import.meta.env.VITE_API_URL || 'http://localhost:5080/api'}</span>.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.location.reload()} className="cyber-btn">Reîncarcă</button>
          <Link to="/" className="cyber-btn-solid">Acasă</Link>
        </div>
      </div>
    </div>
  );
}
