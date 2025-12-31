import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? (exception.getResponse() as any)
      : { message: 'Internal server error' };

    // Log full stack when available
    this.logger.error(`Exception caught: ${exception?.message || exception}`);
    if (exception?.stack) {
      this.logger.error(exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      ...(typeof message === 'string' ? { message } : message),
      path: request.url,
    });
  }
}
