import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BadRequestException, ConflictException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { OpportunitiesService } from '../modules/opportunities/opportunities.service';
import { OpportunityType } from '../modules/opportunities/entities/research-opportunity.entity';
import { AuthService } from '../modules/auth/auth.service';
import { RedlockService } from '../common/redis/redlock.service';

describe('QA Sprint 2 — Database Transactions, Schema & Concurrency Integrity', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'cambium-qa-integration-secret-32chars!';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'cambium-qa-refresh-secret-32chars!';
  });

  it('commits QueryRunner transaction on full bulkCreate success and rolls back completely on mid-batch error', async () => {
    const mockTagRepo = {
      findOne: vi.fn(async ({ where }: any) => ({ id: `tag-${where.name}`, name: where.name })),
      create: vi.fn((x: any) => x),
      save: vi.fn(async (x: any) => x),
    };

    const queryRunnerOk = {
      connect: vi.fn(async () => {}),
      startTransaction: vi.fn(async () => {}),
      commitTransaction: vi.fn(async () => {}),
      rollbackTransaction: vi.fn(async () => {}),
      release: vi.fn(async () => {}),
      manager: {
        create: vi.fn((_entity: any, data: any) => data),
        save: vi.fn(async (item: any) => ({ id: `saved-${item.title}`, ...item })),
      },
    };

    const serviceOk = new OpportunitiesService(
      {} as any,
      mockTagRepo as any,
      { createQueryRunner: () => queryRunnerOk } as any,
    );

    const okResult = await serviceOk.bulkCreate([
      { title: 'Grant Alpha', type: OpportunityType.GRANT, organization: 'NSF', tags: ['AI'] },
      { title: 'Grant Beta', type: OpportunityType.GRANT, organization: 'NIH', tags: ['Bio'] },
    ]);
    expect(okResult.count).toBe(2);
    expect(queryRunnerOk.startTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunnerOk.commitTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunnerOk.rollbackTransaction).not.toHaveBeenCalled();
    expect(queryRunnerOk.release).toHaveBeenCalledTimes(1);

    let saveCalls = 0;
    const queryRunnerFail = {
      connect: vi.fn(async () => {}),
      startTransaction: vi.fn(async () => {}),
      commitTransaction: vi.fn(async () => {}),
      rollbackTransaction: vi.fn(async () => {}),
      release: vi.fn(async () => {}),
      manager: {
        create: vi.fn((_entity: any, data: any) => data),
        save: vi.fn(async (item: any) => {
          saveCalls++;
          if (saveCalls === 2) {
            throw new Error('duplicate key value violates unique constraint');
          }
          return item;
        }),
      },
    };

    const serviceFail = new OpportunitiesService(
      {} as any,
      mockTagRepo as any,
      { createQueryRunner: () => queryRunnerFail } as any,
    );

    await expect(
      serviceFail.bulkCreate([
        { title: 'Grant One', type: OpportunityType.GRANT, organization: 'NSF' },
        { title: 'Grant Two', type: OpportunityType.GRANT, organization: 'NIH' },
      ]),
    ).rejects.toThrow('duplicate key value');

    expect(queryRunnerFail.startTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunnerFail.commitTransaction).not.toHaveBeenCalled();
    expect(queryRunnerFail.rollbackTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunnerFail.release).toHaveBeenCalledTimes(1);
  });

  it('rejects duplicate email or username registration without creating a second account or leaking SQL errors', async () => {
    const qb = {
      where: vi.fn().mockReturnThis(),
      orWhere: vi.fn().mockReturnThis(),
      getOne: vi.fn(async () => ({ id: 'existing-user-1', email: 'dup@mit.edu.invalid' })),
    };

    const userRepo = {
      createQueryBuilder: vi.fn(() => qb),
      create: vi.fn(),
      save: vi.fn(),
    };

    const authService = new AuthService(
      userRepo as any,
      { findOne: vi.fn(), create: vi.fn(), save: vi.fn() } as any,
      { getClient: () => null } as any,
    );

    await expect(
      authService.register({
        username: 'existing_scholar',
        fullName: 'Duplicate Scholar',
        email: 'dup@mit.edu.invalid',
        password: 'StrongPassword123!',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(userRepo.create).not.toHaveBeenCalled();
    expect(userRepo.save).not.toHaveBeenCalled();
  });

  it('verifies schema.sql and 001_supabase_rls_lockdown.sql enforce UUID keys, vector support, and RLS', () => {
    const schemaPath = path.resolve(__dirname, '..', 'database', 'schema.sql');
    const rlsPath = path.resolve(
      __dirname,
      '..',
      'database',
      'migrations',
      '001_supabase_rls_lockdown.sql',
    );

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const rlsSql = fs.readFileSync(rlsPath, 'utf8');

    expect(schemaSql).toContain('CREATE TABLE IF NOT EXISTS users');
    expect(schemaSql).toContain('CREATE EXTENSION IF NOT EXISTS vector');
    expect(schemaSql).toContain('ON DELETE CASCADE');

    expect(rlsSql).toContain('CREATE OR REPLACE FUNCTION public.cambium_actor_uuid()');
    expect(rlsSql).toContain('ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY');
    expect(rlsSql).toContain('ALTER TABLE IF EXISTS group_projects ENABLE ROW LEVEL SECURITY');
    expect(rlsSql).toContain('FORCE ROW LEVEL SECURITY');
  });

  it('enforces Redlock mutual exclusion, owner-only lock release, and finally cleanup under error', async () => {
    const redlock = new RedlockService({ getClient: () => null } as any);

    const lockA = await redlock.acquire('crawler:nsf:grant-42', 5000, 0, 10);
    expect(lockA).not.toBeNull();

    // Contending acquire must fail while lockA is active
    const lockB = await redlock.acquire('crawler:nsf:grant-42', 5000, 0, 10);
    expect(lockB).toBeNull();

    // Non-owner lockId cannot hijack-release lockA
    const hijacked = await redlock.release({
      lockId: 'wrong-owner-lock-id',
      resource: 'crawler:nsf:grant-42',
      expiresAt: Date.now() + 5000,
    });
    expect(hijacked).toBe(false);

    // Owner releases cleanly, allowing next caller to acquire
    expect(await redlock.release(lockA!)).toBe(true);

    // withLock cleans up even if task throws
    await expect(
      redlock.withLock('workspace:grant-42:budget', async () => {
        throw new ConflictException('budget ceiling reached');
      }),
    ).rejects.toThrow('budget ceiling reached');

    const lockAfterFailure = await redlock.acquire('workspace:grant-42:budget', 5000, 0, 10);
    expect(lockAfterFailure).not.toBeNull();
    await redlock.release(lockAfterFailure!);
  });
});
