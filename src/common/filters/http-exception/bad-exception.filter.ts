import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response, Request } from 'express';

@Catch(BadRequestException)
export class BadExceptionFilter<T> implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const validationErrors = exception.getResponse() as any;
    const formattedErrors = this.formatErrors(validationErrors.message);

    response.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  formatErrors(
    errors: ValidationError[],
  ): { field: string; message: string }[] {
    const formattedErrors: { field: string; message: string }[] = [];

    errors.forEach((error) => {
      // Handle all constraints for each field
      for (const constraint in error.constraints) {
        formattedErrors.push({
          field: error.property,
          message: error.constraints[constraint],
        });
      }
    });

    return formattedErrors;
  }
}
