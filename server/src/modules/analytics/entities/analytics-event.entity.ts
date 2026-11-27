import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type AnalyticsActorKind = 'HUMAN' | 'SYSTEM' | 'TEST';
export type AnalyticsEventSource = 'backend' | 'client';
export type AnalyticsOutcome = 'SUCCESS' | 'FAILURE';

@Entity('analytics_events')
export class AnalyticsEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'event_name', type: 'varchar', length: 80 })
  eventName: string;

  @Column({ name: 'schema_version', type: 'varchar', length: 16, default: '1.0.0' })
  schemaVersion: string;

  @Index({ unique: true, where: 'idempotency_key IS NOT NULL' })
  @Column({ name: 'idempotency_key', type: 'varchar', length: 160, nullable: true })
  idempotencyKey?: string | null;

  @Index()
  @Column({ name: 'actor_id', type: 'uuid', nullable: true })
  actorId?: string | null;

  @Column({ name: 'actor_kind', type: 'varchar', length: 16, default: 'HUMAN' })
  actorKind: AnalyticsActorKind;

  @Index()
  @Column({ name: 'organization_id', type: 'uuid', nullable: true })
  organizationId?: string | null;

  @Index()
  @Column({ name: 'workspace_id', type: 'uuid', nullable: true })
  workspaceId?: string | null;

  @Column({ type: 'varchar', length: 16, default: 'backend' })
  source: AnalyticsEventSource;

  @Column({ type: 'varchar', length: 16, default: 'SUCCESS' })
  outcome: AnalyticsOutcome;

  @Column({ type: 'jsonb', default: {} })
  properties: Record<string, any>;

  @Index()
  @Column({ name: 'occurred_at', type: 'timestamptz' })
  occurredAt: Date;

  @CreateDateColumn({ name: 'ingested_at', type: 'timestamptz' })
  ingestedAt: Date;
}
