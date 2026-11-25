import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Proposal, ProposalStatus } from './entities/proposal.entity';
import { ProposalRevision } from './entities/proposal-revision.entity';
import { ProposalReview } from './entities/proposal-review.entity';
import { CreateProposalDto, UpdateProposalDto, CreateProposalReviewDto } from './dto/institution.dto';
import { OutboxService } from '../../common/outbox/outbox.service';
import { assertTenantRecordAccess, isInstitutionWideRole } from './institution-access.util';
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
    @InjectRepository(ProposalRevision)
    private readonly revisionRepo: Repository<ProposalRevision>,
    @InjectRepository(ProposalReview)
    private readonly reviewRepo: Repository<ProposalReview>,
    @Optional() private readonly outboxService?: OutboxService,
    @Optional() private readonly dataSource?: DataSource,
  ) {}

  async listProposals(user: AuthenticatedUser) {
    const qb = this.proposalRepo.createQueryBuilder('p').orderBy('p.updatedAt', 'DESC');

    if (user.organizationId) {
      qb.andWhere('(p.organization_id = :orgId OR p.organization_id IS NULL)', {
        orgId: user.organizationId,
      });
    }

    if (!isInstitutionWideRole(user.role)) {
      if (user.role === UserRole.DEPARTMENT_HEAD && user.departmentId) {
        qb.andWhere('p.department_id = :deptId', { deptId: user.departmentId });
      } else if (user.role !== UserRole.EXTERNAL_REVIEWER) {
        qb.andWhere('p.lead_user_id = :uid', { uid: user.id });
      }
    }

    const data = await qb.getMany();
    return { success: true, count: data.length, data };
  }

  async getProposalDetails(id: string, user: AuthenticatedUser) {
    const proposal = await this.proposalRepo.findOne({ where: { id } });
    if (!proposal) throw new NotFoundException(`Proposal ${id} not found.`);

    assertTenantRecordAccess(
      user,
      {
        organizationId: proposal.organizationId,
        departmentId: proposal.departmentId,
        ownerUserId: proposal.leadUserId,
      },
      'research proposal',
    );

    const [revisions, reviews] = await Promise.all([
      this.revisionRepo.find({ where: { proposalId: id }, order: { version: 'DESC' } }),
      this.reviewRepo.find({ where: { proposalId: id }, order: { createdAt: 'DESC' } }),
    ]);

    return {
      success: true,
      data: { ...proposal, revisions, reviews },
    };
  }

  async createProposal(user: AuthenticatedUser, dto: CreateProposalDto) {
    const execute = async (pRepo: Repository<Proposal>, revRepo: Repository<ProposalRevision>) => {
      const created = await pRepo.save(
        pRepo.create({
          organizationId: user.organizationId || null,
          departmentId: dto.departmentId || user.departmentId || null,
          projectId: dto.projectId || null,
          opportunityId: dto.opportunityId || null,
          leadUserId: user.id,
          title: dto.title,
          funder: dto.funder,
          program: dto.program,
          requestedAmount: String(dto.requestedAmount ?? 0),
          currency: dto.currency || 'INR',
          deadline: dto.deadline ? new Date(dto.deadline) : null,
          status: 'DRAFTING',
          aims: dto.aims || '',
          significance: dto.significance || '',
          methodology: dto.methodology || '',
          timelineSummary: dto.timelineSummary || '',
          budgetBreakdownText: dto.budgetBreakdownText || '',
          keywords: dto.keywords || [],
        }),
      );

      await revRepo.save(
        revRepo.create({
          proposalId: created.id,
          version: created.version || 1,
          editedById: user.id,
          summaryOfChanges: 'Initial proposal draft created',
          snapshot: {
            title: created.title,
            aims: created.aims,
            methodology: created.methodology,
            requestedAmount: created.requestedAmount,
          },
        }),
      );
      return created;
    };

    const proposal = this.dataSource
      ? await this.dataSource.transaction(async (m) => {
          const saved = await execute(m.getRepository(Proposal), m.getRepository(ProposalRevision));
          if (this.outboxService) {
            await this.outboxService.emitWithinTransaction(m, 'proposals', saved.id, 'PROPOSAL_CREATED', {
              proposalId: saved.id,
              userId: user.id,
              departmentId: saved.departmentId,
              title: saved.title,
            });
          }
          return saved;
        })
      : await execute(this.proposalRepo, this.revisionRepo);

    return { success: true, message: 'Proposal created.', data: proposal };
  }

  async updateProposal(id: string, user: AuthenticatedUser, dto: UpdateProposalDto) {
    const existing = await this.proposalRepo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException(`Proposal ${id} not found.`);

    assertTenantRecordAccess(
      user,
      {
        organizationId: existing.organizationId,
        departmentId: existing.departmentId,
        ownerUserId: existing.leadUserId,
      },
      'research proposal',
    );

    if (dto.version !== undefined && existing.version !== dto.version) {
      throw new ConflictException(
        `Proposal version conflict (server v${existing.version}, submitted v${dto.version}). Refresh before saving.`,
      );
    }

    if (dto.title !== undefined) existing.title = dto.title;
    if (dto.funder !== undefined) existing.funder = dto.funder;
    if (dto.program !== undefined) existing.program = dto.program;
    if (dto.requestedAmount !== undefined) existing.requestedAmount = String(dto.requestedAmount);
    if (dto.currency !== undefined) existing.currency = dto.currency;
    if (dto.deadline !== undefined) existing.deadline = dto.deadline ? new Date(dto.deadline) : null;
    if (dto.aims !== undefined) existing.aims = dto.aims;
    if (dto.significance !== undefined) existing.significance = dto.significance;
    if (dto.methodology !== undefined) existing.methodology = dto.methodology;
    if (dto.timelineSummary !== undefined) existing.timelineSummary = dto.timelineSummary;
    if (dto.budgetBreakdownText !== undefined) existing.budgetBreakdownText = dto.budgetBreakdownText;
    if (dto.keywords !== undefined) existing.keywords = dto.keywords;

    const executeSave = async (pRepo: Repository<Proposal>, revRepo: Repository<ProposalRevision>) => {
      const saved = await pRepo.save(existing);
      await revRepo.save(
        revRepo.create({
          proposalId: saved.id,
          version: saved.version,
          editedById: user.id,
          summaryOfChanges: dto.summaryOfChanges || `Saved revision v${saved.version}`,
          snapshot: {
            title: saved.title,
            aims: saved.aims,
            methodology: saved.methodology,
            requestedAmount: saved.requestedAmount,
          },
        }),
      );
      return saved;
    };

    const updated = this.dataSource
      ? await this.dataSource.transaction(async (m) => {
          const saved = await executeSave(m.getRepository(Proposal), m.getRepository(ProposalRevision));
          if (this.outboxService) {
            await this.outboxService.emitWithinTransaction(m, 'proposals', saved.id, 'PROPOSAL_UPDATED', {
              proposalId: saved.id,
              version: saved.version,
              userId: user.id,
            });
          }
          return saved;
        })
      : await executeSave(this.proposalRepo, this.revisionRepo);

    return { success: true, message: 'Proposal revision persisted.', data: updated };
  }

  async submitForReview(id: string, user: AuthenticatedUser, stage: ProposalStatus = 'SUPERVISOR_REVIEW') {
    const proposal = await this.proposalRepo.findOne({ where: { id } });
    if (!proposal) throw new NotFoundException(`Proposal ${id} not found.`);

    assertTenantRecordAccess(
      user,
      {
        organizationId: proposal.organizationId,
        departmentId: proposal.departmentId,
        ownerUserId: proposal.leadUserId,
      },
      'research proposal',
    );

    if (proposal.status !== 'DRAFTING' && proposal.status !== 'REVISION_REQUESTED') {
      throw new BadRequestException(
        `Invalid state transition: proposal in status ${proposal.status} cannot be submitted to ${stage}.`,
      );
    }

    if (stage !== 'SUPERVISOR_REVIEW' && stage !== 'INTERNAL_REVIEW') {
      throw new BadRequestException(`Unsupported review submission stage: ${stage}.`);
    }

    proposal.status = stage;
    const saved = await this.proposalRepo.save(proposal);
    await this.outboxService?.emit('proposals', saved.id, 'PROPOSAL_SUBMITTED_FOR_REVIEW', {
      proposalId: saved.id,
      status: saved.status,
      userId: saved.leadUserId,
    });

    return { success: true, message: `Proposal submitted to ${stage}.`, data: saved };
  }

  async recordReviewDecision(id: string, reviewer: AuthenticatedUser, dto: CreateProposalReviewDto) {
    const allowedReviewerRoles = new Set<string>([
      UserRole.SUPER_ADMIN,
      UserRole.UNIVERSITY_LEADERSHIP,
      UserRole.RD_DIRECTOR,
      UserRole.DEPARTMENT_HEAD,
      UserRole.PI,
      UserRole.EXTERNAL_REVIEWER,
      UserRole.COMPLIANCE_OFFICER,
    ]);
    if (!reviewer.role || !allowedReviewerRoles.has(reviewer.role)) {
      throw new ForbiddenException('Insufficient authority to record proposal review decisions.');
    }

    const proposal = await this.proposalRepo.findOne({ where: { id } });
    if (!proposal) throw new NotFoundException(`Proposal ${id} not found.`);

    if (
      proposal.status !== 'SUPERVISOR_REVIEW' &&
      proposal.status !== 'INTERNAL_REVIEW' &&
      proposal.status !== 'EXTERNAL_REVIEW'
    ) {
      throw new BadRequestException(
        `Cannot record review decision while proposal is in ${proposal.status} state.`,
      );
    }

    if (reviewer.role === UserRole.DEPARTMENT_HEAD) {
      assertTenantRecordAccess(
        reviewer,
        { organizationId: proposal.organizationId, departmentId: proposal.departmentId },
        'proposal review',
      );
    }

    const nextStatus: ProposalStatus =
      dto.decision === 'APPROVED'
        ? dto.stage === 'SUPERVISOR'
          ? 'INTERNAL_REVIEW'
          : 'APPROVED'
        : dto.decision === 'REVISION_REQUESTED'
        ? 'REVISION_REQUESTED'
        : 'REJECTED';

    const saveReview = async (
      pRepo: Repository<Proposal>,
      rRepo: Repository<ProposalReview>,
    ) => {
      proposal.status = nextStatus;
      const savedProp = await pRepo.save(proposal);
      const rev = await rRepo.save(
        rRepo.create({
          proposalId: id,
          reviewerId: reviewer.id,
          stage: dto.stage,
          decision: dto.decision,
          rubricScore: dto.rubricScore,
          comments: dto.comments,
        }),
      );
      return { proposal: savedProp, review: rev };
    };

    const result = this.dataSource
      ? await this.dataSource.transaction(async (m) => {
          const out = await saveReview(m.getRepository(Proposal), m.getRepository(ProposalReview));
          if (this.outboxService) {
            await this.outboxService.emitWithinTransaction(m, 'proposals', id, 'PROPOSAL_REVIEW_RECORDED', {
              proposalId: id,
              userId: proposal.leadUserId,
              stage: dto.stage,
              decision: dto.decision,
              status: nextStatus,
            });
          }
          return out;
        })
      : await saveReview(this.proposalRepo, this.reviewRepo);

    return { success: true, data: result };
  }
}
