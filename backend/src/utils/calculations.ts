// Utilitários para cálculos do GiroPro

/**
 * Calcula o lucro líquido de uma jornada
 * @param ganhoBruto - Ganho bruto da jornada em centavos
 * @param custoCombustivel - Custo do combustível em centavos
 * @param outrosCustos - Outros custos (manutenção, aluguel, etc.) em centavos
 * @returns Lucro líquido em centavos
 */
export const calcularLucroLiquido = (
  ganhoBruto: number,
  custoCombustivel: number,
  outrosCustos: number = 0
): number => {
  return ganhoBruto - custoCombustivel - outrosCustos;
};

/**
 * Calcula o consumo médio do veículo
 * @param kmPercorridos - Quilômetros percorridos
 * @param litrosConsumidos - Litros de combustível consumidos
 * @returns Consumo em km/l
 */
export const calcularConsumoMedio = (
  kmPercorridos: number,
  litrosConsumidos: number
): number => {
  if (litrosConsumidos === 0) return 0;
  return Number((kmPercorridos / litrosConsumidos).toFixed(2));
};

/**
 * Calcula o custo por quilômetro
 * @param custoTotal - Custo total em centavos
 * @param kmPercorridos - Quilômetros percorridos
 * @returns Custo por km em centavos
 */
export const calcularCustoPorKm = (
  custoTotal: number,
  kmPercorridos: number
): number => {
  if (kmPercorridos === 0) return 0;
  return Math.round(custoTotal / kmPercorridos);
};

/**
 * Calcula o ganho por hora
 * @param ganhoTotal - Ganho total em centavos
 * @param tempoTotalMinutos - Tempo total em minutos
 * @returns Ganho por hora em centavos
 */
export const calcularGanhoPorHora = (
  ganhoTotal: number,
  tempoTotalMinutos: number
): number => {
  if (tempoTotalMinutos === 0) return 0;
  const horas = tempoTotalMinutos / 60;
  return Math.round(ganhoTotal / horas);
};

/**
 * Calcula a diferença de tempo entre duas datas
 * @param dataInicio - Data de início
 * @param dataFim - Data de fim
 * @returns Diferença em minutos
 */
export const calcularTempoTotalMinutos = (
  dataInicio: Date,
  dataFim: Date
): number => {
  const diffMs = dataFim.getTime() - dataInicio.getTime();
  return Math.round(diffMs / (1000 * 60));
};

/**
 * Calcula o valor total do abastecimento
 * @param quantidadeLitros - Quantidade em litros (em centavos)
 * @param valorLitro - Valor por litro em centavos
 * @returns Valor total em centavos
 */
export const calcularValorTotalAbastecimento = (
  quantidadeLitros: number,
  valorLitro: number
): number => {
  return Math.round((quantidadeLitros * valorLitro) / 100);
};

/**
 * Converte valor de reais para centavos
 * @param valorReais - Valor em reais
 * @returns Valor em centavos
 */
export const reaisParaCentavos = (valorReais: number): number => {
  return Math.round(valorReais * 100);
};

/**
 * Converte valor de centavos para reais
 * @param valorCentavos - Valor em centavos
 * @returns Valor em reais
 */
export const centavosParaReais = (valorCentavos: number): number => {
  return Number((valorCentavos / 100).toFixed(2));
};

/**
 * Calcula a média de uma lista de valores
 * @param valores - Array de valores
 * @returns Média dos valores
 */
export const calcularMedia = (valores: number[]): number => {
  if (valores.length === 0) return 0;
  const soma = valores.reduce((acc, val) => acc + val, 0);
  return Number((soma / valores.length).toFixed(2));
};

/**
 * Calcula o percentual de uma parte em relação ao total
 * @param parte - Valor da parte
 * @param total - Valor total
 * @returns Percentual (0-100)
 */
export const calcularPercentual = (parte: number, total: number): number => {
  if (total === 0) return 0;
  return Number(((parte / total) * 100).toFixed(2));
};

