import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ResearchOpportunity } from '../../opportunities/entities/research-opportunity.entity';

export type NotificationType =
  | 'WORKSPACE_INVITE'
  | 'COMMENT'
  | 'MENTION'
  | 'TASK_ASSIGNED'
  | 'OPPORTUNITY_MATCH'
  | 'APPROVAL'
  | 'SYSTEM';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'opportunity_id', type: 'uuid', nullable: true })
  opportunityId?: string;

  @ManyToOne(() => ResearchOpportunity, (opp) => opp.notifications, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'opportunity_id' })
  opportunity?: ResearchOpportunity;

  @Column({ type: 'varchar', length: 50, default: 'SYSTEM' })
  type: NotificationType | string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ name: 'project_id', type: 'uuid', nullable: true })
  projectId?: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  link?: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt?: Date | null;

  @Index({ unique: true, where: 'dedup_key IS NOT NULL' })
  @Column({ name: 'dedup_key', type: 'varchar', length: 160, nullable: true })
  dedupKey?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
