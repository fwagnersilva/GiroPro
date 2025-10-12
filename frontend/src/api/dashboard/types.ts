export interface DashboardData {
  financeiro: {
    faturamentoTotal: number;
    despesasTotais: number;
    lucroLiquido: number;
    variacao: {
      faturamento: number;
      despesas: number;
      lucro: number;
    };
  };
  operacional: {
    totalJornadas: number;
    diasTrabalhados: number;
    horasTrabalhadas: number;
    mediaHorasDia: number;
    distanciaTotal: number;
  };
  estrategico: {
    valorPorKm: number;
    consumoMedio: number;
    custoPorKm: number;
    ticketMedio: number;
    abastecimentos: number;
  };
  melhoresDias: {
    dia: string;
    valor: number;
    jornadas: number;
  }[];
}

export interface DashboardFilters {
  periodo: 'hoje' | 'ontem' | 'semana' | 'mes';
  vehicleId?: string;
}
