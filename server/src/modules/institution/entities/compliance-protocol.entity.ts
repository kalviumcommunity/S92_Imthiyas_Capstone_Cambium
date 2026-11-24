import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type CommitteeType = 'IRB' | 'IAEC' | 'BIOSAFETY' | 'DMP' | 'COI';
export type RiskCategory = 'Exempt' | 'Expedited' | 'Full Board Review';
export type ProtocolStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'AMENDMENT_REQUIRED'
  | 'EXPIRED'
  | 'REJECTED';

@Entity('compliance_protocols')
export class ComplianceProtocol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'organization_id', type: 'uuid', nullable: true })
  organizationId?: string | null;

  @Index()
  @Column({ name: 'department_id', type: 'uuid', nullable: true })
  departmentId?: string | null;

  @Index()
  @Column({ name: 'project_id', type: 'uuid', nullable: true })
  projectId?: string | null;

  @Index()
  @Column({ name: 'pi_user_id', type: 'uuid' })
  piUserId: string;

  @Index({ unique: true })
  @Column({ name: 'protocol_number', type: 'varchar', length: 80, unique: true })
  protocolNumber: string;

  @Column({ name: 'committee_type', type: 'varchar', length: 30, default: 'IRB' })
  committeeType: CommitteeType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'board_name', type: 'varchar', length: 255 })
  boardName: string;

  @Column({ name: 'risk_category', type: 'varchar', length: 40, default: 'Expedited' })
  riskCategory: RiskCategory;

  @Column({ type: 'varchar', length: 40, default: 'SUBMITTED' })
  status: ProtocolStatus;

  @Column({ name: 'expiration_date', type: 'timestamptz', nullable: true })
  expirationDate?: Date | null;

  @Column({ name: 'participating_sites_count', type: 'int', default: 1 })
  participatingSitesCount: number;

  @Column({ name: 'evidence_url', type: 'varchar', length: 1000, nullable: true })
  evidenceUrl?: string | null;

  @Column({ name: 'reviewed_by_id', type: 'uuid', nullable: true })
  reviewedById?: string | null;

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt?: Date | null;

  @Column({ name: 'review_notes', type: 'text', nullable: true })
  reviewNotes?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
