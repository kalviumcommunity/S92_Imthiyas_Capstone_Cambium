import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { pgvectorTransformer } from '../../../common/transformers/pgvector.transformer';

export type DocumentVisibility = 'PRIVATE' | 'WORKSPACE' | 'ORGANIZATION' | 'PUBLIC';

@Entity('document_chunks')
@Index(['documentId', 'chunkIndex'], { unique: true })
export class DocumentChunk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'document_id', type: 'varchar', length: 120 })
  documentId: string;

  @Index()
  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @Index()
  @Column({ name: 'workspace_id', type: 'uuid', nullable: true })
  workspaceId?: string | null;

  @Index()
  @Column({ name: 'organization_id', type: 'uuid', nullable: true })
  organizationId?: string | null;

  @Column({ type: 'varchar', length: 20, default: 'PRIVATE' })
  visibility: DocumentVisibility;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'section_header', type: 'varchar', length: 160, default: 'General' })
  sectionHeader: string;

  @Column({ name: 'page_number', type: 'int', default: 1 })
  pageNumber: number;

  @Column({ name: 'chunk_index', type: 'int' })
  chunkIndex: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'content_hash', type: 'varchar', length: 64 })
  contentHash: string;

  @Column({
    type: 'text',
    nullable: true,
    transformer: pgvectorTransformer,
  })
  embedding?: number[];

  @Column({ name: 'embedding_model', type: 'varchar', length: 80, default: 'gemini-embedding-001' })
  embeddingModel: string;

  @Column({ name: 'embedding_version', type: 'varchar', length: 40, default: 'v1-768d' })
  embeddingVersion: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
