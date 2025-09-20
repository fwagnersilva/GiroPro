import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  meta?: any;
  userId?: string;
  requestId?: string;
}

export class Logger {
  private logLevel: LogLevel;
  private logDir: string;

  constructor() {
    this.logLevel = this.getLogLevel();
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  private getLogLevel(): LogLevel {
    const level = process.env.LOG_LEVEL || 'INFO';
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
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private writeLog(level: LogLevel, message: string, meta?: any, userId?: string, requestId?: string): void {
    if (level > this.logLevel) {
      return; // Do not log if the level is higher than the configured log level
    }

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];

    const logEntry: LogEntry = {
      timestamp,
      level: levelName,
      message,
      meta,
      userId,
      requestId,
    };

    const logFileName = path.join(this.logDir, `${new Date().toISOString().slice(0, 10)}.log`);
    const logLine = JSON.stringify(logEntry) + '\n';

    fs.appendFile(logFileName, logLine, (err) => {
      if (err) {
        console.error("Failed to write log to file:", err); // Log internal error
      }
    });

    // Use console for immediate feedback, passing message as a separate argument
    switch (level) {
      case LogLevel.ERROR:
        console.error(`[${timestamp}] ${levelName}: %s`, message, meta || "");
        break;
      case LogLevel.WARN:
        console.warn(`[${timestamp}] ${levelName}: %s`, message, meta || "");
        break;
      case LogLevel.INFO:
        console.info(`[${timestamp}] ${levelName}: %s`, message, meta || "");
        break;
      case LogLevel.DEBUG:
        console.debug(`[${timestamp}] ${levelName}: %s`, message, meta || "");
        break;
      default:
        console.log(`[${timestamp}] ${levelName}: %s`, message, meta || "");
        break;
    }
  }

  error(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.writeLog(LogLevel.ERROR, message, meta, userId, requestId);
  }

  warn(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.writeLog(LogLevel.WARN, message, meta, userId, requestId);
  }

  info(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.writeLog(LogLevel.INFO, message, meta, userId, requestId);
  }

  debug(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.writeLog(LogLevel.DEBUG, message, meta, userId, requestId);
  }
}
