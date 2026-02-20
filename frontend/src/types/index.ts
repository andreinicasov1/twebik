export type Role = 'user' | 'admin';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: Role;
  xp: number;
  level: number;
  rank: string;
  clanId?: number | null;
  clanName?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'usor' | 'mediu' | 'greu';
  xpReward: number;
  clanId?: number | null;
  isClanOnly: boolean;
}

export interface ChallengeAdmin extends Challenge {
  correctAnswer: string;
}

export interface Submission {
  id: number;
  userId: number;
  username?: string;
  challengeId: number;
  challengeTitle?: string;
  isCorrect: boolean;
  submittedAt: string;
}

export interface Clan {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  totalXp: number;
  createdAt: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  xpRequired: number;
}

export interface UserAchievement {
  id: number;
  achievementId: number;
  title: string;
  description: string;
  unlockedAt: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'nou' | 'rezolvat';
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: number;
  username: string;
  xp: number;
  level: number;
  clanName?: string | null;
}

export interface ClanLeaderboardEntry {
  clanId: number;
  name: string;
  memberCount: number;
  totalXp: number;
}

export interface DashboardStats {
  xp: number;
  level: number;
  completed: number;
  recentActivity: Submission[];
}

export interface AdminStats {
  usersCount: number;
  challengesCount: number;
  submissionsCount: number;
  recentActivity: Submission[];
}
