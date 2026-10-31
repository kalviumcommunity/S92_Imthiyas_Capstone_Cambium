import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { GroupProject } from './group-project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('project_activity_logs')
export class ProjectActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @ManyToOne(() => GroupProject, (p) => p.activityLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: GroupProject;

  @Index()
  @Column({ name: 'actor_id', type: 'uuid' })
  actorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'actor_id' })
  actor: User;

  @Column({ type: 'varchar', length: 100 })
  action: string; // e.g. "INVITED_MEMBER", "LINKED_DOI", "UPDATED_DRAFT", "UPLOADED_PROPOSAL"

  @Column({ type: 'text' })
  details: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
