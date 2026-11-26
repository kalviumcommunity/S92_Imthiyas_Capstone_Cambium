import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { CitationVerifierService } from './citation-verifier.service';
import { AiToolRegistry } from './ai-tool-registry';

describe('Sprint 3 Grounded Assistant, Citations & Memory', () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it('abstains explicitly when zero authorized sources or attached excerpts exist', async () => {
    const hybridSearch = { search: vi.fn().mockResolvedValue({ results: [] }) } as any;
    const oppService = { findOne: vi.fn() } as any;
    const docRetrieval = { retrieveAuthorizedChunks: vi.fn().mockResolvedValue({ chunks: [], latencyMs: 1 }) } as any;

    const service = new AssistantService(
      hybridSearch,
      oppService,
      undefined,
      undefined,
      undefined,
      docRetrieval,
    );

    const res = await service.chat(
      { messages: [{ role: 'user', content: 'What was the secret private award amount?' }] },
      { id: 'user-1', role: 'RESEARCHER' } as any,
      'req-abstain-1',
    );

    expect(res.abstained).toBe(true);
    expect(res.evidenceCitations).toHaveLength(0);
    expect(res.reply).toContain('Insufficient evidence');
  });

  it('strips fabricated [src:...] markers and hallucinated DOIs outside retrieved allowlist', () => {
    const verifier = new CitationVerifierService();
    const raw =
      'Quantum biology grant fits early-career investigators [src:opp-valid-1]. See also invented proof [src:opp-fake-99] and DOI 10.9999/fake-doi-2026 alongside real 10.1038/s41586-024-0001.';

    const verified = verifier.verifyCitations(raw, [
      {
        sourceId: 'opp-valid-1',
        title: 'NSF Quantum Biology Call',
        funder: 'NSF',
        excerpt: 'Published analysis DOI 10.1038/s41586-024-0001 supports early-career scholars.',
        sourceType: 'opportunity',
        rrfScore: 0.032,
      },
    ]);

    expect(verified.unverifiedClaimsRemoved).toBe(2);
    expect(verified.cleanedText).toContain('[src:opp-valid-1]');
    expect(verified.cleanedText).toContain('[unverified citation removed]');
    expect(verified.cleanedText).toContain('[unverified DOI removed]');
    expect(verified.cleanedText).toContain('10.1038/s41586-024-0001');
    expect(verified.verifiedCitations).toHaveLength(1);
    expect(verified.verifiedCitations[0].sourceId).toBe('opp-valid-1');
  });

  it('enforces explicit tool allowlist and bounded per-turn tool execution limit', async () => {
    const registry = new AiToolRegistry();
    const budget = registry.createBudget(2);

    const denied = await registry.executeBounded(budget, 'drop_database_table', {}, async () => true);
    expect(denied.ok).toBe(false);
    expect(denied.trace.status).toBe('DENIED');

    const okCall = await registry.executeBounded(budget, 'search_opportunities', { q: 'nih' }, async () => ['ok']);
    expect(okCall.ok).toBe(true);

    const exceeded = await registry.executeBounded(budget, 'verify_eligibility', {}, async () => true);
    expect(exceeded.ok).toBe(false);
    expect(exceeded.trace.status).toBe('BUDGET_EXCEEDED');
  });

  it('performs real clause extraction instead of static mock deliverables or fake 0.94 scores', async () => {
    const hybridSearch = { search: vi.fn().mockResolvedValue({ results: [] }) } as any;
    const oppService = {
      findOne: vi.fn().mockResolvedValue({
        data: {
          title: 'NSF Polar Climatology Award',
          organization: 'NSF',
          description: 'Eligible applicants include accredited universities and early-career faculty.',
          deadline: '2028-06-01T00:00:00.000Z',
        },
      }),
    } as any;

    const service = new AssistantService(hybridSearch, oppService);

    const noTextDeliv = await service.extractDeliverables('General welcome brochure without milestones.');
    expect(noTextDeliv.insufficientEvidence).toBe(true);
    expect(noTextDeliv.deliverablesCount).toBe(0);

    const realDeliv = await service.extractDeliverables(
      'Awardees must submit an annual technical report within 12 months. Deposit open datasets in Zenodo repository by Month 24.',
    );
    expect(realDeliv.insufficientEvidence).toBe(false);
    expect(realDeliv.deliverablesCount).toBe(2);

    const missingElig = await service.verifyEligibility({});
    expect(missingElig.status).toBe('INSUFFICIENT_EVIDENCE');
    expect(missingElig.evidenceConfidence).toBeNull();

    const matchedElig = await service.verifyEligibility({
      opportunityId: '11111111-1111-4111-8111-111111111111',
      institution: 'Oxford University',
      careerStage: 'Early Career PI',
    });
    expect(matchedElig.status).toBe('ELIGIBILITY_CRITERIA_MATCHED');
    expect(matchedElig.eligible).toBe(true);
  });

  it('enforces conversation ownership across different users', async () => {
    const conversationRepo = {
      findOne: vi.fn().mockResolvedValue({ id: 'conv-1', userId: 'owner-user' }),
      delete: vi.fn(),
    } as any;
    const service = new AssistantService(
      { search: vi.fn() } as any,
      { findOne: vi.fn() } as any,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      conversationRepo,
    );

    await expect(service.getConversation('conv-1', 'attacker-user')).rejects.toThrow(ForbiddenException);
    await expect(service.deleteConversation('conv-1', 'attacker-user')).rejects.toThrow(ForbiddenException);

    conversationRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.getConversation('missing', 'owner-user')).rejects.toThrow(NotFoundException);
  });
});
