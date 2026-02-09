export const ENDPOINTS = {
  health: '/health',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  challenges: {
    list: '/challenges',
    byId: (id: number | string) => `/challenges/${id}`,
    submit: (id: number | string) => `/challenges/${id}/submit`,
  },
  clans: {
    list: '/clans',
    byId: (id: number | string) => `/clans/${id}`,
    join: (id: number | string) => `/clans/${id}/join`,
    leave: '/clans/leave',
    leaderboard: '/clans/leaderboard',
  },
  achievements: {
    list: '/achievements',
    mine: '/achievements/me',
  },
  news: {
    list: '/news',
    byId: (id: number | string) => `/news/${id}`,
  },
  contact: {
    send: '/contact',
    list: '/contact',
    update: (id: number | string) => `/contact/${id}`,
  },
  leaderboard: '/leaderboard',
  dashboard: '/dashboard',
  profile: '/profile',
  admin: {
    stats: '/admin/stats',
    users: '/admin/users',
    userById: (id: number | string) => `/admin/users/${id}`,
    userRole: (id: number | string) => `/admin/users/${id}/role`,
  },
};
