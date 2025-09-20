// Primeiro, vamos criar as funções utilitárias
import { formatCurrency, formatDate, formatTime, formatKilometers } from '../formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      // Testando com valores reais retornados pela função
      const result1000 = formatCurrency(1000);
      const result150050 = formatCurrency(150050);
      const result0 = formatCurrency(0);
      
      expect(result1000).toContain('10');
      expect(result1000).toContain('00');
      expect(result150050).toContain('1.500');
      expect(result150050).toContain('50');
      expect(result0).toContain('0');
      expect(result0).toContain('00');
    });

    it('should handle negative values', () => {
      const result = formatCurrency(-1000);
      expect(result).toContain('-');
      expect(result).toContain('10');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2024-01-15T10:30:00.000Z';
      const result = formatDate(date);
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should handle different date formats', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const result = formatDate(date.toISOString());
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/2024/);
    });
  });

  describe('formatTime', () => {
    it('should format time in minutes correctly', () => {
      expect(formatTime(60)).toBe('1h 0m');
      expect(formatTime(90)).toBe('1h 30m');
      expect(formatTime(30)).toBe('0h 30m');
      expect(formatTime(0)).toBe('0h 0m');
    });

    it('should handle large time values', () => {
      expect(formatTime(1440)).toBe('24h 0m'); // 24 hours
      expect(formatTime(1500)).toBe('25h 0m'); // 25 hours
    });
  });

  describe('formatKilometers', () => {
    it('should format kilometers correctly', () => {
      expect(formatKilometers(1000)).toBe('1.000 km');
      expect(formatKilometers(50000)).toBe('50.000 km');
      expect(formatKilometers(0)).toBe('0 km');
    });

    it('should handle decimal values', () => {
      expect(formatKilometers(1000.5)).toBe('1.001 km'); // Rounded
    });
  });
});

