import fs from 'fs';
import path from 'path';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  meta?: any;
  userId?: string;
  requestId?: string;
}

class Logger {
  private logLevel: LogLevel;
  private logDir: string;

  constructor() {
    this.logLevel = this.getLogLevel();
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  private getLogLevel(): LogLevel {
    const level = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
    switch (level) {
      case 'ERROR': return LogLevel.ERROR;
      case 'WARN': return LogLevel.WARN;
      case 'INFO': return LogLevel.INFO;
      case 'DEBUG': return LogLevel.DEBUG;
      default: return LogLevel.INFO;
    }
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private formatLogEntry(level: string, message: string, meta?: any, userId?: string, requestId?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      userId,
      requestId
    };
  }

  private writeToFile(logEntry: LogEntry): void {
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}.log`;
    const filepath = path.join(this.logDir, filename);
    
    const logLine = JSON.stringify(logEntry) + '\n';
    
    try {
      fs.appendFileSync(filepath, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private log(level: LogLevel, levelName: string, message: string, meta?: any, userId?: string, requestId?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry = this.formatLogEntry(levelName, message, meta, userId, requestId);
    
    // Console output
    const consoleMessage = `[${logEntry.timestamp}] ${levelName}: ${message}`;
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(consoleMessage, meta || '');
        break;
      case LogLevel.WARN:
        console.warn(consoleMessage, meta || '');
        break;
      case LogLevel.INFO:
        console.info(consoleMessage, meta || '');
        break;
      case LogLevel.DEBUG:
        console.debug(consoleMessage, meta || '');
        break;
    }

    // File output
    this.writeToFile(logEntry);
  }

  error(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.log(LogLevel.ERROR, 'ERROR', message, meta, userId, requestId);
  }

  warn(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.log(LogLevel.WARN, 'WARN', message, meta, userId, requestId);
  }

  info(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.log(LogLevel.INFO, 'INFO', message, meta, userId, requestId);
  }

  debug(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, meta, userId, requestId);
  }

  // Métodos específicos para diferentes tipos de eventos
  apiRequest(method: string, url: string, userId?: string, requestId?: string): void {
    this.info(`API Request: ${method} ${url}`, { method, url }, userId, requestId);
  }

  apiResponse(method: string, url: string, statusCode: number, duration: number, userId?: string, requestId?: string): void {
    this.info(`API Response: ${method} ${url} - ${statusCode} (${duration}ms)`, {
      method,
      url,
      statusCode,
      duration
    }, userId, requestId);
  }

  authEvent(event: string, userId?: string, email?: string, success: boolean = true): void {
    const level = success ? LogLevel.INFO : LogLevel.WARN;
    const levelName = success ? 'INFO' : 'WARN';
    
    this.log(level, levelName, `Auth Event: ${event}`, {
      event,
      userId,
      email,
      success
    }, userId);
  }

  databaseQuery(query: string, duration: number, userId?: string, requestId?: string): void {
    this.debug(`Database Query: ${query} (${duration}ms)`, {
      query,
      duration
    }, userId, requestId);
  }

  businessLogic(action: string, details: any, userId?: string, requestId?: string): void {
    this.info(`Business Logic: ${action}`, {
      action,
      details
    }, userId, requestId);
  }

  securityEvent(event: string, details: any, userId?: string, ip?: string): void {
    this.warn(`Security Event: ${event}`, {
      event,
      details,
      ip
    }, userId);
  }

  performanceMetric(metric: string, value: number, unit: string, userId?: string, requestId?: string): void {
    this.info(`Performance Metric: ${metric} = ${value}${unit}`, {
      metric,
      value,
      unit
    }, userId, requestId);
  }
}

// Singleton instance
export const logger = new Logger();

// Middleware para adicionar requestId e logging automático
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface LoggedRequest extends Request {
  requestId?: string;
  startTime?: number;
}

export const requestLogger = (req: LoggedRequest, res: Response, next: NextFunction): void => {
  req.requestId = uuidv4();
  req.startTime = Date.now();
  
  const userId = (req as any).userId;
  
  logger.apiRequest(req.method, req.url, userId, req.requestId);
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body: any) {
    const duration = Date.now() - (req.startTime || 0);
    logger.apiResponse(req.method, req.url, res.statusCode, duration, userId, req.requestId);
    return originalJson.call(this, body);
  };
  
  next();
};

