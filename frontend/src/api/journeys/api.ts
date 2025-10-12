import { client } from '../common/client';
import type { Journey, CreateJourneyDto, UpdateJourneyDto, JourneyFilters } from './types';

const JOURNEYS_URL = '/journeys';

export const journeysApi = {
  getAll: (filters?: JourneyFilters) => 
    client.get<Journey[]>(JOURNEYS_URL, { params: filters }).then((res) => res.data),

  getById: (id: string) =>
    client.get<Journey>(`${JOURNEYS_URL}/${id}`).then((res) => res.data),

  create: (data: CreateJourneyDto) =>
    client.post<Journey>(JOURNEYS_URL, data).then((res) => res.data),

  update: (id: string, data: UpdateJourneyDto) =>
    client.put<Journey>(`${JOURNEYS_URL}/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    client.delete(`${JOURNEYS_URL}/${id}`).then((res) => res.data),

  finalize: (id: string, data: { kmFim: number; valorTotal: number }) =>
    client.patch<Journey>(`${JOURNEYS_URL}/${id}/finalize`, data).then((res) => res.data),
};
