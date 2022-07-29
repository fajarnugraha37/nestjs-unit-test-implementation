import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ResponseErrorDto } from '../dtos';


@Catch()
export class JsonResponseExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let code = 400; 
    let message = "Bad Requests";
    if(exception instanceof  HttpException) {
        const response: any = exception.getResponse()
        code = response?.statusCode ?? exception.getStatus(); 
        message =  response?.message ?? [exception.getResponse()];
    } else if(exception instanceof Error) {
        message = exception.message;
    }

    response
      .status(code)
      .json(new ResponseErrorDto({
        statusCode: code,
        messages: Array.isArray(message) ? message : [message]
      }));
  }
}