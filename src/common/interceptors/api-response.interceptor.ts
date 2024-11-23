import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@/common/interfaces/api-response.interface';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map(data => ({
        success: true,
        statusCode: response.statusCode || HttpStatus.OK,
        message: 'Operation successful',
        path: request.url,
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
} 