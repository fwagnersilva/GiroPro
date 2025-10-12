export interface Journey {
  id: string;
  idUsuario: string;
  idVeiculo: string;
  vehicleModel?: string;
  dataInicio: string;
  dataFim?: string;
  kmInicio: number;
  kmFim?: number;
  duracaoHoras?: number;
  valorTotal?: number;
  distanciaTotal?: number;
  status: 'em_andamento' | 'finalizada';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJourneyDto {
  idVeiculo: string;
  dataInicio: string;
  kmInicio: number;
  dataFim?: string;
  kmFim?: number;
  valorTotal?: number;
}

export interface UpdateJourneyDto extends Partial<CreateJourneyDto> {}

export interface JourneyFilters {
  idVeiculo?: string;
  status?: 'em_andamento' | 'finalizada';
  startDate?: string;
  endDate?: string;
  periodo?: 'hoje' | 'ontem' | 'semana' | 'mes';
}
