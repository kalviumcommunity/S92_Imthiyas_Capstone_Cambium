import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum ConsentPurpose {
  ESSENTIAL_AUTH = 'ESSENTIAL_AUTH',
  OPTIONAL_ANALYTICS = 'OPTIONAL_ANALYTICS',
  AI_RESEARCH_ASSISTANT = 'AI_RESEARCH_ASSISTANT',
  EMAIL_NOTIFICATIONS = 'EMAIL_NOTIFICATIONS',
}

export enum ConsentAction {
  GRANTED = 'GRANTED',
  WITHDRAWN = 'WITHDRAWN',
}

@Entity('consent_records')
export class ConsentRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 64 })
  purpose: ConsentPurpose;

  @Column({ type: 'varchar', length: 32 })
  action: ConsentAction;

  @Column({ name: 'notice_version', type: 'varchar', length: 32 })
  noticeVersion: string;

  @Column({ name: 'notice_language', type: 'varchar', length: 16, default: 'en' })
  noticeLanguage: string;

  @Column({ name: 'source_interface', type: 'varchar', length: 64, default: 'settings_privacy' })
  sourceInterface: string;

  @CreateDateColumn({ name: 'recorded_at', type: 'timestamptz' })
  recordedAt: Date;
}
