import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/ui/Spinner';
import { adminService } from '../../services/admin.service';
import type { UserProfile } from '../../types';

export default function AdminUsers() {
  const [items, setItems] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setItems(await adminService.users());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const changeRole = async (u: UserProfile) => {
    const next = u.role === 'admin' ? 'user' : 'admin';
    await adminService.changeRole(u.id, next);
    toast.success(`Rol schimbat la ${next}`);
    await load();
  };
  const remove = async (id: number) => {
    if (!confirm('Sigur ștergi utilizatorul?')) return;
    await adminService.deleteUser(id);
    toast.success('Utilizator șters');
    await load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neon-300 mb-6">Gestionare Utilizatori</h1>
      {loading ? <Spinner /> : (
        <div className="cyber-card overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-cyber-panel2 text-cyber-muted">
              <tr>
                <th className="text-left px-4 py-2">Username</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Rol</th>
                <th className="text-right px-4 py-2">XP</th>
                <th className="text-right px-4 py-2">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-t border-cyber-border">
                  <td className="px-4 py-2 text-cyber-text">{u.username}</td>
                  <td className="px-4 py-2 text-cyber-muted">{u.email}</td>
                  <td className="px-4 py-2">
                    <span className={`cyber-badge ${u.role === 'admin' ? 'text-yellow-300 border-yellow-500/40' : ''}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right text-neon-300">{u.xp}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button onClick={() => changeRole(u)} className="cyber-btn text-xs py-1">
                      {u.role === 'admin' ? 'Fă user' : 'Fă admin'}
                    </button>
                    <button onClick={() => remove(u.id)} className="cyber-btn text-xs py-1 border-red-500/50 text-red-400">Șterge</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-cyber-muted">Niciun utilizator.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
