import { describe, it, expect } from '@jest/globals';

// Teste para funções utilitárias básicas
describe('Utils Tests', () => {
  describe('Date Utils', () => {
    it('deve formatar data corretamente', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = date.toISOString().split('T')[0];
      expect(formatted).toBe('2024-01-15');
    });

    it('deve calcular diferença entre datas', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-10');
      const diffInDays = Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
      expect(diffInDays).toBe(5);
    });
  });

  describe('String Utils', () => {
    it('deve validar formato de email', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test('test@example.com')).toBe(true);
      expect(emailRegex.test('invalid-email')).toBe(false);
    });

    it('deve validar formato de telefone brasileiro', () => {
      const phoneRegex = /^\d{10,11}$/;
      expect(phoneRegex.test('11999999999')).toBe(true);
      expect(phoneRegex.test('1199999999')).toBe(true);
      expect(phoneRegex.test('119999999')).toBe(false);
    });
  });

  describe('Number Utils', () => {
    it('deve calcular porcentagem corretamente', () => {
      const calculatePercentage = (value: number, total: number): number => {
        return (value / total) * 100;
      };
      
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 4)).toBe(25);
    });

    it('deve formatar valores monetários', () => {
      const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      };
      
      const result1 = formatCurrency(100.50);
      const result2 = formatCurrency(1000);
      
      expect(result1).toContain('100,50');
      expect(result2).toContain('1.000,00');
    });
  });

  describe('Array Utils', () => {
    it('deve remover duplicatas de array', () => {
      const removeDuplicates = (arr: any[]): any[] => {
        return [...new Set(arr)];
      };
      
      expect(removeDuplicates([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(removeDuplicates(['a', 'b', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('deve agrupar elementos por propriedade', () => {
      const groupBy = (arr: any[], key: string): Record<string, any[]> => {
        return arr.reduce((groups, item) => {
          const group = item[key];
          groups[group] = groups[group] || [];
          groups[group].push(item);
          return groups;
        }, {});
      };
      
      const data = [
        { type: 'A', value: 1 },
        { type: 'B', value: 2 },
        { type: 'A', value: 3 }
      ];
      
      const grouped = groupBy(data, 'type');
      expect(grouped.A).toHaveLength(2);
      expect(grouped.B).toHaveLength(1);
    });
  });

  describe('Validation Utils', () => {
    it('deve validar CPF básico', () => {
      const isValidCPF = (cpf: string): boolean => {
        // Validação básica de formato
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.length === 11 && !/^(\d)\1{10}$/.test(cleanCPF);
      };
      
      expect(isValidCPF('123.456.789-01')).toBe(true);
      expect(isValidCPF('111.111.111-11')).toBe(false);
      expect(isValidCPF('123456789')).toBe(false);
    });

    it('deve validar senha forte', () => {
      const isStrongPassword = (password: string): boolean => {
        return password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /\d/.test(password);
      };
      
      expect(isStrongPassword('MinhaSenh@123')).toBe(true);
      expect(isStrongPassword('senha123')).toBe(false);
      expect(isStrongPassword('SENHA123')).toBe(false);
    });
  });
});

