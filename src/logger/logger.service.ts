import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private pathToLogs: string;
  private logLevel: string;

  constructor() {
    super();
    this.initialize();
  }

  log(message: any) {
    super.log(message);
    this.writeLog(message, 'info');
  }

  error(message: any) {
    super.error(message);
    this.writeLog(message, 'error');
  }

  warn(message: string) {
    super.warn(message);
    this.writeLog(message, 'warn');
  }

  private async initialize() {
    const rootDir = process.cwd();
    this.pathToLogs = path.join(rootDir, '/logs');

    this.logLevel = process.env.LOG_LEVEL || 'error';

    await this.createLogDir();
  }

  private async createLogDir() {
    try {
      await fs.access(this.pathToLogs);
    } catch (_) {
      await fs.mkdir(this.pathToLogs);
    }
  }

  private async writeLog(message: string, level: string) {
    if (!this.isEnableLevel(level)) return;

    const timestamp = new Date().toISOString();
    const logName = String(new Date().getTime());
    const formatetMessage = `[${timestamp}] ${message}\n`;

    try {
      await this.createLogDir();

      await fs.writeFile(path.join(this.pathToLogs, logName), formatetMessage, {
        encoding: 'utf-8',
      });
    } catch (_) {}
  }

  private isEnableLevel(level: string) {
    return level === this.logLevel;
  }
}
