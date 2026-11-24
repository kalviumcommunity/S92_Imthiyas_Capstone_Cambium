import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type BudgetCategory =
  | 'Equipment'
  | 'Research Materials'
  | 'Software & Infrastructure'
  | 'Research Assistance'
  | 'Travel & Publication'
  | 'Contingency';

@Entity('budget_line_items')
export class BudgetLineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'funding_account_id', type: 'uuid' })
  fundingAccountId: string;

  @Column({ type: 'varchar', length: 80 })
  category: BudgetCategory | string;

  @Column({ name: 'allocated_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
  allocatedAmount: string;

  @Column({ name: 'committed_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
  committedAmount: string;

  @Column({ name: 'spent_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
  spentAmount: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
