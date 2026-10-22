import { Injectable, Logger } from '@nestjs/common';
import { GeminiEmbeddingService } from '../ai/gemini-embedding.service';

export interface SemanticChunk {
  chunkIndex: number;
  sectionHeader: string;
  pageNumber: number;
  text: string;
  charCount: number;
  embedding?: number[];
}

export interface ParsedDocument {
  title: string;
  totalChunks: number;
  estimatedPages: number;
  chunks: SemanticChunk[];
  abstract?: string;
}

@Injectable()
export class DocumentParserService {
  private readonly logger = new Logger(DocumentParserService.name);

  constructor(private readonly embeddingService: GeminiEmbeddingService) {}

  /**
   * Parses raw document text or extracted PDF text into semantic chunks with embeddings.
   */
  async parseAndChunk(
    rawText: string,
    documentTitle: string = 'Untitled Manuscript',
    generateEmbeddings: boolean = true,
  ): Promise<ParsedDocument> {
    const cleanText = rawText.replace(/\r\n/g, '\n').trim();
    if (!cleanText) {
      return {
        title: documentTitle,
        totalChunks: 0,
        estimatedPages: 0,
        chunks: [],
      };
    }

    // Split text by standard academic headings or paragraph blocks
    const sectionRegex = /(^(?:Abstract|Introduction|Methods|Methodology|Results|Discussion|Conclusion|References)[\s\S]*?)(?=(?:Abstract|Introduction|Methods|Methodology|Results|Discussion|Conclusion|References)|$)/gim;
    const rawSections = cleanText.split(/\n{2,}/);

    const chunks: SemanticChunk[] = [];
    let currentChunkIndex = 0;
    let accumulatedChars = 0;
    const targetChunkSize = 1200; // ~250-300 words

    let currentSection = 'Introduction / General';
    let buffer = '';

    for (const paragraph of rawSections) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      // Detect potential section headers
      if (
        trimmed.length < 60 &&
        /^(?:Abstract|Introduction|Related Work|Methodology|Experimental Setup|Results|Discussion|Conclusion|Compliance|Governance)/i.test(
          trimmed,
        )
      ) {
        currentSection = trimmed;
      }

      buffer += (buffer ? '\n\n' : '') + trimmed;

      if (buffer.length >= targetChunkSize) {
        accumulatedChars += buffer.length;
        const pageNumber = Math.max(1, Math.ceil(accumulatedChars / 3000)); // ~3000 chars per academic page

        chunks.push({
          chunkIndex: currentChunkIndex++,
          sectionHeader: currentSection,
          pageNumber,
          text: buffer,
          charCount: buffer.length,
        });
        buffer = '';
      }
    }

    // Flush any remaining buffer
    if (buffer.trim()) {
      accumulatedChars += buffer.length;
      chunks.push({
        chunkIndex: currentChunkIndex++,
        sectionHeader: currentSection,
        pageNumber: Math.max(1, Math.ceil(accumulatedChars / 3000)),
        text: buffer,
        charCount: buffer.length,
      });
    }

    // Generate embeddings for chunks if requested
    if (generateEmbeddings && chunks.length > 0) {
      try {
        const textSnippets = chunks.map((c) => `${c.sectionHeader}: ${c.text.slice(0, 500)}`);
        const embeddings = await this.embeddingService.generateBatchEmbeddings(textSnippets, 5);
        embeddings.forEach((res, i) => {
          if (chunks[i]) {
            chunks[i].embedding = res.embedding;
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
}
