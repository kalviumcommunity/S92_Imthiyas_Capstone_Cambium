import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tag } from './tag.entity';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { pgvectorTransformer } from '../../../common/transformers/pgvector.transformer';

export enum OpportunityType {
  GRANT = 'Grant',
  CFP = 'CFP',
  JOURNAL = 'Journal',
  PAPER = 'Paper',
}

@Entity('research_opportunities')
export class ResearchOpportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Index()
  @Column({
    type: 'enum',
    enum: OpportunityType,
  })
  type: OpportunityType;

  @Column({ type: 'varchar', length: 255 })
  organization: string;

  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  deadline?: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  link?: string;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById?: string;

  @ManyToOne(() => User, (user) => user.createdOpportunities, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy?: User;

  @ManyToMany(() => Tag, (tag) => tag.opportunities, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'opportunity_tags',
    joinColumn: { name: 'opportunity_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  /**
   * pgvector column for AI semantic embeddings (1536 dimensions for OpenAI / AI service).
   * Supports cosine distance (<=>) and L2 distance (<->) queries in PostgreSQL.
   */
  @Column({
    type: 'text',
    nullable: true,
    transformer: pgvectorTransformer,
  })
  embedding?: number[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.opportunity)
  bookmarks: Bookmark[];

  @OneToMany(() => Notification, (notification) => notification.opportunity)
  notifications: Notification[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
