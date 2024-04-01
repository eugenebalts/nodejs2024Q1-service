import { Injectable, ConsoleLogger } from "@nestjs/common";

@Injectable()
export class LoggerService extends ConsoleLogger {
  log(message: any) {
    super.log(message);
  }

  error(message: any) {
    super.error(message)
  }

  warn(message: string) {
    super.warn(message);
  }
}