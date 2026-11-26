import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('ai_messages')
export class AiMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'conversation_id', type: 'uuid' })
  conversationId: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 20 })
  role: 'user' | 'assistant' | 'system';

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  citations: Array<Record<string, any>>;

  @Column({ name: 'prompt_version', type: 'varchar', length: 60, nullable: true })
  promptVersion?: string | null;

  @Column({ name: 'model_used', type: 'varchar', length: 80, nullable: true })
  modelUsed?: string | null;

  @Column({ type: 'boolean', default: false })
  abstained: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
