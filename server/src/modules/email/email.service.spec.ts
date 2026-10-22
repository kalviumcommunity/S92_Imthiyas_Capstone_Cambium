import { describe, it, expect, beforeEach } from 'vitest';
import { EmailService } from './email.service';
import { ResearchOpportunity, OpportunityType } from '../opportunities/entities/research-opportunity.entity';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(() => {
    service = new EmailService();
  });

  it('should deliver weekly deadline digest to simulated outbox when API key is unconfigured', async () => {
    const opp: Partial<ResearchOpportunity> = {
      id: 'mock-1',
      title: 'NSF CAREER in Quantum Networks',
      organization: 'National Science Foundation',
      type: OpportunityType.GRANT,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    const result = await service.sendWeeklyDeadlineDigest(
      'scholar@oxford.ac.uk',
      'Dr. Rostova',
      [opp as ResearchOpportunity],
    );

    expect(result.success).toBe(true);
    expect(result.isMockFallback).toBe(true);
    expect(result.recipient).toBe('scholar@oxford.ac.uk');
  });

  it('should dispatch grant alert email cleanly', async () => {
    const opp: Partial<ResearchOpportunity> = {
      id: 'mock-2',
      title: 'NIH R01 Targeted Nanoparticle Delivery',
      organization: 'National Institutes of Health',
      type: OpportunityType.GRANT,
      description: 'Funding for novel targeted drug carrier formulation.',
    };

    const result = await service.sendGrantMatchAlert(
      'pi@harvard.edu',
      'Dr. Vance',
      opp as ResearchOpportunity,
    );

    expect(result.success).toBe(true);
    expect(result.recipient).toBe('pi@harvard.edu');
  });
});
