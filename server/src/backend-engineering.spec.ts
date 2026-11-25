import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  ValidationPipe,
} from '@nestjs/common';
import { getMetadataArgsStorage } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { validateServerEnv } from './config/env-validator';
import { getDatabaseConfig } from './config/database.config';
import { User, UserRole } from './modules/users/entities/user.entity';
import { Subscription, SubscriptionTier } from './modules/billing/entities/subscription.entity';
import { Invoice } from './modules/billing/entities/invoice.entity';
import { OpportunitiesService } from './modules/opportunities/opportunities.service';
import { OpportunityType } from './modules/opportunities/entities/research-opportunity.entity';
import { BookmarksService } from './modules/bookmarks/bookmarks.service';
import { FundingService } from './modules/institution/funding.service';
import { ProposalsService } from './modules/institution/proposals.service';
import { IngestionService } from './modules/ingestion/ingestion.service';
import { BillingService } from './modules/billing/billing.service';
import { SubscribeDto } from './modules/billing/dto/subscribe.dto';
import { UpdatePostDto } from './modules/community/dto/update-post.dto';
import type { AuthenticatedUser } from './modules/auth/guards/jwt-auth.guard';

const ACTOR_A: AuthenticatedUser = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'alice@stanford.edu',
  username: 'alice_pi',
  role: UserRole.PI,
  organizationId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  departmentId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
};

const ACTOR_B: AuthenticatedUser = {
  id: '22222222-2222-4222-8222-222222222222',
  email: 'bob@stanford.edu',
  username: 'bob_researcher',
  role: UserRole.RESEARCHER,
  organizationId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  departmentId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
};

const FINANCE_OFFICER: AuthenticatedUser = {
  id: '44444444-4444-4444-8444-444444444444',
  email: 'finance@stanford.edu',
  username: 'fin_officer',
  role: UserRole.FINANCE_OFFICER,
  organizationId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
};

describe('Cambium Backend & Database Engineering Verification Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('1. AllExceptionsFilter normalizes PG SQLSTATE errors & malformed JSON without stack leaks', () => {
    const filter = new AllExceptionsFilter();
    const jsonMock = vi.fn();
    const statusMock = vi.fn(() => ({ json: jsonMock }));
    const host: any = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({ method: 'POST', url: '/api/bookmarks', requestId: 'req-123' }),
        getResponse: () => ({ status: statusMock }),
      }),
    };

    filter.catch({ driverError: { code: '23505' } }, host);
    expect(statusMock).toHaveBeenLastCalledWith(409);
    expect(jsonMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ errorCode: 'UNIQUE_CONSTRAINT_VIOLATION', requestId: 'req-123' }),
    );

    filter.catch(new SyntaxError('Unexpected token } in JSON'), host);
    expect(statusMock).toHaveBeenLastCalledWith(400);
    expect(jsonMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ errorCode: 'MALFORMED_JSON_BODY' }),
    );

    filter.catch(new Error('SELECT * FROM secret_table WHERE token=xyz'), host);
    expect(statusMock).toHaveBeenLastCalledWith(500);
    const payload500 = jsonMock.mock.calls.at(-1)?.[0];
    expect(JSON.stringify(payload500)).not.toContain('secret_table');
  });

  it('2. validateServerEnv fails fast in production when JWT_SECRET uses dev fallback', () => {
    expect(() =>
      validateServerEnv({
        NODE_ENV: 'production',
        JWT_SECRET: 'cambium-super-secure-production-secret-key-2026',
        DATABASE_URL: 'postgresql://user:pass@db.example.com:5432/cambium',
      } as any),
    ).toThrow(/JWT_SECRET/);

    const ok = validateServerEnv({
      NODE_ENV: 'production',
      JWT_SECRET: 'x9K!mP2qR7vL4zW8nB3cF6hJ9sT1yD5gA0',
      DATABASE_URL: 'postgresql://user:pass@db.example.com:5432/cambium',
    } as any);
    expect(ok.valid).toBe(true);
  });

  it('3. User.passwordHash has TypeORM select:false to prevent accidental relation serialization', () => {
    const colMeta = getMetadataArgsStorage().columns.find(
      (c) => c.target === User && c.propertyName === 'passwordHash',
    );
    expect(colMeta).toBeDefined();
    expect(colMeta?.options?.select).toBe(false);
  });

  it('4. OpportunitiesService enforces bounded pagination, transactional tag creation, and creator ownership', async () => {
    const qb: any = {
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      getManyAndCount: vi.fn().mockResolvedValue([Array.from({ length: 5 }, (_, i) => ({ id: `opp-${i}` })), 30]),
    };
    const txTagRepo = {
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn((x: any) => x),
      save: vi.fn(async (x: any) => ({ id: 'tx-tag-1', ...x })),
    };
    const outsideTagRepo = {
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    };
    const queryRunner: any = {
      connect: vi.fn(),
      startTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      rollbackTransaction: vi.fn(),
      release: vi.fn(),
      manager: {
        getRepository: vi.fn(() => txTagRepo),
        create: vi.fn((_e: any, x: any) => x),
        save: vi.fn(async (x: any) => ({ id: 'opp-created', ...x })),
      },
    };
    const oppRepo: any = {
      createQueryBuilder: vi.fn(() => qb),
      findOne: vi.fn(async () => ({ id: 'opp-1', createdById: ACTOR_A.id, tags: [] })),
      save: vi.fn(async (x: any) => x),
      remove: vi.fn(async (x: any) => x),
    };
    const service = new OpportunitiesService(oppRepo, outsideTagRepo as any, {
      createQueryRunner: () => queryRunner,
    } as any);

    const paged = await service.findAll({ page: 2, limit: 25 });
    expect(qb.take).toHaveBeenCalledWith(25);
    expect(qb.skip).toHaveBeenCalledWith(25);
    expect(paged.hasMore).toBe(false);
    expect(paged.total).toBe(30);

    // Reject oversized bulk payload (> 100)
    const oversized = Array.from({ length: 101 }, (_, i) => ({
      title: `Grant ${i}`,
      type: OpportunityType.GRANT,
      organization: 'NSF',
    }));
    await expect(service.bulkCreate(oversized, ACTOR_A.id)).rejects.toThrow(BadRequestException);

    // Bulk create executes tag lookup INSIDE transaction QueryRunner
    await service.bulkCreate(
      [{ title: 'NSF AI', type: OpportunityType.GRANT, organization: 'NSF', tags: ['AI'] }],
      ACTOR_A.id,
    );
    expect(txTagRepo.save).toHaveBeenCalled();
    expect(outsideTagRepo.save).not.toHaveBeenCalled();

    // Non-creator non-admin rejected on update and remove
    await expect(service.update('opp-1', { title: 'Tampered' }, ACTOR_B.id, false)).rejects.toThrow(
      ForbiddenException,
    );
    await expect(service.remove('opp-1', ACTOR_B.id, false)).rejects.toThrow(ForbiddenException);
  });

  it('5. BookmarksService enforces owner checks on remove and maps 23505 races to 409 ConflictException', async () => {
    const bookmarkRepo: any = {
      findOne: vi.fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'bm-1', userId: ACTOR_A.id }),
      create: vi.fn((x: any) => x),
      save: vi.fn().mockRejectedValueOnce({ code: '23505' }),
      remove: vi.fn(),
    };
    const service = new BookmarksService(bookmarkRepo);

    await expect(
      service.create({ user: ACTOR_A.id, opportunity: 'opp-1' }),
    ).rejects.toThrow(ConflictException);

    await expect(service.remove('bm-1', ACTOR_B.id, false)).rejects.toThrow(ForbiddenException);
  });

  it('6. FundingService eliminates listAccounts N+1 & uses pessimistic_write locks for concurrent safety', async () => {
    const accounts = [
      { id: 'fa-1', sanctionedAmount: '1000', committedAmount: '200', spentAmount: '100' },
      { id: 'fa-2', sanctionedAmount: '500', committedAmount: '0', spentAmount: '50' },
    ];
    const qb: any = {
      orderBy: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      getMany: vi.fn(async () => accounts),
    };
    const lineItemRepo: any = {
      find: vi.fn(async () => [
        { id: 'li-1', fundingAccountId: 'fa-1', category: 'Equipment' },
      ]),
    };

    const txAccount = {
      id: 'fa-1',
      organizationId: ACTOR_A.organizationId,
      departmentId: ACTOR_A.departmentId,
      piUserId: ACTOR_A.id,
      financialState: 'SANCTIONED',
      sanctionedAmount: '1000',
      committedAmount: '900',
      spentAmount: '0',
    };
    const txAccountRepo = {
      findOne: vi.fn(async () => txAccount),
      save: vi.fn(async (x: any) => x),
    };
    const txExpenseRepo = {
      create: vi.fn((x: any) => x),
      save: vi.fn(async (x: any) => ({ id: 'exp-1', ...x })),
    };
    const dataSource: any = {
      transaction: vi.fn(async (cb: any) =>
        cb({
          getRepository: (entity: any) => {
            if (entity.name === 'FundingAccount') return txAccountRepo;
            if (entity.name === 'ExpenseRequest') return txExpenseRepo;
            return lineItemRepo;
          },
        }),
      ),
    };

    const funding = new FundingService(
      { createQueryBuilder: () => qb } as any,
      lineItemRepo,
      {} as any,
      undefined,
      dataSource,
    );

    const listed = await funding.listAccounts(ACTOR_A);
    expect(listed.count).toBe(2);
    expect(lineItemRepo.find).toHaveBeenCalledTimes(1); // Batched IN query, zero N+1

    // Exceeding available balance inside pessimistic_write lock is rejected
    await expect(
      funding.createExpenseRequest(ACTOR_A, {
        fundingAccountId: 'fa-1',
        title: 'Spectrometer',
        amount: 200,
      } as any),
    ).rejects.toThrow(BadRequestException);
    expect(txAccountRepo.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ lock: { mode: 'pessimistic_write' } }),
    );
  });

  it('7. ProposalsService blocks invalid workflow transitions (resubmitting APPROVED or reviewing DRAFTING)', async () => {
    const proposalRepo: any = {
      findOne: vi
        .fn()
        .mockResolvedValueOnce({
          id: 'prop-1',
          organizationId: ACTOR_A.organizationId,
          departmentId: ACTOR_A.departmentId,
          leadUserId: ACTOR_A.id,
          status: 'APPROVED',
        })
        .mockResolvedValueOnce({
          id: 'prop-2',
          organizationId: ACTOR_A.organizationId,
          departmentId: ACTOR_A.departmentId,
          leadUserId: ACTOR_A.id,
          status: 'DRAFTING',
        }),
    };

    const service = new ProposalsService(proposalRepo, {} as any, {} as any);

    await expect(service.submitForReview('prop-1', ACTOR_A)).rejects.toThrow(BadRequestException);
    await expect(
      service.recordReviewDecision('prop-2', FINANCE_OFFICER.role ? { ...ACTOR_A, role: UserRole.RD_DIRECTOR } : ACTOR_A, {
        stage: 'SUPERVISOR',
        decision: 'APPROVED',
        comments: 'Too early',
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('8. IngestionService isolates individual crawler failures via Promise.allSettled', async () => {
    const oppRepo: any = {
      findOne: vi.fn(async () => null),
      create: vi.fn((x: any) => x),
      save: vi.fn(async (x: any) => ({ id: 'new-opp-1', ...x })),
    };
    const tagRepo: any = {
      findOne: vi.fn(async () => ({ id: 't-1', name: 'AI' })),
    };

    const ingestion = new IngestionService(
      oppRepo,
      tagRepo,
      { generateEmbedding: vi.fn(async () => ({ embedding: [0.1, 0.2] })) } as any,
      {
        crawl: vi.fn(async () => [
          {
            title: 'NSF Resilience Grant',
            organization: 'NSF',
            type: OpportunityType.GRANT,
            description: 'Test',
            link: 'https://nsf.gov/1',
            tags: ['AI'],
          },
        ]),
      } as any,
      { crawl: vi.fn(async () => []) } as any,
      { crawl: vi.fn(async () => { throw new Error('arXiv upstream 503'); }) } as any,
      { crawl: vi.fn(async () => []) } as any,
      { crawl: vi.fn(async () => []) } as any,
      { registerProcessor: vi.fn() } as any,
    );

    const result = await ingestion.crawlAndIngest('all', 5);
    expect(result.newlyIngested).toBe(1);
    expect(result.items[0].title).toBe('NSF Resilience Grant');
  });

  it('9. BillingService persists Subscription & Invoice atomically and DTOs enforce whitelisting', async () => {
    const pipe = new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    });

    await expect(
      pipe.transform(
        { tier: SubscriptionTier.PRO, cycle: 'daily' },
        { type: 'body', metatype: SubscribeDto },
      ),
    ).rejects.toThrow(BadRequestException);

    await expect(
      pipe.transform(
        { title: 'Valid Edit', metrics: { likes: 99999 } },
        { type: 'body', metatype: UpdatePostDto },
      ),
    ).rejects.toThrow(BadRequestException);

    const subRepo: any = {
      findOne: vi.fn(async () => null),
      create: vi.fn((x: any) => x),
      save: vi.fn(async (x: any) => ({ id: 'sub-1', ...x })),
    };
    const invoiceRepo: any = {
      create: vi.fn((x: any) => x),
      save: vi.fn(async (x: any) => ({ id: 'inv-1', ...x })),
    };
    const dataSource: any = {
      transaction: vi.fn(async (cb: any) =>
        cb({
          getRepository: (e: any) => (e === Subscription ? subRepo : invoiceRepo),
        }),
      ),
    };

    const billing = new BillingService({} as any, {} as any, dataSource);
    const out = await billing.createOrUpdateSubscription(ACTOR_A.id, {
      tier: SubscriptionTier.PRO,
      cycle: 'monthly',
    });

    expect(out.success).toBe(true);
    expect(out.invoice.invoiceNumber).toMatch(/^CAMB-[A-F0-9]{8}$/);
    expect(dataSource.transaction).toHaveBeenCalledTimes(1);
  });

  it('10. Database config registers Billing entities and Migration 002 defines CHECKs & composite indexes', () => {
    const dbConfig: any = getDatabaseConfig();
    expect(dbConfig.entities).toContain(Subscription);
    expect(dbConfig.entities).toContain(Invoice);

    const sqlPath = path.resolve(
      __dirname,
      './database/migrations/002_backend_integrity_and_indexes.sql',
    );
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS subscriptions');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS invoices');
    expect(sql).toContain('chk_fa_non_negative_balances');
    expect(sql).toContain('idx_opps_type_deadline');
    expect(sql).toContain('idx_prop_org_status_updated');
    expect(sql).toContain('idx_ap_tags_gin');
  });
});
