import { client } from '../common/client';
import type { Vehicle, CreateVehicleDto, UpdateVehicleDto } from './types';

const VEHICLES_URL = '/vehicles';

export const vehiclesApi = {
  getAll: () => client.get<Vehicle[]>(VEHICLES_URL).then((res) => res.data),
  
  getById: (id: string) => 
    client.get<Vehicle>(`${VEHICLES_URL}/${id}`).then((res) => res.data),
  
  create: (data: CreateVehicleDto) => 
    client.post<Vehicle>(VEHICLES_URL, data).then((res) => res.data),
  
  update: (id: string, data: UpdateVehicleDto) => 
    client.patch<Vehicle>(`${VEHICLES_URL}/${id}`, data).then((res) => res.data),
  
  delete: (id: string) => 
    client.delete(`${VEHICLES_URL}/${id}`).then((res) => res.data),
};
