import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RedlockService } from './redlock.service';
import { ConflictException } from '@nestjs/common';

describe('RedlockService', () => {
  let redlockService: RedlockService;
  let mockRedisService: any;
  let fakeRedisMap: Map<string, string>;

  beforeEach(() => {
    fakeRedisMap = new Map();
    mockRedisService = {
      getClient: vi.fn().mockReturnValue({
        set: vi.fn().mockImplementation(async (key: string, val: string, px: string, ttl: number, nx: string) => {
          if (fakeRedisMap.has(key)) return null;
          fakeRedisMap.set(key, val);
          return 'OK';
        }),
        eval: vi.fn().mockImplementation(async (script: string, numKeys: number, key: string, lockId: string) => {
          if (fakeRedisMap.get(key) === lockId) {
            fakeRedisMap.delete(key);
            return 1;
          }
          return 0;
        }),
      }),
    };

    redlockService = new RedlockService(mockRedisService as any);
  });

  it('should acquire distributed lock on an available grant crawler resource', async () => {
    const resource = 'crawler:grants-gov:OPP-89210';
    const lock = await redlockService.acquire(resource, 5000);

    expect(lock).not.toBeNull();
    expect(lock?.resource).toBe(resource);
    expect(lock?.lockId).toBeDefined();
    expect(fakeRedisMap.has(`cambium:lock:${resource}`)).toBe(true);
  });

  it('should prevent race condition when parallel worker attempts to acquire locked resource', async () => {
    const resource = 'crawler:nsf:FAST-9901';
    const firstLock = await redlockService.acquire(resource, 5000);
    expect(firstLock).not.toBeNull();

    // Parallel attempt with 0 retries
    const secondLock = await redlockService.acquire(resource, 5000, 0);
    expect(secondLock).toBeNull();
  });

  it('should cleanly release lock using Lua token script so other workers can acquire it', async () => {
    const resource = 'crawler:horizon-europe:CALL-2026';
    const lock = await redlockService.acquire(resource, 5000);
    expect(lock).not.toBeNull();

    const released = await redlockService.release(lock!);
    expect(released).toBe(true);
    expect(fakeRedisMap.has(`cambium:lock:${resource}`)).toBe(false);

    // Another worker can now acquire
    const nextLock = await redlockService.acquire(resource, 5000);
    expect(nextLock).not.toBeNull();
  });

  it('should execute task within withLock and release automatically', async () => {
    const resource = 'crawler:wellcome:WELL-554';
    let executed = false;

    const result = await redlockService.withLock(resource, async () => {
      executed = true;
      return 'ingested-data';
    });

    expect(result).toBe('ingested-data');
    expect(executed).toBe(true);
    expect(fakeRedisMap.has(`cambium:lock:${resource}`)).toBe(false);
  });

  it('should throw ConflictException if withLock cannot acquire resource', async () => {
    const resource = 'crawler:nih:NIH-8812';
    // Artificially lock the resource
    fakeRedisMap.set(`cambium:lock:${resource}`, 'other-owner');

    await expect(
      redlockService.withLock(resource, async () => 'should-not-run', 100),
    ).rejects.toThrow(ConflictException);
  });
});
