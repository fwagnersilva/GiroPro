import { client } from '../common/client';
import type { Journey, CreateJourneyDto, UpdateJourneyDto, JourneyFilters } from './types';

const JOURNEYS_URL = '/journeys';

// Tipo da resposta do backend
interface JourneysResponse {
  success: boolean;
  data: Journey[];
  message?: string;
  meta?: any;
}

interface JourneyResponse {
  success: boolean;
  data: Journey;
  message?: string;
  meta?: any;
}

export const journeysApi = {
  getAll: (filters?: JourneyFilters) =>
    client.get<JourneysResponse>(JOURNEYS_URL, { params: filters })
      .then((res) => res.data.data), // ← Extrai o array de dentro de data.data

  getById: (id: string) =>
    client.get<JourneyResponse>(`${JOURNEYS_URL}/${id}`)
      .then((res) => res.data.data),

  create: (data: CreateJourneyDto) =>
    client.post<JourneyResponse>(JOURNEYS_URL, data)
      .then((res) => res.data.data),

  update: (id: string, data: UpdateJourneyDto) =>
    client.put<JourneyResponse>(`${JOURNEYS_URL}/${id}`, data)
      .then((res) => res.data.data),

  delete: (id: string) =>
    client.delete(`${JOURNEYS_URL}/${id}`)
      .then((res) => res.data),

  finalize: (id: string, data: { kmFim: number; valorTotal: number }) =>
    client.patch<JourneyResponse>(`${JOURNEYS_URL}/${id}/finalize`, data)
      .then((res) => res.data.data),
};