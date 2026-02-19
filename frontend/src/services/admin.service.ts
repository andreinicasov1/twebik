import { axiosInstance } from '../axios/axios-instance';
import { ENDPOINTS } from '../axios/endpoints';
import type { AdminStats, UserProfile, LeaderboardEntry, DashboardStats } from '../types';

export const adminService = {
  stats: async (): Promise<AdminStats> => (await axiosInstance.get(ENDPOINTS.admin.stats)).data,
  users: async (): Promise<UserProfile[]> => (await axiosInstance.get(ENDPOINTS.admin.users)).data,
  changeRole: async (id: number, role: 'user' | 'admin') => {
    await axiosInstance.put(ENDPOINTS.admin.userRole(id), { role });
  },
  deleteUser: async (id: number) => { await axiosInstance.delete(ENDPOINTS.admin.userById(id)); },
};

export const commonService = {
  leaderboard: async (): Promise<LeaderboardEntry[]> => (await axiosInstance.get(ENDPOINTS.leaderboard)).data,
  dashboard: async (): Promise<DashboardStats> => (await axiosInstance.get(ENDPOINTS.dashboard)).data,
  profile: async (): Promise<UserProfile> => (await axiosInstance.get(ENDPOINTS.profile)).data,
  health: async (): Promise<{ status: string }> => (await axiosInstance.get(ENDPOINTS.health)).data,
};
