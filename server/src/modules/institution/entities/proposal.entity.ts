import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';

export type ProposalStatus =
  | 'DRAFTING'
  | 'SUPERVISOR_REVIEW'
  | 'INTERNAL_REVIEW'
  | 'EXTERNAL_REVIEW'
  | 'REVISION_REQUESTED'
  | 'APPROVED'
  | 'SUBMITTED'
  | 'REJECTED';

@Entity('proposals')
export class Proposal {
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

  @Column({ name: 'opportunity_id', type: 'uuid', nullable: true })
  opportunityId?: string | null;

  @Index()
  @Column({ name: 'lead_user_id', type: 'uuid' })
  leadUserId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  funder?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  program?: string;

  @Column({ name: 'requested_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
  requestedAmount: string;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'timestamptz', nullable: true })
  deadline?: Date | null;

  @Column({ type: 'varchar', length: 40, default: 'DRAFTING' })
  status: ProposalStatus;

  @Column({ type: 'text', default: '' })
  aims: string;

  @Column({ type: 'text', default: '' })
  significance: string;

  @Column({ type: 'text', default: '' })
  methodology: string;

  @Column({ name: 'timeline_summary', type: 'text', default: '' })
  timelineSummary: string;

  @Column({ name: 'budget_breakdown_text', type: 'text', default: '' })
  budgetBreakdownText: string;

  @Column({ type: 'jsonb', default: [] })
  keywords: string[];

  @VersionColumn({ name: 'version', default: 1 })
  version: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
