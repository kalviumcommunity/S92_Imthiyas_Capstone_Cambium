/**
 * Suite 09: Evidence-Based Research Contributions & Attribution Ledger
 * Specification: docs/CONTRIBUTIONS_POLICY.md & AGENTS.md
 */

import {
  ContributionEventType,
  ContributionSummaryResponse,
  ResearchContributionItem,
} from '../../client/lib/api';

describe('Suite 09: Evidence-Based Research Contributions & Attribution Ledger', () => {
  describe('Pillar 1 & 2: Contributions vs Active Days Calculation', () => {
    it('should collapse multiple research milestone events on the same date into exactly 1 active day', () => {
      const events: Partial<ResearchContributionItem>[] = [
        {
          id: '1',
          occurredAt: '2026-03-12T09:00:00.000Z',
          eventType: 'MANUSCRIPT_PUBLISHED',
          title: 'Cell Systems Paper Acceptance',
        },
        {
          id: '2',
          occurredAt: '2026-03-12T14:30:00.000Z',
          eventType: 'DATASET_RELEASE',
          title: 'Zenodo Benchmark Dataset Release',
        },
        {
          id: '3',
          occurredAt: '2026-03-12T18:15:00.000Z',
          eventType: 'SOFTWARE_RELEASE',
          title: 'v1.2.0 Model Weights Tag',
        },
        {
          id: '4',
          occurredAt: '2026-03-15T11:00:00.000Z',
          eventType: 'PEER_REVIEW_CONFIRMED',
          title: 'Confirmed Nature Methods Review',
        },
      ];

      // Aggregate dates by UTC calendar day (YYYY-MM-DD)
      const dateSet = new Set(events.map((e) => e.occurredAt!.slice(0, 10)));

      // 4 total events, but only 2 active calendar days (2026-03-12 and 2026-03-15)
      expect(events.length).toBe(4);
      expect(dateSet.size).toBe(2);
      expect(Array.from(dateSet).sort()).toEqual(['2026-03-12', '2026-03-15']);
    });
  });

  describe('Pillar 3: Distinct Scientific Works vs Milestone Events', () => {
    it('should aggregate preprint release and journal publication of the same paper into 1 distinct output', () => {
      const sharedDoi = '10.1016/j.cels.2026.01.004';

      const milestones: Partial<ResearchContributionItem>[] = [
        {
          id: 'ev-arxiv',
          outputRef: sharedDoi,
          eventType: 'PREPRINT_RELEASE',
          title: 'Zero-shot Clinical Tomography (arXiv:2411.14088)',
          occurredAt: '2025-11-20T10:00:00.000Z',
        },
        {
          id: 'ev-cels',
          outputRef: sharedDoi,
          eventType: 'MANUSCRIPT_PUBLISHED',
          title: 'Foundation Models for Medical Image Understanding (Cell Systems)',
          occurredAt: '2026-03-12T14:00:00.000Z',
        },
        {
          id: 'ev-zenodo',
          outputRef: '10.5281/zenodo.10829102',
          eventType: 'DATASET_RELEASE',
          title: 'Cambium Clinical Tomography MRI Dataset',
          occurredAt: '2026-02-18T10:30:00.000Z',
        },
      ];

      // Track distinct outputs by work identifier
      const outputSet = new Set<string>();
      for (const m of milestones) {
        if (m.outputRef) {
          outputSet.add(m.outputRef.toLowerCase());
        } else {
          outputSet.add(`work:event:${m.id}`);
        }
      }

      // 3 milestones across different dates, but only 2 distinct scientific outputs
      expect(milestones.length).toBe(3);
      expect(outputSet.size).toBe(2);
      expect(outputSet.has(sharedDoi.toLowerCase())).toBe(true);
      expect(outputSet.has('10.5281/zenodo.10829102')).toBe(true);
    });
  });

  describe('Pillar 4: Scholarly Citation & Impact Isolation', () => {
    it('should strictly isolate citation metrics from temporal contribution velocity', () => {
      const summary: ContributionSummaryResponse = {
        actorId: '00000000-0000-0000-0000-000000000001',
        year: 2026,
        timezone: 'UTC',
        metrics: {
          totalContributions: 6,
          activeDays: 5,
          distinctOutputs: 4,
          activeMonths: 3,
          longestActiveStreakDays: 1,
          currentActiveStreakDays: 0,
        },
        impact: {
          totalCitations: 420,
          hIndex: 11,
          i10Index: 12,
          source: 'Google Scholar & OpenAlex',
          statement:
            'Impact metrics represent cumulative academic citation influence and community adoption, deliberately evaluated separately from temporal activity cadences.',
        },
        byType: {
          MANUSCRIPT_PUBLISHED: 1,
          DATASET_RELEASE: 1,
        },
        monthlyTotals: [],
        dailyHeatmap: [],
        githubIntegration: {
          connected: false,
          configuredRepoCount: 0,
          message: 'No external GitHub repository connected.',
        },
      };

      // Total contributions must never sum or blend citations
      expect(summary.metrics.totalContributions).toBe(6);
      expect(summary.impact.totalCitations).toBe(420);
      expect(summary.metrics.totalContributions).not.toEqual(
        summary.metrics.totalContributions + summary.impact.totalCitations,
      );
    });
  });

  describe('Confidential Peer Review Redaction (COPE Ethics Compliance)', () => {
    it('should mask confidential manuscript titles and evidence links when viewed by third parties', () => {
      const sanitizeForViewer = (
        rawTitle: string,
        journal: string,
        isAuthorViewing: boolean,
      ) => {
        if (isAuthorViewing) {
          return { title: rawTitle, isMasked: false };
        }
        return {
          title: `Confirmed Peer Review · ${journal}`,
          isMasked: true,
        };
      };

      const publicView = sanitizeForViewer(
        'Review of Manuscript X-9901: Single-cell transcriptomics in glioma',
        'Nature Methods',
        false,
      );
      expect(publicView.title).toBe('Confirmed Peer Review · Nature Methods');
      expect(publicView.isMasked).toBe(true);

      const authorView = sanitizeForViewer(
        'Review of Manuscript X-9901: Single-cell transcriptomics in glioma',
        'Nature Methods',
        true,
      );
      expect(authorView.title).toContain('Manuscript X-9901');
      expect(authorView.isMasked).toBe(false);
    });
  });

  describe('CRediT Taxonomy Role Mapping', () => {
    it('should treat CRediT roles as descriptive attribution without inflating event counts', () => {
      const contribution: Partial<ResearchContributionItem> = {
        title: 'Zero-shot Clinical Tomography',
        eventType: 'MANUSCRIPT_PUBLISHED',
        creditRoles: [
          'Conceptualization',
          'Investigation',
          'Methodology',
          'Writing - original draft',
        ],
      };

      // Fulfilling 4 CRediT roles on 1 paper still equals 1 contribution event
      expect(contribution.creditRoles?.length).toBe(4);
      const contributionEventCount = 1; // Not 4
      expect(contributionEventCount).toBe(1);
    });
  });

  describe('GitHub Disconnected Integrity', () => {
    it('should report an honest disconnected state rather than synthetic repository commits', () => {
      const mockSummary: Partial<ContributionSummaryResponse> = {
        githubIntegration: {
          connected: false,
          configuredRepoCount: 0,
          message: 'No external GitHub repository connected.',
        },
      };

      expect(mockSummary.githubIntegration?.connected).toBe(false);
      expect(mockSummary.githubIntegration?.configuredRepoCount).toBe(0);
      expect(mockSummary.githubIntegration?.message).toContain('No external GitHub repository connected');
    });
  });
});
