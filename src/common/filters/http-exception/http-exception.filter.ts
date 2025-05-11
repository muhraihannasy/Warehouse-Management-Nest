import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

import { Response, Request } from 'express';

@Catch(NotFoundException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responseMessage = (exception.getResponse() as any).message;
      message = responseMessage;
    }

    response.status(400).json({
      success: false,
      message,
      errors: [],
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
