import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type ExpenseStatus = 'PENDING_APPROVAL' | 'COMMITTED' | 'APPROVED_PAID' | 'REJECTED';

@Entity('expense_requests')
export class ExpenseRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'funding_account_id', type: 'uuid' })
  fundingAccountId: string;

  @Column({ name: 'budget_line_item_id', type: 'uuid', nullable: true })
  budgetLineItemId?: string | null;

  @Index()
  @Column({ name: 'department_id', type: 'uuid', nullable: true })
  departmentId?: string | null;

  @Column({ name: 'project_id', type: 'uuid', nullable: true })
  projectId?: string | null;

  @Index()
  @Column({ name: 'requester_id', type: 'uuid' })
  requesterId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'vendor_name', type: 'varchar', length: 255, nullable: true })
  vendorName?: string;

  @Column({ name: 'invoice_ref', type: 'varchar', length: 255, nullable: true })
  invoiceRef?: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', length: 30, default: 'COMMITTED' })
  status: ExpenseStatus;

  @Column({ name: 'approved_by_id', type: 'uuid', nullable: true })
  approvedById?: string | null;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt?: Date | null;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
