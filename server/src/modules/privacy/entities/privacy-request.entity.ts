import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum PrivacyRequestType {
  ACCESS = 'ACCESS',
  CORRECTION = 'CORRECTION',
  ERASURE = 'ERASURE',
  EXPORT = 'EXPORT',
  WITHDRAWAL = 'WITHDRAWAL',
  GRIEVANCE = 'GRIEVANCE',
}

export enum PrivacyRequestStatus {
  REQUESTED = 'REQUESTED',
  IDENTITY_VERIFIED = 'IDENTITY_VERIFIED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  DELETION_IN_PROGRESS = 'DELETION_IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PARTIALLY_COMPLETED = 'PARTIALLY_COMPLETED',
  REJECTED_WITH_REASON = 'REJECTED_WITH_REASON',
}

@Entity('privacy_requests')
export class PrivacyRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'request_type', type: 'varchar', length: 32 })
  requestType: PrivacyRequestType;

  @Column({ type: 'varchar', length: 40, default: PrivacyRequestStatus.REQUESTED })
  status: PrivacyRequestStatus;

  @Column({ type: 'text', nullable: true })
  details?: string | null;

  @Column({ name: 'resolution_summary', type: 'text', nullable: true })
  resolutionSummary?: string | null;

  @Column({ name: 'retention_exception_reason', type: 'text', nullable: true })
  retentionExceptionReason?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
