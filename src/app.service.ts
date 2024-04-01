import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly loggerService: LoggerService) {
    this.handleGlobalErrors();
  }
  getHello(): string {
    return 'Hello World!';
  }

  private handleGlobalErrors() {
    process.on('uncaughtException', (error: Error) => {
      this.loggerService.error(`Uncaught Exception: ${error.stack}`);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: any) => {
      this.loggerService.error(`Unhandled Rejection: ${reason}`);
    });
  }
}
