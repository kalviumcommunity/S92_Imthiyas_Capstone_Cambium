import {
  Injectable,
  Logger,
  Inject,
  Optional,
  forwardRef,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { HybridSearchService, ScoredOpportunity } from '../opportunities/hybrid-search.service';
import { OpportunitiesService } from '../opportunities/opportunities.service';
import { AiModelRegistry } from '../ai/ai-model-registry';
import { AiPromptRegistry } from '../ai/ai-prompt-registry';
import { GeminiProviderService } from '../ai/gemini-provider.service';
import { DocumentRetrievalService, RetrievedChunkResult } from '../ai/document-retrieval.service';
import { AiConversation } from '../ai/entities/ai-conversation.entity';
import { AiMessage } from '../ai/entities/ai-message.entity';
import { AiRequestTelemetry } from '../ai/entities/ai-request-telemetry.entity';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import {
  CitationVerifierService,
  AuthorizedEvidenceSource,
  VerifiedCitation,
} from './citation-verifier.service';
import { AiToolRegistry, ExecutedToolTrace } from './ai-tool-registry';

export interface AssistantChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AssistantChatRequest {
  messages: AssistantChatMessage[];
  conversationId?: string;
  context?: {
    persona?: 'Methodology Auditor' | 'Statistical Rigor' | 'Reproducibility Engine' | string;
    userProfile?: {
      institution?: string;
      careerStage?: string;
      primaryField?: string;
    };
    opportunityId?: string;
    workspaceId?: string;
    conversationId?: string;
    documentSnippet?: string;
  };
}

export interface AssistantChatResponse {
  reply: string;
  conversationId?: string;
  modelUsed?: string;
  promptVersion?: string;
  abstained: boolean;
  uncertaintyNote?: string;
  toolCallsExecuted: ExecutedToolTrace[];
  evidenceCitations: VerifiedCitation[];
}

export interface EligibilityAssessmentResult {
  status:
    | 'ELIGIBILITY_CRITERIA_MATCHED'
    | 'PARTIAL_MATCH_VERIFY_SOLICITATION'
    | 'DEADLINE_EXPIRED'
    | 'INSUFFICIENT_EVIDENCE';
  eligible: boolean | null;
  evidenceConfidence: number | null;
  grantTitle: string;
  funder: string;
  deadline?: string | null;
  criteriaMatched: string[];
  extractedFromDescription: string[];
  missingInformation: string[];
  actionItems: string[];
}

export interface ExtractedDeliverable {
  phase: string;
  item: string;
  sourceClause: string;
}

const DELIVERABLE_CUES =
  /\b(deliverable|milestone|report|submit|submission|data management|dmp|irb|iacuc|ethics|repository|zenodo|dryad|open access|within \d+|month \d+|months \d+|quarter|annual|final technical|phase \d+|deadline)\b/i;

const ELIGIBILITY_CLAUSES: Array<{ regex: RegExp; label: string }> = [
  { regex: /\b(early[- ]career|postdoc|postdoctoral|assistant professor)\b/i, label: 'Career stage eligibility clause in solicitation text' },
  { regex: /\b(principal investigator|\bpi\b|co-pi|faculty)\b/i, label: 'Investigator role requirement identified' },
  { regex: /\b(university|universities|501\(c\)\(3\)|nonprofit|accredited|institution)\b/i, label: 'Institutional eligibility requirement identified' },
  { regex: /\b(irb|iacuc|human subjects|ethics approval)\b/i, label: 'IRB/IACUC/Ethics compliance requirement identified' },
  { regex: /\b(phd|doctorate|doctoral|md)\b/i, label: 'Terminal degree requirement identified' },
  { regex: /\b(international|citizenship|u\.s\. citizen|resident)\b/i, label: 'Geographic or citizenship eligibility rule identified' },
];

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);
  private readonly modelRegistry: AiModelRegistry;
  private readonly promptRegistry: AiPromptRegistry;
  private readonly geminiProvider: GeminiProviderService;
  private readonly citationVerifier: CitationVerifierService;
  private readonly toolRegistry: AiToolRegistry;

  constructor(
    @Inject(forwardRef(() => HybridSearchService))
    private readonly hybridSearch: HybridSearchService,
    @Inject(forwardRef(() => OpportunitiesService))
    private readonly oppService: OpportunitiesService,
    @Optional() modelRegistry?: AiModelRegistry,
    @Optional() promptRegistry?: AiPromptRegistry,
    @Optional() geminiProvider?: GeminiProviderService,
    @Optional() private readonly documentRetrieval?: DocumentRetrievalService,
    @Optional() citationVerifier?: CitationVerifierService,
    @Optional() toolRegistry?: AiToolRegistry,
    @Optional()
    @InjectRepository(AiConversation)
    private readonly conversationRepo?: Repository<AiConversation>,
    @Optional()
    @InjectRepository(AiMessage)
    private readonly messageRepo?: Repository<AiMessage>,
    @Optional()
    @InjectRepository(AiRequestTelemetry)
    private readonly telemetryRepo?: Repository<AiRequestTelemetry>,
    @Optional()
    @InjectRepository(ProjectMember)
    private readonly projectMemberRepo?: Repository<ProjectMember>,
  ) {
    this.modelRegistry = modelRegistry || new AiModelRegistry();
    this.promptRegistry = promptRegistry || new AiPromptRegistry();
    this.geminiProvider = geminiProvider || new GeminiProviderService(this.modelRegistry);
    this.citationVerifier = citationVerifier || new CitationVerifierService();
    this.toolRegistry = toolRegistry || new AiToolRegistry();
  }

  /**
   * Rule-grounded eligibility assessment against stored grant solicitation metadata.
   * Never fabricates a universal passing confidence score when solicitation text is missing.
   */
  async verifyEligibility(args: {
    institution?: string;
    careerStage?: string;
    primaryField?: string;
    opportunityId?: string;
  }): Promise<EligibilityAssessmentResult> {
    let grantDetails: any = null;
    if (args.opportunityId) {
      try {
        const found = await this.oppService.findOne(args.opportunityId);
        grantDetails = found?.data || null;
      } catch {
        grantDetails = null;
      }
    }

    const criteriaMatched: string[] = [];
    const extractedFromDescription: string[] = [];
    const missingInformation: string[] = [];

    if (!args.institution?.trim()) {
      missingInformation.push('Applicant institution / tax status (e.g., accredited university, 501(c)(3))');
    } else {
      criteriaMatched.push(`Applicant institution provided: ${args.institution.trim()}`);
    }

    if (!args.careerStage?.trim()) {
      missingInformation.push('Applicant career stage (e.g., Postdoc, Early Career PI, Tenured Faculty)');
    } else {
      criteriaMatched.push(`Applicant career stage provided: ${args.careerStage.trim()}`);
    }

    if (!grantDetails) {
      missingInformation.push('Target opportunity record / solicitation text in Cambium repository');
      return {
        status: 'INSUFFICIENT_EVIDENCE',
        eligible: null,
        evidenceConfidence: null,
        grantTitle: 'Unspecified Opportunity (No solicitation loaded)',
        funder: 'Unverified',
        deadline: null,
        criteriaMatched,
        extractedFromDescription,
        missingInformation,
        actionItems: [
          'Select a specific grant or fellowship in Cambium or attach solicitation eligibility clauses.',
          'Provide institution type and investigator career stage before final submission.',
        ],
      };
    }

    const rawDescription = `${grantDetails.title || ''} ${grantDetails.description || ''}`.trim();
    const isExpired =
      grantDetails.deadline && new Date(grantDetails.deadline).getTime() < Date.now();

    for (const rule of ELIGIBILITY_CLAUSES) {
      if (rule.regex.test(rawDescription)) {
        extractedFromDescription.push(rule.label);
      }
    }

    if (grantDetails.description && grantDetails.description.trim().length < 25) {
      missingInformation.push('Full solicitation eligibility criteria text (stored description is brief)');
    }

    if (isExpired) {
      return {
        status: 'DEADLINE_EXPIRED',
        eligible: false,
        evidenceConfidence: 1.0,
        grantTitle: grantDetails.title,
        funder: grantDetails.organization || 'Unverified',
        deadline: new Date(grantDetails.deadline).toISOString(),
        criteriaMatched,
        extractedFromDescription,
        missingInformation,
        actionItems: [
          `Submission deadline (${new Date(grantDetails.deadline).toISOString().slice(0, 10)}) has already passed; check next cycle announcement.`,
        ],
      };
    }

    const totalSignals = extractedFromDescription.length + criteriaMatched.length;
    const status =
      extractedFromDescription.length >= 2 && missingInformation.length === 0
        ? 'ELIGIBILITY_CRITERIA_MATCHED'
        : totalSignals >= 1
          ? 'PARTIAL_MATCH_VERIFY_SOLICITATION'
          : 'INSUFFICIENT_EVIDENCE';

    return {
      status,
      eligible: status === 'ELIGIBILITY_CRITERIA_MATCHED' ? true : null,
      evidenceConfidence:
        status === 'INSUFFICIENT_EVIDENCE'
          ? null
          : Number(Math.min(0.95, 0.35 + totalSignals * 0.12).toFixed(2)),
      grantTitle: grantDetails.title,
      funder: grantDetails.organization || 'Unverified',
      deadline: grantDetails.deadline ? new Date(grantDetails.deadline).toISOString() : null,
      criteriaMatched,
      extractedFromDescription,
      missingInformation,
      actionItems: [
        'Verify primary solicitation guidelines directly with funder announcement.',
        'Confirm indirect cost rate (F&A) and compliance approvals with sponsored programs office.',
      ],
    };
  }

  /**
   * Deterministic clause-based extraction of concrete deliverables and milestones from RFP text.
   * Returns explicit insufficientEvidence when input contains no milestone/deliverable statements.
   */
  async extractDeliverables(rfpText: string): Promise<{
    deliverablesCount: number;
    deliverables: ExtractedDeliverable[];
    insufficientEvidence: boolean;
    note?: string;
  }> {
    const cleanText = (rfpText || '').trim();
    if (!cleanText) {
      return {
        deliverablesCount: 0,
        deliverables: [],
        insufficientEvidence: true,
        note: 'No RFP or solicitation text was provided to extract deliverables.',
      };
    }

    const sentences = cleanText
      .split(/(?<=[.!?])\s+|\r?\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 12);

    const deliverables: ExtractedDeliverable[] = [];
    for (const sentence of sentences) {
      if (!DELIVERABLE_CUES.test(sentence)) continue;
      const timingMatch = sentence.match(
        /\b(within \d+\s+\w+|months?\s+\d+(?:\s*[-–]\s*\d+)?|phase\s+\d+|annual(?:ly)?|quarter(?:ly)?|q[1-4])\b/i,
      );
      deliverables.push({
        phase: timingMatch ? timingMatch[0] : 'Specified in Solicitation',
        item: sentence.slice(0, 220),
        sourceClause: sentence,
      });
      if (deliverables.length >= 12) break;
    }

    if (deliverables.length === 0) {
      return {
        deliverablesCount: 0,
        deliverables: [],
        insufficientEvidence: true,
        note: 'No concrete deliverable, reporting milestone, or deadline clauses matched the provided text.',
      };
    }

    return {
      deliverablesCount: deliverables.length,
      deliverables,
      insufficientEvidence: false,
    };
  }

  private async resolveCallerWorkspaceIds(caller?: AuthenticatedUser): Promise<string[]> {
    if (!caller?.id || !this.projectMemberRepo) return [];
    try {
      const memberships = await this.projectMemberRepo.find({
        where: { userId: caller.id },
      });
      return memberships.map((m) => m.projectId);
    } catch {
      return [];
    }
  }

  private async loadOrCreateConversation(
    request: AssistantChatRequest,
    lastUserMessage: string,
    caller?: AuthenticatedUser,
  ): Promise<string | undefined> {
    if (!caller?.id || !this.conversationRepo) return undefined;

    const requestedConvId = request.conversationId || request.context?.conversationId;
    if (requestedConvId) {
      const existing = await this.conversationRepo.findOne({ where: { id: requestedConvId } });
      if (!existing) {
        throw new NotFoundException('AI conversation session not found');
      }
      if (existing.userId !== caller.id) {
        throw new ForbiddenException('Access denied to requested AI conversation');
      }
      return existing.id;
    }

    try {
      const created = this.conversationRepo.create({
        userId: caller.id,
        workspaceId: request.context?.workspaceId || null,
        persona: request.context?.persona || 'General Assistant',
        title: lastUserMessage.slice(0, 120) || 'Research Session',
      });
      const saved = await this.conversationRepo.save(created);
      return saved.id;
    } catch {
      return undefined;
    }
  }

  private async persistConversationTurns(params: {
    conversationId?: string;
    userId?: string;
    userMessage: string;
    assistantReply: string;
    citations: VerifiedCitation[];
    promptVersion: string;
    modelUsed: string;
    abstained: boolean;
  }): Promise<void> {
    if (!params.conversationId || !params.userId || !this.messageRepo) return;
    try {
      await this.messageRepo.save([
        this.messageRepo.create({
          conversationId: params.conversationId,
          userId: params.userId,
          role: 'user',
          content: params.userMessage,
          citations: [],
          abstained: false,
        }),
        this.messageRepo.create({
          conversationId: params.conversationId,
          userId: params.userId,
          role: 'assistant',
          content: params.assistantReply,
          citations: params.citations,
          promptVersion: params.promptVersion,
          modelUsed: params.modelUsed,
          abstained: params.abstained,
        }),
      ]);
    } catch (err: any) {
      this.logger.warn(`Failed to persist AI conversation messages: ${err.message}`);
    }
  }

  private async recordTelemetry(params: {
    requestId: string;
    userId?: string;
    modelUsed: string;
    promptVersion: string;
    estimatedInputTokens: number;
    estimatedOutputTokens: number;
    estimatedCostUsd: number;
    latencyMs: number;
    retrievedCount: number;
    abstained: boolean;
    status: string;
    errorCode?: string;
  }): Promise<void> {
    if (!this.telemetryRepo) return;
    try {
      await this.telemetryRepo.save(
        this.telemetryRepo.create({
          requestId: params.requestId,
          userId: params.userId || null,
          taskType: 'chat_synthesis',
          modelUsed: params.modelUsed,
          promptVersion: params.promptVersion,
          estimatedInputTokens: params.estimatedInputTokens,
          estimatedOutputTokens: params.estimatedOutputTokens,
          estimatedCostUsd: params.estimatedCostUsd,
          latencyMs: params.latencyMs,
          retrievedCount: params.retrievedCount,
          abstained: params.abstained,
          status: params.status,
          errorCode: params.errorCode || null,
        }),
      );
    } catch (err: any) {
      this.logger.warn(`Failed to persist AI telemetry: ${err.message}`);
    }
  }

  async listConversations(userId: string) {
    if (!this.conversationRepo) return [];
    return this.conversationRepo.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      take: 30,
    });
  }

  async getConversation(conversationId: string, userId: string) {
    if (!this.conversationRepo) {
      throw new NotFoundException('AI conversation persistence unavailable');
    }
    const conversation = await this.conversationRepo.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('AI conversation not found');
    }
    if (conversation.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this conversation');
    }
    const messages = this.messageRepo
      ? await this.messageRepo.find({
          where: { conversationId, userId },
          order: { createdAt: 'ASC' },
        })
      : [];
    return { conversation, messages };
  }

  async deleteConversation(conversationId: string, userId: string) {
    if (!this.conversationRepo) {
      throw new NotFoundException('AI conversation persistence unavailable');
    }
    const conversation = await this.conversationRepo.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException('AI conversation not found');
    }
    if (conversation.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this conversation');
    }
    if (this.messageRepo) {
      await this.messageRepo.delete({ conversationId, userId });
    }
    await this.conversationRepo.delete({ id: conversationId, userId });
    return { deleted: true, conversationId };
  }

  /**
   * Orchestrates evidence-grounded, citation-verified research intelligence with bounded tools.
   */
  async chat(
    request: AssistantChatRequest,
    caller?: AuthenticatedUser,
    requestId?: string,
  ): Promise<AssistantChatResponse> {
    const startMs = Date.now();
    const traceRequestId = requestId || randomUUID();
    const lastUserMessage =
      request.messages?.filter((m) => m.role === 'user').pop()?.content?.trim() || '';

    const conversationId = await this.loadOrCreateConversation(request, lastUserMessage, caller);
    const budget = this.toolRegistry.createBudget();
    const lowerQuery = lastUserMessage.toLowerCase();

    let grantSearchResults: ScoredOpportunity[] = [];
    let chunkResults: RetrievedChunkResult[] = [];
    let eligibilityResult: EligibilityAssessmentResult | undefined;
    let deliverablesResult: Awaited<ReturnType<AssistantService['extractDeliverables']>> | undefined;

    // 1. Bounded Tool Execution: Public Opportunities Search
    const shouldSearchOpps =
      lowerQuery.includes('grant') ||
      lowerQuery.includes('fund') ||
      lowerQuery.includes('opportunity') ||
      lowerQuery.includes('call') ||
      lowerQuery.includes('cfp') ||
      lowerQuery.includes('fellowship') ||
      Boolean(request.context?.opportunityId);

    if (shouldSearchOpps) {
      const oppExec = await this.toolRegistry.executeBounded(
        budget,
        'search_opportunities',
        { query: lastUserMessage, limit: 4 },
        async () => this.hybridSearch.search({ query: lastUserMessage, limit: 4 }),
      );
      if (oppExec.ok && oppExec.data?.results) {
        grantSearchResults = oppExec.data.results;
      }
    }

    // 2. Bounded Tool Execution: ACL-enforced PGVector Workspace Chunk Retrieval
    if (caller?.id && this.documentRetrieval) {
      const memberWorkspaceIds = await this.resolveCallerWorkspaceIds(caller);
      const chunkExec = await this.toolRegistry.executeBounded(
        budget,
        'search_workspace_chunks',
        {
          query: lastUserMessage,
          workspaceId: request.context?.workspaceId,
          topK: 4,
        },
        async () =>
          this.documentRetrieval!.retrieveAuthorizedChunks({
            query: lastUserMessage,
            caller: { id: caller.id, organizationId: caller.organizationId },
            memberWorkspaceIds,
            workspaceId: request.context?.workspaceId,
            topK: 4,
          }),
      );
      if (chunkExec.ok && chunkExec.data?.chunks) {
        chunkResults = chunkExec.data.chunks;
      }
    }

    // 3. Bounded Tool Execution: Rule-based Eligibility Assessment
    if (
      lowerQuery.includes('eligible') ||
      lowerQuery.includes('eligibility') ||
      lowerQuery.includes('qualify')
    ) {
      const eligExec = await this.toolRegistry.executeBounded(
        budget,
        'verify_eligibility',
        {
          institution: request.context?.userProfile?.institution,
          careerStage: request.context?.userProfile?.careerStage,
          opportunityId: request.context?.opportunityId,
        },
        async () =>
          this.verifyEligibility({
            institution: request.context?.userProfile?.institution,
            careerStage: request.context?.userProfile?.careerStage,
            primaryField: request.context?.userProfile?.primaryField,
            opportunityId: request.context?.opportunityId,
          }),
      );
      if (eligExec.ok && eligExec.data) {
        eligibilityResult = eligExec.data;
      }
    }

    // 4. Bounded Tool Execution: Deliverable Clause Extraction
    if (
      lowerQuery.includes('deliverable') ||
      lowerQuery.includes('milestone') ||
      lowerQuery.includes('extract')
    ) {
      const rfpSourceText =
        request.context?.documentSnippet ||
        grantSearchResults.map((r) => r.opportunity.description || '').join('\n');
      const delivExec = await this.toolRegistry.executeBounded(
        budget,
        'extract_deliverables',
        { textLength: rfpSourceText.length },
        async () => this.extractDeliverables(rfpSourceText),
      );
      if (delivExec.ok && delivExec.data) {
        deliverablesResult = delivExec.data;
      }
    }

    // 5. Assemble Authorized Evidence Allowlist
    const authorizedSources: AuthorizedEvidenceSource[] = [];

    for (const r of grantSearchResults) {
      authorizedSources.push({
        sourceId: `opp-${r.opportunity.id}`,
        title: r.opportunity.title,
        funder: r.opportunity.organization,
        provenance: r.opportunity.provenance,
        url: r.opportunity.link || undefined,
        excerpt: r.opportunity.description || `${r.opportunity.title} (${r.opportunity.organization})`,
        rrfScore: r.rrfScore,
        sourceType: 'opportunity',
      });
    }

    for (const c of chunkResults) {
      authorizedSources.push({
        sourceId: `chunk-${c.chunk.id}`,
        title: c.chunk.title || `Document ${c.chunk.documentId}`,
        funder: c.chunk.visibility,
        section: c.chunk.sectionHeader || undefined,
        page: c.chunk.pageNumber || undefined,
        excerpt: c.chunk.content,
        rrfScore: c.rrfScore,
        sourceType: 'document_chunk',
      });
    }

    const cleanSnippet = (request.context?.documentSnippet || '').trim();
    if (cleanSnippet.length > 0) {
      authorizedSources.push({
        sourceId: 'user-snippet',
        title: 'Attached Scholar Excerpt',
        funder: 'User Context',
        excerpt: cleanSnippet.slice(0, 3500),
        sourceType: 'user_snippet',
      });
    }

    const promptBuild = this.promptRegistry.buildGroundedRagPrompt({
      query: lastUserMessage,
      persona: request.context?.persona,
      retrievedSources: authorizedSources.map((s) => ({
        sourceId: s.sourceId,
        title: s.title,
        section: s.section,
        page: s.page,
        excerpt: s.excerpt || '',
      })),
      userContextSnippet: cleanSnippet || undefined,
    });

    // 6. Explicit Abstention Gate when zero authorized evidence exists and no verified tool findings apply
    if (authorizedSources.length === 0 && !eligibilityResult && !deliverablesResult) {
      const abstentionReply =
        'Insufficient evidence in authorized Cambium sources to answer this inquiry reliably. Please narrow your query to indexed funding calls, upload or link a workspace document, or attach a solicitation excerpt.';
      const uncertaintyNote =
        'Abstained: zero matching indexed opportunities, workspace chunks, or attached excerpts were retrieved.';

      await this.persistConversationTurns({
        conversationId,
        userId: caller?.id,
        userMessage: lastUserMessage,
        assistantReply: abstentionReply,
        citations: [],
        promptVersion: promptBuild.version,
        modelUsed: 'grounded-abstention-gate',
        abstained: true,
      });

      await this.recordTelemetry({
        requestId: traceRequestId,
        userId: caller?.id,
        modelUsed: 'grounded-abstention-gate',
        promptVersion: promptBuild.version,
        estimatedInputTokens: this.modelRegistry.estimateTokens(promptBuild.fullText),
        estimatedOutputTokens: this.modelRegistry.estimateTokens(abstentionReply),
        estimatedCostUsd: 0,
        latencyMs: Date.now() - startMs,
        retrievedCount: 0,
        abstained: true,
        status: 'ABSTAINED_NO_EVIDENCE',
      });

      return {
        reply: abstentionReply,
        conversationId,
        modelUsed: 'grounded-abstention-gate',
        promptVersion: promptBuild.version,
        abstained: true,
        uncertaintyNote,
        toolCallsExecuted: budget.getTraces(),
        evidenceCitations: [],
      };
    }

    // 7. Grounded Generation via Centralized GeminiProviderService
    let rawReply: string | null = null;
    let modelUsed = 'deterministic-grounded-synthesis';
    let estInTokens = this.modelRegistry.estimateTokens(promptBuild.fullText);
    let estOutTokens = 0;
    let estCostUsd = 0;
    let providerStatus = 'OFFLINE_SYNTHESIS';
    let providerErrorCode: string | undefined;

    if (this.geminiProvider.isConfigured()) {
      const genResult = await this.geminiProvider.generateText({
        task: 'chat_synthesis',
        prompt: promptBuild.fullText,
      });
      estInTokens = genResult.estimatedInputTokens;
      estOutTokens = genResult.estimatedOutputTokens;
      estCostUsd = genResult.estimatedCostUsd;
      if (genResult.ok && genResult.text) {
        rawReply = genResult.text;
        modelUsed = genResult.modelUsed;
        providerStatus = 'OK';
      } else {
        providerStatus = 'DEGRADED_FALLBACK';
        providerErrorCode = genResult.errorCode;
        this.logger.warn(`Gemini synthesis degraded (${genResult.errorCode}); using deterministic grounded summary.`);
      }
    }

    // 8. Deterministic Grounded Fallback (only cites real retrieved artifacts, never invents claims)
    if (!rawReply) {
      const sections: string[] = [];
      if (grantSearchResults.length > 0) {
        sections.push(
          '### Matching Funding Opportunities (Hybrid RRF Index)\n' +
            grantSearchResults
              .map(
                (r, idx) =>
                  `${idx + 1}. **${r.opportunity.title}** (${r.opportunity.organization}) [src:opp-${r.opportunity.id}] — RRF Score \`${r.rrfScore.toFixed(4)}\``,
              )
              .join('\n'),
        );
      }
      if (chunkResults.length > 0) {
        sections.push(
          '### Authorized Workspace Document Excerpts\n' +
            chunkResults
              .map(
                (c, idx) =>
                  `${idx + 1}. **${c.chunk.title || 'Workspace Document'}**${c.chunk.sectionHeader ? ` (${c.chunk.sectionHeader})` : ''} [src:chunk-${c.chunk.id}]: ${c.chunk.content.slice(0, 200)}...`,
              )
              .join('\n'),
        );
      }
      if (eligibilityResult) {
        sections.push(
          `### Rule-Based Eligibility Check (${eligibilityResult.status})\n` +
            `- **Opportunity**: ${eligibilityResult.grantTitle} (${eligibilityResult.funder})\n` +
            (eligibilityResult.criteriaMatched.length > 0
              ? `- **Provided Profile**: ${eligibilityResult.criteriaMatched.join('; ')}\n`
              : '') +
            (eligibilityResult.extractedFromDescription.length > 0
              ? `- **Matched Solicitation Rules**: ${eligibilityResult.extractedFromDescription.join('; ')}\n`
              : '') +
            (eligibilityResult.missingInformation.length > 0
              ? `- **Unverified / Missing Information**: ${eligibilityResult.missingInformation.join('; ')}`
              : ''),
        );
      }
      if (deliverablesResult) {
        sections.push(
          deliverablesResult.insufficientEvidence
            ? `### Deliverable Extraction\n- ${deliverablesResult.note}`
            : '### Extracted Solicitation Deliverables\n' +
                deliverablesResult.deliverables
                  .map((d) => `- **${d.phase}**: ${d.item}`)
                  .join('\n'),
        );
      }
      if (cleanSnippet && sections.length === 0) {
        sections.push(
          `### Attached Excerpt Summary [src:user-snippet]\nYour attached excerpt (${cleanSnippet.length} characters) is loaded in context while the external LLM provider is offline or degraded. Specify an eligibility, deliverable, or indexed grant query for deterministic rule analysis.`,
        );
      }

      rawReply = sections.join('\n\n');
      estOutTokens = this.modelRegistry.estimateTokens(rawReply);
    }

    // 9. Strict Post-Generation Citation Verification
    const verification = this.citationVerifier.verifyCitations(rawReply, authorizedSources);
    const uncertaintyNote =
      verification.unverifiedClaimsRemoved > 0
        ? `Removed ${verification.unverifiedClaimsRemoved} unverified citation/DOI reference(s) outside the retrieved evidence set.`
        : providerStatus === 'OFFLINE_SYNTHESIS' || providerStatus === 'DEGRADED_FALLBACK'
          ? 'Generated using deterministic evidence synthesis (external generative model offline or unavailable).'
          : undefined;

    await this.persistConversationTurns({
      conversationId,
      userId: caller?.id,
      userMessage: lastUserMessage,
      assistantReply: verification.cleanedText,
      citations: verification.verifiedCitations,
      promptVersion: promptBuild.version,
      modelUsed,
      abstained: false,
    });

    await this.recordTelemetry({
      requestId: traceRequestId,
      userId: caller?.id,
      modelUsed,
      promptVersion: promptBuild.version,
      estimatedInputTokens: estInTokens,
      estimatedOutputTokens: estOutTokens,
      estimatedCostUsd: estCostUsd,
      latencyMs: Date.now() - startMs,
      retrievedCount: authorizedSources.length,
      abstained: false,
      status: providerStatus,
      errorCode: providerErrorCode,
    });

    return {
      reply: verification.cleanedText,
      conversationId,
      modelUsed,
      promptVersion: promptBuild.version,
      abstained: false,
      ...(uncertaintyNote ? { uncertaintyNote } : {}),
      toolCallsExecuted: budget.getTraces(),
      evidenceCitations: verification.verifiedCitations,
    };
  }

  /**
   * Stream grounded responses token-by-token via Server-Sent Events (SSE)
   */
  async *streamChat(
    request: AssistantChatRequest,
    caller?: AuthenticatedUser,
    requestId?: string,
  ): AsyncGenerator<{ data: string }, void, unknown> {
    const response = await this.chat(request, caller, requestId);
    const words = response.reply.split(' ');
    const chunkSize = 4;

    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(' ') + ' ';
      yield { data: JSON.stringify({ token: chunk, done: false }) };
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    yield {
      data: JSON.stringify({
        token: '',
        done: true,
        conversationId: response.conversationId,
        modelUsed: response.modelUsed,
        promptVersion: response.promptVersion,
        abstained: response.abstained,
        uncertaintyNote: response.uncertaintyNote,
        toolCalls: response.toolCallsExecuted,
        citations: response.evidenceCitations,
      }),
    };
  }
}
