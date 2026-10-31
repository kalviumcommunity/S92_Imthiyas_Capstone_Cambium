import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { PostReaction } from './post-reaction.entity';

export enum AcademicPostType {
  COLLABORATION_CALL = 'collaboration_call',
  PAPER_RELEASE = 'paper_release',
  GRANT_CONSORTIUM = 'grant_consortium',
  SCIENTIFIC_INQUIRY = 'scientific_inquiry',
}

@Entity('academic_posts')
export class AcademicPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({
    type: 'varchar',
    length: 50,
    default: AcademicPostType.SCIENTIFIC_INQUIRY,
  })
  type: AcademicPostType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ name: 'doi_reference', type: 'varchar', length: 255, nullable: true })
  doiReference?: string;

  @Column({ name: 'opportunity_id', type: 'uuid', nullable: true })
  opportunityId?: string;

  @Column({ name: 'collaboration_metadata', type: 'jsonb', default: {} })
  collaborationMetadata: {
    lookingFor?: string;
    preferredSkills?: string[];
    targetDeadline?: string;
    fundingAmount?: string;
  };

  @Column({ type: 'jsonb', default: { comments: 0, saves: 0, shares: 0, likes: 0 } })
  metrics: {
    comments: number;
    saves: number;
    shares: number;
    likes: number;
  };

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostReaction, (reaction) => reaction.post)
  reactions: PostReaction[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
