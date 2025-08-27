
import {
  BadRequestException,
  HttpStatus,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';

import { createSwaggerDocument } from '@infrastructure/swagger/create-swagger-document.helper';

import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({ origin: '*' });

  const port = Number(process.env.PORT) || 4000;

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const documentV1 = createSwaggerDocument(app, 'v1', '1.0', []);
  SwaggerModule.setup('bff-docs-v1', app, documentV1);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory(errors) {
        const messages = errors
          .map((err) => Object.values(err.constraints || {}))
          .flat();
        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Erro de validação',
          message: messages,
        });
      },
    }),
  );

  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(`Aplicação rodando em http://localhost:${port}`);
}

bootstrap();
