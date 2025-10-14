"use strict";
// Utilitários para cálculos do GiroPro
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularPercentual = exports.calcularMedia = exports.centavosParaReais = exports.reaisParaCentavos = exports.calcularValorTotalAbastecimento = exports.calcularTempoTotalMinutos = exports.calcularGanhoPorHora = exports.calcularCustoPorKm = exports.calcularConsumoMedio = exports.calcularLucroLiquido = void 0;
/**
 * Calcula o lucro líquido de uma jornada
 * @param ganhoBruto - Ganho bruto da jornada em centavos
 * @param custoCombustivel - Custo do combustível em centavos
 * @param outrosCustos - Outros custos (manutenção, aluguel, etc.) em centavos
 * @returns Lucro líquido em centavos
 */
var calcularLucroLiquido = function (ganhoBruto, custoCombustivel, outrosCustos) {
    if (outrosCustos === void 0) { outrosCustos = 0; }
    return ganhoBruto - custoCombustivel - outrosCustos;
};
exports.calcularLucroLiquido = calcularLucroLiquido;
/**
 * Calcula o consumo médio do veículo
 * @param kmPercorridos - Quilômetros percorridos
 * @param litrosConsumidos - Litros de combustível consumidos
 * @returns Consumo em km/l
 */
var calcularConsumoMedio = function (kmPercorridos, litrosConsumidos) {
    if (litrosConsumidos === 0)
        return 0;
    return Number((kmPercorridos / litrosConsumidos).toFixed(2));
};
exports.calcularConsumoMedio = calcularConsumoMedio;
/**
 * Calcula o custo por quilômetro
 * @param custoTotal - Custo total em centavos
 * @param kmPercorridos - Quilômetros percorridos
 * @returns Custo por km em centavos
 */
var calcularCustoPorKm = function (custoTotal, kmPercorridos) {
    if (kmPercorridos === 0)
        return 0;
    return Math.round(custoTotal / kmPercorridos);
};
exports.calcularCustoPorKm = calcularCustoPorKm;
/**
 * Calcula o ganho por hora
 * @param ganhoTotal - Ganho total em centavos
 * @param tempoTotalMinutos - Tempo total em minutos
 * @returns Ganho por hora em centavos
 */
var calcularGanhoPorHora = function (ganhoTotal, tempoTotalMinutos) {
    if (tempoTotalMinutos === 0)
        return 0;
    var horas = tempoTotalMinutos / 60;
    return Math.round(ganhoTotal / horas);
};
exports.calcularGanhoPorHora = calcularGanhoPorHora;
/**
 * Calcula a diferença de tempo entre duas datas
 * @param dataInicio - Data de início
 * @param dataFim - Data de fim
 * @returns Diferença em minutos
 */
var calcularTempoTotalMinutos = function (dataInicio, dataFim) {
    var diffMs = dataFim.getTime() - dataInicio.getTime();
    return Math.round(diffMs / (1000 * 60));
};
exports.calcularTempoTotalMinutos = calcularTempoTotalMinutos;
/**
 * Calcula o valor total do abastecimento
 * @param quantidadeLitros - Quantidade em litros (em centavos)
 * @param valorLitro - Valor por litro em centavos
 * @returns Valor total em centavos
 */
var calcularValorTotalAbastecimento = function (quantidadeLitros, valorLitro) {
    return Math.round((quantidadeLitros * valorLitro) / 100);
};
exports.calcularValorTotalAbastecimento = calcularValorTotalAbastecimento;
/**
 * Converte valor de reais para centavos
 * @param valorReais - Valor em reais
 * @returns Valor em centavos
 */
var reaisParaCentavos = function (valorReais) {
    return Math.round(valorReais * 100);
};
exports.reaisParaCentavos = reaisParaCentavos;
/**
 * Converte valor de centavos para reais
 * @param valorCentavos - Valor em centavos
 * @returns Valor em reais
 */
var centavosParaReais = function (valorCentavos) {
    return Number((valorCentavos / 100).toFixed(2));
};
exports.centavosParaReais = centavosParaReais;
/**
 * Calcula a média de uma lista de valores
 * @param valores - Array de valores
 * @returns Média dos valores
 */
var calcularMedia = function (valores) {
    if (valores.length === 0)
        return 0;
    var soma = valores.reduce(function (acc, val) { return acc + val; }, 0);
    return Number((soma / valores.length).toFixed(2));
};
exports.calcularMedia = calcularMedia;
/**
 * Calcula o percentual de uma parte em relação ao total
 * @param parte - Valor da parte
 * @param total - Valor total
 * @returns Percentual (0-100)
 */
var calcularPercentual = function (parte, total) {
    if (total === 0)
        return 0;
    return Number(((parte / total) * 100).toFixed(2));
};
exports.calcularPercentual = calcularPercentual;
