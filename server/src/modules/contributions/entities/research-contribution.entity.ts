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
import { GroupProject } from '../../projects/entities/group-project.entity';

export enum ContributionEventType {
  MANUSCRIPT_PUBLISHED = 'MANUSCRIPT_PUBLISHED',
  PREPRINT_RELEASE = 'PREPRINT_RELEASE',
  DATASET_RELEASE = 'DATASET_RELEASE',
  SOFTWARE_RELEASE = 'SOFTWARE_RELEASE',
  EXPERIMENT_MILESTONE = 'EXPERIMENT_MILESTONE',
  METHOD_STEP = 'METHOD_STEP',
  PEER_REVIEW_CONFIRMED = 'PEER_REVIEW_CONFIRMED',
  GRANT_AWARD = 'GRANT_AWARD',
  GRANT_SUBMISSION = 'GRANT_SUBMISSION',
  PROTOCOL_APPROVAL = 'PROTOCOL_APPROVAL',
}

export enum ContributionSource {
  CAMBIUM = 'CAMBIUM',
  ORCID = 'ORCID',
  GITHUB = 'GITHUB',
  MANUAL_CONFIRMED = 'MANUAL_CONFIRMED',
}

export enum ContributionVerificationStatus {
  VERIFIED = 'VERIFIED',
  CONFIRMED = 'CONFIRMED',
  UNVERIFIED = 'UNVERIFIED',
}

export enum ContributionVisibility {
  PUBLIC = 'PUBLIC',
  LAB_ONLY = 'LAB_ONLY',
  PRIVATE = 'PRIVATE',
}

@Entity('research_contributions')
@Index('idx_contrib_actor_date', ['actorId', 'occurredAt'])
@Index('idx_contrib_actor_type', ['actorId', 'eventType'])
@Index('idx_contrib_actor_output', ['actorId', 'outputRef'])
@Index('idx_contrib_actor_source_ext', ['actorId', 'source', 'externalId'], { unique: false })
export class ResearchContribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'actor_id', type: 'uuid' })
  actorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'actor_id' })
  actor: User;

  @Index()
  @Column({ name: 'project_id', type: 'uuid', nullable: true })
  projectId?: string;

  @ManyToOne(() => GroupProject, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'project_id' })
  project?: GroupProject;

  @Index()
  @Column({ name: 'output_ref', type: 'varchar', length: 255, nullable: true })
  outputRef?: string; // Stable work identifier (e.g. DOI, arXiv ID, or Zenodo accession) for distinct output calculation

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({
    name: 'event_type',
    type: 'varchar',
    length: 50,
  })
  eventType: ContributionEventType;

  @Column({
    name: 'occurred_at',
    type: 'timestamptz',
  })
  occurredAt: Date; // Timestamp stored in UTC

  @Column({
    type: 'varchar',
    length: 50,
    default: ContributionSource.CAMBIUM,
  })
  source: ContributionSource;

  @Column({ name: 'external_id', type: 'varchar', length: 255, nullable: true })
  externalId?: string; // Stable external source ID for idempotent upsert & deduplication

  @Column({ name: 'evidence_url', type: 'varchar', length: 1000, nullable: true })
  evidenceUrl?: string; // Verifiable link (DOI URL, repository release, signed protocol)

  @Column({
    name: 'verification_status',
    type: 'varchar',
    length: 50,
    default: ContributionVerificationStatus.VERIFIED,
  })
  verificationStatus: ContributionVerificationStatus;

  @Column({
    type: 'varchar',
    length: 50,
    default: ContributionVisibility.PUBLIC,
  })
  visibility: ContributionVisibility;

  @Column({ name: 'credit_roles', type: 'jsonb', nullable: true, default: [] })
  creditRoles?: string[]; // Standard 14-role CRediT taxonomy (descriptive role, not an event count)

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
