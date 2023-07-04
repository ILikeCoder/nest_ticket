import { ConsoleLogger, Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.File({ filename: 'logs/app.log' })],
  });

  log(message: any, context?: string) {
    super.log(message, context);
    this.logger.log('info', message, { context });
  }
  ticket(message: string) {
    this.logger.log('info', message);
  }

  error(message: any, trace?: string, context?: string) {
    // super.error(message, trace, context);
    this.logger.log('error', message, { trace, context });
  }

  warn(message: any, context?: string) {
    // super.warn(message, context);
    this.logger.log('warn', message, { context });
  }

  debug(message: any, context?: string) {
    // super.debug(message, context);
    this.logger.log('debug', message, { context });
  }

  verbose(message: any, context?: string) {
    // super.verbose(message, context);
    this.logger.log('verbose', message, { context });
  }
}
