import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('research_interests')
export class ResearchInterest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @ManyToMany(() => User, (user) => user.researchInterests)
  users: User[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
