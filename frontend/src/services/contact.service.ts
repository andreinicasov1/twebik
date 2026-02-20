import { axiosInstance } from '../axios/axios-instance';
import { ENDPOINTS } from '../axios/endpoints';
import type { ContactMessage } from '../types';

export const contactService = {
  send: async (payload: { name: string; email: string; message: string }): Promise<void> => {
    await axiosInstance.post(ENDPOINTS.contact.send, payload);
  },
  list: async (): Promise<ContactMessage[]> => (await axiosInstance.get(ENDPOINTS.contact.list)).data,
  markResolved: async (id: number): Promise<void> => {
    await axiosInstance.put(ENDPOINTS.contact.update(id), { status: 'rezolvat' });
  },
  remove: async (id: number): Promise<void> => { await axiosInstance.delete(ENDPOINTS.contact.update(id)); },
};
