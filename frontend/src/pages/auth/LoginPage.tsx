import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/context/auth-context';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Completează toate câmpurile'); return; }
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Bun venit înapoi!');
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch {
      /* toast-ul e afișat de interceptor */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="cyber-card p-6 shadow-neon">
        <h1 className="text-2xl font-bold text-neon-300 mb-1">Autentificare</h1>
        <p className="text-cyber-muted text-sm mb-6">Conectează-te la contul tău</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="cyber-label">Email</label>
            <input className="cyber-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="cyber-label">Parolă</label>
            <input className="cyber-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button disabled={loading} className="cyber-btn-solid w-full">
            {loading ? 'Se autentifică...' : 'Autentificare'}
          </button>
        </form>
        <p className="text-sm text-cyber-muted mt-4 text-center">
          Nu ai cont? <Link to="/register" className="cyber-link">Înregistrează-te</Link>
        </p>
      </div>
    </div>
  );
}
