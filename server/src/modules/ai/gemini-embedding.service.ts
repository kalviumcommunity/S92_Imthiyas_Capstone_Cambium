import { Injectable, Logger, Optional } from '@nestjs/common';
import { createHash } from 'crypto';
import { AiModelRegistry } from './ai-model-registry';

export interface EmbeddingResult {
  embedding: number[];
  dimension: number;
  model: string;
  embeddingVersion: string;
  isMockFallback: boolean;
}

@Injectable()
export class GeminiEmbeddingService {
  private readonly logger = new Logger(GeminiEmbeddingService.name);
  private readonly registry: AiModelRegistry;

  constructor(@Optional() registry?: AiModelRegistry) {
    this.registry = registry || new AiModelRegistry();
  }

  private get defaultModel(): string {
    return this.registry.getSpec('embedding').modelId;
  }

  private get embeddingVersion(): string {
    return this.registry.getSpec('embedding').version;
  }

  private get targetDimension(): number {
    return this.registry.getSpec('embedding').embeddingDimensions || 768;
  }

  private getApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY;
  }

  /**
   * Generates a 768-dimensional normalized embedding for text using Google Gemini.
   * Enforces AbortController timeouts & dimension validation, falling back cleanly
   * to a deterministic L2-normalized 768-dim vector when offline.
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    const apiKey = this.getApiKey();
    const spec = this.registry.getSpec('embedding');
    const cleanText = text.trim();

    if (!cleanText) {
      return {
        embedding: new Array(this.targetDimension).fill(0),
        dimension: this.targetDimension,
        model: this.defaultModel,
        embeddingVersion: this.embeddingVersion,
        isMockFallback: true,
      };
    }

    if (apiKey && apiKey !== 'your_google_gemini_api_key_here' && apiKey.length > 10) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), spec.timeoutMs);
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.defaultModel}:embedContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model: `models/${this.defaultModel}`,
            content: {
              parts: [{ text: cleanText.slice(0, spec.maxInputTokens * 4) }],
            },
            outputDimensionality: this.targetDimension,
          }),
        });
        clearTimeout(timer);

        if (response.ok) {
          const data = await response.json();
          const values: number[] = data?.embedding?.values || [];
          if (values.length === this.targetDimension) {
            return {
              embedding: values,
              dimension: this.targetDimension,
              model: this.defaultModel,
              embeddingVersion: this.embeddingVersion,
              isMockFallback: false,
            };
          }
          this.logger.warn(
            `Embedding vector dimension mismatch (expected ${this.targetDimension}, got ${values.length}). Falling back cleanly.`,
          );
        } else {
          this.logger.warn(
            `Gemini Embedding API returned status ${response.status}. Using deterministic fallback.`,
          );
        }
      } catch (err: any) {
        clearTimeout(timer);
        this.logger.warn(
          `Gemini Embedding API connection error (${err?.name === 'AbortError' ? 'timeout' : 'network'}). Using deterministic fallback.`,
        );
      }
    }

    // Deterministic mathematical fallback for offline/development mode
    return {
      embedding: this.generateDeterministicVector(cleanText, this.targetDimension),
      dimension: this.targetDimension,
      model: `${this.defaultModel}-deterministic-fallback`,
      embeddingVersion: this.embeddingVersion,
      isMockFallback: true,
    };
  }

  /**
   * Batch generation with rate-limiting support.
   */
  async generateBatchEmbeddings(texts: string[], concurrency = 5): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = [];
    for (let i = 0; i < texts.length; i += concurrency) {
      const chunk = texts.slice(i, i + concurrency);
      const chunkResults = await Promise.all(chunk.map((t) => this.generateEmbedding(t)));
      results.push(...chunkResults);
    }
    return results;
  }

  /**
   * Generates a unit-normalized (L2 norm = 1.0) 768-dimensional float vector
   * derived from the SHA-256 digest of the input string.
   */
  generateDeterministicVector(text: string, dimension: number = 768): number[] {
    const rawVector = new Float64Array(dimension);
    let hash = createHash('sha256').update(text).digest();

    for (let i = 0; i < dimension; i++) {
      if (i % 32 === 0 && i > 0) {
        hash = createHash('sha256').update(hash).digest();
      }
      const byteVal = hash[i % 32];
      // Map byte 0..255 to zero-centered range [-1.0, 1.0]
      rawVector[i] = (byteVal - 127.5) / 127.5;
    }

    // Compute Euclidean L2 Norm: ||v|| = sqrt(sum(v_i^2))
    let sumSq = 0;
    for (let i = 0; i < dimension; i++) {
      sumSq += rawVector[i] * rawVector[i];
    }
    const norm = Math.sqrt(sumSq) || 1;

    // Normalize to unit sphere for accurate cosine similarity
    const normalized: number[] = new Array(dimension);
    for (let i = 0; i < dimension; i++) {
      normalized[i] = parseFloat((rawVector[i] / norm).toFixed(6));
    }

    return normalized;
  }
}
