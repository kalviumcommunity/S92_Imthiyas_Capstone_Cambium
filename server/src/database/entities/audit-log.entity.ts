import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'COMPLIANCE_VERIFY';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'entity_name', type: 'varchar', length: 100 })
  entityName: string;

  @Index()
  @Column({ name: 'entity_id', type: 'varchar', length: 100 })
  entityId: string;

  @Column({ type: 'varchar', length: 50 })
  action: AuditAction;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'jsonb', default: {} })
  payload: Record<string, any>;

  @Column({ name: 'previous_hash', type: 'varchar', length: 64 })
  previousHash: string;

  /**
   * Cryptographic SHA-256 chain receipt:
   * H_n = SHA256(H_n-1 || JSON(payload) || timestamp)
   */
  @Index()
  @Column({ name: 'current_hash', type: 'varchar', length: 64 })
  currentHash: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
