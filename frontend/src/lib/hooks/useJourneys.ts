import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { journeysApi } from '@/api/journeys/api';
import type { CreateJourneyDto, UpdateJourneyDto, JourneyFilters } from '@/api/journeys/types';

const JOURNEYS_KEY = 'journeys';

export const useJourneys = (filters?: JourneyFilters) => {
  return useQuery({
    queryKey: [JOURNEYS_KEY, filters],
    queryFn: () => journeysApi.getAll(filters),
  });
};

export const useJourney = (id: string) => {
  return useQuery({
    queryKey: [JOURNEYS_KEY, id],
    queryFn: () => journeysApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateJourney = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateJourneyDto) => journeysApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNEYS_KEY] });
    },
  });
};

export const useUpdateJourney = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJourneyDto }) => 
      journeysApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNEYS_KEY] });
    },
  });
};

export const useFinalizeJourney = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { kmFim: number; valorTotal: number } }) => 
      journeysApi.finalize(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNEYS_KEY] });
    },
  });
};

export const useDeleteJourney = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => journeysApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNEYS_KEY] });
    },
  });
};
