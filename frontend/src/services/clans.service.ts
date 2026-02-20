import { axiosInstance } from '../axios/axios-instance';
import { ENDPOINTS } from '../axios/endpoints';
import type { Clan, ClanLeaderboardEntry } from '../types';

export const clansService = {
  list: async (): Promise<Clan[]> => (await axiosInstance.get(ENDPOINTS.clans.list)).data,
  byId: async (id: number | string): Promise<Clan> => (await axiosInstance.get(ENDPOINTS.clans.byId(id))).data,
  create: async (payload: { name: string; description: string }): Promise<Clan> =>
    (await axiosInstance.post(ENDPOINTS.clans.list, payload)).data,
  remove: async (id: number): Promise<void> => { await axiosInstance.delete(ENDPOINTS.clans.byId(id)); },
  join: async (id: number): Promise<void> => { await axiosInstance.post(ENDPOINTS.clans.join(id)); },
  leave: async (): Promise<void> => { await axiosInstance.post(ENDPOINTS.clans.leave); },
  leaderboard: async (): Promise<ClanLeaderboardEntry[]> =>
    (await axiosInstance.get(ENDPOINTS.clans.leaderboard)).data,
};
