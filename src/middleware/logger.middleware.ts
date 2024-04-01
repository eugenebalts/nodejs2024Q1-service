import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor (private readonly loggerService: LoggerService) {}

    use(req: Request, res: Response, next: Function) {
    const { method, originalUrl, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;

      this.loggerService.log(`Method: ${method}; URL: ${originalUrl}, Query: ${JSON.stringify(query)}; Body: ${JSON.stringify(body)} - Status Code: ${statusCode}`);
    });

    next();
  }
}