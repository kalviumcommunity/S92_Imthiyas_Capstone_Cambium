import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import {
  QUEUE_NAMES,
  JOB_NAMES,
  IngestionJobData,
  EmbeddingJobData,
  EmailJobData,
  DigestJobData,
} from './queue.constants';
import { BackgroundJob } from '../../database/entities/background-job.entity';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);

  private redisClient: Redis | null = null;
  private isRedisAvailable = false;

  private ingestionQueue: Queue<IngestionJobData> | null = null;
  private embeddingQueue: Queue<EmbeddingJobData> | null = null;
  private emailQueue: Queue<EmailJobData> | null = null;
  private digestQueue: Queue<DigestJobData> | null = null;

  private activeWorkers: Worker[] = [];
  private pgWorkerTimer: NodeJS.Timeout | null = null;
  private isPollingPgJobs = false;
  private readonly maxConcurrentPgJobs = 3;

  // Fallback processors registered per queue
  private processors = new Map<string, (job: { id: string; name: string; data: any }) => Promise<any>>();
  private inMemoryMetrics = {
    ingestion: { active: 0, completed: 0, failed: 0 },
    embedding: { active: 0, completed: 0, failed: 0 },
    email: { active: 0, completed: 0, failed: 0 },
    digest: { active: 0, completed: 0, failed: 0 },
  };

  constructor(
    @Optional()
    @InjectRepository(BackgroundJob)
    private readonly jobRepo?: Repository<BackgroundJob>,
    @Optional()
    private readonly dataSource?: DataSource,
  ) {}

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST || '127.0.0.1';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = process.env.REDIS_PASSWORD || undefined;

    try {
      const redisOptions = {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        connectTimeout: 2000,
        lazyConnect: true,
        retryStrategy: () => null,
      };

      this.redisClient = redisUrl
        ? new Redis(redisUrl, redisOptions)
        : new Redis({
            host: redisHost,
            port: redisPort,
            password: redisPassword,
            ...redisOptions,
          });

      this.redisClient.on('error', () => {
        // Prevent unhandled error event during initial connection probe
      });

      await this.redisClient.connect().catch(() => {
        // Ignored; handled by PostgreSQL durable fallback below
      });

      this.isRedisAvailable =
        this.redisClient.status === 'ready' || this.redisClient.status === 'connect';

      if (this.isRedisAvailable) {
        const connection = this.redisClient;
        this.ingestionQueue = new Queue(QUEUE_NAMES.INGESTION, { connection });
        this.embeddingQueue = new Queue(QUEUE_NAMES.EMBEDDING, { connection });
        this.emailQueue = new Queue(QUEUE_NAMES.EMAIL, { connection });
        this.digestQueue = new Queue(QUEUE_NAMES.DEADLINE_DIGEST, { connection });
        this.logger.log('BullMQ queues registered on Redis backbone (Ingestion, Embedding, Email, Digest)');
      } else {
        if (this.redisClient) {
          this.redisClient.removeAllListeners('error');
          this.redisClient.disconnect(false);
        }
        this.startPostgresJobPoller();
      }
    } catch (err: any) {
      this.logger.warn(`Failed to initialize Redis BullMQ (${err.message}). Using PostgreSQL durable job queue.`);
      this.isRedisAvailable = false;
      this.startPostgresJobPoller();
    }
  }

  private startPostgresJobPoller() {
    if (this.pgWorkerTimer || process.env.NODE_ENV === 'test') return;
    this.logger.log('PostgreSQL durable background_jobs worker active (₹0 zero-Redis mode)');
    this.pgWorkerTimer = setInterval(() => {
      this.processPendingDatabaseJobs().catch((err) => {
        this.logger.error(`PG background worker error: ${err?.message}`);
      });
    }, 3000);
  }

  async onModuleDestroy() {
    if (this.pgWorkerTimer) {
      clearInterval(this.pgWorkerTimer);
      this.pgWorkerTimer = null;
    }
    for (const worker of this.activeWorkers) {
      await worker.close().catch(() => {});
    }
    if (this.ingestionQueue) await this.ingestionQueue.close().catch(() => {});
    if (this.embeddingQueue) await this.embeddingQueue.close().catch(() => {});
    if (this.emailQueue) await this.emailQueue.close().catch(() => {});
    if (this.digestQueue) await this.digestQueue.close().catch(() => {});
    if (this.redisClient) {
      this.redisClient.disconnect();
    }
  }

  registerProcessor(queueName: string, processor: (job: { id: string; name: string; data: any }) => Promise<any>) {
    this.processors.set(queueName, processor);

    if (this.isRedisAvailable && this.redisClient) {
      const worker = new Worker(
        queueName,
        async (job) => {
          return processor({ id: job.id || `job-${Date.now()}`, name: job.name, data: job.data });
        },
        { connection: this.redisClient },
      );

      worker.on('failed', (job, err) => {
        this.logger.error(`Worker [${queueName}] job ${job?.id} failed: ${err.message}`);
      });

      this.activeWorkers.push(worker);
    }
  }

  async enqueueDurableJob(params: {
    queueName: string;
    jobName: string;
    payload: Record<string, any>;
    idempotencyKey?: string;
    maxAttempts?: number;
  }): Promise<{ id: string; isQueued: boolean; deduplicated?: boolean }> {
    if (this.jobRepo) {
      if (params.idempotencyKey) {
        const existing = await this.jobRepo.findOne({
          where: { idempotencyKey: params.idempotencyKey },
        });
        if (existing) {
          return { id: existing.id, isQueued: true, deduplicated: true };
        }
      }

      const job = this.jobRepo.create({
        queueName: params.queueName,
        jobName: params.jobName,
        payload: params.payload,
        idempotencyKey: params.idempotencyKey || null,
        status: 'QUEUED',
        attempts: 0,
        maxAttempts: params.maxAttempts ?? 3,
        runAt: new Date(),
      });
      const saved = await this.jobRepo.save(job);
      return { id: saved.id, isQueued: true };
    }

    // Pure in-memory unit-test fallback when repository is unattached
    const memId = `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const processor = this.processors.get(params.queueName);
    if (processor) {
      setTimeout(async () => {
        try {
          await processor({ id: memId, name: params.jobName, data: params.payload });
        } catch (e) {
          this.logger.warn(`In-memory fallback job failed: ${(e as Error).message}`);
        }
      }, 20);
    }
    return { id: memId, isQueued: true };
  }

  /**
   * Claim and run due PostgreSQL background jobs with SKIP LOCKED and exponential backoff
   */
  async processPendingDatabaseJobs(limit = this.maxConcurrentPgJobs): Promise<number> {
    if (!this.jobRepo || this.isPollingPgJobs) return 0;
    this.isPollingPgJobs = true;

    try {
      let claimed: BackgroundJob[] = [];
      const now = new Date();

      if (this.dataSource && this.dataSource.isInitialized) {
        claimed = await this.dataSource.transaction(async (manager) => {
          const repo = manager.getRepository(BackgroundJob);
          const due = await repo
            .createQueryBuilder('job')
            .setLock('pessimistic_write')
            .setOnLocked('skip_locked')
            .where('job.status = :status', { status: 'QUEUED' })
            .andWhere('job.run_at <= :now', { now })
            .orderBy('job.run_at', 'ASC')
            .take(limit)
            .getMany();

          for (const j of due) {
            j.status = 'RUNNING';
            j.startedAt = now;
            j.attempts += 1;
          }
          if (due.length > 0) await repo.save(due);
          return due;
        });
      } else {
        const candidates = await this.jobRepo.find({
          where: { status: 'QUEUED' },
          order: { runAt: 'ASC' },
          take: limit,
        });
        for (const j of candidates) {
          if (new Date(j.runAt) <= now) {
            j.status = 'RUNNING';
            j.startedAt = now;
            j.attempts += 1;
            claimed.push(await this.jobRepo.save(j));
          }
        }
      }

      if (claimed.length === 0) return 0;

      for (const job of claimed) {
        const processor = this.processors.get(job.queueName);
        if (!processor) {
          // Leave queued if processor hasn't registered yet, without counting a failure
          job.status = 'QUEUED';
          job.attempts = Math.max(0, job.attempts - 1);
          await this.jobRepo.save(job);
          continue;
        }

        try {
          await processor({ id: job.id, name: job.jobName, data: job.payload });
          job.status = 'COMPLETED';
          job.completedAt = new Date();
          job.lastError = null;
          await this.jobRepo.save(job);
        } catch (err: any) {
          const errorMsg = err?.message || String(err);
          job.lastError = errorMsg;
          if (job.attempts >= job.maxAttempts) {
            job.status = 'DEAD';
          } else {
            const backoffMs = Math.min(60000, 2000 * Math.pow(2, job.attempts - 1));
            job.status = 'QUEUED';
            job.runAt = new Date(Date.now() + backoffMs);
          }
          await this.jobRepo.save(job);
        }
      }

      return claimed.length;
    } finally {
      this.isPollingPgJobs = false;
    }
  }

  async addIngestionJob(data: IngestionJobData): Promise<{ id: string; isQueued: boolean }> {
    const jobName = data.source === 'openalex' ? JOB_NAMES.CRAWL_OPENALEX : JOB_NAMES.CRAWL_GRANTS_GOV;
    if (this.isRedisAvailable && this.ingestionQueue) {
      const job = await this.ingestionQueue.add(jobName, data, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      });
      return { id: job.id || `ingest-${Date.now()}`, isQueued: true };
    }
    return this.enqueueDurableJob({
      queueName: QUEUE_NAMES.INGESTION,
      jobName,
      payload: data as any,
    });
  }

  async addEmbeddingJob(data: EmbeddingJobData): Promise<{ id: string; isQueued: boolean }> {
    if (this.isRedisAvailable && this.embeddingQueue) {
      const job = await this.embeddingQueue.add(JOB_NAMES.COMPUTE_EMBEDDING, data, {
        attempts: 2,
        backoff: { type: 'fixed', delay: 2000 },
      });
      return { id: job.id || `embed-${Date.now()}`, isQueued: true };
    }
    return this.enqueueDurableJob({
      queueName: QUEUE_NAMES.EMBEDDING,
      jobName: JOB_NAMES.COMPUTE_EMBEDDING,
      payload: data as any,
      idempotencyKey: `embed:${data.opportunityId}`,
      maxAttempts: 2,
    });
  }

  async addEmailJob(data: EmailJobData): Promise<{ id: string; isQueued: boolean }> {
    if (this.isRedisAvailable && this.emailQueue) {
      const job = await this.emailQueue.add(JOB_NAMES.DISPATCH_EMAIL, data, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
      });
      return { id: job.id || `mail-${Date.now()}`, isQueued: true };
    }
    return this.enqueueDurableJob({
      queueName: QUEUE_NAMES.EMAIL,
      jobName: JOB_NAMES.DISPATCH_EMAIL,
      payload: data as any,
    });
  }

  async addDigestJob(data: DigestJobData): Promise<{ id: string; isQueued: boolean }> {
    if (this.isRedisAvailable && this.digestQueue) {
      const job = await this.digestQueue.add(JOB_NAMES.RUN_WEEKLY_DIGEST, data, { attempts: 2 });
      return { id: job.id || `digest-${Date.now()}`, isQueued: true };
    }
    return this.enqueueDurableJob({
      queueName: QUEUE_NAMES.DEADLINE_DIGEST,
      jobName: JOB_NAMES.RUN_WEEKLY_DIGEST,
      payload: data as any,
      maxAttempts: 2,
    });
  }

  async getMetrics() {
    if (this.isRedisAvailable) {
      const [ingestionCounts, embeddingCounts, emailCounts, digestCounts] = await Promise.all([
        this.ingestionQueue?.getJobCounts('active', 'completed', 'failed', 'delayed', 'waiting') || { active: 0, completed: 0, failed: 0 },
        this.embeddingQueue?.getJobCounts('active', 'completed', 'failed', 'delayed', 'waiting') || { active: 0, completed: 0, failed: 0 },
        this.emailQueue?.getJobCounts('active', 'completed', 'failed', 'delayed', 'waiting') || { active: 0, completed: 0, failed: 0 },
        this.digestQueue?.getJobCounts('active', 'completed', 'failed', 'delayed', 'waiting') || { active: 0, completed: 0, failed: 0 },
      ]);

      return {
        mode: 'redis-bullmq',
        isRedisAvailable: true,
        queues: {
          ingestion: ingestionCounts,
          embedding: embeddingCounts,
          email: emailCounts,
          digest: digestCounts,
        },
      };
    }

    if (this.jobRepo) {
      const [queued, running, completed, dead, oldestQueued] = await Promise.all([
        this.jobRepo.count({ where: { status: 'QUEUED' } }),
        this.jobRepo.count({ where: { status: 'RUNNING' } }),
        this.jobRepo.count({ where: { status: 'COMPLETED' } }),
        this.jobRepo.count({ where: { status: 'DEAD' } }),
        this.jobRepo.findOne({
          where: { status: 'QUEUED' },
          order: { createdAt: 'ASC' },
        }),
      ]);
      const oldestPendingAgeSeconds = oldestQueued
        ? Math.max(0, Math.floor((Date.now() - new Date(oldestQueued.createdAt).getTime()) / 1000))
        : 0;
      return {
        mode: 'postgres-durable-queue',
        isRedisAvailable: false,
        summary: { queued, running, completed, dead, oldestPendingAgeSeconds },
        queues: this.inMemoryMetrics,
      };
    }

    return {
      mode: 'in-memory-dispatcher',
      isRedisAvailable: false,
      summary: { queued: 0, running: 0, completed: 0, dead: 0, oldestPendingAgeSeconds: 0 },
      queues: this.inMemoryMetrics,
    };
  }
}
