"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var DateUtils = /** @class */ (function () {
    function DateUtils() {
    }
    /**
     * Calcula o período semanal com base nas datas fornecidas ou na semana atual.
     * @param startDateString - Data de início opcional no formato string.
     * @param endDateString - Data de fim opcional no formato string.
     * @returns Objeto com data de início e fim da semana.
     */
    DateUtils.calculateWeeklyPeriod = function (startDateString, endDateString) {
        var start;
        var end;
        if (startDateString && endDateString) {
            start = new Date(startDateString);
            end = new Date(endDateString);
        }
        else {
            var now = new Date();
            start = (0, date_fns_1.startOfWeek)(now, { locale: locale_1.ptBR });
            end = (0, date_fns_1.endOfWeek)(now, { locale: locale_1.ptBR });
        }
        return { dataInicio: start, dataFim: end };
    };
    /**
     * Calcula o período mensal com base nas datas fornecidas ou no mês atual.
     * @param startDateString - Data de início opcional no formato string.
     * @param endDateString - Data de fim opcional no formato string.
     * @returns Objeto com data de início e fim do mês.
     */
    DateUtils.calculateMonthlyPeriod = function (startDateString, endDateString) {
        var start;
        var end;
        if (startDateString && endDateString) {
            start = new Date(startDateString);
            end = new Date(endDateString);
        }
        else {
            var now = new Date();
            start = (0, date_fns_1.startOfMonth)(now);
            end = (0, date_fns_1.endOfMonth)(now);
        }
        return { dataInicio: start, dataFim: end };
    };
    /**
     * Calcula o offset de semanas a partir de uma data.
     * @param date - Data de referência.
     * @param offset - Número de semanas para subtrair.
     * @returns Objeto com data de início e fim da semana offset.
     */
    DateUtils.calculateWeekOffset = function (date, offset) {
        var week = (0, date_fns_1.subWeeks)(date, offset);
        var startDate = (0, date_fns_1.startOfWeek)(week, { locale: locale_1.ptBR });
        var endDate = (0, date_fns_1.endOfWeek)(week, { locale: locale_1.ptBR });
        return { startDate: startDate, endDate: endDate };
    };
    /**
     * Calcula o offset de meses a partir de uma data.
     * @param date - Data de referência.
     * @param offset - Número de meses para subtrair.
     * @returns Objeto com data de início e fim do mês offset.
     */
    DateUtils.calculateMonthOffset = function (date, offset) {
        var month = (0, date_fns_1.subMonths)(date, offset);
        var startDate = (0, date_fns_1.startOfMonth)(month);
        var endDate = (0, date_fns_1.endOfMonth)(month);
        return { startDate: startDate, endDate: endDate };
    };
    /**
     * Formata um período de datas.
     * @param startDate - Data de início.
     * @param endDate - Data de fim.
     * @returns String formatada do período.
     */
    DateUtils.formatPeriod = function (startDate, endDate) {
        var start = (0, date_fns_1.format)(startDate, 'dd/MM/yyyy', { locale: locale_1.ptBR });
        var end = (0, date_fns_1.format)(endDate, 'dd/MM/yyyy', { locale: locale_1.ptBR });
        return "".concat(start, " - ").concat(end);
    };
    /**
     * Formata mês e ano de uma data.
     * @param date - Data.
     * @returns String formatada do mês e ano.
     */
    DateUtils.formatMonthYear = function (date) {
        return (0, date_fns_1.format)(date, 'MMMM yyyy', { locale: locale_1.ptBR });
    };
    /**
     * Retorna todos os dias entre duas datas.
     * @param startDate - Data de início.
     * @param endDate - Data de fim.
     * @returns Array de datas.
     */
    DateUtils.getDaysBetween = function (startDate, endDate) {
        return (0, date_fns_1.eachDayOfInterval)({ start: startDate, end: endDate });
    };
    /**
     * Retorna todas as semanas entre duas datas.
     * @param startDate - Data de início.
     * @param endDate - Data de fim.
     * @returns Array de objetos de semana com número da semana, data de início e fim.
     */
    DateUtils.getWeeksBetween = function (startDate, endDate) {
        var weeks = (0, date_fns_1.eachWeekOfInterval)({ start: startDate, end: endDate }, { locale: locale_1.ptBR });
        return weeks.map(function (weekStart, index) { return ({
            weekNumber: index + 1,
            startDate: weekStart,
            endDate: (0, date_fns_1.endOfWeek)(weekStart, { locale: locale_1.ptBR }),
        }); });
    };
    /**
     * Calcula o período de análise (trimestre, semestre, ano).
     * @param periodType - Tipo de período de análise.
     * @returns Objeto com data de início e fim do período.
     */
    DateUtils.calculatePeriod = function (periodType) {
        var now = new Date();
        var startDate;
        var endDate;
        switch (periodType) {
            case 'trimestre':
                startDate = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 2));
                endDate = (0, date_fns_1.endOfMonth)(now);
                break;
            case 'semestre':
                startDate = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 5));
                endDate = (0, date_fns_1.endOfMonth)(now);
                break;
            case 'ano':
                startDate = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 11));
                endDate = (0, date_fns_1.endOfMonth)(now);
                break;
            default:
                startDate = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 2));
                endDate = (0, date_fns_1.endOfMonth)(now);
        }
        return { dataInicio: startDate, dataFim: endDate };
    };
    return DateUtils;
}());
exports.DateUtils = DateUtils;
