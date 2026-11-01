import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  ContributionsService,
  ContributionSummaryResponse,
} from './contributions.service';
import {
  ResearchContribution,
  ContributionEventType,
  ContributionSource,
  ContributionVerificationStatus,
  ContributionVisibility,
} from './entities/research-contribution.entity';

describe('ContributionsService (Evidence-Based Research Contributions)', () => {
  let service: ContributionsService;
  let mockRepo: any;

  const scholarId = '11111111-1111-1111-1111-111111111111';
  const externalViewerId = '22222222-2222-2222-2222-222222222222';

  beforeEach(() => {
    mockRepo = {
      count: vi.fn().mockResolvedValue(10), // Default > 0 so auto-seed does not run unless tested
      create: vi.fn().mockImplementation((dto) => ({ id: 'mock-uuid', ...dto })),
      save: vi.fn().mockImplementation((entity) => Promise.resolve({ id: entity.id || 'mock-uuid', ...entity })),
      findOne: vi.fn(),
      find: vi.fn(),
      remove: vi.fn().mockResolvedValue(true),
      createQueryBuilder: vi.fn(),
    };

    service = new ContributionsService(mockRepo);
  });

  describe('Pillar 1 & 2: Contributions vs Active Days', () => {
    it('should count multiple events on the same calendar day as exactly 1 active day', async () => {
      // 3 events on 2026-03-15 and 1 event on 2026-03-16
      const mockItems: Partial<ResearchContribution>[] = [
        {
          id: 'ev-1',
          actorId: scholarId,
          title: 'Cell Systems Paper Acceptance',
          eventType: ContributionEventType.MANUSCRIPT_PUBLISHED,
          occurredAt: new Date('2026-03-15T09:00:00Z'),
          outputRef: '10.1016/j.cels.2026.01.004',
          visibility: ContributionVisibility.PUBLIC,
        },
        {
          id: 'ev-2',
          actorId: scholarId,
          title: 'Zenodo MRI Dataset Upload',
          eventType: ContributionEventType.DATASET_RELEASE,
          occurredAt: new Date('2026-03-15T14:30:00Z'),
          outputRef: '10.5281/zenodo.10829102',
          visibility: ContributionVisibility.PUBLIC,
        },
        {
          id: 'ev-3',
          actorId: scholarId,
          title: 'Foundation Vision Software Tag v1.2.0',
          eventType: ContributionEventType.SOFTWARE_RELEASE,
          occurredAt: new Date('2026-03-15T20:15:00Z'),
          outputRef: 'repo:foundation-vision',
          visibility: ContributionVisibility.PUBLIC,
        },
        {
          id: 'ev-4',
          actorId: scholarId,
          title: 'Nature Methods Peer Review Confirmation',
          eventType: ContributionEventType.PEER_REVIEW_CONFIRMED,
          occurredAt: new Date('2026-03-16T11:00:00Z'),
          outputRef: 'review:nature-methods:01',
          visibility: ContributionVisibility.PUBLIC,
        },
      ];

      const qbMock = {
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(mockItems),
      };
      mockRepo.createQueryBuilder.mockReturnValue(qbMock);

      const summary = await service.getSummary(scholarId, { year: 2026 });

      // Verification: 4 events total, but only 2 unique dates (2026-03-15 and 2026-03-16)
      expect(summary.metrics.totalContributions).toBe(4);
      expect(summary.metrics.activeDays).toBe(2);
    });
  });

  describe('Pillar 3: Distinct Research Outputs vs Milestone Events', () => {
    it('should aggregate preprint release and journal acceptance of the same paper as 1 distinct output', async () => {
      const mockItems: Partial<ResearchContribution>[] = [
        {
          id: 'ev-arxiv',
          actorId: scholarId,
          title: 'Zero-shot Clinical Tomography (arXiv Preprint)',
          eventType: ContributionEventType.PREPRINT_RELEASE,
          occurredAt: new Date('2025-11-20T10:00:00Z'),
          outputRef: '10.1016/j.cels.2026.01.004', // Shared work DOI
          visibility: ContributionVisibility.PUBLIC,
        },
        {
          id: 'ev-cels',
          actorId: scholarId,
          title: 'Zero-shot Clinical Tomography (Cell Systems Final Publication)',
          eventType: ContributionEventType.MANUSCRIPT_PUBLISHED,
          occurredAt: new Date('2026-03-12T14:00:00Z'),
          outputRef: '10.1016/j.cels.2026.01.004', // Same shared work DOI
          visibility: ContributionVisibility.PUBLIC,
        },
      ];

      const qbMock = {
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(mockItems),
      };
      mockRepo.createQueryBuilder.mockReturnValue(qbMock);

      const summary = await service.getSummary(scholarId, {});

      // 2 milestone events, but only 1 distinct scientific output work
      expect(summary.metrics.totalContributions).toBe(2);
      expect(summary.metrics.distinctOutputs).toBe(1);
    });
  });

  describe('Pillar 4: Scholarly Impact Separation', () => {
    it('should provide citation and h-index metrics in an isolated block never blended with event count', async () => {
      const qbMock = {
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([]),
      };
      mockRepo.createQueryBuilder.mockReturnValue(qbMock);

      const summary = await service.getSummary(scholarId, {});

      expect(summary.impact).toBeDefined();
      expect(summary.impact.totalCitations).toBe(420);
      expect(summary.impact.hIndex).toBe(11);
      expect(summary.impact.statement).toContain('deliberately evaluated separately');
      // Metric count does not add citations to total contributions
      expect(summary.metrics.totalContributions).toBe(0);
    });
  });

  describe('Confidential Peer Review & Privacy Masking', () => {
    it('should mask confidential manuscript title and evidence URL when viewed by external scholar', async () => {
      const confidentialReview: Partial<ResearchContribution> = {
        id: 'review-123',
        actorId: scholarId,
        title: 'Review of Manuscript X-8921: High-throughput single-cell RNAseq in breast cancer',
        eventType: ContributionEventType.PEER_REVIEW_CONFIRMED,
        occurredAt: new Date('2026-01-20T12:00:00Z'),
        evidenceUrl: 'https://internal-journal-portal.com/reviews/X-8921/text',
        visibility: ContributionVisibility.PUBLIC,
        metadata: {
          journal: 'Nature Methods',
          confidential: true,
        },
      };

      const qbMock = {
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([confidentialReview]),
      };
      mockRepo.createQueryBuilder.mockReturnValue(qbMock);

      const externalResults = await service.getContributions(scholarId, {}, externalViewerId);

      expect(externalResults[0].title).toBe('Confirmed Peer Review · Nature Methods');
      expect(externalResults[0].evidenceUrl).toBeUndefined();
      expect(externalResults[0].metadata.journal).toBe('Nature Methods');
    });

    it('should preserve original review metadata when viewed by author scholar', async () => {
      const confidentialReview: Partial<ResearchContribution> = {
        id: 'review-123',
        actorId: scholarId,
        title: 'Review of Manuscript X-8921: High-throughput single-cell RNAseq in breast cancer',
        eventType: ContributionEventType.PEER_REVIEW_CONFIRMED,
        occurredAt: new Date('2026-01-20T12:00:00Z'),
        evidenceUrl: 'https://internal-journal-portal.com/reviews/X-8921/text',
        visibility: ContributionVisibility.PUBLIC,
        metadata: {
          journal: 'Nature Methods',
          confidential: true,
        },
      };

      const qbMock = {
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([confidentialReview]),
      };
      mockRepo.createQueryBuilder.mockReturnValue(qbMock);

      const ownerResults = await service.getContributions(scholarId, {}, scholarId);

      expect(ownerResults[0].title).toContain('Manuscript X-8921');
      expect(ownerResults[0].evidenceUrl).toBe('https://internal-journal-portal.com/reviews/X-8921/text');
    });
  });

  describe('createManualContribution', () => {
    it('should reject future timestamps with BadRequestException', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      await expect(
        service.createManualContribution(scholarId, {
          title: 'Future Paper Publication',
          eventType: ContributionEventType.MANUSCRIPT_PUBLISHED,
          occurredAt: futureDate.toISOString(),
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should idempotently return existing record if identical contribution already exists', async () => {
      const existing = {
        id: 'existing-id',
        actorId: scholarId,
        title: 'Existing Milestone',
        eventType: ContributionEventType.METHOD_STEP,
        occurredAt: new Date('2026-02-01T10:00:00Z'),
      };
      mockRepo.findOne.mockResolvedValue(existing);

      const result = await service.createManualContribution(scholarId, {
        title: 'Existing Milestone',
        eventType: ContributionEventType.METHOD_STEP,
        occurredAt: '2026-02-01T10:00:00Z',
      });

      expect(result.id).toBe('existing-id');
      expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('should successfully persist new confirmed milestone with CRediT roles', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const created = await service.createManualContribution(scholarId, {
        title: 'Multi-center convergence verification on ERA5 dataset',
        eventType: ContributionEventType.EXPERIMENT_MILESTONE,
        occurredAt: '2026-02-10T15:00:00Z',
        creditRoles: ['Methodology', 'Formal analysis'],
        evidenceUrl: 'https://doi.org/10.5281/zenodo.10829102',
      });

      expect(created).toBeDefined();
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          actorId: scholarId,
          eventType: ContributionEventType.EXPERIMENT_MILESTONE,
          source: ContributionSource.MANUAL_CONFIRMED,
          verificationStatus: ContributionVerificationStatus.CONFIRMED,
          creditRoles: ['Methodology', 'Formal analysis'],
        }),
      );
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('deleteContribution', () => {
    it('should prevent non-owner from deleting a contribution', async () => {
      mockRepo.findOne.mockResolvedValue({
        id: 'some-id',
        actorId: scholarId,
      });

      await expect(
        service.deleteContribution(externalViewerId, 'some-id'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if contribution does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deleteContribution(scholarId, 'missing-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
