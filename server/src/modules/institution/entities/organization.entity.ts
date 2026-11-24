import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ name: 'short_code', type: 'varchar', length: 40, unique: true })
  shortCode: string;

  @Column({ name: 'ror_id', type: 'varchar', length: 64, nullable: true })
  rorId?: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  country?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
