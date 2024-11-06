import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request:', {
      method: req.method,
      url: req.url,
      // headers: req.headers,
      authorization: req.headers.authorization

    });

    res.on('finish', () => {
      console.log('Response:', {
        status: res.statusCode,
        //headers: res.getHeaders(),
      });
    });

    next();
  }
}