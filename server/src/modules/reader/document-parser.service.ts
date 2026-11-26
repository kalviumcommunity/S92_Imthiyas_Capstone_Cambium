import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { GeminiEmbeddingService } from '../ai/gemini-embedding.service';
import { DocumentChunk, DocumentVisibility } from '../ai/entities/document-chunk.entity';

export interface SemanticChunk {
  chunkIndex: number;
  sectionHeader: string;
  pageNumber: number;
  text: string;
  charCount: number;
  estimatedTokens: number;
  contentHash: string;
  embedding?: number[];
  embeddingModel?: string;
  embeddingVersion?: string;
}

export interface ParsedDocument {
  title: string;
  totalChunks: number;
  estimatedPages: number;
  chunks: SemanticChunk[];
  abstract?: string;
}

export interface IngestDocumentOptions {
  documentId: string;
  ownerId: string;
  title: string;
  rawText: string;
  workspaceId?: string | null;
  organizationId?: string | null;
  visibility?: DocumentVisibility;
  metadata?: Record<string, any>;
}

@Injectable()
export class DocumentParserService {
  private readonly logger = new Logger(DocumentParserService.name);
  private readonly targetChunkChars = 1400; // ~350 tokens
  private readonly overlapChars = 180; // ~45 token contextual overlap

  constructor(
    @Optional() private readonly embeddingService?: GeminiEmbeddingService,
    @Optional()
    @InjectRepository(DocumentChunk)
    private readonly chunkRepo?: Repository<DocumentChunk>,
  ) {}

  private computeHash(text: string): string {
    return createHash('sha256').update(text.trim()).digest('hex');
  }

  /**
   * Parses raw document or extracted PDF text into heading/page/token-aware overlapping chunks
   * with SHA-256 content hashes and optional pgvector embeddings.
   */
  async parseAndChunk(
    rawText: string,
    documentTitle: string = 'Untitled Manuscript',
    generateEmbeddings: boolean = true,
  ): Promise<ParsedDocument> {
    const cleanText = (rawText || '').replace(/\r\n/g, '\n').trim();
    if (!cleanText) {
      return {
        title: documentTitle,
        totalChunks: 0,
        estimatedPages: 0,
        chunks: [],
      };
    }

    const rawBlocks = cleanText.split(/\n{2,}/);
    const chunks: SemanticChunk[] = [];
    let currentChunkIndex = 0;
    let accumulatedChars = 0;
    let currentSection = 'Introduction / General';
    let buffer = '';

    const pushChunk = (textVal: string) => {
      const normalized = textVal.trim();
      if (!normalized) return;
      accumulatedChars += normalized.length;
      const pageNumber = Math.max(1, Math.ceil(accumulatedChars / 3000));
      chunks.push({
        chunkIndex: currentChunkIndex++,
        sectionHeader: currentSection,
        pageNumber,
        text: normalized,
        charCount: normalized.length,
        estimatedTokens: Math.ceil(normalized.length / 4),
        contentHash: this.computeHash(`${currentSection}::${normalized}`),
      });
    };

    for (const block of rawBlocks) {
      const trimmed = block.trim();
      if (!trimmed) continue;

      if (
        trimmed.length < 80 &&
        /^(?:Abstract|Introduction|Related Work|Methods|Methodology|Experimental Setup|Results|Discussion|Conclusion|References|Compliance|Governance|\d+(?:\.\d+)*\s+[A-Z])/i.test(
          trimmed,
        )
      ) {
        if (buffer.trim()) {
          pushChunk(buffer);
          buffer = '';
        }
        currentSection = trimmed;
      }

      buffer += (buffer ? '\n\n' : '') + trimmed;

      if (buffer.length >= this.targetChunkChars) {
        pushChunk(buffer);
        // Carry clean trailing sentence overlap across chunk boundaries
        const tail = buffer.slice(-this.overlapChars);
        const sentenceBreak = tail.indexOf('. ');
        buffer = sentenceBreak >= 0 ? tail.slice(sentenceBreak + 2).trim() : tail.trim();
      }
    }

    if (buffer.trim()) {
      pushChunk(buffer);
    }

    const embService = this.embeddingService || new GeminiEmbeddingService();
    if (generateEmbeddings && chunks.length > 0) {
      try {
        const textSnippets = chunks.map((c) => `${c.sectionHeader}: ${c.text.slice(0, 800)}`);
        const embeddings = await embService.generateBatchEmbeddings(textSnippets, 5);
        embeddings.forEach((res, i) => {
          if (chunks[i]) {
            chunks[i].embedding = res.embedding;
            chunks[i].embeddingModel = res.model;
            chunks[i].embeddingVersion = res.embeddingVersion;
          }
        });
      } catch (err: any) {
        this.logger.warn(`Failed to generate embeddings for document chunks: ${err.message}`);
      }
    }

    const abstractChunk = chunks.find((c) => /abstract/i.test(c.sectionHeader));

    return {
      title: documentTitle,
      totalChunks: chunks.length,
      estimatedPages: Math.max(1, Math.ceil(accumulatedChars / 3000)),
      chunks,
      abstract: abstractChunk ? abstractChunk.text : undefined,
    };
  }

  /**
   * Idempotent ingestion: replaces stale chunks for documentId only when hashes differ,
   * preserving owner/workspace/organization ACL boundaries.
   */
  async ingestDocumentChunks(options: IngestDocumentOptions): Promise<{
    documentId: string;
    persistedCount: number;
    skippedUnchanged: number;
    parsed: ParsedDocument;
  }> {
    const parsed = await this.parseAndChunk(options.rawText, options.title, true);
    if (!this.chunkRepo) {
      return {
        documentId: options.documentId,
        persistedCount: 0,
        skippedUnchanged: 0,
        parsed,
      };
    }

    const existing = await this.chunkRepo.find({
      where: { documentId: options.documentId },
      order: { chunkIndex: 'ASC' },
    });

    const existingHashes = existing.map((e) => e.contentHash).join('|');
    const nextHashes = parsed.chunks.map((c) => c.contentHash).join('|');
    if (existing.length === parsed.chunks.length && existingHashes === nextHashes && existing.length > 0) {
      return {
        documentId: options.documentId,
        persistedCount: 0,
        skippedUnchanged: existing.length,
        parsed,
      };
    }

    await this.chunkRepo.delete({ documentId: options.documentId });
    const entities = parsed.chunks.map((c) =>
      this.chunkRepo!.create({
        documentId: options.documentId,
        ownerId: options.ownerId,
        workspaceId: options.workspaceId || null,
        organizationId: options.organizationId || null,
        visibility: options.visibility || 'PRIVATE',
        title: options.title,
        sectionHeader: c.sectionHeader,
        pageNumber: c.pageNumber,
        chunkIndex: c.chunkIndex,
        content: c.text,
        contentHash: c.contentHash,
        embedding: c.embedding,
        embeddingModel: c.embeddingModel || 'gemini-embedding-001',
        embeddingVersion: c.embeddingVersion || 'v1-768d',
        metadata: {
          estimatedTokens: c.estimatedTokens,
          ...(options.metadata || {}),
        },
      }),
    );

    if (entities.length > 0) {
      await this.chunkRepo.save(entities);
    }

    return {
      documentId: options.documentId,
      persistedCount: entities.length,
      skippedUnchanged: 0,
      parsed,
    };
  }

  async deleteDocumentChunks(documentId: string, ownerId: string): Promise<number> {
    if (!this.chunkRepo) return 0;
    const res = await this.chunkRepo.delete({ documentId, ownerId });
    return res.affected || 0;
  }
}
