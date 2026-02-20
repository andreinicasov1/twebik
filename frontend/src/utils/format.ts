export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ro-RO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function xpToLevel(xp: number): number {
  // 100 XP = nivel 1, apoi crește progresiv
  return Math.floor(1 + Math.sqrt(xp / 50));
}

export function rankFromXp(xp: number): string {
  if (xp >= 5000) return 'Hacker Legendar';
  if (xp >= 2500) return 'Expert Cyber';
  if (xp >= 1000) return 'Veteran';
  if (xp >= 500) return 'Avansat';
  if (xp >= 100) return 'Intermediar';
  return 'Recrut';
}

export function difficultyColor(diff: string): string {
  if (diff === 'usor') return 'text-neon-300 border-neon-500/40';
  if (diff === 'mediu') return 'text-yellow-300 border-yellow-500/40';
  return 'text-red-400 border-red-500/40';
}

export function difficultyLabel(diff: string): string {
  if (diff === 'usor') return 'Ușor';
  if (diff === 'mediu') return 'Mediu';
  return 'Greu';
}
