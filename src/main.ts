import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '@/common/interceptors/api-response.interceptor';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global interceptors
  app.useGlobalInterceptors(
    new ApiResponseInterceptor(),
    new LoggingInterceptor(app.get(ConfigService)),
  );
  
  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Use PORT from environment variable (provided by Cloud Run) or fallback to 80
  const port = process.env.PORT || 80;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
