import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { GroupProject } from './group-project.entity';
import { User } from '../../users/entities/user.entity';

export enum CRediTRole {
  LEAD_PI = 'Lead PI',
  CO_PI = 'Co-PI',
  CO_AUTHOR = 'Co-Author',
  DATA_ANALYST = 'Data Analyst / Statistician',
  PEER_REVIEWER = 'Internal Peer Reviewer',
  CONTRIBUTOR = 'Methodology Contributor',
}

@Entity('project_members')
@Unique(['projectId', 'userId'])
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @ManyToOne(() => GroupProject, (p) => p.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: GroupProject;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'varchar',
    length: 50,
    default: CRediTRole.CO_AUTHOR,
  })
  creditRole: CRediTRole;

  @Column({ type: 'varchar', length: 50, default: 'ACCEPTED' })
  status: string; // INVITED | ACCEPTED | DECLINED

  @CreateDateColumn({ name: 'joined_at', type: 'timestamptz' })
  joinedAt: Date;
}
