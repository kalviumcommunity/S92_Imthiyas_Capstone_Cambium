import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { validateServerEnv } from './config/env-validator';

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
  validateServerEnv();
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useGlobalFilters(new AllExceptionsFilter());
  const expressApp = app.getHttpAdapter().getInstance() as {
    set?: (k: string, v: unknown) => void;
    disable?: (k: string) => void;
  };
  expressApp.set?.('trust proxy', 1);
  expressApp.disable?.('x-powered-by');

  // Express payload body limits to prevent memory exhaustion / DoS
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true, limit: '2mb' }));

  // Cookie parser middleware for rotating refresh cookies
  app.use(cookieParser());

  // Enterprise Security Headers (X-Frame-Options, nosniff, Referrer, HSTS in prod)
  app.use((req: any, res: any, next: any) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    );
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    }
    next();
  });

  // Strict allowlist CORS configuration (no blanket wildcard fallback in production)
  const configuredOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://cambium-research.vercel.app'];

  const isProd = process.env.NODE_ENV === 'production';

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (configuredOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      if (!isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} not permitted by Cambium CORS policy`), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: [
      'X-Request-Id',
      'X-Trace-Id',
      'Traceparent',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'Retry-After',
      'ETag',
    ],
  });

  // Strict schema validation aligned with SECURITY.md OWASP baseline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Distributed Socket.io Gateway backed by Redis Adapter (with graceful local fallback)
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // OpenAPI (Swagger) Specification
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cambium API — Research Opportunity Discovery & Intelligence Platform')
    .setDescription(
      'Enterprise REST, SSE, and Distributed WebSockets API with Zero-Trust Auth, Outbox Consistency, and SRE Observability.',
    )
    .setVersion('2.0')
    .addBearerAuth()
    .addCookieAuth('cambium_refresh_token')
    .build();

  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 5000;
  const httpServer = await app.listen(port, '0.0.0.0');
  if (httpServer && typeof httpServer === 'object') {
    httpServer.keepAliveTimeout = 65000;
    httpServer.headersTimeout = 66000;
    httpServer.requestTimeout = 30000;
  }

  console.log(`Cambium NestJS API running on http://localhost:${port}`);
  console.log(`OpenAPI / Swagger documentation at http://localhost:${port}/api/docs`);
  console.log(`Distributed WebSockets (/chat) and SSE (/api/v1/events/stream) active`);
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  console.error('[Cambium API] Application startup failed:', message);
  process.exit(1);
});
