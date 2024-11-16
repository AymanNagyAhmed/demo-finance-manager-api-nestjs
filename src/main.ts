import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.useGlobalFilters(new GlobalExceptionFilter());
  
  const loggingInterceptor = new LoggingInterceptor(configService);
  
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    loggingInterceptor
  );

  const port = configService.get<number>('PORT', 3000);
  
  await app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
  });
}
bootstrap();
