import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { ResearchInterest } from './research-interest.entity';
import { ResearchOpportunity } from '../../opportunities/entities/research-opportunity.entity';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';
import { Notification } from '../../notifications/entities/notification.entity';

export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  UNIVERSITY_LEADERSHIP = 'UniversityLeadership',
  RD_DIRECTOR = 'R&DDirector',
  FINANCE_OFFICER = 'FinanceOfficer',
  DEPARTMENT_HEAD = 'DepartmentHead',
  PI = 'PI',
  RESEARCHER = 'Researcher',
  FELLOW = 'Fellow',
  COMPLIANCE_OFFICER = 'ComplianceOfficer',
  EXTERNAL_REVIEWER = 'ExternalReviewer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
  passwordHash: string;

  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: UserRole.RESEARCHER,
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 255, nullable: true })
  institution?: string;

  @Index()
  @Column({ name: 'organization_id', type: 'uuid', nullable: true })
  organizationId?: string | null;

  @Index()
  @Column({ name: 'department_id', type: 'uuid', nullable: true })
  departmentId?: string | null;

  @ManyToMany(() => ResearchInterest, (interest) => interest.users, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'user_interests',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'interest_id', referencedColumnName: 'id' },
  })
  researchInterests: ResearchInterest[];

  @OneToMany(() => ResearchOpportunity, (opportunity) => opportunity.createdBy)
  createdOpportunities: ResearchOpportunity[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
