import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type AiOutcome = 'SUCCESS' | 'FAILURE' | 'FALLBACK';

@Entity('ai_telemetry_events')
export class AiTelemetryEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'request_id', type: 'varchar', length: 64 })
  requestId: string;

  @Index()
  @Column({ name: 'actor_id', type: 'uuid', nullable: true })
  actorId?: string | null;

  @Column({ type: 'varchar', length: 32 })
  provider: string;

  @Column({ type: 'varchar', length: 64 })
  model: string;

  @Column({ name: 'request_type', type: 'varchar', length: 32 })
  requestType: string;

  @Column({ name: 'input_tokens_est', type: 'int', default: 0 })
  inputTokensEst: number;

  @Column({ name: 'output_tokens_est', type: 'int', default: 0 })
  outputTokensEst: number;

  @Column({ name: 'estimated_cost_usd', type: 'double precision', default: 0 })
  estimatedCostUsd: number;

  @Column({ name: 'latency_ms', type: 'int', default: 0 })
  latencyMs: number;

  @Column({ name: 'retrieval_duration_ms', type: 'int', default: 0 })
  retrievalDurationMs: number;

  @Column({ name: 'chunks_retrieved', type: 'int', default: 0 })
  chunksRetrieved: number;

  @Column({ name: 'citation_count', type: 'int', default: 0 })
  citationCount: number;

  @Column({ name: 'tool_success_count', type: 'int', default: 0 })
  toolSuccessCount: number;

  @Column({ name: 'tool_failure_count', type: 'int', default: 0 })
  toolFailureCount: number;

  @Column({ type: 'varchar', length: 16, default: 'SUCCESS' })
  outcome: AiOutcome;

  @Column({ name: 'failure_category', type: 'varchar', length: 64, nullable: true })
  failureCategory?: string | null;

  @Column({ name: 'ai_privacy_mode', type: 'varchar', length: 64, default: 'local_only' })
  aiPrivacyMode: string;

  @CreateDateColumn({ name: 'recorded_at', type: 'timestamptz' })
  recordedAt: Date;
}
