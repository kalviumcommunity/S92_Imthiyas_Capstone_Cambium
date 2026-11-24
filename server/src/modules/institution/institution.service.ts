import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { Department } from './entities/department.entity';
import { Proposal } from './entities/proposal.entity';
import { FundingAccount } from './entities/funding-account.entity';
import { ProjectMilestone } from './entities/project-milestone.entity';
import { ComplianceProtocol } from './entities/compliance-protocol.entity';
import { GroupProject } from '../projects/entities/group-project.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateDepartmentDto } from './dto/institution.dto';
import { isInstitutionWideRole } from './institution-access.util';
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(Department)
    private readonly deptRepo: Repository<Department>,
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
    @InjectRepository(FundingAccount)
    private readonly fundingRepo: Repository<FundingAccount>,
    @InjectRepository(ProjectMilestone)
    private readonly milestoneRepo: Repository<ProjectMilestone>,
    @InjectRepository(ComplianceProtocol)
    private readonly protocolRepo: Repository<ComplianceProtocol>,
    @InjectRepository(GroupProject)
    private readonly projectRepo: Repository<GroupProject>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async listDepartments(user: AuthenticatedUser) {
    const where: any = {};
    if (user.organizationId) {
      where.organizationId = user.organizationId;
    }
    if (user.role === UserRole.DEPARTMENT_HEAD && user.departmentId) {
      where.id = user.departmentId;
    }
    const departments = await this.deptRepo.find({ where, order: { name: 'ASC' } });
    return { success: true, count: departments.length, data: departments };
  }

  async createDepartment(user: AuthenticatedUser, dto: CreateDepartmentDto) {
    if (
      ![UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_LEADERSHIP, UserRole.RD_DIRECTOR].includes(
        user.role as UserRole,
      )
    ) {
      throw new ForbiddenException('Only University Leadership or R&D Directors may register departments.');
    }

    let orgId = dto.organizationId || user.organizationId;
    if (!orgId) {
      let defaultOrg = await this.orgRepo.findOne({ where: { shortCode: 'AMET' } });
      if (!defaultOrg) {
        defaultOrg = await this.orgRepo.save(
          this.orgRepo.create({
            name: 'AMET University R&D and Innovation Centre',
            shortCode: 'AMET',
            city: 'Chennai',
            country: 'India',
          }),
        );
      }
      orgId = defaultOrg.id;
    }

    const dept = await this.deptRepo.save(
      this.deptRepo.create({
        organizationId: orgId,
        name: dto.name,
        code: dto.code.toUpperCase(),
        annualBudgetCap: String(dto.annualBudgetCap ?? 0),
        currency: dto.currency || 'INR',
      }),
    );

    return { success: true, data: dept };
  }

  /**
   * Executive Institutional Command Centre KPI summary.
   * Explicitly separates funding requested, approved, sanctioned, received, committed, spent, and available.
   */
  async getCommandCentreOverview(user: AuthenticatedUser) {
    const orgId = user.organizationId || null;
    const deptFilter =
      user.role === UserRole.DEPARTMENT_HEAD && user.departmentId ? user.departmentId : null;
    const ownerFilter = !isInstitutionWideRole(user.role) && !deptFilter ? user.id : null;

    const [departments, proposals, fundingAccounts, milestones, protocols, projects, usersCount] =
      await Promise.all([
        this.deptRepo.find({
          where: deptFilter ? { id: deptFilter } : orgId ? { organizationId: orgId } : {},
        }),
        this.proposalRepo.find({
          where: deptFilter
            ? { departmentId: deptFilter }
            : ownerFilter
            ? { leadUserId: ownerFilter }
            : orgId
            ? { organizationId: orgId }
            : {},
        }),
        this.fundingRepo.find({
          where: deptFilter
            ? { departmentId: deptFilter }
            : ownerFilter
            ? { piUserId: ownerFilter }
            : orgId
            ? { organizationId: orgId }
            : {},
        }),
        this.milestoneRepo.find({
          where: deptFilter
            ? { departmentId: deptFilter }
            : ownerFilter
            ? { ownerId: ownerFilter }
            : {},
        }),
        this.protocolRepo.find({
          where: deptFilter
            ? { departmentId: deptFilter }
            : ownerFilter
            ? { piUserId: ownerFilter }
            : orgId
            ? { organizationId: orgId }
            : {},
        }),
        this.projectRepo.find({ where: ownerFilter ? { ownerId: ownerFilter } : {} }),
        this.userRepo.count(),
      ]);

    const fundingTotals = fundingAccounts.reduce(
      (acc, fa) => {
        const req = Number(fa.requestedAmount || 0);
        const app = Number(fa.approvedAmount || 0);
        const sanc = Number(fa.sanctionedAmount || 0);
        const rec = Number(fa.receivedAmount || 0);
        const comm = Number(fa.committedAmount || 0);
        const spent = Number(fa.spentAmount || 0);
        acc.requestedAmount += req;
        acc.approvedAmount += app;
        acc.sanctionedAmount += sanc;
        acc.receivedAmount += rec;
        acc.committedAmount += comm;
        acc.spentAmount += spent;
        acc.availableAmount += Math.max(0, sanc - comm - spent);
        return acc;
      },
      {
        requestedAmount: 0,
        approvedAmount: 0,
        sanctionedAmount: 0,
        receivedAmount: 0,
        committedAmount: 0,
        spentAmount: 0,
        availableAmount: 0,
      },
    );

    const submittedProposals = proposals.filter((p) => p.status !== 'DRAFTING').length;
    const approvedProposals = proposals.filter(
      (p) => p.status === 'APPROVED' || p.status === 'SUBMITTED',
    ).length;
    const grantSuccessRate =
      submittedProposals > 0 ? Math.round((approvedProposals / submittedProposals) * 100) : 0;

    const now = Date.now();
    const delayedMilestones = milestones.filter(
      (m) => m.status !== 'COMPLETED' && m.dueDate && new Date(m.dueDate).getTime() < now,
    ).length;

    const departmentPerformance = departments.map((dept) => {
      const deptFunds = fundingAccounts.filter((f) => f.departmentId === dept.id);
      const sanctioned = deptFunds.reduce((s, f) => s + Number(f.sanctionedAmount || 0), 0);
      const spent = deptFunds.reduce((s, f) => s + Number(f.spentAmount || 0), 0);
      const deptProposals = proposals.filter((p) => p.departmentId === dept.id).length;
      const deptMilestones = milestones.filter((m) => m.departmentId === dept.id);
      return {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        currency: dept.currency,
        sanctionedAmount: sanctioned,
        spentAmount: spent,
        utilizationPercent: sanctioned > 0 ? Math.round((spent / sanctioned) * 100) : 0,
        proposalsCount: deptProposals,
        completedMilestones: deptMilestones.filter((m) => m.status === 'COMPLETED').length,
        totalMilestones: deptMilestones.length,
      };
    });

    return {
      success: true,
      generatedAt: new Date().toISOString(),
      scope: deptFilter ? 'DEPARTMENT' : ownerFilter ? 'INDIVIDUAL' : 'INSTITUTION',
      metrics: {
        activeProjects: projects.filter((p) => p.status === 'ACTIVE').length,
        totalProjects: projects.length,
        activeResearchers: usersCount,
        proposalsUnderReview: proposals.filter((p) =>
          ['SUPERVISOR_REVIEW', 'INTERNAL_REVIEW', 'EXTERNAL_REVIEW'].includes(p.status),
        ).length,
        totalProposals: proposals.length,
        grantSuccessRatePercent: grantSuccessRate,
        completedMilestones: milestones.filter((m) => m.status === 'COMPLETED').length,
        delayedOrAtRiskMilestones: delayedMilestones + milestones.filter((m) => m.status === 'AT_RISK').length,
        approvedProtocols: protocols.filter((c) => c.status === 'APPROVED').length,
        pendingProtocols: protocols.filter((c) => ['SUBMITTED', 'UNDER_REVIEW'].includes(c.status)).length,
      },
      financialGovernance: fundingTotals,
      departmentPerformance,
      kpiDefinitions: {
        grantSuccessRatePercent: 'approvedOrSubmittedProposals / nonDraftProposals * 100',
        availableAmount: 'SUM(MAX(0, sanctionedAmount - committedAmount - spentAmount))',
        utilizationPercent: 'spentAmount / sanctionedAmount * 100',
      },
    };
  }
}
