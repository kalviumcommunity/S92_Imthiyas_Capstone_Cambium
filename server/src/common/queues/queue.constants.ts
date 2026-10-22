export const QUEUE_NAMES = {
  INGESTION: 'cambium-ingestion-queue',
  EMBEDDING: 'cambium-embedding-queue',
  EMAIL: 'cambium-email-queue',
  DEADLINE_DIGEST: 'cambium-deadline-digest-queue',
} as const;

export const JOB_NAMES = {
  CRAWL_GRANTS_GOV: 'crawl-grants-gov',
  CRAWL_OPENALEX: 'crawl-openalex',
  COMPUTE_EMBEDDING: 'compute-embedding',
  DISPATCH_EMAIL: 'dispatch-email',
  RUN_WEEKLY_DIGEST: 'run-weekly-digest',
} as const;

export interface IngestionJobData {
  source: 'grants_gov' | 'openalex' | 'all';
  limit?: number;
  triggeredBy?: string;
  timestamp: string;
}

export interface EmbeddingJobData {
  opportunityId: string;
  title: string;
  description?: string;
  organization?: string;
}

export interface EmailJobData {
  to: string;
  type: 'digest' | 'grant_alert' | 'generic';
  subject?: string;
  recipientName?: string;
  payload?: any;
}

export interface DigestJobData {
  lookaheadDays: number;
  dryRun?: boolean;
  scheduledTime: string;
}
