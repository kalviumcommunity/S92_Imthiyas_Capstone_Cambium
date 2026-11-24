import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('proposal_revisions')
export class ProposalRevision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'proposal_id', type: 'uuid' })
  proposalId: string;

  @Column({ type: 'int' })
  version: number;

  @Column({ name: 'edited_by_id', type: 'uuid' })
  editedById: string;

  @Column({ name: 'summary_of_changes', type: 'varchar', length: 500 })
  summaryOfChanges: string;

  @Column({ type: 'jsonb', default: {} })
  snapshot: Record<string, any>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
