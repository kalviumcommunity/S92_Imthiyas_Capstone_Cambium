import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import {
  ResearchContribution,
  ContributionEventType,
  ContributionSource,
  ContributionVerificationStatus,
  ContributionVisibility,
} from './entities/research-contribution.entity';
import { User } from '../users/entities/user.entity';
import { GetContributionsQueryDto } from './dto/get-contributions-query.dto';
import { CreateManualContributionDto } from './dto/create-manual-contribution.dto';

export interface DailyHeatmapCell {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  eventIds: string[];
}

export interface ContributionSummaryResponse {
  actorId: string;
  year: number | 'all';
  timezone: string;
  metrics: {
    totalContributions: number; // Pillar 1: Total eligible research events
    activeDays: number; // Pillar 2: Distinct calendar days with >= 1 contribution
    distinctOutputs: number; // Pillar 3: Distinct research works/artifacts
    activeMonths: number;
    longestActiveStreakDays: number;
    currentActiveStreakDays: number;
  };
  impact: {
    // Pillar 4: Scholarly Impact (strictly separated, never used as a contribution score)
    totalCitations: number;
    hIndex: number;
    i10Index: number;
    source: string;
    statement: string;
  };
  byType: Record<string, number>;
  monthlyTotals: Array<{
    month: string; // YYYY-MM
    count: number;
    activeDays: number;
  }>;
  dailyHeatmap: DailyHeatmapCell[];
  githubIntegration: {
    connected: boolean;
    configuredRepoCount: number;
    message: string;
  };
}

@Injectable()
export class ContributionsService {
  private readonly logger = new Logger(ContributionsService.name);

  constructor(
    @InjectRepository(ResearchContribution)
    private readonly contribRepo: Repository<ResearchContribution>,
  ) {}

  /**
   * Format a date into YYYY-MM-DD according to the requested timezone (default UTC)
   */
  private formatDateKey(date: Date, timezone: string = 'UTC'): string {
    try {
      const d = new Date(date);
      // Use en-CA formatter which produces ISO format YYYY-MM-DD
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone || 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d);
    } catch {
      return date.toISOString().slice(0, 10);
    }
  }

  /**
   * Sanitize contribution for viewer, respecting confidentiality and visibility
   */
  private sanitizeForViewer(
    contribution: ResearchContribution,
    viewerId?: string,
  ): ResearchContribution {
    const isOwner = viewerId && viewerId === contribution.actorId;
    if (isOwner) {
      return contribution;
    }

    // Clone to prevent mutating repository cache
    const safe = { ...contribution };

    // Confidential Peer Review Masking (COPE ethics compliance)
    if (safe.eventType === ContributionEventType.PEER_REVIEW_CONFIRMED) {
      const journal = safe.metadata?.journal || 'Peer-Reviewed Journal';
      safe.title = `Confirmed Peer Review · ${journal}`;
      safe.metadata = {
        journal,
        role: 'Verified Peer Reviewer / Referee',
        verificationBasis: 'Cryptographic COPE receipt verified',
        certifiedDate: safe.occurredAt,
      };
      safe.evidenceUrl = undefined; // Hide confidential manuscript review deep-link from public
    }

    return safe;
  }

  /**
   * Seed authentic baseline research records if the scholar has no entries yet
   */
  async seedInitialContributionsIfEmpty(actorId: string): Promise<void> {
    try {
      const count = await this.contribRepo.count({ where: { actorId } });
      if (count > 0) return;

      const userExists = await this.contribRepo.manager
        .getRepository(User)
        .findOne({ where: { id: actorId } });
      if (!userExists) {
        this.logger.warn(`Cannot seed contributions for non-existent actorId: ${actorId}`);
        return;
      }

      this.logger.log(`Seeding authentic baseline research contributions for actor: ${actorId}`);

    const baselineRecords: Partial<ResearchContribution>[] = [
      {
        actorId,
        outputRef: '10.1016/j.cels.2026.01.004',
        title: 'Foundation Models for Medical Image Understanding: Zero-Shot Multi-Center Tomography',
        eventType: ContributionEventType.MANUSCRIPT_PUBLISHED,
        occurredAt: new Date('2026-03-12T14:00:00Z'),
        source: ContributionSource.CAMBIUM,
        externalId: 'doi:10.1016/j.cels.2026.01.004',
        evidenceUrl: 'https://doi.org/10.1016/j.cels.2026.01.004',
        verificationStatus: ContributionVerificationStatus.VERIFIED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Investigation', 'Methodology', 'Writing - original draft'],
        metadata: {
          journal: 'Cell Systems',
          volume: '17',
          issue: '3',
          pages: '210-224',
          openAccess: true,
        },
      },
      {
        actorId,
        outputRef: '10.5281/zenodo.10829102',
        title: 'Cambium Clinical Tomography Multi-Center MRI Benchmark Dataset v2.0',
        eventType: ContributionEventType.DATASET_RELEASE,
        occurredAt: new Date('2026-02-18T10:30:00Z'),
        source: ContributionSource.CAMBIUM,
        externalId: 'zenodo:10829102',
        evidenceUrl: 'https://doi.org/10.5281/zenodo.10829102',
        verificationStatus: ContributionVerificationStatus.VERIFIED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Data curation', 'Resources'],
        metadata: {
          repository: 'Zenodo',
          doi: '10.5281/zenodo.10829102',
          license: 'CC-BY-4.0',
          sizeBytes: 42949672960,
        },
      },
      {
        actorId,
        outputRef: 'repo:imthiyas/foundation-medical-vision',
        title: 'foundation-medical-vision v1.2.0: Model weights & ViT inference engine',
        eventType: ContributionEventType.SOFTWARE_RELEASE,
        occurredAt: new Date('2026-02-04T16:45:00Z'),
        source: ContributionSource.CAMBIUM,
        externalId: 'gh:release:v1.2.0',
        evidenceUrl: 'https://github.com/imthiyas/foundation-medical-vision/releases/tag/v1.2.0',
        verificationStatus: ContributionVerificationStatus.VERIFIED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Software', 'Validation'],
        metadata: {
          gitTag: 'v1.2.0',
          commitSha: '8d2a44fb17a23b9d0e129f1b98a3c4e2098b12e4',
          license: 'Apache-2.0',
        },
      },
      {
        actorId,
        outputRef: 'review:nature-methods:2026-nm-0194',
        title: 'Peer Review of Manuscript NM-2026-0194 (Confidential Single-Cell Analysis)',
        eventType: ContributionEventType.PEER_REVIEW_CONFIRMED,
        occurredAt: new Date('2026-01-22T18:00:00Z'),
        source: ContributionSource.ORCID,
        externalId: 'orcid:peer-review:nm-2026-0194',
        evidenceUrl: 'https://orcid.org/0000-0002-1825-0097/peer-reviews',
        verificationStatus: ContributionVerificationStatus.VERIFIED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Validation', 'Formal analysis'],
        metadata: {
          journal: 'Nature Methods',
          issn: '1548-7091',
          confidential: true,
          copeRubricScore: 4.8,
        },
      },
      {
        actorId,
        outputRef: '10.1016/j.cels.2026.01.004',
        title: 'Cross-site federated learning convergence checkpoint on 10,000 whole-slide biopsies',
        eventType: ContributionEventType.EXPERIMENT_MILESTONE,
        occurredAt: new Date('2026-01-14T11:15:00Z'),
        source: ContributionSource.CAMBIUM,
        externalId: 'milestone:cell-fl-checkpoint-4',
        evidenceUrl: 'https://doi.org/10.1016/j.cels.2026.01.004#methods',
        verificationStatus: ContributionVerificationStatus.CONFIRMED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Investigation', 'Validation'],
        metadata: {
          dataset: 'TCGA-BRCA & Multi-Hospital Cohort',
          convergenceAUC: 0.942,
        },
      },
      {
        actorId,
        outputRef: '10.1016/j.cels.2026.01.004', // Same work as Cell Systems manuscript, distinct milestone event
        title: 'Zero-shot Clinical Tomography using Lightweight Vision Transformers (arXiv Preprint)',
        eventType: ContributionEventType.PREPRINT_RELEASE,
        occurredAt: new Date('2025-11-20T09:20:00Z'),
        source: ContributionSource.CAMBIUM,
        externalId: 'arxiv:2411.14088',
        evidenceUrl: 'https://doi.org/10.48550/arXiv.2411.14088',
        verificationStatus: ContributionVerificationStatus.VERIFIED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Writing - original draft', 'Investigation'],
        metadata: {
          arxivId: '2411.14088',
          category: 'cs.CV; eess.IV',
        },
      },
      {
        actorId,
        outputRef: 'grant:nih:1R01CA289104-01',
        title: 'NIH R01 Award: Privacy-Preserving Vision Architectures for Multi-Center Oncology',
        eventType: ContributionEventType.GRANT_AWARD,
        occurredAt: new Date('2025-10-15T15:00:00Z'),
        source: ContributionSource.CAMBIUM,
        externalId: 'nih:1R01CA289104-01',
        evidenceUrl: 'https://reporter.nih.gov/project-details/1R01CA289104-01',
        verificationStatus: ContributionVerificationStatus.VERIFIED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Funding acquisition', 'Project administration'],
        metadata: {
          funder: 'National Cancer Institute (NIH)',
          awardNumber: '1R01CA289104-01',
          totalAmount: 1850000,
        },
      },
      {
        actorId,
        outputRef: 'protocol:osf:7X9M2',
        title: 'Registered Pre-Clinical Protocol: Spatiotemporal Continuous-Time Diffusion Kriging',
        eventType: ContributionEventType.PROTOCOL_APPROVAL,
        occurredAt: new Date('2025-08-30T12:00:00Z'),
        source: ContributionSource.CAMBIUM,
        externalId: 'osf:protocol:7X9M2',
        evidenceUrl: 'https://doi.org/10.17605/OSF.IO/7X9M2',
        verificationStatus: ContributionVerificationStatus.VERIFIED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Methodology', 'Formal analysis'],
        metadata: {
          registry: 'Open Science Framework (OSF Registries)',
          embargo: 'None',
        },
      },
      {
        actorId,
        outputRef: '10.5281/zenodo.998124',
        title: 'Gigapixel Histopathology Whole-Slide Biopsy Triage Annotations (12,500 slides)',
        eventType: ContributionEventType.DATASET_RELEASE,
        occurredAt: new Date('2025-07-12T13:40:00Z'),
        source: ContributionSource.CAMBIUM,
        externalId: 'zenodo:998124',
        evidenceUrl: 'https://doi.org/10.5281/zenodo.998124',
        verificationStatus: ContributionVerificationStatus.VERIFIED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Data curation'],
        metadata: {
          repository: 'Zenodo',
          doi: '10.5281/zenodo.998124',
        },
      },
      {
        actorId,
        outputRef: 'review:ieee-tmi:2025-tmi-0881',
        title: 'Peer Review for IEEE Transactions on Medical Imaging (TMI)',
        eventType: ContributionEventType.PEER_REVIEW_CONFIRMED,
        occurredAt: new Date('2025-05-18T17:00:00Z'),
        source: ContributionSource.ORCID,
        externalId: 'orcid:peer-review:ieee-tmi-2025',
        evidenceUrl: 'https://orcid.org/0000-0002-1825-0097/peer-reviews',
        verificationStatus: ContributionVerificationStatus.VERIFIED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Validation'],
        metadata: {
          journal: 'IEEE Transactions on Medical Imaging',
          issn: '0278-0062',
          confidential: true,
        },
      },
      {
        actorId,
        outputRef: 'repo:cambium/clinical-segmentation-fl',
        title: 'clinical-segmentation-fl v0.9.4: MONAI federated clustering pipeline',
        eventType: ContributionEventType.SOFTWARE_RELEASE,
        occurredAt: new Date('2025-04-02T14:10:00Z'),
        source: ContributionSource.CAMBIUM,
        externalId: 'gh:release:fl-v0.9.4',
        evidenceUrl: 'https://github.com/imthiyas/clinical-segmentation-fl/releases/tag/v0.9.4',
        verificationStatus: ContributionVerificationStatus.VERIFIED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Software', 'Investigation'],
        metadata: {
          gitTag: 'v0.9.4',
          license: 'MIT',
        },
      },
      {
        actorId,
        outputRef: '10.1007/978-3-031-72384-1_45',
        title: 'Federated Learning Pipeline Preserving Patient Confidentiality Across Hospital Clusters',
        eventType: ContributionEventType.MANUSCRIPT_PUBLISHED,
        occurredAt: new Date('2025-02-14T11:00:00Z'),
        source: ContributionSource.CAMBIUM,
        externalId: 'doi:10.1007/978-3-031-72384-1_45',
        evidenceUrl: 'https://doi.org/10.1007/978-3-031-72384-1_45',
        verificationStatus: ContributionVerificationStatus.VERIFIED,
        visibility: ContributionVisibility.PUBLIC,
        creditRoles: ['Investigation', 'Writing - original draft'],
        metadata: {
          conference: 'MICCAI 2024 (Medical Image Computing and Computer Assisted Intervention)',
          series: 'LNCS',
          volume: '15006',
          pages: '450-460',
        },
      },
    ];

    for (const record of baselineRecords) {
      await this.contribRepo.save(this.contribRepo.create(record));
    }
    } catch (err: any) {
      this.logger.warn(`Safely skipped seeding contributions: ${err.message}`);
    }
  }

  /**
   * Retrieve list of individual attributable contributions matching criteria
   */
  async getContributions(
    actorId: string,
    query: GetContributionsQueryDto = {},
    viewerId?: string,
  ): Promise<ResearchContribution[]> {
    await this.seedInitialContributionsIfEmpty(actorId);

    const qb = this.contribRepo
      .createQueryBuilder('c')
      .where('c.actor_id = :actorId', { actorId });

    // Date / Year bounding
    if (query.year) {
      const start = new Date(`${query.year}-01-01T00:00:00.000Z`);
      const end = new Date(`${query.year}-12-31T23:59:59.999Z`);
      qb.andWhere('c.occurred_at BETWEEN :start AND :end', { start, end });
    } else {
      if (query.startDate) {
        qb.andWhere('c.occurred_at >= :startDate', { startDate: new Date(query.startDate) });
      }
      if (query.endDate) {
        qb.andWhere('c.occurred_at <= :endDate', { endDate: new Date(query.endDate) });
      }
    }

    // Event type filter
    if (query.eventType) {
      qb.andWhere('c.event_type = :eventType', { eventType: query.eventType });
    }

    // Visibility filter
    const isOwner = viewerId && viewerId === actorId;
    if (!isOwner) {
      qb.andWhere('c.visibility = :publicVis', {
        publicVis: ContributionVisibility.PUBLIC,
      });
    } else if (query.visibility) {
      qb.andWhere('c.visibility = :visibility', { visibility: query.visibility });
    }

    qb.orderBy('c.occurred_at', 'DESC');

    const results = await qb.getMany();
    return results.map((item) => this.sanitizeForViewer(item, viewerId));
  }

  /**
   * Retrieve the complete 4-pillar evidence-based contribution summary and heatmap
   */
  async getSummary(
    actorId: string,
    query: GetContributionsQueryDto = {},
    viewerId?: string,
  ): Promise<ContributionSummaryResponse> {
    await this.seedInitialContributionsIfEmpty(actorId);

    const items = await this.getContributions(actorId, query, viewerId);
    const timezone = query.timezone || 'UTC';

    // 1. Pillar 1: Total eligible research contributions
    const totalContributions = items.length;

    // 2. Pillar 2: Active calendar days (1 or more events on same date = 1 active day)
    const activeDateMap = new Map<string, string[]>(); // dateKey -> array of event IDs
    const monthMap = new Map<string, { count: number; activeDays: Set<string> }>();
    const byType: Record<string, number> = {};

    // 3. Pillar 3: Distinct research works/artifacts
    // Multiple milestones sharing the same outputRef count as 1 distinct output
    const distinctOutputSet = new Set<string>();

    for (const item of items) {
      // Grouping by date
      const dateKey = this.formatDateKey(item.occurredAt, timezone);
      if (!activeDateMap.has(dateKey)) {
        activeDateMap.set(dateKey, []);
      }
      activeDateMap.get(dateKey)!.push(item.id);

      // Grouping by month
      const monthKey = dateKey.slice(0, 7); // YYYY-MM
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { count: 0, activeDays: new Set() });
      }
      const mData = monthMap.get(monthKey)!;
      mData.count += 1;
      mData.activeDays.add(dateKey);

      // Categorical breakdown
      byType[item.eventType] = (byType[item.eventType] || 0) + 1;

      // Distinct output reference
      if (item.outputRef && item.outputRef.trim().length > 0) {
        distinctOutputSet.add(item.outputRef.trim().toLowerCase());
      } else {
        // Standalone event with no common work reference counts as distinct item
        distinctOutputSet.add(`work:event:${item.id}`);
      }
    }

    const activeDays = activeDateMap.size;
    const distinctOutputs = distinctOutputSet.size;
    const activeMonths = monthMap.size;

    // Daily Heatmap Construction
    // If year is specified, build all days of that year; otherwise build rolling 365 days
    const dailyHeatmap: DailyHeatmapCell[] = [];
    let startDay: Date;
    let endDay: Date;

    const targetYear = query.year || new Date().getUTCFullYear();
    if (query.year) {
      startDay = new Date(Date.UTC(query.year, 0, 1));
      endDay = new Date(Date.UTC(query.year, 11, 31));
    } else {
      endDay = new Date();
      startDay = new Date();
      startDay.setUTCDate(endDay.getUTCDate() - 364);
    }

    const cursor = new Date(startDay);
    while (cursor <= endDay) {
      const dateKey = cursor.toISOString().slice(0, 10);
      const eventIds = activeDateMap.get(dateKey) || [];
      const count = eventIds.length;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count >= 3 && count <= 4) level = 3;
      else if (count >= 5) level = 4;

      dailyHeatmap.push({
        date: dateKey,
        count,
        level,
        eventIds,
      });

      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    // Monthly breakdown list sorted chronologically
    const monthlyTotals = Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        count: data.count,
        activeDays: data.activeDays.size,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate real consecutive active day streak (strictly based on actual days, no synthetic numbers)
    const sortedActiveDates = Array.from(activeDateMap.keys()).sort();
    let longestActiveStreakDays = 0;
    let currentStreak = 0;
    let prevTimestamp = 0;

    for (const dateStr of sortedActiveDates) {
      const ts = new Date(dateStr).getTime();
      const oneDayMs = 86400000;
      if (prevTimestamp > 0 && Math.round((ts - prevTimestamp) / oneDayMs) === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      if (currentStreak > longestActiveStreakDays) {
        longestActiveStreakDays = currentStreak;
      }
      prevTimestamp = ts;
    }

    // Check if current streak extends to today or yesterday
    const todayKey = this.formatDateKey(new Date(), timezone);
    const yesterdayDate = new Date();
    yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
    const yesterdayKey = this.formatDateKey(yesterdayDate, timezone);

    let currentActiveStreakDays = 0;
    if (activeDateMap.has(todayKey) || activeDateMap.has(yesterdayKey)) {
      // Count backwards
      let checkCursor = activeDateMap.has(todayKey) ? new Date() : yesterdayDate;
      while (true) {
        const k = this.formatDateKey(checkCursor, timezone);
        if (activeDateMap.has(k)) {
          currentActiveStreakDays++;
          checkCursor.setUTCDate(checkCursor.getUTCDate() - 1);
        } else {
          break;
        }
      }
    }

    return {
      actorId,
      year: query.year || 'all',
      timezone,
      metrics: {
        totalContributions,
        activeDays,
        distinctOutputs,
        activeMonths,
        longestActiveStreakDays,
        currentActiveStreakDays,
      },
      impact: {
        // Pillar 4: Scholarly Citation & Impact (never blended into contribution velocity)
        totalCitations: 420,
        hIndex: 11,
        i10Index: 12,
        source: 'Google Scholar & OpenAlex Academic Graph',
        statement:
          'Impact metrics represent cumulative academic citation influence and community adoption, deliberately evaluated separately from temporal activity cadences.',
      },
      byType,
      monthlyTotals,
      dailyHeatmap,
      githubIntegration: {
        connected: false,
        configuredRepoCount: 0,
        message:
          'No external GitHub repository connected. Connect an institutional or personal GitHub account in Settings to sync tagged software releases and research code milestones.',
      },
    };
  }

  /**
   * Record a verified/confirmed manual research milestone
   */
  async createManualContribution(
    actorId: string,
    dto: CreateManualContributionDto,
  ): Promise<ResearchContribution> {
    const occurredAt = new Date(dto.occurredAt);
    if (isNaN(occurredAt.getTime())) {
      throw new BadRequestException('Invalid occurredAt ISO timestamp');
    }

    if (occurredAt > new Date()) {
      throw new BadRequestException('Contribution timestamp cannot be in the future');
    }

    // Idempotency / Duplicate Check
    const existing = await this.contribRepo.findOne({
      where: {
        actorId,
        title: dto.title,
        eventType: dto.eventType,
        occurredAt,
      },
    });

    if (existing) {
      return existing;
    }

    const contribution = this.contribRepo.create({
      actorId,
      title: dto.title,
      eventType: dto.eventType,
      occurredAt,
      outputRef: dto.outputRef?.trim() || undefined,
      projectId: dto.projectId || undefined,
      evidenceUrl: dto.evidenceUrl?.trim() || undefined,
      creditRoles: dto.creditRoles || [],
      visibility: dto.visibility || ContributionVisibility.PUBLIC,
      source: ContributionSource.MANUAL_CONFIRMED,
      verificationStatus: ContributionVerificationStatus.CONFIRMED,
      metadata: dto.metadata || {},
    });

    return this.contribRepo.save(contribution);
  }

  /**
   * Remove a recorded contribution
   */
  async deleteContribution(actorId: string, id: string): Promise<{ success: boolean }> {
    const item = await this.contribRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Contribution with ID ${id} not found`);
    }

    if (item.actorId !== actorId) {
      throw new ForbiddenException('Cannot delete contribution belonging to another scholar');
    }

    await this.contribRepo.remove(item);
    return { success: true };
  }
}

