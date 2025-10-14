"use strict";
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
exports.EmailService = void 0;
var nodemailer_1 = require("nodemailer");
var EmailService = /** @class */ (function () {
    function EmailService() {
    }
    EmailService.createTransporter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var testAccount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.transporter) {
                            return [2 /*return*/, this.transporter];
                        }
                        if (!(process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST)) return [3 /*break*/, 2];
                        return [4 /*yield*/, nodemailer_1.default.createTestAccount()];
                    case 1:
                        testAccount = _a.sent();
                        this.transporter = nodemailer_1.default.createTransport({
                            host: 'smtp.ethereal.email',
                            port: 587,
                            secure: false,
                            auth: {
                                user: testAccount.user,
                                pass: testAccount.pass,
                            },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        // Configuração para produção
                        this.transporter = nodemailer_1.default.createTransport({
                            host: process.env.SMTP_HOST,
                            port: parseInt(process.env.SMTP_PORT || '587'),
                            secure: process.env.SMTP_SECURE === 'true',
                            auth: {
                                user: process.env.SMTP_USER,
                                pass: process.env.SMTP_PASS,
                            },
                        });
                        _a.label = 3;
                    case 3: return [2 /*return*/, this.transporter];
                }
            });
        });
    };
    EmailService.sendEmail = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var transporter, mailOptions, info, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.createTransporter()];
                    case 1:
                        transporter = _a.sent();
                        mailOptions = {
                            from: process.env.SMTP_FROM || 'noreply@giropro.com',
                            to: options.to,
                            subject: options.subject,
                            html: options.html,
                            text: options.text,
                        };
                        return [4 /*yield*/, transporter.sendMail(mailOptions)];
                    case 2:
                        info = _a.sent();
                        // Em desenvolvimento, mostrar o link de preview do Ethereal
                        if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
                            console.log('📧 Email enviado (desenvolvimento):', nodemailer_1.default.getTestMessageUrl(info));
                        }
                        else {
                            console.log('📧 Email enviado com sucesso para:', options.to);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ Erro ao enviar email:', error_1);
                        throw new Error('Falha ao enviar email');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EmailService.sendPasswordResetEmail = function (email, resetToken, userName) {
        return __awaiter(this, void 0, void 0, function () {
            var resetUrl, html, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resetUrl = "".concat(process.env.FRONTEND_URL || 'http://localhost:3000', "/reset-password?token=").concat(resetToken);
                        html = "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"utf-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Redefinir Senha - GiroPro</title>\n        <style>\n          body {\n            font-family: Arial, sans-serif;\n            line-height: 1.6;\n            color: #333;\n            max-width: 600px;\n            margin: 0 auto;\n            padding: 20px;\n          }\n          .header {\n            background-color: #007bff;\n            color: white;\n            padding: 20px;\n            text-align: center;\n            border-radius: 8px 8px 0 0;\n          }\n          .content {\n            background-color: #f8f9fa;\n            padding: 30px;\n            border-radius: 0 0 8px 8px;\n          }\n          .button {\n            display: inline-block;\n            background-color: #007bff;\n            color: white;\n            padding: 12px 24px;\n            text-decoration: none;\n            border-radius: 5px;\n            margin: 20px 0;\n          }\n          .footer {\n            margin-top: 30px;\n            padding-top: 20px;\n            border-top: 1px solid #ddd;\n            font-size: 12px;\n            color: #666;\n          }\n          .warning {\n            background-color: #fff3cd;\n            border: 1px solid #ffeaa7;\n            color: #856404;\n            padding: 15px;\n            border-radius: 5px;\n            margin: 20px 0;\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"header\">\n          <h1>\uD83D\uDE97 GiroPro</h1>\n          <h2>Redefini\u00E7\u00E3o de Senha</h2>\n        </div>\n        \n        <div class=\"content\">\n          <p>Ol\u00E1, <strong>".concat(userName, "</strong>!</p>\n          \n          <p>Recebemos uma solicita\u00E7\u00E3o para redefinir a senha da sua conta no GiroPro.</p>\n          \n          <p>Para criar uma nova senha, clique no bot\u00E3o abaixo:</p>\n          \n          <div style=\"text-align: center;\">\n            <a href=\"").concat(resetUrl, "\" class=\"button\">Redefinir Senha</a>\n          </div>\n          \n          <p>Ou copie e cole este link no seu navegador:</p>\n          <p style=\"word-break: break-all; background-color: #e9ecef; padding: 10px; border-radius: 5px;\">\n            ").concat(resetUrl, "\n          </p>\n          \n          <div class=\"warning\">\n            <strong>\u26A0\uFE0F Importante:</strong>\n            <ul>\n              <li>Este link \u00E9 v\u00E1lido por apenas <strong>1 hora</strong></li>\n              <li>Se voc\u00EA n\u00E3o solicitou esta redefini\u00E7\u00E3o, ignore este email</li>\n              <li>Sua senha atual permanecer\u00E1 inalterada at\u00E9 que voc\u00EA crie uma nova</li>\n            </ul>\n          </div>\n          \n          <p>Se voc\u00EA tiver problemas com o link acima, entre em contato conosco.</p>\n          \n          <p>Atenciosamente,<br>\n          <strong>Equipe GiroPro</strong></p>\n        </div>\n        \n        <div class=\"footer\">\n          <p>Este \u00E9 um email autom\u00E1tico, por favor n\u00E3o responda.</p>\n          <p>\u00A9 ").concat(new Date().getFullYear(), " GiroPro. Todos os direitos reservados.</p>\n        </div>\n      </body>\n      </html>\n    ");
                        text = "\n      GiroPro - Redefini\u00E7\u00E3o de Senha\n      \n      Ol\u00E1, ".concat(userName, "!\n      \n      Recebemos uma solicita\u00E7\u00E3o para redefinir a senha da sua conta no GiroPro.\n      \n      Para criar uma nova senha, acesse o link abaixo:\n      ").concat(resetUrl, "\n      \n      IMPORTANTE:\n      - Este link \u00E9 v\u00E1lido por apenas 1 hora\n      - Se voc\u00EA n\u00E3o solicitou esta redefini\u00E7\u00E3o, ignore este email\n      - Sua senha atual permanecer\u00E1 inalterada at\u00E9 que voc\u00EA crie uma nova\n      \n      Se voc\u00EA tiver problemas, entre em contato conosco.\n      \n      Atenciosamente,\n      Equipe GiroPro\n      \n      ---\n      Este \u00E9 um email autom\u00E1tico, por favor n\u00E3o responda.\n      \u00A9 ").concat(new Date().getFullYear(), " GiroPro. Todos os direitos reservados.\n    ");
                        return [4 /*yield*/, this.sendEmail({
                                to: email,
                                subject: '🔐 GiroPro - Redefinir sua senha',
                                html: html,
                                text: text,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EmailService.sendWelcomeEmail = function (email, userName) {
        return __awaiter(this, void 0, void 0, function () {
            var html, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        html = "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"utf-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Bem-vindo ao GiroPro!</title>\n        <style>\n          body {\n            font-family: Arial, sans-serif;\n            line-height: 1.6;\n            color: #333;\n            max-width: 600px;\n            margin: 0 auto;\n            padding: 20px;\n          }\n          .header {\n            background-color: #28a745;\n            color: white;\n            padding: 20px;\n            text-align: center;\n            border-radius: 8px 8px 0 0;\n          }\n          .content {\n            background-color: #f8f9fa;\n            padding: 30px;\n            border-radius: 0 0 8px 8px;\n          }\n          .button {\n            display: inline-block;\n            background-color: #28a745;\n            color: white;\n            padding: 12px 24px;\n            text-decoration: none;\n            border-radius: 5px;\n            margin: 20px 0;\n          }\n          .footer {\n            margin-top: 30px;\n            padding-top: 20px;\n            border-top: 1px solid #ddd;\n            font-size: 12px;\n            color: #666;\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"header\">\n          <h1>\uD83D\uDE97 GiroPro</h1>\n          <h2>Bem-vindo!</h2>\n        </div>\n        \n        <div class=\"content\">\n          <p>Ol\u00E1, <strong>".concat(userName, "</strong>!</p>\n          \n          <p>Seja bem-vindo ao <strong>GiroPro</strong>! \uD83C\uDF89</p>\n          \n          <p>Sua conta foi criada com sucesso e voc\u00EA j\u00E1 pode come\u00E7ar a gerenciar seus ve\u00EDculos, jornadas e despesas de forma inteligente.</p>\n          \n          <div style=\"text-align: center;\">\n            <a href=\"").concat(process.env.FRONTEND_URL || 'http://localhost:3000', "/dashboard\" class=\"button\">Acessar Dashboard</a>\n          </div>\n          \n          <p><strong>O que voc\u00EA pode fazer no GiroPro:</strong></p>\n          <ul>\n            <li>\uD83D\uDCCA Gerenciar m\u00FAltiplos ve\u00EDculos</li>\n            <li>\u26FD Controlar abastecimentos</li>\n            <li>\uD83D\uDEE3\uFE0F Registrar jornadas</li>\n            <li>\uD83D\uDCB0 Acompanhar despesas</li>\n            <li>\uD83D\uDCC8 Visualizar relat\u00F3rios detalhados</li>\n          </ul>\n          \n          <p>Se precisar de ajuda, nossa equipe est\u00E1 sempre dispon\u00EDvel!</p>\n          \n          <p>Atenciosamente,<br>\n          <strong>Equipe GiroPro</strong></p>\n        </div>\n        \n        <div class=\"footer\">\n          <p>Este \u00E9 um email autom\u00E1tico, por favor n\u00E3o responda.</p>\n          <p>\u00A9 ").concat(new Date().getFullYear(), " GiroPro. Todos os direitos reservados.</p>\n        </div>\n      </body>\n      </html>\n    ");
                        text = "\n      GiroPro - Bem-vindo!\n      \n      Ol\u00E1, ".concat(userName, "!\n      \n      Seja bem-vindo ao GiroPro! \uD83C\uDF89\n      \n      Sua conta foi criada com sucesso e voc\u00EA j\u00E1 pode come\u00E7ar a gerenciar seus ve\u00EDculos, jornadas e despesas de forma inteligente.\n      \n      Acesse: ").concat(process.env.FRONTEND_URL || 'http://localhost:3000', "/dashboard\n      \n      O que voc\u00EA pode fazer no GiroPro:\n      - Gerenciar m\u00FAltiplos ve\u00EDculos\n      - Controlar abastecimentos\n      - Registrar jornadas\n      - Acompanhar despesas\n      - Visualizar relat\u00F3rios detalhados\n      \n      Se precisar de ajuda, nossa equipe est\u00E1 sempre dispon\u00EDvel!\n      \n      Atenciosamente,\n      Equipe GiroPro\n      \n      ---\n      Este \u00E9 um email autom\u00E1tico, por favor n\u00E3o responda.\n      \u00A9 ").concat(new Date().getFullYear(), " GiroPro. Todos os direitos reservados.\n    ");
                        return [4 /*yield*/, this.sendEmail({
                                to: email,
                                subject: '🎉 Bem-vindo ao GiroPro!',
                                html: html,
                                text: text,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EmailService.transporter = null;
    return EmailService;
}());
exports.EmailService = EmailService;
