import api from './api';
import type { Tender } from '@/types/types';

interface CreateTenderData {
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
}

export const getTenders = async (): Promise<Tender[]> => {
  const response = await api.get('/tenders');
  return response.data;
};

export const getTenderDetails = async (id: string): Promise<Tender> => {
  const response = await api.get(`/tenders/${id}`);
  return response.data;
};

export const createTender = async (data: CreateTenderData): Promise<Tender> => {
  const response = await api.post('/tenders', data);
  return response.data;
};