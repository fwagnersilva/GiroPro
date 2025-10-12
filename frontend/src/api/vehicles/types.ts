export interface Vehicle {
  id: string;
  idUsuario: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
  tipoUso: 'proprio' | 'alugado' | 'financiado';
  valorAluguel?: number;
  valorPrestacao?: number;
  mediaConsumo?: number;
  dataRegistro?: string;
  dataUltimaAtualizacao?: string;
}

export interface CreateVehicleDto {
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
  tipoUso: 'proprio' | 'alugado' | 'financiado';
  valorAluguel?: number;
  valorPrestacao?: number;
  mediaConsumo?: number;
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {}
