import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { PrivacyService, CURRENT_PRIVACY_NOTICE_VERSION } from '../modules/privacy/privacy.service';
import { ConsentAction, ConsentPurpose } from '../modules/privacy/entities/consent-record.entity';
import { PrivacyRequestStatus, PrivacyRequestType } from '../modules/privacy/entities/privacy-request.entity';
import { AssistantService, redactPiiForExternalLlm } from '../modules/assistant/assistant.service';
import { UploadService } from '../modules/upload/upload.service';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
import { RedisService } from '../common/redis/redis.service';
import { UserRole } from '../modules/users/entities/user.entity';

describe('Program 09 — Privacy Engineering & Data Governance Verification', () => {
  const userA = '11111111-1111-4111-8111-111111111101';
  const userB = '22222222-2222-4222-8222-222222222202';

  let prefsStore: Map<string, any>;
  let consentStore: any[];
  let requestStore: any[];
  let auditStore: any[];
  let usersStore: Map<string, any>;
  let bookmarksStore: Array<{ id: string; userId: string }>;
  let uploadService: UploadService;
  let redisService: RedisService;
  let privacyService: PrivacyService;

  beforeEach(() => {
    prefsStore = new Map();
    consentStore = [];
    requestStore = [];
    auditStore = [];
    usersStore = new Map([
      [
        userA,
        {
          id: userA,
          username: 'scholar_a',
          email: 'a@research.invalid',
          fullName: 'Dr. A',
          passwordHash: '$2a$12$secret_hash_never_export',
          role: UserRole.RESEARCHER,
          institution: 'Institute A',
          createdAt: new Date(),
        },
      ],
      [
        userB,
        {
          id: userB,
          username: 'scholar_b',
          email: 'b@research.invalid',
          fullName: 'Dr. B',
          passwordHash: '$2a$12$secret_hash_b',
          role: UserRole.RESEARCHER,
          institution: 'Institute B',
          createdAt: new Date(),
        },
      ],
    ]);
    bookmarksStore = [
      { id: 'bm-a', userId: userA },
      { id: 'bm-b', userId: userB },
    ];

    const prefRepo = {
      findOne: vi.fn(async ({ where }: any) => prefsStore.get(where.userId) ?? null),
      create: vi.fn((x: any) => ({ ...x })),
      save: vi.fn(async (x: any) => {
        const saved = { ...x, updatedAt: new Date() };
        prefsStore.set(saved.userId, saved);
        return saved;
      }),
      delete: vi.fn(async ({ userId }: any) => {
        prefsStore.delete(userId);
      }),
    };

    const consentRepo = {
      create: vi.fn((x: any) => ({ id: `con-${consentStore.length + 1}`, ...x })),
      save: vi.fn(async (x: any) => {
        const saved = { ...x, recordedAt: new Date() };
        consentStore.push(saved);
        return saved;
      }),
      find: vi.fn(async ({ where }: any) =>
        consentStore.filter((c) => c.userId === where.userId).reverse(),
      ),
    };

    const requestRepo = {
      create: vi.fn((x: any) => ({ id: `req-${requestStore.length + 1}`, ...x })),
      save: vi.fn(async (x: any) => {
        const idx = requestStore.findIndex((r) => r.id === x.id);
        const saved = { ...x, createdAt: x.createdAt || new Date(), updatedAt: new Date() };
        if (idx >= 0) requestStore[idx] = saved;
        else requestStore.push(saved);
        return saved;
      }),
      find: vi.fn(async ({ where }: any) => requestStore.filter((r) => r.userId === where.userId)),
      findOne: vi.fn(async ({ where }: any) =>
        requestStore.find((r) => r.id === where.id && r.userId === where.userId) ?? null,
      ),
    };

    const userRepo = {
      findOne: vi.fn(async ({ where }: any) => usersStore.get(where.id) ?? null),
      remove: vi.fn(async (u: any) => {
        usersStore.delete(u.id);
        return u;
      }),
    };

    const bookmarkRepo = {
      find: vi.fn(async ({ where }: any) => bookmarksStore.filter((b) => b.userId === where.userId)),
      delete: vi.fn(async ({ userId }: any) => {
        bookmarksStore = bookmarksStore.filter((b) => b.userId !== userId);
      }),
    };

    const notificationRepo = { delete: vi.fn(async () => {}) };
    const projectRepo = {
      find: vi.fn(async ({ where }: any) =>
        where.ownerId === userA
          ? [{ id: 'proj-a', ownerId: userA, title: 'Private Workspace A', visibility: 'PRIVATE', status: 'ACTIVE', linkedDois: [] }]
          : [{ id: 'proj-b', ownerId: userB, title: 'Private Workspace B', visibility: 'PRIVATE', status: 'ACTIVE', linkedDois: [] }],
      ),
    };

    uploadService = new UploadService();
    redisService = new RedisService();
    privacyService = new PrivacyService(
      prefRepo as any,
      consentRepo as any,
      requestRepo as any,
      userRepo as any,
      bookmarkRepo as any,
      notificationRepo as any,
      projectRepo as any,
      uploadService,
      redisService,
    );
  });

  it('defaults external AI and analytics opt-ins to false and appends versioned consent history on grant/withdrawal', async () => {
    const initial = await privacyService.getPreferences(userA);
    expect(initial.aiProcessingConsent).toBe(false);
    expect(initial.optionalAnalyticsConsent).toBe(false);
    expect(await privacyService.hasAiProcessingConsent(userA)).toBe(false);

    await privacyService.updatePreferences(userA, {
      aiProcessingConsent: true,
      noticeVersion: CURRENT_PRIVACY_NOTICE_VERSION,
    });
    expect(await privacyService.hasAiProcessingConsent(userA)).toBe(true);

    await privacyService.updatePreferences(userA, {
      aiProcessingConsent: false,
      noticeVersion: CURRENT_PRIVACY_NOTICE_VERSION,
    });
    expect(await privacyService.hasAiProcessingConsent(userA)).toBe(false);

    const history = await privacyService.listConsents(userA);
    expect(history).toHaveLength(2);
    expect(history.map((h) => h.action)).toEqual([ConsentAction.WITHDRAWN, ConsentAction.GRANTED]);
    expect(history.every((h) => h.purpose === ConsentPurpose.AI_RESEARCH_ASSISTANT)).toBe(true);
    expect(history.every((h) => h.noticeVersion === CURRENT_PRIVACY_NOTICE_VERSION)).toBe(true);
  });

  it('blocks unauthorized workspaces, RESTRICTED docs, and unconsented AI dispatch while scrubbing outbound PII', async () => {
    process.env.GEMINI_API_KEY = 'AIzaTestMockGeminiKey1234567890';
    const fetchSpy = vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'AI reply' }] } }] }),
    } as any);

    const projectsMock = {
      canUserAccessWorkspace: vi.fn(async (_wsId: string, uid: string) => uid === userA),
    };
    const hybridSearchMock = { search: vi.fn(async () => ({ results: [] })) };

    const assistant = new AssistantService(
      hybridSearchMock as any,
      {} as any,
      privacyService,
      projectsMock as any,
      uploadService,
    );

    // 1. User B attempting AI over User A's workspace -> 403 Forbidden
    await expect(
      assistant.chat(
        { messages: [{ role: 'user', content: 'Analyze grant' }], context: { workspaceId: 'proj-a' } },
        { id: userB, role: UserRole.RESEARCHER },
      ),
    ).rejects.toThrow(ForbiddenException);
    expect(fetchSpy).not.toHaveBeenCalled();

    // 2. Without aiProcessingConsent, Assistant runs locally without hitting Gemini API
    const unconsentedRes = await assistant.chat(
      {
        messages: [{ role: 'user', content: 'Analyze workspace' }],
        context: { workspaceId: 'proj-a', documentSnippet: 'Unpublished manuscript draft' },
      },
      { id: userA, role: UserRole.RESEARCHER },
    );
    expect(unconsentedRes.aiPrivacyMode).toBe('local_only_no_external_dispatch');
    expect(fetchSpy).not.toHaveBeenCalled();

    // 3. Grant AI consent, but supply RESTRICTED artifact -> still blocked from external Gemini
    await privacyService.updatePreferences(userA, { aiProcessingConsent: true });
    const restrictedPdf = Buffer.from('%PDF-1.7\nConfidential Clinical Cohort');
    const savedRestricted = await uploadService.saveArtifact(
      {
        originalname: 'restricted-irb.pdf',
        buffer: restrictedPdf,
        size: restrictedPdf.length,
        mimetype: 'application/pdf',
      },
      userA,
      { dataClassification: 'RESTRICTED', aiProcessingAllowed: true },
    );
    try {
      expect(savedRestricted.aiProcessingAllowed).toBe(false);
      const restrictedRes = await assistant.chat(
        {
          messages: [{ role: 'user', content: 'Summarize' }],
          context: { artifactId: savedRestricted.id, documentSnippet: 'Restricted text' },
        },
        { id: userA, role: UserRole.RESEARCHER },
      );
      expect(restrictedRes.aiPrivacyMode).toBe('local_only_no_external_dispatch');
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      await uploadService.deleteArtifact(savedRestricted.id, userA, true);
    }

    // 4. Authorized PII redaction helper strips emails, Bearer tokens, and Gemini API keys
    const scrubbed = redactPiiForExternalLlm(
      'Contact dr.a@stanford.edu.invalid with Bearer jwt.abc.123 or AIzaSyFakeKeyValue999999',
    );
    expect(scrubbed).not.toContain('dr.a@stanford.edu.invalid');
    expect(scrubbed).not.toContain('jwt.abc.123');
    expect(scrubbed).not.toContain('AIzaSyFakeKeyValue999999');
    expect(scrubbed).toContain('[REDACTED_EMAIL]');
    expect(scrubbed).toContain('[REDACTED_TOKEN]');
    expect(scrubbed).toContain('[REDACTED_API_KEY]');
    fetchSpy.mockRestore();
  });

  it('scrubs confidential prompts and PII in AuditInterceptor before writing audit_logs', async () => {
    const mockDataSource = {
      isInitialized: true,
      getRepository: () => ({
        findOne: vi.fn(async () => null),
        create: vi.fn((x: any) => x),
        save: vi.fn(async (x: any) => {
          auditStore.push(x);
          return x;
        }),
      }),
    };

    const interceptor = new AuditInterceptor(mockDataSource as any);
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'POST',
          originalUrl: '/api/v1/assistant/chat',
          user: { id: userA },
          body: {
            workspaceId: 'proj-a',
            documentSnippet: 'TOP_SECRET_UNPUBLISHED_GENOME_SEQUENCE',
            email: 'a@research.invalid',
            password: 'secretPassword123!',
          },
        }),
      }),
    };

    await lastValueFrom(interceptor.intercept(context, { handle: () => of({ data: { id: 'chat-1' } }) }));
    await new Promise((r) => setTimeout(r, 15));

    expect(auditStore.length).toBe(1);
    const serializedAudit = JSON.stringify(auditStore[0].payload);
    expect(serializedAudit).not.toContain('TOP_SECRET_UNPUBLISHED_GENOME_SEQUENCE');
    expect(serializedAudit).not.toContain('a@research.invalid');
    expect(serializedAudit).not.toContain('secretPassword123!');
    expect(auditStore[0].payload.sample.fieldKeys).toEqual(['workspaceId']);
    expect(auditStore[0].payload.sample.redactedFieldCount).toBe(3);
    expect(auditStore[0].payload.sample.payloadSha256).toHaveLength(64);
  });

  it('produces strictly caller-scoped personal exports excluding secrets and peer records', async () => {
    const pdfA = Buffer.from('%PDF-1.7\nUser A Manuscript');
    const pdfB = Buffer.from('%PDF-1.7\nUser B Confidential');
    const artA = await uploadService.saveArtifact(
      { originalname: 'paper-a.pdf', buffer: pdfA, size: pdfA.length, mimetype: 'application/pdf' },
      userA,
    );
    const artB = await uploadService.saveArtifact(
      { originalname: 'paper-b.pdf', buffer: pdfB, size: pdfB.length, mimetype: 'application/pdf' },
      userB,
    );

    try {
      const exported = await privacyService.exportPersonalData(userA);
      const jsonStr = JSON.stringify(exported);

      expect(exported.account.id).toBe(userA);
      expect((exported.account as any).passwordHash).toBeUndefined();
      expect(jsonStr).not.toContain('secret_hash');
      expect(jsonStr).not.toContain('b@research.invalid');
      expect(jsonStr).not.toContain('paper-b.pdf');
      expect(jsonStr).not.toContain('Private Workspace B');
      expect(exported.ownedArtifacts.map((a: any) => a.id)).toEqual([artA.id]);
      expect(exported.bookmarks.map((b: any) => b.id)).toEqual(['bm-a']);
      expect(exported.ownedWorkspaces.map((w: any) => w.id)).toEqual(['proj-a']);
    } finally {
      await uploadService.deleteArtifact(artA.id, userA, true).catch(() => {});
      await uploadService.deleteArtifact(artB.id, userB, true).catch(() => {});
    }
  });

  it('cascades account & artifact erasure safely for caller while preserving User B artifacts and audit exception honesty', async () => {
    const pdfA = Buffer.from('%PDF-1.7\nUser A Data');
    const pdfB = Buffer.from('%PDF-1.7\nUser B Data');
    const artA = await uploadService.saveArtifact(
      { originalname: 'a-delete.pdf', buffer: pdfA, size: pdfA.length, mimetype: 'application/pdf' },
      userA,
    );
    const artB = await uploadService.saveArtifact(
      { originalname: 'b-keep.pdf', buffer: pdfB, size: pdfB.length, mimetype: 'application/pdf' },
      userB,
    );

    try {
      await expect(privacyService.executeAccountErasure(userA, 'WRONG')).rejects.toThrow(
        BadRequestException,
      );

      const result = await privacyService.executeAccountErasure(
        userA,
        'DELETE',
        'Research completed',
        'jti-user-a-session',
      );

      expect(result.accountDeleted).toBe(true);
      expect(result.deletedArtifactsCount).toBe(1);
      expect(result.deletedArtifactIds).toEqual([artA.id]);
      expect(result.status).toBe(PrivacyRequestStatus.PARTIALLY_COMPLETED);
      expect(result.retentionExceptionReason).toContain('audit_logs');

      expect(usersStore.has(userA)).toBe(false);
      expect(usersStore.has(userB)).toBe(true);
      expect(uploadService.listArtifacts(userA, false)).toHaveLength(0);
      expect(uploadService.listArtifacts(userB, false)).toHaveLength(1);
      expect(await redisService.isBlacklisted('jti-user-a-session')).toBe(true);

      const reqs = await privacyService.listRequests(userA);
      expect(reqs.some((r) => r.requestType === PrivacyRequestType.ERASURE)).toBe(true);
    } finally {
      await uploadService.deleteArtifact(artB.id, userB, true).catch(() => {});
    }
  });
});
