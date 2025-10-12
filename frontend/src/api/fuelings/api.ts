import { client } from '../common/client';
import type { Fueling, CreateFuelingDto, UpdateFuelingDto, FuelingFilters } from './types';

const FUELINGS_URL = '/fuelings';

export const fuelingsApi = {
  getAll: (filters?: FuelingFilters) => 
    client.get<Fueling[]>(FUELINGS_URL, { params: filters }).then((res) => res.data),

  getById: (id: string) =>
    client.get<Fueling>(`${FUELINGS_URL}/${id}`).then((res) => res.data),

  create: (data: CreateFuelingDto) =>
    client.post<Fueling>(FUELINGS_URL, data).then((res) => res.data),

  update: (id: string, data: UpdateFuelingDto) =>
    client.put<Fueling>(`${FUELINGS_URL}/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    client.delete(`${FUELINGS_URL}/${id}`).then((res) => res.data),
};
