import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

// Clean environment initialization
const localEnv = path.resolve(process.cwd(), '.env');
const parentEnv = path.resolve(process.cwd(), '..', '.env');
if (fs.existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
} else if (fs.existsSync(parentEnv)) {
  dotenv.config({ path: parentEnv });
} else {
  dotenv.config();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Next.js / Vite client applications
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // OpenAPI (Swagger) Specification
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cambium API — Research Opportunity Discovery & Intelligence Platform')
    .setDescription(
      'Authoritative REST + OpenAPI contract for Cambium backend with PostgreSQL and pgvector semantic retrieval.',
    )
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Cambium NestJS API running on http://localhost:${port}`);
  console.log(`📚 OpenAPI / Swagger documentation at http://localhost:${port}/api/docs`);
}

bootstrap();
