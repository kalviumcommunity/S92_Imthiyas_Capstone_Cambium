import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const localEnv = path.resolve(process.cwd(), '.env');
const parentEnv = path.resolve(process.cwd(), '..', '.env');
if (fs.existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
} else if (fs.existsSync(parentEnv)) {
  dotenv.config({ path: parentEnv });
} else {
  dotenv.config();
}

import { User } from '../modules/users/entities/user.entity';
import { ResearchInterest } from '../modules/users/entities/research-interest.entity';
import { ResearchOpportunity } from '../modules/opportunities/entities/research-opportunity.entity';
import { Tag } from '../modules/opportunities/entities/tag.entity';
import { Bookmark } from '../modules/bookmarks/entities/bookmark.entity';
import { Notification } from '../modules/notifications/entities/notification.entity';
import { OutboxEvent } from '../database/entities/outbox-event.entity';
import { AuditLog } from '../database/entities/audit-log.entity';
import { AcademicPost } from '../modules/community/entities/academic-post.entity';
import { Comment } from '../modules/community/entities/comment.entity';
import { PostReaction } from '../modules/community/entities/post-reaction.entity';
import { ScholarConnection } from '../modules/connections/entities/scholar-connection.entity';
import { ScholarFollow } from '../modules/connections/entities/scholar-follow.entity';
import { GroupProject } from '../modules/projects/entities/group-project.entity';
import { ProjectMember } from '../modules/projects/entities/project-member.entity';
import { ProjectActivityLog } from '../modules/projects/entities/project-activity-log.entity';
import { ResearchContribution } from '../modules/contributions/entities/research-contribution.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProd = process.env.NODE_ENV === 'production';

  let masterHost = process.env.POSTGRES_HOST || 'localhost';
  const defaultPort = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  const pgbouncerPort = process.env.POSTGRES_PGBOUNCER_PORT
    ? parseInt(process.env.POSTGRES_PGBOUNCER_PORT, 10)
    : undefined;
  let port = pgbouncerPort || defaultPort;

  let username = process.env.POSTGRES_USER || 'postgres';
  let password = process.env.POSTGRES_PASSWORD || 'postgres';
  let database = process.env.POSTGRES_DB || 'cambium';

  // Support unified DATABASE_URL connection strings (AWS RDS / Supabase / Neon / Cloud SQL)
  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      if (parsed.hostname) masterHost = parsed.hostname;
      if (parsed.port && !pgbouncerPort) port = parseInt(parsed.port, 10);
      if (parsed.username) username = decodeURIComponent(parsed.username);
      if (parsed.password) password = decodeURIComponent(parsed.password);
      if (parsed.pathname && parsed.pathname.length > 1) {
        database = parsed.pathname.replace(/^\//, '');
      }
    } catch {
      // Fallback to individual parameters
    }
  }

  // Read Replicas Configuration (High-Throughput Analytics & Query Routing)
  const replicaHost = process.env.POSTGRES_REPLICA_HOST;
  const replicaPort = parseInt(process.env.POSTGRES_REPLICA_PORT || String(port), 10);

  // SSL Configuration for Managed Production Databases
  const isSsl =
    process.env.DB_SSL === 'true' ||
    (isProd &&
      process.env.DB_SSL !== 'false' &&
      masterHost !== 'localhost' &&
      masterHost !== '127.0.0.1');
  const sslOption = isSsl ? { rejectUnauthorized: false } : false;

  const entities = [
    User,
    ResearchInterest,
    ResearchOpportunity,
    Tag,
    Bookmark,
    Notification,
    OutboxEvent,
    AuditLog,
    AcademicPost,
    Comment,
    PostReaction,
    ScholarConnection,
    ScholarFollow,
    GroupProject,
    ProjectMember,
    ProjectActivityLog,
    ResearchContribution,
  ];

  // PgBouncer pool sizing (50 clients per pod, sustaining 5,000+ cluster connections)
  const poolExtra: Record<string, any> = {
    max: parseInt(process.env.DB_POOL_MAX || '50', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
  if (isSsl) {
    poolExtra.ssl = sslOption;
  }

  const dbLogging: boolean | ('error' | 'warn' | 'migration' | 'schema')[] =
    process.env.DB_LOGGING === 'true'
      ? true
      : (!isProd ? ['error', 'warn', 'migration', 'schema'] : false);

  const shouldSynchronize =
    process.env.DB_SYNCHRONIZE === 'true' ||
    (!isProd && process.env.DB_SYNCHRONIZE !== 'false');

  // Master-Replica splitting when replica host is configured
  if (replicaHost && replicaHost !== masterHost) {
    return {
      type: 'postgres',
      replication: {
        master: {
          host: masterHost,
          port,
          username,
          password,
          database,
          ssl: isSsl ? sslOption : undefined,
        },
        slaves: [
          {
            host: replicaHost,
            port: replicaPort,
            username: process.env.POSTGRES_REPLICA_USER || username,
            password: process.env.POSTGRES_REPLICA_PASSWORD || password,
            database,
            ssl: isSsl ? sslOption : undefined,
          },
        ],
      },
      entities,
      synchronize: false,
      logging: dbLogging,
      extra: poolExtra,
      retryAttempts: 3,
      retryDelay: 1000,
      ssl: isSsl ? sslOption : undefined,
    };
  }

  // Single-node Master default with PgBouncer connection pooling
  return {
    type: 'postgres',
    host: masterHost,
    port,
    username,
    password,
    database,
    entities,
    synchronize: shouldSynchronize,
    logging: dbLogging,
    extra: poolExtra,
    retryAttempts: 2,
    retryDelay: 1000,
    ssl: isSsl ? sslOption : undefined,
  };
};
