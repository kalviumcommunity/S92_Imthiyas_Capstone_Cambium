import { Injectable, Logger, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentChunk } from './entities/document-chunk.entity';
import { GeminiEmbeddingService } from './gemini-embedding.service';
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard';

export interface AuthorizedRetrievalQuery {
  query: string;
  caller: Pick<AuthenticatedUser, 'id' | 'organizationId'>;
  memberWorkspaceIds?: string[];
  workspaceId?: string;
  documentId?: string;
  topK?: number;
  maxCosineDistance?: number;
}

export interface RetrievedChunkResult {
  chunk: DocumentChunk;
  rrfScore: number;
  cosineDistance?: number;
  semanticRank?: number;
  lexicalRank?: number;
}

@Injectable()
export class DocumentRetrievalService {
  private readonly logger = new Logger(DocumentRetrievalService.name);
  private readonly RRF_K = 60;

  constructor(
    @Optional()
    @InjectRepository(DocumentChunk)
    private readonly chunkRepo?: Repository<DocumentChunk>,
    @Optional()
    @Inject(GeminiEmbeddingService)
    private readonly embeddingService?: GeminiEmbeddingService,
  ) {}

  /**
   * Authorization-first Hybrid Retrieval across pgvector document chunks.
   * Caller ACL boundaries (PUBLIC | ownerId | memberWorkspaceIds | organizationId) are ALWAYS
   * enforced BEFORE similarity ranking so unauthorized chunks can never enter LLM context.
   */
  async retrieveAuthorizedChunks(
    options: AuthorizedRetrievalQuery,
  ): Promise<{
    chunks: RetrievedChunkResult[];
    latencyMs: number;
  }> {
    const startMs = Date.now();
    if (!this.chunkRepo) {
      return { chunks: [], latencyMs: Date.now() - startMs };
    }

    const topK = Math.min(Math.max(Number(options.topK) || 5, 1), 25);
    const cleanQuery = (options.query || '').trim();
    if (!cleanQuery) {
      return { chunks: [], latencyMs: Date.now() - startMs };
    }

    const embService = this.embeddingService || new GeminiEmbeddingService();
    const { embedding } = await embService.generateEmbedding(cleanQuery);
    const vectorLiteral = `[${embedding.join(',')}]`;

    const [semantic, lexical] = await Promise.all([
      this.fetchAuthorizedSemantic(vectorLiteral, topK * 2, options),
      this.fetchAuthorizedLexical(cleanQuery, topK * 2, options),
    ]);

    const merged = new Map<string, RetrievedChunkResult>();
    const seenContentHashes = new Set<string>();

    semantic.forEach((entry, idx) => {
      const distance = entry.rawDistance !== undefined ? parseFloat(entry.rawDistance) : undefined;
      if (
        options.maxCosineDistance !== undefined &&
        distance !== undefined &&
        distance > options.maxCosineDistance
      ) {
        return;
      }
      if (seenContentHashes.has(entry.contentHash)) return;
      seenContentHashes.add(entry.contentHash);

      const rank = idx + 1;
      merged.set(entry.id, {
        chunk: entry,
        rrfScore: 1 / (this.RRF_K + rank),
        semanticRank: rank,
        cosineDistance: distance,
      });
    });

    lexical.forEach((chunk, idx) => {
      const rank = idx + 1;
      const lexScore = 1 / (this.RRF_K + rank);
      const existing = merged.get(chunk.id);
      if (existing) {
        existing.rrfScore += lexScore;
        existing.lexicalRank = rank;
      } else if (!seenContentHashes.has(chunk.contentHash)) {
        seenContentHashes.add(chunk.contentHash);
        merged.set(chunk.id, {
          chunk,
          rrfScore: lexScore,
          lexicalRank: rank,
        });
      }
    });

    const ranked = Array.from(merged.values())
      .sort((a, b) => b.rrfScore - a.rrfScore)
      .slice(0, topK);

    return {
      chunks: ranked,
      latencyMs: Date.now() - startMs,
    };
  }

  private applyAuthorizationScope(qb: any, options: AuthorizedRetrievalQuery): void {
    const clauses: string[] = [
      `chunk.visibility = 'PUBLIC'`,
      `chunk.ownerId = :callerId`,
    ];
    const params: Record<string, any> = {
      callerId: options.caller.id,
    };

    const wsIds = (options.memberWorkspaceIds || []).filter(Boolean);
    if (wsIds.length > 0) {
      clauses.push(`(chunk.visibility = 'WORKSPACE' AND chunk.workspaceId IN (:...wsIds))`);
      params.wsIds = wsIds;
    }

    if (options.caller.organizationId) {
      clauses.push(
        `(chunk.visibility = 'ORGANIZATION' AND chunk.organizationId = :orgId)`,
      );
      params.orgId = options.caller.organizationId;
    }

    qb.where(`(${clauses.join(' OR ')})`, params);

    if (options.workspaceId) {
      qb.andWhere('chunk.workspaceId = :filterWsId', { filterWsId: options.workspaceId });
    }
    if (options.documentId) {
      qb.andWhere('chunk.documentId = :filterDocId', { filterDocId: options.documentId });
    }
  }

  private async fetchAuthorizedSemantic(
    vectorLiteral: string,
    limit: number,
    options: AuthorizedRetrievalQuery,
  ): Promise<(DocumentChunk & { rawDistance?: string })[]> {
    try {
      const qb = this.chunkRepo!.createQueryBuilder('chunk');
      this.applyAuthorizationScope(qb, options);
      qb.andWhere('chunk.embedding IS NOT NULL')
        .addSelect('chunk.embedding <=> :vectorLiteral::vector', 'rawDistance')
        .setParameter('vectorLiteral', vectorLiteral)
        .orderBy('rawDistance', 'ASC')
        .take(limit);

      const rawAndEntities = await qb.getRawAndEntities();
      return rawAndEntities.entities.map((entity, idx) =>
        Object.assign(entity, { rawDistance: rawAndEntities.raw[idx]?.rawDistance }),
      );
    } catch (err: any) {
      this.logger.warn(`Chunk vector retrieval degraded: ${err?.message}`);
      return [];
    }
  }

  private async fetchAuthorizedLexical(
    query: string,
    limit: number,
    options: AuthorizedRetrievalQuery,
  ): Promise<DocumentChunk[]> {
    try {
      const qb = this.chunkRepo!.createQueryBuilder('chunk');
      this.applyAuthorizationScope(qb, options);
      qb.andWhere(
        `(chunk.title ILIKE :q OR chunk.sectionHeader ILIKE :q OR chunk.content ILIKE :q)`,
        { q: `%${query}%` },
      )
        .orderBy('chunk.createdAt', 'DESC')
        .take(limit);
      return await qb.getMany();
    } catch (err: any) {
      this.logger.warn(`Chunk lexical retrieval degraded: ${err?.message}`);
      return [];
    }
  }
}
