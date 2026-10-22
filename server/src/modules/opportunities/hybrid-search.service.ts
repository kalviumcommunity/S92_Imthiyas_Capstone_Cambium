import { Injectable, Logger, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  ResearchOpportunity,
  OpportunityType,
} from './entities/research-opportunity.entity';
import { GeminiEmbeddingService } from '../ai/gemini-embedding.service';

export interface ScoredOpportunity {
  opportunity: ResearchOpportunity;
  rrfScore: number;
  semanticRank?: number;
  lexicalRank?: number;
  cosineDistance?: number;
}

export interface HybridSearchOptions {
  query: string;
  limit?: number;
  type?: OpportunityType;
  funder?: string;
  minRrfScore?: number;
}

@Injectable()
export class HybridSearchService {
  private readonly logger = new Logger(HybridSearchService.name);
  private readonly RRF_K = 60; // Standard Reciprocal Rank Fusion constant
  private _embeddingService?: GeminiEmbeddingService;

  constructor(
    @InjectRepository(ResearchOpportunity)
    private readonly oppRepo: Repository<ResearchOpportunity>,
    @Optional()
    @Inject(GeminiEmbeddingService)
    embeddingService?: GeminiEmbeddingService,
    private readonly dataSource?: DataSource,
  ) {
    this._embeddingService = embeddingService || new GeminiEmbeddingService();
  }

  private get embeddingService(): GeminiEmbeddingService {
    if (!this._embeddingService) {
      this._embeddingService = new GeminiEmbeddingService();
    }
    return this._embeddingService;
  }

  /**
   * Performs enterprise Hybrid Search fusing HNSW vector similarity and GIN text matching via RRF.
   */
  async search(options: HybridSearchOptions): Promise<{
    success: boolean;
    query: string;
    count: number;
    results: ScoredOpportunity[];
  }> {
    const { query, limit = 20, type, funder } = options;
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      const fallbackList = await this.oppRepo.find({
        take: limit,
        order: { createdAt: 'DESC' },
        relations: { tags: true },
      });
      return {
        success: true,
        query: '',
        count: fallbackList.length,
        results: fallbackList.map((opp, idx) => ({
          opportunity: opp,
          rrfScore: 1 / (this.RRF_K + idx + 1),
        })),
      };
    }

    // 1. Generate query embedding (768-dim)
    const { embedding: queryEmbedding } = await this.embeddingService.generateEmbedding(cleanQuery);
    const vectorLiteral = `[${queryEmbedding.join(',')}]`;

    // 2. Parallel Search: Vector Semantic vs. Lexical GIN/ILIKE
    const [semanticCandidates, lexicalCandidates] = await Promise.all([
      this.fetchSemanticCandidates(vectorLiteral, limit * 2, type, funder),
      this.fetchLexicalCandidates(cleanQuery, limit * 2, type, funder),
    ]);

    // 3. Compute Reciprocal Rank Fusion (RRF, k=60)
    const rrfMap = new Map<
      string,
      {
        opportunity: ResearchOpportunity;
        rrfScore: number;
        semanticRank?: number;
        lexicalRank?: number;
        cosineDistance?: number;
      }
    >();

    // Process Semantic Ranks
    semanticCandidates.forEach((item, idx) => {
      const rank = idx + 1;
      const score = 1 / (this.RRF_K + rank);
      rrfMap.set(item.id, {
        opportunity: item,
        rrfScore: score,
        semanticRank: rank,
        cosineDistance: item.rawDistance !== undefined ? parseFloat(item.rawDistance) : undefined,
      });
    });

    // Process Lexical Ranks
    lexicalCandidates.forEach((item, idx) => {
      const rank = idx + 1;
      const score = 1 / (this.RRF_K + rank);
      if (rrfMap.has(item.id)) {
        const existing = rrfMap.get(item.id)!;
        existing.rrfScore += score;
        existing.lexicalRank = rank;
      } else {
        rrfMap.set(item.id, {
          opportunity: item,
          rrfScore: score,
          lexicalRank: rank,
        });
      }
    });

    // 4. Sort by highest RRF score and take top limit
    const sorted = Array.from(rrfMap.values())
      .sort((a, b) => b.rrfScore - a.rrfScore)
      .slice(0, limit);

    return {
      success: true,
      query: cleanQuery,
      count: sorted.length,
      results: sorted,
    };
  }

  private async fetchSemanticCandidates(
    vectorLiteral: string,
    limit: number,
    type?: OpportunityType,
    funder?: string,
  ): Promise<(ResearchOpportunity & { rawDistance?: string })[]> {
    try {
      const qb = this.oppRepo
        .createQueryBuilder('opp')
        .leftJoinAndSelect('opp.tags', 'tag')
        .leftJoinAndSelect('opp.createdBy', 'creator')
        .where('opp.embedding IS NOT NULL')
        .addSelect(`opp.embedding <=> '${vectorLiteral}'::vector`, 'rawDistance')
        .orderBy('rawDistance', 'ASC')
        .take(limit);

      if (type) {
        qb.andWhere('opp.type = :type', { type });
      }
      if (funder) {
        qb.andWhere('opp.organization ILIKE :funder', { funder: `%${funder}%` });
      }

      const rawAndEntities = await qb.getRawAndEntities();
      return rawAndEntities.entities.map((entity, i) => {
        const rawDistance = rawAndEntities.raw[i]?.rawDistance;
        return Object.assign(entity, { rawDistance });
      });
    } catch (err: any) {
      this.logger.warn(`Semantic vector query falling back to in-memory cosine ranking: ${err.message}`);
      return this.fallbackInMemorySemanticSearch(vectorLiteral, limit, type, funder);
    }
  }

  private async fallbackInMemorySemanticSearch(
    vectorLiteral: string,
    limit: number,
    type?: OpportunityType,
    funder?: string,
  ): Promise<(ResearchOpportunity & { rawDistance?: string })[]> {
    try {
      const queryVec: number[] = JSON.parse(vectorLiteral);
      const qb = this.oppRepo
        .createQueryBuilder('opp')
        .leftJoinAndSelect('opp.tags', 'tag')
        .leftJoinAndSelect('opp.createdBy', 'creator')
        .where('opp.embedding IS NOT NULL');

      if (type) qb.andWhere('opp.type = :type', { type });
      if (funder) qb.andWhere('opp.organization ILIKE :funder', { funder: `%${funder}%` });

      const items = await qb.getMany();
      if (!items.length) return [];

      const scored = items.map((opp) => {
        let oppVec: number[] | null = null;
        if (typeof opp.embedding === 'string') {
          try {
            oppVec = JSON.parse(opp.embedding);
          } catch {
            oppVec = null;
          }
        } else if (Array.isArray(opp.embedding)) {
          oppVec = opp.embedding;
        }

        const distance = oppVec ? this.computeCosineDistance(queryVec, oppVec) : 1.0;
        return Object.assign(opp, {
          rawDistance: distance.toFixed(6),
        });
      });

      scored.sort((a, b) => parseFloat(a.rawDistance || '1') - parseFloat(b.rawDistance || '1'));
      return scored.slice(0, limit);
    } catch (fallbackErr: any) {
      this.logger.warn(`In-memory vector fallback failed: ${fallbackErr.message}`);
      return [];
    }
  }

  private computeCosineDistance(vecA: number[], vecB: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    const len = Math.min(vecA.length, vecB.length);
    for (let i = 0; i < len; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 1.0;
    const similarity = dot / (Math.sqrt(normA) * Math.sqrt(normB));
    return Math.max(0, 1 - similarity);
  }

  private async fetchLexicalCandidates(
    query: string,
    limit: number,
    type?: OpportunityType,
    funder?: string,
  ): Promise<ResearchOpportunity[]> {
    try {
      const qb = this.oppRepo
        .createQueryBuilder('opp')
        .leftJoinAndSelect('opp.tags', 'tag')
        .leftJoinAndSelect('opp.createdBy', 'creator')
        .where(
          `(opp.title ILIKE :q OR opp.description ILIKE :q OR opp.organization ILIKE :q OR tag.name ILIKE :q)`,
          { q: `%${query}%` },
        )
        .orderBy('opp.createdAt', 'DESC')
        .take(limit);

      if (type) {
        qb.andWhere('opp.type = :type', { type });
      }
      if (funder) {
        qb.andWhere('opp.organization ILIKE :funder', { funder: `%${funder}%` });
      }

      return await qb.getMany();
    } catch (err: any) {
      this.logger.warn(`Lexical search query fallback: ${err.message}`);
      return [];
    }
  }
}
