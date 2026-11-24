import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type ReviewStage = 'SUPERVISOR' | 'INTERNAL' | 'EXTERNAL';
export type ReviewDecision = 'APPROVED' | 'REVISION_REQUESTED' | 'REJECTED';

@Entity('proposal_reviews')
export class ProposalReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'proposal_id', type: 'uuid' })
  proposalId: string;

  @Index()
  @Column({ name: 'reviewer_id', type: 'uuid' })
  reviewerId: string;

  @Column({ type: 'varchar', length: 40 })
  stage: ReviewStage;

  @Column({ type: 'varchar', length: 40 })
  decision: ReviewDecision;

  @Column({ name: 'rubric_score', type: 'int', nullable: true })
  rubricScore?: number;

  @Column({ type: 'text' })
  comments: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
