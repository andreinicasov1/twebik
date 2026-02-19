import { axiosInstance } from '../axios/axios-instance';
import { ENDPOINTS } from '../axios/endpoints';
import type { Challenge, ChallengeAdmin } from '../types';

export const challengesService = {
  list: async (): Promise<Challenge[]> => (await axiosInstance.get(ENDPOINTS.challenges.list)).data,
  byId: async (id: number | string): Promise<Challenge> =>
    (await axiosInstance.get(ENDPOINTS.challenges.byId(id))).data,
  submit: async (id: number | string, answer: string): Promise<{ isCorrect: boolean; xpGained: number; message: string }> =>
    (await axiosInstance.post(ENDPOINTS.challenges.submit(id), { answer })).data,
  create: async (payload: Omit<ChallengeAdmin, 'id'>): Promise<ChallengeAdmin> =>
    (await axiosInstance.post(ENDPOINTS.challenges.list, payload)).data,
  update: async (id: number, payload: Partial<ChallengeAdmin>): Promise<ChallengeAdmin> =>
    (await axiosInstance.put(ENDPOINTS.challenges.byId(id), payload)).data,
  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.challenges.byId(id));
  },
};
