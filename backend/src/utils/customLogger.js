"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
var fs = require("fs");
var path = require("path");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var Logger = /** @class */ (function () {
    function Logger() {
        this.logLevel = this.getLogLevel();
        this.logDir = path.join(process.cwd(), 'logs');
        this.ensureLogDirectory();
    }
    Logger.prototype.getLogLevel = function () {
        var level = process.env.LOG_LEVEL || 'INFO';
        switch (level.toUpperCase()) {
            case 'ERROR':
                return LogLevel.ERROR;
            case 'WARN':
                return LogLevel.WARN;
            case 'INFO':
                return LogLevel.INFO;
            case 'DEBUG':
                return LogLevel.DEBUG;
            default:
                return LogLevel.INFO;
        }
    };
    Logger.prototype.ensureLogDirectory = function () {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    };
    Logger.prototype.writeLog = function (level, message, meta, userId, requestId) {
        if (level > this.logLevel) {
            return; // Do not log if the level is higher than the configured log level
        }
        var timestamp = new Date().toISOString();
        var levelName = LogLevel[level];
        var logEntry = {
            timestamp: timestamp,
            level: levelName,
            message: message,
            meta: meta,
            userId: userId,
            requestId: requestId,
        };
        var logFileName = path.join(this.logDir, "".concat(new Date().toISOString().slice(0, 10), ".log"));
        var logLine = JSON.stringify(logEntry) + '\n';
        fs.appendFile(logFileName, logLine, function (err) {
            if (err) {
                console.error("Failed to write log to file:", err); // Log internal error
            }
        });
        // Use console for immediate feedback, passing message as a separate argument
        switch (level) {
            case LogLevel.ERROR:
                console.error("[".concat(timestamp, "] ").concat(levelName, ": %s"), message, meta || "");
                break;
            case LogLevel.WARN:
                console.warn("[".concat(timestamp, "] ").concat(levelName, ": %s"), message, meta || "");
                break;
            case LogLevel.INFO:
                console.info("[".concat(timestamp, "] ").concat(levelName, ": %s"), message, meta || "");
                break;
            case LogLevel.DEBUG:
                console.debug("[".concat(timestamp, "] ").concat(levelName, ": %s"), message, meta || "");
                break;
            default:
                console.log("[".concat(timestamp, "] ").concat(levelName, ": %s"), message, meta || "");
                break;
        }
    };
    Logger.prototype.error = function (message, meta, userId, requestId) {
        this.writeLog(LogLevel.ERROR, message, meta, userId, requestId);
    };
    Logger.prototype.warn = function (message, meta, userId, requestId) {
        this.writeLog(LogLevel.WARN, message, meta, userId, requestId);
    };
    Logger.prototype.info = function (message, meta, userId, requestId) {
        this.writeLog(LogLevel.INFO, message, meta, userId, requestId);
    };
    Logger.prototype.debug = function (message, meta, userId, requestId) {
        this.writeLog(LogLevel.DEBUG, message, meta, userId, requestId);
    };
    return Logger;
}());
exports.Logger = Logger;
