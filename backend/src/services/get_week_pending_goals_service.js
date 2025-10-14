"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekPendingGoals = getWeekPendingGoals;
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
function getWeekPendingGoals() {
    return __awaiter(this, arguments, void 0, function (_a) {
        var startOfWeek, endOfWeek, pendingGoals;
        var _b = _a === void 0 ? {} : _a, weekStartsAt = _b.weekStartsAt;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    startOfWeek = weekStartsAt ? new Date(weekStartsAt) : getStartOfWeek(new Date());
                    endOfWeek = getEndOfWeek(startOfWeek);
                    return [4 /*yield*/, db_1.db
                            .select({
                            id: schema_postgres_1.metas.id,
                            titulo: schema_postgres_1.metas.titulo,
                            desiredWeeklyFrequency: schema_postgres_1.metas.valorObjetivo,
                            currentProgress: schema_postgres_1.metas.valorAtual,
                        })
                            .from(schema_postgres_1.metas)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.metas.periodoMeta, "semanal"), // Filtrar por metas semanais
                        (0, drizzle_orm_1.lte)(schema_postgres_1.metas.dataInicio, endOfWeek), (0, drizzle_orm_1.gte)(schema_postgres_1.metas.dataFim, startOfWeek), (0, drizzle_orm_1.eq)(schema_postgres_1.metas.status, "ativa"), (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " < ", ""], ["", " < ", "" // Onde o valor atual é menor que o objetivo
                        ])), schema_postgres_1.metas.valorAtual, schema_postgres_1.metas.valorObjetivo)))];
                case 1:
                    pendingGoals = _c.sent();
                    return [2 /*return*/, {
                            pendingGoals: pendingGoals.map(function (goal) { return ({
                                id: goal.id,
                                titulo: goal.titulo,
                                desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
                                currentProgress: goal.currentProgress,
                            }); }),
                        }];
            }
        });
    });
}
function getStartOfWeek(date) {
    var startOfWeek = new Date(date);
    var day = startOfWeek.getDay();
    var diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
}
function getEndOfWeek(startOfWeek) {
    var endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
}
var templateObject_1;
