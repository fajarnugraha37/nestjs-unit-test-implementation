import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class JsonStatusCodeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response: Response = context.switchToHttp().getResponse();

    return next
      .handle()
      .pipe(
        map((data) => ({ 
          statusCode: response.statusCode,
          ...data, 
        })),
      );
  }
}