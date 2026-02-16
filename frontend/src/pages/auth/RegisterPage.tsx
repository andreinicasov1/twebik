import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/context/auth-context';

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) { toast.error('Completează toate câmpurile'); return; }
    if (password.length < 6) { toast.error('Parola trebuie să aibă minim 6 caractere'); return; }
    if (password !== password2) { toast.error('Parolele nu coincid'); return; }
    try {
      setLoading(true);
      await register(username, email, password);
      toast.success('Cont creat! Bun venit pe CyberTrain.');
      navigate('/dashboard', { replace: true });
    } catch {
      /* toast din interceptor */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="cyber-card p-6 shadow-neon">
        <h1 className="text-2xl font-bold text-neon-300 mb-1">Înregistrare</h1>
        <p className="text-cyber-muted text-sm mb-6">Creează un cont nou — fără confirmare email</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="cyber-label">Nume utilizator</label>
            <input className="cyber-input" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="cyber-label">Email</label>
            <input className="cyber-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="cyber-label">Parolă</label>
            <input className="cyber-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="cyber-label">Confirmă parola</label>
            <input className="cyber-input" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
          </div>
          <button disabled={loading} className="cyber-btn-solid w-full">
            {loading ? 'Se înregistrează...' : 'Creează cont'}
          </button>
        </form>
        <p className="text-sm text-cyber-muted mt-4 text-center">
          Ai deja cont? <Link to="/login" className="cyber-link">Autentifică-te</Link>
        </p>
      </div>
    </div>
  );
}
