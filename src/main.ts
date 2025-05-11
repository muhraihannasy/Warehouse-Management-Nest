import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { BadExceptionFilter } from './common/filters/http-exception/bad-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filters
  app.useGlobalFilters(new BadExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors = []) => {
        return new BadRequestException(validationErrors);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
