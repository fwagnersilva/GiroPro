import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi } from './api';
import type { CreateVehicleDto, UpdateVehicleDto } from './types';

const VEHICLES_KEY = 'vehicles';

export const useVehicles = () => {
  return useQuery({
    queryKey: [VEHICLES_KEY],
    queryFn: vehiclesApi.getAll,
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: [VEHICLES_KEY, id],
    queryFn: () => vehiclesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateVehicleDto) => vehiclesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VEHICLES_KEY] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVehicleDto }) => 
      vehiclesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VEHICLES_KEY] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => vehiclesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VEHICLES_KEY] });
    },
  });
};
