// Regex pré-compilado para melhor performance
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      message: 'Email é obrigatório'
    };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return {
      isValid: false,
      message: 'Formato de email inválido'
    };
  }

  return { isValid: true };
};

/**
 * Valida senha com critérios específicos
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      message: 'Senha é obrigatória'
    };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      message: `Senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`
    };
  }

  // Verifica se tem pelo menos 1 número
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Senha deve conter pelo menos 1 número'
    };
  }

  return { isValid: true };
};

/**
 * Valida se a confirmação de senha confere
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return {
      isValid: false,
      message: 'Confirmação de senha é obrigatória'
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: 'Senhas não conferem'
    };
  }

  return { isValid: true };
};

/**
 * Valida formulário de login completo
 */
export const validateLoginForm = (email: string, password: string) => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  return {
    email: emailValidation,
    password: passwordValidation,
    isValid: emailValidation.isValid && passwordValidation.isValid
  };
};

/**
 * Valida formulário de registro completo
 */
export const validateRegisterForm = (
  email: string,
  password: string,
  confirmPassword: string,
  name?: string
) => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const confirmPasswordValidation = validatePasswordConfirmation(password, confirmPassword);
  
  let nameValidation: ValidationResult = { isValid: true };
  
  if (name !== undefined) {
    nameValidation = validateName(name);
  }

  return {
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
    name: nameValidation,
    isValid: 
      emailValidation.isValid && 
      passwordValidation.isValid && 
      confirmPasswordValidation.isValid &&
      nameValidation.isValid
  };
};

/**
 * Valida nome (se fornecido)
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      message: 'Nome é obrigatório'
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: 'Nome deve ter pelo menos 2 caracteres'
    };
  }

  return { isValid: true };
};

/**
 * Utilitário para debounce de validações
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

