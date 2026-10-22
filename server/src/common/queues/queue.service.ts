import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import {
  QUEUE_NAMES,
  JOB_NAMES,
  IngestionJobData,
  EmbeddingJobData,
  EmailJobData,
  DigestJobData,
} from './queue.constants';

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

  // In-memory fallback job storage & handlers when Redis is offline
  private inMemoryProcessors = new Map<string, (job: { id: string; name: string; data: any }) => Promise<any>>();
  private inMemoryMetrics = {
    ingestion: { active: 0, completed: 0, failed: 0 },
    embedding: { active: 0, completed: 0, failed: 0 },
    email: { active: 0, completed: 0, failed: 0 },
    digest: { active: 0, completed: 0, failed: 0 },
  };

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST || '127.0.0.1';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = process.env.REDIS_PASSWORD || undefined;

    try {
      this.redisClient = redisUrl
        ? new Redis(redisUrl, {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            connectTimeout: 2000,
            lazyConnect: true,
          })
        : new Redis({
            host: redisHost,
            port: redisPort,
            password: redisPassword,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            connectTimeout: 2000,
            lazyConnect: true,
          });

      await this.redisClient.connect().catch(() => {
        // Ignored; handled by fallback below
      });

      this.isRedisAvailable = this.redisClient.status === 'ready' || this.redisClient.status === 'connect';

      if (this.isRedisAvailable) {
        const connection = this.redisClient;

        this.ingestionQueue = new Queue(QUEUE_NAMES.INGESTION, { connection });
        this.embeddingQueue = new Queue(QUEUE_NAMES.EMBEDDING, { connection });
        this.emailQueue = new Queue(QUEUE_NAMES.EMAIL, { connection });
        this.digestQueue = new Queue(QUEUE_NAMES.DEADLINE_DIGEST, { connection });

        this.logger.log(' BullMQ queues registered on Redis backbone (Ingestion, Embedding, Email, Digest)');
      } else {
        this.logger.warn(' Redis broker unavailable. BullMQ operating in zero-crash in-memory dispatcher mode.');
      }
    } catch (err: any) {
      this.logger.warn(`Failed to connect BullMQ to Redis: ${err.message}. Operating in in-memory mode.`);
      this.isRedisAvailable = false;
    }
  }

  async onModuleDestroy() {
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

  /**
   * Register a processor callback for a specific queue
   */
  registerProcessor(queueName: string, processor: (job: { id: string; name: string; data: any }) => Promise<any>) {
    this.inMemoryProcessors.set(queueName, processor);

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

  /**
   * Enqueue academic opportunity ingestion job
   */
  async addIngestionJob(data: IngestionJobData): Promise<{ id: string; isQueued: boolean }> {
    const jobName = data.source === 'openalex' ? JOB_NAMES.CRAWL_OPENALEX : JOB_NAMES.CRAWL_GRANTS_GOV;

    if (this.isRedisAvailable && this.ingestionQueue) {
      const job = await this.ingestionQueue.add(jobName, data, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      });
      return { id: job.id || `ingest-${Date.now()}`, isQueued: true };
    }

    // In-memory immediate execution / fallback
    const mockId = `mem-ingest-${Date.now()}`;
    this.inMemoryMetrics.ingestion.active++;
    const processor = this.inMemoryProcessors.get(QUEUE_NAMES.INGESTION);
    if (processor) {
      setTimeout(async () => {
        try {
          await processor({ id: mockId, name: jobName, data });
          this.inMemoryMetrics.ingestion.completed++;
        } catch (e) {
          this.inMemoryMetrics.ingestion.failed++;
          this.logger.warn(`In-memory ingestion job failed: ${(e as Error).message}`);
        } finally {
          this.inMemoryMetrics.ingestion.active = Math.max(0, this.inMemoryMetrics.ingestion.active - 1);
        }
      }, 50);
    }
    return { id: mockId, isQueued: true };
  }

  /**
   * Enqueue vector embedding generation job
   */
  async addEmbeddingJob(data: EmbeddingJobData): Promise<{ id: string; isQueued: boolean }> {
    if (this.isRedisAvailable && this.embeddingQueue) {
      const job = await this.embeddingQueue.add(JOB_NAMES.COMPUTE_EMBEDDING, data, {
        attempts: 2,
        backoff: { type: 'fixed', delay: 2000 },
      });
      return { id: job.id || `embed-${Date.now()}`, isQueued: true };
    }

    const mockId = `mem-embed-${Date.now()}`;
    this.inMemoryMetrics.embedding.active++;
    const processor = this.inMemoryProcessors.get(QUEUE_NAMES.EMBEDDING);
    if (processor) {
      setTimeout(async () => {
        try {
          await processor({ id: mockId, name: JOB_NAMES.COMPUTE_EMBEDDING, data });
          this.inMemoryMetrics.embedding.completed++;
        } catch {
          this.inMemoryMetrics.embedding.failed++;
        } finally {
          this.inMemoryMetrics.embedding.active = Math.max(0, this.inMemoryMetrics.embedding.active - 1);
        }
      }, 50);
    }
    return { id: mockId, isQueued: true };
  }

  /**
   * Enqueue transactional email job
   */
  async addEmailJob(data: EmailJobData): Promise<{ id: string; isQueued: boolean }> {
    if (this.isRedisAvailable && this.emailQueue) {
      const job = await this.emailQueue.add(JOB_NAMES.DISPATCH_EMAIL, data, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
      });
      return { id: job.id || `mail-${Date.now()}`, isQueued: true };
    }

    const mockId = `mem-mail-${Date.now()}`;
    this.inMemoryMetrics.email.active++;
    const processor = this.inMemoryProcessors.get(QUEUE_NAMES.EMAIL);
    if (processor) {
      setTimeout(async () => {
        try {
          await processor({ id: mockId, name: JOB_NAMES.DISPATCH_EMAIL, data });
          this.inMemoryMetrics.email.completed++;
        } catch {
          this.inMemoryMetrics.email.failed++;
        } finally {
          this.inMemoryMetrics.email.active = Math.max(0, this.inMemoryMetrics.email.active - 1);
        }
      }, 50);
    }
    return { id: mockId, isQueued: true };
  }

  /**
   * Enqueue Monday 08:00 UTC Deadline Digest job
   */
  async addDigestJob(data: DigestJobData): Promise<{ id: string; isQueued: boolean }> {
    if (this.isRedisAvailable && this.digestQueue) {
      const job = await this.digestQueue.add(JOB_NAMES.RUN_WEEKLY_DIGEST, data, {
        attempts: 2,
      });
      return { id: job.id || `digest-${Date.now()}`, isQueued: true };
    }

    const mockId = `mem-digest-${Date.now()}`;
    this.inMemoryMetrics.digest.active++;
    const processor = this.inMemoryProcessors.get(QUEUE_NAMES.DEADLINE_DIGEST);
    if (processor) {
      setTimeout(async () => {
        try {
          await processor({ id: mockId, name: JOB_NAMES.RUN_WEEKLY_DIGEST, data });
          this.inMemoryMetrics.digest.completed++;
        } catch {
          this.inMemoryMetrics.digest.failed++;
        } finally {
          this.inMemoryMetrics.digest.active = Math.max(0, this.inMemoryMetrics.digest.active - 1);
        }
      }, 50);
    }
    return { id: mockId, isQueued: true };
  }

  /**
   * Aggregate metrics across all BullMQ queues
   */
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

    return {
      mode: 'in-memory-dispatcher',
      isRedisAvailable: false,
      queues: this.inMemoryMetrics,
    };
  }
}
