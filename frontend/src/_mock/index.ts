// Date mock folosite doar dacă backend-ul .NET nu rulează.
// În producție, vor fi înlocuite prin apeluri reale la API.
import type { Challenge, Clan, News, Achievement } from '../types';

export const MOCK_CHALLENGES: Challenge[] = [
  { id: 1, title: 'SQL Injection de bază', category: 'Securitate Web', difficulty: 'usor',
    description: 'Exploatează formularul de login care folosește concatenare SQL pentru a ocoli autentificarea.',
    xpReward: 50, isClanOnly: false },
  { id: 2, title: 'Cifru Cezar', category: 'Criptografie', difficulty: 'usor',
    description: 'Decodifică mesajul "KHOOR" criptat cu un cifru Cezar cu deplasare 3.',
    xpReward: 30, isClanOnly: false },
  { id: 3, title: 'Nmap Reconnaissance', category: 'Securitate Rețea', difficulty: 'mediu',
    description: 'Identifică portul deschis cel mai puțin obișnuit și răspunde cu numărul său.',
    xpReward: 100, isClanOnly: false },
];

export const MOCK_CLANS: Clan[] = [
  { id: 1, name: 'Red Team', description: 'Atacatori pricepuți', memberCount: 5, totalXp: 1200, createdAt: new Date().toISOString() },
  { id: 2, name: 'Blue Defenders', description: 'Apărare activă', memberCount: 8, totalXp: 2100, createdAt: new Date().toISOString() },
];

export const MOCK_NEWS: News[] = [
  { id: 1, title: 'Bun venit pe CyberTrain!', content: 'Platforma a fost lansată. Succes la exerciții!', createdAt: new Date().toISOString() },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 1, title: 'Primul pas', description: 'Rezolvă primul exercițiu', xpRequired: 1 },
  { id: 2, title: 'Sprinter', description: 'Obține 100 XP', xpRequired: 100 },
  { id: 3, title: 'Veteran', description: 'Obține 1000 XP', xpRequired: 1000 },
];
