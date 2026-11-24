import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 40 })
  code: string;

  @Column({ name: 'head_user_id', type: 'uuid', nullable: true })
  headUserId?: string;

  @Column({ name: 'annual_budget_cap', type: 'numeric', precision: 14, scale: 2, default: 0 })
  annualBudgetCap: string;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
