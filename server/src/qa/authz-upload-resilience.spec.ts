import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ProjectsService } from '../modules/projects/projects.service';
import { CRediTRole } from '../modules/projects/entities/project-member.entity';
import { UploadService, MAX_FILE_SIZE_BYTES } from '../modules/upload/upload.service';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { CircuitBreakerService } from '../common/resilience/circuit-breaker.service';

describe('QA Sprint 3 — Multi-Actor Authz, Upload Security & Failure Resilience', () => {
  const actorOwner = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1';
  const actorCollaborator = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2';
  const actorStranger = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3';
  const projectId = 'dddddddd-dddd-4ddd-8ddd-ddddddddddd4';

  it('enforces full invite -> pending denial -> accept -> revoke workspace isolation across actors', async () => {
    const projectState: any = {
      id: projectId,
      ownerId: actorOwner,
      title: 'Private Climate Genomic Study',
      visibility: 'PRIVATE',
      owner: { id: actorOwner, fullName: 'Dr. Owner' },
      members: [
        { id: 'mem-1', projectId, userId: actorOwner, creditRole: CRediTRole.LEAD_PI, status: 'ACCEPTED' },
      ],
      activityLogs: [],
      comments: [],
    };

    const projectRepo = {
      findOne: vi.fn(async ({ where }: any) => (where.id === projectId ? projectState : null)),
      save: vi.fn(async (p: any) => p),
    };

    const memberRepo = {
      findOne: vi.fn(async ({ where }: any) => {
        const found = projectState.members.find(
          (m: any) => m.projectId === where.projectId && m.userId === where.userId,
        );
        return found ? { ...found, project: projectState, user: { fullName: 'Dr. Collaborator' } } : null;
      }),
      create: vi.fn((data: any) => ({ id: `mem-${projectState.members.length + 1}`, ...data })),
      save: vi.fn(async (m: any) => {
        const idx = projectState.members.findIndex((x: any) => x.userId === m.userId);
        if (idx >= 0) projectState.members[idx] = { ...projectState.members[idx], ...m };
        else projectState.members.push(m);
        return m;
      }),
      remove: vi.fn(async (m: any) => {
        projectState.members = projectState.members.filter((x: any) => x.userId !== m.userId);
        return m;
      }),
    };

    const logRepo = { create: vi.fn((x: any) => x), save: vi.fn(async (x: any) => x) };
    const userRepo = {
      findOne: vi.fn(async ({ where }: any) =>
        [actorOwner, actorCollaborator, actorStranger].includes(where.id)
          ? { id: where.id, fullName: `Scholar ${where.id.slice(0, 4)}` }
          : null,
      ),
    };

    const service = new ProjectsService(
      projectRepo as any,
      memberRepo as any,
      logRepo as any,
      userRepo as any,
    );

    // 1. Collaborator & stranger cannot read PRIVATE workspace initially
    await expect(service.getProjectDetails(projectId, actorCollaborator)).rejects.toThrow(ForbiddenException);
    await expect(service.getProjectDetails(projectId, actorStranger)).rejects.toThrow(ForbiddenException);

    // 2. Owner invites collaborator -> still denied until accepted
    await service.inviteMember(projectId, actorOwner, {
      userId: actorCollaborator,
      creditRole: CRediTRole.DATA_CURATOR,
    });
    await expect(service.getProjectDetails(projectId, actorCollaborator)).rejects.toThrow(ForbiddenException);

    // 3. Collaborator accepts -> gains read access, while stranger remains blocked
    await service.respondToInvitation(projectId, actorCollaborator, true);
    const colabView = await service.getProjectDetails(projectId, actorCollaborator);
    expect(colabView.success).toBe(true);
    await expect(service.getProjectDetails(projectId, actorStranger)).rejects.toThrow(ForbiddenException);

    // 4. Collaborator (non-Lead PI) cannot escalate own role
    await expect(
      service.updateMemberRole(projectId, actorCollaborator, actorCollaborator, CRediTRole.LEAD_PI),
    ).rejects.toThrow(ForbiddenException);

    // 5. Owner revokes collaborator -> access immediately returns 403 Forbidden
    await service.removeMember(projectId, actorOwner, actorCollaborator);
    await expect(service.getProjectDetails(projectId, actorCollaborator)).rejects.toThrow(ForbiddenException);
  });

  it('blocks polyglot executables, traversal filenames, oversized payloads, and cross-scholar downloads', async () => {
    const uploadService = new UploadService();

    // Disguised PE executable with .pdf extension
    const mzHeader = Buffer.concat([Buffer.from([0x4d, 0x5a, 0x90, 0x00]), Buffer.from('not-a-pdf')]);
    await expect(
      uploadService.saveArtifact(
        { originalname: 'exploit.pdf', buffer: mzHeader, size: mzHeader.length, mimetype: 'application/pdf' },
        actorOwner,
      ),
    ).rejects.toThrow(BadRequestException);

    // Disguised script injection
    const scriptPolyglot = Buffer.from('<script>alert(1)</script>');
    await expect(
      uploadService.saveArtifact(
        { originalname: 'xss.json', buffer: scriptPolyglot, size: scriptPolyglot.length, mimetype: 'application/json' },
        actorOwner,
      ),
    ).rejects.toThrow(BadRequestException);

    // Oversized & empty boundaries
    expect(() =>
      uploadService.validateFile({
        originalname: 'huge.pdf',
        size: MAX_FILE_SIZE_BYTES + 1,
        mimetype: 'application/pdf',
      }),
    ).toThrow(PayloadTooLargeException);

    expect(() =>
      uploadService.validateFile({ originalname: 'empty.pdf', size: 0, mimetype: 'application/pdf' }),
    ).toThrow(BadRequestException);

    // Path traversal filename sanitization + per-owner isolation
    const validPdf = Buffer.from('%PDF-1.7\n1 0 obj\n<< /Title (QA Grant) >>\nendobj');
    const saved = await uploadService.saveArtifact(
      {
        originalname: '../../etc/passwd\\study.pdf',
        buffer: validPdf,
        size: validPdf.length,
        mimetype: 'application/pdf',
      },
      actorOwner,
    );

    try {
      expect(saved.sanitizedName).toBe('study.pdf');
      expect(saved.sha256Hash).toHaveLength(64);
      expect(() => uploadService.getArtifactMetadata(saved.id, actorStranger, false)).toThrow(
        ForbiddenException,
      );
      expect(uploadService.listArtifacts(actorStranger, false).some((a) => a.id === saved.id)).toBe(
        false,
      );
      expect(uploadService.getArtifactMetadata(saved.id, actorOwner, false).id).toBe(saved.id);
      expect(uploadService.getArtifactMetadata(saved.id, actorStranger, true).id).toBe(saved.id);
    } finally {
      await uploadService.deleteArtifact(saved.id, actorOwner, false);
    }
  });

  it('prevents duplicate mutations via IdempotencyInterceptor and degrades gracefully via CircuitBreaker', async () => {
    const redisStore = new Map<string, string>();
    const mockRedis = {
      get: vi.fn(async (k: string) => redisStore.get(k) ?? null),
      set: vi.fn(async (k: string, v: string) => {
        redisStore.set(k, v);
      }),
      del: vi.fn(async (k: string) => {
        redisStore.delete(k);
      }),
    };
    const reflector = {
      getAllAndOverride: vi.fn(() => ({ required: true, ttlSeconds: 60 })),
    } as unknown as Reflector;

    const interceptor = new IdempotencyInterceptor(reflector, mockRedis as any);
    const makeCtx = (headers: Record<string, string>) =>
      ({
        getType: () => 'http',
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
          getRequest: () => ({ method: 'POST', path: '/api/v1/projects', headers, user: { id: actorOwner } }),
          getResponse: () => ({ status: vi.fn(), setHeader: vi.fn() }),
        }),
      }) as any;

    // Missing mandatory key -> 400
    await expect(
      interceptor.intercept(makeCtx({}), { handle: () => of({ ok: true }) }),
    ).rejects.toThrow(BadRequestException);

    // Completed cached replay -> handler runs only once
    const handler = vi.fn(() => of({ createdId: 'proj-99' }));
    const obs1 = await interceptor.intercept(makeCtx({ 'idempotency-key': 'idem-key-01' }), {
      handle: handler,
    });
    expect(await firstValueFrom(obs1)).toEqual({ createdId: 'proj-99' });

    const obs2 = await interceptor.intercept(makeCtx({ 'idempotency-key': 'idem-key-01' }), {
      handle: handler,
    });
    expect(await firstValueFrom(obs2)).toEqual({ createdId: 'proj-99' });
    expect(handler).toHaveBeenCalledTimes(1);

    // Failed downstream clears PROCESSING lock so client can safely retry
    const obsErr = await interceptor.intercept(makeCtx({ 'idempotency-key': 'idem-key-fail' }), {
      handle: () => throwError(() => new Error('transient timeout')),
    });
    await expect(firstValueFrom(obsErr)).rejects.toThrow('transient timeout');
    expect(mockRedis.del).toHaveBeenCalled();

    // CircuitBreaker opens on repeated upstream timeouts and recovers cleanly via canary
    const breaker = new CircuitBreakerService();
    let upstreamHealthy = false;
    const action = async () => {
      if (!upstreamHealthy) throw new Error('ETIMEDOUT upstream OpenAlex');
      return { source: 'live', count: 5 };
    };
    const fallback = async () => ({ source: 'degraded-cache', count: 0 });

    await breaker.execute('openalex_qa', action, fallback, { failureThreshold: 2, cooldownMs: 25 });
    await breaker.execute('openalex_qa', action, fallback, { failureThreshold: 2, cooldownMs: 25 });
    expect(breaker.getState('openalex_qa')).toBe('OPEN');

    const degraded = await breaker.execute('openalex_qa', action, fallback, {
      failureThreshold: 2,
      cooldownMs: 25,
    });
    expect(degraded.source).toBe('degraded-cache');

    await new Promise((r) => setTimeout(r, 35));
    upstreamHealthy = true;
    await breaker.execute('openalex_qa', action, fallback, {
      failureThreshold: 2,
      cooldownMs: 25,
      halfOpenSuccessThreshold: 1,
    });
    expect(breaker.getState('openalex_qa')).toBe('CLOSED');
  });
});
