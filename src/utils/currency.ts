/**
 * Utilitários para formatação e manipulação de valores monetários
 * 
 * Regras:
 * - Usuário digita apenas números (sem vírgula, sem ponto)
 * - Sistema exibe formatado automaticamente em R$
 * - Valores armazenados em centavos no backend
 */

/**
 * Formata um valor numérico (em centavos) para exibição em formato monetário brasileiro
 * 
 * @param valueInCents - Valor em centavos (ex: 15050 = R$ 150,50)
 * @returns String formatada (ex: "R$ 150,50")
 * 
 * @example
 * formatCurrency(15050) // "R$ 150,50"
 * formatCurrency(0) // "R$ 0,00"
 * formatCurrency(100) // "R$ 1,00"
 */
export const formatCurrency = (valueInCents: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100);
};

/**
 * Formata um input de texto enquanto o usuário digita
 * Remove caracteres não numéricos e formata como moeda
 * 
 * @param input - Texto digitado pelo usuário
 * @returns Objeto com valor limpo (apenas números) e valor formatado para exibição
 * 
 * @example
 * formatCurrencyInput("150") // { clean: "150", formatted: "1,50" }
 * formatCurrencyInput("15050") // { clean: "15050", formatted: "150,50" }
 * formatCurrencyInput("abc123") // { clean: "123", formatted: "1,23" }
 */
export const formatCurrencyInput = (input: string): { clean: string; formatted: string } => {
  // Remove tudo que não é número
  const cleanValue = input.replace(/\D/g, '');
  
  if (!cleanValue || cleanValue === '0') {
    return { clean: '', formatted: '' };
  }

  // Converte para número (em centavos)
  const valueInCents = parseInt(cleanValue, 10);
  
  // Formata para exibição (sem o símbolo R$)
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valueInCents / 100);

  return {
    clean: cleanValue,
    formatted: formatted,
  };
};

/**
 * Converte um valor limpo (string de números) para centavos
 * 
 * @param cleanValue - String contendo apenas números
 * @returns Valor em centavos
 * 
 * @example
 * parseCurrencyInput("15050") // 15050 (R$ 150,50)
 * parseCurrencyInput("100") // 100 (R$ 1,00)
 * parseCurrencyInput("") // 0
 */
export const parseCurrencyInput = (cleanValue: string): number => {
  if (!cleanValue) return 0;
  return parseInt(cleanValue, 10);
};

/**
 * Valida se um input numérico contém apenas números
 * 
 * @param input - Texto a ser validado
 * @returns String contendo apenas números
 * 
 * @example
 * validateNumericInput("123") // "123"
 * validateNumericInput("12a3bc") // "123"
 * validateNumericInput("abc") // ""
 */
export const validateNumericInput = (input: string): string => {
  return input.replace(/\D/g, '');
};

/**
 * Formata um valor de quilometragem para exibição
 * 
 * @param km - Valor de quilometragem
 * @returns String formatada com separador de milhares
 * 
 * @example
 * formatKm(1500) // "1.500"
 * formatKm(150000) // "150.000"
 */
export const formatKm = (km: number): string => {
  return new Intl.NumberFormat('pt-BR').format(km);
};

