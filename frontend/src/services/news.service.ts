import { axiosInstance } from '../axios/axios-instance';
import { ENDPOINTS } from '../axios/endpoints';
import type { News } from '../types';

export const newsService = {
  list: async (): Promise<News[]> => (await axiosInstance.get(ENDPOINTS.news.list)).data,
  create: async (payload: { title: string; content: string }): Promise<News> =>
    (await axiosInstance.post(ENDPOINTS.news.list, payload)).data,
  update: async (id: number, payload: Partial<News>): Promise<News> =>
    (await axiosInstance.put(ENDPOINTS.news.byId(id), payload)).data,
  remove: async (id: number): Promise<void> => { await axiosInstance.delete(ENDPOINTS.news.byId(id)); },
};
