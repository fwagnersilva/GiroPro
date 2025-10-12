import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fuelingsApi } from '@/api/fuelings/api';
import type { CreateFuelingDto, UpdateFuelingDto, FuelingFilters } from '@/api/fuelings/types';

const FUELINGS_KEY = 'fuelings';

export const useFuelings = (filters?: FuelingFilters) => {
  return useQuery({
    queryKey: [FUELINGS_KEY, filters],
    queryFn: () => fuelingsApi.getAll(filters),
  });
};

export const useFueling = (id: string) => {
  return useQuery({
    queryKey: [FUELINGS_KEY, id],
    queryFn: () => fuelingsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateFueling = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFuelingDto) => fuelingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FUELINGS_KEY] });
    },
  });
};

export const useUpdateFueling = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFuelingDto }) => 
      fuelingsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FUELINGS_KEY] });
    },
  });
};

export const useDeleteFueling = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => fuelingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FUELINGS_KEY] });
    },
  });
};
