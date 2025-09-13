/**
 * Utilitário de validação de senha que espelha exatamente a lógica do backend
 * Baseado em: backend/src/utils/validation.ts
 */

export interface PasswordCriterion {
  text: string;
  valid: boolean;
  key: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  message: string | null;
  criteria: PasswordCriterion[];
}

/**
 * Regex exata do backend para validação de senha
 * /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Caracteres especiais permitidos (exatamente como no backend)
 */
const SPECIAL_CHARS = '@$!%*?&';

/**
 * Valida uma senha usando os mesmos critérios do backend
 * @param password - A senha a ser validada
 * @returns Resultado da validação com detalhes
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const criteria: PasswordCriterion[] = [
    {
      key: 'length',
      text: 'Mínimo de 8 caracteres',
      valid: password.length >= 8,
    },
    {
      key: 'lowercase',
      text: 'Pelo menos 1 letra minúscula',
      valid: /[a-z]/.test(password),
    },
    {
      key: 'uppercase',
      text: 'Pelo menos 1 letra maiúscula',
      valid: /[A-Z]/.test(password),
    },
    {
      key: 'number',
      text: 'Pelo menos 1 número',
      valid: /\d/.test(password),
    },
    {
      key: 'special',
      text: `Pelo menos 1 caractere especial (${SPECIAL_CHARS})`,
      valid: /[@$!%*?&]/.test(password),
    },
  ];

  // Verifica se todos os critérios são atendidos
  const allCriteriaMet = criteria.every(criterion => criterion.valid);

  // Verifica se contém apenas caracteres permitidos
  const onlyAllowedChars = PASSWORD_REGEX.test(password);

  let message: string | null = null;
  let isValid = false;

  if (password.trim() === '') {
    // Campo vazio - permitido para validação opcional
    isValid = false;
    message = null;
  } else if (password.length < 8) {
    message = 'Senha deve ter pelo menos 8 caracteres';
  } else if (!criteria[1].valid) {
    message = 'Senha deve conter pelo menos 1 letra minúscula';
  } else if (!criteria[2].valid) {
    message = 'Senha deve conter pelo menos 1 letra maiúscula';
  } else if (!criteria[3].valid) {
    message = 'Senha deve conter pelo menos 1 número';
  } else if (!criteria[4].valid) {
    message = `Senha deve conter pelo menos 1 caractere especial (${SPECIAL_CHARS})`;
  } else if (!onlyAllowedChars) {
    message = `Senha contém caracteres não permitidos. Use apenas letras, números e ${SPECIAL_CHARS}`;
  } else {
    isValid = true;
    message = null;
  }

  return {
    isValid,
    message,
    criteria,
  };
};

/**
 * Função de validação compatível com FormInput
 * @param value - Valor da senha
 * @returns Mensagem de erro ou null se válida
 */
export const passwordValidator = (value: string): string | null => {
  const result = validatePassword(value);
  return result.message;
};

/**
 * Verifica se a senha atende aos critérios mínimos do backend
 * @param password - A senha a ser verificada
 * @returns true se a senha é válida
 */
export const isPasswordValid = (password: string): boolean => {
  return validatePassword(password).isValid;
};

/**
 * Obtém a força da senha baseada nos critérios atendidos
 * @param password - A senha a ser avaliada
 * @returns Número de 0 a 5 representando a força
 */
export const getPasswordStrength = (password: string): number => {
  const result = validatePassword(password);
  return result.criteria.filter(criterion => criterion.valid).length;
};

/**
 * Obtém a descrição textual da força da senha
 * @param password - A senha a ser avaliada
 * @returns Descrição da força da senha
 */
export const getPasswordStrengthText = (password: string): string => {
  const strength = getPasswordStrength(password);
  
  switch (strength) {
    case 0:
    case 1:
      return 'Muito fraca';
    case 2:
      return 'Fraca';
    case 3:
      return 'Regular';
    case 4:
      return 'Forte';
    case 5:
      return 'Muito forte';
    default:
      return 'Inválida';
  }
};

/**
 * Obtém a cor associada à força da senha
 * @param password - A senha a ser avaliada
 * @returns Cor em formato hex
 */
export const getPasswordStrengthColor = (password: string): string => {
  const strength = getPasswordStrength(password);
  
  switch (strength) {
    case 0:
    case 1:
      return '#E53E3E'; // Vermelho
    case 2:
      return '#FFC72C'; // Amarelo
    case 3:
      return '#3182CE'; // Azul
    case 4:
    case 5:
      return '#42C17A'; // Verde
    default:
      return '#8E8E93'; // Cinza
  }
};

