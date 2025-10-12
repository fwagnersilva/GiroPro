export interface Fueling {
  id: string;
  idUsuario: string;
  vehicleId: string;
  vehicleModel?: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalValue: number;
  km?: number;
  posto?: string;
  observation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFuelingDto {
  vehicleId: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalValue: number;
  km?: number;
  posto?: string;
  observation?: string;
}

export interface UpdateFuelingDto extends Partial<CreateFuelingDto> {}

export interface FuelingFilters {
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  periodo?: 'hoje' | 'ontem' | 'semana' | 'mes';
}
