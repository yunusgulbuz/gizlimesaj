type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.logLevel];
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, error } = entry;
    let log = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      log += ` | Context: ${JSON.stringify(context)}`;
    }
    
    if (error) {
      log += ` | Error: ${error.message}`;
      if (this.isDevelopment && error.stack) {
        log += `\nStack: ${error.stack}`;
      }
    }
    
    return log;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    const formattedLog = this.formatLog(entry);

    // Console output
    switch (level) {
      case 'debug':
        console.debug(formattedLog);
        break;
      case 'info':
        console.info(formattedLog);
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'error':
        console.error(formattedLog);
        break;
    }

    // In production, you might want to send logs to external services
    if (!this.isDevelopment) {
      this.sendToExternalService(entry);
    }
  }

  private async sendToExternalService(entry: LogEntry) {
    // Implement external logging service integration here
    // Examples: Sentry, LogRocket, DataDog, etc.
    
    try {
      // Example: Send to a logging API
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // });
    } catch (error) {
      // Fallback to console if external service fails
      console.error('Failed to send log to external service:', error);
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }

  // Specific logging methods for common scenarios
  apiRequest(method: string, path: string, userId?: string, duration?: number) {
    this.info(`API Request: ${method} ${path}`, {
      method,
      path,
      userId,
      duration,
    });
  }

  apiError(method: string, path: string, error: Error, userId?: string) {
    this.error(`API Error: ${method} ${path}`, error, {
      method,
      path,
      userId,
    });
  }

  paymentEvent(event: string, orderId: string, amount?: number, status?: string) {
    this.info(`Payment Event: ${event}`, {
      event,
      orderId,
      amount,
      status,
    });
  }

  securityEvent(event: string, ip?: string, userAgent?: string, details?: Record<string, any>) {
    this.warn(`Security Event: ${event}`, {
      event,
      ip,
      userAgent,
      ...details,
    });
  }

  performanceMetric(metric: string, value: number, unit: string = 'ms') {
    this.info(`Performance Metric: ${metric}`, {
      metric,
      value,
      unit,
    });
  }
}

// Create singleton instance
export const logger = new Logger();

// Performance monitoring helper
export function withPerformanceLogging<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const start = Date.now();
    try {
      const result = fn(...args);
      
      // Handle both sync and async functions
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = Date.now() - start;
          logger.performanceMetric(name, duration);
        });
      } else {
        const duration = Date.now() - start;
        logger.performanceMetric(name, duration);
        return result;
      }
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`Function ${name} failed after ${duration}ms`, error as Error);
      throw error;
    }
  }) as T;
}