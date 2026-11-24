import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';

export type FinancialState = 'REQUESTED' | 'APPROVED' | 'SANCTIONED' | 'RECEIVED' | 'CLOSED';

@Entity('funding_accounts')
export class FundingAccount {
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

  @Column({ name: 'proposal_id', type: 'uuid', nullable: true })
  proposalId?: string | null;

  @Index()
  @Column({ name: 'pi_user_id', type: 'uuid' })
  piUserId: string;

  @Index({ unique: true })
  @Column({ name: 'grant_number', type: 'varchar', length: 120, unique: true })
  grantNumber: string;

  @Column({ name: 'funder_name', type: 'varchar', length: 255 })
  funderName: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ name: 'financial_state', type: 'varchar', length: 30, default: 'SANCTIONED' })
  financialState: FinancialState;

  @Column({ name: 'requested_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
  requestedAmount: string;

  @Column({ name: 'approved_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
  approvedAmount: string;

  @Column({ name: 'sanctioned_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
  sanctionedAmount: string;

  @Column({ name: 'received_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
  receivedAmount: string;

  @Column({ name: 'committed_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
  committedAmount: string;

  @Column({ name: 'spent_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
  spentAmount: string;

  @Column({ name: 'fiscal_year', type: 'varchar', length: 20, default: '2026-27' })
  fiscalYear: string;

  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt?: Date | null;

  @VersionColumn({ name: 'version', default: 1 })
  version: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
