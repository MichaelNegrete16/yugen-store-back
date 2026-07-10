import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorEnvelope {
  statusCode: number;
  error: string;
  message: string[];
}

/**
 * Normaliza todas las respuestas de error al envelope consistente que consume
 * la app movil:
 *   { "statusCode": 422, "error": "Unprocessable Entity", "message": ["..."] }
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const envelope: ErrorEnvelope = {
      statusCode: status,
      error: this.resolveError(exception, status),
      message: this.resolveMessage(exception),
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      // No filtramos datos sensibles: logueamos el detalle pero devolvemos
      // un mensaje generico.
      // eslint-disable-next-line no-console
      console.error(`[${request.method} ${request.url}]`, exception);
    }

    response.status(status).json(envelope);
  }

  private resolveError(exception: unknown, status: number): string {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null && 'error' in res) {
        return String((res as Record<string, unknown>).error);
      }
      return exception.name.replace(/Exception$/, '');
    }
    return HttpStatus[status] ?? 'Internal Server Error';
  }

  private resolveMessage(exception: unknown): string[] {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        return [res];
      }
      if (typeof res === 'object' && res !== null && 'message' in res) {
        const message = (res as Record<string, unknown>).message;
        return Array.isArray(message) ? message.map(String) : [String(message)];
      }
      return [exception.message];
    }
    return ['Internal server error'];
  }
}
