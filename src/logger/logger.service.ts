import { Injectable, ConsoleLogger } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs/promises";

@Injectable()
export class LoggerService extends ConsoleLogger {
  private logFilePath: string;
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
    super.error(message)
    this.writeLog(message, 'error');
  }

  warn(message: string) {
    super.warn(message);
    this.writeLog(message, 'warn');
  }

  private async initialize() {
    this.logFilePath = await this.createLogDir();
    this.logLevel = process.env.LOG_LEVEL || 'error';
  }

  private async createLogDir() {
    const rootDir = process.cwd();
    const pathToLogs = path.join(rootDir, '/logs');

    try {
      await fs.opendir(pathToLogs)

      return pathToLogs;
    } catch (_) {
      await fs.mkdir(pathToLogs);

      return pathToLogs;
    }
  }

  private async writeLog(message: string, level: string) {
    if (!!this.logFilePath && !this.isEnableLevel(level)) return;

    const timestamp = new Date().toISOString();
    const logName = String(new Date().getTime());
    const formatetMessage = `[${timestamp}] ${message}\n`;

    await fs.writeFile(path.join(path.join(this.logFilePath), logName), formatetMessage, 'utf-8');
  }

  private isEnableLevel(level: string) {
    return level === this.logLevel;
  }
}