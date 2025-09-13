/**
 * Formata um valor em centavos para moeda brasileira
 * @param centavos Valor em centavos
 * @returns String formatada como moeda (ex: "R$ 10,50")
 */
export const formatCurrency = (centavos: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(centavos / 100);
};

/**
 * Formata uma data ISO para formato brasileiro
 * @param dateString Data em formato ISO
 * @returns String formatada como data (ex: "15/01/2024")
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

/**
 * Formata tempo em minutos para formato horas e minutos
 * @param minutes Tempo em minutos
 * @returns String formatada como tempo (ex: "1h 30m")
 */
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

/**
 * Formata quilometragem com separador de milhares
 * @param kilometers Quilometragem
 * @returns String formatada (ex: "1.000 km")
 */
export const formatKilometers = (kilometers: number): string => {
  return `${Math.round(kilometers).toLocaleString('pt-BR')} km`;
};

/**
 * Formata litros com duas casas decimais
 * @param milliliters Quantidade em mililitros
 * @returns String formatada (ex: "45,50L")
 */
export const formatLiters = (milliliters: number): string => {
  return `${(milliliters / 1000).toFixed(2).replace('.', ',')}L`;
};

/**
 * Formata porcentagem com uma casa decimal
 * @param value Valor decimal (ex: 0.15 para 15%)
 * @returns String formatada (ex: "15,0%")
 */
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1).replace('.', ',')}%`;
};

/**
 * Formata número com separador de milhares
 * @param value Número a ser formatado
 * @returns String formatada (ex: "1.000")
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('pt-BR');
};

/**
 * Trunca texto com reticências se exceder o limite
 * @param text Texto a ser truncado
 * @param maxLength Comprimento máximo
 * @returns Texto truncado se necessário
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Capitaliza a primeira letra de cada palavra
 * @param text Texto a ser capitalizado
 * @returns Texto com primeira letra de cada palavra maiúscula
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Remove caracteres especiais de uma string, mantendo apenas letras, números e espaços
 * @param text Texto a ser limpo
 * @returns Texto sem caracteres especiais
 */
export const sanitizeText = (text: string): string => {
  return text.replace(/[^a-zA-Z0-9\s]/g, '');
};

/**
 * Formata placa de veículo no padrão brasileiro
 * @param plate Placa sem formatação
 * @returns Placa formatada (ex: "ABC-1234" ou "ABC1D23")
 */
export const formatPlate = (plate: string): string => {
  const cleanPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  if (cleanPlate.length === 7) {
    // Formato antigo: ABC-1234
    if (/^[A-Z]{3}[0-9]{4}$/.test(cleanPlate)) {
      return `${cleanPlate.slice(0, 3)}-${cleanPlate.slice(3)}`;
    }
    // Formato Mercosul: ABC1D23
    if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(cleanPlate)) {
      return cleanPlate;
    }
  }
  
  return plate; // Retorna original se não conseguir formatar
};

