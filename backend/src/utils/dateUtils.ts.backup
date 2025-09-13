import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, format, addDays, eachDayOfInterval, eachWeekOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export class DateUtils {
  /**
   * Calcula o período semanal com base nas datas fornecidas ou na semana atual.
   * @param startDateString - Data de início opcional no formato string.
   * @param endDateString - Data de fim opcional no formato string.
   * @returns Objeto com data de início e fim da semana.
   */
  static calculateWeeklyPeriod(startDateString?: string, endDateString?: string) {
    let start: Date;
    let end: Date;

    if (startDateString && endDateString) {
      start = new Date(startDateString);
      end = new Date(endDateString);
    } else {
      const now = new Date();
      start = startOfWeek(now, { locale: ptBR });
      end = endOfWeek(now, { locale: ptBR });
    }
    return { dataInicio: start, dataFim: end };
  }

  /**
   * Calcula o período mensal com base nas datas fornecidas ou no mês atual.
   * @param startDateString - Data de início opcional no formato string.
   * @param endDateString - Data de fim opcional no formato string.
   * @returns Objeto com data de início e fim do mês.
   */
  static calculateMonthlyPeriod(startDateString?: string, endDateString?: string) {
    let start: Date;
    let end: Date;

    if (startDateString && endDateString) {
      start = new Date(startDateString);
      end = new Date(endDateString);
    } else {
      const now = new Date();
      start = startOfMonth(now);
      end = endOfMonth(now);
    }
    return { dataInicio: start, dataFim: end };
  }

  /**
   * Calcula o offset de semanas a partir de uma data.
   * @param date - Data de referência.
   * @param offset - Número de semanas para subtrair.
   * @returns Objeto com data de início e fim da semana offset.
   */
  static calculateWeekOffset(date: Date, offset: number) {
    const week = subWeeks(date, offset);
    const startDate = startOfWeek(week, { locale: ptBR });
    const endDate = endOfWeek(week, { locale: ptBR });
    return { startDate, endDate };
  }

  /**
   * Calcula o offset de meses a partir de uma data.
   * @param date - Data de referência.
   * @param offset - Número de meses para subtrair.
   * @returns Objeto com data de início e fim do mês offset.
   */
  static calculateMonthOffset(date: Date, offset: number) {
    const month = subMonths(date, offset);
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);
    return { startDate, endDate };
  }

  /**
   * Formata um período de datas.
   * @param startDate - Data de início.
   * @param endDate - Data de fim.
   * @returns String formatada do período.
   */
  static formatPeriod(startDate: Date, endDate: Date): string {
    const start = format(startDate, 'dd/MM/yyyy', { locale: ptBR });
    const end = format(endDate, 'dd/MM/yyyy', { locale: ptBR });
    return `${start} - ${end}`;
  }

  /**
   * Formata mês e ano de uma data.
   * @param date - Data.
   * @returns String formatada do mês e ano.
   */
  static formatMonthYear(date: Date): string {
    return format(date, 'MMMM yyyy', { locale: ptBR });
  }

  /**
   * Retorna todos os dias entre duas datas.
   * @param startDate - Data de início.
   * @param endDate - Data de fim.
   * @returns Array de datas.
   */
  static getDaysBetween(startDate: Date, endDate: Date): Date[] {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }

  /**
   * Retorna todas as semanas entre duas datas.
   * @param startDate - Data de início.
   * @param endDate - Data de fim.
   * @returns Array de objetos de semana com número da semana, data de início e fim.
   */
  static getWeeksBetween(startDate: Date, endDate: Date) {
    const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { locale: ptBR });
    return weeks.map((weekStart, index) => ({
      weekNumber: index + 1,
      startDate: weekStart,
      endDate: endOfWeek(weekStart, { locale: ptBR }),
    }));
  }
}


