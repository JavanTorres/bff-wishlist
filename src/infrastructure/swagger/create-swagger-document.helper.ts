import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function createSwaggerDocument(
  app: INestApplication,
  apiVersion = 'v1',
  docVersion = '1.0',
  modulesToInclude: any[] = [],
) {
  const config = new DocumentBuilder()
    .setTitle(`DOC ${apiVersion.toUpperCase()}.`)
    .setDescription(`API ${apiVersion.toUpperCase()}.`)
    .setVersion(docVersion)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .build();

  return SwaggerModule.createDocument(app, config, {
    include: modulesToInclude,
    deepScanRoutes: true,
  });
}
