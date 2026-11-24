import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProjectMilestone } from './entities/project-milestone.entity';
import { ProjectRisk } from './entities/project-risk.entity';
import { ComplianceProtocol } from './entities/compliance-protocol.entity';
import {
  CreateMilestoneDto,
  CreateComplianceProtocolDto,
  ReviewComplianceProtocolDto,
} from './dto/institution.dto';
import { OutboxService } from '../../common/outbox/outbox.service';
import { assertTenantRecordAccess, isInstitutionWideRole } from './institution-access.util';
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ExecutionComplianceService {
  constructor(
    @InjectRepository(ProjectMilestone)
    private readonly milestoneRepo: Repository<ProjectMilestone>,
    @InjectRepository(ProjectRisk)
    private readonly riskRepo: Repository<ProjectRisk>,
    @InjectRepository(ComplianceProtocol)
    private readonly protocolRepo: Repository<ComplianceProtocol>,
    @Optional() private readonly outboxService?: OutboxService,
    @Optional() private readonly dataSource?: DataSource,
  ) {}

  async listMilestones(projectId?: string, user?: AuthenticatedUser) {
    const qb = this.milestoneRepo.createQueryBuilder('m').orderBy('m.dueDate', 'ASC');
    if (projectId) {
      qb.andWhere('m.project_id = :projectId', { projectId });
    } else if (user && !isInstitutionWideRole(user.role)) {
      if (user.role === UserRole.DEPARTMENT_HEAD && user.departmentId) {
        qb.andWhere('m.department_id = :deptId', { deptId: user.departmentId });
      } else {
        qb.andWhere('m.owner_id = :uid', { uid: user.id });
      }
    }
    const data = await qb.getMany();
    return { success: true, count: data.length, data };
  }

  async createMilestone(user: AuthenticatedUser, dto: CreateMilestoneDto) {
    const milestone = await this.milestoneRepo.save(
      this.milestoneRepo.create({
        projectId: dto.projectId,
        departmentId: user.departmentId || null,
        ownerId: user.id,
        title: dto.title,
        deliverable: dto.deliverable || '',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        status: dto.status || 'PLANNED',
        progressPercent: dto.progressPercent ?? 0,
      }),
    );

    await this.outboxService?.emit('project_milestones', milestone.id, 'MILESTONE_CREATED', {
      projectId: milestone.projectId,
      room: `workspace:${milestone.projectId}`,
      milestoneId: milestone.id,
      userId: user.id,
    });

    return { success: true, data: milestone };
  }

  async completeMilestone(id: string, user: AuthenticatedUser) {
    const milestone = await this.milestoneRepo.findOne({ where: { id } });
    if (!milestone) throw new NotFoundException(`Milestone ${id} not found.`);

    assertTenantRecordAccess(
      user,
      { departmentId: milestone.departmentId, ownerUserId: milestone.ownerId },
      'project milestone',
    );

    milestone.status = 'COMPLETED';
    milestone.progressPercent = 100;
    milestone.approvedById = user.id;
    milestone.approvedAt = new Date();
    const saved = await this.milestoneRepo.save(milestone);

    await this.outboxService?.emit('project_milestones', saved.id, 'MILESTONE_COMPLETED', {
      projectId: saved.projectId,
      room: `workspace:${saved.projectId}`,
      milestoneId: saved.id,
      userId: saved.ownerId,
    });

    return { success: true, data: saved };
  }

  async listRisks(projectId: string) {
    const data = await this.riskRepo.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });
    return { success: true, count: data.length, data };
  }

  async createRisk(
    user: AuthenticatedUser,
    body: { projectId: string; title: string; severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; mitigationPlan?: string },
  ) {
    const risk = await this.riskRepo.save(
      this.riskRepo.create({
        projectId: body.projectId,
        ownerId: user.id,
        title: body.title,
        severity: body.severity || 'MEDIUM',
        mitigationPlan: body.mitigationPlan || '',
        status: 'OPEN',
      }),
    );
    return { success: true, data: risk };
  }

  async listComplianceProtocols(user: AuthenticatedUser) {
    const qb = this.protocolRepo.createQueryBuilder('cp').orderBy('cp.updatedAt', 'DESC');
    if (user.organizationId) {
      qb.andWhere('(cp.organization_id = :orgId OR cp.organization_id IS NULL)', {
        orgId: user.organizationId,
      });
    }
    if (!isInstitutionWideRole(user.role)) {
      if (user.role === UserRole.DEPARTMENT_HEAD && user.departmentId) {
        qb.andWhere('cp.department_id = :deptId', { deptId: user.departmentId });
      } else {
        qb.andWhere('cp.pi_user_id = :uid', { uid: user.id });
      }
    }
    const data = await qb.getMany();
    return { success: true, count: data.length, data };
  }

  async submitComplianceProtocol(user: AuthenticatedUser, dto: CreateComplianceProtocolDto) {
    const protocol = await this.protocolRepo.save(
      this.protocolRepo.create({
        organizationId: user.organizationId || null,
        departmentId: dto.departmentId || user.departmentId || null,
        projectId: dto.projectId || null,
        piUserId: user.id,
        protocolNumber: dto.protocolNumber,
        committeeType: dto.committeeType || 'IRB',
        title: dto.title,
        boardName: dto.boardName,
        riskCategory: dto.riskCategory || 'Expedited',
        // Non-negotiable: Cambium tracks evidence & submissions; never auto-declares approved
        status: 'SUBMITTED',
        expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : null,
        participatingSitesCount: dto.participatingSitesCount ?? 1,
        evidenceUrl: dto.evidenceUrl || null,
      }),
    );

    await this.outboxService?.emit('compliance_protocols', protocol.id, 'COMPLIANCE_SUBMITTED', {
      protocolId: protocol.id,
      protocolNumber: protocol.protocolNumber,
      userId: user.id,
    });

    return { success: true, message: 'Protocol submitted for institutional committee review.', data: protocol };
  }

  async reviewComplianceProtocol(
    id: string,
    officer: AuthenticatedUser,
    dto: ReviewComplianceProtocolDto,
  ) {
    const reviewers = new Set<string>([
      UserRole.SUPER_ADMIN,
      UserRole.COMPLIANCE_OFFICER,
      UserRole.RD_DIRECTOR,
      UserRole.UNIVERSITY_LEADERSHIP,
    ]);
    if (!officer.role || !reviewers.has(officer.role)) {
      throw new ForbiddenException('Only Compliance Officers or R&D Directors can finalize ethics protocol determinations.');
    }

    const protocol = await this.protocolRepo.findOne({ where: { id } });
    if (!protocol) throw new NotFoundException(`Compliance protocol ${id} not found.`);

    protocol.status = dto.status;
    protocol.reviewedById = officer.id;
    protocol.reviewedAt = new Date();
    protocol.reviewNotes = dto.reviewNotes || null;

    const saved = await this.protocolRepo.save(protocol);

    await this.outboxService?.emit('compliance_protocols', saved.id, 'COMPLIANCE_REVIEWED', {
      protocolId: saved.id,
      status: saved.status,
      userId: saved.piUserId,
    });

    return { success: true, data: saved };
  }
}
