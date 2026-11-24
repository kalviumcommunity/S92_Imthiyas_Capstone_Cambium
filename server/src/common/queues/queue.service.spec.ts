import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueueService } from './queue.service';

describe('QueueService (Durable PostgreSQL Job Fallback)', () => {
  let service: QueueService;
  let storedJobs: any[];
  let mockJobRepo: any;

  beforeEach(() => {
    storedJobs = [];
    mockJobRepo = {
      findOne: vi.fn(async ({ where }: any) =>
        storedJobs.find((j) => j.idempotencyKey === where.idempotencyKey) || null,
      ),
      create: vi.fn((d) => ({ id: `job-${storedJobs.length + 1}`, ...d })),
      save: vi.fn(async (d) => {
        const idx = storedJobs.findIndex((j) => j.id === d.id);
        if (idx >= 0) storedJobs[idx] = d;
        else storedJobs.push(d);
        return d;
      }),
      find: vi.fn(async ({ where }: any) => storedJobs.filter((j) => j.status === where.status)),
      count: vi.fn(async ({ where }: any) => storedJobs.filter((j) => j.status === where.status).length),
    };
    service = new QueueService(mockJobRepo);
  });

  it('should persist durable jobs and deduplicate by idempotencyKey', async () => {
    const first = await service.enqueueDurableJob({
      queueName: 'cambium-embedding-queue',
      jobName: 'compute-embedding',
      payload: { opportunityId: 'opp-1' },
      idempotencyKey: 'embed:opp-1',
    });
    const dup = await service.enqueueDurableJob({
      queueName: 'cambium-embedding-queue',
      jobName: 'compute-embedding',
      payload: { opportunityId: 'opp-1' },
      idempotencyKey: 'embed:opp-1',
    });

    expect(first.id).toBe('job-1');
    expect(dup.deduplicated).toBe(true);
    expect(storedJobs).toHaveLength(1);
  });

  it('should execute queued jobs and transition failing jobs to DEAD after maxAttempts', async () => {
    let attempts = 0;
    service.registerProcessor('test-queue', async () => {
      attempts += 1;
      throw new Error('Upstream AI rate-limited');
    });

    await service.enqueueDurableJob({
      queueName: 'test-queue',
      jobName: 'analyze',
      payload: { docId: 'd1' },
      maxAttempts: 2,
    });

    await service.processPendingDatabaseJobs(5);
    expect(storedJobs[0].status).toBe('QUEUED'); // scheduled retry with backoff
    expect(storedJobs[0].attempts).toBe(1);

    storedJobs[0].runAt = new Date(Date.now() - 1000);
    await service.processPendingDatabaseJobs(5);
    expect(storedJobs[0].status).toBe('DEAD');
    expect(storedJobs[0].attempts).toBe(2);
    expect(attempts).toBe(2);
    expect(storedJobs[0].lastError).toContain('Upstream AI rate-limited');
  });
});
