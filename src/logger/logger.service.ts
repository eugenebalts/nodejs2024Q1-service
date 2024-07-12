import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

enum LogLevel {
  LOG = 1,
  WARN = 2,
  ERROR = 3,
}

@Injectable()
export class LoggerService extends ConsoleLogger {
  private pathToLogs: string;
  private logLevel: number;
  private maxFileSize: number;
  private errorLogFileName: string;

  constructor() {
    super();
    this.initialize();
  }

  log(message: any) {
    super.log(message);
    this.writeLog(message, LogLevel.LOG);
  }

  error(message: any) {
    super.error(message);
    this.writeLog(message, LogLevel.ERROR);
  }

  warn(message: string) {
    super.warn(message);
    this.writeLog(message, LogLevel.WARN);
  }

  private async initialize() {
    const rootDir = process.cwd();
    this.pathToLogs = path.join(rootDir, '/logs');
    this.logLevel = Number(process.env.LOG_LEVEL) || LogLevel.ERROR;
    this.maxFileSize = process.env.MAX_LOG_FILE_SIZE
      ? Number(process.env.MAX_LOG_FILE_SIZE)
      : 1024 * 1024;
    this.errorLogFileName = 'error.log';

    await this.createLogDir();
  }

  private async createLogDir() {
    try {
      await fs.access(this.pathToLogs);
    } catch (_) {
      await fs.mkdir(this.pathToLogs);
    }
  }

  private async writeLog(message: string, level: number) {
    if (level > this.logLevel) return;

    const timestamp = new Date().toISOString();
    const logName = `app.log`;
    const formatetMessage = `[${timestamp}] ${message}\n`;

    try {
      await this.createLogDir();

      const logFilePath = path.join(
        this.pathToLogs,
        level === LogLevel.ERROR ? this.errorLogFileName : logName,
      );

      await fs.writeFile(logFilePath, formatetMessage, {
        encoding: 'utf-8',
        flag: 'a',
      });
    } catch (_) {}
  }
}
