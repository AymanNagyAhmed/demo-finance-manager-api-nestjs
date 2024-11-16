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

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        
        this.logger.log(
          `${method} ${url} ${response.statusCode} - ${delay}ms`
        );

        // Log the response data if in development
        if (this.configService.get('NODE_ENV') === 'development') {
            this.logger.debug('Response data: ' + JSON.stringify(data));
        }
      }),
    );
  }
} 