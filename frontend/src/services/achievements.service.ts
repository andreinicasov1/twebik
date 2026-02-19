import { axiosInstance } from '../axios/axios-instance';
import { ENDPOINTS } from '../axios/endpoints';
import type { Achievement, UserAchievement } from '../types';

export const achievementsService = {
  list: async (): Promise<Achievement[]> => (await axiosInstance.get(ENDPOINTS.achievements.list)).data,
  mine: async (): Promise<UserAchievement[]> => (await axiosInstance.get(ENDPOINTS.achievements.mine)).data,
  create: async (payload: Omit<Achievement, 'id'>): Promise<Achievement> =>
    (await axiosInstance.post(ENDPOINTS.achievements.list, payload)).data,
  update: async (id: number, payload: Partial<Achievement>): Promise<Achievement> =>
    (await axiosInstance.put(`${ENDPOINTS.achievements.list}/${id}`, payload)).data,
  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${ENDPOINTS.achievements.list}/${id}`);
  },
};
