import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('client_error_events')
export class ClientErrorEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 120 })
  route: string;

  @Column({ name: 'error_name', type: 'varchar', length: 80 })
  errorName: string;

  @Column({ name: 'error_digest', type: 'varchar', length: 64, nullable: true })
  errorDigest?: string | null;

  @Column({ name: 'sanitized_message', type: 'varchar', length: 240 })
  sanitizedMessage: string;

  @CreateDateColumn({ name: 'occurred_at', type: 'timestamptz' })
  occurredAt: Date;
}
