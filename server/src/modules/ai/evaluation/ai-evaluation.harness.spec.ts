import { describe, it, expect, beforeEach } from 'vitest';
import dataset from './golden-dataset.json';
import { DocumentRetrievalService } from '../document-retrieval.service';
import { AiModelRegistry } from '../ai-model-registry';
import { AiPromptRegistry } from '../ai-prompt-registry';
import { CitationVerifierService } from '../../assistant/citation-verifier.service';
import { AssistantService } from '../../assistant/assistant.service';
import type { DocumentChunk } from '../entities/document-chunk.entity';

interface EvalCase {
  id: string;
  category: string;
  query?: string;
  relevantDocIds?: string[];
  ownerId?: string;
  callerId?: string;
  workspaceId?: string;
  expectedAbstain?: boolean;
  documentSnippet?: string;
  rfpText?: string;
  expectedDeliverablesCount?: number;
  rawLlmOutput?: string;
  authorizedSourceIds?: string[];
  expectedRemovedCount?: number;
}

const SEED_OPPORTUNITIES = [
  {
    id: 'nsf-polar-01',
    title: 'NSF Polar Climatology Early Career Grant',
    organization: 'National Science Foundation',
    type: 'Grant',
    provenance: 'NSF_FASTLANE',
    description:
      'Eligible applicants include accredited universities and early-career faculty investigators conducting Antarctic atmospheric field studies. Annual progress reports required.',
    link: 'https://www.nsf.gov/funding/polar-climatology',
    deadline: new Date('2028-06-30T00:00:00Z'),
  },
];

const SEED_CHUNKS: DocumentChunk[] = [
  {
    id: 'chunk-fair-1',
    documentId: 'doc-fair-pipeline',
    ownerId: 'user-a',
    workspaceId: null,
    organizationId: null,
    visibility: 'PRIVATE',
    title: 'FAIR Zenodo Data Archival Pipeline',
    sectionHeader: 'Compliance',
    pageNumber: 3,
    chunkIndex: 0,
    content:
      'All experimental datasets must be deposited to Zenodo under CC-BY 4.0 licensing with immutable DOI minting.',
    contentHash: 'hash-fair-1',
    embeddingModel: 'gemini-embedding-001',
    embeddingVersion: 'v1-768d',
    metadata: {},
    createdAt: new Date('2026-10-01T00:00:00Z'),
  },
  {
    id: 'chunk-priv-a1',
    documentId: 'doc-user-a-private',
    ownerId: 'user-a',
    workspaceId: null,
    organizationId: null,
    visibility: 'PRIVATE',
    title: 'Confidential User A Preliminary Draft',
    sectionHeader: 'Findings',
    pageNumber: 1,
    chunkIndex: 0,
    content: 'Confidential User A private manuscript preliminary findings not yet cleared for release.',
    contentHash: 'hash-priv-a1',
    embeddingModel: 'gemini-embedding-001',
    embeddingVersion: 'v1-768d',
    metadata: {},
    createdAt: new Date('2026-10-02T00:00:00Z'),
  },
  {
    id: 'chunk-irb-1',
    documentId: 'doc-irb-sop',
    ownerId: 'user-a',
    workspaceId: 'ws-ethics-1',
    organizationId: null,
    visibility: 'WORKSPACE',
    title: 'SMART IRB Multisite Reliance SOP',
    sectionHeader: 'Governance',
    pageNumber: 2,
    chunkIndex: 0,
    content:
      'Single IRB reliance agreements under SMART IRB finalize participating site onboarding within 21 calendar days.',
    contentHash: 'hash-irb-1',
    embeddingModel: 'gemini-embedding-001',
    embeddingVersion: 'v1-768d',
    metadata: {},
    createdAt: new Date('2026-10-03T00:00:00Z'),
  },
  {
    id: 'chunk-cohort-1',
    documentId: 'doc-cohort-v1',
    ownerId: 'user-a',
    workspaceId: null,
    organizationId: null,
    visibility: 'PRIVATE',
    title: 'Protocol Cohort Sample Size v1',
    sectionHeader: 'Methods',
    pageNumber: 1,
    chunkIndex: 0,
    content: 'Initial cohort protocol cohort sample size specifies n=120 enrolled participants across uploaded drafts.',
    contentHash: 'hash-cohort-1',
    embeddingModel: 'gemini-embedding-001',
    embeddingVersion: 'v1-768d',
    metadata: {},
    createdAt: new Date('2026-10-04T00:00:00Z'),
  },
  {
    id: 'chunk-cohort-2',
    documentId: 'doc-cohort-v2',
    ownerId: 'user-a',
    workspaceId: null,
    organizationId: null,
    visibility: 'PRIVATE',
    title: 'Protocol Cohort Sample Size v2',
    sectionHeader: 'Amendment',
    pageNumber: 2,
    chunkIndex: 0,
    content: 'Amended cohort protocol cohort sample size updates enrollment to n=185 across uploaded drafts.',
    contentHash: 'hash-cohort-2',
    embeddingModel: 'gemini-embedding-001',
    embeddingVersion: 'v1-768d',
    metadata: {},
    createdAt: new Date('2026-10-05T00:00:00Z'),
  },
];

function createAclMockChunkRepo(chunks: DocumentChunk[]) {
  return {
    createQueryBuilder: () => {
      let aclParams: { callerId?: string; wsIds?: string[]; orgId?: string } = {};
      let filterWsId: string | undefined;
      let lexicalNeedle: string | undefined;
      let semanticMode = false;

      const qb: any = {
        where: (_sql: string, params: Record<string, any>) => {
          aclParams = params || {};
          return qb;
        },
        andWhere: (sql: string, params?: Record<string, any>) => {
          if (sql.includes('filterWsId') && params?.filterWsId) {
            filterWsId = params.filterWsId;
          }
          if (sql.includes('ILIKE') && params?.q) {
            lexicalNeedle = String(params.q).replace(/%/g, '').toLowerCase();
          }
          if (sql.includes('embedding IS NOT NULL')) {
            semanticMode = true;
          }
          return qb;
        },
        addSelect: () => qb,
        setParameter: () => qb,
        orderBy: () => qb,
        take: () => qb,
        getRawAndEntities: async () => ({ entities: [], raw: [] }),
        getMany: async () => {
          if (semanticMode) return [];
          const needleTerms = (lexicalNeedle || '')
            .split(/\s+/)
            .filter((w) => w.length >= 3);

          return chunks.filter((c) => {
            const aclAllowed =
              c.visibility === 'PUBLIC' ||
              c.ownerId === aclParams.callerId ||
              (c.visibility === 'WORKSPACE' &&
                c.workspaceId &&
                Array.isArray(aclParams.wsIds) &&
                aclParams.wsIds.includes(c.workspaceId)) ||
              (c.visibility === 'ORGANIZATION' &&
                c.organizationId &&
                c.organizationId === aclParams.orgId);

            if (!aclAllowed) return false;
            if (filterWsId && c.workspaceId !== filterWsId) return false;
            if (needleTerms.length === 0) return true;

            const haystack = `${c.title} ${c.sectionHeader} ${c.content}`.toLowerCase();
            return needleTerms.some((term) => haystack.includes(term));
          });
        },
      };
      return qb;
    },
  };
}

function createMockHybridSearch() {
  return {
    search: async ({ query, limit = 4 }: { query: string; limit?: number }) => {
      const terms = query.toLowerCase().split(/\s+/).filter((w) => w.length >= 3);
      const matched = SEED_OPPORTUNITIES.filter((opp) => {
        const hay = `${opp.title} ${opp.organization} ${opp.description}`.toLowerCase();
        return terms.some((t) => hay.includes(t) && (hay.includes('nsf') || hay.includes('polar')));
      }).slice(0, limit);

      return {
        success: true,
        query,
        count: matched.length,
        results: matched.map((opp, idx) => ({
          opportunity: opp,
          rrfScore: 1 / (60 + idx + 1),
          lexicalRank: idx + 1,
        })),
      };
    },
  };
}

describe('Cambium Executable AI Evaluation Harness (Golden Dataset)', () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it('evaluates retrieval IR metrics, ACL isolation, citation verification, abstention accuracy, and cost budgets', async () => {
    const cases = dataset as EvalCase[];
    const retrievalService = new DocumentRetrievalService(createAclMockChunkRepo(SEED_CHUNKS) as any);
    const modelRegistry = new AiModelRegistry();
    const promptRegistry = new AiPromptRegistry();
    const verifier = new CitationVerifierService();
    const assistant = new AssistantService(
      createMockHybridSearch() as any,
      { findOne: async () => ({ data: SEED_OPPORTUNITIES[0] }) } as any,
      modelRegistry,
      promptRegistry,
      undefined,
      retrievalService,
      verifier,
    );

    const k = 4;
    let irEvaluated = 0;
    let recallSum = 0;
    let precisionSum = 0;
    let mrrSum = 0;
    let ndcgSum = 0;

    let abstentionChecks = 0;
    let abstentionCorrect = 0;
    let crossTenantLeaks = 0;
    let citationChecks = 0;
    let citationChecksValid = 0;
    let injectionIsolated = 0;

    for (const item of cases) {
      if (item.category === 'grant_discovery' || item.category === 'workspace_rag' || item.category === 'grounded_synthesis') {
        const res = await assistant.chat(
          {
            messages: [{ role: 'user', content: item.query || '' }],
            context: {
              ...(item.workspaceId ? { workspaceId: item.workspaceId } : {}),
            },
          },
          { id: item.callerId || item.ownerId || 'user-a', role: 'RESEARCHER' } as any,
          `eval-${item.id}`,
        );

        const projectMemberRepoLookup = item.workspaceId ? [item.workspaceId] : [];
        let retrievedDocIds: string[] = [];

        if (item.category === 'grant_discovery') {
          retrievedDocIds = res.evidenceCitations.map((c) => c.sourceId);
        } else {
          const directChunks = await retrievalService.retrieveAuthorizedChunks({
            query: item.query || '',
            caller: { id: item.callerId || item.ownerId || 'user-a' },
            memberWorkspaceIds: projectMemberRepoLookup,
            workspaceId: item.workspaceId,
            topK: k,
          });
          retrievedDocIds = directChunks.chunks.map((c) => c.chunk.documentId);
        }

        const relSet = new Set(item.relevantDocIds || []);
        const hits = retrievedDocIds.filter((id) => relSet.has(id)).length;
        const recallAtK = relSet.size > 0 ? hits / relSet.size : 1;
        const precisionAtK = retrievedDocIds.length > 0 ? hits / retrievedDocIds.length : 0;

        let rr = 0;
        let dcg = 0;
        let idcg = 0;
        retrievedDocIds.slice(0, k).forEach((id, idx) => {
          if (relSet.has(id)) {
            if (rr === 0) rr = 1 / (idx + 1);
            dcg += 1 / Math.log2(idx + 2);
          }
        });
        for (let i = 0; i < Math.min(k, relSet.size); i++) {
          idcg += 1 / Math.log2(i + 2);
        }
        const ndcg = idcg > 0 ? dcg / idcg : 0;

        recallSum += recallAtK;
        precisionSum += precisionAtK;
        mrrSum += rr;
        ndcgSum += ndcg;
        irEvaluated += 1;

        abstentionChecks += 1;
        if (res.abstained === Boolean(item.expectedAbstain)) abstentionCorrect += 1;
      } else if (item.category === 'acl_isolation' || item.category === 'abstention') {
        const res = await assistant.chat(
          { messages: [{ role: 'user', content: item.query || '' }] },
          { id: item.callerId || 'user-b', role: 'RESEARCHER' } as any,
          `eval-${item.id}`,
        );

        const directChunks = await retrievalService.retrieveAuthorizedChunks({
          query: item.query || '',
          caller: { id: item.callerId || 'user-b' },
          topK: k,
        });

        if (item.category === 'acl_isolation' && directChunks.chunks.length > 0) {
          crossTenantLeaks += directChunks.chunks.length;
        }

        abstentionChecks += 1;
        if (res.abstained === Boolean(item.expectedAbstain)) abstentionCorrect += 1;
      } else if (item.category === 'prompt_injection_defense') {
        const built = promptRegistry.buildGroundedRagPrompt({
          query: item.query || '',
          retrievedSources: [],
          userContextSnippet: item.documentSnippet,
        });
        const properlyDelimited =
          built.fullText.includes('<untrusted_source_data>') &&
          built.fullText.includes('</untrusted_source_data>') &&
          built.fullText.includes('SECURITY INSTRUCTION') &&
          built.fullText.indexOf('<untrusted_source_data>') < built.fullText.indexOf(item.documentSnippet || '');
        if (properlyDelimited) injectionIsolated += 1;
      } else if (item.category === 'deliverables_extraction') {
        const deliv = await assistant.extractDeliverables(item.rfpText || '');
        expect(deliv.deliverablesCount).toBe(item.expectedDeliverablesCount);
        abstentionChecks += 1;
        if (deliv.insufficientEvidence === Boolean(item.expectedAbstain)) abstentionCorrect += 1;
      } else if (item.category === 'citation_verification') {
        const verified = verifier.verifyCitations(
          item.rawLlmOutput || '',
          (item.authorizedSourceIds || []).map((id) => ({
            sourceId: id,
            title: 'Authorized Source',
            sourceType: 'opportunity',
          })),
        );
        citationChecks += 1;
        if (verified.unverifiedClaimsRemoved === item.expectedRemovedCount) {
          citationChecksValid += 1;
        }
      }
    }

    const avgRecall = recallSum / irEvaluated;
    const avgPrecision = precisionSum / irEvaluated;
    const avgMrr = mrrSum / irEvaluated;
    const avgNdcg = ndcgSum / irEvaluated;
    const abstentionAccuracy = abstentionCorrect / abstentionChecks;
    const citationValidityRate = citationChecksValid / citationChecks;

    // Enforce token budget & cost estimation check
    const oversizedPrompt = 'token '.repeat(20_000);
    const budgetCheck = modelRegistry.enforceInputBudget('chat_synthesis', oversizedPrompt);
    expect(budgetCheck.wasTruncated).toBe(true);
    expect(budgetCheck.tokens).toBeLessThanOrEqual(modelRegistry.getSpec('chat_synthesis').maxInputTokens);

    const summary = {
      datasetCases: cases.length,
      irEvaluatedQueries: irEvaluated,
      recallAt4: Number(avgRecall.toFixed(4)),
      precisionAt4: Number(avgPrecision.toFixed(4)),
      mrr: Number(avgMrr.toFixed(4)),
      ndcgAt4: Number(avgNdcg.toFixed(4)),
      abstentionAccuracy: Number(abstentionAccuracy.toFixed(4)),
      citationValidityRate: Number(citationValidityRate.toFixed(4)),
      crossTenantLeaks,
      injectionIsolated,
    };

    console.info('[AI-EVAL-SUMMARY]', JSON.stringify(summary));

    expect(cases.length).toBe(10);
    expect(crossTenantLeaks).toBe(0);
    expect(avgRecall).toBeGreaterThanOrEqual(0.95);
    expect(avgMrr).toBeGreaterThanOrEqual(0.95);
    expect(avgNdcg).toBeGreaterThanOrEqual(0.95);
    expect(abstentionAccuracy).toBe(1.0);
    expect(citationValidityRate).toBe(1.0);
    expect(injectionIsolated).toBe(1);
  });
});
