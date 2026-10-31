import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectActivityLog } from './project-activity-log.entity';

@Entity('group_projects')
export class GroupProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'PUBLIC' })
  visibility: string; // PUBLIC | LAB_ONLY | PRIVATE

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status: string; // ACTIVE | UNDER_REVIEW | SUBMITTED | ARCHIVED

  @Column({ name: 'target_grant_id', type: 'uuid', nullable: true })
  targetGrantId?: string;

  @Column({ name: 'linked_dois', type: 'jsonb', default: [] })
  linkedDois: string[];

  @OneToMany(() => ProjectMember, (member) => member.project, { cascade: true })
  members: ProjectMember[];

  @OneToMany(() => ProjectActivityLog, (log) => log.project, { cascade: true })
  activityLogs: ProjectActivityLog[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
