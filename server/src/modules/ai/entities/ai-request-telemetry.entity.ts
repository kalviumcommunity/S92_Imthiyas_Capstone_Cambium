import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('ai_request_telemetry')
export class AiRequestTelemetry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'request_id', type: 'varchar', length: 64 })
  requestId: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string | null;

  @Column({ name: 'task_type', type: 'varchar', length: 50 })
  taskType: string;

  @Column({ name: 'model_used', type: 'varchar', length: 80 })
  modelUsed: string;

  @Column({ name: 'prompt_version', type: 'varchar', length: 60, nullable: true })
  promptVersion?: string | null;

  @Column({ name: 'estimated_input_tokens', type: 'int', default: 0 })
  estimatedInputTokens: number;

  @Column({ name: 'estimated_output_tokens', type: 'int', default: 0 })
  estimatedOutputTokens: number;

  @Column({ name: 'estimated_cost_usd', type: 'decimal', precision: 10, scale: 6, default: 0 })
  estimatedCostUsd: number;

  @Column({ name: 'latency_ms', type: 'int', default: 0 })
  latencyMs: number;

  @Column({ name: 'retrieved_count', type: 'int', default: 0 })
  retrievedCount: number;

  @Column({ type: 'boolean', default: false })
  abstained: boolean;

  @Column({ type: 'varchar', length: 30, default: 'OK' })
  status: string;

  @Column({ name: 'error_code', type: 'varchar', length: 50, nullable: true })
  errorCode?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
