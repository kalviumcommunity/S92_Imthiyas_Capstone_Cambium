import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { AcademicPost } from './academic-post.entity';
import { User } from '../../users/entities/user.entity';

@Entity('post_reactions')
@Unique(['postId', 'userId', 'type'])
export class PostReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @ManyToOne(() => AcademicPost, (post) => post.reactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: AcademicPost;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50, default: 'like' })
  type: string; // like | endorse | save | cite

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
