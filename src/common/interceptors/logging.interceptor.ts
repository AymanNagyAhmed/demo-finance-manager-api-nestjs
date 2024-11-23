import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    // Log the incoming request
    this.logRequest(request, requestId);

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Log successful response
          this.logResponse(request, response, data, startTime, requestId);
        },
        error: (error) => {
          // Log error response
          this.logErrorResponse(request, error, startTime, requestId);
        },
      }),
    );
  }

  private logRequest(request: Request, requestId: string): void {
    const { method, url, body, headers } = request;
    
    this.logger.log({
      type: 'Request',
      requestId,
      timestamp: new Date().toISOString(),
      method,
      url,
      headers: this.sanitizeHeaders(headers),
      body: this.sanitizeBody(body),
    });
  }

  private logResponse(
    request: Request,
    response: Response,
    data: any,
    startTime: number,
    requestId: string,
  ): void {
    const responseTime = Date.now() - startTime;

    this.logger.log({
      type: 'Response',
      requestId,
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      statusCode: response.statusCode,
      responseTime: `${responseTime}ms`,
      ...(this.isDevelopment() && { data: this.sanitizeData(data) }),
    });
  }

  private logErrorResponse(
    request: Request,
    error: any,
    startTime: number,
    requestId: string,
  ): void {
    const responseTime = Date.now() - startTime;

    this.logger.error({
      type: 'Error Response',
      requestId,
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      statusCode: error.status || 500,
      responseTime: `${responseTime}ms`,
      error: {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment() ? error.stack : undefined,
      },
    });
  }

  private sanitizeHeaders(headers: any): any {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    const sanitizedHeaders = { ...headers };

    sensitiveHeaders.forEach((header) => {
      if (sanitizedHeaders[header]) {
        sanitizedHeaders[header] = '[REDACTED]';
      }
    });

    return sanitizedHeaders;
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sensitiveFields = ['password', 'token', 'secret', 'creditCard'];
    const sanitizedBody = { ...body };

    Object.keys(sanitizedBody).forEach((key) => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitizedBody[key] = '[REDACTED]';
      }
    });

    return sanitizedBody;
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    // If data is too large, truncate it
    const maxLength = 1000;
    const stringified = JSON.stringify(data);
    
    if (stringified.length > maxLength) {
      return {
        message: 'Response data truncated due to size',
        preview: stringified.substring(0, maxLength) + '...',
      };
    }

    return data;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private isDevelopment(): boolean {
    return this.configService.get('NODE_ENV') === 'development';
  }
} 