import 'reflect-metadata';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { AuthController } from '../modules/auth/auth.controller';
import { AuthService } from '../modules/auth/auth.service';
import { RegisterDto, LoginDto } from '../modules/auth/dto/auth.dto';
import { OpportunitiesController } from '../modules/opportunities/opportunities.controller';
import { OpportunitiesService } from '../modules/opportunities/opportunities.service';
import { HybridSearchService } from '../modules/opportunities/hybrid-search.service';
import { FilterOpportunityDto } from '../modules/opportunities/dto/opportunity.dto';
import { CloudflarePurgeService } from '../common/services/cloudflare-purge.service';
import { ProjectsController } from '../modules/projects/projects.controller';
import { ProjectsService } from '../modules/projects/projects.service';
import { CreateProjectDto } from '../modules/projects/dto/create-project.dto';
import { AppController } from '../app.controller';
import { DatabaseDiagnosticService } from '../database/database-diagnostic.service';
import { DataSource } from 'typeorm';
import { RedisService } from '../common/redis/redis.service';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../modules/auth/guards/roles.guard';
import { getJwtSecret } from '../modules/auth/jwt.config';
import { UserRole } from '../modules/users/entities/user.entity';

function ensureMetadata(target: any, paramTypes: any[], methodKey?: string) {
  if (methodKey) {
    if (!Reflect.getMetadata('design:paramtypes', target, methodKey)) {
      Reflect.defineMetadata('design:paramtypes', paramTypes, target, methodKey);
    }
    return;
  }
  if (!Reflect.getMetadata('design:paramtypes', target)) {
    Reflect.defineMetadata('design:paramtypes', paramTypes, target);
  }
}

describe('QA Sprint 2 — Real NestJS HTTP Wire & DTO Contract Integration', () => {
  let app: INestApplication;
  let baseUrl: string;
  let dbAlive = true;

  const ownerId = '11111111-1111-4111-8111-111111111101';
  const strangerId = '11111111-1111-4111-8111-111111111102';
  const privateProjectId = '22222222-2222-4222-8222-222222222201';
  const missingProjectId = '22222222-2222-4222-8222-222222222299';

  const mockAuthService = {
    register: vi.fn(async (dto: RegisterDto) => ({
      success: true,
      message: 'User registered successfully!',
      token: 'mock-access-jwt',
      refreshToken: 'mock-secret-refresh-token',
      user: {
        id: ownerId,
        username: dto.username,
        fullName: dto.fullName,
        email: dto.email,
        role: UserRole.RESEARCHER,
      },
    })),
    login: vi.fn(async (_dto: LoginDto) => ({
      success: true,
      token: 'mock-access-jwt',
      refreshToken: 'mock-secret-refresh-token',
      user: { id: ownerId, role: UserRole.RESEARCHER },
    })),
  };

  const mockOppService = {
    findAll: vi.fn(async (filters: FilterOpportunityDto) => ({
      success: true,
      count: 1,
      filters,
      data: [{ id: 'opp-1', title: 'NSF Climate AI Grant', type: filters.type || 'Grant' }],
    })),
  };

  const mockProjectsService = {
    getUserProjects: vi.fn(async (userId: string) => ({
      success: true,
      count: 1,
      data: [{ id: privateProjectId, ownerId: userId, title: 'Confidential Study' }],
    })),
    getProjectDetails: vi.fn(async (projectId: string, requesterId?: string) => {
      if (projectId === missingProjectId) {
        const { NotFoundException } = await import('@nestjs/common');
        throw new NotFoundException(`Project ${projectId} not found.`);
      }
      if (requesterId !== ownerId) {
        const { ForbiddenException } = await import('@nestjs/common');
        throw new ForbiddenException('Access to restricted research workspace denied.');
      }
      return {
        success: true,
        data: { id: projectId, ownerId, visibility: 'PRIVATE', title: 'Confidential Study' },
      };
    }),
    createProject: vi.fn(async (userId: string, dto: CreateProjectDto) => ({
      success: true,
      data: { id: privateProjectId, ownerId: userId, ...dto },
    })),
  };

  const mockDataSource = {
    query: vi.fn(async () => {
      if (!dbAlive) throw new Error('ECONNREFUSED PostgreSQL socket down');
      return [{ '?column?': 1 }];
    }),
  };

  const mockRedisService = {
    isBlacklisted: vi.fn(async () => false),
    getHealthInfo: vi.fn(async () => ({ status: 'CONNECTED', latencyMs: 1 })),
  };

  const signToken = (userId: string, role: string = UserRole.RESEARCHER) =>
    jwt.sign(
      {
        id: userId,
        sub: userId,
        email: `${userId}@test.cambium.invalid`,
        role,
        jti: `jti-${userId}`,
        type: 'access',
      },
      getJwtSecret(),
      { algorithm: 'HS256', expiresIn: '15m' },
    );

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'cambium-qa-integration-secret-32chars!';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'cambium-qa-refresh-secret-32chars!';

    ensureMetadata(AuthController, [AuthService]);
    ensureMetadata(AuthController.prototype, [RegisterDto, Object], 'register');
    ensureMetadata(AuthController.prototype, [LoginDto, Object], 'login');

    ensureMetadata(OpportunitiesController, [
      OpportunitiesService,
      HybridSearchService,
      CloudflarePurgeService,
    ]);
    ensureMetadata(OpportunitiesController.prototype, [FilterOpportunityDto], 'getOpportunities');

    ensureMetadata(ProjectsController, [ProjectsService]);
    ensureMetadata(ProjectsController.prototype, [CreateProjectDto, Object], 'createProject');

    ensureMetadata(AppController, [DatabaseDiagnosticService, DataSource, RedisService]);
    ensureMetadata(JwtAuthGuard, [RedisService]);
    ensureMetadata(RolesGuard, [Reflector]);

    class QaHttpModule {}
    Module({
      controllers: [AuthController, OpportunitiesController, ProjectsController, AppController],
      providers: [
        Reflector,
        JwtAuthGuard,
        RolesGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: OpportunitiesService, useValue: mockOppService },
        { provide: HybridSearchService, useValue: { search: vi.fn() } },
        { provide: CloudflarePurgeService, useValue: { purgeTags: vi.fn(async () => {}) } },
        { provide: ProjectsService, useValue: mockProjectsService },
        { provide: DatabaseDiagnosticService, useValue: { getDiagnosticReport: vi.fn() } },
        { provide: DataSource, useValue: mockDataSource },
        { provide: RedisService, useValue: mockRedisService },
      ],
    })(QaHttpModule);

    app = await NestFactory.create(QaHttpModule, { logger: false });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.listen(0, '127.0.0.1');
    const addr = app.getHttpServer().address();
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  afterAll(async () => {
    await app?.close();
  });

  it('rejects weak register payloads and mass-assignment role injection with 400 Bad Request', async () => {
    const weakRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'ab',
        fullName: 'A',
        email: 'bad-email',
        password: '123',
      }),
    });
    expect(weakRes.status).toBe(400);

    const massAssignRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'qa_researcher_01',
        fullName: 'Dr. Alice Researcher',
        email: 'alice@stanford.edu.invalid',
        password: 'StrongPassword123!',
        role: UserRole.SUPER_ADMIN,
      }),
    });
    expect(massAssignRes.status).toBe(400);
    const errBody = await massAssignRes.json();
    expect(JSON.stringify(errBody)).toContain('role should not exist');
  });

  it('registers valid user, sets HttpOnly refresh cookie, and strips refreshToken from JSON body', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'qa_researcher_02',
        fullName: 'Dr. Bob Researcher',
        email: 'bob@mit.edu.invalid',
        password: 'StrongPassword123!',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.refreshToken).toBeUndefined();
    expect(res.headers.get('set-cookie')).toContain('cambium_refresh_token');
  });

  it('fails closed (401) without JWT and blocks cross-actor IDOR (403) on protected workspaces', async () => {
    const unauthRes = await fetch(`${baseUrl}/api/v1/projects`);
    expect(unauthRes.status).toBe(401);

    const strangerToken = signToken(strangerId);
    const idorRes = await fetch(`${baseUrl}/api/v1/projects/${privateProjectId}`, {
      headers: { Authorization: `Bearer ${strangerToken}` },
    });
    expect(idorRes.status).toBe(403);

    const ownerToken = signToken(ownerId);
    const ownerRes = await fetch(`${baseUrl}/api/v1/projects/${privateProjectId}`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    expect(ownerRes.status).toBe(200);
    const ownerJson = await ownerRes.json();
    expect(ownerJson.data.id).toBe(privateProjectId);

    const notFoundRes = await fetch(`${baseUrl}/api/v1/projects/${missingProjectId}`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    expect(notFoundRes.status).toBe(404);
  });

  it('validates FilterOpportunityDto query enums over HTTP', async () => {
    const badRes = await fetch(`${baseUrl}/api/v1/opportunities?type=NotARealType`);
    expect(badRes.status).toBe(400);

    const goodRes = await fetch(`${baseUrl}/api/v1/opportunities?type=Grant&search=climate`);
    expect(goodRes.status).toBe(200);
    const json = await goodRes.json();
    expect(json.success).toBe(true);
    expect(json.filters.type).toBe('Grant');
  });

  it('keeps liveness 200 UP while readiness returns 503 without leaking stack traces when DB fails', async () => {
    dbAlive = false;
    const livenessRes = await fetch(`${baseUrl}/api/v1/health/liveness`);
    expect(livenessRes.status).toBe(200);
    expect((await livenessRes.json()).status).toBe('UP');

    const readinessDownRes = await fetch(`${baseUrl}/api/v1/health/readiness`);
    expect(readinessDownRes.status).toBe(503);
    const errJson = await readinessDownRes.json();
    expect(errJson.message).toBe('Database unavailable');
    expect(JSON.stringify(errJson)).not.toContain('ECONNREFUSED');

    dbAlive = true;
    const readinessUpRes = await fetch(`${baseUrl}/api/v1/health/readiness`);
    expect(readinessUpRes.status).toBe(200);
    expect((await readinessUpRes.json()).database).toBe('connected');
  });
});
