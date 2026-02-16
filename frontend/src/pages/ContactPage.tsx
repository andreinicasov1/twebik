import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { contactService } from '../services/contact.service';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { toast.error('Completează toate câmpurile'); return; }
    try {
      setLoading(true);
      await contactService.send({ name, email, message });
      toast.success('Mesaj trimis. Îți mulțumim!');
      setName(''); setEmail(''); setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-neon-300 mb-1">Contact</h1>
      <p className="text-cyber-muted mb-6">Ai o întrebare sau ai găsit o problemă? Trimite-ne un mesaj.</p>

      <form onSubmit={submit} className="cyber-card p-5 space-y-4">
        <div>
          <label className="cyber-label">Nume</label>
          <input className="cyber-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="cyber-label">Email</label>
          <input className="cyber-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="cyber-label">Mesaj</label>
          <textarea className="cyber-input min-h-[140px]" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <button disabled={loading} className="cyber-btn-solid">
          {loading ? 'Se trimite...' : 'Trimite mesaj'}
        </button>
      </form>
    </div>
  );
}
